/* ── Scroll-reveal ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── Reading progress bar ── */
const bar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  bar.style.width = progress + '%';
}, { passive: true });

/* ── Smart Video Audio Manager ── */
(function() {
  const allVideos = document.querySelectorAll('[data-managed-video]');
  let activeAudioVideo = null;

  allVideos.forEach(vid => {
    const maxTime = parseFloat(vid.dataset.maxTime);
    if (maxTime) {
      vid.addEventListener('timeupdate', () => {
        if (vid.currentTime >= maxTime) vid.currentTime = 0;
      });
    }
  });

  function muteAllExcept(exceptVid) {
    allVideos.forEach(v => {
      if (v !== exceptVid) {
        v.muted = true;
        const btn = v.closest('.video-wrap') && v.closest('.video-wrap').querySelector('[data-sound-btn]');
        if (btn) btn.setAttribute('data-playing', 'false');
      }
    });
  }

  function toggleSound(vid) {
    const wrap = vid.closest('.video-wrap');
    const btn = wrap && wrap.querySelector('[data-sound-btn]');
    if (vid.muted) {
      muteAllExcept(vid);
      vid.muted = false;
      activeAudioVideo = vid;
      if (btn) btn.setAttribute('data-playing', 'true');
    } else {
      vid.muted = true;
      activeAudioVideo = null;
      if (btn) btn.setAttribute('data-playing', 'false');
    }
  }

  document.querySelectorAll('[data-sound-btn]').forEach(btn => {
    btn.setAttribute('data-playing', 'false');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const vid = btn.closest('.video-wrap').querySelector('[data-managed-video]');
      if (vid) toggleSound(vid);
    });
  });

  const audioObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const vid = entry.target;
      if (!entry.isIntersecting && !vid.muted) {
        vid.muted = true;
        const wrap = vid.closest('.video-wrap');
        const btn = wrap && wrap.querySelector('[data-sound-btn]');
        if (btn) btn.setAttribute('data-playing', 'false');
        if (activeAudioVideo === vid) activeAudioVideo = null;
      }
    });
  }, { threshold: 0.3 });

  allVideos.forEach(vid => audioObserver.observe(vid));
})();
