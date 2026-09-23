// ===============================
// EASY CUSTOMIZATION
// Change the details below when you want to make this surprise even more yours.
// ===============================
const CONFIG = {
  name: 'Sarah Afreen',
  birthday: 'September 24',
  musicFile: 'audio/tum-ho-toh.mp3',
  musicTitle: 'Tum Ho Toh',
  photos: [
    'images/photo1.jpg',
    'images/photo2.jpg',
    'images/photo3.jpg',
    'images/photo4.jpg',
    'images/photo5.jpg',
    'images/photo6.jpg',
    'images/photo7.jpg',
    'images/photo8.jpg'
  ],
  timeline: [
    { year: 'Year 1', title: 'The Beginning ❤', text: 'The start of our favourite story. Replace this sentence with the memory that began everything.' },
    { year: 'Year 2', title: 'More Memories 🥹', text: 'The year we found a hundred new reasons to laugh. Add the little details only we remember.' },
    { year: 'Year 3', title: 'Crazy Moments 😂', text: 'Our funniest, most chaotic chapter. This is where your actual story can live.' },
    { year: 'Year 4', title: 'Everything We Experienced 🫶🏻', text: 'The easy days and the hard ones too. Somehow, we kept choosing us.' },
    { year: 'Year 5', title: 'Still Us ❤', text: 'Five years later, and you are still the person I want to tell everything to.' }
  ],
  nicknames: ['Kuftu ❤', 'Janiman 🫶🏻', 'Tarbuz 🍉😂', 'Shoni Moni 🥹❤'],
  letter: `Happy Birthday my Sarah Afreen ❤🎂

5 years… honestly, I still can’t believe it. 🥹 We’ve been through so many things together — countless laughs, stupid fights 😂, random conversations, beautiful memories, and moments that only we understand. Through all the ups and downs, you became such a special part of my life.

My Kuftu ❤, my Janiman 🫶🏻, my Tarbuz 🍉😂, my Shoni Moni 🥹❤ — you mean more to me than I can properly explain.

I just want to see you happy, smiling and achieving everything you dream of. No matter how much time passes, I’ll always be grateful for these 5 years and every memory we’ve made.

Happy Birthday, my favourite person. ❤🎂
I love you, Sarah. 🫶🏻`,
  finalMessage: `Sarah, after 5 years, you're still my favourite person. ❤

Five years down...

and so many more memories waiting to be made. 🥹❤

Happy Birthday, my Kuftu,
my Janiman,
my Tarbuz,
my Shoni Moni. ❤

I love you, Sarah Afreen. ❤🎂`
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const openingScreen = $('#opening-screen');
const siteContent = $('#site-content');
const music = $('#background-music');
const musicToggle = $('#music-toggle');

function createParticles() {
  const field = $('#particle-field');
  for (let index = 0; index < 34; index += 1) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * -8}s`;
    particle.style.animationDuration = `${6 + Math.random() * 8}s`;
    particle.style.opacity = `${0.18 + Math.random() * 0.45}`;
    field.appendChild(particle);
  }
}

function renderTimeline() {
  $('#timeline').innerHTML = CONFIG.timeline.map((item) => `
    <article class="timeline-item reveal">
      <div class="timeline-year">${item.year}</div>
      <div><h3>${item.title}</h3><p>${item.text}</p></div>
    </article>
  `).join('');
}

function renderGallery() {
  const gallery = $('#memory-gallery');
  gallery.innerHTML = CONFIG.photos.map((photo, index) => `
    <figure class="memory-card" data-image="${photo}" data-caption="Memory ${String(index + 1).padStart(2, '0')}">
      <img src="${photo}" alt="Our memory ${index + 1}" loading="lazy">
      <div class="memory-fallback" aria-hidden="true">photo ${index + 1}</div>
      <figcaption><span>Memory ${String(index + 1).padStart(2, '0')}</span><b>↗</b></figcaption>
    </figure>
  `).join('');

  $$('.memory-card', gallery).forEach((card) => {
    const image = $('img', card);
    image.addEventListener('error', () => card.classList.add('is-fallback'), { once: true });
    card.addEventListener('click', () => openLightbox(card));
  });
}

function renderNicknames() {
  $('#nickname-list').innerHTML = CONFIG.nicknames.map((nickname) => `<span class="nickname">${nickname}</span>`).join('');
}

function renderReasons() {
  const reasons = [
    ['❤ Your smile', 'It makes even ordinary days feel like something worth keeping.'],
    ['😂 Your crazy side', 'The best kind of chaos is the kind I get to laugh through with you.'],
    ['🥹 Your little reactions', 'I notice all of them. Yes, even the tiny dramatic ones.'],
    ['🫶🏻 The way you care', 'You make people feel held, and I am the luckiest person you care for.'],
    ['✨ The memories we share', 'There are whole worlds inside the stories only we can tell.'],
    ['❤ Simply... YOU', 'No grand reason needed. You are my favourite, exactly as you are.']
  ];
  $('#reasons-grid').innerHTML = reasons.map(([title, message]) => `
    <button class="reason-card" type="button"><h3>${title}</h3><p>${message}</p></button>
  `).join('');
  $$('.reason-card').forEach((card) => card.addEventListener('click', () => card.classList.toggle('is-open')));
}

function renderConfetti() {
  const confetti = $('#confetti');
  for (let index = 0; index < 38; index += 1) {
    const piece = document.createElement('i');
    piece.style.left = `${8 + Math.random() * 84}%`;
    piece.style.setProperty('--x', `${(Math.random() - 0.5) * 420}px`);
    piece.style.setProperty('--y', `${-80 - Math.random() * 340}px`);
    piece.style.animationDelay = `${Math.random() * .55}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    confetti.appendChild(piece);
  }
}

