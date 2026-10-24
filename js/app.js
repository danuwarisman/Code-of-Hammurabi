/**
 * THE CODE OF HAMMURABI - Interactive UX & Babylonian Judge Simulator
 * Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigationPolish();
  initReadingProgressAndTopBtn();
  initSubnavAutoCenter();
  initPasalUXToolbarAndHash();
  initGridQuickFilter();
  initBabylonianJudgeSimulator();
  updateFooterBadge();
});

/* ==========================================================================
   1. POLISH NAVIGASI MOBILE (Tutup otomatis dengan ESC / Klik di luar)
   ========================================================================== */
function initNavigationPolish() {
  const navToggle = document.getElementById('nav-toggle');
  const siteHeader = document.querySelector('.site-header');
  if (!navToggle || !siteHeader) return;

  // Tutup drawer saat klik di luar header
  document.addEventListener('click', (e) => {
    if (navToggle.checked && !siteHeader.contains(e.target)) {
      navToggle.checked = false;
    }
  });

  // Tutup drawer saat tekan tombol Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navToggle.checked) {
      navToggle.checked = false;
    }
  });

  // Tutup drawer saat salah satu link di mobile-drawer diklik
  const drawerLinks = siteHeader.querySelectorAll('.mobile-drawer a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.checked = false;
    });
  });
}

/* ==========================================================================
   2. INDIKATOR PROGRES BACA & TOMBOL KEMBALI KE ATAS
   ========================================================================== */
function initReadingProgressAndTopBtn() {
  // Buat elemen progress bar di bagian paling atas layar
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress-bar';
  progressBar.setAttribute('aria-hidden', 'true');
  document.body.prepend(progressBar);

  // Buat tombol Back to Top
  const topBtn = document.createElement('button');
  topBtn.className = 'btn-back-to-top';
  topBtn.setAttribute('aria-label', 'Kembali ke atas halaman');
  topBtn.setAttribute('title', 'Kembali ke Atas');
  topBtn.innerHTML = '&#8593;';
  document.body.appendChild(topBtn);

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;

    if (scrollTop > 350) {
      topBtn.classList.add('show');
    } else {
      topBtn.classList.remove('show');
    }
  }, { passive: true });
}

/* ==========================================================================
   3. AUTO-CENTER SUBNAV RAIL HORIZONTAL PADA KATEGORI AKTIF
   ========================================================================== */
function initSubnavAutoCenter() {
  const activeSubnav = document.querySelector('.subnav-rail .subnav-link.active');
  const railInner = document.querySelector('.subnav-rail-inner');
  if (activeSubnav && railInner) {
    const offset = activeSubnav.offsetLeft - (railInner.clientWidth / 2) + (activeSubnav.clientWidth / 2);
    railInner.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
  }
}

/* ==========================================================================
   4. TOOLBAR KONTROL BACA PASAL & AUTO-HIGHLIGHT DARI URL #HASH
   ========================================================================== */
