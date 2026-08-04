# Engine Bot WhatsApp (Open Source)

![NodeJS](https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=nodedotjs)
![Baileys](https://img.shields.io/badge/Baileys-Multi--Device-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Engine Bot WhatsApp** adalah template dasar (starter engine) bot WhatsApp yang minimalis, cepat, dan ringan berbasis Node.js ESM dan `@whiskeysockets/baileys`. Project ini dirancang sebagai pondasi open source bagi developer yang ingin membangun bot WhatsApp kustom tanpa beban fitur berlebih.

---

## ⚡ Fitur Utama Engine

- **Baileys Multi-Device Support:** Mendukung autentikasi multi-device resmi.
- **Pairing Code & QR Code:** Opsi menghubungkan nomor bot menggunakan Kode Pairing (tanpa perlu scan kamera) atau QR Code terminal.
- **Minimalis & Ringan:** Hanya memiliki 1 command bawaan yaitu `.ping` / `!ping` / `/ping` untuk menguji kecepatan respon engine.
- **Modular & Clean Code:** Menggunakan arsitektur ES Modules (ESM) modern tanpa komentar kode untuk keterbacaan yang maksimal.
- **Auto Reconnect:** Otomatis menghubungkan ulang ketika koneksi terputus.

---

## 🛠️ Persyaratan Sistem

- **Node.js:** Versi 18.0.0 atau yang lebih baru.
- **NPM / Yarn:** Untuk memasang dependensi paket.

---

## 🚀 Panduan Instalasi & Penggunaan

### 1. Clone Repository
```bash
git clone https://github.com/mikorayuki/engine-bot-wa.git
cd engine-bot-wa
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi
Edit file `config.js` untuk menyesuaikan nama bot, prefix command, atau opsi pairing code:

```javascript
export default {
    botName: "WA-Engine",
    ownerNumber: ["6283833826401"],
    prefix: [".", "!", "/", "#"],
    sessionDir: "./session",
    usePairingCode: true
};
```

### 4. Jalankan Bot Engine
```bash
npm start
```

Jika `usePairingCode: true`, terminal akan meminta memasukkan nomor WhatsApp Anda (format: `628xxx`), lalu menampilkan **8 Digit Kode Pairing** untuk dimasukkan pada WhatsApp HP Anda (*Linked Devices > Link with Phone Number*).

---

## 🧪 Menguji Fitur Bawaan

Kirim pesan berikut ke nomor WhatsApp bot yang sudah terhubung:

- **Input:** `.ping` / `!ping` / `/ping`
- **Output:** `Pong! 🏓 Speed: XX ms`

---

## 📁 Struktur Direktori Project

```text
engine-bot-wa/
├── index.js          # Main entrypoint connection & handler
├── config.js         # Konfigurasi bot (Prefix, Owner, Session)
├── package.json      # Dependensi project & script
├── .env.example      # Template variabel lingkungan
├── .gitignore        # Daftar file yang diabaikan git
└── README.md         # Dokumentasi open source
```

---

## 📄 Lisensi

Project ini dirilis di bawah lisensi [MIT License](LICENSE).
