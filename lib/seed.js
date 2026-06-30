// Seed script for Logan Land Historical Adventures
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const presentations = [
  {
    title: "Young George Washington",
    image_url: "00100dPORTRAIT_00100_BURST20190711193658808_COVER-002-768x1024.jpg",
    excerpt: "Discover the formative years of America's first president.",
    description: "Before he was a general or a president, George Washington was a young surveyor, soldier, and explorer. This presentation explores his early life, adventures, and the challenges that shaped his character and prepared him to lead a new nation."
  },
  {
    title: "Father Cataldo",
    image_url: "20240808_155201-768x1024.webp",
    excerpt: "The life and legacy of the pioneer Jesuit missionary.",
    description: "Explore the extraordinary life of Father Joseph Cataldo, the Italian Jesuit missionary who played a pivotal role in the history of the Pacific Northwest, founding Gonzaga University and ministering to Native American tribes."
  },
  {
    title: "The Armor of God",
    image_url: "armor-cropped.png",
    excerpt: "A historic look at spiritual and physical armor.",
    description: "An interactive presentation demonstrating the pieces of armor described in the biblical passages of Ephesians, comparing them to actual historic Roman soldier armor, explaining the purpose and design of each piece."
  },
  {
    title: "Folk Music/Songs/Stories",
    image_url: "Music.jpg",
    excerpt: "Traditional American folk music and storytelling.",
    description: "A lively and engaging presentation featuring traditional acoustic songs, folk stories, and historical context of American folk traditions, encouraging participation and storytelling."
  },
  {
    title: "Patrick Henry",
    image_url: "IMG_20180714_184703-768x1024.jpg",
    excerpt: "Give me liberty, or give me death!",
    description: "Step back into the Virginia Convention of 1775. Hear the passionate words and understand the revolutionary spirit of Patrick Henry as he calls his fellow citizens to stand up for liberty."
  },
  {
    title: "William Bradford",
    image_url: "Hannuka-048-768x1024.jpg",
    excerpt: "The Governor of the Plymouth Colony.",
    description: "Learn about the arduous journey of the Mayflower pilgrims and their struggles to establish Plymouth Colony through the eyes of their long-serving governor, William Bradford, highlighting faith, resilience, and early relations with Native Americans."
  },
  {
    title: "Shepherd of Bethlehem",
    image_url: "SHepherd-576x1024.jpg",
    excerpt: "A first-century shepherd's perspective on the Nativity.",
    description: "A heartwarming Christmas-season presentation where a humble first-century shepherd shares his eyewitness account of the events surrounding the birth of Jesus in Bethlehem."
  },
  {
    title: "Alvin York",
    image_url: "Alvin-York-9-e1782346593578.jpg",
    excerpt: "One of the most decorated US soldiers of World War I.",
    description: "Follow the journey of Sergeant Alvin C. York from a humble blacksmith in Tennessee to a war hero who single-handedly captured over 100 German soldiers in the Argonne Forest, focusing on his moral conflict and bravery."
  },
  {
    title: "John Newton",
    image_url: "Screenshot-2026-06-24-190204-799x1024.png",
    excerpt: "From slave trader to the author of 'Amazing Grace'.",
    description: "Discover the powerful story of John Newton, the slave ship captain who survived a violent storm, experienced a deep spiritual conversion, became an abolitionist clergyman, and penned the world's most famous hymn."
  },
  {
    title: "Abraham Lincoln",
    image_url: "lincoln-cropped-1-1024x956.png",
    excerpt: "Preserving the Union and championing freedom.",
    description: "Hear from President Lincoln as he reflects on his childhood, the heavy burden of the Civil War, the Gettysburg Address, and his enduring hope for a united and free nation."
  },
  {
    title: "William Clark",
    image_url: "Clark-1-890x1024.jpg",
    excerpt: "Co-leader of the legendary Lewis and Clark Expedition.",
    description: "Join Captain William Clark as he recounts the historic Corps of Discovery expedition from St. Louis to the Pacific Ocean, sharing maps, encounters with native peoples, and discoveries of new flora and fauna."
  }
];

const faqs = [
  {
    category: "History Presentations",
    question: "How many characters do you do?",
    answer: "Currently, Logan has about 10 different historical presentations, including George Washington, Abraham Lincoln, Patrick Henry, William Clark, and John Newton.",
    display_order: 1
  },
  {
    category: "History Presentations",
    question: "What should I expect from a presentation?",
    answer: "The goal of any presentation is threefold: to educate, to inspire, and to entertain. Logan brings characters to life with authentic costuming, detailed storytelling, and historic props.",
    display_order: 2
  },
  {
    category: "History Presentations",
    question: "How long are your presentations and what age are they appropriate for?",
    answer: "Presentations are typically 45 to 60 minutes long and can be tailored for all age groups, including elementary schools, historical societies, churches, and adult groups.",
    display_order: 3
  },
  {
    category: "History Presentations",
    question: "How does he memorize all of that?",
    answer: "This question is answered with one simple word: Reading. Continuous research and a deep passion for history make the material natural to share.",
    display_order: 4
  },
  {
    category: "Family Folk Dancing",
    question: "How many people can participate?",
    answer: "Folk dancing requires numbers. While smaller groups can dance, a group of 15 to 100+ people is ideal to create a fun, energetic community dancing circle.",
    display_order: 5
  },
  {
    category: "Family Folk Dancing",
    question: "How much space is needed?",
    answer: "As much space as possible with a flat, clean surface (like a gymnasium floor, outdoor patio, hall, or large lawn). This allows participants to move freely and safely.",
    display_order: 6
  },
  {
    category: "Family Folk Dancing",
    question: "What age are these dances suited for?",
    answer: "Logan teaches family folk dance. It is designed to be multi-generational: simple enough for children to follow, yet fun and engaging for parents and grandparents.",
    display_order: 7
  },
  {
    category: "Family Folk Dancing",
    question: "What music do you use?",
    answer: "Logan uses all types and styles of traditional folk music, including old-time American, Celtic, and international acoustic dance tunes that keep the feet moving.",
    display_order: 8
  }
];

const events = [
  {
    title: "Upcoming Presentations & Faith Walk Park Visit",
    date: "July 11, 2026",
    time: "9:00 AM – 12:00 PM EST",
    location: "Faith Walk Park",
    description: "We will plan to be out at the Faith Walk Park on the morning of July 11th. Come say hello, learn about upcoming presentations, and enjoy a morning in the park! More details at https://faithwalkcda.org/events/",
    link: "https://faithwalkcda.org/events/",
    image_url: "20230422_124248-scaled.jpeg"
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log("Seeding presentations...");
    for (const p of presentations) {
      await client.query(
        'INSERT INTO presentations (title, image_url, description, excerpt) VALUES ($1, $2, $3, $4)',
        [p.title, p.image_url, p.description, p.excerpt]
      );
    }
    
    console.log("Seeding FAQs...");
    for (const f of faqs) {
      await client.query(
        'INSERT INTO faqs (category, question, answer, display_order) VALUES ($1, $2, $3, $4)',
        [f.category, f.question, f.answer, f.display_order]
      );
    }

    console.log("Seeding events...");
    for (const e of events) {
      await client.query(
        'INSERT INTO events (title, date, time, location, description, link, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [e.title, e.date, e.time, e.location, e.description, e.link, e.image_url]
      );
    }

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
