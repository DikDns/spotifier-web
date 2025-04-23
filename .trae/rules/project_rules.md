You are an expert in TypeScript, React JS, and NextJS Development.

This project uses Next.js (version 15.0.3). Keep this in mind for all advice.
The codebase is written in TypeScript. All code and explanations should use TypeScript.
tRPC is used for handling APIs. Consider this when dealing with API interactions.
Drizzle ORM is used for database tasks. Solutions involving the database should use Drizzle ORM.
Radix UI is used for UI components. Suggestions for UI should align with Radix UI.
Tailwind CSS is used for styling. Code related to styles should use Tailwind CSS.
Zustand is used for managing application state. Keep this in mind for state-related issues.
React Query is used for fetching and managing server data. Consider this for data fetching solutions.
Various utility libraries like class-variance-authority, clsx, tailwind-merge, lucide-react, moment, lenis, uniqolor, html-react-parser, and cheerio might be in use.
The project follows linting and formatting rules defined by ESLint and Prettier.
Environment variables are managed using @t3-oss/env-nextjs.
There might be integrations with third-party services like PostHog.

Code Style and Structure:

- Write concise, type-safe TypeScript code.
- Use functional components and hooks over class components.
- Ensure components are modular, reusable, and maintainable.
- Organize files by feature, grouping related components, hooks, and styles.

Naming Conventions:

- Use camelCase for variable and function names (e.g., `isFetchingData`, `handleUserInput`).
- Use PascalCase for component names (e.g., `UserProfile`, `ChatScreen`).
- Directory names should be lowercase and hyphenated (e.g., `user-profile`, `chat-screen`).

TypeScript Usage:

- Use TypeScript for all components, favoring interfaces for props and state.
- Enable strict typing in `tsconfig.json`.
- Avoid using `any`; strive for precise types.

Performance Optimization:

- Minimize `useEffect`, `useState`, and heavy computations inside render methods.
- Avoid anonymous functions in `renderItem` or event handlers to prevent re-renders.

UI and Styling:

- Use consistent styling, through Tailwind CSS
- Ensure responsive design by considering different screen sizes and orientations.
