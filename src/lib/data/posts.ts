// src/lib/data/posts.ts
// Dummy data for posts with added content

export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  author: string;
  createdAt: string;
  updatedAt?: string;
  status: string;
  featured?: boolean;
  // Legacy fields for compatibility with components
  description?: string;
  date?: string;
  categories?: string[];
  imageUrl?: string | null;
}

// Basic dummy content generator
function generateDummyContent(title: string): string {
  return `
    <h2>Introduction to ${title}</h2>
    <p>This is the main body of the article exploring the nuances of "${title}". Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <img src="https://picsum.photos/seed/${title.replace(/\s+/g, "-")}/800/400" alt="Related image for ${title}" />
    <h3>Key Concepts</h3>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    <ul>
        <li>Understanding the core principles.</li>
        <li>Applying the ideas in real life.</li>
        <li>Overcoming common challenges.</li>
    </ul>
    <h2>Conclusion</h2>
    <p>In conclusion, "${title}" requires careful consideration and practice. We hope this article provides a good starting point.</p>
    `;
}

// --- Featured Post ---
export const featuredPost: Post = {
  id: "featured-1",
  title: "The Hardest Pill: Accepting When You're Wrong",
  content: generateDummyContent("Accepting When You're Wrong"),
  slug: "accepting-when-youre-wrong",
  published: true,
  author: "Alex Johnson",
  createdAt: "2025-04-12T00:00:00Z",
  status: "published",
  featured: true,
  // Legacy compatibility
  description: "Exploring the psychological challenges of admitting errors and how it leads to personal growth.",
  date: "2025-04-12",
  categories: ["Psychology", "Growth"],
  imageUrl: "/hard_pills.png",
};

// --- Recent Posts ---
export const recentPosts: Post[] = [
  {
    id: "post-1",
    title: "Truth in Relationships: Communication Without Filters",
    description:
      "How radical honesty transforms relationships and creates deeper connections.",
    author: "Jamie Smith",
    date: "2025-04-10",
    categories: ["Relationships"],
    imageUrl: "https://picsum.photos/seed/post-1/600/338",
    content: generateDummyContent("Communication Without Filters"), // Added content
  },
  {
    id: "post-2",
    title: "Career Plateaus: Recognizing When to Move On",
    description:
      "Signs that you've outgrown your current position and how to take the leap.",
    author: "Pat Garcia",
    date: "2025-04-08",
    categories: ["Career", "Growth"],
    imageUrl: "https://picsum.photos/seed/post-2/600/338",
    content: generateDummyContent("Career Plateaus"), // Added content
  },
  {
    id: "post-3",
    title: "Digital Detox: The Reality of Social Media Addiction",
    description:
      "Understanding the psychological hooks of platforms and breaking free.",
    author: "Jordan Lee",
    date: "2025-04-05",
    categories: ["Technology", "Wellbeing"],
    imageUrl: "https://picsum.photos/seed/post-3/600/338",
    content: generateDummyContent("Digital Detox"), // Added content
  },
  // ... Add content for post-4, post-5, post-6 similarly ...
  {
    id: "post-4",
    title: "Financial Responsibility: Living Below Your Means",
    description: "Why cutting back now can lead to true freedom later.",
    author: "Taylor Kim",
    date: "2025-04-02",
    categories: ["Finance"],
    imageUrl: "https://picsum.photos/seed/post-4/600/338",
    content: generateDummyContent("Living Below Your Means"),
  },
  {
    id: "post-5",
    title: "Confronting Bias: Recognizing Your Own Prejudices",
    description:
      "Tools for identifying and addressing unconscious bias in your thinking.",
    author: "Sam Rivera",
    date: "2025-03-30",
    categories: ["Society", "Psychology"],
    imageUrl: "https://picsum.photos/seed/post-5/600/338",
    content: generateDummyContent("Confronting Bias"),
  },
  {
    id: "post-6",
    title: "The Myth of Perfection: Embracing Good Enough",
    description: "How perfectionism harms progress and what to do instead.",
    author: "Alex Johnson",
    date: "2025-03-28",
    categories: ["Productivity", "Wellbeing"],
    imageUrl: "https://picsum.photos/seed/post-6/600/338",
    content: generateDummyContent("Embracing Good Enough"),
  },
];

// --- Popular Posts ---
export const popularPosts: Post[] = [...recentPosts]
  .sort(() => 0.5 - Math.random())
  .slice(0, 4);

// --- Helper function for fetching a single post ---
export function getPostById(id: string): Post | undefined {
  // Combine featured and recent for lookup
  const allPosts = [featuredPost, ...recentPosts];
  return allPosts.find((post) => post.id === id);
}
