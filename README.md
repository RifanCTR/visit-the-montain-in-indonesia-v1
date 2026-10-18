# Mountain Indonesia - Platform Informasi Gunung, Ekspedisi Alam, dan Komunitas Penjelajah

Mountain Indonesia adalah sebuah platform web portofolio dan informasi interaktif yang dirancang khusus untuk para pencinta alam, pendaki gunung, serta siapa saja yang ingin menjelajahi keindahan topografi dan pegunungan di nusantara. Website ini tidak hanya sekadar menyajikan daftar direktori gunung, tetapi juga dibangun dengan standar arsitektur pengembangan web modern yang mengutamakan performa tinggi, pengalaman pengguna yang mulus, serta sistem keamanan tingkat lanjut pada sisi pengolahan datanya.

<img width="1188" height="700" alt="Tampilan Utama Mountain Indonesia" src="https://github.com/user-attachments/assets/5c32a5f6-0a16-472d-beb6-f1b2771aba8b" />

---

## Latar Belakang dan Tujuan Pembuatan Proyek

Ide utama di balik pembuatan platform ini adalah menyediakan wadah digital yang bersih, cepat, dan informatif bagi para pendaki untuk merencanakan perjalanan mereka. Seringkali, informasi mengenai jalur pendakian atau perlengkapan outdoor tersebar di banyak tempat dan sulit ditemukan dalam satu genggaman. 

Melalui website ini, tujuan utamanya dijabarkan ke dalam beberapa poin penting:
- Menyediakan direktori visual interaktif yang merangkum puluhan gunung populer di Indonesia lengkap dengan nama dan karakteristiknya.
- Membantu para pendaki pemula maupun profesional dalam memahami jenis-jenis perlengkapan hiking dan camping melalui rekomendasi brand terpercaya.
- Menghadirkan ruang diskusi interaktif bagi komunitas lewat sistem komentar langsung yang real-time.
- Menerapkan arsitektur keamanan serverless modern untuk memastikan tidak ada kunci rahasia database atau token bot yang bocor ke publik melalui browser.

---

## Penjelasan Rinci Fitur-Fitur Website

### 1. Sistem Pencarian dan Navigasi Gunung Pintar
Website ini dilengkapi dengan kotak pencarian interaktif di bagian halaman utama. Pengunjung dapat mengetik nama gunung apa saja yang ingin dicari (misalnya Rinjani, Semeru, atau Merbabu). Sistem akan secara otomatis mendeteksi kata kunci tersebut, menjeda animasi pergerakan gambar otomatis, lalu menggeser layar secara halus (smooth scroll) menuju kartu gunung yang dicari serta memberikan efek penyorotan visual secara instan.

### 2. Kolom Komunitas dan Komentar Berbasis Cloud
Terinspirasi dari tata letak platform video modern, bagian interaksi komunitas dirancang agar pengguna dapat menuliskan nama dan pesan atau ulasan mereka dengan mudah. Fitur ini dilengkapi dengan:
- Sistem reaksi suka dan tidak suka yang langsung memperbarui data di dalam database secara real-time.
- Pembuatan avatar otomatis berdasarkan huruf pertama dari nama pengirim dengan variasi warna latar belakang yang unik.
- Sistem keamanan escape HTML untuk mencegah celah keamanan injeksi skrip berbahaya (XSS) dari input pengguna.

### 3. Konsol Administrator Berbasis Terminal CLI
Bagi pengelola web, tersedia halaman login rahasia dan panel kontrol khusus yang dirancang menyerupai terminal perintah (Command Line Interface) ala Linux atau Git. Di dalam konsol ini, admin dapat mengetik berbagai perintah teks seperti:
- Perintah untuk melihat daftar pesan masuk dan ulasan dari pengguna.
- Perintah untuk mengecek status kesehatan server dan latensi jaringan secara real-time.
- Perintah untuk menghapus pesan atau ulasan tertentu yang dianggap melanggar aturan secara permanen langsung dari antarmuka terminal.

### 4. Perlindungan Keamanan Arsitektur Serverless (Backend Proxy)
Salah satu fokus terbesar dalam pengembangan proyek ini adalah keamanan siber. Seluruh operasi sensitif seperti verifikasi password admin, pengambilan data komentar, dan penghapusan data tidak pernah dilakukan langsung dari file JavaScript di browser pengunjung. Sebaliknya, semua proses tersebut dialirkan secara aman melalui fungsi serverless di Vercel yang bertindak sebagai jembatan tertutup menuju database Supabase. Dengan cara ini, kunci rahasia layanan tidak akan pernah bisa dilihat oleh orang lain melalui fitur *Inspect Element* atau *View Source*.

---

## Arsitektur dan Teknologi yang Digunakan

Proyek ini dibangun menggunakan kombinasi teknologi modern tanpa memerlukan framework berat yang rumit, sehingga waktu pemuatan halaman menjadi sangat cepat:
- **Frontend Core**: Menggunakan HTML5 untuk kerangka semantik yang bersih, CSS3 murni untuk pengaturan tata letak fleksibel dan animasi gerakan, serta JavaScript modern (ES6+) untuk menangani seluruh logika interaktif, manipulasi DOM, dan komunikasi asinkron (Fetch API).
- **External UI Libraries**: Memanfaatkan FontAwesome untuk ikon grafis yang tajam serta AOS (Animate On Scroll) untuk memberikan efek kemunculan elemen halaman yang elegan.
- **Backend & Serverless**: Memanfaatkan Vercel Serverless Functions (`/api/...`) berbasis Node.js untuk mengeksekusi logika server secara aman di balik layar.
- **Database Storage**: Menggunakan Supabase PostgreSQL Cloud Cluster untuk menyimpan data tabel komentar, pesan kontak, dan log aktivitas secara terstruktur.
- **Version Control & Hosting**: Menggunakan Git dan GitHub untuk manajemen kode sumber serta Vercel Edge Network untuk proses penyebaran (deployment) web secara otomatis.

---

## Tim Pengembang dan Kontributor

Proyek kolaboratif ini dikembangkan bersama oleh dua orang pengembang dengan pembagian peran yang terstruktur:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/RifanCTR">
        <img src="https://avatars.githubusercontent.com/RifanCTR?s=80" width="60" height="60" alt="RifanCTR"/>
        <br>
        <b>Rifan CTR</b>
        <br>
        <sub>Lead System Architect & Fullstack Developer</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Deryy1">
        <img src="https://avatars.githubusercontent.com/Deryy1?s=80" width="60" height="60" alt="Deryy1"/>
        <br>
        <b>Agung</b>
        <br>
        <sub>Frontend Developer & UI Designer</sub>
      </a>
    </td>
  </tr>
</table>

---

## Lisensi dan Hak Cipta
Hak cipta dilindungi undang-undang. Seluruh aset gambar, kode sumber, dan tata letak pada proyek ini dikelola dan dimiliki oleh Mountain Core Systems. 

&copy; 2026 Mountain Core Systems. All rights reserved.
