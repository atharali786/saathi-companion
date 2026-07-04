/**
 * Saathi: Your Traveller Companion
 * Mock AI Data & Fallback Template Generator
 * Used for Demo Mode & Graceful API Failures
 */

window.SaathiMockData = (() => {
  // Pre-compiled high-quality mock data for popular destinations
  const popularData = {
    paris: {
      discovery: `### 🗼 Welcome to Paris, France
Paris is a global center for art, fashion, gastronomy, and culture. Beyond its iconic landmarks, the city is a tapestry of historic quarters, secret courtyards, and rich cultural traditions.

#### 🏛️ Top Must-Visit Places
1. **The Louvre Museum**: The world's largest art museum, hosting masterpieces like the Mona Lisa.
2. **Montmartre & Sacré-Cœur**: A historic hill filled with artists' studios, cobblestone streets, and a majestic basilica.
3. **Sainte-Chapelle**: Famous for its stunning 13th-century stained glass windows.

#### 💡 Local Insider Tips
- Skip the Eiffel Tower elevator lines by climbing the stairs to the second floor.
- Avoid restaurants directly surrounding major monuments; walk 3-4 blocks into local neighborhoods for authentic bistro food.
- Always greet shopkeepers with a polite *"Bonjour"* before speaking.

#### 📅 Best Time to Visit
- **Spring (April-May)** or **Autumn (September-October)** for mild weather and fewer crowds.

#### 🥐 Gastronomy & Culture
- Enjoy fresh croissants from a local *boulangerie* and spend an afternoon people-watching at a sidewalk café.`,
      gems: `### 💎 Hidden Gems of Paris

#### 1. La Coulée Verte (Promenade Plantée)
* **What it is**: A beautiful elevated parkway built on an old railway line, 10 meters above the busy streets.
* **Why visit**: It offers a peaceful green escape and unique architectural views of the city.

#### 2. Musée de la Chasse et de la Nature
* **What it is**: An eccentric, beautifully curated museum dedicated to hunting and nature in the heart of the Marais.
* **Why visit**: A fascinating mix of antique taxidermy, contemporary art, and historic weaponry.

#### 3. Arènes de Lutèce
* **What it is**: A hidden Roman amphitheater dating back to the 1st century AD, tucked away in the Latin Quarter.
* **Why visit**: Locals gather here to play pétanque or read; it is a perfect spot for quiet reflection.`,
      story: `### 📖 The Echoes of Paris: A Cultural Narrative

#### Chapter 1: The Stones of Lutétia
Long before Paris was the "City of Light," it was a Roman muddy settlement named Lutétia. The Roman amphitheater, *Arènes de Lutèce*, still stands as a silent witness to gladiators and theatrical plays that took place two thousand years ago. 

#### Chapter 2: The Bohemian Spirit of Montmartre
In the late 19th century, a windswept hill covered in vineyards became the birthplace of modern art. Writers, painters, and rebels gathered at the *Lapin Agile* cabaret. Here, Picasso and Modigliani painted, fueled by cheap wine and artistic passion, forever changing the world of art.

#### Chapter 3: The Birth of the Café Culture
Parisian cafés have always been more than places to drink coffee; they were open-air parliaments. During the mid-20th century, philosophers like Jean-Paul Sartre and Simone de Beauvoir held court at *Café de Flore*, debating existentialism while jazz notes drifted from nearby basement clubs.`,
      etiquette: `### 🙏 Cultural Etiquette Guide: Paris

#### ✅ The Do's
- **Greet properly**: Always start every interaction (buying bread, asking directions) with *"Bonjour, Madame/Monsieur"*.
- **Speak softly**: Parisians keep their voices low in public spaces, restaurants, and subways.
- **Ask for the bill**: Waiters will not bring the bill until you ask (*"L'addition, s'il vous plaît"*), as rushing you is considered rude.

#### ❌ The Don'ts
- **Don't rush your meal**: Dining is an art form; expect to sit for at least 2 hours.
- **Don't touch merchandise**: In local markets or boutiques, ask the shopkeeper for help rather than handling produce or clothing directly.
- **Don't assume everyone speaks English**: Always politely ask, *"Parlez-vous anglais?"* first.`
    },
    kyoto: {
      discovery: `### ⛩️ Welcome to Kyoto, Japan
Kyoto is the cultural heart of Japan, famous for its thousands of classical Buddhist temples, gardens, imperial palaces, Shinto shrines, and traditional wooden merchant houses.

#### 🏛️ Top Must-Visit Places
1. **Fushimi Inari Shrine**: Renowned for its path of thousands of vibrant red Torii gates leading up the mountain.
2. **Kinkaku-ji (The Golden Pavilion)**: A Zen temple whose top two floors are completely covered in gold leaf.
3. **Gion District**: Kyoto's historic entertainment quarter, famous for its traditional wooden machiya houses and geisha culture.

#### 💡 Local Insider Tips
- Visit Fushimi Inari at dawn or dusk to avoid crowds and experience a mystical atmosphere.
- Respect the Geishas and Maiko in Gion; do not approach them, take photos without permission, or block their paths.
- Rent a traditional Kimono for a day to feel fully connected to the city's ancient streets.

#### 📅 Best Time to Visit
- **Spring (April)** for cherry blossoms, or **Autumn (November)** for stunning red maple foliage.

#### 🍵 Tea & Zen Culture
- Participate in a traditional tea ceremony (*Chado*) to understand the concepts of harmony, respect, and tranquility.`,
      gems: `### 💎 Hidden Gems of Kyoto

#### 1. Gio-ji Temple
* **What it is**: A quiet temple tucked away in the Arashiyama hills, famous for its lush moss garden and tall bamboo groves.
* **Why visit**: Far quieter than the main bamboo forest, it offers an incredibly peaceful Zen atmosphere.

#### 2. Otagi Nenbutsu-ji
* **What it is**: A quirky temple featuring 1,200 stone statues of Buddha's disciples, each with a different facial expression.
* **Why visit**: The statues are moss-covered, humorous, and represent local stone carving craftsmanship.

#### 3. Gion Shirakawa Canal
* **What it is**: A beautiful willow-lined canal running parallel to busier Gion streets.
* **Why visit**: It offers a quiet, highly photogenic walk over stone bridges next to traditional tea houses.`,
      story: `### 📖 The Whispering Gardens of Kyoto

#### Chapter 1: The Silence of the Stone Garden
At the Ryōan-ji Temple, fifteen stones are arranged in a bed of white gravel. No matter where you stand, you can only see fourteen of them at once. Designed in the 15th century, this Zen garden is a riddle in stone, inviting visitors to sit and reflect on the unseen mysteries of the universe.

#### Chapter 2: The Path of the Red Gates
Thousands of red Torii gates climb the sacred forest mountain of Inari. Each gate is a gift from a local business, asking the fox spirits for prosperity and success. Walking under the wooden arches, the sunlight filters through, casting warm, dancing shadows on the moss-covered shrines.

#### Chapter 3: The Secret Art of the Tea Masters
In a tiny wooden room overlooking a quiet pond, a tea master whisks green matcha powder. Every motion, from boiling water to cleaning the ceramic bowl, is a choreographed meditation. This ritual teaches the art of *Ichigo Ichie*—appreciating this exact moment, for it will never happen again.`,
      etiquette: `### 🙏 Cultural Etiquette Guide: Kyoto

#### ✅ The Do's
- **Bow slightly**: When greeting someone, a slight bow is a sign of respect.
- **Walk on the correct side**: Follow local signs on stairs and streets. Keep left on escalators in Kyoto.
- **Take off your shoes**: Remove your shoes when entering temples, traditional guest houses (*Ryokan*), or homes, and put on the provided slippers.

#### ❌ The Don't's
- **No tipping**: Tipping is not practiced in Japan and can cause confusion or offense.
- **Don't eat while walking**: Consume street food near the stall where you bought it. Eating on the move is looked down upon.
- **Don't take photos where prohibited**: Many temples ban photography inside historical halls.`
    }
  };

  // Helper to capitalize words
  const capitalize = (str) => str.replace(/\b\w/g, c => c.toUpperCase());

  return {
    getDiscovery: (dest, interests, duration) => {
      const key = dest.toLowerCase().trim();
      if (popularData[key]) return popularData[key].discovery;

      // Generic fallback generator
      const cleanDest = capitalize(dest);
      const interestSection = interests ? `\n\nSince you are interested in **${interests}**, make sure to dedicate time exploring local sites that showcase these themes.` : '';
      
      return `### 🌍 Explore ${cleanDest}
Welcome to ${cleanDest}! This guide is prepared to help you explore the unique history, local lifestyle, and cultural heritage of this destination.

#### 🏛️ Recommended Cultural Landmarks
1. **${cleanDest} Historic Quarter**: Take a walking tour through the oldest parts of the city to see historical architecture and local life.
2. **The City Heritage Museum**: Discover exhibits showcasing the founding stories and cultural arts of ${cleanDest}.
3. **Local Artisan Plaza**: Walk around the markets to see local craftspeople creating traditional goods.${interestSection}

#### 💡 Local Insider Tips
- Travel like a local by using the city's public transport systems or renting a bicycle.
- Keep small bills of local currency on hand; small family-owned shops and street vendors rarely accept credit cards.
- Try visiting popular historic landmarks during lunchtime or late afternoon when tourist groups are minimal.

#### 📅 Recommended Travel Window
- Spring or Autumn periods are generally ideal for mild outdoor exploration weather.

#### 🍲 Authentic Gastronomy
- Seek out busy neighborhood markets and try local specialties that are prepared using traditional recipes passed down through generations.`;
    },

    getHiddenGems: (region, type) => {
      const key = region.toLowerCase().trim();
      if (popularData[key] && (type === 'all' || !type)) return popularData[key].gems;

      const cleanRegion = capitalize(region);
      const categoryLabel = type !== 'all' ? capitalize(type) : 'Cultural';

      return `### 💎 Off-The-Beaten-Path Gems in ${cleanRegion}

#### 1. The Quiet Sanctuary of ${cleanRegion}
* **Type**: ${categoryLabel} Escape
* **Why visit**: This peaceful spot is located just outside the busy center. It is a favorite among local residents who visit to relax and enjoy the scenic views.

#### 2. The Traditional Artisan Alley
* **Type**: Local Arts & Crafts
* **Why visit**: Tucked behind a main market street, this block houses small, family-owned workshops preserving traditional manufacturing methods.

#### 3. Old Ruins of the Valley
* **Type**: Historical Interest
* **Why visit**: Neglected by major tour operators, these old stone walls offer a tranquil look into the early history of the region.`;
    },

    getStory: (dest, style) => {
      const key = dest.toLowerCase().trim();
      if (popularData[key]) return popularData[key].story;

      const cleanDest = capitalize(dest);
      const cleanStyle = capitalize(style || 'traditional');

      return `### 📖 Historical Chronicles of ${cleanDest}
*Style: ${cleanStyle} Narrative*

#### Chapter 1: The Founding Legends
Centuries ago, the area surrounding ${cleanDest} was settled by ancient communities drawn to its fertile lands and waterways. Local folklore speaks of protectors and legendary founders whose stories are still celebrated in annual festivals.

#### Chapter 2: The Crossroads of Trade
As time moved on, ${cleanDest} grew into a major trading hub. Merchants brought textiles, spices, and new ideas, creating a unique melting pot of cultures that shaped the modern character of the city.

#### Chapter 3: Preserving the Heritage
Today, local communities are dedicated to keeping their historical traditions alive. Behind the modern facades, the legends, recipes, and craftsmanship of the past continue to thrive in daily family life.`;
    },

    getHeritage: (region, tab) => {
      const cleanRegion = capitalize(region);
      const tabName = capitalize(tab || 'unesco');

      return `### 🏛️ Heritage Spotlight: ${cleanRegion} (${tabName})

#### Key Highlights & Historical Depth
* **Heritage Landmarks**: ${cleanRegion} houses several sites that reflect the architectural and social changes of the past centuries.
* **Ancient Traditions**: Generations of families have preserved traditional rituals, crafts, and celebrations.
* **UNESCO/Historical Status**: Local organizations work closely with heritage groups to document and conserve old city centers, traditional architectures, and local legends.

#### Gastronomy & Folklore
- Discover how ancient food preparation techniques are still practiced in local kitchens.
- Traditional music and performing arts are regularly performed during seasonal holidays, bringing community members together to celebrate their shared history.`;
    },

    getEvents: (dest, month, interests) => {
      const cleanDest = capitalize(dest);
      const cleanMonth = capitalize(month || 'current season');
      const interestTag = interests ? ` with a focus on ${interests}` : '';

      return `### 🎉 Events & Cultural Activities in ${cleanDest} (${cleanMonth})
Explore the cultural calendar of ${cleanDest} for the month of **${cleanMonth}**${interestTag}.

#### 📅 Recommended Activities & Festivals
1. **Seasonal Harvest Celebration**: A lively neighborhood festival featuring traditional dances, food stalls, and local musical performances.
2. **Local Craft & Design Market**: A weekly gathering where local artisans display handmade pottery, textiles, and woodcarvings.
3. **Heritage Cooking Workshop**: Join a local chef to learn how to prepare authentic regional dishes using seasonal ingredients.`;
    },

    getExperiences: (dest) => {
      const cleanDest = capitalize(dest);
      return `### 🤝 Authentic Experiences in ${cleanDest}

#### 🏡 Neighborhood Homestay & Exchange
* **What it is**: Stay with a local family in a traditional neighborhood.
* **Why do it**: Experience daily life firsthand, enjoy home-cooked meals, and learn about local customs directly.

#### 🎨 Hands-On Crafting Class
* **What it is**: Learn a traditional craft (pottery, weaving, or painting) under the guidance of a master artisan.
* **Why do it**: Create your own keepsake while learning about the history of the art form.

#### 🚶 Neighborhood Heritage Walk
* **What it is**: A walking tour led by local historians or community leaders.
* **Why do it**: Hear personal stories, visit community-supported cafes, and discover places omitted from commercial maps.`;
    },

    getComparison: (destA, destB) => {
      const cleanA = capitalize(destA);
      const cleanB = capitalize(destB);

      return `### ⚖️ Cultural Comparison: ${cleanA} vs ${cleanB}

| Category | ${cleanA} | ${cleanB} |
| :--- | :--- | :--- |
| **Cultural Depth** | Rich in ancient architecture, traditional festivals, and historical museums. | Known for modern art, design galleries, and progressive urban culture. |
| **Pace of Life** | Relaxes, centered around quiet neighborhoods and local parks. | High-energy, fast-paced metropolitan vibe with active nightlife. |
| **Culinary Scene** | Traditional recipes, slow-cooking heritage, and local food markets. | Gastronomic innovation, fusion street food, and trendy dining hubs. |
| **Accessibility** | Walkable historic center, bike rentals, and compact transit network. | Extensive train system, large roads, and public buses. |
| **Safety & Vibe** | Warm community feel, highly welcoming to tourists. | Dynamic and friendly, though standard city precautions apply. |`;
    },

    getItinerary: (dest, days, pace, group) => {
      const cleanDest = capitalize(dest);
      const cleanPace = capitalize(pace || 'moderate');
      const cleanGroup = capitalize(group || 'travelers');
      const totalDays = parseInt(days) || 3;

      let scheduleHtml = `### 📋 Itinerary: ${totalDays} Days in ${cleanDest}\n*Pace: ${cleanPace} | Group: ${cleanGroup}*\n\n`;

      for (let i = 1; i <= totalDays; i++) {
        scheduleHtml += `#### 📅 Day ${i}: Exploring ${cleanDest}
- **Morning**: Walk through the historical city center. Stop at local cafes for a traditional breakfast.
- **Afternoon**: Visit the primary art museum or historical landmark. Lunch at a family-run tavern.
- **Evening**: Take a relaxed stroll along the riverbanks or scenic lookout. Enjoy dinner featuring regional specialties.\n\n`;
      }

      return scheduleHtml;
    },

    getEtiquette: (dest) => {
      const cleanDest = capitalize(dest);
      const key = dest.toLowerCase().trim();
      if (popularData[key]) return popularData[key].etiquette;

      return `### 🙏 Cultural Etiquette: ${cleanDest}

#### ✅ The Do's
- **Greet respectfully**: Always greet shopkeepers and servers before making requests.
- **Dress appropriately**: Keep shoulders and knees covered when visiting sacred structures.
- **Ask before taking pictures**: Always request permission before photographing local residents or private properties.

#### ❌ The Don'ts
- **Avoid speaking loudly**: Keep voices at a moderate level when using public transport or visiting quiet shrines.
- **Don't litter**: Dispose of trash in designated bins to respect the local community.
- **Don't argue aggressively**: Respect local trading customs and negotiate politely if bargaining is accepted.`;
    }
  };
})();
