/* ============================================================
   WAHYU PRATOMO — TAHAP 1: BERANDA
   Urutan: loading (5 petir -> 1 -> 2 + Wahyu/Pratomo) -> Beranda.
   ============================================================ */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* dibaca ulang saat dibutuhkan: di beberapa browser/perangkat, preferensi
     ini baru terbaca setelah skrip mulai berjalan */
  const prefersReduce = () =>
    reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* Kurva kecepatan trapesium: naik pelan (a), konstan, turun pelan (a),
     dinormalkan ke 0..1. Dipakai untuk putaran agar akselerasi dan
     deselerasinya tidak terasa sebagai hentakan. */
  const trapEase = (t, a) => {
    const k = clamp(t, 0, 1);
    const peak = 1 / (1 - a);
    if (k < a) return (k * k * peak) / (2 * a);
    if (k > 1 - a) {
      const d = 1 - k;
      return 1 - (d * d * peak) / (2 * a);
    }
    return peak * (a / 2 + (k - a));
  };

  const loader = document.getElementById("loader");
  document.documentElement.classList.add("is-loading");

  /* ==========================================================
     1. AUTO-FIT NAMA: baris terpanjang mengisi lebar layar
     ========================================================== */
  const nameEl = document.querySelector(".name");
  const nameLines = Array.from(document.querySelectorAll(".name__inner"));

  const fitName = () => {
    if (!nameEl || nameLines.length === 0) return;
    const prev = nameEl.style.fontSize;
    nameEl.style.fontSize = "100px";
    const avail = nameEl.clientWidth;
    let max = 0;
    nameLines.forEach((el) => {
      max = Math.max(max, el.offsetWidth);
    });
    if (!max || !avail) {
      nameEl.style.fontSize = prev;
      return;
    }
    const size = (avail / max) * 100 * 0.985;
    nameEl.style.fontSize = clamp(size, 34, 420) + "px";

    /* kalau nama terlalu besar sampai Beranda melebihi satu layar
       (jendela lebar tapi pendek), perkecil seperlunya agar tombol
       dan deskripsi tetap terlihat di layar pertama */
    const home = nameEl.closest(".home");
    if (home) {
      const over = home.clientHeight - window.innerHeight;
      if (over > 0) {
        const nameH = nameEl.getBoundingClientRect().height;
        const next = nameH - over;
        if (nameH > 0 && next > 60) {
          const base = parseFloat(nameEl.style.fontSize) || size;
          nameEl.style.fontSize = Math.max(34, base * (next / nameH) * 0.995) + "px";
        }
      }
    }
  };

  fitName();
  window.addEventListener("resize", fitName);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitName);

  /* ==========================================================
     2. PARALLAX NAMA (aktif setelah animasi masuk selesai)
     ========================================================== */
  const lines = Array.from(document.querySelectorAll(".name__line")).map((el) => ({
    el,
    inner: el.querySelector(".name__inner"),
    depth: parseFloat(el.dataset.depth || "0.4"),
    dir: el.classList.contains("name__line--second") ? -1 : 1,
  }));

  const circuit = document.querySelector(".circuit__g");
  const circuitDepth = circuit ? parseFloat(circuit.dataset.depth || "0.15") : 0;

  let entranceDone = false;
  let targetX = 0;
  let targetY = 0;
  let curX = 0;
  let curY = 0;
  let scrollY = window.scrollY;
  let smoothScroll = scrollY;
  let running = false;

  const apply = () => {
    curX = lerp(curX, targetX, 0.075);
    curY = lerp(curY, targetY, 0.075);
    smoothScroll = lerp(smoothScroll, scrollY, 0.1);

    lines.forEach(({ el, inner, depth, dir }) => {
      const tx = curX * depth * 26 * dir;
      const ty = curY * depth * 14 + smoothScroll * -0.08 * depth * 10;
      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      if (inner && entranceDone) {
        inner.style.transform = `skewY(${(curX * depth * dir * 0.5).toFixed(2)}deg)`;
      }
    });

    if (circuit) {
      circuit.style.transform = `translate3d(${(curX * circuitDepth * 40).toFixed(
        2
      )}px, ${(curY * circuitDepth * 30 + smoothScroll * -circuitDepth * 0.5).toFixed(2)}px, 0)`;
    }

    const settled =
      Math.abs(targetX - curX) < 0.001 &&
      Math.abs(targetY - curY) < 0.001 &&
      Math.abs(scrollY - smoothScroll) < 0.05;
    if (settled) running = false;
    else requestAnimationFrame(apply);
  };

  const kick = () => {
    if (!running) {
      running = true;
      requestAnimationFrame(apply);
    }
  };

  if (finePointer && !reduceMotion) {
    window.addEventListener(
      "pointermove",
      (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
        kick();
      },
      { passive: true }
    );
  }

  window.addEventListener(
    "scroll",
    () => {
      scrollY = window.scrollY;
      kick();
    },
    { passive: true }
  );

  /* ==========================================================
     3. KURSOR KUSTOM
     ========================================================== */
  const cursor = document.getElementById("cursor");
  if (cursor && finePointer && !reduceMotion) {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    let rafId = null;

    const loop = () => {
      cx = lerp(cx, mx, 0.2);
      cy = lerp(cy, my, 0.2);
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (Math.abs(mx - cx) > 0.05 || Math.abs(my - cy) > 0.05) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
      }
    };

    window.addEventListener(
      "pointermove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!rafId) rafId = requestAnimationFrame(loop);
      },
      { passive: true }
    );

    const hoverable = (el) => el && el.closest && el.closest("a, button, .pcard__frame, .slist__item");

    document.addEventListener("pointerover", (e) => {
      if (hoverable(e.target)) document.body.classList.add("is-hover");
    });
    document.addEventListener("pointerout", (e) => {
      const from = hoverable(e.target);
      if (!from) return;
      if (hoverable(e.relatedTarget) === from) return;
      document.body.classList.remove("is-hover");
    });
  }

  /* ==========================================================
     4. LOADING
     Empat tugasnya:
       a. tanda proses aktif  -> lima petir menyala bertahap 1..5
       b. menutupi tata letak yang belum siap (overlay penuh)
       c. menunggu aset penting (font, CSS, gambar utama) siap
       d. mengalihkan perhatian sebentar, lalu menyerahkan layar
     Serah-terimanya bukan "terbang ke nama": kelima petir menyatu,
     lalu petir tunggal melepas SENGATAN LISTRIK (kilat penuh layar,
     gelombang, percikan) dan Beranda muncul di baliknya.
     ========================================================== */

  /* parallax baru hidup setelah animasi masuk nama selesai */
  const afterEntrance = () => {
    let pending = nameLines.length;
    if (pending === 0) {
      entranceDone = true;
      kick();
      return;
    }
    nameLines.forEach((el) => {
      el.addEventListener(
        "animationend",
        () => {
          pending -= 1;
          if (pending <= 0) {
            entranceDone = true;
            kick();
          }
        },
        { once: true }
      );
    });
    setTimeout(() => {
      entranceDone = true;
      kick();
    }, 1800);
  };

  /* sengatan listrik: pemicu serah-terima, bukan elemen yang terbang */
  let discharged = false;
  const discharge = () => {
    if (discharged) return;
    discharged = true;

    document.documentElement.classList.remove("is-loading");
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-loaded");

    if (loader) {
      loader.classList.add("is-shock");
      setTimeout(() => {
        if (loader) loader.classList.add("is-done");
      }, 680);
      setTimeout(() => {
        if (loader) loader.remove();
      }, 1050);
    }

    afterEntrance();
    fitName();
  };

  /* aset penting: font + gambar yang belum selesai + event load dokumen
     (event load sudah mencakup CSS/font/gambar utama).
     Batas tunggu dibuat pendek (maks 3.4s) supaya pengunjung tidak bosan
     kalau jaringan lambat — sisa gambar tetap dimuat dengan lazy loading. */
  const whenReady = (cb) => {
    const checks = [];

    if (document.fonts && document.fonts.ready) {
      checks.push(document.fonts.ready.catch(() => {}));
    }

    if (document.readyState !== "complete") {
      checks.push(
        new Promise((res) => {
          window.addEventListener("load", res, { once: true });
          setTimeout(res, 3200);
        })
      );
    }

    /* gambar yang langsung terlihat saat halaman dibuka: hanya foto About.
       Foto proyek di bawah sengaja lazy-load, jadi jangan ditunggu —
       kalau ditunggu, event load-nya tidak pernah datang di layar awal. */
    const hero = Array.from(document.querySelectorAll(".about__frame img")).filter(
      (img) => img.loading !== "lazy" && !img.complete
    );
    if (hero.length) {
      checks.push(
        Promise.all(
          hero.map(
            (img) =>
              new Promise((res) => {
                img.addEventListener("load", res, { once: true });
                img.addEventListener("error", res, { once: true });
              })
          )
        )
      );
    }

    // selesai ketika semua siap ATAU batas waktu tercapai — tidak pernah menggantung
    Promise.race([
      Promise.all(checks).catch(() => {}),
      new Promise((res) => setTimeout(res, 2200)),
    ]).then(cb, cb);
  };

  if (!loader) {
    document.documentElement.classList.remove("is-loading");
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-loaded");
    afterEntrance();
  } else if (prefersReduce()) {
    // hormati preferensi: langsung ke akhir, tanpa koreografi panjang
    loader.classList.add("is-converge");
    discharge();
  } else {
    // lima petir menyala bertahap, TEPAT 1 detik per petir, mulai detik ke-1
    // (CSS delay 1000/2000/3000/4000/5000 ms) + durasi muncul 450 ms
    const T_BOLTS = 5450;
    // berdenyut sebentar setelah kelima petir menyala — beri waktu menghitung
    const T_PULSE = 900;
    // kelimanya menyatu jadi satu petir
    const T_CONVERGE = 520;
    // jeda singkat supaya petir tunggal terlihat "terisi" sebelum melepas
    const T_CHARGE = 320;

    // aset mulai dicek sejak awal, paralel dengan koreografi petir —
    // jadi saat petir siap, biasanya tidak ada sisa tunggu
    const ready = new Promise((res) => whenReady(res));

    setTimeout(() => {
      if (loader) loader.classList.add("is-converge");
    }, T_BOLTS + T_PULSE);

    const T_SHOCK = T_BOLTS + T_PULSE + T_CONVERGE + T_CHARGE;
    setTimeout(() => {
      if (!loader) return;
      // tunggu aset, tapi maksimal 1,6s lagi supaya tidak menggantung
      Promise.race([ready, new Promise((r) => setTimeout(r, 1600))]).then(discharge);
    }, T_SHOCK);
    // jaring pengaman terakhir
    setTimeout(() => {
      if (loader && !discharged) discharge();
    }, T_SHOCK + 2200);
  }

  /* ==========================================================
     5. ANIMASI MASUK ANTAR BAGIAN
     elemen .reveal muncul saat bagiannya masuk viewport
     ========================================================== */
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));

  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -4% 0px", threshold: 0 }
      );
      revealEls.forEach((el) => io.observe(el));
    }
  }

  /* ==========================================================
     6b. ABOUT: animasi masuk + keluar menuju bagian berikutnya
     ========================================================== */
  const aboutSec = document.getElementById("about");
  if (aboutSec) {
    let aboutRaf = null;
    const updateAbout = () => {
      aboutRaf = null;
      if (reduceMotion) return;
      const rect = aboutSec.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 saat About masih nyaman di layar, 1 saat hampir keluar ke atas
      const out = clamp((vh * 0.86 - rect.bottom) / (vh * 0.62), 0, 1);
      aboutSec.style.setProperty("--out", out.toFixed(3));
    };
    const requestAbout = () => {
      if (aboutRaf === null) aboutRaf = requestAnimationFrame(updateAbout);
    };

    updateAbout();
    window.addEventListener("scroll", requestAbout, { passive: true });
    window.addEventListener("resize", requestAbout);

    if (reduceMotion || !("IntersectionObserver" in window)) {
      aboutSec.classList.add("is-in");
    } else {
      const aboutIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              aboutSec.classList.add("is-in");
              aboutIO.unobserve(aboutSec);
            }
          });
        },
        { threshold: 0.12 }
      );
      aboutIO.observe(aboutSec);
    }
  }

  /* ==========================================================
     6c. ORGANISASI: animasi keluar saat menuju Contact
     Tiap kartu dinilai dari posisinya sendiri, jadi kartu atas pudar
     lebih dulu daripada kartu bawah — bukan seluruh bagian sekaligus.
     ========================================================== */
  const orgSec = document.getElementById("organisasi");
  if (orgSec) {
    const orgCards = Array.from(orgSec.querySelectorAll(".ocard"));
    let orgRaf = null;
    const updateOrg = () => {
      orgRaf = null;
      if (reduceMotion) return;
      const vh = window.innerHeight;
      orgCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        // 0 saat kartu masih utuh di layar, 1 saat tepi bawahnya
        // melewati bagian atas layar
        const out = clamp((vh * 0.94 - rect.bottom) / (vh * 0.5), 0, 1);
        card.style.setProperty("--out", out.toFixed(3));
      });
    };
    const requestOrg = () => {
      if (orgRaf === null) orgRaf = requestAnimationFrame(updateOrg);
    };

    updateOrg();
    window.addEventListener("scroll", requestOrg, { passive: true });
    window.addEventListener("resize", requestOrg);
  }

  /* ==========================================================
     6d. SKILL: kartu menyebar dari tumpukan + sorot daftar
     ========================================================== */
  const skillSec = document.getElementById("skill");
  const deck = document.getElementById("deck");
  if (skillSec) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      skillSec.classList.add("is-in");
    } else {
      const introIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              skillSec.classList.add("is-in");
              introIO.disconnect();
            }
          });
        },
        { threshold: 0.16 }
      );
      introIO.observe(skillSec);
    }
  }

  if (deck) {
    const cards = Array.from(deck.querySelectorAll(".scard"));
    const rows = Array.from(document.querySelectorAll(".slist__item"));
    const grid = deck.closest(".skill__grid") || deck.parentElement;
    const box = deck.closest(".deckbox") || deck;
    const mqWide = window.matchMedia("(min-width: 901px)");
    let pinTop = 0;
    let travel = 1;

    /* 9 kartu duduk di satu lingkaran (orbit). --cellX/--cellY adalah
       selisih pusat kartu terhadap pusat dek, dipakai untuk menghitung
       geseran supaya kartu bisa berada di orbit sekaligus mendarat pas
       di sel grid-nya. */
    const N = cards.length || 1;
    const cellX = [];
    const cellY = [];
    const baseAng = [];
    let orbitR = 160;
    let orbitKY = 0.4;
    let orbitK = 1;

    /* fase: 0.00–0.54 memutar orbit penuh (dengan easing halus),
       0.54–0.66 mengerut jadi tumpukan di tengah, lalu 0.66–1.00 kartu
       dibagikan satu per satu ke sel grid-nya. Rentang putaran sengaja
       panjang supaya tidak terasa cepat saat digulir. */
    const SPIN_END = 0.54;
    const GATHER_END = 0.66;
    const SPREAD_FIRST = 0.66;
    const SPREAD_STEP = 0.02;
    const SPREAD_WIN = 0.18;
    const spreadStart = [];
    for (let i = 0; i < N; i++) spreadStart.push(SPREAD_FIRST + i * SPREAD_STEP);

    const measureSkill = () => {
      const deckW = deck.clientWidth;
      const deckH = deck.offsetHeight;
      const cw = cards[0] ? cards[0].offsetWidth : deckW / 3;
      /* lebar kartu dipublikasikan supaya ukuran huruf nama di kartu bisa
         menyesuaikan dan tidak terpotong saat dek mengecil */
      deck.style.setProperty("--cw", Math.round(cw) + "px");
      cards.forEach((card, i) => {
        cellX[i] = card.offsetLeft + card.offsetWidth / 2 - deckW / 2;
        cellY[i] = card.offsetTop + card.offsetHeight / 2 - deckH / 2;
        baseAng[i] = (i / N) * Math.PI * 2 - Math.PI / 2;
      });

      /* Jari-jari orbit mengikuti lebar kartu (dek sekarang berdiri sendiri
         di tengah panggung), lalu dibatasi jarak nyata pusat dek ke tepi
         viewport supaya kartu di titik terjauh tidak pernah terpotong. */
      const br = deck.getBoundingClientRect();
      const centerX = br.left + br.width / 2;
      const room = Math.min(centerX, window.innerWidth - centerX) - 12;
      const halfFit = (cw * 0.5) * 0.92;
      orbitR = clamp(
        Math.min(cw * 2.6, room - halfFit),
        cw * 0.9,
        cw * 3.2
      );
      /* Bentuk lingkaran: di dek lebar cukup elips gepeng, tapi di dek
         sempit (mobile) elips gepeng membuat kartu atas/bawah berdesakan.
         Karena itu lingkaran makin bulat saat orbitR mendekati lebar kartu. */
      orbitKY = clamp(0.74 + (1.7 - orbitR / cw) * 0.48, 0.74, 1.06);
      /* Skala kartu saat orbit: cincin di dek sempit terlalu rapat untuk
         ukuran kartu penuh, jadi kartu dikecilkan sebanding kerapatan
         lingkaran (orbitR relatif terhadap lebar kartu). */
      orbitK = clamp((orbitR / cw - 0.55) / 1.15, 0.5, 1);

      const boxH = box.offsetHeight;
      pinTop = Math.max(84, Math.round((window.innerHeight - boxH) / 2));

      if (mqWide.matches) {
        box.style.setProperty("--pin-top", pinTop + "px");
        // ruang gulir tambahan supaya semua kartu selesai mendarat
        if (skillSec) {
          skillSec.style.setProperty("--pin-pad", pinTop + 40 + "px");
        }
        travel = Math.max(1, grid.offsetHeight - boxH);
      } else {
        box.style.removeProperty("--pin-top");
        if (skillSec) skillSec.style.removeProperty("--pin-pad");
      }
    };

    /* gerak idle: dek berputar pelan sendiri walau belum digulir,
       lalu memudar begitu kartu mulai menyebar */
    let idleAng = 0;
    let idleRaf = null;
    let idleLast = 0;
    const idleTick = (t) => {
      const dt = idleLast ? Math.min(48, t - idleLast) : 16;
      idleLast = t;
      idleAng += dt * 0.00028;
      updateSkill();
      idleRaf = requestAnimationFrame(idleTick);
    };

    /* putaran orbit + penyebaran ke grid, keduanya digerakkan gulir */
    let skillRaf = null;
    const updateSkill = () => {
      skillRaf = null;
      if (reduceMotion) {
        cards.forEach((card) => {
          card.style.setProperty("--tx", "0px");
          card.style.setProperty("--ty", "0px");
          card.style.setProperty("--tz", "0px");
          card.style.setProperty("--sc", "1");
          card.style.setProperty("--veil", "0");
          card.style.setProperty("--lift", "0px");
          card.style.setProperty("--rot", "0deg");
          card.style.setProperty("--ax", "0deg");
          card.style.setProperty("--ay", "0deg");
          card.style.removeProperty("z-index");
        });
        return;
      }
      const vh = window.innerHeight;
      let p;
      if (mqWide.matches) {
        // pastikan offset sticky selalu sinkron walau measure sempat terlewat
        box.style.setProperty("--pin-top", pinTop + "px");
        // selama dek "dipin", progres dibaca dari gulir panggung
        const top = grid.getBoundingClientRect().top;
        p = clamp((pinTop - top) / travel, 0, 1);
      } else {
        box.style.removeProperty("--pin-top");
        // di layar sempit dek ikut mengalir: progres dari titik tengah dek,
        // supaya lingkaran berputar saat dek benar-benar terlihat penuh
        const r = box.getBoundingClientRect();
        const center = r.top + r.height / 2;
        p = clamp((vh * 0.72 - center) / (vh * 0.3), 0, 1);
      }

      // lingkaran berputar satu putaran penuh lebih dulu. Profil
      // kecepatannya trapesium halus: naik pelan dari diam, konstan di
      // tengah, lalu turun pelan sampai berhenti tepat sebelum kartu
      // menyebar. Tidak ada hentakan di awal maupun akhir.
      const st = clamp(p / SPIN_END, 0, 1);
      const spinEase = trapEase(st, 0.24);
      const spinScroll = spinEase * Math.PI * 2;
      // ditambah gerak idle yang memudar sebelum kartu mulai menyebar
      const spin = spinScroll + idleAng * (1 - clamp(p / 0.35, 0, 1));

      /* Setelah berputar, lingkaran MENGERUT ke tengah dek menjadi tumpukan
         kecil (belum ada kartu yang mendarat), baru kemudian kartu dibagikan
         satu per satu dari tumpukan itu ke sel grid-nya. Urutan ini yang
         membuat tidak ada kartu yang melayang menembus kartu lain. */
      const gather = clamp((p - SPIN_END) / (GATHER_END - SPIN_END), 0, 1);
      // easing "cepat di awal": lingkaran langsung mengerut jadi tumpukan
      // begitu putaran selesai, jadi fase setengah jadi tidak berlama-lama
      const gatherE = Math.pow(gather, 0.45);
      // radius & kemiringan orbit diluruhkan hampir habis saat mengumpul,
      // supaya hasilnya tumpukan rapi (bukan kipas kartu yang menyebar)
      const liveR = orbitR * Math.pow(1 - gather, 2.6);
      const liveSc = 1 - 0.14 * gatherE;
      const mid = (N - 1) / 2;
      // kemiringan orbit 3D diluruhkan lebih cepat daripada radius, jadi
      // begitu mengumpul kartu sudah tegak dan menumpuk rata
      const tiltK = 1 - Math.pow(gather, 0.35);

      cards.forEach((card, i) => {
        const ts = clamp((p - spreadStart[i]) / SPREAD_WIN, 0, 1);
        const e = 1 - Math.pow(1 - ts, 3);

        const ang = baseAng[i] + spin;
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);

        // titik di lingkaran (elips karena miring), mengecil ke tengah
        const ox = liveR * sin;
        const oy = liveR * orbitKY * cos;

        // saat mengerut jadi tumpukan, tiap kartu diberi sedikit geseran
        // (fan) supaya terlihat seperti dek yang ditumpuk, bukan bertumpuk
        // tepat di satu titik
        const fan = (i - mid) * gatherE;
        const fanK = fan * clamp(orbitK, 0.6, 1);
        const oxf = ox + fanK * 5.2;
        const oyf = oy - fanK * 3.4;

        // kartu di depan lebih besar & lebih dekat kamera. Kartu belakang
        // TIDAK dibuat transparan (supaya tidak terlihat "menembus"), cukup
        // digelapkan lewat --veil seperti kartu yang tertutup bayangan.
        const depth = (cos + 1) / 2;
        // saat masih mengorbit kartu diskalakan agar cincin tidak berdesakan;
        // begitu mengerut jadi tumpukan, skalanya dikembalikan mendekati
        // ukuran penuh supaya tumpukan tetap terbaca (terutama di mobile)
        const scOrbit = (0.76 + 0.22 * depth) * orbitK;
        const scPile = (0.9 + 0.06 * depth) * liveSc;
        const orbitSc = scOrbit + (scPile - scOrbit) * gatherE;
        const orbitTz = -70 + 120 * depth - 40 * (1 - gatherE);

        card.style.setProperty("--tx", ((oxf - cellX[i]) * (1 - e)).toFixed(1) + "px");
        card.style.setProperty("--ty", ((oyf - cellY[i]) * (1 - e)).toFixed(1) + "px");
        card.style.setProperty("--tz", (orbitTz * (1 - e)).toFixed(1) + "px");
        card.style.setProperty("--sc", (1 + (orbitSc - 1) * (1 - e)).toFixed(3));
        card.style.setProperty("--veil", ((0.02 + 0.2 * (1 - depth)) * (1 - e)).toFixed(3));
        card.style.setProperty("--rot", ((sin * 6 * tiltK + fan * 2.2) * (1 - e)).toFixed(2) + "deg");
        card.style.setProperty("--ay", ((sin * 22 * tiltK + fan * 3.5) * (1 - e)).toFixed(2) + "deg");
        card.style.setProperty("--ax", (-5 * cos * tiltK * (1 - e)).toFixed(2) + "deg");
        // kartu yang sedang terbang naik sedikit di puncak jalurnya, jadi
        // terlihat "diambil" dari tumpukan — bukan menembus kartu di bawahnya
        card.style.setProperty("--lift", (Math.sin(Math.PI * ts) * 20).toFixed(1) + "px");

        if (e > 0.985) {
          card.style.removeProperty("z-index");
        } else if (e > 0) {
          // sedang dibagikan ke sel grid → di atas kartu yang sudah mendarat
          card.style.zIndex = "34";
        } else {
          // masih di orbit / tumpukan → urut kedalaman
          card.style.zIndex = String(6 + Math.round(depth * 8));
        }
      });
    };
    const requestSkill = () => {
      if (skillRaf === null) skillRaf = requestAnimationFrame(updateSkill);
    };
    const remeasureSkill = () => {
      measureSkill();
      requestSkill();
    };
    remeasureSkill();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(remeasureSkill);
    }
    window.addEventListener("scroll", requestSkill, { passive: true });
    window.addEventListener("resize", remeasureSkill);

    /* putaran idle hanya berjalan selama dek masih di orbit (belum menyebar)
       dan tidak aktif saat pengguna meminta gerak dikurangi */
    if (!reduceMotion && "IntersectionObserver" in window) {
      const idleIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (idleRaf === null) {
                idleLast = 0;
                idleRaf = requestAnimationFrame(idleTick);
              }
            } else if (idleRaf !== null) {
              cancelAnimationFrame(idleRaf);
              idleRaf = null;
            }
          });
        },
        { threshold: 0.05 }
      );
      idleIO.observe(box);
    }

    const mark = (i, on) => {
      if (i == null || Number.isNaN(i)) return;
      if (cards[i]) cards[i].classList.toggle("is-focus", on);
      if (rows[i]) rows[i].classList.toggle("is-focus", on);
    };

    cards.forEach((card, i) => {
      card.addEventListener("pointerenter", () => mark(i, true));
      card.addEventListener("pointerleave", () => {
        mark(i, false);
        card.style.removeProperty("--hrx");
        card.style.removeProperty("--hry");
      });
      card.addEventListener("focus", () => mark(i, true));
      card.addEventListener("blur", () => {
        mark(i, false);
        card.style.removeProperty("--hrx");
        card.style.removeProperty("--hry");
      });
      card.addEventListener("pointermove", (e) => {
        if (reduceMotion || !finePointer) return;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--hry", (px * 10).toFixed(2) + "deg");
        card.style.setProperty("--hrx", (-py * 10).toFixed(2) + "deg");
      });
    });

    rows.forEach((row, i) => {
      row.addEventListener("pointerenter", () => mark(i, true));
      row.addEventListener("pointerleave", () => mark(i, false));
      row.addEventListener("click", () => {
        const card = cards[i];
        if (!card) return;
        const wasFocused = card.classList.contains("is-focus");
        mark(i, true);
        if (!wasFocused) {
          setTimeout(() => mark(i, false), 1400);
        }
      });
    });
  }

  /* navigasi internal: gulir halus, hormati reduced motion */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      if (history.replaceState) history.replaceState(null, "", id);
    });
  });

  /* ==========================================================
     6. HEADER: latar saat digulir + penanda bagian aktif
     ========================================================== */
  const head = document.querySelector(".head");
  const navLinks = Array.from(document.querySelectorAll(".head__nav a"));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const onScroll = () => {
    if (head) head.classList.toggle("is-stuck", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          navLinks.forEach((a) =>
            a.classList.toggle("is-active", a.getAttribute("href") === id)
          );
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ==========================================================
     7. PROYEK: galeri gambar + lightbox
     ========================================================== */
  const pad2 = (n) => String(n).padStart(2, "0");
  const galleryRoots = Array.from(document.querySelectorAll("[data-gallery]"));

  const buildGallery = (root) => {
    const shots = Array.from(root.querySelectorAll(".pcard__shot"));
    if (!shots.length) return null;

    const total = shots.length;
    const countEl = root.querySelector(".pcard__count");
    const pipWrap = root.querySelector(".pcard__pips");
    const items = shots.map((img) => ({ src: img.getAttribute("src"), alt: img.getAttribute("alt") }));
    const label = root.dataset.label || "";
    let index = 0;

    if (countEl) countEl.innerHTML = `<b>${pad2(1)}</b> / ${pad2(total)}`;

    const pips = [];
    if (pipWrap) {
      pipWrap.innerHTML = "";
      items.forEach((_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "pcard__pip";
        b.setAttribute("aria-label", `Gambar ${i + 1} dari ${total}`);
        b.addEventListener("click", () => go(i - index));
        pipWrap.appendChild(b);
        pips.push(b);
      });
    }

    const paint = () => {
      shots.forEach((s, i) => s.classList.toggle("is-active", i === index));
      pips.forEach((p, i) => {
        p.classList.toggle("is-on", i === index);
        p.setAttribute("aria-current", i === index ? "true" : "false");
      });
      if (countEl) {
        const b = countEl.querySelector("b");
        if (b) b.textContent = pad2(index + 1);
      }
    };

    const go = (d) => {
      index = (index + d + total) % total;
      paint();
    };

    const onPrev = root.querySelector("[data-prev]");
    const onNext = root.querySelector("[data-next]");
    if (onPrev) onPrev.addEventListener("click", () => go(-1));
    if (onNext) onNext.addEventListener("click", () => go(1));

    /* geser / swipe di area gambar */
    const frame = root.querySelector(".pcard__frame");
    if (frame) {
      let x0 = null;
      let y0 = null;
      frame.addEventListener(
        "pointerdown",
        (e) => {
          x0 = e.clientX;
          y0 = e.clientY;
        },
        { passive: true }
      );
      frame.addEventListener(
        "pointerup",
        (e) => {
          if (x0 === null) return;
          const dx = e.clientX - x0;
          const dy = e.clientY - y0;
          x0 = null;
          y0 = null;
          if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
        },
        { passive: true }
      );
      frame.addEventListener("pointercancel", () => {
        x0 = null;
        y0 = null;
      });
    }

    paint();
    return {
      items,
      label,
      get index() {
        return index;
      },
      go,
    };
  };

  const galleries = new Map();
  galleryRoots.forEach((root) => {
    const g = buildGallery(root);
    if (g) {
      galleries.set(root.dataset.gallery, g);
      root.dataset.galleryApi = "1";

      /* klik gambar → buka lightbox */
      const frame = root.querySelector(".pcard__frame");
      if (frame) {
        frame.addEventListener("click", (e) => {
          if (e.target.closest("button")) return;
          openLightbox(root.dataset.gallery);
        });
      }
    }
  });

  /* --- lightbox --- */
  const lb = document.getElementById("lightbox");
  let lbList = [];
  let lbIndex = 0;
  let lbOrigin = null;
  let lbTitle = "";
  let lbCloseTimer = null;

  const lbImg = lb ? lb.querySelector(".lightbox__img") : null;
  const lbLabel = lb ? lb.querySelector(".lightbox__label") : null;
  const lbCount = lb ? lb.querySelector(".lightbox__count") : null;

  const lbPaint = () => {
    if (!lbImg || !lbList.length) return;
    lbImg.src = lbList[lbIndex].src;
    lbImg.alt = lbList[lbIndex].alt || "";
    if (lbCount) lbCount.innerHTML = `<b>${pad2(lbIndex + 1)}</b> / ${pad2(lbList.length)}`;
  };

  const lbStep = (d) => {
    if (!lbList.length) return;
    lbIndex = (lbIndex + d + lbList.length) % lbList.length;
    lbPaint();
  };

  function openLightbox(slug) {
    if (!lb) return;
    const g = galleries.get(slug);
    if (!g) return;

    clearTimeout(lbCloseTimer);
    lbList = g.items;
    lbIndex = g.index;
    lbTitle = g.label;
    lbOrigin = document.activeElement;

    if (lbLabel) lbLabel.textContent = lbTitle;
    lbPaint();

    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add("is-open"));
    document.documentElement.classList.add("lb-open");

    const closeBtn = lb.querySelector("[data-close]");
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  }

  function closeLightbox() {
    if (!lb || lb.hidden) return;
    lb.classList.remove("is-open");
    document.documentElement.classList.remove("lb-open");
    lbCloseTimer = setTimeout(() => {
      lb.hidden = true;
    }, 350);
    if (lbOrigin && typeof lbOrigin.focus === "function") {
      lbOrigin.focus({ preventScroll: true });
    }
  }

  if (lb) {
    lb.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeLightbox));
    const p = lb.querySelector("[data-lb-prev]");
    const n = lb.querySelector("[data-lb-next]");
    if (p) p.addEventListener("click", () => lbStep(-1));
    if (n) n.addEventListener("click", () => lbStep(1));

    lb.addEventListener("click", (e) => {
      if (e.target === lb || e.target.classList.contains("lightbox__stage")) closeLightbox();
    });

    /* swipe di lightbox */
    const stage = lb.querySelector(".lightbox__stage");
    if (stage) {
      let x0 = null;
      stage.addEventListener(
        "pointerdown",
        (e) => {
          x0 = e.clientX;
        },
        { passive: true }
      );
      stage.addEventListener(
        "pointerup",
        (e) => {
          if (x0 === null) return;
          const dx = e.clientX - x0;
          x0 = null;
          if (Math.abs(dx) > 46) lbStep(dx < 0 ? 1 : -1);
        },
        { passive: true }
      );
    }
  }

  /* tombol "Buka galeri" di tiap kartu */
  document.querySelectorAll("[data-open]").forEach((b) => {
    b.addEventListener("click", () => openLightbox(b.dataset.open));
  });

  /* keyboard: panah & escape saat lightbox terbuka */
  window.addEventListener("keydown", (e) => {
    if (!lb || lb.hidden) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      lbStep(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      lbStep(1);
    }
  });

  /* ==========================================================
     8. Tumpukan kartu: tandai kartu yang sudah "mendarat"
     ========================================================== */
  const pcards = Array.from(document.querySelectorAll(".pcard"));
  if (pcards.length) {
    let cardTops = [];
    let rafId = null;

    const measureTops = () => {
      cardTops = pcards.map((c) => parseFloat(getComputedStyle(c).top) || 0);
    };

    const check = () => {
      rafId = null;
      const vh = window.innerHeight;
      let topStuck = -1;
      const rects = pcards.map((card) => card.getBoundingClientRect());
      pcards.forEach((card, i) => {
        const rect = rects[i];
        // isi kartu mulai tampil sedikit sebelum kartu benar-benar menempel
        if (rect.top < vh * 0.92) card.classList.add("is-live");
        const stuck = rect.top <= (cardTops[i] || 0) + 2;
        card.classList.toggle("is-stuck", stuck);
        if (stuck) topStuck = i;
      });
      // kartu yang sudah tertutup kartu lain: sembunyikan bar jendelanya
      pcards.forEach((card, i) => card.classList.toggle("is-covered", i < topStuck));

      /* kartu yang sedang tampil paling besar; kartu yang sudah dilewati
         mengecil bertahap mengikuti posisi kartu berikutnya */
      const prog = rects.map((rect, i) => {
        const target = cardTops[i] || 0;
        return clamp((vh - rect.top) / Math.max(1, vh - target), 0, 1);
      });
      let depth = 0;
      for (let i = pcards.length - 1; i >= 0; i--) {
        const shrink = reduceMotion ? 1 : 1 - Math.min(depth, 5) * 0.055;
        pcards[i].style.setProperty("--shrink", shrink.toFixed(3));
        depth += prog[i];
      }
    };

    let settleId = null;
    const requestCheck = () => {
      if (rafId === null) rafId = requestAnimationFrame(check);
      // jaring pengaman: evaluasi ulang setelah scroll benar-benar berhenti
      clearTimeout(settleId);
      settleId = setTimeout(check, 160);
    };

    measureTops();
    check();
    window.addEventListener("scroll", requestCheck, { passive: true });
    window.addEventListener("resize", () => {
      measureTops();
      requestCheck();
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        measureTops();
        requestCheck();
      });
    }

    /* selama bagian Project terlihat, segarkan status kartu secara berkala
       agar strip tetap rapi walau ada pergeseran layout (font/gambar) */
    const projectSection = document.getElementById("project");
    let tickId = null;
    if (projectSection && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && tickId === null) {
              tickId = setInterval(check, 350);
            } else if (!entry.isIntersecting && tickId !== null) {
              clearInterval(tickId);
              tickId = null;
            }
          });
          requestCheck();
        },
        { rootMargin: "20% 0px" }
      );
      io.observe(projectSection);
    }
  }

  /* ==========================================================
     8b. MATA KULIAH — ROADMAP
     Satu garis tebal digambar bertahap mengikuti gulir; tiap
     langkah muncul saat ujung garis melewati posisinya.

     MENAMBAH / MENGGANTI LANGKAH: cukup ubah array `steps`.
       title  : judul besar
       desc   : isi kartu deskripsi
       meta   : teks kecil di atas judul (mis. "Semester 4")
       icon   : markup SVG (opsional; kosong = lingkaran bernomor)
       side   : "right" / "left" — di layar kecil selalu "right"
       at     : posisi 0–1 sepanjang garis

     Cukup ubah array itu: tinggi panggung, titik, dan garis
     dihitung ulang otomatis.
     ========================================================== */
  const roadmap = document.querySelector(".roadmap");
  if (roadmap) {
    /* true: langkah yang sudah lewat hilang lagi saat digulir ke atas */
    const REVERSE = false;

    const stage = roadmap.querySelector(".roadmap__stage");
    const svg = roadmap.querySelector(".roadmap__svg");
    const pathSoft = roadmap.querySelector(".roadmap__path--soft");
    const pathMain = roadmap.querySelector(".roadmap__path--main");
    const headGroup = roadmap.querySelector(".roadmap__head");
    const listEl = roadmap.querySelector(".roadmap__list");
    const wideMq = window.matchMedia("(min-width: 901px)");

    const steps = [
      { title: "Elektronika", meta: "Semester 1" },
      { title: "Rangkaian Logika & Teknik Digital", meta: "Semester 2" },
      { title: "Sinyal dan Sistem Kontrol Elektronik", meta: "Semester 3" },
      { title: "Teknologi Sensor dan Aktuator", meta: "Semester 3" },
      { title: "Sistem PLC", meta: "Semester 4" },
      { title: "Teknologi Bengkel dan Elektromekanik", meta: "Semester 4" },
      { title: "Perancangan Sistem Digital", meta: "Semester 4" },
      { title: "Proyek Sistem IoT", meta: "Semester 5" },
      { title: "Teknologi Robotik", meta: "Semester 5" },
      { title: "Machine Learning", meta: "Semester 5" },
      { title: "Embedded System", meta: "Semester 5" },
    ];

    /* Pengaturan bentuk jalur zig-zag (semua dihitung ulang di layout()):
       - segmen mendatar bolak-balik kiri ↔ kanan,
       - tiap ujung disambung belokan U (setengah lingkaran),
       - tiap langkah duduk di TENGAH segmen mendatar, jadi tidak pernah
         berada di tikungan dan garisnya selalu tampak rapi.

       MENAMBAH / MENGGANTI MATA KULIAH: cukup ubah array `steps`
       (title = nama mata kuliah, meta = semester). Jumlah belokan dan
       tinggi panggung menyesuaikan sendiri. */

    let items = [];
    let totalLen = 0;
    /* jalur zig-zag: dipakai mengukur panjang busur & posisi tiap titik */
    let pathBase = null;
    let baseLen = 0;
    /* posisi tiap mata kuliah di panggung: {i, x, y, above, at, labelW, labelH} */
    let basePoints = [];
    /* data tiap baris zig-zag: {y, xs, xe, atStart, atEnd, points} */
    let rowList = [];
    /* tabel kecepatan gulir: posisi baca (px) → fraksi panjang jalur */
    let lengthMap = null;
    /* diameter penanda (px), disimpan dari layout() */
    let node = 44;
    let cur = 0;
    let raf = null;

    const pad2 = (n) => String(n).padStart(2, "0");

    /* --- daftar mata kuliah dibuat dari array, urut sesuai data ---
       Hanya nama mata kuliah + semester (tanpa penjelasan). */
    const buildList = () => {
      listEl.innerHTML = "";
      const frag = document.createDocumentFragment();
      steps.forEach((s, i) => {
        const li = document.createElement("li");
        li.className = "ritem ritem--right";
        li.innerHTML =
          `<span class="ritem__icon" aria-hidden="true">` +
          `<span class="ritem__num">${pad2(i + 1)}</span></span>` +
          `<div class="ritem__body">` +
          `<h3 class="ritem__title">${s.title}</h3>` +
          `<span class="ritem__meta">${s.meta}</span>` +
          `</div>`;
        frag.appendChild(li);
      });
      listEl.appendChild(frag);
      items = Array.from(listEl.children);
    };

    /* ---------------------------------------------------------------
       Jalur zig-zag: segmen mendatar bolak-balik, tiap ujung disambung
       belokan U (setengah lingkaran). Radius belokan = setengah jarak
       baris, jadi tidak pernah ada sisa garis lurus vertikal di ujung —
       semua sambungan singgung (tangent), tanpa sudut patah.
       --------------------------------------------------------------- */

    const layout = () => {
      const W = stage.clientWidth;
      if (!W) return;

      const wide = wideMq.matches;
      const vh = window.innerHeight;

      /* ---------------------------------------------------------------
         Geometri zig-zag.
         Baris mendatar: bergantian kanan → kiri → kanan …, tiap baris
         menampung `perRow` mata kuliah. Label selalu diletakkan di sisi
         LUAR belokan baris itu (baris ke kanan → label di atas garis,
         baris ke kiri → label di bawah garis) supaya tidak menabrak
         baris berikutnya.
         --------------------------------------------------------------- */
      const perRow = wide ? (W >= 1280 ? 3 : 2) : W >= 560 ? 2 : 1;
      const rows = Math.ceil(steps.length / perRow);

      /* tinggi panggung = jumlah BARIS × tinggi per baris (bukan per mata
         kuliah, karena satu baris memuat beberapa mata kuliah).
         Di-set sebelum mengukur H supaya panggungnya tidak perlu kosong. */
      roadmap.style.setProperty("--roadmap-n", rows);
      const H = stage.clientHeight;
      if (!H) return;

      /* SVG memakai viewBox seukuran panggung dalam piksel, jadi tidak ada
         pelar skala: tebal garis dan ukuran kepala tetap seperti ditulis. */
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

      const swPx = parseFloat(
        getComputedStyle(roadmap).getPropertyValue("--roadmap-stroke")
      ) || 12;
      /* lebar zig-zag diatur CSS (--roadmap-rope): 1 = selebar panggung */
      const rope =
        parseFloat(
          getComputedStyle(roadmap).getPropertyValue("--roadmap-rope")
        ) || 1;

      const topPad = wide ? Math.max(130, vh * 0.15) : 84;
      const botPad = wide ? Math.max(180, vh * 0.2) : 130;

      const nodeW =
        parseFloat(
          getComputedStyle(roadmap).getPropertyValue("--roadmap-node")
        ) || 44;
      node = nodeW;

      /* ---------------------------------------------------------------
         Baris mendatar bolak-balik kiri ↔ kanan; tiap baris memuat
         `perRow` mata kuliah (dihitung di atas sebelum mengukur H).
         --------------------------------------------------------------- */
      /* Margin ke tepi panggung: ruang ini menjadi tempat busur U menonjol,
         jadi jangan terlalu tipis. */
      const edge = wide ? 40 : 22;
      let xR = W - edge;
      const leftLimit = edge;
      let xL = Math.max(leftLimit + nodeW / 2 + 2, xR - rope * (xR - leftLimit));

      let y0 = topPad;
      const yLast = Math.max(y0 + 200, H - botPad);

      /* tinggi baris efektif (kalau H bukan hasil hitungan pas) */
      const gapY = rows > 1 ? (yLast - y0) / (rows - 1) : 0;

      /* Radius belokan U. Busur U menonjol ke LUAR ujung baris, jadi butuh
         ruang di kiri & kanan panggung. Jarak baris dibuat tepat 2×radius
         supaya tidak ada sisa garis lurus vertikal di ujung (itulah yang
         membuat sambungan tampak rapi, tanpa patahan).
         Radius dipilih sebesar mungkin, tetapi tidak lebih dari 1/4 lebar
         panggung — supaya baris mendatar tetap panjang dan tidak berubah
         menjadi dua garis tegak yang berdempet. */
      const gapWant = rows > 1 ? gapY : H;
      /* Jarak baris harus cukup untuk dua label yang saling berhadapan
         (label di bawah baris atas + label di atas baris bawah), jadi
         diberi lantai; radius ikut menyesuaikan (R = rowGap/2). */
      const nodePx = nodeW;
      /* Ruang untuk dua label yang saling berhadapan (label di bawah baris
         atas + label di atas baris bawah). Judul panjang bisa jadi 3 baris
         (≈ 3 × 1.06 × fontSize) ditambah baris semester, jadi lantainya
         diturunkan dari tinggi label sebenarnya — kalau kekecilan, judul
         terpotong. */
      const fontTitlePx = wide ? 26 : W >= 560 ? 24 : 20;
      const labelBlockH = Math.ceil(fontTitlePx * 1.06 * 3 + 30);
      /* dua label berhadapan + napas antar keduanya */
      const labelRoom = labelBlockH * 2 + 28;
      const rMax = Math.max(20, Math.min(H / 2, (W - 2 * edge) / 4));
      const rowGapMin = labelRoom + nodePx + 24;
      const R =
        rows > 1
          ? Math.max(rowGapMin / 2, Math.min(gapWant / 2, rMax))
          : 0;
      const rowGap = R * 2;
      /* sisakan selebar radius di tiap sisi supaya busur U muat di panggung */
      if (R > 0) {
        const pad = Math.max(edge, R);
        xR = W - pad;
        xL = Math.max(pad + nodeW / 2, W - pad - rope * (W - 2 * pad));
      }
      if (rows > 1) {
        /* jalur ditaruh di tengah panggung supaya sisa ruang seimbang */
        const span = rowGap * (rows - 1);
        y0 = Math.max(24, (H - span) / 2);
      }

      /* titik tengah tiap segmen mendatar = posisi mata kuliah */
      const rowPoints = [];
      /* data tiap baris: dipakai untuk memetakan gulir → panjang jalur.
         `xStart`/`xEnd` = ujung baris (batas di mana baris itu benar-benar
         mulai & selesai digambar); `points` = titik mata kuliah di baris itu. */
      const rowInfoLocal = [];
      for (let r = 0; r < rows; r++) {
        const y = y0 + rowGap * r;
        const toRight = r % 2 === 0;
        const xs = toRight ? xL : xR;
        const xe = toRight ? xR : xL;
        /* mata kuliah pada baris ini */
        const from = r * perRow;
        const list = steps.slice(from, from + perRow);
        const n = list.length;
        /* Titik ditaruh merata di tengah segmen kolom. Lebar label dibatasi
           oleh jarak antar titik tetangga (itu satu-satunya syarat supaya
           label tidak bertumpuk), dan tidak boleh melebihi panggung.
           Judul panjang dibiarkan membungkus ke baris berikutnya — lebih
           baik 2–3 baris rapi daripada satu baris terpotong. */
        /* `seg` bertanda: negatif untuk baris yang digambar ke KIRI (xs di
           kanan, xe di kiri). Itu memang dipakai untuk menaruh titik (urutan
           terbalik), tetapi LEBAR label harus dari jarak mutlaknya — kalau
           tidak, baris ke kiri mendapat seg negatif dan lebar label jatuh ke
           lantai minimum. */
        const seg = (xe - xs) / Math.max(1, n);
        const colW = Math.abs(seg);
        /* dua label boleh saling mendekat sampai 12px, jadi lebar label =
           jarak titik ke titik tetangga dikurangi 12 */
        const labelW = clamp(colW - 12, 140, Math.max(140, W * 0.5));
        /* Tinggi label diambil dari tinggi blok yang sama dengan lantai jarak
           baris, jadi pasti cukup untuk 3 baris judul + semester — tidak
           terpotong oleh `overflow:hidden`. */
        const labelH = labelBlockH;
        /* setengah lebar label: titik di ujung baris tidak boleh lebih dekat
           dari ini ke tepi panggung, kalau tidak labelnya terpotong */
        const margin = labelW / 2 + 8;
        const pts = [];
        list.forEach((s, k) => {
          /* digeser ke dalam seperlunya (hanya titik ujung yang kena) */
          const x = clamp(xs + seg * (k + 0.5), margin, W - margin);
          const pt = {
            i: from + k,
            x: x,
            y: y,
            /* label di atas untuk baris ke kanan, di bawah untuk baris ke kiri */
            above: toRight,
            labelW: labelW,
            labelH: labelH,
          };
          rowPoints.push(pt);
          pts.push(pt);
        });
        rowInfoLocal.push({ y: y, xs: xs, xe: xe, points: pts });
      }

      /* --- jalur SVG: baris mendatar + belokan U setengah lingkaran ---
         Tiap baris bergerak ke satu arah; di ujungnya garis berbelok 180°
         (busur setengah lingkaran) lalu lanjut ke baris berikutnya dengan
         arah berlawanan. Semua sambungan singgung, jadi tidak ada sudut
         patah, dan garis tidak pernah keluar dari tepi panggung. */
      const f = (n) => Math.round(n * 100) / 100;
      const yOf = (r) => y0 + rowGap * r;

      let dBase = `M ${f(xL)} ${f(yOf(0))}`;
      for (let r = 0; r < rows; r++) {
        const y = yOf(r);
        const toRight = r % 2 === 0;
        const xe = toRight ? xR : xL;
        /* baris mendatar */
        dBase += ` L ${f(xe)} ${f(y)}`;
        if (r >= rows - 1) break;

        /* belokan U: busur 180° dari (xe, y) ke (xe, y + 2·rc).
           `sweep` menentukan sisi tonjolan: ke luar panggung tetap aman
           karena rc ≤ setengah jarak baris. */
        const ny = yOf(r + 1);
        const dy = Math.abs(ny - y);
        const rc = Math.min(R, dy / 2);
        dBase +=
          ` A ${f(rc)} ${f(rc)} 0 0 ${toRight ? 1 : 0} ` +
          `${f(xe)} ${f(y + rc * 2)}`;
        /* sisa tinggi (kalau rc lebih kecil dari setengah jarak baris)
           ditempuh lurus turun, tetap di x ujung yang sama */
        if (dy - rc * 2 > 0.5) {
          dBase += ` L ${f(xe)} ${f(ny)}`;
        }
      }

      const d = dBase;
      pathSoft.setAttribute("d", d);
      pathMain.setAttribute("d", d);

      if (!pathBase) {
        pathBase = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
      }
      pathBase.setAttribute("d", dBase);
      baseLen = pathBase.getTotalLength ? pathBase.getTotalLength() : 0;
      /* posisi tiap mata kuliah langsung dari koordinat baris (bukan dari
         panjang busur), jadi tidak pernah jatuh di dalam belokan */
      basePoints = rowPoints;
      rowList = rowInfoLocal;
      /* Untuk tiap titik — DAN untuk awal/akhir tiap baris — cari fraksi
         panjang busur terdekat lewat sampling. Awal/akhir baris dipakai agar
         garis benar-benar mulai dari 0 (baris pertama) dan berakhir di 1
         (ujung baris terakhir), bukan berhenti di mata kuliah terakhir. */
      if (baseLen > 0) {
        const SAMPLES = 2000;
        const sample = [];
        for (let s = 0; s <= SAMPLES; s++) {
          sample.push(pathBase.getPointAtLength((baseLen * s) / SAMPLES));
        }
        const atOf = (x, y) => {
          let best = 0;
          let bestD = Infinity;
          for (let s = 0; s <= SAMPLES; s++) {
            const q = sample[s];
            const dx = q.x - x;
            const dy = q.y - y;
            const dd = dx * dx + dy * dy;
            if (dd < bestD) { bestD = dd; best = s; }
          }
          return best / SAMPLES;
        };
        basePoints.forEach((p) => {
          p.at = atOf(p.x, p.y);
        });
        /* awal & akhir tiap baris: di situlah segmen mendatar dimulai/selesai */
        rowList.forEach((row) => {
          row.atStart = atOf(row.xs, row.y);
          row.atEnd = atOf(row.xe, row.y);
          row.points.forEach((p) => {
            p.row = row;
          });
        });
      }

      /* tabel kecepatan gulir dibangun setelah `at` tiap titik diketahui */
      buildLengthMap();

      pathSoft.style.strokeWidth = swPx + "px";
      pathMain.style.strokeWidth = swPx + "px";

      /* kepala garis: pil 34×10 px, menempel di ujung garis */
      const headCore = headGroup && headGroup.querySelector(".roadmap__head-core");
      const headGlow = headGroup && headGroup.querySelector(".roadmap__head-glow");
      if (headCore) {
        headCore.setAttribute("width", "34");
        headCore.setAttribute("height", "10");
        headCore.setAttribute("x", "-17");
        headCore.setAttribute("y", "-5");
        headCore.setAttribute("rx", "5");
      }
      if (headGlow) {
        headGlow.setAttribute("rx", "26");
        headGlow.setAttribute("ry", "22");
      }

      totalLen = pathMain.getTotalLength ? pathMain.getTotalLength() : 0;
      if (!totalLen) return;
      pathMain.style.strokeDasharray = String(totalLen);

      placeItems();

      render();
    };

    const px = (n) => String(Math.round(n * 100) / 100);

    const placeItems = () => {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      if (!W || !H || !totalLen || !basePoints.length) return;

      /* penanda sudah dipindah ke lapisan sendiri, jadi dicari lewat indeks */
      const icons = zlayer ? zlayer.children : [];

      items.forEach((li, i) => {
        const p = basePoints[i];
        if (!p) return;
        /* label "above" = di atas garis (baris ke kanan),
           label di bawah garis (baris ke kiri) */
        li.classList.toggle("ritem--above", p.above);
        li.classList.toggle("ritem--below", !p.above);
        li.style.transform = `translate(${px(p.x)}px, ${px(p.y)}px)`;
        li.style.setProperty("--label-w", Math.round(p.labelW) + "px");
        li.style.setProperty("--label-h", Math.round(p.labelH || 200) + "px");
        const ic = icons[i];
        if (ic) {
          ic.style.left = px(p.x) + "px";
          ic.style.top = px(p.y) + "px";
        }
      });
    };

    /* --- kecepatan gulir ---
       Satu sumbu `t` (0..1) dipakai bersama oleh `progressRaw()` dan
       `buildLengthMap()`, jadi garis, label, dan gulir benar-benar satu paket:

         t = 0 → panggung baru muncul: belum ada yang tergambar
                 (bar tidak "mendahului" Elektronika)
         t = 1 → baris terakhir lewat garis baca: garis PENUH sampai ujung
                 baris terakhir (bukan berhenti di mata kuliah terakhir)

       Skala `t` lurus dari tepi atas panggung sampai baris terakhir —
       tanpa cabang, jadi progres tidak pernah melonjak atau mundur. */
    /* Garis baca = DASAR layar. Baris dianggap "dibaca" tepat saat ia muncul
       di bagian bawah layar, jadi garis mulai bergerak begitu baris pertama
       terlihat — tidak ada jeda menunggu baris naik ke tengah layar. */
    const READ_LINE = 1.0;
    const buildLengthMap = () => {
      if (!rowList.length) { lengthMap = null; return; }
      const n = rowList.length;
      /* Skala `t` HARUS sama dengan progressRaw (lihat progressRaw):
         0 di TEPI ATAS panggung, 1 di baris terakhir. Kalau beda, garis
         tidak akan sejajar dengan baris yang sedang dibaca. */
      /* Rentang jalur: dari BARIS PERTAMA sampai baris terakhir. Garis mulai
         bergerak tepat ketika baris pertama mulai dibaca — tidak ada ruang
         kosong di muka. */
      const yStart = rowList[0].y;
      const yEnd = rowList[n - 1].y;
      const span = Math.max(1e-6, yEnd - yStart);
      const pairs = [];
      rowList.forEach((row) => {
        if (typeof row.atStart !== "number") return;
        /* Baris ke kanan digambar dari x kecil ke x besar, baris ke kiri
           sebaliknya. `at` harus mengikuti URUTAN GAMBAR (naik terus 0 → 1),
           bukan urutan x — kalau tidak, baris ke kiri memberi `at` menurun
           sehingga ujung jalur (at=1) tidak pernah tercapai. */
        const lo = Math.min(row.atStart, row.atEnd);
        const hi = Math.max(row.atStart, row.atEnd);
        /* Ujung masuk & ujung keluar baris diberi `t` berbeda (8% jarak baris)
           supaya belokan U di antara dua baris juga memakan gulir — garis
           tidak melompat dari ujung satu baris ke ujung baris berikutnya. */
        const tRow = clamp((row.y - yStart) / span, 0, 1);
        const dT = n > 1 ? 0.08 / (n - 1) : 0;
        pairs.push({ t: clamp(tRow - dT, 0, 1), at: lo });
        pairs.push({ t: clamp(tRow, 0, 1), at: hi });
      });
      if (!pairs.length) { lengthMap = null; return; }
      lengthMap = pairs;
    };

    const mapLength = (t) => {
      if (!lengthMap || lengthMap.length < 2) return t;
      const p = lengthMap;
      if (t <= p[0].t) return p[0].at;
      for (let i = 1; i < p.length; i++) {
        if (t <= p[i].t) {
          const a = p[i - 1];
          const b = p[i];
          const f = (t - a.t) / Math.max(1e-6, b.t - a.t);
          return clamp(a.at + (b.at - a.at) * f, 0, 1);
        }
      }
      return p[p.length - 1].at;
    };

    /* `t` (0..1): 0 saat panggung baru muncul, 1 saat baris terakhir lewat
       garis baca (dasar layar). Skala lurus — lihat catatan di
       buildLengthMap. */
    const progressRaw = () => {
      if (!rowList.length) return 0;
      const box = stage.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const n = rowList.length;
      /* posisi garis baca (dasar layar) dalam koordinat panggung */
      const readY = vh * READ_LINE - box.top;
      /* Rentang jalur: dari BARIS PERTAMA sampai baris terakhir — SAMA
         dengan buildLengthMap. Jadi garis mulai bergerak begitu baris
         pertama menyentuh dasar layar, dan penuh saat baris terakhir
         menyentuh dasar layar. */
      const yStart = rowList[0].y;
      const yEnd = rowList[n - 1].y;
      if (readY <= yStart) return 0;
      const raw = (readY - yStart) / Math.max(1e-6, yEnd - yStart);
      return clamp(raw, 0, 1);
    };

    const progressTarget = () => {
      if (prefersReduce()) return 1;
      return mapLength(progressRaw());
    };

    const render = () => {
      if (!totalLen) return;
      pathMain.style.strokeDashoffset = String(totalLen * (1 - cur));

      if (headGroup && pathMain.getPointAtLength) {
        const tipLen = totalLen * clamp(cur, 0, 1);
        const tip = pathMain.getPointAtLength(tipLen);
        const ahead = pathMain.getPointAtLength(Math.min(totalLen, tipLen + 0.2));
        let ang = Math.atan2(ahead.y - tip.y, ahead.x - tip.x) * 180 / Math.PI;
        if (!isFinite(ang)) ang = 0;
        headGroup.setAttribute(
          "transform",
          `translate(${tip.x.toFixed(2)} ${tip.y.toFixed(2)}) rotate(${ang.toFixed(1)})`
        );
        headGroup.style.opacity = cur > 0.004 && cur < 0.998 ? "1" : "0";
      }

      const icons = zlayer ? zlayer.children : [];
      items.forEach((it, i) => {
        const p = basePoints[i];
        const on = p ? cur >= (p.at || 0) - 0.0015 : false;
        if (on) it.classList.add("is-in");
        else if (REVERSE) it.classList.remove("is-in");
        /* label yang belum tercapai disembunyikan: ikut muncul bersama
           ujung garis, bukan menggantung di tempat kosong */
        it.classList.toggle("is-ahead", !on);
        /* ikon ada di lapisan lain, jadi keadaannya ditandai sendiri */
        const ic = icons[i];
        if (ic) ic.classList.toggle("is-in", on);
      });
    };

    /* satu rAF per perubahan: progress dikejar halus, bukan melompat */
    const step = () => {
      raf = null;
      const target = progressTarget();
      /* scrub dengan smoothing ringan */
      cur = Math.abs(target - cur) < 0.0006 ? target : cur + (target - cur) * 0.16;
      render();
      if (Math.abs(target - cur) > 0.0006) raf = requestAnimationFrame(step);
    };
    const kick = () => {
      if (raf === null) raf = requestAnimationFrame(step);
    };

    buildList();

    /* penanda langkah dipindah ke lapisan tersendiri: di atas garis,
       di bawah judul & kartu (harus setelah daftar dibuat) */
    const zlayer = document.createElement("div");
    zlayer.className = "roadmap__z";
    zlayer.setAttribute("aria-hidden", "true");
    items.forEach((li) => {
      const ic = li.querySelector(".ritem__icon");
      if (ic) zlayer.appendChild(ic);
    });
    stage.appendChild(zlayer);
    cur = prefersReduce() ? 1 : 0;
    layout();
    if (!prefersReduce()) cur = progressTarget();
    render();

    window.addEventListener("scroll", kick, { passive: true });

    let rz = null;
    const onResize = () => {
      if (rz) clearTimeout(rz);
      rz = setTimeout(() => {
        rz = null;
        layout();
        kick();
      }, 150);
    };
    window.addEventListener("resize", onResize);
    if (wideMq.addEventListener) wideMq.addEventListener("change", onResize);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        layout();
        kick();
      });
    }

    if ("ResizeObserver" in window) {
      let roRaf = null;
      const ro = new ResizeObserver(() => {
        if (roRaf === null) {
          roRaf = requestAnimationFrame(() => {
            roRaf = null;
            layout();
          });
        }
      });
      ro.observe(stage);
    }
  }
  // mulai render parallax
  apply();
})();