function initPasalUXToolbarAndHash() {
  const pasalCards = document.querySelectorAll('.pasal-card');

  // Jika halaman ini memiliki daftar kartu pasal, suntikkan Toolbar Kontrol Baca
  if (pasalCards.length > 1) {
    const firstCard = pasalCards[0];
    const toolbar = document.createElement('div');
    toolbar.className = 'ux-reading-toolbar d-flex flex-wrap justify-content-between align-items-center gap-2';
    toolbar.innerHTML = `
      <div class="d-flex align-items-center gap-2 flex-grow-1" style="min-width: 200px;">
        <input type="search" id="pasal-live-filter" class="form-control form-control-sm judge-select" 
               placeholder="Cari kata kunci atau nomor pasal di halaman ini..." aria-label="Cari pasal di halaman ini">
      </div>
      <div class="d-flex flex-wrap gap-2">
        <button type="button" id="btn-expand-all" class="btn-hammurabi-outline py-1 px-2 small" style="font-size: 0.78rem;">
          Buka Semua Terjemahan
        </button>
        <button type="button" id="btn-collapse-all" class="btn-hammurabi-outline py-1 px-2 small" style="font-size: 0.78rem;">
          Tutup Semua
        </button>
      </div>
    `;
    firstCard.parentNode.insertBefore(toolbar, firstCard);

    const allDetails = document.querySelectorAll('.pasal-card details.explanation-details');
    document.getElementById('btn-expand-all').addEventListener('click', () => {
      allDetails.forEach(d => d.open = true);
    });
    document.getElementById('btn-collapse-all').addEventListener('click', () => {
      allDetails.forEach(d => d.open = false);
    });

    // Live filter pasal di halaman kategori
    const filterInput = document.getElementById('pasal-live-filter');
    filterInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      pasalCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  // Fungsi Auto-Open <details> dan Highlight Emas saat melompat ke #pasal-XX
  function highlightTargetPasal() {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith('#pasal-')) return;

    const targetCard = document.querySelector(hash);
    if (targetCard) {
      // Buka otomatis penjelasan Bahasa Indonesia di pasal yang dituju
      const details = targetCard.querySelector('details.explanation-details');
      if (details) details.open = true;

      // Beri animasi kilau emas
      targetCard.classList.remove('pasal-highlight-active');
      void targetCard.offsetWidth; // trigger reflow
      targetCard.classList.add('pasal-highlight-active');

      // Scroll halus dengan kompensasi tinggi sticky header
      setTimeout(() => {
        const headerOffset = 95;
        const elementPosition = targetCard.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }, 80);
    }
  }

  highlightTargetPasal();
  window.addEventListener('hashchange', highlightTargetPasal);
}

/* ==========================================================================
   5. FILTER CEPAT GRID 1-282 DI HALAMAN HUKUM.HTML
   ========================================================================== */
function initGridQuickFilter() {
  const articleGrid = document.querySelector('#grid-pasal .article-grid');
  if (!articleGrid) return;

  const searchWrap = document.createElement('div');
  searchWrap.className = 'mb-3 d-flex flex-wrap gap-2 align-items-center';
  searchWrap.innerHTML = `
    <input type="search" id="grid-jump-search" class="form-control form-control-sm judge-select" 
           style="max-width: 320px;" placeholder="Ketik nomor pasal (1-282) lalu tekan Enter...">
    <span class="small text-muted">Atau klik langsung kotak nomor di bawah.</span>
  `;
  articleGrid.parentNode.insertBefore(searchWrap, articleGrid);

  const input = document.getElementById('grid-jump-search');
  const buttons = articleGrid.querySelectorAll('.article-jump-btn');

  input.addEventListener('input', (e) => {
    const val = e.target.value.trim().toLowerCase();
    buttons.forEach(btn => {
      const match = btn.textContent.toLowerCase().includes(val) || (btn.title && btn.title.toLowerCase().includes(val));
      btn.style.display = match ? '' : 'none';
    });
  });

  // Jika user tekan Enter saat mengetik angka pasal, langsung lompat ke pasalnya
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const visibleBtn = Array.from(buttons).find(b => b.style.display !== 'none');
      if (visibleBtn) window.location.href = visibleBtn.getAttribute('href');
    }
  });
}

/* ==========================================================================
   6. SIMULATOR INTERAKTIF: HAKIM BABILONIA (LEX TALIONIS CALCULATOR)
   ========================================================================== */
