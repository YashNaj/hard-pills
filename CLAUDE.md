# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `bun dev` or `npm run dev` - Start development server
- `bun build` or `npm run build` - Build for production
- `bun check` or `npm run check` - Type check and validate project
- `bun preview` or `npm run preview` - Preview the production build

## Code Style Guidelines
- **Formatting**: Double quotes for HTML attributes, single quotes for JS/TS
- **Imports**: Group and order by: 1) Svelte/SvelteKit, 2) UI components, 3) Utilities
- **Components**: Use Svelte 5 syntax with `$props()`, `$state()`, and `$derived`
- **Types**: TypeScript with strict mode enabled; use proper type annotations
- **Naming**: kebab-case for files; PascalCase for components; camelCase for variables
- **Error Handling**: Use try/catch with console.error for errors
- **CSS**: TailwindCSS with custom classes; Prefer composition over inheritance
- **File Structure**: Group by feature in route directories like (home), (admin)

## Project Structure
- SvelteKit app using TypeScript, TailwindCSS, and Supabase
- Component library in `$lib/components/ui` with shadcn-like structure
- Drizzle ORM for database schema and queries

## Database Schema
- **Posts table**: Contains fields for title, content, slug, status (draft, scheduled, published, archived)
- **Post Images table**: Stores multiple image sizes (original, large, medium, thumbnail, blur)
- **Storage buckets**: post_images_* for different image resolutions
- **Submissions table**: User-submitted content that can be converted to posts

## TipTap Editor Implementation
- Complete the editor in `src/lib/components/admin/tip-tap.svelte`
- Implement autosave functionality that updates posts table
- Add image upload that follows the existing storage structure
- Support post workflow states (draft, scheduled, published, archived)
- Build preview functionality for drafts
- Include version history if possible

## Database Structure Reference

### Core Tables (Public Schema)

#### Posts System
```
posts table (id, title, content, slug, published, author, created_at, updated_at, submission_id, scheduled_at, status, header_image_id, featured)
├── Constraints: PRIMARY KEY (id), UNIQUE (slug)  
├── Foreign Keys: 
│   ├── author → auth.users(id)
│   ├── header_image_id → post_images(id)
│   └── submission_id → submissions(id)
├── RLS Policies:
│   ├── "Anyone can view published posts" - SELECT WHERE status='published' AND published=true
│   └── "Admins can do everything with posts" - ALL WHERE is_admin()
└── Post Status Enum: draft, scheduled, published, archived
```

#### Image Management System
```
post_images table (id, post_id, created_at, original_filename, alt_text, display_order, mime_type, 
                   original_path, original_width, original_height, original_size,
                   large_path, large_width, large_height, large_size,
                   medium_path, medium_width, medium_height, medium_size,
                   thumbnail_path, thumbnail_width, thumbnail_height, thumbnail_size,
                   blur_path, blur_width, blur_height, blur_size, last_modified, pagination_cursor)
├── Foreign Keys: post_id → posts(id) [CASCADE DELETE]
├── RLS Policies:
│   ├── "Allow anyone to view post_images" - SELECT (true)
│   └── "Allow specific users to manage post_images" - ALL WHERE auth.uid() IN (allowed_uuids)
└── Storage Integration: Links to storage.objects via path fields
```

#### Storage Buckets (Storage Schema)
```
Bucket Structure:
├── post_images_original/   - Original uploaded images
├── post_images_large/      - Large size (optimized)
├── post_images_medium/     - Medium size 
├── post_images_thumbnail/  - Small thumbnails
└── post_images_blur/       - Blur previews for progressive loading

RLS Policies per bucket:
├── Public SELECT access for all image buckets
├── Restricted INSERT/UPDATE/DELETE to specific admin UUIDs
└── Different policies per bucket type
```

#### Content Management
```
submissions table (id, created_at, name, email, subject, content, ip_address, status)
├── RLS Policies:
│   ├── "Anyone can create submissions with rate limit" - INSERT WITH rate_limit()
│   └── "Admins can manage submissions" - ALL WHERE is_admin()
└── Status: 'pending' (default), can be converted to posts

mailing_list table (id, created_at, email)
├── RLS Policies:
│   ├── "Anyone can subscribe to mailing list" - INSERT (true)
│   └── "Admins can manage mailing list" - ALL WHERE is_admin()
└── Simple email collection for newsletters

notifications table (id, created_at, user_id, title, content, read)
├── Foreign Keys: user_id → auth.users(id)
├── RLS Policies:
│   ├── "Users can view their own notifications" - SELECT WHERE user_id = auth.uid() OR is_admin()
│   └── "Admins can manage all notifications" - ALL WHERE is_admin()
└── User notification system
```

