let appPin = null;

document.addEventListener('DOMContentLoaded', () => {
  checkPinSetup();

  document.getElementById('btn-unlock').addEventListener('click', verifyPin);
  document.getElementById('btn-add').addEventListener('click', addTokenManual);
  document.getElementById('btn-export').addEventListener('click', exportToJson);
  document.getElementById('btn-import').addEventListener('click', importData);
});

// 1. Pengecekan Setup PIN Pertama Kali
function checkPinSetup() {
  chrome.storage.local.get(['app_pin'], (result) => {
    document.getElementById('lock-screen').style.display = 'flex';
    document.getElementById('main-screen').style.display = 'none';

    if (!result.app_pin) {
      document.getElementById('pin-msg').innerText = "Buat PIN Baru (4-8 digit):";
      document.getElementById('btn-unlock').innerText = "Simpan PIN";
    } else {
      appPin = result.app_pin;
      document.getElementById('pin-msg').innerText = "Masukkan PIN untuk membuka:";
      document.getElementById('btn-unlock').innerText = "Buka Akses";
    }
  });
}

// 2. Verifikasi PIN
function verifyPin() {
  const inputPin = document.getElementById('pin-field').value;
  
  chrome.storage.local.get(['app_pin'], (result) => {
    if (!result.app_pin) {
      if (!inputPin || inputPin.length < 4) {
        alert("PIN minimal 4 digit!");
        return;
      }
      chrome.storage.local.set({ app_pin: inputPin }, () => {
        appPin = inputPin;
        unlockApp();
      });
    } else {
      if (inputPin === result.app_pin) {
        unlockApp();
      } else {
        alert("PIN Salah!");
        document.getElementById('pin-field').value = '';
      }
    }
  });
}

function unlockApp() {
  document.getElementById('lock-screen').style.display = 'none';
  document.getElementById('main-screen').style.display = 'flex';
  loadTokens();
  setInterval(updateCodes, 1000);
}

// 3. Ambil dan Render Data Akun
function loadTokens() {
  chrome.storage.local.get(['totp_tokens'], (result) => {
    const tokens = result.totp_tokens || [];
    renderTokens(tokens);
  });
}

// 3. Ambil dan Render Data Akun
function renderTokens(tokens) {
  const listEl = document.getElementById('token-list');
  listEl.innerHTML = '';
  
  if (tokens.length === 0) {
    listEl.innerHTML = '<p style="text-align:center; color:#888; font-size:12px;">Belum ada akun tersimpan.</p>';
    return;
  }

  tokens.forEach((t, index) => {
    const card = document.createElement('div');
    card.className = 'token-card';
    card.innerHTML = `
      <div>
        <div class="issuer">${t.issuer || 'Unknown'}</div>
        <div style="font-size: 13px; font-weight: bold;">${t.name}</div>
      </div>
      <div style="display:flex; align-items:center;">
        <div class="code" id="code-${index}">------</div>
        <button class="btn-copy" data-index="${index}">Salin</button>
        <button class="btn-delete" data-index="${index}">Hapus</button>
      </div>
    `;
    listEl.appendChild(card);
  });

  // Listener Tombol Salin
  document.querySelectorAll('.btn-copy').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      copyToClipboard(index, e.target);
    });
  });

  // Listener Tombol Hapus Akun
  document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      deleteTokenWithPin(index);
    });
  });

  updateCodes();
}

// Fungsi Salin Kode TOTP ke Clipboard
function copyToClipboard(index, btnElement) {
  const codeEl = document.getElementById(`code-${index}`);
  if (!codeEl) return;

  const codeText = codeEl.innerText.replace(/\s+/g, '');
  
  if (codeText === '------') {
    alert("Kode belum siap, silakan tunggu sebentar.");
    return;
  }

  navigator.clipboard.writeText(codeText).then(() => {
    // Memberikan umpan balik visual pada tombol
    const originalText = btnElement.innerText;
    btnElement.innerText = 'Tersalin!';
    btnElement.style.background = '#28a745';

    setTimeout(() => {
      btnElement.innerText = originalText;
      btnElement.style.background = '#28a745'; // dikembalikan lewat CSS
    }, 1500);
  }).catch(err => {
    console.error('Gagal menyalin kode:', err);
  });
}


// 4. Proteksi Hapus Akun Menggunakan PIN
function deleteTokenWithPin(index) {
  const confirmPin = prompt("Masukkan PIN Anda untuk mengonfirmasi penghapusan:");
  
  if (confirmPin === appPin) {
    chrome.storage.local.get(['totp_tokens'], (result) => {
      const tokens = result.totp_tokens || [];
      const removedAccount = tokens[index]?.name || 'Akun';
      tokens.splice(index, 1);
      
      chrome.storage.local.set({ totp_tokens: tokens }, () => {
        alert(`${removedAccount} berhasil dihapus.`);
        loadTokens();
      });
    });
  } else if (confirmPin !== null) {
    alert("PIN Salah! Penghapusan dibatalkan.");
  }
}

// 5. Generate Kode TOTP Real-time
async function updateCodes() {
  chrome.storage.local.get(['totp_tokens'], async (result) => {
    const tokens = result.totp_tokens || [];

    for (let index = 0; index < tokens.length; index++) {
      const t = tokens[index];
      try {
        if (window.jsotp && window.jsotp.TOTP) {
          const totp = new window.jsotp.TOTP(t.secret);
          const code = await totp.generateCode();
          const codeEl = document.getElementById(`code-${index}`);
          if (codeEl) codeEl.innerText = code;
        }
      } catch (e) {
        console.error("Gagal generate TOTP:", e);
      }
    }
  });
}

