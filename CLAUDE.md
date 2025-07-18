# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a basic React application bootstrapped with Vite. It's a minimal setup designed for learning or testing purposes, containing only the essential structure of a React app with a simple counter component.

## Development Commands

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Architecture

The application follows a standard Vite + React structure:

- **Entry point**: `src/main.jsx` - React app initialization with StrictMode
- **Root component**: `src/App.jsx` - Main application component with counter functionality
- **Styling**: `src/App.css` and `src/index.css` - Component and global styles
- **Build configuration**: `vite.config.js` - Standard Vite config with React plugin
- **Linting**: `eslint.config.js` - ESLint configuration with React hooks and refresh plugins

## Key Technologies

- **React 19.1.0** - UI library
- **Vite 7.0.4** - Build tool and development server
- **ESLint** - Code linting with React-specific rules
- **ES Modules** - Module system (type: "module" in package.json)

## Development Notes

- The app uses modern React patterns with hooks (useState)
- ESLint is configured to ignore unused variables following pattern `^[A-Z_]`
- No testing framework is currently configured
- No TypeScript setup (JavaScript only)
- Public assets are served from the `public/` directory