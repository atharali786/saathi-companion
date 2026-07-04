/* =============================================
   Saathi – GenAI Travel Platform
   app.js – Full Application Logic + Gemini API
   ============================================= */

'use strict';

// ──────────────────────────────────────────────
// CONFIGURATION & STATE
// ──────────────────────────────────────────────

const CONFIG = {
  API_KEY_STORAGE: 'cq_gemini_key',
  MODEL: 'gemini-2.0-flash',
  API_BASE: 'https://generativelanguage.googleapis.com/v1beta/models',
};

const STATE = {
  apiKey: localStorage.getItem(CONFIG.API_KEY_STORAGE) || '',
  activeGemType: 'all',
  activeExpType: 'all',
  activeHeritageTab: 'sites',
  activeStoryStyle: 'epic',
  budgetLevel: 'Mid-Range',
  currentLoading: false,
};

// ──────────────────────────────────────────────
// POPULAR DESTINATIONS DATA
// ──────────────────────────────────────────────

const POPULAR_DESTINATIONS = [
  { name: 'Kyoto', country: 'Japan', emoji: '⛩️', tags: ['Temples', 'Zen', 'Cherry Blossoms'] },
  { name: 'Marrakech', country: 'Morocco', emoji: '🕌', tags: ['Souks', 'Riads', 'Sahara'] },
  { name: 'Varanasi', country: 'India', emoji: '🪔', tags: ['Spirituality', 'Ganges', 'Heritage'] },
  { name: 'Santorini', country: 'Greece', emoji: '🌊', tags: ['Islands', 'History', 'Cuisine'] },
  { name: 'Cusco', country: 'Peru', emoji: '🦙', tags: ['Inca', 'Machu Picchu', 'Andes'] },
  { name: 'Dubrovnik', country: 'Croatia', emoji: '🏰', tags: ['Old Town', 'Adriatic', 'Medieval'] },
  { name: 'Chiang Mai', country: 'Thailand', emoji: '🐘', tags: ['Festivals', 'Temples', 'Night Bazaar'] },
  { name: 'Havana', country: 'Cuba', emoji: '🎺', tags: ['Music', 'Architecture', 'Revolution'] },
  { name: 'Petra', country: 'Jordan', emoji: '🏛️', tags: ['Ancient', 'Desert', 'Nabataean'] },
  { name: 'Cape Town', country: 'South Africa', emoji: '🌍', tags: ['Nature', 'History', 'Wine'] },
];

const HERITAGE_HIGHLIGHTS_DATA = [
  { emoji: '🕌', title: 'Old City of Jerusalem', region: 'Middle East', desc: 'Sacred to three Abrahamic religions, a tapestry of history spanning 3,000 years.' },
  { emoji: '🏯', title: 'Imperial Palace, Beijing', region: 'China', desc: 'The Forbidden City held the Chinese Emperor for 500 years — 980 buildings of imperial splendor.' },
  { emoji: '🌺', title: 'Holi Festival', region: 'India', desc: 'The Festival of Colors celebrates the arrival of spring and the triumph of good over evil.' },
  { emoji: '🎭', title: 'Carnival of Venice', region: 'Italy', desc: 'Masquerades, gondolas, and 700 years of tradition in the floating city.' },
  { emoji: '🦁', title: 'Maasai Culture', region: 'East Africa', desc: 'Semi-nomadic warriors of the savanna with a rich oral tradition, beadwork, and ceremonies.' },
  { emoji: '🌊', title: 'Polynesian Navigation', region: 'Pacific Islands', desc: 'Ancient wayfinders crossed the Pacific guided by stars, ocean swells, and birds.' },
];

// ──────────────────────────────────────────────
// INIT ON DOM LOAD
// ──────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticles();
  initDestinationCards();
  initHeritageHighlights();
  initScrollReveal();
  initHeroSearch();
  updateApiStatus();

  // Show API modal on first visit if no key stored
  if (!STATE.apiKey) {
    setTimeout(() => openApiModal(), 1200);
  }
});

// ──────────────────────────────────────────────
// GEMINI API CALL
// ──────────────────────────────────────────────

async function callGemini(prompt, loadingText = 'Consulting Gemini AI...') {
  if (!STATE.apiKey) {
    openApiModal();
    showToast('Please add your Gemini API key to use AI features.', 'info');
    return null;
  }

  if (STATE.currentLoading) return null;
  STATE.currentLoading = true;

  showLoading(loadingText);

  const url = `${CONFIG.API_BASE}/${CONFIG.MODEL}:generateContent?key=${STATE.apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.85,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error('Empty response from Gemini');

    return text;
  } catch (err) {
    console.error('Gemini API error:', err);
    showToast(`AI Error: ${err.message}`, 'error');
    return null;
  } finally {
    STATE.currentLoading = false;
    hideLoading();
  }
}

// ──────────────────────────────────────────────
// NAVBAR
// ──────────────────────────────────────────────

function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });

  // Close mobile menu on nav link click
  navLinks?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('mobile-open'));
  });
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// ──────────────────────────────────────────────
// HERO PARTICLES
// ──────────────────────────────────────────────

function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const EMOJIS = ['✈️', '🌍', '🗺️', '⭐', '🏔️', '🌊', '🌺', '🏛️', '🎭', '🍜', '🎨', '🌙'];
  const COUNT = window.innerWidth < 768 ? 10 : 20;

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${Math.random() * 16 + 10}px;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: 0;
    `;
    container.appendChild(el);
  }
}

