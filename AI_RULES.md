# AI Development Rules

This document outlines the technology stack and provides clear guidelines for making code changes to this application. Following these rules ensures consistency, maintainability, and adherence to best practices.

## Technology Stack

This project is built with a modern, type-safe, and efficient technology stack:

-   **Framework**: React with Vite for a fast development experience.
-   **Language**: TypeScript for static typing and improved code quality.
-   **Styling**: Tailwind CSS for a utility-first styling approach.
-   **UI Components**: shadcn/ui, a collection of beautifully designed, accessible, and customizable components.
-   **Routing**: React Router (`react-router-dom`) for client-side navigation.
-   **Backend & Authentication**: Supabase for database, authentication, and other backend services.
-   **Form Management**: React Hook Form for performant and flexible forms.
-   **Schema Validation**: Zod for powerful, type-safe data validation.
-   **Data Fetching**: TanStack Query (React Query) for managing server state, caching, and data synchronization.
-   **Icons**: Lucide React for a comprehensive and consistent set of icons.

## Library Usage Rules

To maintain consistency, please adhere to the following rules when choosing libraries for specific tasks:

-   **UI Components**:
    -   **ALWAYS** use components from the `shadcn/ui` library (`@/components/ui/*`).
    -   If a required component does not exist in `shadcn/ui`, create a new, reusable component in `src/components/` following the same architectural style (using `clsx`, `tailwind-merge`, and CVA where appropriate).
    -   Do **NOT** install new, third-party UI component libraries.

-   **Styling**:
    -   **ALWAYS** use Tailwind CSS utility classes for styling.
    -   Define custom colors, fonts, and theme variables in `tailwind.config.ts` and `src/index.css` under the `@layer base` directive.
    -   Avoid writing custom CSS files. Use them only as a last resort for complex global styles or animations not achievable with Tailwind.

-   **Routing & Navigation**:
    -   Use `react-router-dom` for all routing.
    -   Define all application routes within `src/App.tsx`.
    -   Use the custom `NavLink` component (`@/components/NavLink.tsx`) for navigation links that require active styling.

-   **State Management**:
    -   For **server state** (data fetched from Supabase), **ALWAYS** use `@tanstack/react-query`.
    -   For **global client state** (e.g., authentication status, theme), use React Context. The `AuthContext` is a primary example.
    -   For **local component state**, use React's built-in hooks like `useState` and `useReducer`.

-   **Forms**:
    -   **ALWAYS** use `react-hook-form` for handling form state, submission, and validation.
    -   Pair it with `zod` and `@hookform/resolvers/zod` for schema-based validation.
    -   Use the `Form` components from `shadcn/ui` (`@/components/ui/form.tsx`) to structure forms accessibly.

-   **Backend Interaction**:
    -   Use the pre-configured Supabase client from `@/integrations/supabase/client.ts` for all database queries, authentication calls, and other backend interactions.
    -   Do **NOT** instantiate a new Supabase client elsewhere.

-   **Icons**:
    -   **ONLY** use icons from the `lucide-react` package. This ensures visual consistency across the application.

-   **User Notifications**:
    -   For standard feedback like success or error messages after an action, use the `toast` function from the custom `useToast` hook (`@/hooks/use-toast.ts`).
    -   For more subtle, real-time notifications, you may use the `Sonner` component.