/* ==========================================================
   AYAAN KHAN PORTFOLIO — app.js
   All JavaScript: experience intro + portfolio logic
   ========================================================== */
(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────
     PROJECTS DATA
     Add future projects here. Supported fields:
       name, description, category,
       status: 'building' | 'live',
       technologies: ['HTML','CSS','JS'],
       image (URL), liveUrl, githubUrl,
       websiteUrl, apkUrl, demoUrl, caseStudyUrl
  ────────────────────────────────────────────────────── */
  var PROJECTS = [
    // Projects will be published here as they are completed.
    // Uncomment and fill to add a project:
    // {
    //   name: 'Project Name',
    //   description: 'What this project does and why it exists.',
    //   category: 'Web App',
    //   status: 'building',
    //   technologies: ['HTML', 'CSS', 'JavaScript'],
    //   githubUrl: 'https://github.com/...',
    // }
  ];

  /* ──────────────────────────────────────────────────────
     DIRECT-ENTRY CHECK
     Early head script already added .direct-entry to <html>
     if localStorage flag or prefers-reduced-motion found.
  ────────────────────────────────────────────────────── */
  if (document.documentElement.classList.contains('direct-entry')) {
    document.documentElement.classList.add('portfolio-visible');
    initPortfolio();
  }

  /* ──────────────────────────────────────────────────────
     PARTICLE SYSTEM
  ────────────────────────────────────────────────────── */
  var particleRAF    = null;
  var particleActive = false;

  function initParticles() {
    var canvas = document.getElementById('pc');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, particles;
    var isMobile = window.innerWidth < 768;
    var COUNT    = isMobile ? 22 : 45;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    particles = [];
    for (var i = 0; i < COUNT; i++) {
      particles.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r:  Math.random() * 1.2 + 0.3,
        o:  Math.random() * 0.18 + 0.03
      });
    }

    particleActive = true;
    function loop() {
      if (!particleActive) return;
      ctx.clearRect(0, 0, W, H);
      for (var j = 0; j < particles.length; j++) {
        var p = particles[j];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(165,195,255,' + p.o + ')';
        ctx.fill();
      }
      particleRAF = requestAnimationFrame(loop);
    }
    loop();
  }

  function stopParticles() {
    particleActive = false;
    if (particleRAF) { cancelAnimationFrame(particleRAF); particleRAF = null; }
  }

  /* ──────────────────────────────────────────────────────
     INTRO SEQUENCE
  ────────────────────────────────────────────────────── */
  var introEl  = document.getElementById('intro');
  var ilinesEl = document.getElementById('ilines');
  var ibtnEl   = document.getElementById('ibtn');

  var LINES = [
    { text: "You're entering Ayaan's space.", cls: '' },
    { text: "A resume tells you where I am.",  cls: '' },
    { text: "This is what I'm building.",      cls: '' },
    { text: "Safar abhi jaari hai.",            cls: 'urdu' },
    { text: "Take a look around.",              cls: '' }
  ];

  if (introEl && !document.documentElement.classList.contains('direct-entry')) {
    initParticles();

    /* ── DRAGON ─────────────────────────────────────────
       Trigger after ~1.8s. Dragon flies right→left.
       The SVG starts at translateX(100vw + 400px) in CSS.
       Adding .fly triggers the dragonFly keyframe animation.
    ──────────────────────────────────────────────────── */
    var dragonEl = document.getElementById('dragon-svg');
    setTimeout(function () {
      if (dragonEl) dragonEl.classList.add('fly');
    }, 1800);

    /* ── TYPING SEQUENCE ─────────────────────────────── */
    var li = 0;
    var activeCursor = null;

    function nextLine() {
      if (li >= LINES.length) {
        /* All lines done — remove cursor, show button */
        if (activeCursor) { activeCursor.remove(); activeCursor = null; }
        setTimeout(function () {
          if (ibtnEl) ibtnEl.classList.add('vis');
        }, 500);
        return;
      }
      var cfg = LINES[li];
      var p   = document.createElement('p');
      p.className = 'intro-line' + (cfg.cls ? ' ' + cfg.cls : '');
      var ts = document.createElement('span');
      ts.className = 'tt';
      p.appendChild(ts);

      /* Move cursor to the new line */
      if (activeCursor) activeCursor.remove();
      activeCursor = document.createElement('span');
      activeCursor.className = 'cursor';
      activeCursor.setAttribute('aria-hidden', 'true');
      p.appendChild(activeCursor);
      ilinesEl.appendChild(p);

      /* Fade-in the line */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { p.classList.add('vis'); });
      });

      /* Type characters one by one */
      var ci = 0, text = cfg.text;
      /* Slightly slower for the Urdu line, standard for others */
      var charDelay = cfg.cls === 'urdu' ? 38 : 30;

      function typeChar() {
        if (ci < text.length) {
          ts.textContent += text[ci++];
          setTimeout(typeChar, charDelay);
        } else {
          li++;
          /* Pause between lines */
          setTimeout(nextLine, 260);
        }
      }
      setTimeout(typeChar, 60);
    }

    /* Start after a breath */
    setTimeout(nextLine, 420);

    /* Click anywhere on intro screen to skip typing (after 1.2s) */
    var canSkip = false;
    setTimeout(function () { canSkip = true; }, 1200);
    introEl.addEventListener('click', function (e) {
      if (canSkip && !e.target.closest('#ibtn')) startMascotPhase();
    });

    if (ibtnEl) ibtnEl.addEventListener('click', startMascotPhase);
  }

  /* ──────────────────────────────────────────────────────
     TRANSITION: INTRO → MASCOT
  ────────────────────────────────────────────────────── */
  var mascotPhaseStarted = false;

  function startMascotPhase() {
    if (mascotPhaseStarted) return;
    mascotPhaseStarted = true;
    if (!introEl) { revealPortfolio(); return; }

    var mascotScreen = document.getElementById('mascot-screen');

    /* Cross-fade: intro fades out, mascot fades in simultaneously */
    introEl.style.transition   = 'opacity .75s ease';
    introEl.style.opacity      = '0';
    introEl.style.pointerEvents = 'none';

    /* Mascot screen becomes visible while intro is still fading */
    setTimeout(function () {
      if (mascotScreen) mascotScreen.classList.add('vis');
    }, 150);

    setTimeout(function () {
      introEl.style.display = 'none';
      stopParticles();
      if (mascotScreen) runMascotSequence();
    }, 750);
  }

  /* ──────────────────────────────────────────────────────
     MASCOT SEQUENCE
  ────────────────────────────────────────────────────── */
  function runMascotSequence() {
    var wrap      = document.getElementById('mascot-wrap');
    var mascotSvg = document.getElementById('mascot-svg');
    var speechEl  = document.getElementById('speech');
    var followBtn = document.getElementById('follow-btn');

    if (!wrap) { revealPortfolio(); return; }

    /* 1. Slide mascot in from the left — natural entrance */
    setTimeout(function () {
      wrap.style.transition = 'transform .7s cubic-bezier(.22,1,.36,1), opacity .45s ease';
      wrap.style.transform  = 'translateX(0)';
      wrap.style.opacity    = '1';
    }, 180);

    /* 2. Knock animation — arm extends toward screen */
    setTimeout(function () {
      if (mascotSvg) mascotSvg.classList.add('knocking');
      spawnRipple(wrap);
      /* Second knock ripple slightly delayed */
      setTimeout(function () { spawnRipple(wrap); }, 240);
    }, 1050);

    /* 3. Arm returns to rest */
    setTimeout(function () {
      if (mascotSvg) mascotSvg.classList.remove('knocking');
    }, 1700);

    /* 4. Speech bubble 1: acknowledgment */
    setTimeout(function () {
      showSpeech(speechEl, 'Oh, you made it.');
    }, 2000);

    /* 5. Speech bubble 2: invitation */
    setTimeout(function () {
      hideSpeech(speechEl);
      setTimeout(function () {
        showSpeech(speechEl, "Come on. I'll show you around.");
      }, 400);
    }, 3700);

    /* 6. Wave gesture */
    setTimeout(function () {
      if (mascotSvg) mascotSvg.classList.add('waving');
    }, 4000);

    /* 7. Follow Me button appears */
    setTimeout(function () {
      if (followBtn) followBtn.classList.add('on');
    }, 4300);

    /* Follow Me click handler */
    if (followBtn) {
      followBtn.addEventListener('click', function onFollow() {
        followBtn.removeEventListener('click', onFollow);
        followBtn.disabled = true;
        walkOffAndReveal(mascotSvg, speechEl, wrap);
      });
    }
  }

  function showSpeech(el, text) {
    if (!el) return;
    el.textContent = text;
    el.classList.add('on');
  }

  function hideSpeech(el) {
    if (!el) return;
    el.classList.remove('on');
  }

  function spawnRipple(parent) {
    var r = document.createElement('div');
    r.className = 'knock-ripple';
    parent.appendChild(r);
    setTimeout(function () { if (r.parentNode) r.parentNode.removeChild(r); }, 860);
  }

  /* ──────────────────────────────────────────────────────
     FOLLOW ME → PORTFOLIO TRANSITION
  ────────────────────────────────────────────────────── */
  function walkOffAndReveal(mascotSvg, speechEl, wrap) {
    var mScreen = document.getElementById('mascot-screen');

    /* Clear arm states, hide speech */
    if (mascotSvg) mascotSvg.classList.remove('knocking', 'waving');
    hideSpeech(speechEl);

    /* Mascot walks off right — slightly accelerating */
    if (wrap) {
      wrap.style.transition = 'transform .8s cubic-bezier(.55,0,1,.65), opacity .55s .15s ease';
      wrap.style.transform  = 'translateX(140vw)';
      wrap.style.opacity    = '0';
    }

    /* Mascot screen begins fading; portfolio starts revealing underneath */
    setTimeout(function () {
      if (mScreen) {
        mScreen.style.transition = 'opacity .8s ease';
        mScreen.style.opacity    = '0';
        mScreen.style.pointerEvents = 'none';
      }
      /* Portfolio fade-in starts as mascot exits */
      revealPortfolio();
    }, 320);

    /* Clean up mascot screen from DOM */
    setTimeout(function () {
      if (mScreen) mScreen.style.display = 'none';
    }, 1400);
  }

  /* ──────────────────────────────────────────────────────
     PORTFOLIO REVEAL
  ────────────────────────────────────────────────────── */
  var portfolioRevealed = false;

  function revealPortfolio() {
    if (portfolioRevealed) return;
    portfolioRevealed = true;
    try { localStorage.setItem('ak_v', '1'); } catch (e) {}
    var skipBtn = document.getElementById('skip-all');
    if (skipBtn) skipBtn.style.display = 'none';
    document.documentElement.classList.add('portfolio-visible');
    initPortfolio();
  }

  /* ──────────────────────────────────────────────────────
     SKIP ALL
  ────────────────────────────────────────────────────── */
  var skipAllBtn = document.getElementById('skip-all');
  if (skipAllBtn) {
    skipAllBtn.addEventListener('click', function () {
      var intro  = document.getElementById('intro');
      var mascot = document.getElementById('mascot-screen');
      if (intro)  { intro.style.opacity = '0'; intro.style.pointerEvents = 'none'; }
      if (mascot) { mascot.style.opacity = '0'; mascot.style.pointerEvents = 'none'; }
      stopParticles();
      /* Small delay so the fade is visible */
      setTimeout(function () {
        if (intro)  intro.style.display  = 'none';
        if (mascot) mascot.style.display = 'none';
        revealPortfolio();
      }, 200);
    });
  }

  /* ──────────────────────────────────────────────────────
     RENDER PROJECTS
  ────────────────────────────────────────────────────── */
  function renderProjects() {
    var grid = document.getElementById('proj-grid');
    if (!grid) return;

    if (!PROJECTS.length) {
      grid.innerHTML = [
        '<div class="proj-empty">',
        '  <h3>Currently building.</h3>',
        '  <p>Projects will be published here as they reach a shareable state.</p>',
        '  <p class="pe-urdu">Abhi aur banana baaki hai.</p>',
        '</div>'
      ].join('');
      return;
    }

    function lnk(url, label) {
      if (!url) return '';
      return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="proj-btn">' + label + '</a>';
    }

    grid.innerHTML = PROJECTS.map(function (p) {
      var img  = p.image
        ? '<div class="proj-img"><img src="' + p.image + '" alt="' + (p.name || '') + '" loading="lazy"></div>'
        : '';
      var tech = (p.technologies && p.technologies.length)
        ? '<div class="proj-techs">' + p.technologies.map(function (t) {
            return '<span class="proj-tech">' + t + '</span>';
          }).join('') + '</div>'
        : '';
      var st = p.status
        ? '<p class="proj-st st-' + p.status + '"><span class="sdot"></span>' +
          (p.status === 'live' ? 'Live' : 'Building') + '</p>'
        : '';
      var links = [
        lnk(p.liveUrl,       'Live'),
        lnk(p.githubUrl,     'GitHub'),
        lnk(p.websiteUrl,    'Website'),
        lnk(p.apkUrl,        'APK'),
        lnk(p.demoUrl,       'Demo'),
        lnk(p.caseStudyUrl,  'Case Study')
      ].filter(Boolean).join('');

      return '<article class="proj-card">' + img +
        '<div class="proj-body">' +
        (p.category ? '<p class="proj-cat">' + p.category + '</p>' : '') +
        '<h3 class="proj-name">' + (p.name || '') + '</h3>' +
        (p.description ? '<p class="proj-desc">' + p.description + '</p>' : '') +
        tech + st +
        (links ? '<div class="proj-links">' + links + '</div>' : '') +
        '</div></article>';
    }).join('');
  }

  /* ──────────────────────────────────────────────────────
     PORTFOLIO INIT
     Called once after the overlay sequence ends.
  ────────────────────────────────────────────────────── */
  var portfolioInitialized = false;

  function initPortfolio() {
    if (portfolioInitialized) return;
    portfolioInitialized = true;

    renderProjects();

    if (!('IntersectionObserver' in window)) return;

    /* Mobile nav */
    var hamBtn = document.getElementById('ham');
    var mobNav = document.getElementById('nav-mob');
    if (hamBtn && mobNav) {
      hamBtn.addEventListener('click', function () {
        var open = hamBtn.classList.toggle('on');
        hamBtn.setAttribute('aria-expanded', String(open));
        mobNav.classList.toggle('on', open);
      });
      mobNav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          hamBtn.classList.remove('on');
          hamBtn.setAttribute('aria-expanded', 'false');
          mobNav.classList.remove('on');
        });
      });
    }

    /* Nav active section highlight */
    var secs  = document.querySelectorAll('section[id]');
    var navAs = document.querySelectorAll('.nav-list a');
    if (secs.length && navAs.length) {
      var secObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var id = e.target.id;
            navAs.forEach(function (a) {
              a.classList.toggle('act', a.getAttribute('href') === '#' + id);
            });
          }
        });
      }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
      secs.forEach(function (s) { secObs.observe(s); });
    }

    /* Generic reveal (.rv elements) */
    var rvEls = document.querySelectorAll('.rv');
    if (rvEls.length) {
      var rvObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) e.target.classList.add('on');
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
      rvEls.forEach(function (el) { rvObs.observe(el); });
    }

    /* Timeline items */
    var tlItems = document.querySelectorAll('.tl-item');
    if (tlItems.length) {
      var tlObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) e.target.classList.add('on');
        });
      }, { threshold: 0.15 });
      tlItems.forEach(function (el) { tlObs.observe(el); });
    }

    /* Meta cards with stagger */
    var mcs = document.querySelectorAll('.mc');
    if (mcs.length) {
      var mcObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var d = parseInt(e.target.getAttribute('data-d') || '0', 10);
            setTimeout(function () { e.target.classList.add('on'); }, d);
          }
        });
      }, { threshold: 0.1 });
      mcs.forEach(function (el) { mcObs.observe(el); });
    }

    /* Achievement items */
    var achItems = document.querySelectorAll('.ach-item');
    if (achItems.length) {
      var achObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e, i) {
          if (e.isIntersecting) {
            setTimeout(function () { e.target.classList.add('on'); }, i * 110);
          }
        });
      }, { threshold: 0.15 });
      achItems.forEach(function (el) { achObs.observe(el); });
    }

    /* Skill bar animation — FIXED: animate width, not scaleX */
    var skCards = document.querySelectorAll('.sk-card');
    if (skCards.length) {
      var skObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var fill = e.target.querySelector('.sk-fill');
            if (fill) {
              /* data-w e.g. "70%" — set as the width directly */
              fill.style.width = fill.getAttribute('data-w') || '100%';
            }
          }
        });
      }, { threshold: 0.25 });
      skCards.forEach(function (el) { skObs.observe(el); });
    }
  }

}());
