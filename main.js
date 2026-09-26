/* =========================================================
   FORGE FITNESS STUDIO — main.js
   1. Mobile nav toggle
   2. Class schedule day filter (Home)
   3. Testimonial slider (Home)
   4. Gallery lightbox (About)
   5. Contact form validation (Contact)
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('open');
      });
    });
  }

  /* ---------- 2. Class schedule day filter ---------- */
  var filterButtons = document.querySelectorAll('.class-filters button');
  var scheduleRows = document.querySelectorAll('table.schedule tbody tr');
  if (filterButtons.length && scheduleRows.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var day = btn.getAttribute('data-day');
        scheduleRows.forEach(function (row) {
          if (day === 'all' || row.getAttribute('data-day') === day) {
            row.hidden = false;
          } else {
            row.hidden = true;
          }
        });
      });
    });
  }

  /* ---------- 3. Testimonial slider ---------- */
  var slides = document.querySelectorAll('.slide');
  var prevBtn = document.querySelector('[data-slide="prev"]');
  var nextBtn = document.querySelector('[data-slide="next"]');
  if (slides.length) {
    var current = 0;
    var show = function (index) {
      slides[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
    };
    if (prevBtn) prevBtn.addEventListener('click', function () { show(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(current + 1); });
    setInterval(function () { show(current + 1); }, 7000);
  }

  /* ---------- 4. Gallery lightbox ---------- */
  var galleryButtons = document.querySelectorAll('.gallery button');
  var lightbox = document.querySelector('.lightbox');
  var lightboxImg = document.querySelector('.lightbox img');
  var lightboxClose = document.querySelector('.lightbox-close');
  if (galleryButtons.length && lightbox && lightboxImg) {
    galleryButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var fullSrc = btn.querySelector('img').getAttribute('src');
        var altText = btn.querySelector('img').getAttribute('alt');
        lightboxImg.setAttribute('src', fullSrc);
        lightboxImg.setAttribute('alt', altText);
        lightbox.classList.add('open');
      });
    });
    var closeLightbox = function () { lightbox.classList.remove('open'); };
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ---------- 5. Contact form validation ---------- */
  var form = document.querySelector('.contact-form');
  var status = document.getElementById('form-status');
  if (form) {
    var validators = {
      name: function (v) { return v.trim().length >= 2; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      phone: function (v) { return v.trim() === '' || /^[0-9+\s()-]{7,}$/.test(v.trim()); },
      message: function (v) { return v.trim().length >= 10; }
    };

    var validateField = function (field) {
      var name = field.name;
      if (!validators[name]) return true;
      var valid = validators[name](field.value);
      var wrapper = field.closest('.field');
      if (wrapper) wrapper.classList.toggle('error', !valid);
      return valid;
    };

    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
    });

    form.addEventListener('submit', function (e) {
      var fields = form.querySelectorAll('input[name], textarea[name]');
      var allValid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) {
        e.preventDefault();
        if (status) {
          status.textContent = 'Please fix the highlighted fields before sending.';
          status.className = 'show error';
        }
        return;
      }

      /* Progressive enhancement: if the browser supports fetch, submit
         to contact.php without a full page reload. If this fails (e.g.
         opened as a local file without a PHP server), the form falls
         back to a normal POST submission. */
      if (window.fetch) {
        e.preventDefault();
        var formData = new FormData(form);
        fetch(form.getAttribute('action'), {
          method: 'POST',
          body: formData
        }).then(function (response) {
          return response.text();
        }).then(function () {
          status.textContent = 'Thanks — your message has been sent. We\'ll reply within one business day.';
          status.className = 'show success';
          form.reset();
        }).catch(function () {
          status.textContent = 'Sorry, something went wrong sending your message. Please email or call us directly.';
          status.className = 'show error';
        });
      }
    });
  }

});
