# Navbar Components

This directory contains three specialized navbar components for different user contexts, all using consistent styling based on the HomepageNavbar design.

## Components

### 1. HomepageNavbar

-   **Purpose**: Landing page navigation with smooth scrolling to sections
-   **Features**:
    -   Navigation links (Home, Features, FAQs)
    -   CTA buttons (Sign In, Create Resume)
    -   Mobile-responsive hamburger menu
    -   Smooth scrolling to page sections
-   **Usage**: Automatically used on the homepage (`/`)

### 2. UserNavbar

-   **Purpose**: Authenticated user dashboard navigation
-   **Features**:
    -   Navigation buttons: Generate, Jobs, Profile
    -   User profile display with dropdown menu
    -   Sign out functionality
    -   Mobile-responsive hamburger menu
    -   Consistent styling with HomepageNavbar
-   **Usage**: Automatically used on `/dashboard` and `/profile` routes

### 3. AdminNavbar

-   **Purpose**: Admin panel navigation
-   **Features**:
    -   Admin-specific navigation (Dashboard, Users, Jobs)
    -   User role display
    -   Admin panel branding
    -   Mobile-responsive design
    -   Consistent styling with HomepageNavbar
-   **Usage**: Automatically used on `/admin/*` routes for admin users

### 4. Navbar (Main Component)

-   **Purpose**: Smart router that automatically selects the appropriate navbar
-   **Logic**:
    -   Admin routes (`/admin/*`) → AdminNavbar (for admin users)
    -   Dashboard routes (`/dashboard`, `/profile`) → UserNavbar (for authenticated users)
    -   All other routes → HomepageNavbar

## Styling Consistency

All navbars now use the same visual design:

-   **Layout**: Fixed positioning with high z-index
-   **Background**: White with 95% opacity and backdrop blur
-   **Borders**: Light gray borders with subtle shadows
-   **Colors**: Consistent blue-to-purple gradient branding
-   **Typography**: Same font weights and sizes
-   **Spacing**: Consistent spacing between elements
-   **Responsiveness**: Mobile-first design with hamburger menus

## Navigation Buttons

### HomepageNavbar

-   Home, Features, FAQs (smooth scroll)
-   Sign In, Create Resume (CTA buttons)

### UserNavbar

-   Generate (links to `/dashboard`)
-   Jobs (links to `/jobs`)
-   Profile (links to `/profile`)
-   User menu dropdown with sign out

### AdminNavbar

-   Dashboard (links to `/admin/dashboard`)
-   Users (links to `/admin`)
-   Jobs (links to `/admin/jobs`)
-   Admin user menu dropdown with sign out

## Usage

Simply import and use the main `Navbar` component in your pages:

```tsx
import Navbar from "@/components/Navbar";

// The component automatically selects the right navbar based on:
// - Current route
// - User authentication status
// - User role
```

## Customization

To modify a specific navbar:

1. Edit the individual component file (e.g., `HomepageNavbar.tsx`)
2. The main `Navbar.tsx` will automatically use your changes
3. All navbars maintain consistent visual identity while serving different functional purposes

## Mobile Experience

All navbars feature:

-   Hamburger menu for mobile devices
-   Responsive button layouts
-   Touch-friendly interactions
-   Consistent mobile styling across all variants