### Authentication System (Auth Schema)
```
auth.users - Supabase managed user accounts
├── Key Fields: id, email, phone, created_at, updated_at, confirmed_at
├── Authentication Methods: email/password, phone/SMS
└── Admin Detection: is_admin() function (custom)

auth.sessions - Active user sessions
├── Links to users via user_id
└── Managed by Supabase Auth

auth.identities - OAuth/Social logins
├── Links to users via user_id  
└── Stores provider-specific data
```

## Backend Architecture Navigation

### Database Connection Setup
```typescript
// Primary DB connection
src/db/index.ts - Main Drizzle database connection
├── Uses DATABASE_URL environment variable
├── Imports schema from drizzle/schema.ts
└── Exports configured db client

// Schema definitions  
drizzle/schema.ts - Complete database schema with Drizzle ORM
├── Table definitions with proper types
├── Foreign key relationships
├── RLS policy definitions
└── Enum definitions (post_status, etc.)
```

### Query Patterns
```typescript
// Posts with images
const result = await db
  .select({
    post: posts,
    headerImage: postImages
  })
  .from(posts)
  .leftJoin(postImages, eq(posts.headerImageId, postImages.id))
  .where(and(
    eq(posts.published, true),
    eq(posts.status, 'published'),
    eq(posts.slug, slug)
  ))
  .limit(1);

// Image URL construction
const imageUrl = headerImage?.largePath || headerImage?.originalPath || null;
```

### Type Safety
```typescript
// Use Drizzle inferred types
import type { InferSelectModel } from 'drizzle-orm';
import { posts } from '../../../drizzle/schema';

type Post = InferSelectModel<typeof posts>;
```

### Route Patterns
```
Frontend Routes:
├── /post/[slug] - Individual post pages (public)
├── /admin/* - Admin interface (auth required)
│   ├── /admin/posts - Post management
│   ├── /admin/media - Image management  
│   ├── /admin/editor/[id] - Post editor
│   └── /admin/submissions - User submissions
└── /auth - Authentication page

API Routes:
├── /api/posts - Post CRUD operations
├── /api/submissions - Submission handling
└── /api/auth/users - User management
```

### Security Model
```
RLS (Row Level Security) Implementation:
├── is_admin() function - Custom admin detection
├── Auth-based policies using auth.uid()
├── Public read access for published content
├── Restricted write access to specific admin UUIDs
└── Rate limiting on submissions via check_submission_rate_limit()
```

# Repository Navigation Map

## 🗂️ Core Application Structure

### 📁 Root Level Configuration
```
/
├── package.json              # Dependencies & scripts
├── drizzle.config.ts         # Drizzle ORM configuration
├── svelte.config.js          # SvelteKit configuration
├── vite.config.ts           # Vite build configuration
├── components.json          # shadcn/ui configuration
├── tsconfig.json           # TypeScript configuration
├── CLAUDE.md               # This documentation file
├── CHANGELOG.md            # Change history
└── README.md               # Project overview
```

### 📁 Database & Schema (`/drizzle/`)
```
drizzle/
├── schema.ts                # 🔑 Main database schema definitions
├── relations.ts            # Foreign key relationships
├── 0000_productive_paladin.sql # Database migration
└── meta/
    ├── 0000_snapshot.json  # Migration snapshot
    └── _journal.json       # Migration journal
```

### 📁 Source Code (`/src/`)

#### 🏠 Entry Points & Configuration
```
src/
├── app.html               # HTML template
├── app.css                # Global styles
├── halftone.css           # Comic/design styles  
├── view-transition.css    # Page transition styles
├── hooks.server.ts        # 🔑 SSR hooks & auth guard
└── db/
    └── index.ts           # 🔑 Database connection
```

#### 🗂️ Library (`/src/lib/`)
```
lib/
├── index.ts               # Main library exports
├── const.ts               # Constants
├── theme.svelte.ts        # Theme management
├── components/            # Component library
├── data/                  # Data utilities
├── hooks/                 # Svelte hooks
├── queries/               # SQL queries
├── server/                # Server-side code
└── utils/                 # Utility functions
```

