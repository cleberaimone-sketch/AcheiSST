import marcusChen from "@/assets/speakers/marcus-chen.jpg";
import sarahMartinez from "@/assets/speakers/sarah-martinez.jpg";
import jamesAnderson from "@/assets/speakers/james-anderson.jpg";
import elenaRodriguez from "@/assets/speakers/elena-rodriguez.jpg";
import amandaFoster from "@/assets/speakers/amanda-foster.jpg";
import robertKim from "@/assets/speakers/robert-kim.jpg";
import thomasBlake from "@/assets/speakers/thomas-blake.jpg";
import kevinWalsh from "@/assets/speakers/kevin-walsh.jpg";
import danielSingh from "@/assets/speakers/daniel-singh.jpg";

export interface Speaker {
  id: string;
  name: string;
  company: string;
  role: string;
  photo: string;
  bio: string;
  twitter?: string;
  github?: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  speakers: string[];
  duration: string;
  time: string;
  track: string;
  tags: string[];
}

export const speakers: Record<string, Speaker> = {
  "marcus-chen": {
    id: "marcus-chen",
    name: "Marcus Chen",
    company: "The Build Show",
    role: "Host & Co-founder",
    photo: marcusChen.src,
    bio: "Marcus Chen is the co-founder and lead host of The Build Show, one of the most popular product management podcasts with over 2 million monthly listeners. With a background in product leadership at companies like Trackwise and Canvex, Marcus brings deep product expertise to his interviews with industry leaders. He's passionate about making product strategy accessible to PMs at all levels.",
    twitter: "marcuschen",
  },
  "sarah-martinez": {
    id: "sarah-martinez",
    name: "Sarah Martinez",
    company: "The Build Show",
    role: "Co-host & Producer",
    photo: sarahMartinez.src,
    bio: "Sarah Martinez is the co-host and executive producer of The Build Show. Previously a Group PM at Paystream, Sarah has spoken at over 50 conferences worldwide on topics ranging from pricing strategy to product-led growth. She holds an MBA from Westfield and is a recognized voice in the product community.",
    twitter: "sarahm_product",
  },
  "james-anderson": {
    id: "james-anderson",
    name: "James Anderson",
    company: "Planforge",
    role: "VP of Product",
    photo: jamesAnderson.src,
    bio: "James Anderson leads the product organization at Planforge, overseeing the roadmap for one of the fastest-growing project management tools in tech. Before Planforge, James spent 8 years at Docflow, where he was instrumental in launching databases, API integrations, and the team collaboration features. He speaks frequently on opinionated product design and saying no to features.",
    twitter: "janderson_pm",
  },
  "elena-rodriguez": {
    id: "elena-rodriguez",
    name: "Elena Rodriguez",
    company: "Ember Ventures",
    role: "General Partner",
    photo: elenaRodriguez.src,
    bio: "Elena Rodriguez is a General Partner at Ember Ventures, a $2B fund with early investments in Canvex, Docflow, and Planforge. She has led investments in over 30 product-led companies, including three that reached $1B valuations. Elena previously co-founded Orbitly, a customer intelligence platform acquired by Docflow.",
    twitter: "elena_vc",
  },
  "amanda-foster": {
    id: "amanda-foster",
    name: "Amanda Foster",
    company: "Relayhq",
    role: "Chief Product Officer",
    photo: amandaFoster.src,
    bio: "Amanda Foster is the CPO at Relayhq, where she drives product strategy for the async video platform used by over 25 million people. She joined Relayhq in 2021 after serving as Director of Product at Channelwork, where she helped launch Huddles and Canvas. Amanda is passionate about async-first product culture and building tools that reduce meeting overload.",
    twitter: "amandafoster",
  },
  "robert-kim": {
    id: "robert-kim",
    name: "Robert Kim",
    company: "Stackbase",
    role: "CTO & Co-founder",
    photo: robertKim.src,
    bio: "Robert Kim is the CTO and co-founder of Stackbase, the leading internal tool builder used by companies from Fortune 500s to YC startups. Under his technical leadership, Stackbase grew from a side project to a platform powering operations at over 27,000 companies. Robert holds a CS degree from Northpoint and previously worked at Datatrust.",
  },
  "thomas-blake": {
    id: "thomas-blake",
    name: "Thomas Blake",
    company: "Paystream",
    role: "Head of Product, Billing",
    photo: thomasBlake.src,
    bio: "Thomas Blake leads Product for Paystream Billing, the subscription and invoicing platform handling billions in recurring revenue for SaaS companies worldwide. Previously at Marketstack and Tilehouse, Thomas specializes in building monetization infrastructure and has helped hundreds of companies design their pricing models.",
    twitter: "tblake_pm",
  },
  "kevin-walsh": {
    id: "kevin-walsh",
    name: "Kevin Walsh",
    company: "Canvex",
    role: "VP of Product Design",
    photo: kevinWalsh.src,
    bio: "Kevin Walsh leads Product Design at Canvex, where he oversees the design system, prototyping, and Dev Mode experiences. Before Canvex, Kevin was a design director at Framekit and spent 6 years on the Chrome DevTools team at Alphanet. He's deeply involved in design systems thinking and serves on the W3C Advisory Board.",
    twitter: "kevinwalsh",
  },
  "daniel-singh": {
    id: "daniel-singh",
    name: "Daniel Singh",
    company: "Trackwise",
    role: "VP of Product",
    photo: danielSingh.src,
    bio: "Daniel Singh is VP of Product at Trackwise, where he leads the analytics, experimentation, and CDP product lines. With 15 years of experience building data products, Daniel has helped Fortune 100 companies build measurement cultures. He previously led product analytics at Streamly and holds a PhD in Statistics from Eastbridge.",
    twitter: "danielsingh_pm",
  },
};