// ──────────────────────────────────────────────
// HERO SEARCH
// ──────────────────────────────────────────────

function initHeroSearch() {
  const input = document.getElementById('hero-search-input');
  const suggestions = document.getElementById('hero-suggestions');

  const SUGGESTIONS = [
    { icon: '🗾', text: 'Kyoto, Japan – Temples & Cherry Blossoms' },
    { icon: '🕌', text: 'Marrakech, Morocco – Medina & Sahara' },
    { icon: '🏛️', text: 'Athens, Greece – Ancient History' },
    { icon: '🎭', text: 'Rio de Janeiro, Brazil – Carnival & Culture' },
    { icon: '🌺', text: 'Bali, Indonesia – Temples & Rice Terraces' },
    { icon: '🦁', text: 'Serengeti, Tanzania – Safari & Maasai Culture' },
    { icon: '🏔️', text: 'Patagonia, Argentina – Wilderness & Adventure' },
    { icon: '🎶', text: 'Havana, Cuba – Music & Colonial Heritage' },
  ];

  input?.addEventListener('input', (e) => {
    const val = e.target.value.trim().toLowerCase();
    if (val.length < 2) {
      suggestions.classList.remove('open');
      return;
    }
    const filtered = SUGGESTIONS.filter(s => s.text.toLowerCase().includes(val));
    if (filtered.length === 0) {
      suggestions.classList.remove('open');
      return;
    }
    suggestions.innerHTML = filtered.map(s => `
      <div class="suggestion-item" onclick="selectSuggestion('${s.text.split(' –')[0]}')">
        <span>${s.icon}</span>
        <span>${s.text}</span>
      </div>
    `).join('');
    suggestions.classList.add('open');
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleHeroSearch();
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hero-search-wrapper')) {
      suggestions.classList.remove('open');
    }
  });
}

function selectSuggestion(value) {
  const input = document.getElementById('hero-search-input');
  const suggestions = document.getElementById('hero-suggestions');
  input.value = value;
  suggestions.classList.remove('open');
}

function handleHeroSearch() {
  const input = document.getElementById('hero-search-input');
  const val = input.value.trim();
  if (!val) {
    showToast('Please enter a destination to explore.', 'info');
    return;
  }
  // Pre-fill the discover section and scroll to it
  document.getElementById('discover-input').value = val;
  scrollToSection('discover');
  setTimeout(() => generateDestinationDiscovery(), 500);
}

// ──────────────────────────────────────────────
// DESTINATION CARDS
// ──────────────────────────────────────────────

function initDestinationCards() {
  const grid = document.getElementById('dest-cards-grid');
  if (!grid) return;

  grid.innerHTML = POPULAR_DESTINATIONS.map(dest => `
    <div class="dest-card reveal" onclick="quickExplore('${dest.name}, ${dest.country}')">
      <span class="dest-card-emoji">${dest.emoji}</span>
      <div class="dest-card-name">${dest.name}</div>
      <div class="dest-card-country">${dest.country}</div>
      <div class="dest-card-tags">
        ${dest.tags.map(t => `<span class="dest-tag">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function quickExplore(destination) {
  document.getElementById('discover-input').value = destination;
  scrollToSection('discover');
  setTimeout(() => generateDestinationDiscovery(), 600);
}

// ──────────────────────────────────────────────
// HERITAGE HIGHLIGHTS
// ──────────────────────────────────────────────

function initHeritageHighlights() {
  const container = document.getElementById('heritage-highlights');
  if (!container) return;

  container.innerHTML = HERITAGE_HIGHLIGHTS_DATA.map(h => `
    <div class="heritage-card reveal">
      <div class="heritage-card-emoji">${h.emoji}</div>
      <div class="heritage-card-title">${h.title}</div>
      <div class="heritage-card-region">📍 ${h.region}</div>
      <div class="heritage-card-desc">${h.desc}</div>
    </div>
  `).join('');
}

// ──────────────────────────────────────────────
// SCROLL REVEAL
// ──────────────────────────────────────────────

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = (entry.target.dataset.delay || 0) * 1000;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el, idx) => {
    el.dataset.delay = (idx % 6) * 0.08;
    observer.observe(el);
  });
}

// ──────────────────────────────────────────────
// AI FEATURE 1 – DESTINATION DISCOVERY
// ──────────────────────────────────────────────