// 6. Tambah Akun Manual
function addTokenManual() {
  const name = prompt("Masukkan Nama Akun (misal: user@gmail.com):");
  if (!name) return;
  let secret = prompt("Masukkan Secret Key (Base32):");
  if (!secret) return;
  const issuer = prompt("Masukkan Provider/Issuer (misal: Google, GitHub):") || "Manual";

  secret = secret.toUpperCase().replace(/[^A-Z2-7]/g, '');
  const newToken = { name, secret, issuer };

  chrome.storage.local.get(['totp_tokens'], (result) => {
    const tokens = result.totp_tokens || [];
    tokens.push(newToken);
    chrome.storage.local.set({ totp_tokens: tokens }, () => {
      loadTokens();
    });
  });
}

// --- FUNGSI HELPER ENKRIPSI WEB CRYPTO API ---
async function getKeyFromPin(pin, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(pin),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// 7. Export JSON Terenkripsi dengan PIN
async function exportToJson() {
  const confirmPin = prompt("Masukkan PIN Anda untuk meng-enkripsi file backup:");
  if (confirmPin !== appPin) {
    if (confirmPin !== null) alert("PIN Salah! Export dibatalkan.");
    return;
  }

  chrome.storage.local.get(['totp_tokens'], async (result) => {
    const tokens = result.totp_tokens || [];
    if (tokens.length === 0) {
      alert("Tidak ada data untuk diexport!");
      return;
    }

    try {
      const enc = new TextEncoder();
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const key = await getKeyFromPin(confirmPin, salt);

      const encryptedContent = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        enc.encode(JSON.stringify(tokens))
      );

      // Format payload backup terenkripsi
      const backupData = {
        encrypted: true,
        salt: Array.from(salt),
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encryptedContent))
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `totp_encrypted_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      alert("Backup terenkripsi berhasil diunduh!");
    } catch (e) {
      alert("Gagal meng-enkripsi data backup.");
      console.error(e);
    }
  });
}

// 8. Import Data (Mendukung JSON Terenkripsi & Migration URL)
function importData() {
  const choice = prompt("Pilih mode Import:\n1. Input URL Migration Google Auth\n2. Upload File Backup JSON\n\nKetik '1' atau '2':");
  
  if (choice === '1') {
    let migrationUrl = prompt("Masukkan URL Migration Google Authenticator (otpauth-migration://...):");
    if (migrationUrl) parseGoogleAuthMigration(migrationUrl);
  } else if (choice === '2') {
    const fileInput = document.getElementById('import-file');
    if (fileInput) {
      fileInput.click();
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const parsedFile = JSON.parse(event.target.result);
            let importedTokens = [];

            // Pengecekan apakah file terenkripsi AES
            if (parsedFile.encrypted) {
              const inputPin = prompt("File ini terenkripsi. Masukkan PIN yang digunakan saat export:");
              if (!inputPin) return;

              try {
                const salt = new Uint8Array(parsedFile.salt);
                const iv = new Uint8Array(parsedFile.iv);
                const data = new Uint8Array(parsedFile.data);
                const key = await getKeyFromPin(inputPin, salt);

                const decryptedContent = await crypto.subtle.decrypt(
                  { name: "AES-GCM", iv: iv },
                  key,
                  data
                );

                const dec = new TextDecoder();
                importedTokens = JSON.parse(dec.decode(decryptedContent));
              } catch (decryptErr) {
                alert("PIN Salah atau file terenkripsi korup!");
                return;
              }
            } else if (Array.isArray(parsedFile)) {
              // Dukungan untuk file JSON lama (tanpa enkripsi)
              importedTokens = parsedFile;
            } else {
              alert("Format file JSON tidak dikenali.");
              return;
            }

            // Simpan token ke storage lokal
            if (Array.isArray(importedTokens) && importedTokens.length > 0) {
              chrome.storage.local.get(['totp_tokens'], (result) => {
                const current = result.totp_tokens || [];
                const merged = [...current, ...importedTokens];
                chrome.storage.local.set({ totp_tokens: merged }, () => {
                  alert(`Import berhasil! Memuat ${importedTokens.length} akun.`);
                  loadTokens();
                });
              });
            }
          } catch (err) {
            alert("Gagal membaca file JSON.");
            console.error(err);
          }
        };
        reader.readAsText(file);
      };
    }
  }
}

// 9. Parser Google Authenticator Migration URL
function parseGoogleAuthMigration(urlStr) {
  try {
    const importedTokens = window.GoogleAuthParser.parseUrl(urlStr);

    if (importedTokens.length === 0) {
      alert('Tidak ada akun yang berhasil dibaca.');
      return;
    }

    chrome.storage.local.get(['totp_tokens'], (result) => {
      const current = result.totp_tokens || [];
      const merged = [...current, ...importedTokens];

      chrome.storage.local.set({ totp_tokens: merged }, () => {
        alert(`Berhasil mengimpor ${importedTokens.length} akun dari Google Authenticator!`);
        loadTokens();
      });
    });

  } catch (e) {
    alert('Terjadi kesalahan saat mendecode Google Authenticator data.');
    console.error(e);
  }
}