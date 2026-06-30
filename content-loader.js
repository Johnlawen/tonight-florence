/**
 * Florence Tonight — Content Loader
 * Reads content saved by admin.html and dynamically renders it on the homepage.
 */
(function () {
    // ── LOAD EVENTS ──
// ── LOAD EVENTS ──
    const storedEvents = localStorage.getItem('ft-events');
    if (storedEvents) {
        const events = JSON.parse(storedEvents);
        const carousel = document.querySelector('.events-carousel');
        if (carousel) {
            const navDiv = carousel.querySelector('.carousel-nav');
            // Clear existing static cards (keep nav arrow)
            carousel.querySelectorAll('.event-card').forEach(c => c.remove());

            // Rebuild cards from stored data
            events.forEach(ev => {
                const card = document.createElement('div');
                card.className = 'event-card';
                card.dataset.ticketPrice = ev.ticketPrice !== undefined ? ev.ticketPrice : 20;
                card.dataset.tablePrice = ev.tablePrice !== undefined ? ev.tablePrice : 15;
                card.dataset.tableAvailable = ev.tableAvailable !== undefined ? ev.tableAvailable : true;
                card.innerHTML = `
                    <div class="card-image">
                        <img src="${ev.image}" alt="${ev.title}" onerror="this.src='./images/hero_bg.png'">
                    </div>
                    <div class="card-content">
                        <span class="card-tag">${ev.tag}</span>
                        <h3 class="card-title">${ev.title}</h3>
                        <p class="card-subtitle">${ev.subtitle}</p>
                        <p class="card-subtitle">${ev.age}</p>
                        <p class="card-meta">
                            <span class="icon-pin"></span> ${ev.location}<br>
                            ${ev.days}<br>
                            ${ev.hours}
                        </p>
                    </div>
                `;
                // Insert before the nav arrow div
                if (navDiv) {
                    carousel.insertBefore(card, navDiv);
                } else {
                    carousel.appendChild(card);
                }
            });
        }
    }

    // ── LOAD GUIDES ──
    const storedGuides = localStorage.getItem('ft-guides');
    if (storedGuides) {
        const guides = JSON.parse(storedGuides);
        const guidesGrid = document.querySelector('.guides-grid-4');
        if (guidesGrid) {
            guidesGrid.innerHTML = ''; // clear static guides
            guides.forEach(g => {
                const card = document.createElement('div');
                card.className = 'event-card';
                card.innerHTML = `
                    <div class="card-image">
                        <img src="${g.image}" alt="${g.title}" onerror="this.src='./images/hero_bg.png'">
                    </div>
                    <div class="card-content">
                        <span class="card-tag">${g.tag}</span>
                        <h3 class="card-title" style="font-size:1.2rem;">${g.title}</h3>
                        <p class="card-subtitle" style="text-transform:none; margin-bottom: 0;">${g.subtitle}</p>
                        <p style="color:var(--accent-gold); margin-top: 1rem; font-size:1.2rem;">&rarr;</p>
                    </div>
                `;
                guidesGrid.appendChild(card);
            });
        }
    }

    // ── LOAD HERO ──
    const hero = JSON.parse(localStorage.getItem('ft-hero') || '{}');
    if (hero.line1) {
        const l1 = document.querySelector('[data-i18n="hero.line1"]');
        const l2 = document.querySelector('[data-i18n="hero.line2"]');
        const l3 = document.querySelector('[data-i18n="hero.line3"]');
        const sub = document.querySelector('[data-i18n="hero.subtitle"]');
        const cta = document.querySelector('[data-i18n="hero.cta"]');
        if (l1) l1.textContent = hero.line1;
        if (l2) l2.textContent = hero.line2;
        if (l3) l3.textContent = hero.line3;
        if (sub) sub.innerHTML = hero.subtitle;
        if (cta) cta.textContent = hero.cta;
    }

    // ── LOAD HIDDEN GEMS: THIS WEEK ──
    const storedHgThisWeek = localStorage.getItem('ft-hg-thisweek');
    if (storedHgThisWeek) {
        const hgThisWeek = JSON.parse(storedHgThisWeek);
        const grid = document.querySelector('.hg-gems-grid');
        if (grid) {
            grid.innerHTML = '';
            hgThisWeek.forEach((g, index) => {
                const num = String(index + 1).padStart(2, '0');
                const card = document.createElement('div');
                card.className = 'hg-card';
                card.innerHTML = `
                    <div class="card-image hg-img-tall">
                        <img src="${g.image}" alt="${g.title}" onerror="this.src='./images/hero_bg.png'">
                    </div>
                    <div class="card-content hg-card-content">
                        <div class="hg-num" style="color:var(--accent-gold); font-size:0.9rem; margin-bottom:1rem;">${num}</div>
                        <span class="card-tag">${g.tag}</span>
                        <h3 class="card-title hg-title">${g.title}</h3>
                        <p class="card-subtitle hg-desc">${g.subtitle}</p>
                        <p class="hg-meta">${g.location}</p>
                    </div>
                `;
                grid.appendChild(card);
            });
        }
    }

    // ── LOAD HIDDEN GEMS: MORE ──
    const storedHgMore = localStorage.getItem('ft-hg-more');
    if (storedHgMore) {
        const hgMore = JSON.parse(storedHgMore);
        const list = document.querySelector('.hg-list');
        if (list) {
            list.innerHTML = '';
            hgMore.forEach(g => {
                const item = document.createElement('div');
                item.className = 'hg-list-item';
                item.innerHTML = `
                    <img src="${g.image}" alt="${g.title}" onerror="this.src='./images/hero_bg.png'">
                    <div class="hg-list-text">
                        <span class="card-tag">${g.tag}</span>
                        <h4 style="font-size:1.1rem; margin-bottom:0.5rem; font-family:var(--font-heading);">${g.title}</h4>
                        <p style="color:var(--text-secondary); font-size:0.8rem; margin-bottom:0.5rem;">${g.subtitle}</p>
                        <a href="#" class="view-all">READ MORE &rarr;</a>
                    </div>
                `;
                list.appendChild(item);
            });
        }
    }

    // ── LOAD HIDDEN GEMS: STORIES ──
    const storedHgStories = localStorage.getItem('ft-hg-stories');
    if (storedHgStories) {
        const hgStories = JSON.parse(storedHgStories);
        const grid = document.querySelector('.hg-stories-grid');
        if (grid) {
            grid.innerHTML = '';
            hgStories.forEach(g => {
                const card = document.createElement('div');
                card.className = 'hg-story-card';
                card.innerHTML = `
                    <img src="${g.image}" alt="${g.title}" onerror="this.src='./images/hero_bg.png'">
                    <div class="card-content" style="padding:1rem;">
                        <span class="card-tag">${g.tag}</span>
                        <h4 style="font-size:1rem; margin-bottom:0.5rem; font-family:var(--font-heading);">${g.title}</h4>
                        <p style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:1rem;">${g.subtitle}</p>
                        <span style="font-size:0.6rem; color:var(--text-secondary);">${g.date}</span>
                    </div>
                `;
                grid.appendChild(card);
            });
        }
    }

    // ── LOAD NEWEST GUIDES ──
    const storedNewestGuides = localStorage.getItem('ft-newest-guides');
    if (storedNewestGuides) {
        const newestGuides = JSON.parse(storedNewestGuides);
        const grid = document.querySelector('.guides-grid-6');
        if (grid) {
            grid.innerHTML = '';
            newestGuides.forEach(g => {
                const card = document.createElement('div');
                card.className = 'newest-card';
                card.innerHTML = `
                    <img src="${g.image}" alt="${g.title}" onerror="this.src='./images/hero_bg.png'">
                    <div class="card-content" style="padding:1rem;">
                        <span class="card-tag">${g.tag}</span>
                        <h4 style="font-size:0.9rem; margin-bottom:0.5rem; line-height:1.2;">${g.title}</h4>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:0.6rem; color:var(--text-secondary);">${g.date}</span>
                            <span style="color:var(--text-secondary);">&rarr;</span>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        }
    }

    // ── LOAD APERITIVO HIGHLIGHTS ──
    const storedApHighlights = localStorage.getItem('ft-ap-highlights');
    if (storedApHighlights) {
        const apHighlights = JSON.parse(storedApHighlights);
        const grid = document.getElementById('ap-highlights-grid');
        if (grid) {
            grid.innerHTML = '';
            apHighlights.forEach(g => {
                const card = document.createElement('div');
                card.className = 'event-card';
                card.innerHTML = `
                    <div class="card-image">
                        <img src="${g.image}" alt="${g.title}" onerror="this.src='./images/hero_bg.png'">
                    </div>
                    <div class="card-content" style="padding:1.5rem;">
                        <span class="card-tag" style="color:var(--accent-purple);">${g.tag}</span>
                        <h3 class="card-title" style="font-size:1.2rem; margin-bottom:0.5rem;">${g.title}</h3>
                        <p style="color:var(--accent-purple); margin-top: 1rem; font-size:1.2rem;">&rarr;</p>
                    </div>
                `;
                grid.appendChild(card);
            });
        }
    }

    // ── LOAD APERITIVO TIME ──
    const storedApTime = localStorage.getItem('ft-ap-time');
    if (storedApTime) {
        const apTime = JSON.parse(storedApTime);
        const grid = document.getElementById('ap-time-grid');
        if (grid) {
            grid.innerHTML = '';
            apTime.forEach(g => {
                const card = document.createElement('div');
                card.className = 'time-card';
                card.style.backgroundImage = `url('${g.image}')`;
                card.innerHTML = `
                    <div class="time-overlay">
                        <h3 style="font-family:var(--font-heading); font-size:1.5rem; margin-bottom:0.5rem;">${g.title}</h3>
                        <p style="font-size:0.8rem; color:var(--text-secondary); max-width:200px;">${g.subtitle}</p>
                        <p style="color:var(--accent-purple); margin-top: 0.5rem; font-size:1.2rem;">&rarr;</p>
                    </div>
                `;
                grid.appendChild(card);
            });
        }
    }

    // ── LOAD APERITIVO LATEST ──
    const storedApLatest = localStorage.getItem('ft-ap-latest');
    if (storedApLatest) {
        const apLatest = JSON.parse(storedApLatest);
        const grid = document.getElementById('ap-latest-grid');
        if (grid) {
            grid.innerHTML = '';
            apLatest.forEach(g => {
                const card = document.createElement('div');
                card.className = 'newest-card';
                card.innerHTML = `
                    <img src="${g.image}" alt="${g.title}" onerror="this.src='./images/hero_bg.png'">
                    <div class="card-content" style="padding:1rem;">
                        <span class="card-tag" style="color:var(--accent-purple);">${g.tag}</span>
                        <h4 style="font-size:0.9rem; margin-bottom:0.5rem; line-height:1.2;">${g.title}</h4>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:0.6rem; color:var(--text-secondary);">${g.date}</span>
                            <span style="color:var(--text-secondary);">&rarr;</span>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        }
    }

    // ── LOAD COMING SOON (EVENTS) ──
    const storedEventsComing = localStorage.getItem('ft-events-coming');
    if (storedEventsComing) {
        const eventsComing = JSON.parse(storedEventsComing);
        const grid = document.getElementById('events-coming-grid');
        if (grid) {
            grid.innerHTML = '';
            eventsComing.forEach(g => {
                const card = document.createElement('div');
                card.className = 'coming-card';
                card.style.backgroundImage = `url('${g.image}')`;
                card.innerHTML = `
                    <div class="coming-overlay">
                        <p style="font-size:0.75rem; margin-bottom:0.25rem;">${g.tag}</p>
                        <h4 style="font-size:1.1rem; margin-bottom:1rem; font-weight:600;">${g.date}</h4>
                        <h3 style="font-family:var(--font-heading); font-size:1.5rem; margin-bottom:0.5rem;">${g.title}</h3>
                        <p style="font-size:0.8rem; color:var(--text-secondary);">${g.subtitle}</p>
                    </div>
                `;
                grid.appendChild(card);
            });
        }
    }

    // ── LOAD AFTER DARK: FEATURED STORY ──
    const storedAdMain = localStorage.getItem('ft-ad-featured-main');
    const storedAdList = localStorage.getItem('ft-ad-featured-list');
    if (storedAdMain && storedAdList) {
        const adMain = JSON.parse(storedAdMain)[0];
        const adList = JSON.parse(storedAdList);
        const container = document.getElementById('ad-featured-container');
        if (container && adMain) {
            let listHtml = '<div class="fs-list">';
            adList.forEach(item => {
                listHtml += `
                    <div class="fs-item">
                        <img src="${item.image}" alt="${item.title}" onerror="this.src='./images/hero_bg.png'">
                        <div class="fs-item-info">
                            <span class="tag">${item.tag}</span>
                            <h4>${item.title}</h4>
                            <span class="date">${item.date}</span>
                        </div>
                    </div>
                `;
            });
            listHtml += '</div>';

            container.innerHTML = `
                <div class="fs-main" style="background: url('${adMain.image}') center/cover;">
                    <div class="fs-main-content">
                        <span class="tag">${adMain.tag}</span>
                        <h3>${adMain.title}</h3>
                        <p>${adMain.subtitle}</p>
                        <a href="#">READ STORY &rarr;</a>
                    </div>
                </div>
                ${listHtml}
            `;
        }
    }

    // ── LOAD AFTER DARK: THE SCENE ──
    const storedAdScene = localStorage.getItem('ft-ad-scene');
    if (storedAdScene) {
        const adScene = JSON.parse(storedAdScene);
        const grid = document.getElementById('ad-scene-grid');
        if (grid) {
            grid.innerHTML = '';
            adScene.forEach(item => {
                const card = document.createElement('div');
                card.className = 'scene-card';
                card.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" onerror="this.src='./images/hero_bg.png'">
                    <div class="scene-info">
                        <span class="tag">${item.tag}</span>
                        <h4>${item.title}</h4>
                    </div>
                `;
                grid.appendChild(card);
            });
        }
    }

    // ── LOAD AFTER DARK: EDITOR'S PICK ──
    const storedAdEditorsPick = localStorage.getItem('ft-ad-editors-pick');
    if (storedAdEditorsPick) {
        const adEP = JSON.parse(storedAdEditorsPick)[0];
        const container = document.getElementById('ad-editors-pick-container');
        if (container && adEP) {
            container.innerHTML = `
                <h2 class="sec-title">EDITOR'S PICK</h2>
                <div class="ep-card">
                    <div class="ep-image">
                        <img src="${adEP.image}" alt="${adEP.title}" onerror="this.src='./images/hero_bg.png'">
                    </div>
                    <div class="ep-info">
                        <span class="tag">${adEP.tag}</span>
                        <h3>${adEP.title}</h3>
                        <p>${adEP.subtitle}</p>
                        <a href="#">READ THE STORY &rarr;</a>
                    </div>
                </div>
            `;
        }
    }

    // ── RE-RENDER LUCIDE ICONS ──
    // content-loader injects HTML after main.js already ran createIcons(),
    // so we need to call it again to render any new data-lucide elements.
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
})();
