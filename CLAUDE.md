# TableTech Website - Project Context

## Project Overview
TableTech is a modern restaurant management platform that streamlines operations through AI-powered solutions. The website serves as the primary marketing and information portal for the TableTech system.

## Current Branch Status
Working in: **main** branch  
Recent updates: Fully responsive HeroSection with interactive demo overlays

## Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with extensive responsive breakpoints
- **Animations**: Lottie, Framer Motion
- **Internationalization**: i18next (Dutch/English)
- **State Management**: React hooks (useState, lazy loading)
- **Performance**: Suspense, lazy loading, preloading
- **Smooth Scrolling**: Lenis
- **Testing**: Vitest
- **Linting**: ESLint
- **Deployment**: GitHub Pages (tabletech.nl)

## Project Structure
```
/src
├── components/          # Reusable UI components
│   ├── DemoOverlay.tsx     # Customer demo modal
│   ├── DemoOverlay-laptop.tsx # Employee demo modal
│   ├── LaptopMockup.tsx    # Interactive laptop component
│   ├── Navbar.tsx          # Navigation with language switcher
│   ├── Footer.tsx          # Footer component
│   ├── Layout.tsx          # Main layout wrapper
│   └── ...
├── pages/              # Page components
│   ├── LandingPage/    # Landing page sections
│   │   ├── HeroSection.tsx     # Interactive hero with demos
│   │   ├── Benefits.tsx        # Benefits sections
│   │   └── ...
│   ├── MenuDemo/       # Demo functionality
│   └── ...
├── locales/            # Translation files
│   ├── en/translation.json
│   └── nl/translation.json
├── assets/             # Static assets
│   ├── afbeeldingen/   # Images and mockups
│   └── ...
├── utils/              # Utility functions
│   ├── useBreakpoint.ts
│   └── Responsive.tsx
└── styles/             # Additional CSS files
```

## Key Features
1. **Multi-language Support**: Dutch (primary) and English with i18next
2. **Responsive Design**: Mobile-first approach with comprehensive breakpoint utilities (xs, sm, md, lg, xl, 2xl, 3xl, 4xl)
3. **Interactive Demo System**: 
   - QR code demos for customer experience
   - Laptop mockup demos for employee dashboard
   - Modal overlays with lazy loading
   - Loading states and preloading
4. **Performance Optimized**: 
   - Lazy loading of demo components
   - Suspense fallbacks
   - Preloading functionality
5. **State Management**: React hooks for demo interactions
6. **Real Assets**: QR code images and interactive laptop mockups
7. **Smooth Scrolling**: Lenis integration for smooth page navigation

## Responsive Breakpoints
```css
xs:     475px+   /* Extra small phones */
sm:     640px+   /* Small phones */
md:     768px+   /* Tablets - demo panels side by side */
lg:     1024px+  /* Small desktops */
xl:     1280px+  /* Large desktops */
2xl:    1536px+  /* Extra large screens */
3xl:    1600px+  /* Ultra-wide screens */
4xl:    1920px+  /* 4K screens */
```

## HeroSection Features
- **Responsive Layout**: Two-panel desktop layout, stacked mobile
- **Interactive Demos**: 
  - Customer demo with scannable QR code
  - Employee demo with laptop mockup
- **State Management**: Demo overlay states, loading states
- **Performance**: Lazy loaded demo components with Suspense
- **Responsive Scaling**: All elements scale across breakpoints
- **Mobile Optimization**: Scaled QR codes and laptop mockups

