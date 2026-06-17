---
name: ui-design-mcp
description: Generates and refines React UI via 21st.dev MCP (@21st-dev/magic). Use when building or polishing WishList components, pages, cards, forms, or when the user asks for beautiful UI, /21, or 21st components.
---

# UI Design via 21st MCP

## When to Use

- Creating new React components for WishList
- User asks for beautiful UI, design polish, or mentions `/21` / `21st`
- Refining existing components visually

## MCP Server

`@21st-dev/magic` — must be enabled in Cursor MCP settings.

## Tools

| Tool | Use case |
|------|----------|
| `21st_magic_component_builder` | New component from description |
| `21st_magic_component_inspiration` | Browse 21st.dev for references (no code) |
| `21st_magic_component_refiner` | Improve existing component code |
| `logo_search` | Brand logos as TSX |

## Workflow

1. Read target file and project conventions (`frontend/`, Tailwind, `cn()` from `@/lib/utils`)
2. Call `21st_magic_component_builder` with:
   - `message` — full user request
   - `searchQuery` — 2–4 words for 21st.dev search
   - `absolutePathToCurrentFile` — file being edited
   - `absolutePathToProjectDirectory` — `frontend/` root
   - `standaloneRequestQuery` — concrete component spec
3. Integrate returned snippet into `frontend/src/components/`
4. Match imports: `lucide-react`, `@/lib/utils`, Tailwind classes
5. Keep text in Russian for WishList UI

## Project Conventions

- Components in `frontend/src/components/`
- Use `cn()` from `src/lib/utils.ts`
- Warm neutral palette; accent for CTAs
- Responsive: mobile-first grid

## Example Prompt to Builder

```
Wishlist product card: image, title, price in ₽, Ozon link, delete button.
Tailwind, rounded-xl, subtle shadow, hover lift.
```
