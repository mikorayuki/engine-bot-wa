# Engine Bot WhatsApp (Open Source)

![NodeJS](https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=nodedotjs)
![Baileys](https://img.shields.io/badge/Custom--Baileys-Patched-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Engine Bot WhatsApp** adalah starter engine WhatsApp bot yang dirancang khusus untuk stabilitas tinggi, performa ringan, dan kemudahan kustomisasi. Engine ini menggunakan fondasi **Custom Baileys Library** yang telah di-patch untuk mengatasi masalah konektivitas umum pada bot WhatsApp modern.

---

## 🚀 Mengapa Menggunakan Custom Baileys?

Engine ini mengintegrasikan repositori Baileys yang disesuaikan (`git+https://github.com/Konaimav2/baileys.git`) dalam `package.json`:

```json
"dependencies": {
  "baileys": "git+https://github.com/Konaimav2/baileys.git"
}
```

### Keunggulan Custom Baileys:
1. **Perbaikan Pairing Code Handshake:** Mengeliminasi error kemacetan saat meminta 8-digit kode pairing di terminal.
2. **Stabilitas Sesi (Anti-Session Corrupt):** Penanganan penyimpanan kunci sesi (`useMultiFileAuthState`) yang lebih aman dari kerusakan data saat bot mendadak mati.
3. **Peningkatan Re-Koneksi:** Mekanisme otomatisasi koneksi ulang yang mencegah bot terjebak dalam *infinite reconnect loop*.
4. **Optimasi Konsumsi Memori:** Mengurangi beban CPU dan RAM sehingga cocok dijalankan pada VPS spesifikasi rendah maupun server produksi.

---

## 🛡️ Arsitektur & Fitur Stabilitas

- **Global Anti-Crash Shield:** Dilengkapi dengan penanganan `uncaughtException` dan `unhandledRejection` untuk mencegah proses bot mati akibat error tak terduga.
- **Smart Reconnect Timer:** Skema jeda waktu sebelum melakukan percobaan ulang koneksi saat WhatsApp Server mengalami pemeliharaan.
- **Signal Key Caching:** Penggunaan `makeCacheableSignalKeyStore` untuk enkripsi pesan cepat dan efisien.
- **Kode Minimalis Tanpa Beban:** Hanya menyediakan 1 command bawaan yaitu `.ping` / `!ping` / `/ping` untuk memastikan kestabilan dasar.

---

## 🛠️ Persyaratan Sistem

- **Node.js:** Versi 18.0.0 atau yang lebih baru (ES Modules).
- **NPM / Yarn:** Untuk memasang dependensi.

---

## 💻 Cara Penggunaan

### 1. Clone Repository
```bash
git clone https://github.com/mikorayuki/engine-bot-wa.git
cd engine-bot-wa
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi (`config.js`)
```javascript
export default {
    botName: "WA-Engine",
    ownerNumber: ["6283833826401"],
    prefix: [".", "!", "/", "#"],
    sessionDir: "./session",
    usePairingCode: true
};
```

### 4. Jalankan Bot
```bash
npm start
```

Masukkan nomor WhatsApp Anda pada prompt terminal untuk menerima **8 Digit Kode Pairing** (*Tautkan Perangkat > Tautkan dengan Nomor Telepon*).

---

## 🧪 Pengujian Command

Kirim pesan ke nomor WhatsApp bot:
- **Pesan:** `.ping`
- **Balasan:** `Pong! 🏓 Speed: XX ms`

---

## 📁 Struktur Project

```text
engine-bot-wa/
├── index.js          # Entrypoint utama & listener pesan
├── config.js         # Pengaturan nomor owner, prefix, & sesi
├── package.json      # Dependensi project & custom baileys
├── .env.example      # Template variabel lingkungan
└── README.md         # Dokumentasi resmi
```

---

## 📄 Lisensi

Project ini dirilis di bawah lisensi [MIT License](LICENSE).
