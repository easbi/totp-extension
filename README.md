# 🔑 TOTP Authenticator Browser Extension (Chrome & Edge)

[🇮🇩 Bahasa Indonesia](#-bahasa-indonesia) | [🇬🇧 English](#-english)

---

## 🇮🇩 Bahasa Indonesia

Ekstensi browser berbasis **Manifest V3** yang kompatibel penuh dengan **Google Chrome** dan **Microsoft Edge** untuk menghasilkan kode otentikasi dua faktor (2FA / TOTP) secara *real-time*. Dilengkapi dengan arsitektur **Encrypted Vault (AES-256-GCM)** di tingkat penyimpanan lokal, proteksi PIN keamanan, fitur salin otomatis, animasi timer lingkaran, durasi kunci otomatis, serta enkripsi backup.

![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)
![Chrome & Edge Supported](https://img.shields.io/badge/Browser-Chrome%20%7C%20Edge-brightgreen.svg)
![Encryption](https://img.shields.io/badge/Storage-AES--256--GCM-green.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

### 🛡️ Arsitektur Keamanan & Privasi (Privacy by Design)

Ekstensi ini dirancang dengan standar keamanan tinggi untuk memastikan data sensitif 2FA Anda aman dari kebocoran:

1. **Penyimpanan Lokal Terenkripsi (At-Rest Encrypted Vault):**
   * Data *Secret Key* **TIDAK PERNAH** disimpan dalam bentuk teks biasa (*plain text*) di dalam `chrome.storage.local`.
   * Seluruh data akun dienkripsi ketat menggunakan algoritma **AES-GCM 256-bit** dengan kunci rahasia (*Master Key*) yang diturunkan dari PIN pengguna via **PBKDF2 (100.000 iterasi SHA-256)**.
2. **Dekripsi Hanya di Memori (In-Memory Decryption Only):**
   * Data rahasia (*decrypted secrets*) hanya berada di memori RAM selama sesi ekstensi terbuka (*unlocked*).
   * Saat timeout tercapai atau tombol **"🔒 Kunci"** ditekan, data rahasia dan kunci dekripsi langsung **dihapus total dari RAM**.
3. **PIN Tidak Disimpan Mentah:**
   * PIN pengguna tidak pernah disimpan di media penyimpanan. Verifikasi PIN menggunakan skema verifier terenkripsi.
4. **100% Pemrosesan Lokal (Offline Only & Zero Telemetry):**
   * Ekstensi ini berjalan sepenuhnya secara *offline*. Tidak ada server backend, tidak ada pelacak analitik, dan tidak ada data yang dikirim ke internet.
5. **Backup Terenkripsi AES-256:**
   * File ekspor `.json` dienkripsi terpisah menggunakan PIN berbasis PBKDF2 + AES-GCM 256-bit.

---

### ⚠️ Catatan Keamanan Penting (Security Notice)

> **PERHATIAN:** Keamanan akun dan data 2FA yang tersimpan adalah **tanggung jawab masing-masing pengguna**.

Untuk menjaga keamanan tingkat maksimal, sangat disarankan untuk menerapkan langkah-langkah berikut:
1. **Gunakan Browser Secara Private & Aman:** Pastikan perangkat atau komputer yang Anda gunakan bebas dari *malware*, *keylogger*, atau akses pihak ketiga yang tidak sah.
2. **Kunci Akses Browser:** Amankan browser Anda dengan fitur kunci profil (*Profile Lock*), PIN OS/Perangkat, atau menggunakan ekstensi pengunci browser (*Browser Lock Extension*).
3. **Manfaatkan Fitur Auto-Lock:** Selalu setel durasi kunci otomatis (*Auto-Lock Timeout*) di dalam ekstensi ini atau tekan tombol **"🔒 Kunci"** saat meninggalkan komputer.
4. **Simpan Backup Terenkripsi di Tempat Aman:** Simpan file `.json` hasil *Export* di media penyimpanan terpisah yang terenkripsi dan jangan bagikan PIN backup Anda kepada siapa pun.

---

### 📥 1. Panduan Mengunduh & Ekstrak Repositori

1. **Buka Halaman GitHub:** Akses halaman utama repositori proyek ini di browser Anda.
2. **Unduh File ZIP:** Klik tombol hijau **`<> Code`** di pojok kanan atas, lalu pilih **`Download ZIP`**.
3. **Ekstrak Folder:**
   * Buka folder `Downloads` di komputer Anda, klik kanan pada file `totp-extension-main.zip`, lalu pilih **Extract All...** (atau *Extract Here* jika menggunakan WinRAR/7-Zip).
   * Pindahkan folder hasil ekstraksi ke lokasi yang aman di PC Anda agar tidak sengaja terhapus (contoh: `C:\xampp\htdocs\totp-extension` atau `D:\Project\totp-extension`).

---

### 🛠️ 2. Cara Instalasi di Browser

#### 🔴 Di Google Chrome:
1. Buka browser **Google Chrome**.
2. Ketik `chrome://extensions/` pada baris alamat (address bar) lalu tekan **Enter**.
3. Aktifkan *toggle* **Developer mode** (Mode Pengembang) di pojok kanan atas layar.
4. Klik tombol **Load unpacked** (Muat yang belum dikemas) di pojok kiri atas.
5. Pilih folder proyek `totp-extension` yang telah diekstrak tadi.
6. Klik ikon **Ekstensi (Puzzle)** di toolbar Chrome, lalu klik ikon **Pin** agar ekstensi tetap terlihat.

#### 🔵 Di Microsoft Edge:
1. Buka browser **Microsoft Edge**.
2. Ketik `edge://extensions/` pada baris alamat (address bar) lalu tekan **Enter**.
3. Aktifkan *toggle* **Developer mode** di panel sebelah kiri bawah.
4. Klik tombol **Load unpacked** di bagian atas layar.
5. Pilih folder proyek `totp-extension` yang telah diekstrak tadi.
6. Klik ikon **Ekstensi (Puzzle)** di toolbar Edge, lalu klik ikon **Mata (Show in toolbar)**.

---

### 🚀 3. Fitur Utama & Penggunaan

Saat pertama kali mengeklik ekstensi, Anda akan diminta untuk **Membuat PIN Baru (4-8 Digit)**.

- 🔐 **Proteksi PIN & Encrypted Vault:** Mengunci dan mengenkripsi seluruh data TOTP di penyimpanan lokal.
- ⏱️ **Kunci Otomatis Kustom (Auto-Lock Timeout):** Pengaturan durasi mengunci kembali ekstensi (Setiap dibuka, 1m, 5m, 10m, 1h) serta tombol **"🔒 Kunci"** instan di header.
- ⏳ **Visual Circular Countdown Timer:** Animasi timer SVG melingkar ala Google Authenticator di sebelah kode 6-digit yang menyusut secara *real-time* dan berubah merah saat sisa 5 detik.
- ⚡ **Generator Kode Real-Time:** Menghasilkan 6 digit kode TOTP setiap 30 detik menggunakan Web Crypto API lokal.
- 📋 **Salin Satu Klik:** Tombol salin instan untuk menempelkan kode langsung ke *clipboard*.

---

### 📖 4. Panduan Detail Penggunaan 3 Tombol Utama

#### 1. ➕ Tambah Manual
Gunakan tombol ini untuk menambahkan akun 2FA secara satu per satu menggunakan teks kunci rahasia (*Base32 Secret Key*).

* **Cara Mendapatkan Secret Key dari Website:**
  1. Buka halaman pengaturan keamanan di website yang ingin diamankan (misal: *Google Account > Security > 2-Step Verification* atau *GitHub > Password & Authentication*).
  2. Pilih opsi **Set up Authenticator app**.
  3. Saat gambar **QR Code** muncul di layar, cari dan klik tautan bertuliskan **"Can't scan it?"**, **"Can't scan QR code?"**, atau **"Show Secret Key"**.
  4. Salin (*copy*) deretan teks rahasia Base32 yang tampil (contoh kombinasi huruf dan angka: `JBSWY3DPEHPK3PXP`).

* **Cara Memasukkan ke Ekstensi:**
  1. Klik tombol **➕ Tambah Manual** di ekstensi.
  2. Masukkan nama akun (contoh: `user@gmail.com`).
  3. Tempelkan (*paste*) **Secret Key Base32** yang telah disalin dari website.
  4. Masukkan nama penyedia service (contoh: `Google` atau `GitHub`).
  5. Klik **OK**.

---

#### 2. 📥 Import Data
Gunakan tombol ini untuk memindahkan banyak akun sekaligus tanpa mengetik satu per satu.

* **Modus 1 (Impor dari Google Authenticator HP via Transfer Accounts):**
  1. Buka aplikasi **Google Authenticator** di HP Anda.
  2. Ketuk ikon menu (garis/titik tiga di pojok atas) > pilih **Transfer accounts** > pilih **Export accounts**.
  3. Verifikasi keamanan HP (PIN/Biometrik), lalu **centang akun mana saja** yang ingin dipindahkan ke ekstensi. Klik **Next**.
  4. Aplikasi HP akan menampilkan sebuah **QR Code**. Pindai QR Code tersebut menggunakan perangkat lain atau alat pemindai QR (*QR Code Scanner*) untuk mendapatkan string teks URL.
  5. Salin teks string URL yang didapat (selalu berawalan `otpauth-migration://offline?data=...`).
  6. Buka ekstensi di browser > klik **📥 Import Data** > pilih angka **`1`** > tempelkan (*paste*) URL migrasi tersebut.

* **Modus 2 (File Backup JSON Terenkripsi):**
  1. Klik **📥 Import Data** di ekstensi > pilih angka **`2`**.
  2. Pilih file `.json` hasil ekspor terenkripsi dari ekstensi ini di komputer/browser lain.
  3. Masukkan PIN yang digunakan saat meng-ekspor file tersebut untuk mendekripsi data.

---

#### 3. 📤 Export JSON
Gunakan tombol ini untuk membuat cadangan (*backup*) seluruh akun 2FA yang tersimpan ke dalam file `.json` terenkripsi **AES-GCM 256-bit**.

* **Kapan digunakan:** Saat ingin mencadangkan data, berpindah komputer, atau menginstal ulang browser.
* **Cara pakai:**
  1. Klik tombol **📤 Export JSON**.
  2. Masukkan PIN keamanan Anda untuk konfirmasi dan pengenkripsian data.
  3. File `totp_encrypted_backup_xxx.json` akan otomatis terunduh ke komputer Anda. Simpan file ini di tempat yang aman.

---

## 🇬🇧 English

A lightweight **Manifest V3** browser extension fully compatible with **Google Chrome** and **Microsoft Edge** for generating real-time two-factor authentication (2FA / TOTP) codes. Built with an **AES-256-GCM Encrypted Vault** architecture.

---

### 🛡️ Security Architecture & Privacy (Privacy by Design)

1. **At-Rest Encrypted Vault:** All secret keys stored in `chrome.storage.local` are encrypted with **AES-GCM 256-bit** derived via **PBKDF2 (100,000 iterations)**. Secrets are never saved as plain text.
2. **In-Memory Decryption Only:** Decrypted secrets reside in RAM only while the extension is unlocked. Locking the app clears sensitive data from memory immediately.
3. **100% Local & Offline:** No remote servers, no tracking, zero telemetry.
4. **Encrypted Backups:** Exported `.json` files are protected using PIN-derived AES-256-GCM encryption.

---

### ⚠️ Important Security Notice

> **DISCLAIMER:** Account security and the safety of stored 2FA credentials are **the sole responsibility of each individual user**.

To maintain maximum security:
1. Ensure your browser and device are secure, private, and free from malware or keyloggers.
2. Lock your browser or OS session (via Profile Lock, OS PIN, or Browser Lock Extensions) when unattended.
3. Utilize the Auto-Lock feature within the extension and click **"🔒 Lock"** whenever you step away.
4. Store exported encrypted backup files securely and never share your PIN.

---

## 📂 Project Structure / Struktur Proyek

```text
totp-extension/
├── manifest.json            # Manifest V3 extension configuration
├── popup.html               # Popup UI layout
├── popup.js                 # Event listeners, Encrypted Vault, PBKDF2 logic, and rendering
├── popup.css                # Styling for popup interface, SVG timer, and layout
├── icon.png                 # Extension logo
├── .gitignore               # Ignored files for Git
└── lib/
    ├── base32.js            # Base32 string decoder
    ├── jsotp.min.js         # HMAC-SHA1 TOTP calculation engine
    └── google-auth-parser.js # Google Auth Protobuf migration URL parser