## Development Commands
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run test       # Run tests with Vitest
```

## Important Files
- `vite.config.ts`: Build configuration with compression and optimization
- `Tailwindconfig.js`: Tailwind CSS configuration with custom breakpoints
- `src/i18n.js`: Internationalization setup
- `src/App.tsx`: Main routing configuration
- `src/pages/LandingPage/HeroSection.tsx`: Main hero component with demos
- `index.html`: Entry HTML with SEO meta tags

## Business Context
TableTech provides:
- **QR Code Ordering**: Customers scan QR codes to order directly
- **AI-Powered Management**: Smart inventory and staff management
- **Real-time Analytics**: Dashboard for restaurant insights
- **Multi-location Support**: Manage multiple restaurant locations
- **Integration Capabilities**: POS system integrations

## Target Audience
- Restaurant owners and managers
- Hospitality businesses looking to digitize operations
- Multi-location restaurant chains
- Tech-forward dining establishments

## Design Principles
- **Modern & Clean**: Minimalist design with focus on usability
- **Tech-Forward**: Showcasing AI and automation capabilities
- **Trust Building**: Professional appearance with clear value propositions
- **Performance**: Fast loading, optimized assets, smooth animations
- **Mobile-First**: Responsive design prioritizing mobile experience

## MCP Servers Configuration

### Complete claude_desktop_config.json
```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "--rootDir",
        "C:/Users/Wish/Documents/TableTech-website"
      ]
    },
    "data-postgrest": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-postgrest",
        "--url",
        "http://localhost:3000",
        "--schema",
        "public"
      ],
      "env": {
        "POSTGREST_API_KEY": ""
      }
    },
    "magic-ui": {
      "command": "npx",
      "args": ["-y", "@magicuidesign/mcp"]
    }
  },
  "claude": {
    "defaultMCPServers": [
      "sequential-thinking",
      "filesystem",
      "data-postgrest",
      "magic-ui"
    ],
    "contextInstructions": [
      "Stap 1 — Denk eerst: gebruik sequential-thinking MCP om de taak in numbered 'thoughts' op te breken met subdoelen en beslismomenten. Formuleer expliciet welke data/tools je nodig hebt.",
      "Stap 2 — Data pas daarna: als je data nodig acht, gebruik eerst filesystem om relevante bestanden te lezen; gebruik daarna data-postgrest voor DB-queries.",
      "Stap 3 — UI Components: gebruik magic-ui MCP voor het genereren en optimaliseren van moderne UI componenten met animations en effects.",
      "Stap 4 — Valideer: check de uitkomst (tests/constraints) en rapporteer eventuele onzekerheden."
    ]
  }
}
```

### MCP Server Workflow
1. **Sequential-Thinking MCP**: Taken opdelen in numbered thoughts met subdoelen
2. **Filesystem MCP**: Project bestanden lezen en navigeren  
3. **Data-PostgREST MCP**: Database queries via PostgREST API
4. **Magic UI MCP**: AI-geholpen UI component workflows voor moderne, geanimeerde componenten

## Current State
- Website is live at tabletech.nl
- Active development in main branch
- Recently updated HeroSection with:
  - Full responsive design across all breakpoints
  - Interactive QR code and laptop demo system
  - Lazy loading and performance optimizations
  - i18n integration
  - State management for demo interactions

## Testing Strategy
- Unit tests for utility functions (useBreakpoint, etc.)
- Component testing with Vitest
- Responsive design testing across devices
- Demo interaction testing

## Deployment
- Hosted on GitHub Pages
- Custom domain: tabletech.nl
- CNAME file in /public for domain configuration
- Automated deployment via GitHub Actions (if configured)

## Code Style Guidelines
- TypeScript for type safety
- Functional React components with hooks
- Tailwind CSS for styling with comprehensive responsive utilities
- Component-based architecture
- i18n keys for all text content
- Performance-first approach with lazy loading

## Performance Optimizations
- Lazy loading with React.lazy
- Suspense components for loading states
- Image optimization
- Vite build optimizations
- Compression enabled in production
- Preloading for demo components

## Common Tasks
- **Add new translation**: Update both `/src/locales/en/translation.json` and `/src/locales/nl/translation.json`
- **Create new page**: Add component in `/src/pages/`, update routing in `App.tsx`
- **Add new component**: Place in `/src/components/` with proper TypeScript types
- **Update styling**: Use Tailwind classes with comprehensive responsive utilities
- **Add demo functionality**: Integrate with existing overlay system

## Recent Updates
- **HeroSection.tsx**: Completely responsive with interactive demo system
- **Breakpoint system**: Extended with xs, 3xl, 4xl breakpoints
- **Demo system**: QR code and laptop mockup demos with overlays
- **Performance**: Lazy loading, Suspense, preloading implemented
- **State management**: React hooks for demo interactions
- **i18n**: Full internationalization support

## Notes
- Primary language is Dutch (nl)
- Mobile-first responsive design approach
- Focus on restaurant digitalization and efficiency
- Clean, modern aesthetic with tech-forward branding
- Performance-optimized with lazy loading and Suspense
- Interactive demo system with real assets