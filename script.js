/* =============================================================
   FILE 3: SCRIPT.JS (Vanilla JavaScript = JavaScript murni)
   File ini mengatur LOGIKA/TOMBOL, bukan warna/desain.
   Pelajari bagian 1 sampai 8 secara berurutan.
   ============================================================= */

// $ = mengambil satu elemen HTML berdasarkan CSS selector.
// Misal: $('#enterButton') artinya cari elemen id="enterButton".
const $ = (selector) => document.querySelector(selector);

// =============================================================
// 1. LOGIKA COVER PEMBUKA
// Saat halaman pertama kali dibuka, cover terlihat di depan.
// Saat Enter diklik, cover menghilang dan scroll menjadi aktif.
// =============================================================
const cover = $('#openingCover');
const website = $('#portfolioSite');
const enterButton = $('#enterButton');

function masukPortofolio(tujuan = 'beranda') {
  cover.classList.add('is-closing'); // CSS menjalankan transisi keluar.
  cover.setAttribute('aria-hidden', 'true');
  website.removeAttribute('aria-hidden');
  website.removeAttribute('inert'); // Halaman portofolio mulai bisa diakses.
  document.body.classList.remove('intro-open');

  // Tunggu animasi cover selesai sebelum scroll ke bagian pilihan.
  setTimeout(() => {
    cover.hidden = true;
    const bagian = document.getElementById(tujuan);
    if (bagian) bagian.scrollIntoView({behavior:'instant', block:'start'});
    $('#themeButton').focus({preventScroll:true});
  }, 950);
}

function tampilkanCoverLagi() {
  window.scrollTo({top:0,behavior:'auto'});
  cover.hidden = false;
  cover.classList.remove('is-closing');
  cover.removeAttribute('aria-hidden');
  website.setAttribute('aria-hidden','true');
  website.setAttribute('inert','');
  document.body.classList.add('intro-open');
  enterButton.focus();
}

// Tombol utama membuka portofolio, tombol sekunder langsung ke About Me.
enterButton.addEventListener('click', () => masukPortofolio());
$('#openingAboutButton').addEventListener('click', () => masukPortofolio('tentang'));
$('#backToCover').addEventListener('click', tampilkanCoverLagi);

// Menu mini cover dapat dipakai; tidak hanya hiasan.
cover.querySelectorAll('[data-cover-target]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    masukPortofolio(link.dataset.coverTarget);
  });
});

// =============================================================
// 2. KEL0PAK BUNGA BERGERAK
// Kita membuat elemen <span> dengan posisi/kecepatan bervariasi.
// CSS .petal yang menjalankan keyframe jatuh ke bawah.
// =============================================================
function buatKelopak(containerId, jumlah) {
  const tempat = document.getElementById(containerId);
  if (!tempat || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  for (let i = 0; i < jumlah; i++) {
    const kelopak = document.createElement('span');
    kelopak.className = 'petal';
    kelopak.style.setProperty('--start', `${(i * 41 + 13) % 100}%`);
    kelopak.style.setProperty('--duration', `${9 + ((i * 7) % 9)}s`);
    kelopak.style.setProperty('--delay', `${-(i * 2.1)}s`);
    kelopak.style.setProperty('--drift', `${(i % 2 ? 1 : -1) * (30 + (i * 11) % 85)}px`);
    kelopak.style.setProperty('--rotate', `${i * 17}deg`);
    kelopak.style.width = `${8 + (i * 3) % 10}px`;
    tempat.appendChild(kelopak);
  }
}
buatKelopak('introPetals', 10);
buatKelopak('sitePetals', 8);

// =============================================================
// 3. MENU HP, LINK NAVIGASI, DAN SCROLL PROGRESS
// =============================================================
const menuButton = $('#menuButton');
const mainNav = $('#mainNav');
menuButton.addEventListener('click', () => {
  const dibuka = mainNav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(dibuka));
  menuButton.setAttribute('aria-label', dibuka ? 'Tutup navigasi' : 'Buka navigasi');
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    mainNav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

function updateScroll() {
  const maxScroll = document.documentElement.scrollHeight - innerHeight;
  const persen = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
  $('#scrollProgress').style.width = `${persen}%`;
}
window.addEventListener('scroll', updateScroll, {passive: true});
window.addEventListener('resize', updateScroll);

// =============================================================
// 4. ANIMASI MUNCUL SAAT DISCROLL
// IntersectionObserver memeriksa apakah suatu kartu terlihat.
// Jika terlihat, tambah class "visible". CSS yang menganimasi.
// =============================================================
const elemenReveal = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target); // Animasi cukup satu kali
      }
    });
  }, {threshold: 0.09});
  elemenReveal.forEach(el => observer.observe(el));
} else {
  elemenReveal.forEach(el => el.classList.add('visible'));
}

