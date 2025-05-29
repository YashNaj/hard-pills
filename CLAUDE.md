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

## Development Guidelines
- Make incremental changes with minimal diffs and update CHANGELOG.md
- Be critical of implementation suggestions and reference Supabase docs
- Require complete Supabase context before implementing major features
- Follow existing RLS policies for data access