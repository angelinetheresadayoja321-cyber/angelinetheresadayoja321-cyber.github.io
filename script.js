/* =========================================================
   Angeline Dayoja - Portfolio scripts
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Email (put together here so spam bots can't read it easily) ---------- */
  var EMAIL_USER = "angelinetheresadayoja321";
  var EMAIL_DOMAIN = "gmail.com";
  var email = EMAIL_USER + "@" + EMAIL_DOMAIN;
  var subject = encodeURIComponent("Hi Angeline, I'd like to talk about customer support");

  document.querySelectorAll(".js-email").forEach(function (link) {
    link.href = "mailto:" + email + "?subject=" + subject;
  });
  document.querySelectorAll(".js-email-text").forEach(function (el) {
    el.textContent = email;
  });

  var toast = document.getElementById("copy-toast");
  document.querySelectorAll(".js-copy-email").forEach(function (btn) {
    btn.addEventListener("click", function () {
      copyText(email).then(
        function () { showToast("Copied! ✓"); },
        function () { showToast(email); }
      );
    });
  });

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "absolute";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(area);
      ok ? resolve() : reject();
    });
  }

  var toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.textContent = ""; }, 2500);
  }

  /* ---------- Photo: show "AD" placeholder until assets/photo.jpg exists ---------- */
  var photo = document.getElementById("profile-photo");
  if (photo) {
    var frame = photo.parentElement;
    var markMissing = function () { frame.classList.add("no-photo"); };
    photo.addEventListener("error", markMissing);
    if (photo.complete && photo.naturalWidth === 0) markMissing();
  }

  /* ---------- Voice intro: show "coming soon" until assets/voice-intro.mp3 exists ---------- */
  var audio = document.getElementById("voice-audio");
  if (audio) {
    var player = audio.closest(".voice-player");
    var missing = document.getElementById("voice-missing");
    var source = audio.querySelector("source");
    var hideAudio = function () {
      audio.hidden = true;
      if (missing) missing.hidden = false;
    };
    if (source) source.addEventListener("error", hideAudio);
    audio.addEventListener("error", hideAudio);
    audio.addEventListener("play", function () { player.classList.add("is-playing"); });
    audio.addEventListener("pause", function () { player.classList.remove("is-playing"); });
    audio.addEventListener("ended", function () { player.classList.remove("is-playing"); });
  }

  /* ---------- Header border on scroll ---------- */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Hero chat: messages appear one by one ---------- */
  var chat = document.getElementById("hero-chat");
  if (chat && !reduceMotion) {
    var bubbles = Array.prototype.slice.call(chat.querySelectorAll(".bubble"));
    bubbles.forEach(function (b) { b.classList.add("is-waiting"); });

    var i = 0;
    var showNext = function () {
      if (i >= bubbles.length) return;
      var bubble = bubbles[i];
      var isIncoming = bubble.classList.contains("bubble-in");

      var typing = document.createElement("div");
      typing.className = "typing" + (isIncoming ? " from-in" : "");
      typing.setAttribute("aria-hidden", "true");
      typing.innerHTML = "<span></span><span></span><span></span>";
      chat.insertBefore(typing, bubble);

      // Longer messages "type" a little longer
      var typingTime = Math.min(1600, 500 + bubble.textContent.length * 12);
      setTimeout(function () {
        chat.removeChild(typing);
        bubble.classList.remove("is-waiting");
        bubble.classList.add("is-shown");
        i++;
        setTimeout(showNext, 450);
      }, typingTime);
    };
    setTimeout(showNext, 700);
  }
})();
