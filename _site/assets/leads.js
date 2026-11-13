
(function () {
  'use strict';

  var LEAD_URL = '';
  if (LEAD_URL.indexOf('https://script.google.com/macros/s/') !== 0) return;

  
  var LEAD_TEST = /[?&]test=1/.test(location.search);

  function sendLead(d) {
    try {
      d.page = location.pathname || '/';
      d.referrer = document.referrer || '';
      if (LEAD_TEST) d.test = true;
      fetch(LEAD_URL, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: true,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(d)
      })['catch'](function () {  });
    } catch (e) {  }
  }

  
  function where(el) {
    if (!el || !el.closest) return 'page';
    if (el.closest('.wa-float')) return 'whatsapp button';
    if (el.closest('.mobile-menu')) return 'menu';
    if (el.closest('.nav')) return 'nav';
    if (el.closest('.hero, .page-head')) return 'hero';
    if (el.closest('#contact, .ci-list')) return 'contact section';
    if (el.closest('.final-cta, .cta-band')) return 'call to action';
    if (el.closest('footer')) return 'footer';
    return 'page';
  }

  
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var h = a.getAttribute('href') || '';
    if (h.indexOf('tel:') === 0) {
      sendLead({ type: 'Call click', phone: h.slice(4), source: where(a) });
    } else if (/^https:\/\/wa\.me\//.test(h)) {
      sendLead({ type: 'WhatsApp click', source: where(a) });
    } else if (h.indexOf('mailto:') === 0) {
      sendLead({ type: 'Email click', details: h.slice(7).split('?')[0], source: where(a) });
    }
  }, true);

  
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || f.id !== 'quoteForm') return;
    var v = function (k) { return (f.elements[k] && f.elements[k].value || '').trim(); };
    if (!v('name') || !v('phone')) return;
    var bot = f.elements.botcheck;
    sendLead({
      type: 'Quote form',
      name: v('name'),
      phone: v('phone'),
      service: v('service'),
      details: v('detail'),
      source: location.pathname.indexOf('/contact') === 0 ? 'contact page form' : 'quote form',
      botcheck: bot && bot.checked ? 'bot' : ''
    });
  }, true);
})();