export const sessions: Session[] = [
  {
    id: "preshow",
    title: "Opening: The State of Product in 2025",
    description: "Kick off Craft Summit 2025 with a lively opening featuring product industry commentary, predictions for the year ahead, and live audience Q&A. Our hosts break down the biggest trends in product management, AI-assisted product development, and the shifting role of the PM.",
    speakers: ["marcus-chen", "sarah-martinez", "james-anderson", "elena-rodriguez"],
    duration: "47:27",
    time: "9:00 AM",
    track: "Main Stage",
    tags: ["General", "Live"],
  },
  {
    id: "customer-panel",
    title: "Product-Led Growth: Lessons from Relayhq, Stackbase, and Canvex",
    description: "Hear directly from three product leaders about how they've built self-serve funnels, measured activation, and balanced PLG with enterprise sales. Learn about real-world challenges in pricing decisions, freemium conversion, and building products that sell themselves.",
    speakers: ["amanda-foster", "robert-kim", "thomas-blake", "kevin-walsh"],
    duration: "28:36",
    time: "10:30 AM",
    track: "Main Stage",
    tags: ["PLG", "Growth"],
  },
  {
    id: "fortune-100-scale",
    title: "Building Product Culture at Scale",
    description: "Daniel Singh shares battle-tested strategies for building measurement-driven product cultures at large organizations. This deep-dive covers OKR frameworks that actually work, cross-functional alignment, experimentation programs, and the unique challenges of being a PM at a Fortune 100 company.",
    speakers: ["daniel-singh"],
    duration: "35:42",
    time: "11:15 AM",
    track: "Main Stage",
    tags: ["Culture", "Enterprise", "Scale"],
  },
  {
    id: "ai-cloud-deep-dive",
    title: "AI-Native Products: From Prototype to Production",
    description: "A deep-dive into building products with AI at the core. Learn how to evaluate AI capabilities, design human-in-the-loop workflows, set quality bars for non-deterministic outputs, and manage the unique product lifecycle of ML-powered features. Covers pricing AI features, user trust, and measuring AI product success.",
    speakers: ["amanda-foster", "james-anderson"],
    duration: "42:15",
    time: "1:00 PM",
    track: "Technical",
    tags: ["AI", "Product Strategy", "Deep Dive"],
  },
  {
    id: "edge-computing-revolution",
    title: "The Analytics-Driven PM",
    description: "Robert Kim shares how Stackbase uses its own product analytics stack to make every product decision. This session covers building dashboards that PMs actually use, setting up experimentation infrastructure, avoiding vanity metrics, and the future of real-time product analytics.",
    speakers: ["robert-kim"],
    duration: "31:18",
    time: "2:00 PM",
    track: "Technical",
    tags: ["Analytics", "Data", "Decisions"],
  },
  {
    id: "securing-modern-web",
    title: "Designing for Trust: Product Security as a Feature",
    description: "Kevin Walsh walks through Canvex's approach to building trust through product design. Covers permission models, data governance UX, transparent AI disclosure, and how design choices communicate trustworthiness. Includes case studies of trust failures and how to recover from them.",
    speakers: ["kevin-walsh"],
    duration: "38:50",
    time: "3:00 PM",
    track: "Design",
    tags: ["Trust", "Design", "Security"],
  },
  {
    id: "real-time-payments",
    title: "Pricing as Product: How to Build Monetization That Scales",
    description: "Thomas Blake reveals the frameworks behind Paystream Billing's approach to pricing strategy. Topics include value metric selection, packaging tiers, usage-based pricing mechanics, and strategies for testing pricing changes without alienating your existing customers.",
    speakers: ["thomas-blake"],
    duration: "34:22",
    time: "3:45 PM",
    track: "Strategy",
    tags: ["Pricing", "Monetization", "Growth"],
  },
  {
    id: "investing-in-devtools",
    title: "What Makes a Great Product Team: An Investor's Perspective",
    description: "Elena Rodriguez shares insights from investing in 30+ product-led companies, discussing what separates great product teams from good ones. Covers hiring patterns, team structures, the impact of AI on product roles, and where the next big opportunities lie in the product tooling ecosystem.",
    speakers: ["elena-rodriguez"],
    duration: "25:44",
    time: "4:30 PM",
    track: "Business",
    tags: ["Teams", "Hiring", "Investing"],
  },
  {
    id: "closing-fireside",
    title: "Closing Fireside Chat",
    description: "Marcus and Sarah wrap up Craft Summit 2025 with a fireside chat reflecting on the day's key takeaways and what it all means for the future of product management. Featuring audience Q&A and predictions for 2026.",
    speakers: ["marcus-chen", "sarah-martinez"],
    duration: "22:10",
    time: "5:15 PM",
    track: "Main Stage",
    tags: ["General", "Fireside Chat"],
  },
];

export function getSpeaker(id: string): Speaker | undefined {
  return speakers[id];
}

export function getSession(id: string): Session | undefined {
  return sessions.find((s) => s.id === id);
}

export function getSessionsForSpeaker(speakerId: string): Session[] {
  return sessions.filter((s) => s.speakers.includes(speakerId));
}

export function getSpeakersForSession(session: Session): Speaker[] {
  return session.speakers.map((id) => speakers[id]).filter(Boolean);
}

export function getAllSpeakers(): Speaker[] {
  return Object.values(speakers);
}