// Menandai menu aktif sesuai bagian yang sedang terlihat.
const navLinks = [...mainNav.querySelectorAll('a')];
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const cocok = link.getAttribute('href') === '#' + entry.target.id;
        link.classList.toggle('active', cocok);
      });
    });
  }, {rootMargin: '-20% 0px -65% 0px'});
  document.querySelectorAll('main section[id]').forEach(sec => navObserver.observe(sec));
}

// =============================================================
// 5. MODE TERANG/GELAP
// dataset.theme mengubah atribut data-theme pada elemen HTML.
// CSS menggunakan [data-theme='dark'] untuk mengganti warnanya.
// =============================================================
const themeButton = $('#themeButton');
try {
  if (localStorage.getItem('aisyah-floral-theme') === 'dark') {
    document.documentElement.dataset.theme = 'dark';
  }
} catch (error) { /* website masih jalan jika browser membatasi storage */ }

function updateThemeIcon() {
  const gelap = document.documentElement.dataset.theme === 'dark';
  themeButton.textContent = gelap ? '☀' : '☾';
}
updateThemeIcon();

themeButton.addEventListener('click', () => {
  const gelap = document.documentElement.dataset.theme === 'dark';
  const temaBaru = gelap ? 'light' : 'dark';
  document.documentElement.dataset.theme = temaBaru;
  try { localStorage.setItem('aisyah-floral-theme', temaBaru); } catch (error) {}
  updateThemeIcon();
});

// =============================================================
// 6. POPUP DETAIL PROYEK DAN KARTU LEARNING (DIALOG)
// Tombol proyek dan kartu Learning membawa data-title serta data-description.
// Data dibaca lalu dimasukkan ke dalam popup.
// =============================================================
const modal = $('#detailDialog');
const gambarDetail = $('#detailImage');
let aktifGaleri = [];
let indeksGaleri = -1;

// Satu fungsi untuk kartu belajar, galeri cover, dan sertifikat.
function isiDetail(kartu) {
  $('#detailTitle').textContent = kartu.dataset.title || '';
  $('#detailDescription').textContent = kartu.dataset.description || '';
  const gambar = kartu.dataset.image || '';
  gambarDetail.hidden = !gambar;
  if (gambar) {
    gambarDetail.src = gambar;
    gambarDetail.alt = kartu.dataset.title || 'Gambar dokumentasi';
  } else {
    gambarDetail.removeAttribute('src');
  }
  const kategori = kartu.dataset.gallery;
  $('#detailOverline').textContent = kategori === 'covers' ? 'CREATIVE WORKS'
    : kategori === 'certificates' ? 'CERTIFICATES' : 'LEARNING JOURNEY';
  $('#galleryControls').hidden = aktifGaleri.length < 2;
  $('#galleryPosition').textContent = aktifGaleri.length > 1
    ? `${indeksGaleri + 1} / ${aktifGaleri.length}` : '';
}

// Ambil informasi dari atribut data-* pada tombol, tanpa menulis HTML dialog berkali-kali.
document.querySelectorAll('.detail-trigger').forEach(kartu => {
  kartu.addEventListener('click', () => {
    const kategori = kartu.dataset.gallery;
    aktifGaleri = kategori
      ? [...document.querySelectorAll(`.detail-trigger[data-gallery="${kategori}"]`)]
      : [];
    indeksGaleri = aktifGaleri.indexOf(kartu);
    isiDetail(kartu);
    modal.showModal();
  });
});

