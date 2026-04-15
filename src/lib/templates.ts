import type {InvitationConfig} from '@/src/types/invitation';

export type TemplateSlug = 'lumiere' | 'bloom' | 'sage' | 'onyx';

export type TemplateDefinition = {
  slug: TemplateSlug;
  name: string;
  available: boolean;
  content: InvitationConfig | null;
};

const LUMIERE_TEMPLATE = {
  ...(JSON.parse(String.raw`{
    "slug": "claire",
    "seo": {
      "title": "The Wedding of Dexter - Hualin",
      "description": "A cinematic digital invitation for Dexter and Hualin."
    },
    "theme": {
      "accent": "#d8b181",
      "background": "#050505",
      "surface": "#111111",
      "softSurface": "#e7e1db"
    },
    "guestQueryParam": "to",
    "couple": {
      "joinedName": "Dexter - Hualin",
      "coverLabel": "THE WEDDING OF",
      "dateLabel": "Friday, 21 August 2026",
      "scripture": {
        "text": "But at the beginning of creation God 'made them male and female.' 'For this reason a man will leave his father and mother and be united to his wife, and the two will become one flesh.' So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate.",
        "citation": "Mark 10:6-9"
      },
      "quote": "Two are better than one, for they have a good return for their labor.",
      "bride": {
        "title": "THE BRIDE",
        "fullName": "Hualin Arabelle",
        "nickname": "Hualin",
        "parents": ["The Daughter of", "Mr. Lorem ipsum dolor sit amet", "Mrs. Lorem ipsum dolor sit amet"],
        "instagram": "https://www.instagram.com/groovepublic.id",
        "image": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00145-Large.jpeg"
      },
      "groom": {
        "title": "THE GROOM",
        "fullName": "Dexter Emmanuel",
        "nickname": "Dexter",
        "parents": ["The Son of", "Mr. Lorem ipsum dolor sit amet", "Mrs. Lorem ipsum dolor sit amet"],
        "instagram": "https://www.instagram.com/groovepublic.id",
        "image": "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00183-Large.jpeg"
      }
    },
    "media": {
      "audio": "https://is3.cloudhost.id/externalgroovepublic/MP3/s%C3%B8d%20ven%20-%20infinity%20(lyric%20video)%20(mp3cut.net).mp3",
      "coverImage": "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00146-Large.jpeg",
      "heroVideo": "https://is3.cloudhost.id/externalgroovepublic/video%20groove/japan%20vibe.mp4",
      "heroPoster": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00169.jpg",
      "quoteImages": [
        "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00197-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00206.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00195-Large.jpeg"
      ],
      "storyImages": [
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00169.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00192.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00168.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00164.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00153-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-4975645345rge523.jpg"
      ],
      "giftImage": "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00179.jpg",
      "rsvpImage": "https://groovepublic.com/wp-content/uploads/2025/01/dexter-hualin-00216-Large.jpeg",
      "videoPoster": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00168.jpg",
      "videoUrl": "https://www.youtube.com/embed/BNQj5Muhss4?autoplay=1&rel=0",
      "thankYouImage": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00155.jpg",
      "gallery": [
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00203-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00155.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00208.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00207.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00198.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00192.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00169.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00168.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00179.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00195-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-4975645fdfd345rge523.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-4975645345rge523.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00145-Large.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-49756523.jpg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00182-Largffe.jpeg",
        "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00153-Large.jpeg"
      ]
    },
    "story": {
      "title": "A Journey in Love",
      "timeline": [
        {
          "year": "2023",
          "title": "The First Encounter",
          "body": "It all began in the spring of 2023 when Dexter, a kind-hearted and adventurous soul, arrived in Japan for work. New to the country, he found himself walking along the bustling streets of Tokyo, captivated by the neon lights and the mix of tradition and modernity. On one of his many explorations, Dexter stumbled upon a cozy cafe hidden in a quiet alley, its warm ambiance calling him inside.\n\nInside the cafe, Hualin, a soft-spoken artist with a passion for storytelling through her paintings, was sipping tea and sketching. Their eyes met briefly, and there was an instant connection. Dexter could not resist walking up to her and struck up a conversation about the art on the cafe walls. What started as a casual chat about creativity soon turned into hours of deep conversation. They shared stories of their lives, their dreams, and the serendipity that had led them to Japan. It felt as though they had known each other forever."
        },
        {
          "year": "2024",
          "title": "Growing Together",
          "body": "Over the next year, Dexter and Hualin spent more and more time together. They explored the beauty of Japan from the serene temples of Kyoto to the cherry blossoms in full bloom. With every passing moment, their bond deepened. Dexter admired Hualin's gentle spirit and her ability to find beauty in the simplest things. Hualin, on the other hand, was drawn to Dexter's adventurous nature and how he always made her laugh, even on the hardest days.\n\nTheir love story was not just about grand adventures but also about the quiet moments shared in the comfort of their home in Japan, cooking meals together, long walks in the park, and nights filled with laughter and dreams of the future. They both knew, deep down, that this was more than just a passing connection. It was something meant to last a lifetime."
        },
        {
          "year": "2025",
          "title": "The Proposal",
          "body": "By early 2025, it was clear to both Dexter and Hualin that they were meant to be together forever. Dexter planned a special evening for Hualin, taking her to the very cafe where they first met. As they sat by the same window, looking out at the Tokyo skyline, Dexter took Hualin's hand and spoke from the heart. He told her how much she meant to him and how he could not imagine his life without her.\n\nWith a smile that lit up her face, Hualin said yes.\n\nTheir love story was about to take the next step as they began planning their wedding for later that year, excited to build a future together, full of love, laughter, and the beautiful memories they would create in Japan and beyond."
        }
      ]
    },
    "countdown": {
      "label": "Almost Time For Our Celebration",
      "target": "2026-08-21T08:00:00+07:00",
      "calendar": {
        "title": "The Wedding of Dexter - Hualin",
        "description": "Join us for the wedding celebration of Dexter and Hualin.",
        "location": "Jl. Taman Palem Lestari Barat No.1 Blok B 13, Cengkareng Barat, Jakarta, 11730, Indonesia",
        "start": "2026-08-21T08:00:00+07:00",
        "end": "2026-08-21T12:00:00+07:00"
      },
      "image": "https://groovepublic.com/wp-content/uploads/2025/03/dexter-hualin-00198.jpg"
    },
    "events": {
      "title": "Wedding / Details",
      "dateLabel": "Friday\n21.08.2026",
      "details": [
        {
          "title": "Holy Matrimony",
          "time": "8 AM - 10 PM",
          "location": "Jl. Taman Palem Lestari Barat No.1 Blok B 13, Cengkareng Barat, Jakarta, 11730, Indonesia",
          "link": "https://maps.app.goo.gl/78MwTKCz1Qn13PFD8",
          "linkLabel": "View map"
        },
        {
          "title": "Reception",
          "time": "10 AM - 12 PM",
          "location": "Jl. Taman Palem Lestari Barat No.1 Blok B 13, Cengkareng Barat, Jakarta, 11730, Indonesia",
          "link": "https://maps.app.goo.gl/78MwTKCz1Qn13PFD8",
          "linkLabel": "View map"
        },
        {
          "title": "A Guide to Dress Codes",
          "text": "We kindly encourage our guests to wear these colors for our special day: Black, Maroon, Sage."
        },
        {
          "title": "Join Us Virtually",
          "time": "8 AM - 10 PM",
          "text": "If you are unable to attend in person, we invite you to celebrate with us through our live streaming.",
          "link": "https://www.youtube.com/@Groovepublic/videos",
          "linkLabel": "Watch live stream"
        }
      ]
    },
    "gift": {
      "intro": "For those of you who want to give a token of love to the bride and groom, you can use the account number below:",
      "accounts": [
        {"id": "mandiri-main", "bank": "Bank Mandiri", "number": "00008888123", "holder": "Groove Public Invitation"},
        {"id": "bca-main", "bank": "Bank BCA", "number": "00008888123", "holder": "Groove Public Invitation"},
        {"id": "bca-secondary", "bank": "Bank BCA", "number": "00008888123", "holder": "Groove Public Invitation"}
      ]
    },
    "rsvp": {
      "intro": "We kindly request your prompt response to confirm your attendance at our upcoming event. Alongside your RSVP, please take a moment to extend your warm regards and best wishes.",
      "maxGuestsDefault": 2,
      "comments": [
        {"guestName": "Belaa anis", "wishes": "Over the next year, Dexter and Hualin spent more and more time together. They explored the beauty of Japan.", "createdAt": "2025-03-04T10:00:00.000Z"},
        {"guestName": "Gery aq", "wishes": "Over the next year, Dexter and Hualin spent more and more time together. They explored the beauty of Japan.", "createdAt": "2025-03-04T09:00:00.000Z"},
        {"guestName": "Vilony", "wishes": "Over the next year, Dexter and Hualin spent more and more time together. They explored the beauty of Japan.", "createdAt": "2025-03-04T08:00:00.000Z"},
        {"guestName": "Jony", "wishes": "Over the next year, Dexter and Hualin spent more and more time together. They explored the beauty of Japan.", "createdAt": "2025-03-04T07:00:00.000Z"},
        {"guestName": "Yoku", "wishes": "Over the next year, Dexter and Hualin spent more and more time together. They explored the beauty of Japan.", "createdAt": "2025-03-04T06:00:00.000Z"}
      ]
    },
    "footer": {
      "closingTitle": ["Thank", "You"],
      "closingText": "It is a pleasure and honor for us, if you are willing to attend and give us your blessing.",
      "creditLabel": "Created by groove public",
      "creditUrl": "https://groovepublic.com/",
      "links": [
        {"label": "+62 813-2757-7133", "url": "https://wa.link/amk9ua"},
        {"label": "GROOVEPUBLIC.ID", "url": "https://www.instagram.com/groovepublic.id/"},
        {"label": "groovepublic.com", "url": "https://groovepublic.com/"}
      ]
    }
  }`) as InvitationConfig),
  slug: 'lumiere',
};

export const TEMPLATES: TemplateDefinition[] = [
  {
    slug: 'lumiere',
    name: 'Lumiere',
    available: true,
    content: LUMIERE_TEMPLATE,
  },
  {
    slug: 'bloom',
    name: 'Bloom',
    available: false,
    content: null,
  },
  {
    slug: 'sage',
    name: 'Sage',
    available: false,
    content: null,
  },
  {
    slug: 'onyx',
    name: 'Onyx',
    available: false,
    content: null,
  },
];

export function getTemplateBySlug(slug: string) {
  return TEMPLATES.find((template) => template.slug === slug.toLowerCase());
}

const RESERVED_SLUGS = new Set([
  'templates',
  'dashboard',
  'login',
  'signup',
  'auth',
  'claire',
]);

export function isReservedSlug(slug: string) {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}