async function generateDestinationDiscovery() {
  const destination = document.getElementById('discover-input').value.trim();
  const interests = document.getElementById('discover-interests').value.trim();
  const duration = document.getElementById('discover-duration').value;

  if (!destination) {
    showToast('Please enter a destination to discover.', 'info');
    document.getElementById('discover-input').focus();
    return;
  }

  const durationMap = { weekend: '2-3 days', week: '1 week', twoweeks: '2 weeks', month: '1 month' };
  const durationText = durationMap[duration] || '1 week';

  const prompt = `You are Saathi, the expert AI travel guide. A traveler wants to discover ${destination} for ${durationText}.
${interests ? `Their interests: ${interests}` : ''}

Generate a comprehensive, vivid destination discovery guide. Structure your response with these sections:

🌟 DESTINATION OVERVIEW
Write 2-3 sentences painting a vivid picture of what makes ${destination} unique and special.

🗺️ MUST-VISIT PLACES (list 6-8 top attractions with brief vivid descriptions)

🌿 LOCAL INSIDER TIPS (4-5 genuine local tips, not generic tourist advice)

🍽️ CULINARY HIGHLIGHTS (3-4 must-try local dishes/foods)

📅 BEST TIME TO VISIT
When to go and why, including weather and cultural events.

⚠️ CULTURAL SENSITIVITY
2-3 important cultural notes to travel respectfully.

💰 PRACTICAL INFO
Rough budget range, transport tips, accommodation types.

Make the content feel like advice from a well-traveled friend who truly knows and loves this destination. Be specific, vivid, and genuinely helpful.`;

  const output = document.getElementById('discover-output');
  setButtonLoading('discover-btn', true);

  const result = await callGemini(prompt, `Discovering ${destination}...`);
  setButtonLoading('discover-btn', false);

  if (!result) return;

  output.innerHTML = `<div class="ai-response">${formatAIResponse(result)}</div>`;
  showToast(`✦ ${destination} guide ready!`, 'success');
}

// ──────────────────────────────────────────────
// AI FEATURE 2 – HIDDEN GEMS
// ──────────────────────────────────────────────

async function generateHiddenGems() {
  const region = document.getElementById('gems-input').value.trim();
  const activeChip = document.querySelector('#gem-type-chips .filter-chip.active');
  const gemType = activeChip?.dataset.value || 'all';

  if (!region) {
    showToast('Please enter a region or country.', 'info');
    document.getElementById('gems-input').focus();
    return;
  }

  const typeFilter = gemType !== 'all' ? `Focus specifically on ${gemType}-type hidden gems.` : '';

  const prompt = `You are a secret-keeper of travel — a specialist in hidden gems that most tourists never discover. 

Find 8 genuinely hidden gems in ${region}. ${typeFilter}

For EACH hidden gem, provide:
- A catchy name
- What type of place it is (nature spot, village, ruins, food spot, etc.)
- Why it's special and what makes it a "hidden gem"
- The best way to get there
- A secret insider tip
- Rarity level (Rare Find / Secret Local / Off the Map)

Make each gem feel like a personal discovery. Avoid famous tourist sites. Focus on authentic, lesser-known wonders — small villages, secret beaches, forgotten ruins, family-run restaurants, underground art scenes, spiritual spots known only to locals.

Format each gem clearly with its name, rarity, description, and tip.`;

  const output = document.getElementById('gems-output');
  setButtonLoading('gems-btn', true);

  const result = await callGemini(prompt, `Uncovering hidden gems in ${region}...`);
  setButtonLoading('gems-btn', false);

  if (!result) return;

  output.innerHTML = `<div class="ai-response">${formatGemsResponse(result, region)}</div>`;
  showToast(`💎 Hidden gems of ${region} uncovered!`, 'success');
}

function formatGemsResponse(text, region) {
  return `
    <h3>💎 Hidden Gems of ${region}</h3>
    <div class="gems-grid">
      ${parseGemsFromText(text)}
    </div>
  `;
}

