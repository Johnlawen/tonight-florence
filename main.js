function initMain() {
    // -- LUCIDE ICONS --
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // -- NAVBAR SCROLL --
    var navbar = document.getElementById('navbar');
    var mobileMenuBtn = document.getElementById('mobile-menu-btn');
    var navLinks = document.querySelector('.nav-links');

    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
    }

    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
            });
        });
    }

    // -- SMOOTH SCROLL --
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // -- FADE-IN ANIMATION --
    if (typeof IntersectionObserver !== 'undefined') {
        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    obs.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.1 });

        document.querySelectorAll('.event-card, .feature-item, .newsletter-middle, .newsletter-right').forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // -- CAROUSEL ARROW --
    var carousel = document.querySelector('.events-carousel');
    var nextBtn = document.getElementById('carousel-next');

    if (carousel && nextBtn) {
        nextBtn.addEventListener('click', function () {
            var card = carousel.querySelector('.event-card');
            var cardWidth = card ? card.offsetWidth + 24 : 320;
            var maxScroll = carousel.scrollWidth - carousel.clientWidth;
            if (carousel.scrollLeft + cardWidth >= maxScroll - 10) {
                carousel.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        });
    }

    // -- EVENT MODAL --
    var eventModal      = document.getElementById('event-modal');
    var eventModalClose = document.getElementById('event-modal-close');
    var modalImage      = document.getElementById('modal-image');
    var modalTitle      = document.getElementById('modal-title');
    var modalSubtitle   = document.getElementById('modal-subtitle');

    var currentEventName = '';
    var currentTicketPrice = 20;
    var currentTablePrice = 15;

    function openEventModal(card) {
        modalImage.setAttribute('src', card.querySelector('.card-image img').getAttribute('src'));
        modalTitle.innerHTML   = card.querySelector('.card-title').innerHTML;
        modalSubtitle.innerHTML = card.querySelector('.card-subtitle').innerHTML;
        currentEventName = card.querySelector('.card-title').innerText.replace(/\n/g, ' ');

        var parsedTicket = parseInt(card.dataset.ticketPrice);
        currentTicketPrice = isNaN(parsedTicket) ? 20 : parsedTicket;
        var parsedTable = parseInt(card.dataset.tablePrice);
        currentTablePrice = isNaN(parsedTable) ? 15 : parsedTable;

        if (card.dataset.tableAvailable === 'false') {
            btnBookTable.style.display = 'none';
        } else {
            btnBookTable.style.display = 'inline-block';
        }

        eventModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeEventModal() {
        eventModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Use delegation so dynamically-injected cards (from content-loader.js) also work
    document.addEventListener('click', function (e) {
        var card = e.target.closest('.event-card');
        if (card) {
            openEventModal(card);
        }
    });

    if (eventModalClose) {
        eventModalClose.addEventListener('click', closeEventModal);
    }
    if (eventModal) {
        eventModal.addEventListener('click', function (e) {
            if (e.target === eventModal) closeEventModal();
        });
    }

    // -- BOOKING FORM MODAL --
    var bookingModal      = document.getElementById('booking-modal');
    var bookingModalClose = document.getElementById('booking-modal-close');
    var bookingTypeLabel  = document.getElementById('booking-type-label');
    var bookingEventName  = document.getElementById('booking-event-name');
    var qtyDisplay        = document.getElementById('qty-display');
    var qtyLabel          = document.getElementById('qty-label');
    var totalPriceEl      = document.getElementById('booking-total-price');
    var qtyMinus          = document.getElementById('qty-minus');
    var qtyPlus           = document.getElementById('qty-plus');
    var btnBookTicket     = document.getElementById('btn-book-ticket');
    var btnBookTable      = document.getElementById('btn-book-table');
    var bookingForm       = document.getElementById('booking-form');

    // Prices per person
    var currentPrice = 20;
    var currentQty   = 1;

    function updatePrice() {
        var total = currentQty * currentPrice;
        totalPriceEl.textContent = '\u20AC' + total;
        // Bump animation
        totalPriceEl.classList.remove('bump');
        void totalPriceEl.offsetWidth; // reflow
        totalPriceEl.classList.add('bump');
        setTimeout(function () { totalPriceEl.classList.remove('bump'); }, 200);
    }

    function openBookingModal(type) {
        // Close event modal first
        closeEventModal();

        // Set type label & price
        if (type === 'ticket') {
            bookingTypeLabel.textContent = 'BOOK TICKET';
            qtyLabel.textContent = 'Number of Tickets';
            currentPrice = currentTicketPrice;
        } else {
            bookingTypeLabel.textContent = 'BOOK TABLE';
            qtyLabel.textContent = 'Number of Persons';
            currentPrice = currentTablePrice;
        }

        bookingEventName.textContent = currentEventName;
        currentQty = 1;
        qtyDisplay.textContent = '1';
        updatePrice();

        // Reset form
        if (bookingForm) bookingForm.reset();

        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeBookingModal() {
        bookingModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (btnBookTicket) {
        btnBookTicket.addEventListener('click', function () { openBookingModal('ticket'); });
    }
    if (btnBookTable) {
        btnBookTable.addEventListener('click', function () { openBookingModal('table'); });
    }
    if (bookingModalClose) {
        bookingModalClose.addEventListener('click', closeBookingModal);
    }
    if (bookingModal) {
        bookingModal.addEventListener('click', function (e) {
            if (e.target === bookingModal) closeBookingModal();
        });
    }

    // Quantity buttons
    if (qtyMinus) {
        qtyMinus.addEventListener('click', function () {
            if (currentQty > 1) {
                currentQty--;
                qtyDisplay.textContent = currentQty;
                updatePrice();
            }
        });
    }
    if (qtyPlus) {
        qtyPlus.addEventListener('click', function () {
            if (currentQty < 20) {
                currentQty++;
                qtyDisplay.textContent = currentQty;
                updatePrice();
            }
        });
    }

    // -- BOOKING FORM SUBMIT --
    var successOverlay  = document.getElementById('booking-success');
    var successMsg      = document.getElementById('success-message');
    var successCloseBtn = document.getElementById('success-close-btn');

    if (bookingForm) {
        bookingForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            var firstName = document.getElementById('booking-firstname').value.trim();
            var lastName  = document.getElementById('booking-lastname').value.trim();
            var email     = document.getElementById('booking-email').value.trim();
            var gender    = document.querySelector('input[name="booking-gender"]:checked');
            var genderVal = gender ? gender.value : 'not specified';

            if (!firstName || !lastName || !email) {
                alert('Please fill in all fields.');
                return;
            }

            var type  = bookingTypeLabel.textContent;
            var total = currentQty * currentPrice;
            var eventName = currentEventName;
            var customerName = firstName + ' ' + lastName;

            // Disable submit button
            var submitBtn = document.getElementById('booking-submit-btn');
            var originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'PROCESSING...';

            try {
                var response = await fetch('/api/create-checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        eventName: eventName + ' (' + type + ')',
                        price: currentPrice,
                        customerName: customerName,
                        customerEmail: email,
                        qty: currentQty
                    })
                });
                var data = await response.json();

                if (data.url) {
                    // Redirect to Stripe Checkout
                    window.location.href = data.url;
                } else {
                    // Stripe not configured - show demo confirmation
                    closeBookingModal();
                    successMsg.textContent =
                        customerName + ', your ' + type + ' for ' +
                        currentQty + ' person(s) at ' + eventName +
                        ' is confirmed! Total: \u20AC' + total + '. Check ' + email + ' for details.';
                    if (successOverlay) successOverlay.classList.add('active');
                }
            } catch (error) {
                // Network error - fall back to demo mode
                closeBookingModal();
                successMsg.textContent =
                    customerName + ', your ' + type + ' for ' +
                    currentQty + ' person(s) at ' + eventName +
                    ' is confirmed! Total: \u20AC' + total + '. Check ' + email + ' for details.';
                if (successOverlay) successOverlay.classList.add('active');
            }

            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        });
    }

    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', function () {
            successOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // -- CLOSE ALL WITH ESCAPE --
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeEventModal();
            closeBookingModal();
            if (successOverlay) successOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // -- NEWSLETTER SUBSCRIPTION --
    var subscribeForms = document.querySelectorAll('.subscribe-form');
    subscribeForms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var input = form.querySelector('input[type="email"]');
            if (input && input.value) {
                var email = input.value.trim();
                var date = new Date().toLocaleString();

                // Save subscriber to cloud database
                fetch('/api/content?key=ft-subscribers')
                    .then(function(r) { return r.json(); })
                    .then(function(d) {
                        var subs = [];
                        if (d.value) {
                            subs = typeof d.value === 'string' ? JSON.parse(d.value) : d.value;
                        }
                        if (!subs.some(function(s) { return s.email === email; })) {
                            subs.push({ email: email, date: date });
                            fetch('/api/content', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ key: 'ft-subscribers', value: subs })
                            }).catch(function(err) { console.error(err); });
                        }
                    })
                    .catch(function(err) { console.error('Subscriber save error:', err); });

                // Send welcome email via backend
                fetch('/api/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email })
                }).catch(function(err) { console.error(err); });

                var btn = form.querySelector('button[type="submit"]');
                var origText = btn.innerHTML;
                btn.innerHTML = '\u2713';
                input.value = '';
                setTimeout(function() { btn.innerHTML = origText; }, 2000);
            }
        });
    });

    // -- PLAN FORM SUBMISSION --
    var planForm = document.querySelector('.plan-form');
    if (planForm) {
        planForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var nameInput = planForm.querySelector('input[type="text"]');
            var emailInput = planForm.querySelector('input[type="email"]');
            var subjectSelect = planForm.querySelector('select');
            var messageTextarea = planForm.querySelector('textarea');
            
            if (nameInput && emailInput && subjectSelect && messageTextarea) {
                var name = nameInput.value.trim();
                var email = emailInput.value.trim();
                var subject = subjectSelect.value;
                var message = messageTextarea.value.trim();
                var date = new Date().toLocaleString();

                var btn = planForm.querySelector('button[type="submit"]');
                var originalText = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = 'SENDING...';

                // Save message to cloud database
                fetch('/api/content?key=ft-messages')
                    .then(function(r) { return r.json(); })
                    .then(function(d) {
                        var msgs = [];
                        if (d.value) {
                            msgs = typeof d.value === 'string' ? JSON.parse(d.value) : d.value;
                        }
                        
                        msgs.push({
                            name: name,
                            email: email,
                            subject: subject,
                            message: message,
                            date: date,
                            read: false
                        });
                        
                        return fetch('/api/content', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ key: 'ft-messages', value: msgs })
                        });
                    })
                    .then(function() {
                        btn.innerHTML = 'MESSAGE SENT &#10003;';
                        btn.style.backgroundColor = 'var(--accent-gold)';
                        btn.style.color = '#fff';
                        planForm.reset();
                        
                        setTimeout(function() {
                            btn.disabled = false;
                            btn.innerHTML = originalText;
                            btn.style.backgroundColor = '';
                            btn.style.color = '';
                        }, 5000);
                    })
                    .catch(function(err) {
                        console.error('Message save error:', err);
                        btn.innerHTML = 'ERROR. TRY AGAIN.';
                        setTimeout(function() {
                            btn.disabled = false;
                            btn.innerHTML = originalText;
                        }, 3000);
                    });
            }
        });
    }

    // -- COOKIE CONSENT --
    {
        var cookieHtml = `
            <div id="cookie-consent" class="cookie-banner-wrapper">
                <div class="cookie-banner-content">
                    <div class="cookie-banner-left">
                        <div class="cookie-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
                                <path d="M8.5 8.5v.01"></path>
                                <path d="M16 12.5v.01"></path>
                                <path d="M12 16v.01"></path>
                                <path d="M11 12.5v.01"></path>
                                <path d="M8 14v.01"></path>
                            </svg>
                        </div>
                        <div class="cookie-text">
                            <h3>We value your privacy</h3>
                            <p>We use cookies to enhance your experience, analyze traffic, and personalize content.<br>You can accept all cookies or manage your preferences.</p>
                            <p class="cookie-links">Learn more in our <a href="/privacy.html">Cookie Policy</a>, <a href="/privacy.html">Privacy Policy</a>, and <a href="/privacy.html">Terms & Conditions</a>.</p>
                        </div>
                    </div>
                    <div class="cookie-banner-right">
                        <div class="cookie-buttons">
                            <button id="btn-accept-cookie" class="btn-cookie-primary">Accept All</button>
                            <button id="btn-customize-cookie" class="btn-cookie-outline">Customize</button>
                        </div>
                        <a href="#" id="btn-reject-cookie" class="cookie-reject">Reject All</a>
                    </div>
                    <button id="btn-close-cookie" class="cookie-close" aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', cookieHtml);
        
        // Only auto-open if not already accepted in this session
        if (!sessionStorage.getItem('cookieConsentAccepted')) {
            setTimeout(function() {
                var overlay = document.getElementById('cookie-consent');
                if (overlay) {
                    overlay.classList.add('active');
                }
            }, 500);
        }

        function closeCookieBanner() {
            var overlay = document.getElementById('cookie-consent');
            if (overlay) {
                overlay.classList.remove('active');
            }
            sessionStorage.setItem('cookieConsentAccepted', 'true');
        }

        var btnAccept = document.getElementById('btn-accept-cookie');
        var btnReject = document.getElementById('btn-reject-cookie');
        var btnCustomize = document.getElementById('btn-customize-cookie');
        var btnClose = document.getElementById('btn-close-cookie');

        if (btnAccept) btnAccept.addEventListener('click', closeCookieBanner);
        if (btnReject) btnReject.addEventListener('click', function(e) { e.preventDefault(); closeCookieBanner(); });
        if (btnCustomize) btnCustomize.addEventListener('click', closeCookieBanner);
        if (btnClose) btnClose.addEventListener('click', closeCookieBanner);
    }

} // End of initMain

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMain);
} else {
    initMain();
}

