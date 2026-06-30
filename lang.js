/**
 * Florence Tonight — Language Switcher
 * Supports: English (en) | Italian (it)
 */

const TRANSLATIONS = {
    en: {
        // NAV
        'nav.home': 'HOME',
        'nav.guides': 'GUIDES',
        'nav.hidden': 'HIDDEN',
        'nav.aperitivo': 'APERITIVO',
        'nav.events': 'EVENTS',
        'nav.afterdark': 'AFTER DARK',
        'nav.about': 'ABOUT',
        'nav.plan': 'PLAN YOUR NIGHT',
        'nav.thisweek': 'THIS WEEK',

        // INDEX — Hero
        'hero.line1': 'YOUR GUIDE TO',
        'hero.line2': "FLORENCE'S",
        'hero.line3': 'BEST NIGHTS.',
        'hero.subtitle': 'Real people. Real nights.<br>The only guide you need.',
        'hero.cta': 'EXPLORE THIS WEEK',

        // INDEX — Features Strip
        'feat.thisweek': 'THIS WEEK',
        'feat.thisweek.sub': "What's on",
        'feat.aperitivo': 'APERITIVO',
        'feat.aperitivo.sub': 'Eat. Drink. Connect.',
        'feat.hidden': 'HIDDEN GEMS',
        'feat.hidden.sub': 'The spots locals love',
        'feat.crowd': 'CROWD',
        'feat.crowd.sub': "See who's out",
        'feat.events': 'EVENTS',
        'feat.events.sub': 'Clubs, parties & more',
        'feat.featured': 'FEATURED',
        'feat.featured.sub': 'The highlights',
        'feat.partners': 'PARTNERS',
        'feat.partners.sub': 'Work with us',

        // INDEX — Events Section
        'events.kicker': 'THIS WEEK IN FLORENCE',
        'events.title': 'HANDPICKED<br>EVENTS &<br>EXPERIENCES.',
        'events.desc': 'From rooftop cocktails to secret parties,<br>we find the nights worth remembering.',
        'events.btn': 'VIEW FULL GUIDE',

        // INDEX — Newsletter
        'news.kicker': 'FLORENCE AFTER DARK',
        'news.title': 'REAL PEOPLE.<br>REAL STYLE.<br>REAL FLORENCE.',
        'news.desc': "We don't just list places.<br>We live them. Every night.",
        'news.join': 'JOIN THE NIGHT',
        'news.right.kicker': "DON'T MISS A NIGHT",
        'news.right.title': 'GET THE INSIDE<br>GUIDE.',
        'news.right.desc': 'New events. Hidden gems.<br>Exclusive invites. Every week.',

        // FOOTER
        'footer.about': 'ABOUT',
        'footer.contact': 'CONTACT',
        'footer.instagram': 'INSTAGRAM',
        'footer.partnerships': 'PARTNERSHIPS',
        'footer.privacy': 'PRIVACY',
        'footer.submit': 'SUBMIT A VENUE',
        'footer.copy': '© 2026 Florence Tonight<br>All rights reserved.',

        // EXPLORE PAGE
        'explore.kicker': 'EXPLORE TONIGHT',
        'explore.title': 'Tonight<br>in Florence.',
        'explore.subtitle': 'Curated events happening around the city<br>tonight. Choose your vibe.',
        'explore.all': 'All Events',
        'explore.sortby': 'Sort by:',
        'explore.time': 'Time',
        'explore.viewcal': 'VIEW FULL CALENDAR',
        'explore.staykicker': 'STAY IN THE KNOW',
        'explore.staytitle': 'Never miss a night<br>worth remembering.',
        'explore.staydesc': 'Weekly picks, hidden gems, and<br>exclusive invitations—straight to your inbox.',

        // PLAN PAGE
        'plan.kicker': 'PLAN YOUR NIGHT',
        'plan.title': "We're here to<br>help you make it<br>unforgettable",
        'plan.subtitle': 'Have a question, looking for a recommendation,<br>or planning something special? Send us a<br>message and we\'ll get back to you soon.',
        'plan.form.kicker': 'SEND US A MESSAGE',
        'plan.form.desc': "Fill out the form below and we'll get back to you as soon as possible.",
        'plan.label.name': 'YOUR NAME',
        'plan.ph.name': 'Enter your name',
        'plan.label.email': 'EMAIL ADDRESS',
        'plan.ph.email': 'Enter your email',
        'plan.label.subject': 'SUBJECT',
        'plan.ph.subject': 'Choose a subject',
        'plan.opt.reservation': 'Restaurant/Rooftop Reservation',
        'plan.opt.events': 'Event Recommendations',
        'plan.opt.private': 'Private Parties',
        'plan.opt.collab': 'Collaborations',
        'plan.opt.other': 'Other',
        'plan.label.message': 'YOUR MESSAGE',
        'plan.ph.message': 'Tell us how we can help...',
        'plan.send': 'SEND MESSAGE',
        'plan.respond': 'We typically respond within 24 hours.',
        'plan.touch.kicker': 'GET IN TOUCH',
        'plan.email.title': 'Email Us',
        'plan.email.sub': "We're here to help.",
        'plan.whatsapp.title': 'WhatsApp',
        'plan.whatsapp.sub': 'Quick questions? Text us.',
        'plan.based.title': 'Based in Florence',
        'plan.based.sub': 'Local tips. Real connections.<br>Always curated with care.',
        'plan.help.kicker': 'WE CAN HELP WITH',
        'plan.help.1': 'Restaurant & rooftop reservations',
        'plan.help.2': 'Event recommendations',
        'plan.help.3': 'Private parties & special occasions',
        'plan.help.4': 'Venue bookings & collaborations',
        'plan.help.5': 'General questions about Florence',
        'plan.faq.kicker': 'FREQUENTLY ASKED QUESTIONS',
        'plan.faq.1': 'How do you choose the events you feature?',
        'plan.faq.2': 'Can you help me book a table or a venue?',
        'plan.faq.3': 'Do you promote private events or venues?',
        'plan.faq.all': 'VIEW ALL FAQS',

        // EVENTS PAGE
        'evpage.kicker': "WHAT'S ON IN FLORENCE.",
        'evpage.title': 'Your calendar<br>for unforgettable<br>nights.',
        'evpage.subtitle': 'The best events, parties, live music, exhibitions, and experiences happening in Florence, all in one place.',
        'evpage.browse': "BROWSE THIS WEEK'S EVENTS",
        'evpage.featured.kicker': 'FEATURED EVENTS',
        'evpage.viewall': 'VIEW ALL EVENTS',

        // APERITIVO PAGE
        'ap.kicker': 'DRINK. EAT. CONNECT.',
        'ap.title': 'The ultimate<br>Aperitivo guide<br>to Florence.',
        'ap.subtitle': 'From timeless classics to new favorites, discover the best places for drinks, bites, and beautiful moments.',
        'ap.highlight.kicker': 'APERITIVO HIGHLIGHTS',
        'ap.viewall': 'VIEW ALL PLACES',

        // GUIDES PAGE
        'guides.kicker': 'FLORENCE, CURATED.',
        'guides.title': 'Guides to<br>experience Florence.',
        'guides.subtitle': 'Local secrets, expert recommendations, and curated itineraries to help you experience the city like a local.',
        'guides.featured.kicker': 'FEATURED GUIDES',
        'guides.viewall': 'VIEW ALL GUIDES',

        // HIDDEN GEMS PAGE
        'hg.kicker': 'THE CITY BENEATH THE SURFACE',
        'hg.browse.kicker': 'BROWSE BY OCCASION',

        // AFTER DARK PAGE
        'ad.kicker': 'THE NIGHT IS YOUNG.',

        // COMMON
        'common.email.placeholder': 'Your email',
        'common.plan': 'PLAN YOUR NIGHT',
    },

    it: {
        // NAV
        'nav.home': 'HOME',
        'nav.guides': 'GUIDE',
        'nav.hidden': 'NASCOSTO',
        'nav.aperitivo': 'APERITIVO',
        'nav.events': 'EVENTI',
        'nav.afterdark': 'DOPO MEZZANOTTE',
        'nav.about': 'CHI SIAMO',
        'nav.plan': 'PIANIFICA LA SERATA',
        'nav.thisweek': 'QUESTA SETTIMANA',

        // INDEX — Hero
        'hero.line1': 'LA TUA GUIDA A',
        'hero.line2': 'LE MIGLIORI NOTTI',
        'hero.line3': 'DI FIRENZE.',
        'hero.subtitle': 'Persone reali. Notti reali.<br>L\'unica guida di cui hai bisogno.',
        'hero.cta': 'ESPLORA QUESTA SETTIMANA',

        // INDEX — Features Strip
        'feat.thisweek': 'QUESTA SETTIMANA',
        'feat.thisweek.sub': 'Cosa c\'è in programma',
        'feat.aperitivo': 'APERITIVO',
        'feat.aperitivo.sub': 'Mangia. Bevi. Connetti.',
        'feat.hidden': 'LUOGHI NASCOSTI',
        'feat.hidden.sub': 'I posti che i locali amano',
        'feat.crowd': 'FOLLA',
        'feat.crowd.sub': 'Guarda chi è fuori',
        'feat.events': 'EVENTI',
        'feat.events.sub': 'Club, feste e altro',
        'feat.featured': 'IN EVIDENZA',
        'feat.featured.sub': 'I momenti salienti',
        'feat.partners': 'PARTNER',
        'feat.partners.sub': 'Lavora con noi',

        // INDEX — Events Section
        'events.kicker': 'QUESTA SETTIMANA A FIRENZE',
        'events.title': 'EVENTI &<br>ESPERIENZE<br>SELEZIONATI.',
        'events.desc': 'Dai cocktail sui tetti alle feste segrete,<br>troviamo le notti che vale la pena ricordare.',
        'events.btn': 'VISUALIZZA GUIDA COMPLETA',

        // INDEX — Newsletter
        'news.kicker': 'FIRENZE DOPO MEZZANOTTE',
        'news.title': 'PERSONE REALI.<br>STILE REALE.<br>FIRENZE VERA.',
        'news.desc': 'Non ci limitiamo a elencare i posti.<br>Li viviamo. Ogni notte.',
        'news.join': 'UNISCITI ALLA NOTTE',
        'news.right.kicker': 'NON PERDERTI UNA NOTTE',
        'news.right.title': 'RICEVI LA GUIDA<br>INSIDER.',
        'news.right.desc': 'Nuovi eventi. Gemme nascoste.<br>Inviti esclusivi. Ogni settimana.',

        // FOOTER
        'footer.about': 'CHI SIAMO',
        'footer.contact': 'CONTATTI',
        'footer.instagram': 'INSTAGRAM',
        'footer.partnerships': 'PARTNERSHIP',
        'footer.privacy': 'PRIVACY',
        'footer.submit': 'PROPONI UN LOCALE',
        'footer.copy': '© 2026 Florence Tonight<br>Tutti i diritti riservati.',

        // EXPLORE PAGE
        'explore.kicker': 'ESPLORA STANOTTE',
        'explore.title': 'Stanotte<br>a Firenze.',
        'explore.subtitle': 'Eventi selezionati che si svolgono in città<br>stanotte. Scegli il tuo stile.',
        'explore.all': 'Tutti gli eventi',
        'explore.sortby': 'Ordina per:',
        'explore.time': 'Orario',
        'explore.viewcal': 'VISUALIZZA CALENDARIO COMPLETO',
        'explore.staykicker': 'RESTA AGGIORNATO',
        'explore.staytitle': 'Non perdere una notte<br>che vale la pena ricordare.',
        'explore.staydesc': 'Selezioni settimanali, gemme nascoste e<br>inviti esclusivi—direttamente nella tua casella.',

        // PLAN PAGE
        'plan.kicker': 'PIANIFICA LA SERATA',
        'plan.title': "Siamo qui per<br>aiutarti a renderla<br>indimenticabile",
        'plan.subtitle': 'Hai una domanda, cerchi un consiglio,<br>o stai pianificando qualcosa di speciale? Scrivici<br>e ti risponderemo al più presto.',
        'plan.form.kicker': 'INVIACI UN MESSAGGIO',
        'plan.form.desc': 'Compila il modulo e ti risponderemo il prima possibile.',
        'plan.label.name': 'IL TUO NOME',
        'plan.ph.name': 'Inserisci il tuo nome',
        'plan.label.email': 'INDIRIZZO EMAIL',
        'plan.ph.email': 'Inserisci la tua email',
        'plan.label.subject': 'OGGETTO',
        'plan.ph.subject': 'Scegli un oggetto',
        'plan.opt.reservation': 'Prenotazione ristorante/terrazza',
        'plan.opt.events': 'Consigli per eventi',
        'plan.opt.private': 'Feste private',
        'plan.opt.collab': 'Collaborazioni',
        'plan.opt.other': 'Altro',
        'plan.label.message': 'IL TUO MESSAGGIO',
        'plan.ph.message': 'Dicci come possiamo aiutarti...',
        'plan.send': 'INVIA MESSAGGIO',
        'plan.respond': 'Di solito rispondiamo entro 24 ore.',
        'plan.touch.kicker': 'CONTATTACI',
        'plan.email.title': 'Scrivici via Email',
        'plan.email.sub': 'Siamo qui per aiutarti.',
        'plan.whatsapp.title': 'WhatsApp',
        'plan.whatsapp.sub': 'Domande veloci? Scrivici.',
        'plan.based.title': 'Con base a Firenze',
        'plan.based.sub': 'Consigli locali. Connessioni reali.<br>Sempre curati con passione.',
        'plan.help.kicker': 'POSSIAMO AIUTARTI CON',
        'plan.help.1': 'Prenotazioni ristoranti e terrazze',
        'plan.help.2': 'Consigli per eventi',
        'plan.help.3': 'Feste private e occasioni speciali',
        'plan.help.4': 'Prenotazioni locali e collaborazioni',
        'plan.help.5': 'Domande generali su Firenze',
        'plan.faq.kicker': 'DOMANDE FREQUENTI',
        'plan.faq.1': 'Come scegliete gli eventi da presentare?',
        'plan.faq.2': 'Potete aiutarmi a prenotare un tavolo o un locale?',
        'plan.faq.3': 'Promuovete eventi o locali privati?',
        'plan.faq.all': 'VEDI TUTTE LE FAQ',

        // EVENTS PAGE
        'evpage.kicker': "COSA C'È A FIRENZE.",
        'evpage.title': 'Il tuo calendario<br>di notti<br>indimenticabili.',
        'evpage.subtitle': 'I migliori eventi, feste, musica dal vivo, mostre ed esperienze a Firenze, tutto in un unico posto.',
        'evpage.browse': 'SFOGLIA GLI EVENTI DI QUESTA SETTIMANA',
        'evpage.featured.kicker': 'EVENTI IN EVIDENZA',
        'evpage.viewall': 'VEDI TUTTI GLI EVENTI',

        // APERITIVO PAGE
        'ap.kicker': 'BEVI. MANGIA. CONNETTI.',
        'ap.title': 'La guida definitiva<br>all\'Aperitivo<br>a Firenze.',
        'ap.subtitle': 'Dai classici intramontabili alle nuove tendenze, scopri i migliori posti per drink, stuzzichini e momenti speciali.',
        'ap.highlight.kicker': 'I MIGLIORI APERITIVI',
        'ap.viewall': 'VEDI TUTTI I POSTI',

        // GUIDES PAGE
        'guides.kicker': 'FIRENZE, CURATA.',
        'guides.title': 'Guide per<br>vivere Firenze.',
        'guides.subtitle': 'Segreti locali, raccomandazioni di esperti e itinerari curati per vivere la città come un locale.',
        'guides.featured.kicker': 'GUIDE IN EVIDENZA',
        'guides.viewall': 'VEDI TUTTE LE GUIDE',

        // HIDDEN GEMS PAGE
        'hg.kicker': 'LA CITTÀ SOTTO LA SUPERFICIE',
        'hg.browse.kicker': 'SFOGLIA PER OCCASIONE',

        // AFTER DARK PAGE
        'ad.kicker': 'LA NOTTE È GIOVANE.',

        // COMMON
        'common.email.placeholder': 'La tua email',
        'common.plan': 'PIANIFICA LA SERATA',
    }
};

