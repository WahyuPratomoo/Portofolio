/* ============================================================
   WAHYU PRATOMO — PORTFOLIO
   Interaksi: boot, parallax PCB, reveal, akordeon proyek, tilt.
   ============================================================ */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ==========================================================
     0. BERSIHKAN ANIMASI MASUK agar tidak menimpa transform
        parallax (CSS animation menang atas inline style)
     ========================================================== */
  const clearEntrance = (el) => {
    el.style.animation = "none";
  };
  document.querySelectorAll(".hero__name, .hero__name .word, .id-card-wrap, .hero__bio, .hero__grid, .hero__eyebrow")
    .forEach((el) => {
      el.addEventListener("animationend", () => clearEntrance(el), { once: true });
      // jaring pengaman bila animasi tidak pernah "end" (tab background)
      setTimeout(() => clearEntrance(el), 2600);
    });

  /* ==========================================================
     1. BOOT SCREEN
     ========================================================== */
  const boot = document.getElementById("boot");
  const bootBar = document.getElementById("bootBar");
  const bootPct = document.getElementById("bootPct");

  const finishBoot = () => {
    if (bootBar) bootBar.style.width = "100%";
    if (bootPct) bootPct.textContent = "100%";
    if (boot) {
      boot.classList.add("is-done");
      setTimeout(() => { boot.style.display = "none"; }, 750);
    }
    document.body.classList.add("is-ready");
  };

  if (!boot) {
    finishBoot();
  } else if (reduceMotion) {
    setTimeout(finishBoot, 300);
  } else {
    let p = 0;
    const tick = () => {
      p += Math.random() * 13 + 4;
      if (p >= 100) p = 100;
      if (bootBar) bootBar.style.width = p + "%";
      if (bootPct) bootPct.textContent = Math.round(p) + "%";
      if (p < 100) setTimeout(tick, 70 + Math.random() * 80);
      else setTimeout(finishBoot, 320);
    };
    setTimeout(tick, 220);
    // jaring pengaman jika font/gambar lambat
    setTimeout(finishBoot, 3200);
  }

  /* ==========================================================
     1b. FIT NAMA KE LEBAR LAYAR (seperti referensi)
     ========================================================== */
  const heroName = document.querySelector(".hero__name");
  const fitName = () => {
    if (!heroName) return;
    const words = heroName.querySelectorAll(".word");
    if (words.length < 2) return;
    if (window.innerWidth < 760) {
      heroName.style.fontSize = "";
      return;
    }
    // reset dulu supaya pengukuran tidak terpengaruh nilai sebelumnya
    heroName.style.fontSize = "100px";
    const container = heroName.clientWidth;
    const gap = parseFloat(getComputedStyle(heroName).columnGap) || 0;
    let textW = gap;
    words.forEach((w) => { textW += w.offsetWidth; });
    if (!textW || !container) return;
    const size = (100 * container) / textW;
    heroName.style.fontSize = clamp(size, 40, 340) + "px";
  };
  fitName();
  window.addEventListener("resize", fitName);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitName);
  setTimeout(() => heroName && heroName.classList.add("is-settled"), 1500);

  /* ==========================================================
     2. PARALLAX PCB (kanvas garis sirkuit)
     ========================================================== */
  const canvas = document.getElementById("pcb");
  const ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;

  let viewW = window.innerWidth;
  let viewH = window.innerHeight;
  let traces = [];
  let nodes = [];
  let dpr = 1;
  let lastScroll = window.scrollY;
  let smooth = lastScroll;

  const pad = () => clamp(viewW * 0.06, 16, 90);

  const buildBoard = () => {
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    dpr = clamp(window.devicePixelRatio || 1, 1, 2);

    canvas.width = Math.floor(viewW * dpr);
    canvas.height = Math.floor(viewH * dpr);
    canvas.style.width = viewW + "px";
    canvas.style.height = viewH + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cols = clamp(Math.round(viewW / 118), 5, 13);
    const rows = clamp(Math.round(viewH / 118), 4, 11);
    const p = pad();

    const cellW = (viewW - p * 2) / cols;
    const cellH = (viewH - p * 2) / rows;

    // titik sirkuit: 8 level "parallax" acak
    nodes = [];
    traces = [];

    const nodeAt = (c, r) => ({
      x: p + cellW * (c + 0.5),
      y: p + cellH * (r + 0.5),
    });

    for (let i = 0; i < cols * rows * 0.55; i++) {
      const c = Math.floor(Math.random() * cols);
      const r = Math.floor(Math.random() * rows);
      const n = nodeAt(c, r);
      nodes.push({
        ...n,
        r: Math.random() < 0.22 ? 2.5 : 1.3,
        level: 0.15 + Math.random() * 0.75,
        accent: Math.random() < 0.14,
      });
    }

    for (let i = 0; i < Math.min(16, cols + rows + 4); i++) {
      const c1 = Math.floor(Math.random() * cols);
      const r1 = Math.floor(Math.random() * rows);
      const c2 = clamp(c1 + (Math.random() < 0.5 ? -1 : 1) * Math.ceil(Math.random() * 3), 0, cols - 1);
      const r2 = clamp(r1 + (Math.random() < 0.5 ? -1 : 1) * Math.ceil(Math.random() * 3), 0, rows - 1);
      const a = nodeAt(c1, r1);
      const b = nodeAt(c2, r2);

      // rute ortogonal dengan belokan diagonal 45°
      const mx = lerp(a.x, b.x, Math.random() < 0.5 ? 0.5 : 0.34);
      const my = b.y;

      traces.push({
        pts: [
          { x: a.x, y: a.y },
          { x: mx, y: a.y },
          { x: mx, y: my },
          { x: b.x, y: my },
        ],
        level: 0.1 + Math.random() * 0.55,
        accent: Math.random() < 0.18,
        dash: Math.random() * 60,
        speed: 0.4 + Math.random() * 1.4,
        vias: [
          { x: a.x, y: a.y },
          { x: b.x, y: my },
        ],
      });
    }
  };

  let t = 0;

  const drawBoard = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, viewW, viewH);

    const s = smooth * 0.22;
    const acid = "198, 255, 62";

    // garis
    ctx.lineWidth = 1;
    for (const tr of traces) {
      const off = s * tr.level;
      ctx.beginPath();
      tr.pts.forEach((pt, i) => {
        const y = pt.y - (off % (viewH * 0.9));
        const wrapped = y < -40 ? y + viewH * 0.9 : y;
        i === 0 ? ctx.moveTo(pt.x, wrapped) : ctx.lineTo(pt.x, wrapped);
      });
      ctx.strokeStyle = tr.accent
        ? `rgba(${acid}, ${0.16 + tr.level * 0.16})`
        : `rgba(255, 255, 255, ${0.05 + tr.level * 0.06})`;
      ctx.setLineDash(tr.accent ? [3, 7] : []);
      ctx.lineDashOffset = -(t * tr.speed + tr.dash);
      ctx.stroke();
      ctx.setLineDash([]);

      // via / solder pad
      for (const v of tr.vias) {
        const y = v.y - (off % (viewH * 0.9));
        if (y < -30 || y > viewH + 30) continue;
        ctx.beginPath();
        ctx.arc(v.x, y, 2.4, 0, Math.PI * 2);
        ctx.strokeStyle = tr.accent ? `rgba(${acid}, 0.4)` : "rgba(255,255,255,0.16)";
        ctx.stroke();
      }
    }

    // node
    for (const n of nodes) {
      const off = s * n.level;
      const y = n.y - (off % (viewH * 0.9));
      const yy = y < -30 ? y + viewH * 0.9 : y;
      if (yy < -30 || yy > viewH + 30) continue;

      const glow = 0.5 + 0.5 * Math.sin(t * 0.9 + n.x);

      if (n.accent) {
        ctx.beginPath();
        ctx.arc(n.x, yy, n.r * 4.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${acid}, ${0.03 + glow * 0.05})`;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(n.x, yy, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.accent
        ? `rgba(${acid}, ${0.35 + glow * 0.55})`
        : `rgba(255, 255, 255, ${0.18 + glow * 0.22})`;
      ctx.fill();
    }

    // bingkai board tepi
    ctx.strokeStyle = "rgba(255,255,255,0.045)";
    ctx.lineWidth = 1;
    const p = pad() * 0.55;
    ctx.strokeRect(p, p, viewW - p * 2, viewH - p * 2);
  };

  if (ctx && !reduceMotion) {
    buildBoard();
    window.addEventListener("resize", () => {
      buildBoard();
    });

    let raf = null;
    const loop = () => {
      t += 0.006;
      smooth = lerp(smooth, lastScroll, 0.075);
      drawBoard();
      raf = requestAnimationFrame(loop);
    };
    loop();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
      } else if (!raf) loop();
    });
  } else if (ctx) {
    buildBoard();
    drawBoard();
  }

  window.addEventListener("scroll", () => { lastScroll = window.scrollY; }, { passive: true });

  /* ==========================================================
     3. PROGRESS BAR + PARALLAX HERO
     ========================================================== */
  const scrollBar = document.getElementById("scrollBar");
  const heroEyebrow = document.querySelector(".hero__eyebrow");
  const idCardWrap = document.querySelector("[data-parallax]");
  const heroBio = document.querySelector(".hero__bio");
  const heroGrid = document.querySelector(".hero__grid");

  let scrollY = 0;
  const siteHead = document.querySelector(".site-head");
  const onScroll = () => {
    scrollY = window.scrollY;

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollBar) scrollBar.style.width = (docH > 0 ? (scrollY / docH) * 100 : 0) + "%";
    if (siteHead) siteHead.classList.toggle("is-scrolled", scrollY > 24);

    // kanvas PCB meredup saat masuk area konten agar teks tetap terbaca
    if (canvas) {
      const fade = clamp(1 - scrollY / (window.innerHeight * 0.75), 0.3, 1);
      canvas.style.opacity = String(fade);
    }

    if (reduceMotion) return;
    const vh = window.innerHeight;

    // nama besar: perlahan naik + memudar seperti papan sirkuit yang menjauh
    if (heroName && scrollY < vh * 1.1) {
      const k = clamp(scrollY / (vh * 0.9), 0, 1);
      heroName.style.transform = `translate3d(0, ${k * -46}px, 0) scale(${1 - k * 0.045})`;
      heroName.style.opacity = String(1 - k * 0.55);
      const words = heroName.querySelectorAll(".word");
      words.forEach((w, i) => {
        w.style.transform = `translate3d(${k * (i === 0 ? -26 : 26)}px, ${k * (i === 0 ? -12 : 16)}px, 0)`;
      });
    }

    if (heroEyebrow) {
      heroEyebrow.style.transform = `translate3d(0, ${clamp(scrollY * -0.08, -30, 0)}px, 0)`;
      heroEyebrow.style.opacity = String(clamp(1 - scrollY / 520, 0, 1));
    }

    // kartu ID bergerak lebih cepat (lapisan parallax)
    if (idCardWrap) {
      const speed = parseFloat(idCardWrap.dataset.parallax || "0.35");
      idCardWrap.style.transform = `translate3d(0, ${clamp(scrollY * -speed, -260, 0)}px, 0)`;
    }

    if (heroBio) heroBio.style.transform = `translate3d(0, ${clamp(scrollY * -0.12, -70, 0)}px, 0)`;
    if (heroGrid) heroGrid.style.opacity = String(clamp(1 - scrollY / 700, 0, 1));
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ==========================================================
     4. REVEAL ON SCROLL
     ========================================================== */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ==========================================================
     5. AKORDEON PROYEK
     ========================================================== */
  document.querySelectorAll(".project").forEach((project) => {
    const trigger = project.querySelector(".project__trigger");
    const panel = project.querySelector(".project__panel");
    if (!trigger || !panel) return;

    const setHeight = () => {
      panel.style.height = project.classList.contains("is-open")
        ? panel.scrollHeight + "px"
        : "0px";
    };

    trigger.addEventListener("click", () => {
      const open = !project.classList.contains("is-open");
      project.classList.toggle("is-open", open);
      trigger.setAttribute("aria-expanded", String(open));
      setHeight();
    });

    window.addEventListener("resize", () => {
      if (project.classList.contains("is-open")) setHeight();
    });
  });

  /* ==========================================================
     6. TILT KARTU ID
     ========================================================== */
  const card = document.querySelector("[data-tilt]");
  if (card && !reduceMotion && window.matchMedia("(hover: hover)").matches) {
    let rafId = null;
    let rx = 0, ry = 0, tx = 0, ty = 0;

    const animate = () => {
      rx = lerp(rx, tx, 0.14);
      ry = lerp(ry, ty, 0.14);
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      if (Math.abs(tx - rx) > 0.01 || Math.abs(ty - ry) > 0.01) rafId = requestAnimationFrame(animate);
      else rafId = null;
    };
    const kick = () => { if (!rafId) rafId = requestAnimationFrame(animate); };

    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      tx = clamp(((e.clientY - r.top) / r.height - 0.5) * -13, -13, 13);
      ty = clamp(((e.clientX - r.left) / r.width - 0.5) * 15, -15, 15);
      kick();
    });

    card.addEventListener("pointerleave", () => {
      tx = 0; ty = 0;
      kick();
    });
  }

  /* ==========================================================
     7. SALIN EMAIL
     ========================================================== */
  const copyBtn = document.getElementById("copyMail");
  if (copyBtn) {
    const original = copyBtn.textContent;
    copyBtn.addEventListener("click", async () => {
      const text = copyBtn.dataset.copy || "";
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      copyBtn.textContent = "TERSALIN ✓";
      copyBtn.classList.add("is-copied");
      setTimeout(() => {
        copyBtn.textContent = original;
        copyBtn.classList.remove("is-copied");
      }, 1800);
    });
  }

  /* ==========================================================
     8. SCROLL LOCK saat proyek dibuka (halus)
     ========================================================== */
  document.querySelectorAll(".project__trigger").forEach((btn) => {
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Escape") btn.blur();
    });
  });
})();
