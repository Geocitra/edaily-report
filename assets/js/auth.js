/**
 * ==========================================================================
 * PROLOG EPMS - SECURITY & AUTHENTICATION ENGINE
 * Role-Based Access Control (RBAC) Simulator using LocalStorage
 * Corporate Edition
 * ==========================================================================
 */

const AuthEngine = {
    // Key unik untuk membedakan sesi dari aplikasi pemerintahan sebelumnya
    SESSION_KEY: 'prolog_corporate_session',

    /**
     * 1. Fungsi Login Eksekutif
     */
    login: function (userObject) {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(userObject));

        // Panggil tracker log jika db-mock sudah dimuat
        if (typeof MockDB !== 'undefined') {
            MockDB.insertLog(userObject.id, 'LOGIN', `${userObject.name} logged into the enterprise system.`);
        }

        // Corporate Routing Engine
        let targetFolder = '';
        switch (userObject.role) {
            case 'ADMIN': targetFolder = 'admin/'; break;
            case 'DIREKSI': targetFolder = 'direksi/'; break;
            case 'MANAGER': targetFolder = 'manager/'; break;
            case 'EMPLOYEE': targetFolder = 'employee/'; break;
            default:
                alert("System Error: Role clearance is not recognized!");
                return;
        }

        window.location.href = targetFolder + 'dashboard.html';
    },

    /**
     * 2. Fungsi Logout & Session Destroyer
     */
    logout: function () {
        const user = this.getCurrentUser();
        if (user && typeof MockDB !== 'undefined') {
            MockDB.insertLog(user.id, 'LOGOUT', `${user.name} logged out securely.`);
        }

        localStorage.removeItem(this.SESSION_KEY);

        // Kalkulasi letak index.html berdasarkan kedalaman direktori saat ini
        const inSubFolder = window.location.pathname.split('/').length > 2;
        window.location.href = inSubFolder ? '../login.html' : 'login.html';
    },

    /**
     * 3. Session Getter
     */
    getCurrentUser: function () {
        const data = localStorage.getItem(this.SESSION_KEY);
        return data ? JSON.parse(data) : null;
    },

    /**
     * 4. Enterprise Route Guard (MIDDLEWARE)
     * Mengamankan folder (C-Level, Manager, dsb) dari akses bypass URL.
     */
    guardRoute: function () {
        const currentPath = window.location.pathname.toLowerCase();
        const user = this.getCurrentUser();

        // Cek jika tidak ada sesi aktif (belum login)
        if (!user) {
            if (!currentPath.endsWith('login.html') && !currentPath.endsWith('/')) {
                console.warn('Unauthorized access block. Redirecting to corporate portal.');
                const inSubFolder = currentPath.includes('/admin/') || currentPath.includes('/direksi/') || currentPath.includes('/manager/') || currentPath.includes('/employee/');
                window.location.href = inSubFolder ? '../login.html' : 'login.html';
            }
            return; // Hentikan script jika sedang berada di halaman login
        }

        // --- Aturan Isolasi Folder Berdasarkan Jabatan (RBAC) ---
        let isAuthorized = true;
        if (currentPath.includes('/admin/') && user.role !== 'ADMIN') isAuthorized = false;
        if (currentPath.includes('/direksi/') && user.role !== 'DIREKSI') isAuthorized = false;
        if (currentPath.includes('/manager/') && user.role !== 'MANAGER') isAuthorized = false;
        if (currentPath.includes('/employee/') && user.role !== 'EMPLOYEE') isAuthorized = false;

        // Tendang keluar jika melakukan bypass
        if (!isAuthorized) {
            alert(`Security Breach: Otoritas [${user.role}] Anda tidak memiliki akses ke departemen ini.`);
            this.logout();
        }

        // --- Injeksi Data User ke UI Dashboard secara Otomatis ---
        document.addEventListener("DOMContentLoaded", () => {
            const userNameEl = document.getElementById('session-user-name');
            const userRoleEl = document.getElementById('session-user-role');
            const userInitialsEl = document.getElementById('session-user-initials'); // Tambahan untuk avatar

            if (userNameEl) userNameEl.innerText = user.name;

            if (userRoleEl) {
                // Formatting role untuk tampilan UI agar terlihat elegan
                let displayRole = user.role;
                if (user.role === 'DIREKSI') displayRole = 'Executive Board (C-Level)';
                if (user.role === 'MANAGER') displayRole = 'Department Manager';
                if (user.role === 'EMPLOYEE') displayRole = 'Associate / Specialist';
                if (user.role === 'ADMIN') displayRole = 'System Administrator';
                userRoleEl.innerText = displayRole;
            }

            // Generate Inisial Avatar (Misal: "Budi Santoso" -> "BS")
            if (userInitialsEl && user.name) {
                const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                userInitialsEl.innerText = initials;
            }
        });
    }
};

// AUTO-EXECUTE: Segel halaman seketika saat JS ini dimuat.
AuthEngine.guardRoute();