// ── Apply translations to the current page ──
function applyLanguage(lang) {
    const t = TRANSLATIONS[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) {
            // Use innerHTML to support <br> tags
            el.innerHTML = t[key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key] !== undefined) {
            el.setAttribute('placeholder', t[key]);
        }
    });

    // Update html lang attribute
    document.documentElement.setAttribute('lang', lang);

    const btn = document.getElementById('lang-toggle-btn');
    if (btn) {
        btn.innerHTML = lang === 'en'
            ? '<span class="lang-flag">\uD83C\uDDEE\uD83C\uDDF9</span><span class="lang-label">IT</span>'
            : '<span class="lang-flag">\uD83C\uDDEC\uD83C\uDDE7</span><span class="lang-label">EN</span>';
        btn.setAttribute('title', lang === 'en' ? 'Switch to Italian' : 'Switch to English');
    }
}

// ── Initialize ──
function initLang() {
    const savedLang = localStorage.getItem('ft-lang') || 'en';
    applyLanguage(savedLang);

    const btn = document.getElementById('lang-toggle-btn');
    if (btn) {
        // Prevent duplicate listeners if initLang is called twice
        btn.removeEventListener('click', toggleLang);
        btn.addEventListener('click', toggleLang);
    }
}

function toggleLang(e) {
    if (e) e.preventDefault();
    const current = localStorage.getItem('ft-lang') || 'en';
    const next = current === 'en' ? 'it' : 'en';
    localStorage.setItem('ft-lang', next);
    applyLanguage(next);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLang);
} else {
    initLang();
}
