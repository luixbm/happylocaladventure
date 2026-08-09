# Cara Publish Situs Ini + Aktifkan Blog & Komentar

Situs ini sudah jadi file statis biasa (HTML/CSS/JS) — sangat cepat, tapi supaya
panel edit blog (`/admin`) dan komentar Facebook berfungsi, ada beberapa langkah
satu kali yang perlu dilakukan. Semua gratis.

## 1. Publish ke Netlify (gratis, 10 menit)

1. Buat akun di https://app.netlify.com (bisa daftar pakai email atau GitHub).
2. Buat repository GitHub baru, upload semua file/folder di paket ini ke situ
   (drag-drop di github.com juga bisa, tidak perlu command line).
3. Di Netlify: **Add new site → Import an existing project → GitHub** →
   pilih repo tadi → Deploy site.
4. Setelah selesai, Anda akan dapat URL seperti `https://happy-local-xxxx.netlify.app`.
5. (Opsional) Di **Site settings → Domain management**, hubungkan domain
   `happylocaladventure.com` yang sudah Anda punya.

## 2. Aktifkan panel edit blog (`/admin`)

1. Di dashboard Netlify situs Anda: buka **Identity** → **Enable Identity**.
2. Di tab **Identity → Settings**, bagian **Registration**, pilih **Invite only**
   (supaya orang lain tidak bisa daftar sembarangan).
3. Masih di Identity, aktifkan **Git Gateway** (di bagian Services).
4. Undang diri sendiri: **Identity → Invite users** → masukkan email Anda.
   Anda akan dapat email untuk set password.
5. Setelah itu, buka `https://situs-anda.netlify.app/admin/` → login dengan
   email & password tadi.

Setelah ini aktif, Anda bisa menulis/edit post blog langsung dari browser
(HP atau laptop), upload foto langsung ke folder situs — tidak perlu sentuh kode.
Setiap kali Anda simpan post baru di panel, situs otomatis update dalam ~1 menit.

## 3. Aktifkan komentar Facebook

1. Buka https://developers.facebook.com/apps → **Create App** → pilih tipe
   "Consumer" atau "Business" → beri nama misalnya "Happy Local Adventure Web".
2. Setelah App dibuat, salin **App ID** yang muncul di dashboard.
3. Ganti tulisan `YOUR_FACEBOOK_APP_ID` di file-file berikut dengan App ID Anda:
   - `blog.html`
   - `activities/family-adventure.html`
   - `activities/dinner-with-locals.html`
   - `activities/lunch-in-the-jungle.html`
   - `activities/lunch-with-locals.html`
   - `activities/spiritual-ceremony.html`
4. Di dashboard App Facebook, tambahkan domain situs Anda ke **App Domains**
   dan **Website → Site URL** (misalnya `https://happylocaladventure.com`).
5. Commit perubahan, tunggu Netlify redeploy — kolom komentar akan langsung aktif
   di halaman blog & tiap halaman aktivitas.

Komentar yang masuk bisa dimoderasi lewat Facebook Page Anda
(Meta Business Suite → Comments), sama seperti komentar di postingan Facebook biasa.

## 4. Menambah foto

Ada dua cara:
- **Lewat panel admin** (`/admin`): saat menulis post blog, klik field "Cover photo"
  → upload langsung dari komputer/HP. Foto otomatis tersimpan di `images/uploads/`.
- **Manual**: taruh file foto ke folder `images/uploads/`, lalu ganti kotak
  placeholder bertuliskan "PHOTO SLOT" di file HTML halaman terkait dengan:
  `<img src="images/uploads/nama-file.jpg" alt="...">`

## Kenapa bukan Google Drive?

Google Drive tidak dirancang untuk menyajikan gambar ke banyak pengunjung
sekaligus — bisa kena limit, lambat, dan tidak otomatis dikompres untuk web.
Menyimpan gambar langsung di folder `images/uploads/` situs jauh lebih cepat
dan stabil, dan itu sudah menjadi alur kerja bawaan panel admin di atas.
