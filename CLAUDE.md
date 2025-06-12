# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit mockup for a form editing table interface using Svelte 5's new runes syntax. The project demonstrates an editable table with form controls that can be reordered, edited, and deleted. It simulates a form builder interface for government grant applications.

## Development Commands

- `npm run dev` - Start development server
- `npm run dev -- --open` - Start dev server and open browser
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Type check with svelte-check
- `npm run check:watch` - Type check in watch mode
- `npm run lint` - Run ESLint and Prettier checks
- `npm run format` - Format code with Prettier

## Architecture

The project uses:
- **SvelteKit** as the full-stack framework
- **Svelte 5** with runes syntax (`$state`, `$derived`, etc.)
- **TailwindCSS v4** for styling with **DaisyUI** components
- **Material Design Icons** via `@jamescoyle/svelte-icon` and `@mdi/js`
- **TypeScript** for type safety

### Core Data Structure

The `FormControlRow` type defines the shape of form fields:
- `id` - Unique identifier
- `title` - Display name of the field
- `type` - One of: TEXTBOX, TEXTAREA, CHECKBOX, RADIOBUTTONLIST
- `placeholder?` - For text inputs
- `defaultChecked?` - For checkbox fields
- `options?` - Newline-separated options for radio button lists
- `required` - Boolean flag
- `online` - Status indicator (true = green, false = red)

### Key Features

The main interface (`src/routes/+page.svelte`) implements:

**Table Management:**
- Multi-select with "select all" functionality
- Row reordering (up/down arrows)
- Inline editing via expandable row details
- Individual row deletion
- Bulk operations (delete selected, mark required/optional)

**Form Field Types:**
- Text boxes and text areas (with placeholder text)
- Checkboxes (with default checked state)
- Radio button lists (with configurable options)

**State Management:**
- `rows` - Array of FormControlRow objects
- `checked` - Array of selected row IDs
- `editingRows` - Set of row IDs currently being edited
- `newRow` - Object for the "Add New Field" form

**Quick Add Interface:**
- Bottom section for rapidly adding new fields
- Type-specific options that appear based on selection
- Auto-focus on title input after adding for fast entry

### Styling

- TailwindCSS v4 with DaisyUI plugin for component styling
- Status indicators using DaisyUI status classes
- Responsive grid layout for the add form
- CSS is configured in `src/app.css` with `@import` directives