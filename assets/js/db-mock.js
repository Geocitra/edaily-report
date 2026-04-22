/**
 * ==========================================================================
 * E-DAILY REPORT - ENGINE DATABASE IN-MEMORY (VERSI KORPORAT)
 * Arsitektur: Pola Singleton dengan LocalStorage
 * Domain: Manajemen Kinerja Perusahaan (Direksi, Manajer, Pegawai, Admin)
 * ==========================================================================
 */

const MockDB = {
    DB_KEY: 'edaily_pamjaya_db_v3',

    seedData: {
        // 1. STRUKTUR ORGANISASI
        departments: [
            { id: "D-DIR", name: "Jajaran Direksi (Executive Board)" },
            { id: "D-TI", name: "Teknologi Informasi & Digital" },
            { id: "D-PEM", name: "Pemasaran & Pengembangan Bisnis" },
            { id: "D-KEU", name: "Keuangan & Audit Internal" },
            { id: "D-OPS", name: "Operasional & Distribusi" },
            { id: "D-SDM", name: "Sumber Daya Manusia & Umum" }
        ],

        // 2. HIERARKI PEGAWAI (Direksi -> Manajer -> Pegawai)
        users: [
            // JAJARAN DIREKSI
            { id: "EMP-001", username: "dirut", name: "Jonathan Kusuma", role: "DIREKSI", dept_id: "D-DIR", manager_id: null, title: "Direktur Utama" },
            { id: "EMP-002", username: "dir.tek", name: "Sarah Widiastuti", role: "DIREKSI", dept_id: "D-DIR", manager_id: null, title: "Direktur Teknik" },
            { id: "EMP-003", username: "dir.keu", name: "Marcus Thorne", role: "DIREKSI", dept_id: "D-DIR", manager_id: null, title: "Direktur Keuangan" },

            // MANAJER DEPARTEMEN
            { id: "MGR-001", username: "mgr.ti", name: "Reza Mahendra", role: "MANAGER", dept_id: "D-TI", manager_id: "EMP-002", title: "Manajer Teknologi Informasi" },
            { id: "MGR-002", username: "mgr.pem", name: "Anita Salim", role: "MANAGER", dept_id: "D-PEM", manager_id: "EMP-001", title: "Manajer Pemasaran" },
            { id: "MGR-003", username: "mgr.ops", name: "David Chen", role: "MANAGER", dept_id: "D-OPS", manager_id: "EMP-001", title: "Manajer Operasional" },
            { id: "MGR-004", username: "mgr.keu", name: "Linda Wahyuni", role: "MANAGER", dept_id: "D-KEU", manager_id: "EMP-003", title: "Manajer Keuangan Korporat" },

            // PEGAWAI / ASSOCIATES
            // Tim TI
            { id: "EMP-101", username: "dev.back", name: "Naufal Fadlillah", role: "EMPLOYEE", dept_id: "D-TI", manager_id: "MGR-001", title: "Senior Cloud Architect" },
            { id: "EMP-102", username: "dev.front", name: "Kevin Sanjaya", role: "EMPLOYEE", dept_id: "D-TI", manager_id: "MGR-001", title: "Frontend Developer" },

            // Tim Pemasaran & Lapangan
            { id: "EMP-201", username: "sales.b2b", name: "Bambang Pamungkas", role: "EMPLOYEE", dept_id: "D-PEM", manager_id: "MGR-002", title: "Account Manager Wilayah" },
            { id: "EMP-202", username: "sales.ritel", name: "Chika Monica", role: "EMPLOYEE", dept_id: "D-PEM", manager_id: "MGR-002", title: "Koordinator Kemitraan Ritel" },

            // Tim Operasional
            { id: "EMP-301", username: "ops.logistik", name: "Budi Utomo", role: "EMPLOYEE", dept_id: "D-OPS", manager_id: "MGR-003", title: "Staf Logistik Utama" },
            { id: "EMP-302", username: "ops.lapangan", name: "Eko Prasetyo", role: "EMPLOYEE", dept_id: "D-OPS", manager_id: "MGR-003", title: "Teknisi Lapangan Senior" },

            // ADMINISTRATOR SISTEM
            { id: "SYS-ADMIN", username: "admin", name: "Admin Pusat", role: "ADMIN", dept_id: null, manager_id: null, title: "Infrastruktur & Keamanan TI" }
        ],

        // 3. TARGET STRATEGIS (KPI)
        kpis: [
            // Target Strategis TI
            { id: "KPI-TI-2026-01", user_id: "EMP-101", year: 2026, objective: "Migrasi Infrastruktur Monolith ke AWS Microservices", target_hours: 480 },
            { id: "KPI-TI-2026-02", user_id: "EMP-102", year: 2026, objective: "Implementasi Sistem Desain v2.0 pada Portal Web", target_hours: 320 },

            // Target Strategis Pemasaran
            { id: "KPI-PEM-2026-01", user_id: "EMP-201", year: 2026, objective: "Ekspansi Mitra B2B di Wilayah Jawa Barat", target_hours: 500 },
            { id: "KPI-PEM-2026-02", user_id: "EMP-202", year: 2026, objective: "Akuisisi 50 Mitra Ritel Baru di Area Jakarta", target_hours: 400 },

            // Target Operasional
            { id: "KPI-OPS-2026-01", user_id: "EMP-302", year: 2026, objective: "Pemeliharaan Rutin & Uptime Infrastruktur Vital (99.9%)", target_hours: 450 }
        ],

        // 4. LAPORAN AKTIVITAS (Scenario Operasional)
        timesheets: [
            // KASUS 1: Kerja Normal di Kantor (Office-Based)
            {
                id: "TS-2026-001", user_id: "EMP-101", kpi_id: "KPI-TI-2026-01",
                activity: "Merancang skema API Gateway untuk komunikasi antar layanan Microservices.",
                location_mode: "OFFICE", lat: -6.2258, lng: 106.8121,
                minutes: 480, status: "APPROVED", date: "2026-04-10T08:30:00",
                feedback: "Rencana arsitektur sangat detail. Lanjutkan ke tahap testing."
            },

            // KASUS 2: Kerja Jarak Jauh (WFA/WFH)
            {
                id: "TS-2026-002", user_id: "EMP-102", kpi_id: "KPI-TI-2026-02",
                activity: "Sesi koding mandiri: Integrasi komponen UI React dengan state management Redux.",
                location_mode: "REMOTE", lat: -6.3621, lng: 106.8249,
                minutes: 420, status: "APPROVED", date: "2026-04-10T09:00:00",
                feedback: "Komponen UI terlihat konsisten dengan panduan desain."
            },

            // KASUS 3: Kunjungan Lapangan / Lokasi Mitra (Tervalidasi GPS)
            {
                id: "TS-2026-003", user_id: "EMP-201", kpi_id: "KPI-PEM-2026-01",
                activity: "Presentasi penawaran B2B di Kantor Pusat PT. Astra International.",
                location_mode: "CLIENT_SITE", lat: -6.2146, lng: 106.8214,
                minutes: 240, status: "APPROVED", date: "2026-04-11T10:00:00",
                feedback: "Respon klien positif. Segera siapkan draf nota kesepahaman (MoU)."
            },

            // KASUS 4: REJECTED (Anomali Lokasi - Ketidaksesuaian GPS)
            {
                id: "TS-2026-004", user_id: "EMP-202", kpi_id: "KPI-PEM-2026-02",
                activity: "Prospek mitra ritel baru di area Jakarta Pusat (CBD).",
                location_mode: "CLIENT_SITE", lat: -6.9147, lng: 107.6098, // Koordinat di Bandung (Tidak sesuai area tugas)
                minutes: 360, status: "REJECTED", date: "2026-04-12T11:00:00",
                feedback: "REJECTED: Koordinat GPS menunjukkan Anda berada di Bandung, sedangkan tugas Anda terjadwal di Jakarta Pusat. Mohon klarifikasi."
            },

            // KASUS 5: PENDING (Klaim Lembur Besar - Butuh Tinjauan Direksi)
            {
                id: "TS-2026-005", user_id: "EMP-302", kpi_id: "KPI-OPS-2026-01",
                activity: "Perbaikan darurat pipa distribusi utama akibat gangguan teknis mendadak.",
                location_mode: "CLIENT_SITE", lat: -6.1754, lng: 106.8272,
                minutes: 720, status: "PENDING", date: "2026-04-13T18:00:00",
                feedback: ""
            },

            // KASUS 6: Aktivitas Manajerial (Kinerja Manajer)
            {
                id: "TS-2026-006", user_id: "MGR-001", kpi_id: null,
                activity: "Melakukan penilaian kinerja kuartal bagi seluruh staf tim Teknik.",
                location_mode: "OFFICE", lat: -6.2258, lng: 106.8121,
                minutes: 180, status: "APPROVED", date: "2026-04-14T14:00:00",
                feedback: "Proses penilaian selesai tepat waktu."
            },

            // KASUS 7: REJECTED (Deskripsi Tidak Jelas)
            {
                id: "TS-2026-007", user_id: "EMP-103", kpi_id: null,
                activity: "Mengerjakan tugas harian biasa.",
                location_mode: "REMOTE", lat: -6.2000, lng: 106.8000,
                minutes: 480, status: "REJECTED", date: "2026-04-14T08:00:00",
                feedback: "Deskripsi terlalu umum. Mohon rincikan modul atau fitur apa yang dikerjakan."
            }
        ],

        // 5. PENGUMUMAN KORPORAT
        announcements: [
            {
                id: "MSG-101", sender_id: "EMP-001", target_dept: "ALL", type: "URGENT",
                title: "Batas Akhir Pelaporan KPI - Siklus Kuartal 2",
                message: "Kepada seluruh jajaran, mohon segera melengkapi laporan kinerja Q2 paling lambat Jumat ini. Ketepatan data akan memengaruhi kalkulasi bonus tahunan.",
                date: "2026-04-15T08:00:00"
            },
            {
                id: "MSG-102", sender_id: "EMP-002", target_dept: "D-TI", type: "INFO",
                title: "Pembaruan Keamanan: Autentikasi Multi-Faktor",
                message: "Tim Teknik wajib mengaktifkan MFA pada VPN internal mulai besok. Akses ke server staging akan dibatasi mulai hari Sabtu bagi yang belum aktif.",
                date: "2026-04-16T10:30:00"
            }
        ],

        // 6. JEJAK AUDIT SISTEM (Audit Log)
        system_logs: [
            { id: "L-001", user_id: "SYS-ADMIN", action: "USER_ONBOARD", desc: "Pendaftaran akun Direktur Keuangan Marcus Thorne ke dalam sistem.", timestamp: "2026-04-01T09:00:00" },
            { id: "L-002", user_id: "MGR-002", action: "TS_REJECT", desc: "Menolak laporan TS-2026-004 karena kegagalan validasi spasial (Bandung/Jakarta).", timestamp: "2026-04-12T17:45:00" },
            { id: "L-003", user_id: "SYS-ADMIN", action: "KPI_ASSIGN", desc: "Menugaskan target strategis baru untuk wilayah Jawa Barat kepada EMP-201.", timestamp: "2026-04-14T11:20:00" }
        ]
    },

    // ======================================================================
    // METODE INTI (Logika Aplikasi)
    // ======================================================================
    init() {
        if (!localStorage.getItem(this.DB_KEY)) {
            console.info("[E-Daily] Menginisialisasi Lingkungan Data Korporat...");
            localStorage.setItem(this.DB_KEY, JSON.stringify(this.seedData));
        }
    },

    _getData() { return JSON.parse(localStorage.getItem(this.DB_KEY)); },
    _saveData(data) { localStorage.setItem(this.DB_KEY, JSON.stringify(data)); },

    // --- Manajemen Sumber Daya ---
    getUsers() { return this._getData().users; },
    getUserById(id) { return this._getData().users.find(u => u.id === id); },
    getSubordinates(managerId) { return this._getData().users.filter(u => u.manager_id === managerId); },

    // --- Mesin Laporan Harian (Timesheet) ---
    getTimesheets() { return this._getData().timesheets; },

    getTimesheetsByUser(userId) {
        return this.getTimesheets()
            .filter(t => t.user_id === userId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    getPendingApprovals(managerId) {
        const teamIds = this.getSubordinates(managerId).map(b => b.id);
        return this.getTimesheets().filter(t => teamIds.includes(t.user_id) && t.status === "PENDING");
    },

    submitTimesheet(data) {
        const db = this._getData();
        const newLog = {
            id: "TS-" + Date.now(),
            status: "PENDING",
            date: new Date().toISOString(),
            feedback: "",
            ...data
        };
        db.timesheets.push(newLog);
        this._saveData(db);
        this.insertLog(data.user_id, "SUBMIT_TS", `Mengirim laporan aktivitas baru untuk divalidasi manajer.`);
        return newLog;
    },

    processApproval(timesheetId, managerId, status, feedback = "") {
        const db = this._getData();
        const idx = db.timesheets.findIndex(t => t.id === timesheetId);
        if (idx > -1) {
            db.timesheets[idx].status = status;
            db.timesheets[idx].feedback = feedback;
            this._saveData(db);
            const actionLabel = status === "APPROVED" ? "TS_APPROVE" : "TS_REJECT";
            this.insertLog(managerId, actionLabel, `Memproses validasi laporan ${timesheetId} dengan status ${status}.`);
        }
    },

    // --- Analitik Performa (Dashboard) ---
    calculateTeamPerformance(managerId) {
        const team = this.getSubordinates(managerId);
        const allLogs = this.getTimesheets();

        return team.map(emp => {
            const approvedLogs = allLogs.filter(l => l.user_id === emp.id && l.status === "APPROVED");
            const totalMinutes = approvedLogs.reduce((sum, l) => sum + parseInt(l.minutes), 0);
            const totalHours = (totalMinutes / 60).toFixed(1);

            // Standar Norma Korporat: 160 jam per bulan
            const targetHours = 160;
            const utilizationScore = Math.min(100, (totalHours / targetHours) * 100).toFixed(1);

            return {
                user_id: emp.id,
                name: emp.name,
                title: emp.title,
                logged_hours: totalHours,
                performance_score: parseFloat(utilizationScore)
            };
        });
    },

    getCompanyAggregate() {
        const logs = this.getTimesheets();
        return {
            total: logs.length,
            approved: logs.filter(l => l.status === "APPROVED").length,
            rejected: logs.filter(l => l.status === "REJECTED").length,
            pending: logs.filter(l => l.status === "PENDING").length
        };
    },

    // --- Tata Kelola & Audit ---
    getSystemLogs() {
        return this._getData().system_logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    insertLog(userId, action, desc) {
        const db = this._getData();
        const user = db.users.find(u => u.id === userId);
        db.system_logs.push({
            id: "LOG-" + Date.now(),
            user_id: userId,
            actor: user ? user.name : 'Inti Sistem',
            action: action,
            desc: desc,
            timestamp: new Date().toISOString()
        });
        this._saveData(db);
    }
};

// Inisialisasi Mesin Data saat dimuat
MockDB.init();