#### 🧱 Component Library (`/src/lib/components/`)
```
components/
├── ui/                    # 🎨 shadcn/ui components (60+ components)
│   ├── button/
│   ├── card/
│   ├── sidebar/
│   ├── dropdown-menu/
│   └── [other ui components]
├── admin/                 # 👤 Admin interface components
│   ├── admin-header.svelte
│   ├── admin-sidebar.svelte
│   ├── dashboard-posts-table.svelte
│   ├── post-creation-form.svelte
│   ├── submissions-table.svelte
│   └── tip-tap.svelte     # Rich text editor
└── post/                  # 📝 Post display components
    ├── index.ts           # Component exports
    ├── post-card.svelte   # Blog post card
    ├── post-featured.svelte # Featured post
    └── post-list.svelte   # Post list container
```

#### 🏗️ Server-Side Code (`/src/lib/server/`)
```
server/
└── db/                    # Database operations
    ├── index.ts          # Database utilities
    ├── posts.ts          # 🔑 Post CRUD operations
    ├── schema.ts         # Additional schema
    └── submissions.ts    # Submission operations
```

#### 🛣️ Routes (`/src/routes/`)
```
routes/
├── +layout.server.ts     # Root server layout
├── +layout.svelte       # Root layout
├── +layout.ts           # Root layout load
├── (home)/              # 🏠 Public website
│   ├── +layout.svelte
│   ├── +page.server.ts  # 🔑 Home page data loading
│   ├── +page.svelte     # Home page
│   ├── about/
│   │   └── +page.svelte
│   ├── post/
│   │   └── [slug]/      # 📄 Individual post pages
│   │       ├── +page.server.ts # 🔑 Post data by slug
│   │       ├── +page.svelte
│   │       └── article-post.svelte
│   ├── submit/
│   │   ├── +page.svelte
│   │   └── submit.svelte
│   ├── desktop-nav.svelte
│   ├── footer.svelte
│   └── mobile-drawer.svelte
├── (admin)/             # 👤 Admin interface
│   ├── +layout@.svelte  # Admin layout override
│   └── admin/
│       ├── +layout.server.ts
│       ├── +page.svelte # Admin dashboard
│       ├── analytics/   # 📊 Analytics page
│       ├── editor/      # ✏️ Post editor
│       │   ├── +page.server.ts
│       │   ├── +page.svelte
│       │   └── [id]/    # Edit specific post
│       ├── mailing-list/ # 📧 Email subscribers
│       ├── media/       # 🖼️ Image management
│       ├── posts/       # 📝 Post management
│       │   ├── +page.server.ts # 🔑 Post listing
│       │   └── +page.svelte
│       ├── settings/    # ⚙️ Configuration
│       └── submissions/ # 📬 User submissions
├── auth/                # 🔐 Authentication
│   ├── +page.server.ts  # 🔑 Login/logout logic
│   └── +page.svelte     # Login form
└── api/                 # 🔌 API endpoints
    ├── auth/
    │   └── users/
    ├── posts/           # Post CRUD API
    │   ├── +server.ts
    │   └── [id]/
    │       └── +server.ts
    └── submissions/     # Submission API
        ├── +server.ts
        ├── [id]/
        └── convert/
```

## 🔍 Key File Reference Guide

### 🔑 Essential Files to Know
| File | Purpose | When to Edit |
|------|---------|--------------|
| `drizzle/schema.ts` | Database schema | Adding tables/columns |
| `src/hooks.server.ts` | Auth & SSR setup | Authentication changes |
| `src/db/index.ts` | DB connection | Database config changes |
| `src/lib/server/db/posts.ts` | Post operations | Post CRUD logic |
| `src/routes/(home)/+page.server.ts` | Home page data | Home page queries |
| `src/routes/(home)/post/[slug]/+page.server.ts` | Post page data | Individual post queries |
| `src/routes/(admin)/admin/posts/+page.server.ts` | Admin post list | Admin post management |

### 📊 Data Flow Architecture
```
Frontend Component → +page.server.ts → lib/server/db/*.ts → drizzle/schema.ts → Database
     ↑                                                                              ↓
User Interface ← Processed Data ← Database Query Results ← Drizzle ORM ← SQL Tables
```