function pindahGaleri(arah) {
  if (!modal.open || aktifGaleri.length < 2) return;
  indeksGaleri = (indeksGaleri + arah + aktifGaleri.length) % aktifGaleri.length;
  isiDetail(aktifGaleri[indeksGaleri]);
}

$('#galleryPrev').addEventListener('click', () => pindahGaleri(-1));
$('#galleryNext').addEventListener('click', () => pindahGaleri(1));
document.addEventListener('keydown', (event) => {
  if (modal.open && event.key === 'ArrowRight') pindahGaleri(1);
  if (modal.open && event.key === 'ArrowLeft') pindahGaleri(-1);
});
['#closeDialog', '#closeDialogBottom'].forEach(id => {
  $(id).addEventListener('click', () => modal.close());
});
modal.addEventListener('click', event => {
  if (event.target === modal) modal.close();
});

// =============================================================
// 7. BUBBLE SORT - ALGORITMA ASLI, BUKAN ANIMASI PALSU
// Contoh [7, 3] dibandingkan; karena 7 > 3, tukar jadi [3, 7].
// Kegiatan diulang untuk semua pasangan hingga data terurut.
// Setiap tahap disimpan agar dapat ditampilkan satu-satu.
// =============================================================
const sortVisual = $('#sortVisual');
const playSort = $('#playSort');
const stepSort = $('#stepSort');
const randomSort = $('#randomSort');
const speedInput = $('#sortSpeed');
let nilaiAwal = [];
let langkah = [];
let posisiLangkah = 0;
let timerSort = null;

function angkaAcak() {
  // Membuat 8 angka acak dari 15 sampai 95.
  return Array.from({length: 8}, () => 15 + Math.floor(Math.random() * 81));
}

function buatLangkahBubbleSort(angka) {
  const data = [...angka]; // Salin agar nilaiAwal tidak berubah.
  const hasil = [{array: [...data], aktif: [], banding: 0, tukar: 0, pesan: 'Siap mengurutkan angka.'}];
  let banding = 0;
  let tukar = 0;

  for (let putaran = 0; putaran < data.length - 1; putaran++) {
    let adaPertukaran = false;
    for (let j = 0; j < data.length - 1 - putaran; j++) {
      banding++;
      hasil.push({array: [...data], aktif: [j, j + 1], banding, tukar,
        pesan: `Bandingkan ${data[j]} dengan ${data[j + 1]}.`});

      if (data[j] > data[j + 1]) {
        [data[j], data[j + 1]] = [data[j + 1], data[j]]; // TUKAR POSISI
        tukar++;
        adaPertukaran = true;
        hasil.push({array: [...data], aktif: [j, j + 1], banding, tukar,
          pesan: `Karena lebih besar, kedua angka ditukar.`});
      }
    }
    if (!adaPertukaran) break; // Bila sudah urut, hentikan lebih awal.
  }

  hasil.push({array: [...data], aktif: [], banding, tukar,
    pesan: 'Selesai! Semua angka sudah terurut dari kecil ke besar.', selesai: true});
  return hasil;
}

function gambarLangkah() {
  const tahap = langkah[posisiLangkah];
  sortVisual.replaceChildren(); // Kosongkan batang sebelumnya.

  tahap.array.forEach((angka, index) => {
    const batang = document.createElement('div');
    batang.className = 'sort-bar';
    if (tahap.aktif.includes(index)) batang.classList.add('active');
    if (tahap.selesai) batang.classList.add('done');
    batang.style.setProperty('--bar-height', `${angka}%`);
    const label = document.createElement('span');
    label.textContent = angka;
    batang.appendChild(label);
    sortVisual.appendChild(batang);
  });

  $('#compareCount').textContent = tahap.banding;
  $('#swapCount').textContent = tahap.tukar;
  $('#stepCount').textContent = posisiLangkah;
  $('#sortExplanation').textContent = tahap.pesan;
  $('#sortStatus').textContent = tahap.selesai ? '✓ Selesai diurutkan' : `Langkah ${posisiLangkah} dari ${langkah.length - 1}`;
  if (tahap.selesai) hentikanAnimasi();
}

function hentikanAnimasi() {
  clearInterval(timerSort);
  timerSort = null;
  playSort.textContent = 'Mulai ▶';
}

