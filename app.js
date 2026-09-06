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
    var COUNT    = isMobile ? 25 : 50;

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
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r:  Math.random() * 1.3 + 0.4,
        o:  Math.random() * 0.22 + 0.04
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
    { text: "A resume tells you where I am.", cls: '' },
    { text: "This is what I'm building.",     cls: '' },
    { text: "Safar abhi jaari hai.",           cls: 'urdu' },
    { text: "Take a look around.",             cls: '' }
  ];

  if (introEl && !document.documentElement.classList.contains('direct-entry')) {
    initParticles();

    /* Trigger dragon after second line begins */
    var dragonEl = document.getElementById('dragon-svg');
    setTimeout(function () {
      if (dragonEl) dragonEl.classList.add('fly');
    }, 1900);

    /* Typing sequence */
    var li = 0;
    var activeCursor = null;

    function nextLine() {
      if (li >= LINES.length) {
        if (activeCursor) { activeCursor.remove(); activeCursor = null; }
        setTimeout(function () { if (ibtnEl) ibtnEl.classList.add('vis'); }, 480);
        return;
      }
      var cfg = LINES[li];
      var p   = document.createElement('p');
      p.className = 'intro-line' + (cfg.cls ? ' ' + cfg.cls : '');
      var ts = document.createElement('span');
      ts.className = 'tt';
      p.appendChild(ts);
      if (activeCursor) activeCursor.remove();
      activeCursor = document.createElement('span');
      activeCursor.className = 'cursor';
      activeCursor.setAttribute('aria-hidden', 'true');
      p.appendChild(activeCursor);
      ilinesEl.appendChild(p);
      requestAnimationFrame(function () { p.classList.add('vis'); });

      var ci = 0, text = cfg.text;
      function typeChar() {
        if (ci < text.length) {
          ts.textContent += text[ci++];
          setTimeout(typeChar, 28);
        } else {
          li++;
          setTimeout(nextLine, 230);
        }
      }
      setTimeout(typeChar, 50);
    }

    setTimeout(nextLine, 380);

    /* Click anywhere on intro screen to advance (after 1.2s) */
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

    /* Crossfade: intro fades, mascot screen fades in simultaneously */
    introEl.style.opacity       = '0';
    introEl.style.pointerEvents = 'none';
    if (mascotScreen) mascotScreen.classList.add('vis');
    /* Start mascot immediately — character enters as intro fades */
    if (mascotScreen) runMascotSequence();
    /* Cleanup intro DOM after its fade completes */
    setTimeout(function () {
      introEl.style.display = 'none';
      stopParticles();
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

    /* ── 1. CHARACTER ENTRANCE ─────────────────────────────────
       Double rAF: first frame = element rendered at initial state,
       second frame = transition fires from that state.
       Character rises from slightly below, fades in, settles.
       CSS cubic-bezier(.22,1.1,.36,1) gives a gentle overshoot/land. */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        wrap.style.transition = 'transform .9s cubic-bezier(.22,1.1,.36,1), opacity .6s ease';
        wrap.style.transform  = 'translateY(0) scale(1)';
        wrap.style.opacity    = '1';
      });
    });

    /* ── 2. KNOCK SEQUENCE ─────────────────────────────────────
       Timeline (relative to T=0 = Explore click):
       
       T=880ms:  Arm appears — CSS @keyframes armKnock starts
       T=880+338ms = T=1218ms: Impact 1 (25% of 1350ms keyframe)
                  → ripple 1 fires here to match visual impact
       T=880+972ms = T=1852ms: Impact 2 (72% of 1350ms keyframe)
                  → ripple 2 fires here
       T=880+1350ms = T=2230ms: Arm keyframe ends, returns to rest
       T=2380ms:  Knock-done class → body returns to float animation
    
       The CSS armKnock keyframe handles all arm motion.
       JS only needs to add/remove the .knocking class and
       fire the ripples at the correct impact moments.
    */
    var KNOCK_START   = 880;   /* ms from T=0 */
    var IMPACT_1      = 338;   /* ms into armKnock (25% of 1350ms) */
    var IMPACT_2      = 972;   /* ms into armKnock (72% of 1350ms) */
    var KNOCK_DURATION = 1350; /* matches CSS armKnock duration */

    setTimeout(function () {
      if (mascotSvg) mascotSvg.classList.add('knocking');
    }, KNOCK_START);

    /* Ripple 1 — fires at moment of first impact */
    setTimeout(function () {
      spawnRipple(wrap);
    }, KNOCK_START + IMPACT_1);

    /* Ripple 2 — fires at moment of second impact */
    setTimeout(function () {
      spawnRipple(wrap);
    }, KNOCK_START + IMPACT_2);

    /* Remove knocking class after keyframe ends + brief buffer */
    setTimeout(function () {
      if (mascotSvg) {
        mascotSvg.classList.remove('knocking');
        mascotSvg.classList.add('knock-done');
        /* Clean up knock-done class after float resumes */
        setTimeout(function () {
          if (mascotSvg) mascotSvg.classList.remove('knock-done');
        }, 200);
      }
    }, KNOCK_START + KNOCK_DURATION + 80);

    /* ── 3. REACTION PAUSE ─────────────────────────────────────
       Character is still after knock. No dialogue yet.
       This gives the viewer a beat to understand what happened.
       Then: a tiny head look toward viewer (handled by headLook CSS)
       before speaking. */

    /* ── 4. SPEECH BUBBLE 1 ────────────────────────────────────
       Appears ~400ms after knock ends.
       Character has settled, now acknowledges the visitor. */
    var SPEECH1_TIME = KNOCK_START + KNOCK_DURATION + 480;  /* ~2310ms */
    setTimeout(function () {
      showSpeech(speechEl, 'Oh, you made it.');
    }, SPEECH1_TIME);

    /* ── 5. SPEECH BUBBLE 2 ────────────────────────────────────
       First bubble stays for ~1600ms, then a 380ms gap,
       then second bubble appears. */
    var SPEECH2_TIME = SPEECH1_TIME + 1600 + 380;           /* ~4290ms */
    setTimeout(function () {
      hideSpeech(speechEl);
    }, SPEECH1_TIME + 1600);
    setTimeout(function () {
      showSpeech(speechEl, "Come on. I'll show you around.");
    }, SPEECH2_TIME);

    /* ── 6. WAVE GESTURE ───────────────────────────────────────
       Fires AFTER speech 2 has been readable for ~500ms.
       Speech leads the gesture — character says it, then shows it. */
    var WAVE_TIME = SPEECH2_TIME + 500;                      /* ~4790ms */
    setTimeout(function () {
      if (mascotSvg) mascotSvg.classList.add('waving');
    }, WAVE_TIME);

    /* ── 7. FOLLOW ME ──────────────────────────────────────────
       Appears 380ms after wave starts — arm is visibly raised
       before the button appears. */
    setTimeout(function () {
      if (followBtn) followBtn.classList.add('on');
    }, WAVE_TIME + 380);

    /* ── FOLLOW ME CLICK HANDLER ───────────────────────────────
       Self-removes after one use.
       Brief 160ms gap before exit so character visually reacts. */
    if (followBtn) {
      followBtn.addEventListener('click', function onFollow() {
        followBtn.removeEventListener('click', onFollow);
        followBtn.disabled = true;
        hideSpeech(speechEl);
        followBtn.style.transition = 'opacity .2s ease';
        followBtn.style.opacity    = '0';
        setTimeout(function () {
          walkOffAndReveal(mascotSvg, speechEl, wrap);
        }, 200);
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
    setTimeout(function () { if (r.parentNode) r.parentNode.removeChild(r); }, 850);
  }

  function walkOffAndReveal(mascotSvg, speechEl, wrap) {
    var mScreen = document.getElementById('mascot-screen');

    /* Remove any lingering arm/speech states */
    if (mascotSvg) mascotSvg.classList.remove('knocking', 'knock-done', 'waving');
    hideSpeech(speechEl);

    /* Character accelerates toward the portfolio (right side).
       Slight scale down as it moves away — depth cue.
       Opacity delay .15s so it's visible for a moment before fading. */
    if (wrap) {
      wrap.style.transition = 'transform .95s cubic-bezier(.4,0,.85,.6), opacity .65s .15s ease';
      wrap.style.transform  = 'translateX(115vw) scale(.85)';
      wrap.style.opacity    = '0';
    }

    /* Portfolio begins appearing while character is still mid-exit.
       This creates the feeling of following the character into the portfolio. */
    setTimeout(function () {
      if (mScreen) {
        mScreen.style.transition = 'opacity .8s ease';
        mScreen.style.opacity    = '0';
        mScreen.style.pointerEvents = 'none';
      }
      revealPortfolio();
    }, 320);

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
    try { localStorage.setItem('ak_v2', '1'); } catch (e) {}
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
      /* Fade before hiding — avoids jarring instant cut */
      if (intro)  { intro.style.opacity  = '0'; intro.style.pointerEvents  = 'none'; }
      if (mascot) { mascot.style.opacity = '0'; mascot.style.pointerEvents = 'none'; }
      stopParticles();
      setTimeout(function () {
        if (intro)  intro.style.display  = 'none';
        if (mascot) mascot.style.display = 'none';
        revealPortfolio();
      }, 300);
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
     Initialises all observers and interactions.
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

    /* Skill bar animation */
    var skCards = document.querySelectorAll('.sk-card');
    if (skCards.length) {
      var skObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var card = e.target;
            card.classList.add('anim');
            var fill = card.querySelector('.sk-fill');
            if (fill) fill.style.width = fill.getAttribute('data-w') || '100%';
          }
        });
      }, { threshold: 0.25 });
      skCards.forEach(function (el) { skObs.observe(el); });
    }
  }

}());
