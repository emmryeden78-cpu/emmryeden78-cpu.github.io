/* =========================================================
   PORTFOLIO — Emmry Eden · Interactions & animations
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  document.body.classList.add("loading");
  $("#year").textContent = new Date().getFullYear();

  /* ---------- 1. PRELOADER : séquence de boot ---------- */
  const bootMsgs = [
    "> Initialisation du système d'information...",
    "> Chargement des modules réseau ......... <span class='ok'>[OK]</span>",
    "> Connexion aux bases de données ........ <span class='ok'>[OK]</span>",
    "> Vérification des protocoles sécurité .. <span class='ok'>[OK]</span>",
    "> Synchronisation cloud ................. <span class='ok'>[OK]</span>",
    "> Bienvenue sur le portfolio d'Emmry Eden_",
  ];
  const bootLines = $("#bootLines"), bootBar = $("#bootBar"), bootPct = $("#bootPct");
  let pct = 0, line = 0;
  const step = reduced ? 50 : 4;
  const bootTimer = setInterval(() => {
    pct = Math.min(100, pct + Math.random() * step + 1);
    bootBar.style.width = pct + "%";
    bootPct.textContent = Math.floor(pct) + "%";
    const shouldShow = Math.floor((pct / 100) * bootMsgs.length);
    while (line < shouldShow && line < bootMsgs.length) {
      const d = document.createElement("div");
      d.innerHTML = bootMsgs[line++];
      bootLines.appendChild(d);
    }
    if (pct >= 100) {
      clearInterval(bootTimer);
      setTimeout(endBoot, 450);
    }
  }, 45);

  function endBoot() {
    $("#preloader").classList.add("done");
    document.body.classList.remove("loading");
    setTimeout(() => $("#preloader").remove(), 1100);
    startHero();
  }

  /* ---------- 2. HERO : nom lettre par lettre + glitch ---------- */
  function startHero() {
    const name = $("#heroName");
    const txt = name.textContent;
    name.innerHTML = "";
    let i = 0;
    txt.split(" ").forEach((w, wi) => {
      if (wi) name.appendChild(document.createTextNode(" "));
      const word = document.createElement("span");
      word.className = "word";
      [...w].forEach((ch) => {
        const s = document.createElement("span");
        s.className = "ch";
        s.textContent = ch;
        s.style.animationDelay = 0.3 + i++ * 0.06 + "s";
        word.appendChild(s);
      });
      name.appendChild(word);
    });
    setTimeout(() => name.classList.add("on"), 1500);
    typeLoop();
    terminalLoop();
    revealCheck();
  }

  /* ---------- 3. Texte machine à écrire ---------- */
  const roles = [
    "Gestionnaire des Systèmes d'Information",
    "Administrateur Bases de Données",
    "Expert Réseaux & Infrastructure",
    "Consultant en Cybersécurité",
    "Analyste Business Intelligence",
    "Développeur d'Applications Web",
    "Chef de Projet SI",
  ];
  function typeLoop() {
    const el = $("#typed");
    let r = 0, c = 0, del = false;
    (function tick() {
      const word = roles[r];
      el.textContent = word.slice(0, c);
      if (!del && c < word.length) c++;
      else if (del && c > 0) c--;
      if (!del && c === word.length) { del = true; return setTimeout(tick, 1800); }
      if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
      setTimeout(tick, del ? 35 : 70);
    })();
  }

  /* ---------- 4. Mini terminal animé ---------- */
  function terminalLoop() {
    const el = $("#termBody");
    const scripts = [
      ["$ systemctl status reseau", "● reseau.service  active (running)", "  uptime : 99.98%"],
      ["$ mysql -e 'SHOW DATABASES;'", "  erp_prod", "  bi_analytics", "  rh_gestion"],
      ["$ ./audit_securite.sh", "[✓] Pare-feu ........ OK", "[✓] Sauvegardes ..... OK", "[✓] Accès AD ........ OK"],
      ["$ ping clients.douala.cm", "64 bytes: time=4ms", "64 bytes: time=3ms", "→ Toujours disponible ✓"],
    ];
    let s = 0;
    (function run() {
      const lines = scripts[s];
      el.textContent = "";
      let li = 0, ci = 0;
      (function type() {
        if (li >= lines.length) {
          s = (s + 1) % scripts.length;
          return setTimeout(run, 2200);
        }
        const l = lines[li];
        if (li === 0) {
          el.textContent += l[ci++] || "";
          if (ci > l.length) { el.textContent += "\n"; li++; ci = 0; }
          return setTimeout(type, 45);
        }
        el.textContent += l + "\n";
        li++;
        setTimeout(type, 280);
      })();
    })();
  }

  /* ---------- 5. Fond : réseau de particules interactif ---------- */
  const cvs = $("#network"), ctx = cvs.getContext("2d");
  let W, H, nodes = [], mouse = { x: -9999, y: -9999 };
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    W = cvs.width = innerWidth * DPR;
    H = cvs.height = innerHeight * DPR;
    cvs.style.width = innerWidth + "px";
    cvs.style.height = innerHeight + "px";
    const count = Math.min(110, Math.floor((innerWidth * innerHeight) / 14000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4 * DPR, vy: (Math.random() - 0.5) * 0.4 * DPR,
      r: (Math.random() * 1.8 + 0.6) * DPR,
      hue: Math.random() < 0.5 ? "0,240,255" : Math.random() < 0.5 ? "139,92,246" : "255,46,151",
    }));
  }
  resize();
  addEventListener("resize", resize);
  addEventListener("mousemove", (e) => { mouse.x = e.clientX * DPR; mouse.y = e.clientY * DPR; });
  addEventListener("mouseout", () => { mouse.x = mouse.y = -9999; });

  const LINK = 140 * DPR, MOUSE_R = 200 * DPR;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
      if (d < MOUSE_R) { n.x -= dx * 0.012; n.y -= dy * 0.012; }
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(${a.hue},${(1 - d / LINK) * 0.35})`;
          ctx.lineWidth = DPR * 0.8;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (md < MOUSE_R) {
        ctx.strokeStyle = `rgba(0,240,255,${(1 - md / MOUSE_R) * 0.6})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
      ctx.fillStyle = `rgba(${a.hue},.9)`;
      ctx.shadowColor = `rgb(${a.hue})`; ctx.shadowBlur = 8 * DPR;
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }
    requestAnimationFrame(draw);
  }
  if (!reduced) draw();

  /* ---------- 6. Curseur personnalisé ---------- */
  if (finePointer) {
    const dot = $("#cursorDot"), ring = $("#cursorRing");
    let rx = 0, ry = 0, mx = 0, my = 0;
    addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener("mouseover", (e) => {
      ring.classList.toggle("hover", !!e.target.closest("a, button, .tilt, input, textarea"));
    });
  }

  /* ---------- 7. Étincelles au clic ---------- */
  if (!reduced) {
    addEventListener("click", (e) => {
      const colors = ["#00f0ff", "#8b5cf6", "#ff2e97", "#3dff9a"];
      for (let i = 0; i < 14; i++) {
        const s = document.createElement("span");
        s.className = "spark";
        s.style.left = e.clientX + "px"; s.style.top = e.clientY + "px";
        s.style.background = colors[i % colors.length];
        s.style.boxShadow = `0 0 10px ${colors[i % colors.length]}`;
        document.body.appendChild(s);
        const a = (Math.PI * 2 * i) / 14, dist = 40 + Math.random() * 50;
        s.animate(
          [{ transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
           { transform: `translate(calc(-50% + ${Math.cos(a) * dist}px), calc(-50% + ${Math.sin(a) * dist}px)) scale(0)`, opacity: 0 }],
          { duration: 700, easing: "cubic-bezier(.2,.8,.2,1)" }
        ).onfinish = () => s.remove();
      }
    });
  }

  /* ---------- 8. Boutons magnétiques ---------- */
  if (finePointer) {
    $$(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- 9. Cartes 3D (tilt) + reflet lumineux ---------- */
  if (finePointer) {
    $$(".tilt").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 12}deg) rotateX(${(0.5 - py) * 12}deg) translateY(-4px)`;
        el.style.setProperty("--mx", px * 100 + "%");
        el.style.setProperty("--my", py * 100 + "%");
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });

    // Orbe qui suit la souris
    const orb = $("#orbWrap");
    addEventListener("mousemove", (e) => {
      const x = (e.clientX / innerWidth - 0.5) * 20, y = (e.clientY / innerHeight - 0.5) * 20;
      orb.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    });
  }

  /* ---------- 10. Révélation au scroll + animations déclenchées ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add("visible");
      io.unobserve(el);

      if (el.matches(".bar")) el.querySelector("i").style.width = el.dataset.value + "%";
      if (el.matches(".ring-skill")) animateRing(el);
      if (el.matches(".hero-stats")) $$(".counter", el).forEach(countUp);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  function revealCheck() {
    // décalage en cascade pour les éléments frères
    $$(".reveal").forEach((el) => {
      const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
      el.style.transitionDelay = Math.min(sibs.indexOf(el) * 0.1, 0.6) + "s";
      io.observe(el);
    });
  }

  function animateRing(el) {
    const val = +el.dataset.value, fg = el.querySelector(".fg"), b = el.querySelector("b");
    const C = 2 * Math.PI * 52;
    fg.style.strokeDasharray = C;
    fg.style.strokeDashoffset = C - (C * val) / 100;
    let n = 0;
    const t = setInterval(() => { n++; b.textContent = n + "%"; if (n >= val) clearInterval(t); }, 2000 / val);
  }

  function countUp(el) {
    const target = +el.dataset.target, dur = 2000, t0 = performance.now();
    (function f(now) {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(f);
    })(t0);
  }

  /* ---------- 11. Scroll : progression, nav, timeline, lien actif ---------- */
  const nav = $("#nav"), prog = $("#scrollProgress"), toTop = $(".to-top");
  const sections = $$("main section[id]"), links = $$(".nav-links a");
  const timeline = $("#timeline"), tFill = $("#timelineFill");
  let lastY = 0;
  function onScroll() {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (y / max) * 100 + "%";
    nav.classList.toggle("hidden", y > lastY && y > 300 && !$("#navLinks").classList.contains("open"));
    lastY = y;
    toTop.classList.toggle("show", y > 600);

    let current = sections[0].id;
    sections.forEach((s) => { if (y >= s.offsetTop - innerHeight / 3) current = s.id; });
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));

    const r = timeline.getBoundingClientRect();
    const p = Math.min(Math.max((innerHeight * 0.7 - r.top) / r.height, 0), 1);
    tFill.style.height = p * 100 + "%";
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 12. Menu mobile ---------- */
  const burger = $("#burger"), navLinks = $("#navLinks");
  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  links.forEach((a) => a.addEventListener("click", () => {
    burger.classList.remove("open");
    navLinks.classList.remove("open");
  }));

  /* ---------- 13. Filtre des projets ---------- */
  $$("#filters button").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$("#filters button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      $$("#projects .project").forEach((p) => {
        const show = f === "all" || p.dataset.cat === f;
        p.classList.toggle("hide", !show);
        p.classList.remove("pop");
        if (show) { void p.offsetWidth; p.classList.add("pop", "visible"); }
      });
    });
  });

  /* ---------- 14. Copier email / téléphone ---------- */
  const toast = $("#toast");
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => toast.classList.remove("show"), 2200);
  }
  $$(".copy").forEach((b) => {
    b.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      const val = b.closest("[data-copy]").dataset.copy;
      navigator.clipboard?.writeText(val).then(() => showToast("✓ " + val + " copié !"), () => showToast(val));
    });
  });

  /* ---------- 15. Formulaire -> ouvre la messagerie ---------- */
  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#fName").value.trim(), email = $("#fEmail").value.trim();
    const subject = $("#fSubject").value.trim(), msg = $("#fMsg").value.trim();
    const body = `${msg}\n\n— ${name} (${email})`;
    window.location.href = `mailto:emmryeden78@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showToast("✈ Ouverture de votre messagerie...");
    e.target.reset();
  });

  /* ---------- 16. Éditeur de code animé (service Développement web) ---------- */
  const codeEl = $("#codeBody");
  const codeLines = [
    [["c", "// Application de gestion sur mesure"]],
    [["k", "import"], ["", " express "], ["k", "from"], ["s", " 'express'"], ["", ";"]],
    [["k", "const"], ["", " app = "], ["f", "express"], ["", "();"]],
    [],
    [["", "app."], ["f", "get"], ["", "("], ["s", "'/api/stocks'"], ["", ", "], ["k", "async"], ["", " (req, res) => {"]],
    [["", "  "], ["k", "const"], ["", " data = "], ["k", "await"], ["", " db."], ["f", "query"], ["", "("]],
    [["s", "    'SELECT * FROM produits'"], ["", ");"]],
    [["", "  res."], ["f", "json"], ["", "(data);"]],
    [["", "});"]],
    [],
    [["", "app."], ["f", "listen"], ["", "(3000, () =>"]],
    [["", "  console."], ["f", "log"], ["", "("], ["s", "'🚀 App en ligne !'"], ["", "));"]],
  ];
  function typeCode() {
    // chaque caractère reçoit sa classe de coloration syntaxique
    const chars = [];
    codeLines.forEach((ln) => {
      ln.forEach(([cls, txt]) => [...txt].forEach((ch) => chars.push([cls, ch])));
      chars.push(["", "\n"]);
    });
    let i = 0;
    (function tick() {
      if (i > chars.length) return setTimeout(() => { i = 0; tick(); }, 3000);
      codeEl.innerHTML = chars.slice(0, i).map(([cls, ch]) => {
        const safe = ch.replace(/&/g, "&amp;").replace(/</g, "&lt;");
        return cls ? `<span class="${cls}">${safe}</span>` : safe;
      }).join("") + '<span class="cur"></span>';
      i++;
      setTimeout(tick, chars[i - 1]?.[1] === "\n" ? 140 : 22);
    })();
  }
  const codeIO = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { codeIO.disconnect(); typeCode(); }
  });
  codeIO.observe(codeEl);

  /* ---------- 17. Bouton WhatsApp : bulle d'invitation automatique ---------- */
  const wa = $("#waFloat");
  setTimeout(() => {
    wa.classList.add("tip-on");
    setTimeout(() => wa.classList.remove("tip-on"), 4500);
  }, 6000);
  wa.addEventListener("click", () => { const b = wa.querySelector(".wa-badge"); if (b) b.remove(); });

  /* ---------- 18. Titre de l'onglet quand on quitte ---------- */
  const baseTitle = document.title;
  document.addEventListener("visibilitychange", () => {
    document.title = document.hidden ? "👋 Revenez vite !" : baseTitle;
  });

  /* ---------- 19. Duplication du marquee pour boucle infinie ---------- */
  const mq = $("#marquee");
  mq.innerHTML += mq.innerHTML;
})();
