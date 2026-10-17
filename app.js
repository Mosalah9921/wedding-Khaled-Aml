/* ==========================================================================
   Khaled & Aml — Wedding Invitation · app.js
   - Envelope opening sequence
   - AR / EN (remembered, ?lang=en supported)
   - Personal guest name: add ?to=Ahmed  →  "To: Ahmed" on the envelope
   - Countdown in Cairo time (correct for guests in any timezone)
   - Invitation card drawn from the data (AR + EN) → view / download / share
   - Music with fade-in, pauses when the tab is hidden
   - Google Calendar + .ics (iPhone / Outlook), lazy map, scroll reveal
   ========================================================================== */

(() => {
    'use strict';

    /* ---------- CONFIG: edit here ---------- */
    const CONFIG = {
        // Friday 23 Oct 2026, 3:00 PM → 6:00 PM, Cairo (UTC+3 until 30 Oct 2026)
        startISO: '2026-10-23T15:00:00+03:00',
        endISO:   '2026-10-23T18:00:00+03:00',
        venue: 'Moments Villa',
        mapsLink: 'https://maps.app.goo.gl/WAqdkoQt69wRqXpi8',
        // Hall pin (Google plus code HG94+FF7, Zagazig)
        lat: 30.56866, lng: 31.50617,
        mapQuery: 'Moments Villa Zag, طريق الاحرار، الزقازيق، الشرقية',
        calLocation: 'Moments Villa, Al-Ahrar Road, Zagazig, Sharqia, Egypt',
        // RSVP: put the couple's WhatsApp number in international format (e.g. '201001234567').
        // Leave empty '' to hide the RSVP section.
        rsvpWhatsApp: '',
        musicVolume: 0.7
    };

    const T = {
        ar: {
            lang_toggle: 'English',
            lang_toggle_aria: 'Switch to English',
            cover_eyebrow: 'دعوة خاصة',
            to_label: 'إلى',
            save_the_date: 'احفظوا التاريخ',
            groom: 'خالد',
            bride: 'أمل',
            monogram: 'خ&thinsp;&amp;&thinsp;أ',
            click_seal: 'اضغط على الختم لفتح الدعوة',
            greeting: 'أهلاً <strong>{name}</strong>، يشرّفنا حضورك',
            verse_ref: 'سورة الروم · 21',
            you_are_invited: 'بكل الحب والسرور',
            celebrate_wedding: 'نتشرف بدعوتكم لحضور حفل زفاف',
            day_label: 'اليوم',
            day_name: 'الجمعة',
            month: 'أكتوبر',
            time_label: 'الموعد',
            time_short: '3 – 6 م',
            daytime: 'حفل نهاري',
            hero_closing: 'بحضوركم تكتمل فرحتنا',
            listen_song: 'شغّل الموسيقى',
            pause_song: 'إيقاف الموسيقى',
            countdown_eyebrow: 'العد التنازلي',
            special_day_coming: 'يوم العمر يقترب',
            today_is_special: 'اليوم يوم الفرح!',
            today_msg: 'الحفل قائم الآن في Moments Villa حتى 6 مساءً — ننتظركم ❤️',
            rsvp_eyebrow: 'نسعد بردّكم',
            rsvp_title: 'تأكيد الحضور',
            rsvp_text: 'يسعدنا تأكيد حضوركم لنستعد لاستقبالكم بأفضل شكل.',
            rsvp_name: 'الاسم',
            rsvp_name_ph: 'اكتب اسمك',
            rsvp_count: 'عدد الحضور',
            rsvp_yes: 'سأحضر بإذن الله',
            rsvp_no: 'أعتذر عن الحضور',
            rsvp_need_name: 'من فضلك اكتب اسمك أولاً',
            rsvp_msg_yes: 'السلام عليكم 🌸\nأؤكد حضوري حفل زفاف خالد وأمل يوم الجمعة 23 أكتوبر.\nالاسم: {name}\nعدد الحضور: {count}',
            rsvp_msg_no: 'السلام عليكم 🌸\nأعتذر عن حضور حفل زفاف خالد وأمل، وأتمنى لكما حياة سعيدة ❤️\nالاسم: {name}',
            wedding_happened: 'تم الزفاف بحمد الله 💍',
            wedding_memory: 'شكراً لكل من شاركنا هذا اليوم الجميل ❤️',
            details_eyebrow: 'موعدنا',
            details_title: 'تفاصيل الحفل',
            date_label: 'التاريخ',
            date_val: 'الجمعة 23 أكتوبر',
            date_sub: '2026',
            time_val: '3:00 – 6:00',
            time_sub: 'من 3 عصرًا حتى 6 مساءً',
            where: 'المكان',
            where_val: 'طريق الأحرار · الزقازيق · الشرقية',
            view_location: 'اعرض الموقع',
            aria_venue: 'افتح موقع القاعة على الخريطة',
            directions: 'الاتجاهات',
            add_to_calendar: 'أضف للتقويم',
            cal_google: 'تقويم Google',
            cal_apple: 'آيفون / Outlook',
            map_loading: 'جارٍ تحميل الخريطة…',
            card_eyebrow: 'احتفظوا بها',
            wedding_invitation: 'كارت الدعوة',
            tap_zoom: 'اضغط للتكبير',
            card_text: 'احفظوا كارت الدعوة على موبايلكم، أو شاركوه مع العائلة والأصدقاء.',
            download_card: 'تحميل الكارت',
            share_on_whatsapp: 'مشاركة عبر واتساب',
            cant_wait: 'ننتظركم لتكتمل فرحتنا',
            designed_by: 'تصميم محمود صلاح',
            audio_tooltip: 'شغّل الموسيقى لتجربة أجمل 🎵',
            play_audio_error: 'اضغط على زر الموسيقى لتشغيل الأغنية 🎵',
            aria_music: 'تشغيل / إيقاف الموسيقى',
            aria_share: 'شارك الدعوة على واتساب',
            aria_open: 'افتح الدعوة',
            aria_zoom: 'تكبير كارت الدعوة',
            img_alt: 'كارت دعوة زفاف خالد وأمل — الجمعة 23 أكتوبر 2026 من 3 حتى 6 مساءً، Moments Villa الزقازيق',
            whatsapp_share: 'يسعدنا دعوتكم لحضور حفل زفاف خالد وأمل 💍\nالجمعة 23 أكتوبر 2026 · من 3 عصرًا حتى 6 مساءً\nMoments Villa – طريق الأحرار، الزقازيق\n\nتفاصيل الدعوة:\n{url}',
            cal_title: 'حفل زفاف خالد وأمل',
            cal_details: 'يسعدنا حضوركم حفل زفافنا.\nMoments Villa – طريق الأحرار، الزقازيق\nاللوكيشن: ' + 'https://maps.app.goo.gl/WAqdkoQt69wRqXpi8',
            // Card text
            file: 'Khaled_Aml_Invitation_Arabic.jpg'
        },
        en: {
            lang_toggle: 'عربي',
            lang_toggle_aria: 'التبديل إلى العربية',
            cover_eyebrow: 'You are invited',
            to_label: 'To',
            save_the_date: 'Save the Date',
            groom: 'Khaled',
            bride: 'Aml',
            monogram: 'K&thinsp;&amp;&thinsp;A',
            click_seal: 'Tap the seal to open your invitation',
            greeting: 'Dear <strong>{name}</strong>, we would be honoured by your presence',
            verse_ref: 'Surah Ar-Rum · 30:21',
            you_are_invited: 'The Wedding of',
            celebrate_wedding: 'Together with our families, we joyfully invite you to celebrate our wedding day',
            day_label: 'Day',
            day_name: 'Friday',
            month: 'October',
            time_label: 'Time',
            time_short: '3 – 6 PM',
            daytime: 'An afternoon celebration',
            hero_closing: 'Your presence would make our day complete',
            listen_song: 'Play music',
            pause_song: 'Pause music',
            countdown_eyebrow: 'Counting down',
            special_day_coming: 'Our day is almost here',
            today_is_special: 'Today is the day!',
            today_msg: 'The celebration is happening now at Moments Villa until 6 PM ❤️',
            rsvp_eyebrow: 'Kindly reply',
            rsvp_title: 'RSVP',
            rsvp_text: 'Please let us know if you can join us, so we can prepare to welcome you.',
            rsvp_name: 'Name',
            rsvp_name_ph: 'Your name',
            rsvp_count: 'Guests',
            rsvp_yes: 'Joyfully accepts',
            rsvp_no: 'Regretfully declines',
            rsvp_need_name: 'Please enter your name first',
            rsvp_msg_yes: 'Hello 🌸\nI’m happy to confirm my attendance at the wedding of Khaled & Aml on Friday, 23 October.\nName: {name}\nGuests: {count}',
            rsvp_msg_no: 'Hello 🌸\nI’m sorry I won’t be able to attend the wedding of Khaled & Aml. Wishing you a lifetime of happiness ❤️\nName: {name}',
            wedding_happened: 'We got married! 💍',
            wedding_memory: 'Thank you for celebrating this beautiful day with us ❤️',
            details_eyebrow: 'When & where',
            details_title: 'The Celebration',
            date_label: 'Date',
            date_val: 'Friday, 23 October',
            date_sub: '2026',
            time_val: '3:00 – 6:00 PM',
            time_sub: 'An afternoon celebration',
            where: 'Venue',
            where_val: 'Al-Ahrar Road · Zagazig · Sharqia',
            view_location: 'View location',
            aria_venue: 'Open the venue location on the map',
            directions: 'Directions',
            add_to_calendar: 'Add to calendar',
            cal_google: 'Google Calendar',
            cal_apple: 'iPhone / Outlook',
            map_loading: 'Loading map…',
            card_eyebrow: 'Keep it with you',
            wedding_invitation: 'Invitation Card',
            tap_zoom: 'Tap to enlarge',
            card_text: 'Save the invitation card to your phone, or share it with family and friends.',
            download_card: 'Download card',
            share_on_whatsapp: 'Share on WhatsApp',
            cant_wait: 'We can’t wait to celebrate with you',
            designed_by: 'Designed by Mahmoud Salah',
            audio_tooltip: 'Turn on the music for the full experience 🎵',
            play_audio_error: 'Tap the music button to play the song 🎵',
            aria_music: 'Play / pause music',
            aria_share: 'Share the invitation on WhatsApp',
            aria_open: 'Open the invitation',
            aria_zoom: 'Enlarge the invitation card',
            img_alt: 'Wedding invitation card of Khaled and Aml — Friday 23 October 2026, 3 to 6 PM, Moments Villa, Zagazig',
            whatsapp_share: 'The Wedding of Khaled & Aml 💍\nYou are warmly invited to celebrate with us.\n\nFriday, 23 October 2026 · 3:00 – 6:00 PM\nMoments Villa – Al-Ahrar Road, Zagazig\n\nView the invitation:\n{url}',
            cal_title: 'The Wedding of Khaled & Aml',
            cal_details: 'We would be honoured by your presence.\nMoments Villa – Al-Ahrar Road, Zagazig\nLocation: ' + 'https://maps.app.goo.gl/WAqdkoQt69wRqXpi8',
            file: 'Khaled_Aml_Invitation_English.jpg'
        }
    };

    /* Arabic counting nouns: 1 يوم · 2 يومان · 3-10 أيام · 11+ يومًا */
    const AR_UNITS = {
        days:  ['يوم', 'يومان', 'أيام', 'يومًا'],
        hours: ['ساعة', 'ساعتان', 'ساعات', 'ساعة'],
        mins:  ['دقيقة', 'دقيقتان', 'دقائق', 'دقيقة'],
        secs:  ['ثانية', 'ثانيتان', 'ثوانٍ', 'ثانية']
    };
    const EN_UNITS = { days: 'Days', hours: 'Hours', mins: 'Minutes', secs: 'Seconds' };
    const arUnit = (key, n) => {
        const f = AR_UNITS[key];
        if (n <= 1) return f[0];
        if (n === 2) return f[1];
        if (n <= 10) return f[2];
        return f[3];
    };

    /* ---------- Helpers ---------- */
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const params = new URLSearchParams(location.search);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const START = Date.parse(CONFIG.startISO);
    const END = Date.parse(CONFIG.endISO);

    /* ---------- Elements ---------- */
    const html = document.documentElement;
    const body = document.body;
    const cover = $('#envelope-overlay');
    const envelope = $('#envelope');
    const sealBtn = $('#open-envelope-btn');
    const page = $('#main-content');
    const dock = $('#dock');
    const petalsMain = $('#main-particles');
    const music = $('#bg-music');
    const audioBtn = $('#audio-toggle-btn');
    const cardMusicText = $('#card-music-btn-text');
    const tip = $('#audio-tooltip');
    const langBtn = $('#lang-toggle');

    let isPlaying = false;

    /* ---------- Language ---------- */
    // English opens first by default. Arabic when the link says ?lang=ar (or the guest taps the switch).
    let lang = (params.get('lang') || 'en').toLowerCase();
    if (!T[lang]) lang = 'en';
    const guestName = (params.get('to') || '').trim().slice(0, 60);

    function applyLanguage(next) {
        lang = next;
        const d = T[lang];
        html.lang = lang;
        html.dir = lang === 'ar' ? 'rtl' : 'ltr';

        $$('[data-i18n]').forEach(el => {
            const v = d[el.dataset.i18n];
            if (v !== undefined) el.innerHTML = v;
        });
        $$('[data-i18n-aria]').forEach(el => {
            const v = d[el.dataset.i18nAria];
            if (v !== undefined) el.setAttribute('aria-label', v);
        });

        $('#lang-toggle-text').textContent = d.lang_toggle;
        langBtn.setAttribute('aria-label', d.lang_toggle_aria);
        cardMusicText.textContent = isPlaying ? d.pause_song : d.listen_song;
        tip.textContent = d.audio_tooltip;
        $$('[data-i18n-ph]').forEach(el => { const v = d[el.dataset.i18nPh]; if (v) el.placeholder = v; });

        if (guestName) {
            $('#guest-name').textContent = guestName;
            $('#cover-to').hidden = false;
            const g = $('#hero-greeting');
            g.innerHTML = d.greeting.replace('{name}', '');
            g.querySelector('strong').textContent = guestName; // text only (safe)
            g.hidden = false;
        }

        document.title = lang === 'ar'
            ? 'دعوة زفاف خالد وأمل · Khaled & Aml'
            : 'The Wedding of Khaled & Aml';

        setupCalendar();
        renderCountdown();
        renderCard();
        if (typeof updateMapLang === 'function' && map) updateMapLang();
    }
    langBtn.addEventListener('click', () => applyLanguage(lang === 'ar' ? 'en' : 'ar'));

    /* ---------- Petals ---------- */
    function makePetals(container, count) {
        if (!container || reduceMotion) return;
        const frag = document.createDocumentFragment();
        for (let i = 0; i < count; i++) {
            const p = document.createElement('span');
            p.className = 'petal' + (Math.random() < 0.4 ? ' petal--light' : '');
            const s = 8 + Math.random() * 10;
            p.style.cssText =
                `--x:${Math.random() * 100}%;--s:${s}px;--d:${12 + Math.random() * 10}s;` +
                `--delay:${-Math.random() * 20}s;--drift:${(Math.random() * 120 - 60).toFixed(0)}px;` +
                `--rot:${(Math.random() * 540 - 270).toFixed(0)}deg`;
            frag.appendChild(p);
        }
        container.appendChild(frag);
    }
    makePetals($('#cover-petals'), isMobile ? 12 : 22);

    /* ---------- Envelope ---------- */
    let opened = false;
    function openInvitation() {
        if (opened) return;
        opened = true;
        envelope.classList.add('is-open');
        playAudio(); // user gesture → allowed by browsers

        setTimeout(() => {
            cover.classList.add('is-gone');
            body.classList.remove('is-locked');
            page.classList.add('is-in');
            page.setAttribute('aria-hidden', 'false');
            dock.classList.add('is-on');
            dock.setAttribute('aria-hidden', 'false');
            makePetals(petalsMain, isMobile ? 8 : 14);
            petalsMain.classList.add('is-on');
            window.scrollTo(0, 0);
            startReveal();
            if (!isPlaying) showTip(T[lang].audio_tooltip, 6000);
            setTimeout(() => { cover.hidden = true; }, 1000);
        }, reduceMotion ? 300 : 2300);
    }
    sealBtn.addEventListener('click', (e) => { e.stopPropagation(); openInvitation(); });
    envelope.addEventListener('click', openInvitation);

    /* ---------- Scroll reveal ---------- */
    function startReveal() {
        const items = $$('.reveal');
        if (!('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('is-in')); return; }
        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        items.forEach(el => io.observe(el));
    }

    /* ---------- Music ---------- */
    let fadeTimer = null;
    let resumeOnVisible = false;
    function fadeTo(target, ms = 1800) {
        clearInterval(fadeTimer);
        const start = music.volume, t0 = performance.now();
        fadeTimer = setInterval(() => {
            const k = Math.min(1, (performance.now() - t0) / ms);
            music.volume = start + (target - start) * k;
            if (k >= 1) clearInterval(fadeTimer);
        }, 50);
    }
    function playAudio() {
        music.volume = 0;
        const p = music.play();
        if (p && p.then) {
            p.then(() => { isPlaying = true; updateAudioUI(); fadeTo(CONFIG.musicVolume); })
             .catch(() => { isPlaying = false; updateAudioUI(); showTip(T[lang].play_audio_error, 6000); });
        }
    }
    function pauseAudio() { music.pause(); isPlaying = false; updateAudioUI(); }
    const toggleAudio = () => (isPlaying ? pauseAudio() : playAudio());
    function updateAudioUI() {
        audioBtn.classList.toggle('is-playing', isPlaying);
        audioBtn.setAttribute('aria-pressed', String(isPlaying));
        cardMusicText.textContent = isPlaying ? T[lang].pause_song : T[lang].listen_song;
        $$('.play-icon').forEach(i => i.classList.toggle('hidden', isPlaying));
        $$('.pause-icon').forEach(i => i.classList.toggle('hidden', !isPlaying));
        if (isPlaying) hideTip();
    }
    audioBtn.addEventListener('click', toggleAudio);
    $('#card-music-btn').addEventListener('click', toggleAudio);
    music.addEventListener('error', () => { isPlaying = false; updateAudioUI(); });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isPlaying) { resumeOnVisible = true; pauseAudio(); }
        else if (!document.hidden && resumeOnVisible) { resumeOnVisible = false; playAudio(); }
    });

    let tipTimer = null;
    function showTip(text, ms) {
        tip.textContent = text;
        tip.classList.add('is-show');
        clearTimeout(tipTimer);
        tipTimer = setTimeout(hideTip, ms);
    }
    function hideTip() { tip.classList.remove('is-show'); }

    /* ---------- Countdown ---------- */
    const cd = { days: $('#days'), hours: $('#hours'), mins: $('#minutes'), secs: $('#seconds') };
    const pad = n => String(n).padStart(2, '0');
    let timer = null;
    function renderCountdown() {
        const now = Date.now();
        const title = $('#countdown-sec .section__title');
        const memo = $('#wedding-memory-msg');
        const box = $('#countdown');

        if (now >= START) {
            const isToday = now < END; // during the party
            box.hidden = true;
            memo.hidden = false;
            title.innerHTML = isToday ? T[lang].today_is_special : T[lang].wedding_happened;
            memo.textContent = isToday ? T[lang].today_msg : T[lang].wedding_memory;
            if (!isToday && timer) { clearInterval(timer); timer = null; }
            return;
        }
        const diff = Math.floor((START - now) / 1000);
        const v = {
            days: Math.floor(diff / 86400),
            hours: Math.floor((diff % 86400) / 3600),
            mins: Math.floor((diff % 3600) / 60),
            secs: diff % 60
        };
        Object.keys(v).forEach(k => {
            cd[k].textContent = pad(v[k]);
            cd[k].nextElementSibling.textContent = lang === 'ar' ? arUnit(k, v[k]) : EN_UNITS[k];
        });
    }
    timer = setInterval(renderCountdown, 1000);

    /* ---------- Calendar (Google + .ics) ---------- */
    const icsDate = ms => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    function setupCalendar() {
        const d = T[lang];
        const g = new URL('https://calendar.google.com/calendar/render');
        g.searchParams.set('action', 'TEMPLATE');
        g.searchParams.set('text', d.cal_title);
        g.searchParams.set('details', d.cal_details);
        g.searchParams.set('location', CONFIG.calLocation);
        g.searchParams.set('dates', `${icsDate(START)}/${icsDate(END)}`);
        $('#cal-google').href = g.toString();

        const esc = s => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
        const ics = [
            'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//KA Wedding//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            'UID:khaled-amal-20261023@wedding',
            `DTSTAMP:${icsDate(Date.now())}`,
            `DTSTART:${icsDate(START)}`,
            `DTEND:${icsDate(END)}`,
            `SUMMARY:${esc(d.cal_title)}`,
            `DESCRIPTION:${esc(d.cal_details)}`,
            `LOCATION:${esc(CONFIG.calLocation)}`,
            `URL:${CONFIG.mapsLink}`,
            'BEGIN:VALARM', 'TRIGGER:-PT3H', 'ACTION:DISPLAY', `DESCRIPTION:${esc(d.cal_title)}`, 'END:VALARM',
            'END:VEVENT', 'END:VCALENDAR'
        ].join('\r\n');
        const a = $('#cal-ics');
        a.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
        a.setAttribute('download', 'Khaled-Aml-Wedding.ics');
    }
    const calBtn = $('#add-calendar-btn');
    const calMenu = $('#cal-menu');
    const closeCal = () => { calMenu.hidden = true; calBtn.setAttribute('aria-expanded', 'false'); };
    calBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = calMenu.hidden;
        calMenu.hidden = !open;
        calBtn.setAttribute('aria-expanded', String(open));
    });
    calMenu.addEventListener('click', () => setTimeout(closeCal, 50));
    document.addEventListener('click', (e) => { if (!e.target.closest('.cal')) closeCal(); });

    /* ---------- WhatsApp share ---------- */
    function shareLink() {
        const u = new URL(location.href);
        u.search = ''; u.hash = '';
        if (lang === 'ar') u.searchParams.set('lang', 'ar');   // English is the default
        return u.toString();
    }
    function shareOnWhatsApp(e) {
        if (e) e.preventDefault();
        const text = T[lang].whatsapp_share.replace('{url}', shareLink());
        window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener');
    }
    $('#whatsapp-share-btn').addEventListener('click', shareOnWhatsApp);
    $('#whatsapp-float-btn').addEventListener('click', shareOnWhatsApp);

    /* ---------- Invitation card: the designed cards (Arabic + English) ---------- */
    const CARDS = {
        ar: 'assets/invitation_ar.jpg',
        en: 'assets/invitation_en.jpg'
    };
    function renderCard() {
        const img = $('#invitation-img');
        img.src = CARDS[lang];
        img.alt = T[lang].img_alt;
        const dl = $('#download-btn');
        dl.href = CARDS[lang];
        dl.setAttribute('download', T[lang].file);
    }

    // On phones: open the share sheet so the card can be saved to Photos or sent directly
    $('#download-btn').addEventListener('click', async (e) => {
        if (!(isMobile && navigator.canShare)) return;          // normal download
        e.preventDefault();
        const l = lang;
        try {
            const blob = await (await fetch(CARDS[l])).blob();
            const file = new File([blob], T[l].file, { type: 'image/jpeg' });
            if (navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: T[l].cal_title });
                return;
            }
        } catch (err) {
            if (err && err.name === 'AbortError') return;       // user cancelled
        }
        const a = document.createElement('a');                   // fallback: plain download
        a.href = CARDS[l]; a.download = T[l].file;
        document.body.appendChild(a); a.click(); a.remove();
    });

    /* ---------- Card: tilt + lightbox ---------- */
    const frame = $('#tilt-card');
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
        frame.addEventListener('mousemove', (e) => {
            const r = frame.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            frame.style.transform = `perspective(1000px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg)`;
        });
        frame.addEventListener('mouseleave', () => { frame.style.transform = ''; });
    }
    const modal = $('#image-modal');
    const modalImg = $('#modal-img');
    const modalClose = $('.modal__close');
    let lastFocus = null;
    function openModal() {
        const img = $('#invitation-img');
        if (!img.src) return;
        modalImg.src = img.src; modalImg.alt = img.alt;
        lastFocus = document.activeElement;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        body.style.overflow = 'hidden';
        modalClose.focus();
    }
    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        body.style.overflow = '';
        if (lastFocus) lastFocus.focus();
    }
    frame.addEventListener('click', openModal);
    modal.addEventListener('click', (e) => { if (e.target !== modalImg) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { if (modal.classList.contains('is-open')) closeModal(); closeCal(); }
        // keep keyboard focus inside the open lightbox
        if (e.key === 'Tab' && modal.classList.contains('is-open')) { e.preventDefault(); modalClose.focus(); }
    });

    /* ---------- Lazy map ---------- */
    const map = $('#venue-map');
    // Google embed centred on the hall, searched by name so the venue is pinned & labelled,
    // map labels follow the page language (ar / en)
    const mapSrc = () => 'https://maps.google.com/maps?q=' + encodeURIComponent(CONFIG.mapQuery) +
        `&ll=${CONFIG.lat},${CONFIG.lng}&z=16&hl=${lang}&output=embed`;
    function updateMapLang() {
        const fr = map && map.querySelector('iframe');
        if (fr) fr.src = mapSrc();
    }
    function loadMap() {
        if (map.dataset.loaded) return;
        map.dataset.loaded = '1';
        const fr = document.createElement('iframe');
        fr.src = mapSrc();
        fr.title = 'Moments Villa – map';
        fr.loading = 'lazy';
        fr.referrerPolicy = 'no-referrer-when-downgrade';
        fr.allowFullscreen = true;
        map.appendChild(fr);
    }
    if ('IntersectionObserver' in window) {
        const mio = new IntersectionObserver((en) => {
            if (en[0].isIntersecting) { loadMap(); mio.disconnect(); }
        }, { rootMargin: '300px' });
        mio.observe(map);
    } else { loadMap(); }

    /* ---------- RSVP via WhatsApp (shown only when a number is set) ---------- */
    const rsvp = $('#rsvp');
    if (rsvp && CONFIG.rsvpWhatsApp) {
        rsvp.hidden = false;
        const nameIn = $('#rsvp-name');
        const countIn = $('#rsvp-count');
        const hint = $('#rsvp-hint');
        if (guestName) nameIn.value = guestName;
        const send = (yes) => {
            const name = nameIn.value.trim();
            if (!name) { hint.textContent = T[lang].rsvp_need_name; nameIn.focus(); return; }
            hint.textContent = '';
            const msg = (yes ? T[lang].rsvp_msg_yes : T[lang].rsvp_msg_no)
                .replace('{name}', name).replace('{count}', countIn.value);
            window.open(`https://wa.me/${CONFIG.rsvpWhatsApp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
        };
        $('#rsvp-yes').addEventListener('click', () => send(true));
        $('#rsvp-no').addEventListener('click', () => send(false));
    }

    /* ---------- Init ---------- */
    applyLanguage(lang);
    updateAudioUI();
})();
