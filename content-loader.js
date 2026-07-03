/**
 * Florence Tonight - Content Loader
 * Fetches content from the cloud database (Upstash Redis via /api/content)
 * and dynamically renders it on the website pages.
 * Falls back to localStorage for offline/dev mode.
 */
(function () {
    // Fetch all content from the cloud API
    fetch('/api/content?t=' + Date.now())
        .then(function (res) { return res.json(); })
        .then(function (cloud) { renderAll(cloud); })
        .catch(function () {
            // Fallback to localStorage if API is unavailable (local dev)
            console.warn('[content-loader] API unavailable, falling back to localStorage');
            var local = {};
            var keys = [
                'ft-events', 'ft-hero', 'ft-guides', 'ft-newest-guides',
                'ft-events-coming', 'ft-hg-thisweek', 'ft-hg-more', 'ft-hg-stories',
                'ft-ap-highlights', 'ft-ap-time', 'ft-ap-latest',
                'ft-ad-featured-main', 'ft-ad-featured-list', 'ft-ad-scene', 'ft-ad-editors-pick'
            ];
            keys.forEach(function (k) {
                var val = localStorage.getItem(k);
                if (val) local[k] = JSON.parse(val);
            });
            renderAll(local);
        });

    function renderAll(data) {
        loadEvents(data['ft-events']);
        loadGuides(data['ft-guides']);
        loadHero(data['ft-hero']);
        loadHgThisWeek(data['ft-hg-thisweek']);
        loadHgMore(data['ft-hg-more']);
        loadHgStories(data['ft-hg-stories']);
        loadNewestGuides(data['ft-newest-guides']);
        loadApHighlights(data['ft-ap-highlights']);
        loadApTime(data['ft-ap-time']);
        loadApLatest(data['ft-ap-latest']);
        loadEventsComing(data['ft-events-coming']);
        loadAdFeatured(data['ft-ad-featured-main'], data['ft-ad-featured-list']);
        loadAdScene(data['ft-ad-scene']);
        loadAdEditorsPick(data['ft-ad-editors-pick']);

        // Re-render Lucide icons for any new data-lucide elements
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Re-apply language translation after dynamic content is loaded
        if (typeof applyLanguage === 'function') {
            applyLanguage(localStorage.getItem('ft-lang') || 'en');
        }
    }

    function parse(val) {
        if (!val) return null;
        if (typeof val === 'string') {
            try { return JSON.parse(val); } catch (e) { return null; }
        }
        return val; // already parsed object/array
    }

    // -- LOAD EVENTS --
    function loadEvents(raw) {
        var events = parse(raw);
        if (!events) return;
        var carousel = document.querySelector('.events-carousel');
        if (!carousel) return;
        var navDiv = carousel.querySelector('.carousel-nav');
        carousel.querySelectorAll('.event-card').forEach(function (c) { c.remove(); });

        events.forEach(function (ev) {
            var card = document.createElement('div');
            card.className = 'event-card';
            card.dataset.ticketPrice = ev.ticketPrice !== undefined ? ev.ticketPrice : 20;
            card.dataset.tablePrice = ev.tablePrice !== undefined ? ev.tablePrice : 15;
            card.dataset.tableAvailable = ev.tableAvailable !== undefined ? ev.tableAvailable : true;
            card.innerHTML =
                '<div class="card-image">' +
                    '<img src="' + ev.image + '" alt="' + ev.title + '" onerror="this.src=\'/images/hero_bg.png\'">' +
                '</div>' +
                '<div class="card-content">' +
                    '<span class="card-tag">' + ev.tag + '</span>' +
                    '<h3 class="card-title">' + ev.title + '</h3>' +
                    '<p class="card-subtitle">' + ev.subtitle + '</p>' +
                    '<p class="card-subtitle">' + ev.age + '</p>' +
                    '<p class="card-meta">' +
                        '<span class="icon-pin"></span> ' + ev.location + '<br>' +
                        ev.days + '<br>' +
                        ev.hours +
                    '</p>' +
                '</div>';
            if (navDiv) {
                carousel.insertBefore(card, navDiv);
            } else {
                carousel.appendChild(card);
            }
        });
    }

    // -- LOAD GUIDES --
    function loadGuides(raw) {
        var guides = parse(raw);
        if (!guides) return;
        var guidesGrid = document.querySelector('.guides-grid-4');
        if (!guidesGrid) return;
        guidesGrid.innerHTML = '';
        guides.forEach(function (g) {
            var card = document.createElement('div');
            card.className = 'event-card';
            card.innerHTML =
                '<div class="card-image">' +
                    '<img src="' + g.image + '" alt="' + g.title + '" onerror="this.src=\'/images/hero_bg.png\'">' +
                '</div>' +
                '<div class="card-content">' +
                    '<span class="card-tag">' + g.tag + '</span>' +
                    '<h3 class="card-title" style="font-size:1.2rem;">' + g.title + '</h3>' +
                    '<p class="card-subtitle" style="text-transform:none; margin-bottom: 0;">' + g.subtitle + '</p>' +
                    '<p style="color:var(--accent-gold); margin-top: 1rem; font-size:1.2rem;">&rarr;</p>' +
                '</div>';
            guidesGrid.appendChild(card);
        });
    }

    // -- LOAD HERO --
    function loadHero(raw) {
        var hero = parse(raw);
        if (!hero || !hero.line1) return;
        var l1 = document.querySelector('[data-i18n="hero.line1"]');
        var l2 = document.querySelector('[data-i18n="hero.line2"]');
        var l3 = document.querySelector('[data-i18n="hero.line3"]');
        var sub = document.querySelector('[data-i18n="hero.subtitle"]');
        var cta = document.querySelector('[data-i18n="hero.cta"]');
        if (l1) l1.textContent = hero.line1;
        if (l2) l2.textContent = hero.line2;
        if (l3) l3.textContent = hero.line3;
        if (sub) sub.innerHTML = hero.subtitle;
        if (cta) cta.textContent = hero.cta;
    }

    // -- LOAD HIDDEN GEMS: THIS WEEK --
    function loadHgThisWeek(raw) {
        var hgThisWeek = parse(raw);
        if (!hgThisWeek) return;
        var grid = document.querySelector('.hg-gems-grid');
        if (!grid) return;
        grid.innerHTML = '';
        hgThisWeek.forEach(function (g, index) {
            var num = String(index + 1).padStart(2, '0');
            var card = document.createElement('div');
            card.className = 'hg-card';
            card.innerHTML =
                '<div class="card-image hg-img-tall">' +
                    '<img src="' + g.image + '" alt="' + g.title + '" onerror="this.src=\'/images/hero_bg.png\'">' +
                '</div>' +
                '<div class="card-content hg-card-content">' +
                    '<div class="hg-num" style="color:var(--accent-gold); font-size:0.9rem; margin-bottom:1rem;">' + num + '</div>' +
                    '<span class="card-tag">' + g.tag + '</span>' +
                    '<h3 class="card-title hg-title">' + g.title + '</h3>' +
                    '<p class="card-subtitle hg-desc">' + g.subtitle + '</p>' +
                    '<p class="hg-meta">' + g.location + '</p>' +
                '</div>';
            grid.appendChild(card);
        });
    }

    // -- LOAD HIDDEN GEMS: MORE --
    function loadHgMore(raw) {
        var hgMore = parse(raw);
        if (!hgMore) return;
        var list = document.querySelector('.hg-list');
        if (!list) return;
        list.innerHTML = '';
        hgMore.forEach(function (g) {
            var item = document.createElement('div');
            item.className = 'hg-list-item';
            item.innerHTML =
                '<img src="' + g.image + '" alt="' + g.title + '" onerror="this.src=\'/images/hero_bg.png\'">' +
                '<div class="hg-list-text">' +
                    '<span class="card-tag">' + g.tag + '</span>' +
                    '<h4 style="font-size:1.1rem; margin-bottom:0.5rem; font-family:var(--font-heading);">' + g.title + '</h4>' +
                    '<p style="color:var(--text-secondary); font-size:0.8rem; margin-bottom:0.5rem;">' + g.subtitle + '</p>' +
                    '<a href="#" class="view-all">READ MORE &rarr;</a>' +
                '</div>';
            list.appendChild(item);
        });
    }

    // -- LOAD HIDDEN GEMS: STORIES --
    function loadHgStories(raw) {
        var hgStories = parse(raw);
        if (!hgStories) return;
        var grid = document.querySelector('.hg-stories-grid');
        if (!grid) return;
        grid.innerHTML = '';
        hgStories.forEach(function (g) {
            var card = document.createElement('div');
            card.className = 'hg-story-card';
            card.innerHTML =
                '<img src="' + g.image + '" alt="' + g.title + '" onerror="this.src=\'/images/hero_bg.png\'">' +
                '<div class="card-content" style="padding:1rem;">' +
                    '<span class="card-tag">' + g.tag + '</span>' +
                    '<h4 style="font-size:1rem; margin-bottom:0.5rem; font-family:var(--font-heading);">' + g.title + '</h4>' +
                    '<p style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:1rem;">' + g.subtitle + '</p>' +
                    '<span style="font-size:0.6rem; color:var(--text-secondary);">' + g.date + '</span>' +
                '</div>';
            grid.appendChild(card);
        });
    }

    // -- LOAD NEWEST GUIDES --
    function loadNewestGuides(raw) {
        var newestGuides = parse(raw);
        if (!newestGuides) return;
        var grid = document.querySelector('.guides-grid-6');
        if (!grid) return;
        grid.innerHTML = '';
        newestGuides.forEach(function (g) {
            var card = document.createElement('div');
            card.className = 'newest-card';
            card.innerHTML =
                '<img src="' + g.image + '" alt="' + g.title + '" onerror="this.src=\'/images/hero_bg.png\'">' +
                '<div class="card-content" style="padding:1rem;">' +
                    '<span class="card-tag">' + g.tag + '</span>' +
                    '<h4 style="font-size:0.9rem; margin-bottom:0.5rem; line-height:1.2;">' + g.title + '</h4>' +
                    '<div style="display:flex; justify-content:space-between; align-items:center;">' +
                        '<span style="font-size:0.6rem; color:var(--text-secondary);">' + g.date + '</span>' +
                        '<span style="color:var(--text-secondary);">&rarr;</span>' +
                    '</div>' +
                '</div>';
            grid.appendChild(card);
        });
    }

    // -- LOAD APERITIVO HIGHLIGHTS --
    function loadApHighlights(raw) {
        var apHighlights = parse(raw);
        if (!apHighlights) return;
        var grid = document.getElementById('ap-highlights-grid');
        if (!grid) return;
        grid.innerHTML = '';
        apHighlights.forEach(function (g) {
            var card = document.createElement('div');
            card.className = 'event-card';
            card.innerHTML =
                '<div class="card-image">' +
                    '<img src="' + g.image + '" alt="' + g.title + '" onerror="this.src=\'/images/hero_bg.png\'">' +
                '</div>' +
                '<div class="card-content" style="padding:1.5rem;">' +
                    '<span class="card-tag" style="color:var(--accent-purple);">' + g.tag + '</span>' +
                    '<h3 class="card-title" style="font-size:1.2rem; margin-bottom:0.5rem;">' + g.title + '</h3>' +
                    '<p style="color:var(--accent-purple); margin-top: 1rem; font-size:1.2rem;">&rarr;</p>' +
                '</div>';
            grid.appendChild(card);
        });
    }

    // -- LOAD APERITIVO TIME --
    function loadApTime(raw) {
        var apTime = parse(raw);
        if (!apTime) return;
        var grid = document.getElementById('ap-time-grid');
        if (!grid) return;
        grid.innerHTML = '';
        apTime.forEach(function (g) {
            var card = document.createElement('div');
            card.className = 'time-card';
            card.style.backgroundImage = "url('" + g.image + "')";
            card.innerHTML =
                '<div class="time-overlay">' +
                    '<h3 style="font-family:var(--font-heading); font-size:1.5rem; margin-bottom:0.5rem;">' + g.title + '</h3>' +
                    '<p style="font-size:0.8rem; color:var(--text-secondary); max-width:200px;">' + g.subtitle + '</p>' +
                    '<p style="color:var(--accent-purple); margin-top: 0.5rem; font-size:1.2rem;">&rarr;</p>' +
                '</div>';
            grid.appendChild(card);
        });
    }

    // -- LOAD APERITIVO LATEST --
    function loadApLatest(raw) {
        var apLatest = parse(raw);
        if (!apLatest) return;
        var grid = document.getElementById('ap-latest-grid');
        if (!grid) return;
        grid.innerHTML = '';
        apLatest.forEach(function (g) {
            var card = document.createElement('div');
            card.className = 'newest-card';
            card.innerHTML =
                '<img src="' + g.image + '" alt="' + g.title + '" onerror="this.src=\'/images/hero_bg.png\'">' +
                '<div class="card-content" style="padding:1rem;">' +
                    '<span class="card-tag" style="color:var(--accent-purple);">' + g.tag + '</span>' +
                    '<h4 style="font-size:0.9rem; margin-bottom:0.5rem; line-height:1.2;">' + g.title + '</h4>' +
                    '<div style="display:flex; justify-content:space-between; align-items:center;">' +
                        '<span style="font-size:0.6rem; color:var(--text-secondary);">' + g.date + '</span>' +
                        '<span style="color:var(--text-secondary);">&rarr;</span>' +
                    '</div>' +
                '</div>';
            grid.appendChild(card);
        });
    }

    // -- LOAD COMING SOON (EVENTS) --
    function loadEventsComing(raw) {
        var eventsComing = parse(raw);
        if (!eventsComing) return;
        var grid = document.getElementById('events-coming-grid');
        if (!grid) return;
        grid.innerHTML = '';
        eventsComing.forEach(function (g) {
            var card = document.createElement('div');
            card.className = 'coming-card';
            card.style.backgroundImage = "url('" + g.image + "')";
            card.innerHTML =
                '<div class="coming-overlay">' +
                    '<p style="font-size:0.75rem; margin-bottom:0.25rem;">' + g.tag + '</p>' +
                    '<h4 style="font-size:1.1rem; margin-bottom:1rem; font-weight:600;">' + g.date + '</h4>' +
                    '<h3 style="font-family:var(--font-heading); font-size:1.5rem; margin-bottom:0.5rem;">' + g.title + '</h3>' +
                    '<p style="font-size:0.8rem; color:var(--text-secondary);">' + g.subtitle + '</p>' +
                '</div>';
            grid.appendChild(card);
        });
    }

    // -- LOAD AFTER DARK: FEATURED STORY --
    function loadAdFeatured(rawMain, rawList) {
        var adMainArr = parse(rawMain);
        var adList = parse(rawList);
        if (!adMainArr || !adList) return;
        var adMain = adMainArr[0];
        var container = document.getElementById('ad-featured-container');
        if (!container || !adMain) return;

        var listHtml = '<div class="fs-list">';
        adList.forEach(function (item) {
            listHtml +=
                '<div class="fs-item">' +
                    '<img src="' + item.image + '" alt="' + item.title + '" onerror="this.src=\'/images/hero_bg.png\'">' +
                    '<div class="fs-item-info">' +
                        '<span class="tag">' + item.tag + '</span>' +
                        '<h4>' + item.title + '</h4>' +
                        '<span class="date">' + item.date + '</span>' +
                    '</div>' +
                '</div>';
        });
        listHtml += '</div>';

        container.innerHTML =
            '<div class="fs-main" style="background: url(\'' + adMain.image + '\') center/cover;">' +
                '<div class="fs-main-content">' +
                    '<span class="tag">' + adMain.tag + '</span>' +
                    '<h3>' + adMain.title + '</h3>' +
                    '<p>' + adMain.subtitle + '</p>' +
                    '<a href="#">READ STORY &rarr;</a>' +
                '</div>' +
            '</div>' +
            listHtml;
    }

    // -- LOAD AFTER DARK: THE SCENE --
    function loadAdScene(raw) {
        var adScene = parse(raw);
        if (!adScene) return;
        var grid = document.getElementById('ad-scene-grid');
        if (!grid) return;
        grid.innerHTML = '';
        adScene.forEach(function (item) {
            var card = document.createElement('div');
            card.className = 'scene-card';
            card.innerHTML =
                '<img src="' + item.image + '" alt="' + item.title + '" onerror="this.src=\'/images/hero_bg.png\'">' +
                '<div class="scene-info">' +
                    '<span class="tag">' + item.tag + '</span>' +
                    '<h4>' + item.title + '</h4>' +
                '</div>';
            grid.appendChild(card);
        });
    }

    // -- LOAD AFTER DARK: EDITOR'S PICK --
    function loadAdEditorsPick(raw) {
        var adEPArr = parse(raw);
        if (!adEPArr) return;
        var adEP = adEPArr[0];
        var container = document.getElementById('ad-editors-pick-container');
        if (!container || !adEP) return;
        container.innerHTML =
            '<h2 class="sec-title">EDITOR\'S PICK</h2>' +
            '<div class="ep-card">' +
                '<div class="ep-image">' +
                    '<img src="' + adEP.image + '" alt="' + adEP.title + '" onerror="this.src=\'/images/hero_bg.png\'">' +
                '</div>' +
                '<div class="ep-info">' +
                    '<span class="tag">' + adEP.tag + '</span>' +
                    '<h3>' + adEP.title + '</h3>' +
                    '<p>' + adEP.subtitle + '</p>' +
                    '<a href="#">READ THE STORY &rarr;</a>' +
                '</div>' +
            '</div>';
    }
})();