function parseGemsFromText(text) {
  // Split text by numbered items or dashes and create gem cards
  const sections = text.split(/\n(?=\d+\.|##|###|\*\*[A-Z])/g).filter(s => s.trim().length > 50);

  if (sections.length < 2) {
    // Fallback: display as formatted text
    return `<div style="grid-column: 1/-1">${simpleFormat(text)}</div>`;
  }

  const rarityOptions = ['Rare Find', 'Secret Local', 'Off the Map'];
  const gemEmojis = ['🏔️', '🌊', '🏘️', '🌺', '🏛️', '🍜', '🎨', '🌿', '🏕️', '💧'];

  return sections.slice(0, 8).map((section, i) => {
    const lines = section.trim().split('\n').filter(l => l.trim());
    const title = lines[0].replace(/^[\d#\*\.\-\s]+/, '').replace(/\*\*/g, '').trim() || `Hidden Gem ${i + 1}`;
    const body = lines.slice(1).join(' ').replace(/\*\*/g, '').trim();
    const rarity = rarityOptions[i % 3];
    const emoji = gemEmojis[i % gemEmojis.length];
    const rarityClass = rarity === 'Rare Find' ? 'rare' : 'hidden';

    return `
      <div class="gem-item">
        <div class="gem-item-header">
          <span class="gem-emoji">${emoji}</span>
          <span class="gem-name">${title.substring(0, 40)}</span>
          <span class="gem-rarity ${rarityClass}">${rarity}</span>
        </div>
        <p>${body.substring(0, 220)}${body.length > 220 ? '...' : ''}</p>
      </div>
    `;
  }).join('');
}

// ──────────────────────────────────────────────
// AI FEATURE 3 – IMMERSIVE STORYTELLING
// ──────────────────────────────────────────────

async function generateStory() {
  const destination = document.getElementById('story-destination').value.trim();
  const activeStyle = document.querySelector('#story-style-selector .style-btn.active');
  const style = activeStyle?.dataset.style || 'epic';

  if (!destination) {
    showToast('Please enter a destination for your story.', 'info');
    document.getElementById('story-destination').focus();
    return;
  }

  const styleMap = {
    epic: 'Write as an epic historical narrative — dramatic, vivid, and sweeping. Focus on battles, empires, rulers, and the forces that shaped this place.',
    mystical: 'Write as a mystical tale full of legends, folklore, spirits, and sacred traditions. Use lyrical, atmospheric language.',
    cultural: 'Write as a cultural immersion journey — exploring the people, their daily lives, customs, art, music, and the living spirit of the place.',
    foodie: 'Write as a culinary adventure story — exploring the history of the cuisine, legendary dishes, night markets, ancient recipes, and the flavors that define the culture.',
  };

  const styleInstruction = styleMap[style] || styleMap.cultural;

  const prompt = `You are a master travel storyteller crafting an immersive narrative for Saathi (a GenAI travel companion). 

Write a captivating, deeply immersive 600-800 word story about ${destination}.

${styleInstruction}

Structure the story with:
- A powerful, evocative title
- An opening that immediately transports the reader
- 3-4 vivid narrative chapters/sections, each with a subtitle
- Rich sensory details (what you see, hear, smell, taste, feel)
- Authentic cultural elements, historical facts, and local color
- A memorable closing that leaves the reader longing to visit

Make this feel like literary travel writing — not a guide, but an experience. Transport the reader completely.`;

  const output = document.getElementById('story-output');
  setButtonLoading('story-btn', true);

  const result = await callGemini(prompt, `Weaving the story of ${destination}...`);
  setButtonLoading('story-btn', false);

  if (!result) return;

  output.innerHTML = `<div class="story-text">${formatStory(result)}</div>`;
  showToast(`📖 Story of ${destination} ready!`, 'success');
}

function formatStory(text) {
  const lines = text.split('\n').filter(l => l.trim());
  let html = '';
  let inContent = false;

  lines.forEach((line, i) => {
    const clean = line.replace(/\*\*/g, '').replace(/##\s*/g, '').trim();
    if (!clean) return;

    if (i === 0 || (!inContent && clean.length < 80)) {
      html += `<div class="story-title">${clean}</div>`;
      inContent = true;
    } else if (clean.length < 60 && (line.startsWith('#') || line.startsWith('**') || /^[A-Z][A-Za-z\s:]+$/.test(clean))) {
      html += `<div class="chapter">${clean}</div>`;
    } else {
      html += `<p class="story-paragraph">${clean}</p>`;
    }
  });

  return html;
}

// ──────────────────────────────────────────────
// AI FEATURE 4 – HERITAGE SUMMARY
// ──────────────────────────────────────────────

async function generateHeritageSummary() {
  const region = document.getElementById('heritage-input').value.trim();
  const activeTab = STATE.activeHeritageTab;

  if (!region) {
    showToast('Please enter a country or region.', 'info');
    document.getElementById('heritage-input').focus();
    return;
  }

  const tabFocus = {
    sites: 'UNESCO World Heritage Sites, ancient monuments, and architectural wonders',
    traditions: 'living cultural traditions, ceremonies, festivals, and indigenous practices',
    art: 'traditional arts, crafts, textiles, visual arts, and artisan traditions',
    cuisine: 'culinary heritage, traditional foods, cooking methods, and gastronomic culture',
    music: 'traditional music, dance forms, instruments, and performing arts heritage',
  };

  const focus = tabFocus[activeTab] || tabFocus.sites;

  const prompt = `You are a cultural heritage expert for Saathi. Provide a rich, authoritative guide to the ${focus} of ${region}.

Include:
1. OVERVIEW: A compelling introduction to the cultural heritage of ${region} in this category (2-3 sentences)

2. TOP HERITAGE HIGHLIGHTS (5-7 specific items with detailed descriptions):
   - Name and what it is
   - Historical or cultural significance  
   - Why it matters today
   - Where visitors can experience it

3. DID YOU KNOW? (2-3 fascinating, surprising facts)

4. HOW TO EXPERIENCE IT AUTHENTICALLY:
   Practical advice for travelers to engage with this heritage respectfully and deeply.

5. PRESERVATION STATUS:
   Brief note on efforts to preserve this heritage.

Be specific, informative, and passionate about the cultural importance.`;

  const output = document.getElementById('heritage-output');
  setButtonLoading('heritage-btn', true);

  const result = await callGemini(prompt, `Exploring heritage of ${region}...`);
  setButtonLoading('heritage-btn', false);

  if (!result) return;

  output.innerHTML = `<div class="ai-response">${formatAIResponse(result)}</div>`;
  showToast(`🏛️ Heritage of ${region} revealed!`, 'success');
}

function switchHeritageTab(btn) {
  document.querySelectorAll('#heritage-tabs .heritage-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  STATE.activeHeritageTab = btn.dataset.tab;
}

// ──────────────────────────────────────────────
// AI FEATURE 5 – LOCAL EVENTS & ACTIVITIES
// ──────────────────────────────────────────────

async function generateLocalEvents() {
  const destination = document.getElementById('events-destination').value.trim();
  const month = document.getElementById('events-month').value;
  const eventType = document.getElementById('events-type').value;

  if (!destination) {
    showToast('Please enter a destination.', 'info');
    document.getElementById('events-destination').focus();
    return;
  }

  const typeFilter = eventType !== 'all' ? `Focus specifically on ${eventType}.` : 'Cover all types of events and activities.';

  const prompt = `You are a local events expert for Saathi. A traveler is visiting ${destination} in ${month}.

${typeFilter}

Generate a comprehensive local events and activities guide. Include:

1. SIGNATURE EVENTS IN ${month.toUpperCase()} (4-5 specific events):
   For each event provide: Event name, approximate dates, description, cultural significance, participation tips

2. ONGOING LOCAL ACTIVITIES (5-6 regular activities available):
   Markets, performances, classes, tours, etc. that run regularly

3. SEASONAL HIGHLIGHTS:
   What's special about visiting in ${month} specifically

4. HIDDEN HAPPENINGS:
   2-3 events or activities only locals know about

5. BOOKING TIPS:
   Practical advice for participating in these activities

Make it feel like insider knowledge from a local who loves sharing their culture with visitors. Be specific with names and descriptions.`;

  const output = document.getElementById('events-output');
  setButtonLoading('events-btn', true);

  const result = await callGemini(prompt, `Finding events in ${destination} for ${month}...`);
  setButtonLoading('events-btn', false);

  if (!result) return;

  output.innerHTML = `<div class="ai-response">${formatEventsResponse(result, destination, month)}</div>`;
  showToast(`🎉 Events in ${destination} found!`, 'success');
}

function formatEventsResponse(text, destination, month) {
  return `
    <h3>🎉 ${destination} in ${month}</h3>
    ${formatAIResponse(text)}
  `;
}

// ──────────────────────────────────────────────
// AI FEATURE 6 – AUTHENTIC EXPERIENCES
// ──────────────────────────────────────────────

async function generateAuthenticExperiences() {
  const destination = document.getElementById('exp-destination').value.trim();
  const activeChip = document.querySelector('#exp-type-chips .filter-chip.active');
  const expType = activeChip?.dataset.value || 'all';
  const budget = STATE.budgetLevel;

  if (!destination) {
    showToast('Please enter a destination.', 'info');
    document.getElementById('exp-destination').focus();
    return;
  }

  const typeFilter = expType !== 'all' ? `Focus on ${expType}-type experiences.` : '';

  const prompt = `You are an authentic travel experiences curator for Saathi. A traveler wants genuinely authentic cultural experiences in ${destination}.

Budget level: ${budget}
${typeFilter}

Create a curated guide to authentic experiences:

1. TOP AUTHENTIC EXPERIENCES (6-8 experiences):
For each provide:
   - Experience name and type (cooking class, homestay, craft workshop, etc.)
   - What you'll do and learn
   - Who runs it (local family, community group, artisan)
   - Typical price range for ${budget} budget
   - Duration
   - Why it's genuinely authentic (not touristy)
   - How to find/book it

2. CONNECTING WITH LOCALS:
   3-4 specific tips for genuine human connection

3. CULTURAL EXCHANGE ETIQUETTE:
   How to be a respectful and meaningful cultural guest

4. GIVING BACK:
   Ways to support local communities and sustainable cultural tourism

Make these feel like life-changing travel moments, not tourist packages. Emphasize genuine connection over consumption.`;

  const output = document.getElementById('exp-output');
  setButtonLoading('exp-btn', true);

  const result = await callGemini(prompt, `Finding authentic experiences in ${destination}...`);
  setButtonLoading('exp-btn', false);

  if (!result) return;

  output.innerHTML = `<div class="ai-response">${formatAIResponse(result)}</div>`;
  showToast(`🤝 Experiences in ${destination} ready!`, 'success');
}

function updateBudgetLabel(value) {
  const labels = { 1: 'Budget', 2: 'Mid-Range', 3: 'Luxury' };
  STATE.budgetLevel = labels[value] || 'Mid-Range';
  document.getElementById('budget-label').textContent = STATE.budgetLevel;

  // Update slider gradient
  const slider = document.getElementById('exp-budget');
  const pct = ((value - 1) / 2) * 100;
  slider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${pct}%, var(--bg-elevated) ${pct}%)`;
}

// ──────────────────────────────────────────────
// AI FEATURE 7 – DESTINATION COMPARISON
// ──────────────────────────────────────────────

async function generateComparison() {
  const destA = document.getElementById('compare-a').value.trim();
  const destB = document.getElementById('compare-b').value.trim();

  if (!destA || !destB) {
    showToast('Please enter both destinations to compare.', 'info');
    return;
  }

  const prompt = `You are Saathi, the expert travel comparison system. Compare ${destA} vs ${destB} side by side.

Provide a detailed comparison across these categories:

📊 COMPARISON OVERVIEW
Brief intro on what makes each destination unique.

For EACH category below, give specific scores and analysis for BOTH destinations:

🌍 CULTURAL RICHNESS
- Historical depth
- UNESCO sites
- Living traditions

🍽️ FOOD & CUISINE
- Culinary diversity
- Street food scene
- Signature dishes

👥 AUTHENTIC EXPERIENCE
- Ease of connecting with locals
- Cultural immersion opportunities
- Authenticity vs. tourism level

💰 VALUE FOR MONEY
- Accommodation costs
- Food costs  
- Activities costs

🌤️ CLIMATE & BEST TIME
- Weather overview
- Peak season
- Best months to visit

🎉 EVENTS & FESTIVALS
- Major annual events
- Cultural celebrations
- Night life & entertainment

🏆 VERDICT
Which destination is better for: history buffs, foodies, adventure seekers, families, budget travelers, luxury travelers?

Be specific, fair, and genuinely helpful for making a decision.`;

  const output = document.getElementById('compare-output');
  setButtonLoading('compare-btn', true);

  const result = await callGemini(prompt, `Comparing ${destA} vs ${destB}...`);
  setButtonLoading('compare-btn', false);

  if (!result) return;

  output.innerHTML = `<div class="ai-response">
    <div class="compare-grid">
      <div class="compare-col">
        <div class="compare-col-title">🌍 ${destA}</div>
        ${formatAIResponse(extractDestSection(result, destA))}
      </div>
      <div class="compare-col">
        <div class="compare-col-title">🌍 ${destB}</div>
        ${formatAIResponse(extractDestSection(result, destB))}
      </div>
    </div>
    <h4>🏆 AI Verdict</h4>
    ${formatAIResponse(result)}
  </div>`;

  showToast(`⚖️ Comparison ready!`, 'success');
}

function extractDestSection(text, dest) {
  // Try to extract relevant section; fallback to full text summary
  const lines = text.split('\n');
  const relevant = lines.filter(l => l.toLowerCase().includes(dest.toLowerCase().split(',')[0]));
  return relevant.length > 2 ? relevant.join('\n') : text.substring(0, 400);
}

// ──────────────────────────────────────────────
// AI FEATURE 8 – CULTURAL ITINERARY
// ──────────────────────────────────────────────

async function generateItinerary() {
  const destination = document.getElementById('itin-dest').value.trim();
  const days = document.getElementById('itin-days').value;
  const style = document.getElementById('itin-style').value;
  const group = document.getElementById('itin-group').value;

  if (!destination) {
    showToast('Please enter a destination.', 'info');
    document.getElementById('itin-dest').focus();
    return;
  }

  const prompt = `You are Saathi, the master itinerary builder. Create a detailed ${days}-day cultural travel itinerary for ${destination}.

Travel style: ${style}
Travel group: ${group}

Create a day-by-day itinerary with this structure for each day:

DAY [N]: [Themed Day Title]
Morning: [2-3 specific activities with timing]
Afternoon: [2-3 specific activities with timing]
Evening: [1-2 specific activities/dining with timing]
Cultural Highlight: [One special cultural moment or insight for this day]
Local Tip: [One insider tip specific to this day's experiences]

Important guidelines:
- Mix must-see attractions with hidden gems
- Include specific restaurant recommendations for local food
- Include authentic cultural interactions (not just sightseeing)
- Consider logistics and geography (nearby locations on same day)
- For ${group}: tailor activities appropriately
- For ${style} style: prioritize accordingly

After the daily breakdown, add:
🎒 PACKING ESSENTIALS for this trip
💡 TOP 3 CULTURAL EXPERIENCES NOT TO MISS
📱 USEFUL APPS & RESOURCES for ${destination}`;

  const output = document.getElementById('itin-output');
  setButtonLoading('itin-btn', true);

  const result = await callGemini(prompt, `Building your ${days}-day itinerary for ${destination}...`);
  setButtonLoading('itin-btn', false);

  if (!result) return;

  output.innerHTML = `<div class="ai-response">${formatItinerary(result, destination, days)}</div>`;
  showToast(`📋 ${days}-day itinerary for ${destination} ready!`, 'success');
}

function formatItinerary(text, destination, days) {
  const lines = text.split('\n').filter(l => l.trim());
  let html = `<h3>📋 ${days}-Day Cultural Journey: ${destination}</h3>`;
  let currentDayHtml = '';
  let inDay = false;

  lines.forEach(line => {
    const clean = line.replace(/\*\*/g, '').trim();
    if (!clean) return;

    if (/^DAY\s+\d+:/i.test(clean) || /^\d+\.\s+DAY/i.test(clean)) {
      if (inDay && currentDayHtml) {
        html += `<div class="itin-day-body">${currentDayHtml}</div></div>`;
        currentDayHtml = '';
      }
      const dayNum = clean.match(/\d+/)?.[0] || '1';
      const dayTitle = clean.replace(/^(DAY\s*\d+:?|\d+\.\s*DAY\s*\d+:?)/i, '').trim();
      html += `
        <div class="itin-day">
          <div class="itin-day-header">
            <div class="itin-day-num">${dayNum}</div>
            <div class="itin-day-title">${dayTitle || `Day ${dayNum}`}</div>
          </div>
      `;
      inDay = true;
    } else if (inDay) {
      if (clean.startsWith('Morning:') || clean.startsWith('Afternoon:') || clean.startsWith('Evening:')) {
        currentDayHtml += `<div style="margin-bottom:6px"><strong style="color:var(--text-accent)">${clean.split(':')[0]}:</strong> ${clean.split(':').slice(1).join(':')}</div>`;
      } else if (clean.startsWith('Cultural Highlight:') || clean.startsWith('Local Tip:')) {
        currentDayHtml += `<div class="tip-box">${clean}</div>`;
      } else {
        currentDayHtml += `<p>${clean}</p>`;
      }
    } else {
      html += `<p>${clean}</p>`;
    }
  });

  if (inDay && currentDayHtml) {
    html += `<div class="itin-day-body">${currentDayHtml}</div></div>`;
  }

  return html;
}

// ──────────────────────────────────────────────
// AI FEATURE 9 – CULTURAL ETIQUETTE
// ──────────────────────────────────────────────

async function generateEtiquette() {
  const culture = document.getElementById('etiquette-input').value.trim();

  if (!culture) {
    showToast('Please enter a country or culture.', 'info');
    document.getElementById('etiquette-input').focus();
    return;
  }

  const prompt = `You are Saathi, the expert cultural etiquette advisor. Create a comprehensive cultural travel guide for visitors to ${culture}.

Organize your response into these clear sections:

✅ CULTURAL DOS (8-10 specific things travelers SHOULD do)
- Be specific and actionable

❌ CULTURAL DON'TS (8-10 specific things travelers MUST AVOID)  
- Explain WHY each is important

👗 DRESS CODE
- What to wear in different settings (temples, restaurants, beaches, everyday)
- Specific items to pack or avoid
- Gender-specific guidance if relevant

🗣️ LANGUAGE & COMMUNICATION TIPS
- Essential phrases in the local language with pronunciation
- Communication style (direct vs. indirect, eye contact norms, etc.)
- Gestures to avoid

🕌 RELIGIOUS & SACRED CUSTOMS
- Major religious practices visitors should know
- How to behave at religious sites
- Religious calendar considerations

🍽️ DINING ETIQUETTE
- How to eat (hands, utensils, seating customs)
- Tipping culture
- Common dining customs

🤝 SOCIAL CUSTOMS
- Greeting customs
- Gift giving
- Business vs. personal interactions

Be specific, warm in tone, and help travelers feel confident and respectful.`;

  const output = document.getElementById('etiquette-output');
  setButtonLoading('etiquette-btn', true);

  const result = await callGemini(prompt, `Preparing cultural guide for ${culture}...`);
  setButtonLoading('etiquette-btn', false);

  if (!result) return;

  output.innerHTML = `<div class="ai-response">${formatEtiquette(result, culture)}</div>`;
  showToast(`🙏 Cultural guide for ${culture} ready!`, 'success');
}

function formatEtiquette(text, culture) {
  return `
    <h3>🙏 Cultural Etiquette Guide: ${culture}</h3>
    ${formatAIResponse(text)}
  `;
}

// ──────────────────────────────────────────────
// FORMAT HELPERS
// ──────────────────────────────────────────────

function formatAIResponse(text) {
  if (!text) return '';

  const lines = text.split('\n');
  let html = '';
  let inList = false;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      return;
    }

    // Remove markdown bold markers for display
    const clean = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Heading detection
    if (/^#{1,3}\s/.test(trimmed)) {
      if (inList) { html += '</ul>'; inList = false; }
      const headingText = trimmed.replace(/^#{1,3}\s+/, '');
      html += `<h4>${formatEmoji(headingText)}</h4>`;
    }
    // Section headers (ALL CAPS or with emoji prefix)
    else if (/^[🌟🗺️🌿🍽️📅⚠️💰✅❌👗🗣️🕌🤝💡🎒📱🏆📊🌍👥💎🎉🤝🙏🎭🌺🏛️🌊🦁🎵🏔️⭐]/u.test(trimmed) || /^[A-Z\s]{6,}$/.test(trimmed.replace(/[^A-Z\s]/g, ''))) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h4>${clean}</h4>`;
    }
    // List items
    else if (/^[-•*]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      const itemText = trimmed.replace(/^[-•*\d]+\.?\s+/, '');
      html += `<li>${itemText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`;
    }
    // Tip/note boxes
    else if (/^(Tip:|Note:|Important:|Warning:|Remember:|Pro tip:)/i.test(trimmed)) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<div class="tip-box">${clean}</div>`;
    }
    // Regular paragraph
    else {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<p>${clean}</p>`;
    }
  });

  if (inList) html += '</ul>';
  return html;
}

function formatEmoji(text) {
  return text;
}

function simpleFormat(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

// ──────────────────────────────────────────────
// UI HELPERS
// ──────────────────────────────────────────────

function toggleChip(chip, groupId) {
  // Single select behavior
  document.querySelectorAll(`#${groupId} .filter-chip`).forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
}

function selectStyle(btn) {
  document.querySelectorAll('#story-style-selector .style-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  STATE.activeStoryStyle = btn.dataset.style;
}

function setButtonLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  if (loading) {
    btn.classList.add('loading');
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = `<span class="btn-icon">⌛</span> Generating...`;
  } else {
    btn.classList.remove('loading');
    if (btn.dataset.originalText) btn.innerHTML = btn.dataset.originalText;
  }
}

function showLoading(text = 'Consulting Gemini AI...') {
  const overlay = document.getElementById('ai-loading');
  const textEl = document.getElementById('loading-text');
  if (overlay) overlay.style.display = 'flex';
  if (textEl) textEl.textContent = text;
}

function hideLoading() {
  const overlay = document.getElementById('ai-loading');
  if (overlay) overlay.style.display = 'none';
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: '💡' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '📢'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ──────────────────────────────────────────────
// API KEY MANAGEMENT
// ──────────────────────────────────────────────

function openApiModal() {
  const modal = document.getElementById('api-modal');
  if (modal) {
    modal.style.display = 'flex';
    // Pre-fill if key exists
    const input = document.getElementById('api-key-input');
    if (input && STATE.apiKey) input.value = STATE.apiKey;
  }
}

function closeApiModal() {
  const modal = document.getElementById('api-modal');
  if (modal) modal.style.display = 'none';
}

function saveApiKey() {
  const input = document.getElementById('api-key-input');
  const key = input?.value.trim();

  if (!key || key.length < 20) {
    showToast('Please enter a valid API key.', 'error');
    return;
  }

  STATE.apiKey = key;
  localStorage.setItem(CONFIG.API_KEY_STORAGE, key);
  updateApiStatus();
  closeApiModal();
  showToast('✨ Gemini AI activated! All features unlocked.', 'success');
}

function toggleKeyVisibility() {
  const input = document.getElementById('api-key-input');
  const btn = document.getElementById('key-toggle-btn');
  if (input) {
    input.type = input.type === 'password' ? 'text' : 'password';
    if (btn) btn.textContent = input.type === 'password' ? '👁️' : '🙈';
  }
}

function updateApiStatus() {
  const dot = document.getElementById('api-status-dot');
  const label = document.getElementById('api-status-label');

  if (STATE.apiKey) {
    dot?.classList.remove('not-configured');
    dot?.classList.add('configured');
    if (label) label.textContent = 'AI Active';
  } else {
    dot?.classList.remove('configured');
    dot?.classList.add('not-configured');
    if (label) label.textContent = 'Configure AI';
  }
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('api-modal');
  if (e.target === modal) closeApiModal();
});

// Keyboard shortcut: Escape to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeApiModal();
});

// ──────────────────────────────────────────────
// SMOOTH SCROLL POLYFILL FOR SAFARI
// ──────────────────────────────────────────────

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ──────────────────────────────────────────────
// PERFORMANCE: LAZY REVEAL OBSERVER FOR SECTIONS
// ──────────────────────────────────────────────

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.feature-section').forEach(section => {
  section.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  sectionObserver.observe(section);
});

// ──────────────────────────────────────────────
// EASTER EGG: KONAMI CODE
// ──────────────────────────────────────────────

(function() {
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;
  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[idx]) {
      idx++;
      if (idx === KONAMI.length) {
        showToast('🌟 Secret Traveler Mode Unlocked! The world is yours to explore.', 'success');
        document.body.style.filter = 'hue-rotate(30deg)';
        setTimeout(() => document.body.style.filter = '', 3000);
        idx = 0;
      }
    } else {
      idx = 0;
    }
  });
})();

console.log('%cSaathi 🌍', 'font-size:24px;color:#6c63ff;font-weight:bold;');
console.log('%cSaathi: Your traveller Companion', 'font-size:14px;color:#94a3b8;');
console.log('%cPowered by Google Gemini AI', 'font-size:12px;color:#4ecdc4;');