### 🎨 Styling Architecture
```
app.css (Global) → Component-specific styles → tailwind classes → UI components
halftone.css (Theme) → Comic book visual effects
view-transition.css → Page transition animations
```

### 🔐 Authentication Flow
```
User Request → hooks.server.ts (authGuard) → Supabase Auth → Database RLS → Protected Route
```

### 🗄️ Database Relationships
```
posts (main content)
├── author → auth.users (1:1)
├── header_image_id → post_images (1:1)
├── submission_id → submissions (1:1)
└── post_images.post_id ← post_images (1:many)

storage.objects (files)
└── Referenced by post_images paths
```

## 🛠️ Development Guidelines
- Always use Drizzle ORM with proper type inference
- Join post_images when displaying posts to get header images
- Use slug-based routing instead of ID-based
- Respect RLS policies - queries will automatically filter based on user permissions
- Image URLs should prefer large_path over original_path for performance
- Use transactions for multi-table operations (posts + images)
- Make incremental changes with minimal diffs and update CHANGELOG.md
- Be critical of implementation suggestions and reference Supabase docs
- Require complete Supabase context before implementing major features
- Follow existing RLS policies for data access

## 🚀 Quick Navigation Commands
- **Find component**: `src/lib/components/[ui|admin|post]/`
- **Find route**: `src/routes/(home|admin)/`
- **Find database code**: `src/lib/server/db/`
- **Find API endpoint**: `src/routes/api/`
- **Find types**: Look for `+page.server.ts` files
- **Find styles**: `src/app.css`, `src/halftone.css`

# 🧱 Component Architecture & Map

## 📍 Component Organization Strategy

**Principle**: Components are organized **closest to their routes** for better maintainability and clearer ownership.

### 🏗️ New Component Structure

```
src/
├── lib/components/ui/          # 🎨 Global UI components (shadcn/ui)
│   ├── button/
│   ├── card/
│   ├── input/
│   ├── sidebar/
│   └── [60+ other UI components]
│
├── routes/
│   ├── (home)/                 # 🏠 Public website components
│   │   ├── components/         # Home route specific components
│   │   │   ├── index.ts        # Component exports
│   │   │   ├── post-card.svelte          # Blog post preview cards
│   │   │   ├── post-featured.svelte      # Featured post display
│   │   │   ├── post-list.svelte          # Post list container
│   │   │   ├── article-post.svelte       # Full article view
│   │   │   └── navigation/               # Navigation components
│   │   │       ├── desktop-nav.svelte   # Desktop navigation
│   │   │       ├── mobile-drawer.svelte # Mobile navigation drawer
│   │   │       └── footer.svelte        # Site footer
│   │   │
│   │   └── submit/
│   │       └── components/
│   │           └── submit-form.svelte    # User submission form
│   │
│   └── (admin)/                # 👤 Admin interface components
│       └── components/         # Admin route specific components
│           ├── admin-header.svelte       # Admin top navigation
│           ├── admin-sidebar.svelte      # Admin side navigation
│           ├── tip-tap.svelte           # Rich text editor
│           ├── post-creation-form.svelte # New post form
│           ├── submissions-table.svelte  # User submissions table
│           └── dashboard-posts-table.svelte # Post management table
```

## 🎯 Component Naming Conventions

### ✅ Correct Naming (kebab-case)
- `post-card.svelte` ✓
- `admin-header.svelte` ✓
- `submit-form.svelte` ✓
- `desktop-nav.svelte` ✓

### ❌ Avoided Naming (PascalCase/camelCase)
- `PostCard.svelte` ❌
- `AdminHeader.svelte` ❌
- `submitForm.svelte` ❌

## 🔄 Svelte 5 Component Patterns

### 💫 Props Definition (Type-safe)
```typescript
<script lang="ts">
  interface Props {
    slug: string;
    title: string;
    description?: string;
    author: string;
    date: string;
    categories?: string[];
    imageUrl?: string | null;
  }

  let { slug, title, description = "", author, date, categories = [], imageUrl }: Props = $props();
</script>
```

### 🔄 State Management
```typescript
// Reactive state
let isOpen = $state(false);
let count = $state(0);

// Derived values
let doubled = $derived(count * 2);
let isEven = $derived(count % 2 === 0);

// Effects
$effect(() => {
  console.log(`Count changed to: ${count}`);
});
```