function showMainExperience() {
  openingScreen.classList.add('is-dismissed');
  siteContent.classList.add('is-visible');
  siteContent.setAttribute('aria-hidden', 'false');
  music.load();
  music.play().then(() => setMusicPlayingState(true)).catch(() => {
    setMusicPlayingState(false);
    musicToggle.setAttribute('aria-label', `Unable to play ${CONFIG.musicTitle}`);
  });
  window.setTimeout(() => $('#home').focus?.(), 900);
}

function setupRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (entry.target.classList.contains('nickname-wrap')) $$('.nickname', entry.target).forEach((item) => item.classList.add('is-visible'));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .14 });
  $$('.reveal').forEach((element) => observer.observe(element));
}

function setupHeader() {
  const header = $('.site-header');
  const sections = $$('main section[id]');
  const navLinks = $$('.main-nav a');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
    const current = sections.find((section) => window.scrollY >= section.offsetTop - 180)?.id || 'home';
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  }, { passive: true });
}

function openLightbox(card) {
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightbox-image');
  const fallback = $('#lightbox-fallback');
  const source = card.dataset.image;
  $('#lightbox-caption').textContent = card.dataset.caption;
  lightboxImage.alt = card.querySelector('img').alt;
  lightboxImage.classList.remove('is-hidden');
  fallback.classList.add('is-hidden');
  lightboxImage.src = source;
  lightboxImage.onerror = () => { lightboxImage.classList.add('is-hidden'); fallback.classList.remove('is-hidden'); };
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  $('#lightbox-close').focus();
}

function closeLightbox() {
  $('#lightbox').classList.remove('is-open');
  $('#lightbox').setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

async function toggleMusic() {
  if (music.paused) {
    try {
      await music.play();
      setMusicPlayingState(true);
    } catch {
      setMusicPlayingState(false);
      musicToggle.setAttribute('aria-label', `Unable to play ${CONFIG.musicTitle}`);
    }
  } else {
    music.pause();
    setMusicPlayingState(false);
  }
}

function setMusicPlayingState(isPlaying) {
  musicToggle.classList.toggle('is-playing', isPlaying);
  musicToggle.classList.toggle('music-celebration', isPlaying);
  musicToggle.setAttribute('aria-label', isPlaying ? `Pause ${CONFIG.musicTitle}` : `Play ${CONFIG.musicTitle}`);
  musicToggle.setAttribute('aria-pressed', String(isPlaying));
}

function openGift() {
  const stage = $('#gift-stage');
  if (stage.classList.contains('is-open')) return;
  stage.classList.add('is-open');
  $('#gift-button').disabled = true;
  window.setTimeout(() => stage.scrollIntoView({ behavior: 'smooth', block: 'center' }), 700);
}

function initialize() {
  music.src = CONFIG.musicFile;
  music.addEventListener('error', () => {
    musicToggle.setAttribute('aria-label', `Unable to play ${CONFIG.musicTitle}`);
  });
  $('#letter-content').textContent = CONFIG.letter;
  $('#final-message-text').textContent = CONFIG.finalMessage;
  createParticles();
  renderTimeline();
  renderGallery();
  renderNicknames();
  renderReasons();
  renderConfetti();
  setupRevealAnimations();
  setupHeader();

  $('#open-surprise').addEventListener('click', showMainExperience);
  musicToggle.addEventListener('click', toggleMusic);
  $('#gift-button').addEventListener('click', openGift);
  $('#lightbox-close').addEventListener('click', closeLightbox);
  $('#lightbox').addEventListener('click', (event) => { if (event.target.id === 'lightbox') closeLightbox(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });
}

document.addEventListener('DOMContentLoaded', initialize);