function initBabylonianJudgeSimulator() {
  const crimeEl = document.getElementById('sim-crime');
  const perpEl = document.getElementById('sim-perp');
  const victimEl = document.getElementById('sim-victim');
  if (!crimeEl || !perpEl || !victimEl) return;

  const badgeEl = document.getElementById('sim-pasal-badge');
  const refEl = document.getElementById('sim-pasal-ref');
  const tagEl = document.getElementById('sim-category-tag');
  const titleEl = document.getElementById('sim-verdict-title');
  const descEl = document.getElementById('sim-verdict-desc');
  const quoteEl = document.getElementById('sim-quote');
  const noteEl = document.getElementById('sim-economic-note');
  const linkEl = document.getElementById('sim-jump-link');
  const randomBtn = document.getElementById('sim-random-btn');

  function evaluateVerdict() {
    const crime = crimeEl.value;
    const perp = perpEl.value;
    const victim = victimEl.value;

    let data = {
      pasal: '196',
      ref: 'Rujukan: Pasal 196',
      tag: 'Lex Talionis (Pembalasan Setimpal)',
      tagClass: 'social-tag-awilum',
      title: '',
      desc: '',
      quote: '',
      note: '',
      link: 'hukum-pidana.html#pasal-196'
    };

    // 1. MERUSAK MATA
    if (crime === 'eye') {
      if (victim === 'awilum') {
        data.pasal = '196';
        data.ref = 'Rujukan: Pasal 196';
        data.tag = 'Lex Talionis Mutlak';
        data.tagClass = 'social-tag-awilum';
        data.title = perp === 'wardum'
          ? 'Vonis: Mata Pelaku Dibutakan (atau Hukuman Fisik Berat oleh Hakim)'
          : 'Vonis: Mata Pelaku Harus Dibutakan!';
        data.desc = 'Korban adalah seorang Awilum (bangsawan merdeka). Hukum Hammurabi menolak kompensasi uang untuk cedera permanen pada tubuh bangsawan: mata harus dibayar dengan mata.';
        data.quote = '"If a man destroy the eye of a man (gentleman), they shall destroy his eye."';
        data.note = 'Konsep: Kesetaraan biologis hanya berlaku ketika korbannya berstatus bangsawan (Awilum).';
        data.link = 'hukum-pidana.html#pasal-196';
      } else if (victim === 'mushkenum') {
        data.pasal = '198';
        data.ref = 'Rujukan: Pasal 198';
        data.tag = 'Kompensasi Finansial Perak';
        data.tagClass = 'social-tag-mushkenum';
        data.title = 'Vonis: Denda Tunai 1 Mana Perak (Tanpa Mutilasi)';
        data.desc = 'Karena korban berstatus Mushkenum (rakyat biasa), pelaku TIDAK dibutakan matanya, melainkan wajib membayar denda sebesar 1 Mana perak (sekitar 500 gram perak murni).';
        data.quote = '"If one destroy the eye of a freeman (mushkenum)... he shall pay one mana of silver."';
        data.note = 'Nilai Ekonomi: 1 Mana perak (60 syikal) setara dengan upah buruh tani bekerja selama kurang lebih 10 tahun penuh!';
        data.link = 'hukum-pidana.html#pasal-198';
      } else {
        data.pasal = '199';
        data.ref = 'Rujukan: Pasal 199';
        data.tag = 'Ganti Rugi Properti Tuan';
        data.tagClass = 'social-tag-wardum';
        data.title = 'Vonis: Membayar Separuh Harga Pasar Budak kepada Majikannya';
        data.desc = 'Karena korban berstatus Wardum (budak), kecacatan mata dinilai sebagai penurunan nilai aset produksi. Pelaku wajib membayar 50% harga beli budak tersebut kepada pemiliknya.';
        data.quote = '"If one destroy the eye of a man\'s slave... he shall pay one-half his price."';
        data.note = 'Nilai Ekonomi: Harga rata-rata budak sekitar 20 syikal perak, sehingga dendanya sekitar 10 syikal perak yang diserahkan ke majikan budak.';
        data.link = 'hukum-pidana.html#pasal-199';
      }
    }

    // 2. MEMATAHKAN TULANG
    else if (crime === 'bone') {
      if (victim === 'awilum') {
        data.pasal = '197';
        data.ref = 'Rujukan: Pasal 197';
        data.tag = 'Lex Talionis Mutlak';
        data.tagClass = 'social-tag-awilum';
        data.title = 'Vonis: Tulang Pelaku Harus Dipatahkan!';
        data.desc = 'Mematahkan tulang seorang bangsawan merdeka (Awilum) dibalas langsung dengan mematahkan bagian tulang yang sama pada tubuh pelaku.';
        data.quote = '"If one break a man\'s bone, they shall break his bone."';
        data.note = 'Prinsip proporsionalitas kuno agar keluarga korban tidak membalas dengan membunuh pelaku.';
        data.link = 'hukum-pidana.html#pasal-197';
      } else if (victim === 'mushkenum') {
        data.pasal = '198';
        data.ref = 'Rujukan: Pasal 198';
        data.tag = 'Kompensasi Finansial Perak';
        data.tagClass = 'social-tag-mushkenum';
        data.title = 'Vonis: Denda Tunai 1 Mana Perak';
        data.desc = 'Tulang pelaku tetap utuh karena korbannya rakyat biasa (Mushkenum). Sebagai gantinya, pelaku wajib menyerahkan 1 Mana perak (60 syikal).';
        data.quote = '"If one destroy the eye of a freeman or break the bone of a freeman, he shall pay 1 mana of silver."';
        data.note = 'Catatan: Denda patah tulang rakyat biasa disamakan nilainya dengan kehilangan satu mata (1 Mana perak).';
        data.link = 'hukum-pidana.html#pasal-198';
      } else {
        data.pasal = '199';
        data.ref = 'Rujukan: Pasal 199';
        data.tag = 'Ganti Rugi Properti';
        data.tagClass = 'social-tag-wardum';
        data.title = 'Vonis: Membayar Separuh Harga Budak kepada Tuannya';
        data.desc = 'Tulang budak yang patah mengurangi daya kerjanya di ladang/rumah. Pelaku membayar setengah nilai budak tersebut kepada majikannya.';
        data.quote = '"If one destroy the eye of a man\'s slave, or break a bone of a man\'s slave, he shall pay one-half his price."';
        data.note = 'Budak dilindungi secara tidak langsung melalui perlindungan nilai investasi majikannya.';
        data.link = 'hukum-pidana.html#pasal-199';
      }
    }

    // 3. MERONTOKKAN GIGI
    else if (crime === 'tooth') {
      if (victim === 'awilum') {
        data.pasal = '200';
        data.ref = 'Rujukan: Pasal 200';
        data.tag = 'Gigi Ganti Gigi';
        data.tagClass = 'social-tag-awilum';
        data.title = 'Vonis: Gigi Pelaku Harus Dirontokkan!';
        data.desc = 'Merontokkan gigi sesama warga berderajat bangsawan (Awilum) dihukum dengan memukul rontok gigi pelaku di pengadilan.';
        data.quote = '"If a man knock out a tooth of a man of his own rank, they shall knock out his tooth."';
        data.note = 'Inilah sumber historis ungkapan "Gigi ganti gigi" sebelum dicatat dalam tradisi hukum Timur Dekat berikutnya.';
        data.link = 'hukum-pidana.html#pasal-200';
      } else if (victim === 'mushkenum') {
        data.pasal = '201';
        data.ref = 'Rujukan: Pasal 201';
        data.tag = 'Denda Perak';
        data.tagClass = 'social-tag-mushkenum';
        data.title = 'Vonis: Denda 1/3 Mana Perak (20 Syikal)';
        data.desc = 'Jika gigi yang rontok adalah milik seorang Mushkenum (rakyat jelata), pelaku cukup membayar denda sepertiga mana perak (sekitar 165 gram perak).';
        data.quote = '"If one knock out the tooth of a freeman, he shall pay one-third mana of silver."';
        data.note = 'Nilai Ekonomi: 20 syikal perak setara dengan harga beli 1 orang budak dewasa atau 3 tahun upah buruh kasar.';
        data.link = 'hukum-pidana.html#pasal-200';
      } else {
        data.pasal = '199';
        data.ref = 'Rujukan: Analogi Pasal 199 & 201';
        data.tag = 'Ganti Rugi Majikan';
        data.tagClass = 'social-tag-wardum';
        data.title = 'Vonis: Ganti Rugi Kerusakan Fisik kepada Majikan Budak';
        data.desc = 'Prasasti tidak merinci pasal khusus gigi untuk budak, namun hakim menerapkan kompensasi proporsional di bawah 20 syikal perak kepada tuan pemiliknya.';
        data.quote = '"If one destroy the eye of a man\'s slave, or break a bone of a man\'s slave, he shall pay one-half his price."';
        data.note = 'Dalam peradilan Babilonia, hakim menggunakan analogi pasal terdekat untuk cedera ringan pada budak.';
        data.link = 'hukum-pidana.html#pasal-199';
      }
    }

    // 4. MENAMPAR PIPI (PENGHINAAN KEHORMATAN)
    else if (crime === 'slap') {
      if (perp === 'wardum' && victim === 'awilum') {
        data.pasal = '205';
        data.ref = 'Rujukan: Pasal 205';
        data.tag = 'Pelanggaran Hierarki Kasta';
        data.tagClass = 'social-tag-wardum';
        data.title = 'Vonis: Telinga Budak Harus Dipotong!';
        data.desc = 'Seorang budak (Wardum) yang berani menampar pipi seorang bangsawan/anak bangsawan (Awilum) dianggap melakukan pembangkangan sosial ekstrem.';
        data.quote = '"If a man\'s slave strike a man\'s son, they shall cut off his ear."';
        data.note = 'Telinga dalam budaya Mesopotamia adalah simbol kepatuhan dan pendengaran seorang pelayan.';
        data.link = 'hukum-pidana.html#pasal-202';
      } else if (perp === 'awilum' && victim === 'awilum') {
        data.pasal = '202';
        data.ref = 'Rujukan: Pasal 202 & 203';
        data.tag = 'Hukuman Cambuk / Denda Kehormatan';
        data.tagClass = 'social-tag-awilum';
        data.title = 'Vonis: 60 Cambukan Ekor Lembu (Jika Korban Lebih Tinggi) atau Denda 1 Mana Perak (Jika Setara)';
        data.desc = 'Jika pelaku menampar bangsawan yang pangkatnya lebih tinggi, ia dicambuk 60 kali di depan majelis umum! Jika setara derajatnya, ia membayar denda kehormatan 1 Mana perak.';
        data.quote = '"If a man strike the person of a man who is his superior, he shall receive 60 strokes with an ox-tail whip in public. If of his own rank, he shall pay 1 mana of silver."';
        data.note = 'Menampar pipi di depan umum dinilai sebagai serangan terhadap martabat dan kehormatan kasta.';
        data.link = 'hukum-pidana.html#pasal-202';
      } else if (perp === 'mushkenum' && victim === 'mushkenum') {
        data.pasal = '204';
        data.ref = 'Rujukan: Pasal 204';
        data.tag = 'Denda Ringan Antar-Rakyat';
        data.tagClass = 'social-tag-mushkenum';
        data.title = 'Vonis: Denda 10 Syikal Perak';
        data.desc = 'Tamparan pipi antar sesama rakyat biasa (Mushkenum) diselesaikan dengan denda perdata sebesar 10 syikal perak (1/6 dari denda bangsawan).';
        data.quote = '"If a freeman strike the person of a freeman, he shall pay 10 shekels of silver."';
        data.note = 'Perbandingan mencolok: Harga kehormatan pipi Awilum (60 syikal) dinilai 6 kali lipat dari pipi Mushkenum (10 syikal).';
        data.link = 'hukum-pidana.html#pasal-202';
      } else {
        data.pasal = '202';
        data.ref = 'Rujukan: Pasal 202–204';
        data.tag = 'Sanksi Hierarki Sosial';
        data.tagClass = 'social-tag-mushkenum';
        data.title = perp === 'mushkenum' && victim === 'awilum'
          ? 'Vonis: 60 Cambukan Cambuk Ekor Lembu di Muka Umum!'
          : 'Vonis: Denda Kompensasi Ringan (10 Syikal Perak)';
        data.desc = perp === 'mushkenum' && victim === 'awilum'
          ? 'Rakyat biasa yang menampar bangsawan dianggap menyerang atasan sosialnya dan dihukum cambuk 60 kali di hadapan sidang kota.'
          : 'Bangsawan yang menampar kelas di bawahnya hanya dikenai sanksi denda perak ringan.';
        data.quote = '"If a man strike the person of a man who is his superior, he shall receive 60 strokes with an ox-tail whip in public."';
        data.note = 'Hukum Hammurabi sangat menjaga batas sopan santun dari kelas bawah terhadap kelas atas.';
        data.link = 'hukum-pidana.html#pasal-202';
      }
    }

    // 5. MEMUKUL WANITA HAMIL HINGGA KEGUGURAN
    else if (crime === 'miscarriage') {
      if (victim === 'awilum') {
        data.pasal = '209';
        data.ref = 'Rujukan: Pasal 209';
        data.tag = 'Kompensasi Janin Bangsawan';
        data.tagClass = 'social-tag-awilum';
        data.title = 'Vonis: Denda 10 Syikal Perak untuk Janin yang Gugur';
        data.desc = 'Pelaku yang memukul putri bangsawan (Awilum) hingga mengalami keguguran wajib membayar kompensasi 10 syikal perak.';
        data.quote = '"If a man strike a man\'s daughter and bring about a miscarriage, he shall pay 10 shekels of silver for that which was in her womb."';
        data.note = '10 syikal perak setara dengan sekitar 83 gram perak murni.';
        data.link = 'hukum-pidana.html#pasal-209';
      } else if (victim === 'mushkenum') {
        data.pasal = '211';
        data.ref = 'Rujukan: Pasal 211';
        data.tag = 'Kompensasi Janin Rakyat Biasa';
        data.tagClass = 'social-tag-mushkenum';
        data.title = 'Vonis: Denda 5 Syikal Perak';
        data.desc = 'Jika wanita hamil yang keguguran berasal dari kelas rakyat biasa (Mushkenum), denda turun menjadi setengahnya, yaitu 5 syikal perak.';
        data.quote = '"If through a stroke he bring about a miscarriage to the daughter of a freeman, he shall pay 5 shekels of silver."';
        data.note = 'Stratifikasi kasta bahkan berlaku sejak janin masih berada di dalam kandungan.';
        data.link = 'hukum-pidana.html#pasal-209';
      } else {
        data.pasal = '213';
        data.ref = 'Rujukan: Pasal 213';
        data.tag = 'Kompensasi Janin Budak';
        data.tagClass = 'social-tag-wardum';
        data.title = 'Vonis: Denda 2 Syikal Perak kepada Pemilik Budak';
        data.desc = 'Jika wanita hamil tersebut adalah budak perempuan (Wardum), pelaku membayar 2 syikal perak kepada majikan budak itu.';
        data.quote = '"If he strike the female slave of a man and bring about a miscarriage, he shall pay 2 shekels of silver."';
        data.note = 'Perbandingan nilai ganti rugi janin: Awilum (10 syikal) : Mushkenum (5 syikal) : Wardum (2 syikal).';
        data.link = 'hukum-pidana.html#pasal-209';
      }
    }

    // 6. MEMUKUL WANITA HAMIL HINGGA TEWAS
    else if (crime === 'pregnant_death') {
      if (victim === 'awilum') {
        data.pasal = '210';
        data.ref = 'Rujukan: Pasal 210';
        data.tag = 'Hukuman Vikarius (Anak Pelaku Dihukum)';
        data.tagClass = 'social-tag-awilum';
        data.title = 'Vonis: Anak Perempuan Pelaku Harus Dihukum Mati!';
        data.desc = 'Jika putri bangsawan yang dipukul itu meninggal dunia, maka BUKAN pelaku yang dihukum mati, melainkan ANAK PEREMPUAN PELAKU yang dieksekusi mati!';
        data.quote = '"If that woman die, they shall put his daughter to death."';
        data.note = 'Kontroversi Sejarah: Ini adalah contoh "Vicarious Punishment" (pembalasan pada anak pelaku) yang ditolak keras oleh hukum modern.';
        data.link = 'hukum-pidana.html#pasal-209';
      } else if (victim === 'mushkenum') {
        data.pasal = '212';
        data.ref = 'Rujukan: Pasal 212';
        data.tag = 'Denda Nyawa Rakyat Biasa';
        data.tagClass = 'social-tag-mushkenum';
        data.title = 'Vonis: Denda 1/2 Mana Perak (30 Syikal)';
        data.desc = 'Jika wanita rakyat biasa itu meninggal dunia, anak perempuan pelaku tidak dihukum mati; pelaku cukup membayar denda setengah mana perak (30 syikal).';
        data.quote = '"If that woman die, he shall pay one-half mana of silver."';
        data.note = 'Nyawa seorang wanita Mushkenum ditebus secara finansial dengan 30 syikal perak.';
        data.link = 'hukum-pidana.html#pasal-209';
      } else {
        data.pasal = '214';
        data.ref = 'Rujukan: Pasal 214';
        data.tag = 'Ganti Rugi Kematian Budak';
        data.tagClass = 'social-tag-wardum';
        data.title = 'Vonis: Denda 1/3 Mana Perak (20 Syikal) kepada Majikan';
        data.desc = 'Jika budak perempuan yang hamil itu meninggal dunia akibat pukulan, pelaku wajib membayar 20 syikal perak (harga penuh 1 orang budak) kepada tuannya.';
        data.quote = '"If that female slave die, he shall pay one-third mana of silver."';
        data.note = '1/3 Mana (20 syikal) adalah harga standar penggantian seorang budak di pasar Babilonia.';
        data.link = 'hukum-pidana.html#pasal-209';
      }
    }

    // 7. MALPRAKTIK TABIB BEDAH
    else if (crime === 'surgery_fail') {
      if (victim === 'awilum' || victim === 'mushkenum') {
        data.pasal = '218';
        data.ref = 'Rujukan: Pasal 218';
        data.tag = 'Liabilitas Profesi Medis';
        data.tagClass = 'social-tag-awilum';
        data.title = 'Vonis: Jari-Jari Tangan Tabib Harus Dipotong!';
        data.desc = 'Jika seorang tabib membedah pasien orang merdeka dengan pisau perunggu dan menyebabkan kematian pasien atau membutakan matanya, tangan tabib itu harus diamputasi agar tidak bisa lagi membedah.';
        data.quote = '"If a physician operate on a man for a severe wound with a bronze lancet and cause the man\'s death... they shall cut off his fingers."';
        data.note = 'Sebaliknya, bila operasi sukses (Pasal 215–216), tabib menerima upah tinggi: 10 syikal dari Awilum atau 5 syikal dari Mushkenum.';
        data.link = 'hukum-pidana.html#pasal-215';
      } else {
        data.pasal = '219';
        data.ref = 'Rujukan: Pasal 219 & 220';
        data.tag = 'Ganti Rugi Medis pada Budak';
        data.tagClass = 'social-tag-wardum';
        data.title = 'Vonis: Mengganti Budak Baru (Jika Mati) atau Bayar 1/2 Harga Budak (Jika Buta)';
        data.desc = 'Jika pasien yang meninggal di meja operasi adalah budak, jari tabib TIDAK dipotong. Tabib wajib mengganti dengan budak yang setara (Pasal 219), atau membayar separuh harganya jika matanya menjadi buta (Pasal 220).';
        data.quote = '"If a physician operate on a slave of a freeman... and cause his death, he shall restore a slave of equal value."';
        data.note = 'Risiko profesi dokter jauh lebih ringan saat mengoperasi budak dibandingkan saat mengoperasi bangsawan.';
        data.link = 'hukum-pidana.html#pasal-215';
      }
    }

    // 8. RUMAH ROBOH (TUKANG BANGUNAN)
    else if (crime === 'house_collapse') {
      if (victim === 'awilum' || victim === 'mushkenum') {
        data.pasal = '229';
        data.ref = 'Rujukan: Pasal 229 & 230';
        data.tag = 'Liabilitas Mutlak Konstruksi';
        data.tagClass = 'social-tag-awilum';
        data.title = 'Vonis: Tukang Bangunan Dihukum Mati! (Atau Anaknya Dihukum Mati bila Korban adalah Anak Pemilik)';
        data.desc = 'Jika tukang membangun rumah dengan konstruksi rapuh hingga roboh dan menewaskan pemilik rumah, tukang itu wajib dihukum mati (Pasal 229). Jika yang tewas adalah anak pemilik rumah, maka anak tukang bangunan itu yang dihukum mati (Pasal 230)!';
        data.quote = '"If a builder build a house for a man and do not make its construction firm, and the house collapse and cause the death of the owner, that builder shall be put to death."';
        data.note = 'Selain hukuman mati, seluruh harta benda yang hancur wajib diganti dan rumah dibangun ulang dari harta pribadi sang tukang (Pasal 232).';
        data.link = 'hukum-pidana.html#pasal-228';
      } else {
        data.pasal = '231';
        data.ref = 'Rujukan: Pasal 231';
        data.tag = 'Ganti Rugi Budak Tertimpa Rumah';
        data.tagClass = 'social-tag-wardum';
        data.title = 'Vonis: Tukang Wajib Mengganti Budak Setara ("Budak Ganti Budak")';
        data.desc = 'Jika rumah yang roboh menewaskan seorang budak milik pemilik rumah, tukang bangunan tidak dihukum mati, melainkan wajib menyerahkan satu orang budak pengganti yang setara nilainya kepada pemilik rumah.';
        data.quote = '"If it cause the death of a slave of the owner of the house, he shall give to the owner of the house a slave of equal value."';
        data.note = 'Tambahannya, tukang tetap wajib membangun kembali rumah yang roboh tersebut atas biaya sendiri (Pasal 232).';
        data.link = 'hukum-pidana.html#pasal-228';
      }
    }

    // Render ke DOM
    badgeEl.textContent = data.pasal;
    refEl.textContent = data.ref;
    tagEl.textContent = data.tag;
    tagEl.className = `social-tag ${data.tagClass}`;
    titleEl.textContent = data.title;
    descEl.textContent = data.desc;
    quoteEl.textContent = data.quote;
    noteEl.innerHTML = `<strong>Catatan Konteks:</strong> ${data.note}`;
    linkEl.setAttribute('href', data.link);
  }

  crimeEl.addEventListener('change', evaluateVerdict);
  perpEl.addEventListener('change', evaluateVerdict);
  victimEl.addEventListener('change', evaluateVerdict);

  if (randomBtn) {
    randomBtn.addEventListener('click', () => {
      const crimes = Array.from(crimeEl.options).map(o => o.value);
      const classes = ['awilum', 'mushkenum', 'wardum'];
      crimeEl.value = crimes[Math.floor(Math.random() * crimes.length)];
      perpEl.value = classes[Math.floor(Math.random() * classes.length)];
      victimEl.value = classes[Math.floor(Math.random() * classes.length)];
      evaluateVerdict();
    });
  }

  evaluateVerdict();
}

/* ==========================================================================
   7. UPDATE OTOMATIS TEKS FOOTER ("Tanpa JavaScript" -> "Interactive JS")
   ========================================================================== */
function updateFooterBadge() {
  const footers = document.querySelectorAll('.site-footer p');
  footers.forEach(p => {
    if (p.textContent.includes('tanpa JavaScript')) {
      p.textContent = p.textContent.replace('Murni HTML5 & CSS3 tanpa JavaScript', 'HTML5, CSS3 & Interactive Vanilla JS');
    }
  });
}