// ==========================================
// PUSAT LOGIKA APLIKASI PERSURATAN UINAM
// ==========================================

const daftarSuratMap = {
    'rekomendasi-fakultas': 'Surat Rekomendasi Fakultas',
    'keterangan-lulus': 'Surat Keterangan Lulus',
    'tidak-menerima-beasiswa': 'Surat Keterangan Tidak Menerima Beasiswa',
    'berkelakuan-baik': 'Surat Berkelakuan Baik',
    'masih-kuliah': 'Surat Keterangan Masih Kuliah',
    'cuti-akademik': 'Surat Keterangan Cuti Akademik',
    'aktif-kembali': 'Surat Aktif Kembali Pasca Cuti',
    'keterangan-alumni': 'Surat Keterangan Alumni',
    'penelitian-skripsi': 'Surat Keterangan dalam Proses Penelitian untuk Penyelesaian Skripsi',
    'tunjangan-anak-pegawai': 'Surat Aktif Kuliah Untuk Tunjangan Anak Pegawai',
    'surat-observasi': 'Surat Observasi',
    'kehilangan-spp': 'Surat Keterangan Kehilangan SPP'
};

document.addEventListener('DOMContentLoaded', function() {
    // 1. Logika untuk Halaman Login (index.html)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const usernameInput = document.getElementById('usernameInput').value.trim();
            sessionStorage.setItem('namaMahasiswa', usernameInput || 'John Doe');
            window.location.href = 'dashboard.html';
        });
    }

    // 2. Logika untuk Halaman Dasbor (dashboard.html)
    const displayNama = document.getElementById('displayNamaMahasiswa');
    if (displayNama) {
        const savedName = sessionStorage.getItem('namaMahasiswa');
        if (savedName) {
            displayNama.textContent = savedName.toUpperCase();
        }
    }

    // 3. Logika Navigasi Breadcrumb Dinamis
    const urlParams = new URLSearchParams(window.location.search);
    const kodeDariUrl = urlParams.get('jenis');
    const currentPath = window.location.pathname;

    if (kodeDariUrl && daftarSuratMap[kodeDariUrl]) {
        sessionStorage.setItem('suratTerpilih', kodeDariUrl);
    }

    const kodeAktif = kodeDariUrl || sessionStorage.getItem('suratTerpilih') || 'rekomendasi-fakultas';
    const namaSuratAktif = daftarSuratMap[kodeAktif];

    const breadcrumbContainer = document.getElementById('dynamicBreadcrumb');
    if (breadcrumbContainer) {
        if (currentPath.includes('dashboard.html') || currentPath.endsWith('/')) {
            sessionStorage.removeItem('suratTerpilih');
            breadcrumbContainer.innerHTML = `<span class="breadcrumbCurrent">Halaman Utama</span>`;
        } else if (currentPath.includes('pengantar-surat.html')) {
            breadcrumbContainer.innerHTML = `
                <a href="dashboard.html" class="breadcrumbLink">Halaman Utama</a>
                <span class="breadcrumbSeparator">/</span>
                <span class="breadcrumbCurrent">${namaSuratAktif}</span>
            `;
        } else if (currentPath.includes('ajukan-surat.html')) {
            breadcrumbContainer.innerHTML = `
                <a href="dashboard.html" class="breadcrumbLink">Halaman Utama</a>
                <span class="breadcrumbSeparator">/</span>
                <a href="pengantar-surat.html?jenis=${kodeAktif}" class="breadcrumbLink">${namaSuratAktif}</a>
                <span class="breadcrumbSeparator">/</span>
                <span class="breadcrumbCurrent">Ajukan Surat</span>
            `;
        }
    }

    // 4. Logika Khusus Halaman Pengantar & Persyaratan (pengantar-surat.html)
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle && currentPath.includes('pengantar-surat.html')) {
        pageTitle.textContent = 'Pengurusan ' + namaSuratAktif;
        const subDesc = document.getElementById('subDescription');
        if (subDesc) {
            subDesc.textContent = 'Berikut ini adalah tautan/link untuk proses pengajuan ' + namaSuratAktif + ' Fak. Sains & Teknologi UINAM.';
        }
        const btnAjukan = document.getElementById('btnAjukan');
        if (btnAjukan) {
            btnAjukan.textContent = 'Buat ' + namaSuratAktif;
            btnAjukan.href = 'ajukan-surat.html?jenis=' + kodeAktif;
        }
    }

    // ==========================================
    // 5. Logika Khusus Halaman Formulir Pengajuan (ajukan-surat.html)
    // <--- POSISI KODE YANG KAMU MAKSUD ADA DI SINI DI DALAM FILE app.js --->
    // ==========================================
    const pengajuanForm = document.getElementById('pengajuanForm');
    if (pengajuanForm) {
        const formTitle = document.getElementById('formPageTitle');
        if (formTitle) formTitle.textContent = 'Pengurusan ' + namaSuratAktif;

        const formSubDesc = document.getElementById('formSubDescription');
        if (formSubDesc) formSubDesc.textContent = 'Silahkan isi form di bawah untuk melakukan pengurusan ' + namaSuratAktif;

        // Jika nama mahasiswa sudah dimasukkan saat login, masukkan ke input nama
        const namaInput = document.getElementById('namaInput');
        if (namaInput) {
            const savedName = sessionStorage.getItem('namaMahasiswa');
            if (savedName && savedName !== 'John Doe') {
                namaInput.value = savedName;
            }
        }

        // Set tanggal permohonan otomatis ke hari ini
        const tanggalInput = document.getElementById('tanggalInput');
        if (tanggalInput) {
            tanggalInput.value = new Date().toISOString().split('T')[0];
        }

        // Validasi file lampiran PDF (maksimal 2MB)
        const lampiranInput = document.getElementById('lampiranInput');
        const fileError = document.getElementById('fileError');
        if (lampiranInput && fileError) {
            lampiranInput.addEventListener('change', function() {
                fileError.textContent = '';
                const file = this.files[0];
                if (file) {
                    const maxSizeBytes = 2 * 1024 * 1024; // 2 MB
                    if (file.type !== 'application/pdf') {
                        fileError.textContent = 'Format berkas harus berupa PDF.';
                        this.value = '';
                    } else if (file.size > maxSizeBytes) {
                        fileError.textContent = 'Ukuran berkas melebihi batas maksimal 2MB.';
                        this.value = '';
                    }
                }
            });
        }

        // Aksi ketika tombol Kirim ditekan
        pengajuanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Permohonan ' + namaSuratAktif + ' berhasil dikirim!');
            window.location.href = 'dashboard.html';
        });
    }
});