function majuSatuLangkah() {
  if (posisiLangkah < langkah.length - 1) {
    posisiLangkah++;
    gambarLangkah();
  } else {
    hentikanAnimasi();
  }
}

function mulaiJedaSort() {
  if (timerSort !== null) { hentikanAnimasi(); return; }
  if (posisiLangkah >= langkah.length - 1) posisiLangkah = 0;
  playSort.textContent = 'Jeda ❚❚';
  // Interval berulang memindahkan visual ke langkah berikutnya.
  const jeda = Math.max(110, 750 - Number(speedInput.value) * 125);
  timerSort = setInterval(majuSatuLangkah, jeda);
}

function acakUlang() {
  hentikanAnimasi();
  nilaiAwal = angkaAcak();
  langkah = buatLangkahBubbleSort(nilaiAwal);
  posisiLangkah = 0;
  gambarLangkah();
}

playSort.addEventListener('click', mulaiJedaSort);
stepSort.addEventListener('click', () => { hentikanAnimasi(); majuSatuLangkah(); });
randomSort.addEventListener('click', acakUlang);
speedInput.addEventListener('input', () => {
  if (timerSort !== null) { hentikanAnimasi(); mulaiJedaSort(); }
});
acakUlang(); // Buat data awal saat halaman dimuat.

// =============================================================
// 8. FORM KONTAK — diteruskan ke WhatsApp atau aplikasi email.
// Ini website statis tanpa database/backend: pesan TIDAK dikirim otomatis.
const contactForm = $('#contactForm');
const contactFeedback = $('#contactFeedback');
const nomorWhatsApp = '6281271136724'; // Pastikan nomor menerima WhatsApp sebelum dipublikasikan.
const alamatEmail = 'aisyahas627@gmail.com'; // Konfirmasi alamat email sebelum dipublikasikan.

function ambilPesan() {
  // reportValidity() memastikan kedua isian sudah diisi sebelum tombol bekerja.
  if (!contactForm.reportValidity()) return null;
  const nama = $('#visitorName').value.trim();
  const isi = $('#visitorMessage').value.trim();
  if (!nama || !isi) {
    contactFeedback.textContent = 'Silakan tulis nama dan pesan terlebih dahulu.';
    return null;
  }
  return `Halo Aisyah,\n\n${isi}\n\nDari: ${nama}`;
}

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const pesan = ambilPesan();
  if (!pesan) return;
  const url = `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;
  // Dibuka dari klik nyata, bukan background process.
  const tab = window.open(url, '_blank');
  if (tab) tab.opener = null; // Putuskan akses balik dari tab baru.
  if (!tab) { // Bila browser memblokir tab baru, gunakan halaman yang sama.
    window.location.href = url;
  }
  contactFeedback.textContent = 'WhatsApp dibuka dengan draf pesan. Silakan periksa, lalu tekan Kirim di WhatsApp.';
});

$('#emailMessageButton').addEventListener('click', () => {
  const pesan = ambilPesan();
  if (!pesan) return;
  const subject = encodeURIComponent('Pesan dari pengunjung portofolio');
  const body = encodeURIComponent(pesan);
  window.location.href = `mailto:${alamatEmail}?subject=${subject}&body=${body}`;
  contactFeedback.textContent = 'Aplikasi email dibuka dengan draf pesan. Periksa alamat tujuan dan tekan Kirim di aplikasi email.';
});

// Tahun di footer otomatis mengikuti tahun saat website dibuka.
$('#year').textContent = new Date().getFullYear();


// =============================================================
// TOMBOL SERTIFIKAT DI KARTU EXPERIENCE
// data-certificate-index="0" membuka sertifikat moderator.
// data-certificate-index="1" membuka sertifikat pembawa acara.
// Kita menggunakan popup yang sudah ada, jadi tidak perlu membuat ulang dialog.
// =============================================================
document.querySelectorAll('[data-certificate-index]').forEach((tombol) => {
  tombol.addEventListener('click', () => {
    const nomor = Number(tombol.dataset.certificateIndex);
    const semuaSertifikat = document.querySelectorAll('.cert-real-card.detail-trigger');
    if (semuaSertifikat[nomor]) semuaSertifikat[nomor].click();
  });
});
