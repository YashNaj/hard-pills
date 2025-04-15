// src/lib/data/posts.ts
// Dummy data for posts

export interface Post {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  categories: string[];
  imageUrl: string | null;
  content?: string;
}

export const featuredPost: Post = {
  id: "featured-1",
  title: "The Hardest Pill: Accepting When You're Wrong",
  description:
    "Exploring the psychological challenges of admitting errors and how it leads to personal growth.",
  author: "Alex Johnson",
  date: "April 12, 2025",
  categories: ["Psychology", "Growth"],
  imageUrl: "/hard_pills.png",
};

export const recentPosts: Post[] = [
  {
    id: "post-1",
    title: "Truth in Relationships: Communication Without Filters",
    description:
      "How radical honesty transforms relationships and creates deeper connections.",
    author: "Jamie Smith",
    date: "April 10, 2025",
    categories: ["Relationships"],
    imageUrl: null,
  },
  {
    id: "post-2",
    title: "Career Plateaus: Recognizing When to Move On",
    description:
      "Signs that you've outgrown your current position and how to take the leap.",
    author: "Pat Garcia",
    date: "April 8, 2025",
    categories: ["Career", "Growth"],
    imageUrl: null,
  },
  {
    id: "post-3",
    title: "Digital Detox: The Reality of Social Media Addiction",
    description:
      "Understanding the psychological hooks of platforms and breaking free.",
    author: "Jordan Lee",
    date: "April 5, 2025",
    categories: ["Technology", "Wellbeing"],
    imageUrl: null,
  },
  {
    id: "post-4",
    title: "Financial Responsibility: Living Below Your Means",
    description: "Why cutting back now can lead to true freedom later.",
    author: "Taylor Kim",
    date: "April 2, 2025",
    categories: ["Finance"],
    imageUrl: null,
  },
  {
    id: "post-5",
    title: "Confronting Bias: Recognizing Your Own Prejudices",
    description:
      "Tools for identifying and addressing unconscious bias in your thinking.",
    author: "Sam Rivera",
    date: "March 30, 2025",
    categories: ["Society", "Psychology"],
    imageUrl: null,
  },
  {
    id: "post-6",
    title: "The Myth of Perfection: Embracing Good Enough",
    description: "How perfectionism harms progress and what to do instead.",
    author: "Alex Johnson",
    date: "March 28, 2025",
    categories: ["Productivity", "Wellbeing"],
    imageUrl: null,
  },
];

// You can derive popularPosts or other custom lists from recentPosts
export const popularPosts: Post[] = [...recentPosts]
  .sort(() => 0.5 - Math.random()) // Simple randomization for demo
  .slice(0, 4); // Take top 4
