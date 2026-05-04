/* ================================================================
   OLEIFICIO CABRIOLU — Common JS
   Header, Footer, Hamburger, Smart-hide Nav, Cart Drawer,
   Cookie Banner, Chatbot Rule-Based, Watermark
   ================================================================ */
(function () {
    'use strict';

    /* ----------------------------------------------------------------
       CONFIG
       ---------------------------------------------------------------- */
    var SITE = {
        name: 'Oleificio Cabriolu',
        legal: 'Oleificio Cabriolu di Felice e Francesco s.n.c.',
        address: 'Zona industriale Str. A, 09039 Villacidro (Sud Sardegna), Italia',
        piva: '01418850929',
        sdi: '5RUO82D',
        tel: '+39 070 9311390',
        telDisplay: '+39 070 9311390',
        email: 'info@oleificiocabriolu.it',
        hours: 'Lun\u2013Gio 8:30\u201312:30 \u00b7 Ven 8:30\u201312:30 \u00b7 Sab\u2013Dom chiuso',
        instagram: 'https://www.instagram.com/oleificio.cabriolu/',
        facebook: 'https://www.facebook.com/oleificiocabriolu',
        mapsUrl: 'https://maps.google.com/?q=Oleificio+Cabriolu+Villacidro',
        logo: '/img/oleificio_cabriolu_logo_500-403051a0.webp',
        credit: { name: 'DigIdentity Agency', url: 'https://digidentityagency.it' },
        shipping: { free: 45, cost: 9.90 }
    };

    var NAV_ITEMS = [
        { label: 'Home', href: '/' },
        { label: 'Storia', href: '/storia/' },
        { label: 'Frangitura', href: '/frangitura/' },
        { label: 'Territorio', href: '/territorio/' },
        { label: 'Blog', href: '/blog/' },
        { label: 'Contatti', href: '/contatti/' }
    ];

    var SHOP_ITEMS = [
        { label: 'Extravergine Puro 0,5L', href: '/shop/evo-puro/' },
        { label: 'Extravergine Puro Latta 3L', href: '/shop/evo-puro-latta/' },
        { label: 'Olio al Peperoncino', href: '/shop/olio-peperoncino/' },
        { label: 'Olio al Basilico', href: '/shop/olio-basilico/' },
        { label: 'Olio al Limone', href: '/shop/olio-limone/' },
        { label: 'Cofanetto Luxury', href: '/shop/cofanetto/' }
    ];

    /* ----------------------------------------------------------------
       UTILITIES
       ---------------------------------------------------------------- */
    function el(tag, attrs, children) {
        var node = document.createElement(tag);
        if (attrs) {
            Object.keys(attrs).forEach(function (k) {
                if (k === 'className') node.className = attrs[k];
                else if (k === 'innerHTML') node.innerHTML = attrs[k];
                else if (k === 'textContent') node.textContent = attrs[k];
                else if (k.indexOf('data') === 0) node.setAttribute(k.replace(/([A-Z])/g, '-$1').toLowerCase(), attrs[k]);
                else node.setAttribute(k, attrs[k]);
            });
        }
        if (children) {
            children.forEach(function (c) {
                if (typeof c === 'string') node.appendChild(document.createTextNode(c));
                else if (c) node.appendChild(c);
            });
        }
        return node;
    }

    function currentPath() {
        var p = window.location.pathname;
        if (p !== '/' && p.slice(-1) !== '/') p += '/';
        return p;
    }

    function svgIcon(name) {
        var icons = {
            cart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>',
            chat: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>',
            instagram: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
            facebook: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
            chevron: '<svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l4 4 4-4"/></svg>',
            send: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>'
        };
        return icons[name] || '';
    }

    /* ----------------------------------------------------------------
       INJECT HEADER
       ---------------------------------------------------------------- */
    function injectHeader() {
        if (document.getElementById('nav')) return; // gia' presente nell'HTML

        var path = currentPath();

        // Build nav links
        var linksHtml = '';
        NAV_ITEMS.forEach(function (item) {
            var active = (path === item.href) ? ' aria-current="page"' : '';
            linksHtml += '<li><a href="' + item.href + '"' + active + '>' + item.label + '</a></li>';
        });

        // Shop dropdown
        var subHtml = '';
        SHOP_ITEMS.forEach(function (item) {
            subHtml += '<li><a href="' + item.href + '">' + item.label + '</a></li>';
        });

        var shopActive = (path.indexOf('/shop') === 0) ? ' aria-current="page"' : '';
        linksHtml += '<li class="nav__dropdown"><a href="/shop/" class="nav__cta"' + shopActive + '>Shop ' + svgIcon('chevron') + '</a><ul class="nav__sub">' + subHtml + '</ul></li>';

        var navHtml = '<nav id="nav" class="nav" role="navigation" aria-label="Navigazione principale">' +
            '<div class="nav__inner">' +
            '<a href="/" class="nav__logo" aria-label="' + SITE.name + ' - Home">' +
            '<img src="' + SITE.logo + '" alt="' + SITE.name + '" class="nav__logo-img" width="160" height="auto">' +
            '</a>' +
            '<ul class="nav__links">' + linksHtml + '</ul>' +
            '<div style="display:flex;align-items:center;gap:8px;">' +
            '<button class="nav__cart" id="cartToggle" aria-label="Carrello">' + svgIcon('cart') + '<span class="nav__cart-badge" id="cartBadge">0</span></button>' +
            '<button class="nav__burger" id="navBurger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
            '</div>' +
            '</div></nav>';

        // Mobile menu
        var mobileHtml = '<div class="mobile-menu" id="mobileMenu" aria-hidden="true"><ul>';
        NAV_ITEMS.forEach(function (item) {
            mobileHtml += '<li><a href="' + item.href + '">' + item.label + '</a></li>';
        });
        mobileHtml += '<li><a href="/shop/">Shop</a></li>';
        mobileHtml += '<li class="mobile-menu__divider"></li>';
        SHOP_ITEMS.forEach(function (item) {
            mobileHtml += '<li><a href="' + item.href + '" class="mobile-menu__sub">' + item.label + '</a></li>';
        });
        mobileHtml += '</ul></div>';

        document.body.insertAdjacentHTML('afterbegin', navHtml + mobileHtml);
    }

    /* ----------------------------------------------------------------
       INJECT FOOTER
       ---------------------------------------------------------------- */
    function injectFooter() {
        if (document.querySelector('.footer')) return;

        var navLinks = '';
        NAV_ITEMS.forEach(function (item) {
            navLinks += '<li><a href="' + item.href + '">' + item.label + '</a></li>';
        });
        navLinks += '<li><a href="/shop/">Shop</a></li>';

        var prodLinks = '';
        SHOP_ITEMS.forEach(function (item) {
            prodLinks += '<li><a href="' + item.href + '">' + item.label + '</a></li>';
        });

        var footerHtml = '<footer class="footer">' +
            '<div class="footer__inner">' +

            // Col 1: Brand
            '<div class="footer__brand">' +
            '<a href="/"><img src="' + SITE.logo + '" alt="' + SITE.name + '" class="footer__logo-img" width="160" height="auto" loading="lazy"></a>' +
            '<span class="footer__logo-sub">Oleificio dal 1890 \u00b7 Villacidro</span>' +
            '<p class="footer__tagline">Olio extravergine d\'oliva artigianale, non filtrato, dal cuore della Sardegna.</p>' +
            '<div class="footer__social">' +
            '<a href="' + SITE.instagram + '" target="_blank" rel="noopener" aria-label="Instagram">' + svgIcon('instagram') + '</a>' +
            '<a href="' + SITE.facebook + '" target="_blank" rel="noopener" aria-label="Facebook">' + svgIcon('facebook') + '</a>' +
            '</div></div>' +

            // Col 2: Nav
            '<div class="footer__nav"><h4>Navigazione</h4><ul>' + navLinks + '</ul></div>' +

            // Col 3: Prodotti
            '<div class="footer__nav"><h4>Prodotti</h4><ul>' + prodLinks + '</ul></div>' +

            // Col 4: Contatti
            '<div class="footer__contact"><h4>Contatti</h4>' +
            '<address>' +
            '<p>' + SITE.legal + '</p>' +
            '<p>' + SITE.address + '</p>' +
            '<p style="margin-top:12px"><a href="tel:' + SITE.tel.replace(/\s/g, '') + '">' + SITE.telDisplay + '</a></p>' +
            '<p><a href="mailto:' + SITE.email + '">' + SITE.email + '</a></p>' +
            '</address>' +
            '<p style="margin-top:12px;font-size:.8rem;color:var(--cream-dim)">' + SITE.hours + '</p>' +
            '</div>' +

            '</div>' +

            // Bottom
            '<div class="footer__bottom">' +
            '<p>&copy; 2026 ' + SITE.legal + ' \u2014 P.IVA ' + SITE.piva + ' \u2014 SDI ' + SITE.sdi + '</p>' +
            '<div class="footer__legal">' +
            '<a href="/privacy/">Privacy</a>' +
            '<a href="/cookie/">Cookie</a>' +
            '<a href="/termini/">Termini</a>' +
            '<a href="/resi/">Resi</a>' +
            '</div>' +
            '<p class="footer__credit">by <a href="' + SITE.credit.url + '" target="_blank" rel="noopener">' + SITE.credit.name + '</a></p>' +
            '</div></footer>';

        // Insert before closing </body> or after main
        var main = document.querySelector('main') || document.querySelector('.footer-anchor');
        if (main) {
            main.insertAdjacentHTML('afterend', footerHtml);
        } else {
            document.body.insertAdjacentHTML('beforeend', footerHtml);
        }
    }

    /* ----------------------------------------------------------------
       HAMBURGER + MOBILE MENU
       ---------------------------------------------------------------- */
    function initBurger() {
        var burger = document.getElementById('navBurger');
        var menu = document.getElementById('mobileMenu');
        if (!burger || !menu) return;

        burger.addEventListener('click', function () {
            var isOpen = menu.classList.toggle('mobile-menu--open');
            burger.classList.toggle('nav__burger--open');
            burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            menu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        menu.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                menu.classList.remove('mobile-menu--open');
                burger.classList.remove('nav__burger--open');
                burger.setAttribute('aria-expanded', 'false');
                menu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            });
        });

        // Close on ESC
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('mobile-menu--open')) {
                burger.click();
            }
        });
    }

    /* ----------------------------------------------------------------
       SMART-HIDE NAV (scroll down = hide, scroll up = show)
       ---------------------------------------------------------------- */
    function initSmartNav() {
        var nav = document.getElementById('nav');
        if (!nav) return;

        var lastY = 0;
        var ticking = false;

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    var y = window.scrollY;
                    if (y > 80) {
                        nav.classList.add('nav--scrolled');
                        if (y > lastY && y > 200) {
                            nav.classList.add('nav--hidden');
                        } else {
                            nav.classList.remove('nav--hidden');
                        }
                    } else {
                        nav.classList.remove('nav--scrolled');
                        nav.classList.remove('nav--hidden');
                    }
                    lastY = y;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* ----------------------------------------------------------------
       DROPDOWN SHOP (touch devices)
       ---------------------------------------------------------------- */
    function initDropdown() {
        var dropdown = document.querySelector('.nav__dropdown');
        if (!dropdown) return;
        var cta = dropdown.querySelector('.nav__cta');
        if (!cta || !('ontouchstart' in window)) return;

        cta.addEventListener('click', function (e) {
            if (!dropdown.classList.contains('nav__dropdown--open')) {
                e.preventDefault();
                dropdown.classList.add('nav__dropdown--open');
            }
        });

        document.addEventListener('click', function (e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('nav__dropdown--open');
            }
        });
    }

    /* ----------------------------------------------------------------
       CART (localStorage persistent)
       ---------------------------------------------------------------- */
    var Cart = {
        KEY: 'cabriolu_cart',

        get: function () {
            try {
                return JSON.parse(localStorage.getItem(this.KEY)) || [];
            } catch (e) {
                return [];
            }
        },

        save: function (items) {
            localStorage.setItem(this.KEY, JSON.stringify(items));
            this.updateBadge();
            this.renderDrawer();
        },

        add: function (product) {
            var items = this.get();
            var found = items.find(function (i) { return i.slug === product.slug; });
            if (found) {
                found.qty += 1;
            } else {
                product.qty = 1;
                items.push(product);
            }
            this.save(items);
            this.openDrawer();
        },

        remove: function (slug) {
            var items = this.get().filter(function (i) { return i.slug !== slug; });
            this.save(items);
        },

        updateQty: function (slug, delta) {
            var items = this.get();
            var item = items.find(function (i) { return i.slug === slug; });
            if (item) {
                item.qty = Math.max(1, item.qty + delta);
            }
            this.save(items);
        },

        total: function () {
            return this.get().reduce(function (sum, i) { return sum + (i.price * i.qty); }, 0);
        },

        count: function () {
            return this.get().reduce(function (sum, i) { return sum + i.qty; }, 0);
        },

        updateBadge: function () {
            var badge = document.getElementById('cartBadge');
            if (!badge) return;
            var c = this.count();
            badge.textContent = c;
            badge.classList.toggle('nav__cart-badge--visible', c > 0);
        },

        openDrawer: function () {
            var drawer = document.getElementById('cartDrawer');
            var overlay = document.getElementById('cartOverlay');
            if (drawer) drawer.classList.add('cart-drawer--open');
            if (overlay) overlay.classList.add('cart-overlay--visible');
            document.body.style.overflow = 'hidden';
        },

        closeDrawer: function () {
            var drawer = document.getElementById('cartDrawer');
            var overlay = document.getElementById('cartOverlay');
            if (drawer) drawer.classList.remove('cart-drawer--open');
            if (overlay) overlay.classList.remove('cart-overlay--visible');
            document.body.style.overflow = '';
        },

        renderDrawer: function () {
            var body = document.getElementById('cartDrawerBody');
            var footer = document.getElementById('cartDrawerFooter');
            if (!body) return;

            var items = this.get();
            if (items.length === 0) {
                body.innerHTML = '<div class="cart-drawer__empty">Il carrello è vuoto</div>';
                if (footer) footer.style.display = 'none';
                return;
            }

            var html = '';
            items.forEach(function (item) {
                html += '<div class="cart-item">' +
                    '<div class="cart-item__img"><img src="' + (item.image || '') + '" alt="' + item.name + '" loading="lazy"></div>' +
                    '<div class="cart-item__info">' +
                    '<div class="cart-item__name">' + item.name + '</div>' +
                    '<div class="cart-item__price">' + item.price.toFixed(2).replace('.', ',') + ' &euro;</div>' +
                    '<div class="cart-item__qty">' +
                    '<button data-cart-qty="' + item.slug + '" data-delta="-1" aria-label="Meno">-</button>' +
                    '<span>' + item.qty + '</span>' +
                    '<button data-cart-qty="' + item.slug + '" data-delta="1" aria-label="Pi\u00f9">+</button>' +
                    '</div>' +
                    '<button class="cart-item__remove" data-cart-remove="' + item.slug + '">Rimuovi</button>' +
                    '</div></div>';
            });
            body.innerHTML = html;

            if (footer) {
                footer.style.display = 'block';
                var total = Cart.total();
                var shippingText = total >= SITE.shipping.free
                    ? 'Spedizione gratuita!'
                    : 'Spedizione: ' + SITE.shipping.cost.toFixed(2).replace('.', ',') + ' &euro; (gratis sopra ' + SITE.shipping.free + ' &euro;)';

                var totalEl = footer.querySelector('.cart-drawer__total span:last-child');
                var shipEl = footer.querySelector('.cart-drawer__shipping');
                if (totalEl) totalEl.textContent = total.toFixed(2).replace('.', ',') + ' \u20ac';
                if (shipEl) shipEl.innerHTML = shippingText;
            }

            // Bind qty/remove buttons
            body.querySelectorAll('[data-cart-qty]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    Cart.updateQty(btn.dataset.cartQty, parseInt(btn.dataset.delta));
                });
            });
            body.querySelectorAll('[data-cart-remove]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    Cart.remove(btn.dataset.cartRemove);
                });
            });
        }
    };

    // Expose Cart globally for product pages
    window.CabrCart = Cart;

    function injectCartDrawer() {
        if (document.getElementById('cartDrawer')) return;

        var html = '<div class="cart-overlay" id="cartOverlay"></div>' +
            '<aside class="cart-drawer" id="cartDrawer" aria-label="Carrello">' +
            '<div class="cart-drawer__header"><h2>Carrello</h2><button class="cart-drawer__close" id="cartDrawerClose" aria-label="Chiudi carrello">&times;</button></div>' +
            '<div class="cart-drawer__body" id="cartDrawerBody"></div>' +
            '<div class="cart-drawer__footer" id="cartDrawerFooter" style="display:none">' +
            '<div class="cart-drawer__total"><span>Totale</span><span>0,00 &euro;</span></div>' +
            '<p class="cart-drawer__shipping"></p>' +
            '<a href="/carrello/" class="cart-drawer__checkout">Vai al Checkout</a>' +
            '<a href="/shop/" class="cart-drawer__continue">Continua lo shopping</a>' +
            '</div></aside>';

        document.body.insertAdjacentHTML('beforeend', html);

        // Bind events
        document.getElementById('cartToggle').addEventListener('click', function () {
            Cart.openDrawer();
        });
        document.getElementById('cartDrawerClose').addEventListener('click', function () {
            Cart.closeDrawer();
        });
        document.getElementById('cartOverlay').addEventListener('click', function () {
            Cart.closeDrawer();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') Cart.closeDrawer();
        });

        Cart.updateBadge();
        Cart.renderDrawer();
    }

    /* ----------------------------------------------------------------
       COOKIE BANNER (Garante 2024 — 3 bottoni primo livello)
       ---------------------------------------------------------------- */
    function injectCookieBanner() {
        if (localStorage.getItem('cabriolu_consent')) return;
        if (document.getElementById('cookieBanner')) return;

        var html = '<div class="cookie-banner" id="cookieBanner" role="dialog" aria-label="Consenso cookie">' +
            '<p>Questo sito utilizza cookie tecnici e, previo tuo consenso, cookie di profilazione per migliorare la tua esperienza. ' +
            '<a href="/cookie/">Leggi la Cookie Policy</a></p>' +
            '<div class="cookie-banner__actions">' +
            '<button class="cookie-banner__btn cookie-banner__btn--accept" id="cookieAccept">Accetta tutto</button>' +
            '<button class="cookie-banner__btn cookie-banner__btn--reject" id="cookieReject">Rifiuta tutto</button>' +
            '<button class="cookie-banner__btn cookie-banner__btn--customize" id="cookieCustomize">Personalizza</button>' +
            '</div></div>';

        document.body.insertAdjacentHTML('beforeend', html);

        setTimeout(function () {
            document.getElementById('cookieBanner').classList.add('cookie-banner--visible');
        }, 1500);

        function setConsent(val) {
            localStorage.setItem('cabriolu_consent', val);
            document.cookie = 'cabriolu_consent=' + val + ';path=/;max-age=31536000;SameSite=Lax';
            document.getElementById('cookieBanner').classList.remove('cookie-banner--visible');
        }

        document.getElementById('cookieAccept').addEventListener('click', function () {
            setConsent('accepted');
        });
        document.getElementById('cookieReject').addEventListener('click', function () {
            setConsent('rejected');
        });
        document.getElementById('cookieCustomize').addEventListener('click', function () {
            // Per la demo, apre la pagina cookie policy
            window.location.href = '/cookie/';
        });
    }

    /* ----------------------------------------------------------------
       CHATBOT RULE-BASED (swap-ready per Vapi)
       ---------------------------------------------------------------- */
    function initChatbot() {
        if (document.getElementById('chatbotFab')) return;

        // Detect language
        var lang = (navigator.language || 'it').slice(0, 2);
        var greetings = {
            it: 'Ciao! Sono Oli, l\'assistente dell\'Oleificio Cabriolu. Come posso aiutarti?',
            en: 'Hi! I\'m Oli, Oleificio Cabriolu\'s assistant. How can I help you?',
            de: 'Hallo! Ich bin Oli, der Assistent der Oleificio Cabriolu. Wie kann ich Ihnen helfen?',
            fr: 'Bonjour! Je suis Oli, l\'assistant de l\'Oleificio Cabriolu. Comment puis-je vous aider?',
            es: 'Hola! Soy Oli, el asistente del Oleificio Cabriolu. Como puedo ayudarte?'
        };
        var welcomeMsg = greetings[lang] || greetings.it;

        // Intent rules
        var intents = [
            {
                patterns: ['orari', 'aperti', 'chiusi', 'open', 'hours', 'aperto', 'quando', 'orario'],
                reply: 'I nostri orari: ' + SITE.hours
            },
            {
                patterns: ['dove', 'indirizzo', 'address', 'mappa', 'map', 'dove siete', 'location', 'trovarvi'],
                reply: 'Ci trovi qui: ' + SITE.address + '. <a href="' + SITE.mapsUrl + '" target="_blank" rel="noopener">Apri Google Maps</a>'
            },
            {
                patterns: ['spedizione', 'shipping', 'consegna', 'delivery', 'spedite', 'costo spedizione'],
                reply: 'Spedizione: ' + SITE.shipping.cost.toFixed(2).replace('.', ',') + ' \u20ac. Gratuita sopra ' + SITE.shipping.free + ' \u20ac. Consegna in 24-48h in tutta Italia.'
            },
            {
                patterns: ['prodotti', 'products', 'olio', 'oli', 'catalogo', 'cosa vendete'],
                reply: 'I nostri oli: Extravergine Puro (0,5L - 7,90\u20ac), Latta 3L (38\u20ac), Olio al Peperoncino, Basilico, Limone (0,25L - 8,90\u20ac ciascuno), Cofanetto Luxury (34,90\u20ac). <a href="/shop/">Visita lo Shop</a>'
            },
            {
                patterns: ['prezzo', 'prezzi', 'quanto costa', 'price', 'listino', 'costo'],
                reply: 'EVO Puro 0,5L: 7,90\u20ac | Latta 3L: 38\u20ac | Aromatizzati 0,25L: 8,90\u20ac | Cofanetto: 34,90\u20ac. Spedizione gratuita sopra 45\u20ac!'
            },
            {
                patterns: ['prenota', 'molitura', 'frangitura conto terzi', 'booking', 'prenotazione', 'spremere'],
                reply: 'Per prenotare la frangitura conto terzi, chiamaci al ' + SITE.telDisplay + ' o <a href="/contatti/">compila il form contatti</a>. Disponibilita: ottobre-febbraio.'
            },
            {
                patterns: ['stato ordine', 'ordine', 'tracking', 'order', 'tracciamento'],
                reply: 'Per verificare lo stato del tuo ordine, scrivici a <a href="mailto:' + SITE.email + '">' + SITE.email + '</a> indicando il numero ordine e l\'email usata per l\'acquisto.'
            },
            {
                patterns: ['telefono', 'chiamare', 'call', 'phone', 'numero'],
                reply: 'Puoi chiamarci al <a href="tel:' + SITE.tel.replace(/\s/g, '') + '">' + SITE.telDisplay + '</a>'
            },
            {
                patterns: ['grazie', 'thank', 'merci', 'danke'],
                reply: 'Prego! Se hai altre domande, sono qui.'
            },
            {
                patterns: ['ciao', 'hello', 'hola', 'buongiorno', 'salve', 'hey', 'hi', 'hallo', 'bonjour'],
                reply: welcomeMsg
            }
        ];

        // Inject HTML
        var fabHtml = '<button class="chatbot-fab" id="chatbotFab" aria-label="Assistente virtuale">' + svgIcon('chat') + '</button>';
        var panelHtml = '<div class="chatbot-panel" id="chatbotPanel" aria-hidden="true">' +
            '<div class="chatbot-panel__header"><span>Oli \u2014 Assistente Cabriolu</span>' +
            '<button class="chatbot-panel__close" id="chatbotClose" aria-label="Chiudi chat">&times;</button></div>' +
            '<div class="chatbot-panel__body" id="chatbotBody">' +
            '<div class="chatbot-msg chatbot-msg--bot">' + welcomeMsg +
            '<div class="chatbot-quick">' +
            '<button class="chatbot-quick__btn" data-intent="orari">Orari</button>' +
            '<button class="chatbot-quick__btn" data-intent="dove">Dove siete</button>' +
            '<button class="chatbot-quick__btn" data-intent="prodotti">Prodotti</button>' +
            '<button class="chatbot-quick__btn" data-intent="spedizione">Spedizioni</button>' +
            '<button class="chatbot-quick__btn" data-intent="prenota">Prenota molitura</button>' +
            '</div></div></div>' +
            '<div class="chatbot-panel__input">' +
            '<input type="text" id="chatbotInput" placeholder="Scrivi un messaggio..." aria-label="Messaggio">' +
            '<button id="chatbotSend" aria-label="Invia">' + svgIcon('send') + '</button>' +
            '</div></div>';

        document.body.insertAdjacentHTML('beforeend', fabHtml + panelHtml);

        var fab = document.getElementById('chatbotFab');
        var panel = document.getElementById('chatbotPanel');
        var closeBtn = document.getElementById('chatbotClose');
        var input = document.getElementById('chatbotInput');
        var sendBtn = document.getElementById('chatbotSend');
        var body = document.getElementById('chatbotBody');

        function togglePanel() {
            var open = panel.classList.toggle('chatbot-panel--open');
            panel.setAttribute('aria-hidden', open ? 'false' : 'true');
            if (open) input.focus();
        }

        fab.addEventListener('click', togglePanel);
        closeBtn.addEventListener('click', function () {
            panel.classList.remove('chatbot-panel--open');
            panel.setAttribute('aria-hidden', 'true');
        });

        // Close on ESC
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && panel.classList.contains('chatbot-panel--open')) {
                panel.classList.remove('chatbot-panel--open');
                panel.setAttribute('aria-hidden', 'true');
            }
        });

        // Close on click outside
        document.addEventListener('click', function (e) {
            if (panel.classList.contains('chatbot-panel--open') && !panel.contains(e.target) && e.target !== fab && !fab.contains(e.target)) {
                panel.classList.remove('chatbot-panel--open');
                panel.setAttribute('aria-hidden', 'true');
            }
        });

        function addMsg(text, sender) {
            var msg = document.createElement('div');
            msg.className = 'chatbot-msg chatbot-msg--' + sender;
            msg.innerHTML = text;
            body.appendChild(msg);
            body.scrollTop = body.scrollHeight;
        }

        function findReply(text) {
            var lower = text.toLowerCase().trim();
            for (var i = 0; i < intents.length; i++) {
                for (var j = 0; j < intents[i].patterns.length; j++) {
                    if (lower.indexOf(intents[i].patterns[j]) !== -1) {
                        return intents[i].reply;
                    }
                }
            }
            return null;
        }

        var fallbackMsg = 'Non ho trovato una risposta precisa. Vuoi che ti facciamo richiamare? Lascia il tuo nome e numero e ti contattiamo al piu\' presto!';
        var awaitingCallback = false;

        function processMessage(text) {
            addMsg(text, 'user');

            if (awaitingCallback) {
                // Save lead
                awaitingCallback = false;
                addMsg('Perfetto! Ti richiameremo al piu\' presto. Grazie!', 'bot');
                saveLead(text);
                return;
            }

            var reply = findReply(text);
            if (reply) {
                setTimeout(function () { addMsg(reply, 'bot'); }, 300);
            } else {
                awaitingCallback = true;
                setTimeout(function () { addMsg(fallbackMsg, 'bot'); }, 300);
            }
        }

        function saveLead(contact) {
            // POST to /api/lead.php — silently fail for demo
            try {
                fetch('/api/lead.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contact: contact, timestamp: new Date().toISOString(), page: window.location.pathname })
                }).catch(function () { /* silent */ });
            } catch (e) { /* silent */ }
        }

        function saveLog(userMsg, botReply) {
            try {
                fetch('/api/chat-log.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_msg: userMsg,
                        bot_reply: botReply,
                        lang: lang,
                        timestamp: new Date().toISOString(),
                        page: window.location.pathname
                    })
                }).catch(function () { /* silent */ });
            } catch (e) { /* silent */ }
        }

        function send() {
            var msg = input.value.trim();
            if (!msg) return;
            input.value = '';

            var reply = findReply(msg);
            processMessage(msg);

            // Log
            saveLog(msg, reply || 'FALLBACK');
        }

        sendBtn.addEventListener('click', send);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') send();
        });

        // Quick reply buttons
        body.addEventListener('click', function (e) {
            var btn = e.target.closest('.chatbot-quick__btn');
            if (!btn) return;
            var intent = btn.dataset.intent;
            if (intent) {
                input.value = intent;
                send();
            }
        });
    }

    /* ----------------------------------------------------------------
       WATERMARK (dynamic per page)
       ---------------------------------------------------------------- */
    function injectWatermark() {
        if (document.querySelector('.watermark-wrap')) return;

        var path = currentPath();
        var text = 'CABRIOLU';

        if (path.indexOf('/storia') === 0) text = 'STORIA';
        else if (path.indexOf('/frangitura') === 0) text = 'FRANGITURA';
        else if (path.indexOf('/territorio') === 0) text = 'TERRITORIO';
        else if (path.indexOf('/contatti') === 0) text = 'CONTATTI';
        else if (path.indexOf('/blog') === 0) text = 'BLOG';
        else if (path.indexOf('/shop/evo-puro-latta') === 0) text = 'LATTA 3L';
        else if (path.indexOf('/shop/evo-puro') === 0) text = 'EVO PURO';
        else if (path.indexOf('/shop/olio-peperoncino') === 0) text = 'PEPERONCINO';
        else if (path.indexOf('/shop/olio-basilico') === 0) text = 'BASILICO';
        else if (path.indexOf('/shop/olio-limone') === 0) text = 'LIMONE';
        else if (path.indexOf('/shop/cofanetto') === 0) text = 'COFANETTO';
        else if (path.indexOf('/shop') === 0) text = 'SHOP';
        else if (path.indexOf('/carrello') === 0) text = 'CARRELLO';

        var spans = '';
        for (var i = 0; i < 4; i++) {
            spans += '<span>' + text + '</span>';
        }

        var html = '<div class="watermark-wrap" aria-hidden="true"><div class="watermark-track">' + spans + '</div></div>';
        document.body.insertAdjacentHTML('beforeend', html);
    }

    /* ----------------------------------------------------------------
       SMOOTH SCROLL (anchor links)
       ---------------------------------------------------------------- */
    function initSmoothScroll() {
        document.addEventListener('click', function (e) {
            var link = e.target.closest('a[href^="#"]');
            if (!link) return;
            var id = link.getAttribute('href');
            if (id === '#') return;
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    /* ----------------------------------------------------------------
       INIT
       ---------------------------------------------------------------- */
    function init() {
        injectHeader();
        injectFooter();
        initBurger();
        initSmartNav();
        initDropdown();
        injectCartDrawer();
        injectCookieBanner();
        initChatbot();
        injectWatermark();
        initSmoothScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
