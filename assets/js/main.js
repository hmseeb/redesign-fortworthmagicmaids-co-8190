/* ==========================================================================
   Fort Worth Magic Maids — site scripts
   Vanilla JS: mobile nav, sticky header, reveal-on-scroll, form handling
   ========================================================================== */
(function () {
  'use strict';

  var FORM_ENDPOINT = 'https://vision.leadrai.com/api/forms/ec1e53b1d3a6090228ee6793e98ec2de';

  /* ---------------- Mobile navigation ---------------- */
  function initNav() {
    var toggle = document.querySelector('.nav__toggle');
    var panel = document.getElementById('nav-panel');
    var header = document.querySelector('.site-header');
    if (!toggle || !panel) return;

    function setOffset() {
      if (header) {
        var nav = header.querySelector('.nav');
        var h = nav ? nav.getBoundingClientRect().height : 74;
        panel.style.setProperty('--header-offset', Math.round(h) + 'px');
      }
    }

    function close() {
      panel.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      if (open) {
        close();
      } else {
        setOffset();
        panel.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });

    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1000) close();
      else setOffset();
    });
  }

  /* ---------------- Sticky header shadow ---------------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------- Reveal on scroll ---------------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(items, function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + 'ms';
      io.observe(el);
    });
  }

  /* ---------------- Current year ---------------- */
  function initYear() {
    var nodes = document.querySelectorAll('[data-year]');
    var year = new Date().getFullYear();
    Array.prototype.forEach.call(nodes, function (n) { n.textContent = year; });
  }

  /* ---------------- Forms ---------------- */
  function showSuccess(form) {
    var box = form.parentNode.querySelector('.js-form-success')
      || document.querySelector('.js-form-success');
    if (box) {
      box.hidden = false;
      box.setAttribute('role', 'status');
      form.hidden = true;
      try { box.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) { box.scrollIntoView(); }
    }
  }

  function showError(form, message) {
    var box = form.querySelector('.js-form-error');
    if (box) {
      box.hidden = false;
      var target = box.querySelector('[data-error-text]');
      if (target && message) target.textContent = message;
      try { box.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
    }
  }

  function initForms() {
    var forms = document.querySelectorAll('form[data-leadr]');

    Array.prototype.forEach.call(forms, function (form) {
      /* Always stamp the current page URL so visitors return to the right page. */
      var pageField = form.querySelector('input[name="_page"]');
      if (pageField) pageField.value = window.location.href;

      form.addEventListener('submit', function (e) {
        if (!window.fetch || !window.FormData) return; /* let the plain POST happen */
        if (!form.checkValidity()) return;             /* let the browser show messages */

        e.preventDefault();

        var errorBox = form.querySelector('.js-form-error');
        if (errorBox) errorBox.hidden = true;

        var submitBtn = form.querySelector('[type="submit"]');
        var originalLabel = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Sending…';
        }

        var data = {};
        var fd = new FormData(form);
        fd.forEach(function (value, key) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            if (Array.isArray(data[key])) data[key].push(value);
            else data[key] = [data[key], value];
          } else {
            data[key] = value;
          }
        });
        Object.keys(data).forEach(function (k) {
          if (Array.isArray(data[k])) data[k] = data[k].join(', ');
        });
        data._page = window.location.href;

        fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        })
          .then(function (res) {
            return res.json().catch(function () { return { ok: res.ok }; });
          })
          .then(function (json) {
            if (json && json.ok) {
              showSuccess(form);
              form.reset();
            } else {
              throw new Error('Submission failed');
            }
          })
          .catch(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalLabel;
            }
            showError(form, 'Something went wrong sending your request. Please call (817) 420-7106 or email info@fortworthmagicmaids.com and we’ll take care of you.');
          });
      });
    });

    /* Plain (no-JS) submissions come back with ?submitted=1 */
    var params = new URLSearchParams(window.location.search);
    if (params.get('submitted') === '1') {
      var box = document.querySelector('.js-form-success');
      if (box) {
        box.hidden = false;
        box.setAttribute('role', 'status');
        var liveForm = document.querySelector('form[data-leadr]');
        if (liveForm) liveForm.hidden = true;
        try { box.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
      }
    }
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    initNav();
    initHeader();
    initReveal();
    initYear();
    initForms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
