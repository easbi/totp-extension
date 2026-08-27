# 🔑 TOTP Authenticator Browser Extension

[🇮🇩 Bahasa Indonesia](#-bahasa-indonesia) | [🇬🇧 English](#-english)

---

## 🇮🇩 Bahasa Indonesia

Ekstensi browser berbasis **Manifest V3** untuk menghasilkan kode otentikasi dua faktor (2FA / TOTP) secara *real-time* langsung dari browser Anda. Dilengkapi dengan proteksi PIN keamanan, fitur salin otomatis, serta dukungan impor/ekspor data dari Google Authenticator.

![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

### 🚀 Fitur Utama

- 🔐 **Proteksi PIN Akses:** Mengunci daftar kode TOTP serta mengamankan tindakan sensitif (penghapusan akun & ekspor data).
- ⚡ **Generator Kode Real-Time:** Menghasilkan 6 digit kode TOTP setiap 30 detik menggunakan Web Crypto API lokal.
- 📋 **Salin Satu Klik:** Tombol salin instan untuk menempelkan kode langsung ke *clipboard*.
- 🔄 **Impor Google Authenticator:** Mendukung parsing data migrasi `otpauth-migration://` dari Google Authenticator.
- 💾 **Backup & Restore JSON:** Fitur ekspor dan impor file `.json` untuk kemudahan migrasi antar komputer/browser.

---

### 📖 Panduan Penggunaan 3 Tombol Utama

#### 1. ➕ Tambah Manual
Gunakan tombol ini jika Anda ingin menambahkan akun 2FA secara satu per satu menggunakan teks kunci rahasia (*Base32 Secret Key*).
- **Kapan digunakan:** Saat mengaktifkan 2FA di layanan web (seperti GitHub, Google, atau Facebook) dan Anda memilih opsi *"Can't scan QR code"* untuk mendapatkan teks rahasia.
- **Cara pakai:**
  1. Klik **Tambah Manual**.
  2. Masukkan nama akun (contoh: `user@gmail.com`).
  3. Masukkan *Secret Key* Base32 (kombinasi huruf A-Z dan angka 2-7).
  4. Masukkan nama penyedia service (contoh: `Google` atau `GitHub`).

#### 2. 📥 Import Google Auth
Gunakan tombol ini untuk memindahkan/mengimpor banyak akun sekaligus tanpa perlu mengetiknya satu per satu.
- **Modus 1 (URL Migration Google Authenticator):**
  1. Buka aplikasi Google Authenticator di HP > pilih **Transfer accounts** / **Export accounts**.
  2. Pindai QR Code hasil ekspor menggunakan QR Code Scanner di HP lain/web untuk mendapatkan string URL yang berawalan `otpauth-migration://offline?data=...`.
  3. Klik **Import Google Auth** di ekstensi > pilih angka `1` > tempelkan URL migrasi tersebut.
- **Modus 2 (File Backup JSON):**
  1. Klik **Import Google Auth** > pilih angka `2`.
  2. Pilih file `.json` hasil ekspor dari ekstensi ini di perangkat lain.

#### 3. 📤 Export JSON
Gunakan tombol ini untuk membuat cadangan (*backup*) seluruh akun 2FA yang tersimpan ke dalam file `.json`.
- **Kapan digunakan:** Saat Anda ingin mencadangkan data, berpindah komputer, atau menginstal ulang browser.
- **Cara pakai:**
  1. Klik **Export JSON**.
  2. Masukkan PIN keamanan Anda untuk konfirmasi.
  3. File `totp_backup_xxx.json` akan otomatis terunduh ke komputer Anda. Simpan file ini di tempat yang aman.

---

### 🛠️ Cara Instalasi (Chrome / Edge / Brave / Opera)

1. Unduh atau *clone* repositori ini ke komputer Anda.
2. Buka browser Chromium pilihan Anda, lalu akses alamat `chrome://extensions/`.
3. Aktifkan **Developer mode** (Mode Pengembang) di pojok kanan atas.
4. Klik tombol **Load unpacked** (Muat yang belum dikemas) di pojok kiri atas.
5. Pilih folder proyek `totp-extension` ini.
6. Ekstensi siap digunakan dari *toolbar* browser Anda!

---

## 🇬🇧 English

A lightweight **Manifest V3** browser extension for generating real-time two-factor authentication (2FA / TOTP) codes directly in your browser. Features PIN security protection, 1-click clipboard copy, and seamless Google Authenticator import/export support.

![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

### 🚀 Key Features

- 🔐 **PIN Access Protection:** Locks TOTP code access and secures sensitive actions (account deletion & data export).
- ⚡ **Real-Time Code Generator:** Generates 6-digit TOTP codes every 30 seconds using native Web Crypto API.
- 📋 **One-Click Copy:** Instant copy button to send codes directly to your clipboard.
- 🔄 **Google Authenticator Import:** Parses `otpauth-migration://` migration payload directly from Google Authenticator.
- 💾 **JSON Backup & Restore:** Export and import `.json` backup files for smooth migration across computers/browsers.

---

### 📖 3 Main Buttons Usage Guide

#### 1. ➕ Manual Add (Tambah Manual)
Use this button to manually add a 2FA account using its Base32 secret key text.
- **When to use:** When setting up 2FA on websites (like GitHub, Google, or Facebook) and selecting the *"Can't scan QR code"* option to reveal the secret text key.
- **How to use:**
  1. Click **Tambah Manual**.
  2. Enter account name (e.g., `user@gmail.com`).
  3. Enter Base32 Secret Key (letters A-Z and numbers 2-7).
  4. Enter Issuer name (e.g., `Google` or `GitHub`).

#### 2. 📥 Import Google Auth
Use this button to bulk import accounts from Google Authenticator or a JSON backup file.
- **Mode 1 (Google Authenticator Migration URL):**
  1. Open Google Authenticator on your mobile phone > select **Transfer accounts** / **Export accounts**.
  2. Scan the generated QR code using another device/scanner to obtain the string starting with `otpauth-migration://offline?data=...`.
  3. Click **Import Google Auth** in the extension > type `1` > paste the migration URL.
- **Mode 2 (JSON Backup File):**
  1. Click **Import Google Auth** > type `2`.
  2. Select the exported `.json` file from another browser/computer.

#### 3. 📤 Export JSON
Use this button to generate a backup file containing all your stored 2FA accounts in `.json` format.
- **When to use:** When backing up data, switching computers, or reinstalling your browser.
- **How to use:**
  1. Click **Export JSON**.
  2. Enter your security PIN for confirmation.
  3. The `totp_backup_xxx.json` file will automatically download. Store this file in a safe location.

---

### 🛠️ Installation Guide (Chrome / Edge / Brave / Opera)

1. Download or clone this repository to your computer.
2. Open your Chromium-based browser and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top-right corner.
4. Click the **Load unpacked** button in the top-left corner.
5. Select this `totp-extension` project folder.
6. The extension is ready to use from your browser toolbar!

---

## 📂 Project Structure / Struktur Proyek

```text
totp-extension/
├── manifest.json            # Manifest V3 extension configuration
├── popup.html               # Popup UI layout
├── popup.js                 # Event listeners, logic, and storage operations
├── popup.css                # Styling for popup interface
├── icon.png                 # Extension logo
├── .gitignore               # Ignored files for Git
└── lib/
    ├── base32.js            # Base32 string decoder
    ├── jsotp.min.js         # HMAC-SHA1 TOTP calculation engine
    └── google-auth-parser.js # Google Auth Protobuf migration URL parser