### 🎬 Event Handling
```typescript
// Modern event handling
function handleClick() {
  isOpen = !isOpen;
}

function handleSubmit(event: SubmitEvent) {
  event.preventDefault();
  // Handle form submission
}
```

## 🎨 Latest shadcn/ui Patterns

### 🏷️ Component Imports
```typescript
// Individual component imports (preferred)
import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
import { Button } from "$lib/components/ui/button";
import { Badge } from "$lib/components/ui/badge";

// Namespace imports (when needed)
import * as Dialog from "$lib/components/ui/dialog";
import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
```

### 🎛️ Component Usage Patterns
```svelte
<!-- Card with proper structure -->
<Card class="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Post Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Post content goes here...</p>
  </CardContent>
</Card>

<!-- Button variants -->
<Button variant="default" size="sm">Primary</Button>
<Button variant="outline" size="sm">Secondary</Button>
<Button variant="ghost" size="sm">Ghost</Button>

<!-- Dropdown menu -->
<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button variant="ghost" builders={[builder]}>Menu</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item>Edit</DropdownMenu.Item>
    <DropdownMenu.Item>Delete</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

## 🗺️ Component Usage Map

### 🏠 Home Route Components
| Component | Used In | Purpose |
|-----------|---------|---------|
| `post-card.svelte` | Home page, search results | Blog post preview cards |
| `post-featured.svelte` | Home page | Hero featured post |
| `post-list.svelte` | Home page, category pages | Container for post cards |
| `article-post.svelte` | `/post/[slug]` | Full article display |
| `desktop-nav.svelte` | Home layout | Desktop navigation |
| `mobile-drawer.svelte` | Home layout | Mobile navigation |
| `footer.svelte` | Home layout | Site footer |
| `submit-form.svelte` | `/submit` page | User content submission |

### 👤 Admin Route Components  
| Component | Used In | Purpose |
|-----------|---------|---------|
| `admin-header.svelte` | Admin layout | Top navigation with user menu |
| `admin-sidebar.svelte` | Admin layout | Side navigation menu |
| `tip-tap.svelte` | Editor pages | Rich text editor |
| `post-creation-form.svelte` | Dashboard | Quick post creation |
| `submissions-table.svelte` | Submissions page | User content management |
| `dashboard-posts-table.svelte` | Dashboard | Post overview table |

### 🎨 UI Components (Global)
| Category | Components | Purpose |
|----------|------------|---------|
| **Layout** | Card, Sidebar, Sheet, Dialog | Structural components |
| **Forms** | Input, Button, Textarea, Select, Checkbox | Form controls |
| **Navigation** | Breadcrumb, Pagination, Dropdown Menu | Navigation elements |
| **Feedback** | Badge, Alert, Progress, Toast | User feedback |
| **Data Display** | Table, Calendar, Avatar, Separator | Information display |

## 🔄 Migration Benefits

### ✅ Improved Organization
- **Route Proximity**: Components live next to where they're used
- **Clear Ownership**: Easy to see which components belong to which routes
- **Reduced Imports**: Shorter import paths for route-specific components

### ✅ Better Maintainability
- **Isolated Changes**: Modifying home components won't affect admin
- **Easier Refactoring**: Clear boundaries between different app sections
- **Component Discovery**: Developers know exactly where to find components

### ✅ Modern Patterns
- **Svelte 5 Syntax**: Using latest `$props()`, `$state()`, `$derived()`
- **TypeScript**: Proper type safety with interface definitions
- **shadcn/ui Latest**: Updated to current component patterns

## 🚀 Component Development Guidelines

### 📝 Creating New Components
1. **Placement**: Place components in the route directory where they'll be used
2. **Naming**: Use kebab-case for file names
3. **Structure**: Follow Svelte 5 patterns with TypeScript
4. **Props**: Define clear interfaces for type safety
5. **Exports**: Update relevant index.ts files

### 🔧 Component Best Practices
- **Single Responsibility**: Each component should have one clear purpose
- **Reusability**: Consider if a component could be used elsewhere before making it route-specific
- **Accessibility**: Include proper ARIA attributes and semantic HTML
- **Performance**: Use `$derived()` for computed values instead of reactive statements
- **Type Safety**: Always define proper TypeScript interfaces for props