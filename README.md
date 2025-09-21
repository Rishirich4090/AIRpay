Frontend: React 18 + React Router 6 (spa) + TypeScript + Vite + TailwindCSS 3
Backend: Express server integrated with Vite dev server
Testing: Vitest
UI: Radix UI + TailwindCSS 3 + Lucide React icons
Project Structure
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
├── components/ui/        # Pre-built UI component library
├── App.tsx                # App entry point and with SPA routing setup
└── global.css            # TailwindCSS 3 theming and global styles

server/                   # Express API backend
├── index.ts              # Main server setup (express config + routes)
└── routes/               # API handlers

shared/                   # Types used by both client & server
└── api.ts                # Example of how to share api interfaces
Key Features
SPA Routing System
The routing system is powered by React Router 6:

client/pages/Index.tsx represents the home page.
Routes are defined in client/App.tsx using the react-router-dom import
Route files are located in the client/pages/ directory
For example, routes can be defined with:

import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>;
Styling System
Primary: TailwindCSS 3 utility classes
Theme and design tokens: Configure in client/global.css
UI components: Pre-built library in client/components/ui/
Utility: cn() function combines clsx + tailwind-merge for conditional classes
// cn utility usage
className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className  // User overrides
)}
Express Server Integration
Development: Single port (8080) for both frontend/backend
Hot reload: Both client and server code
API endpoints: Prefixed with /api/
Example API Routes
GET /api/ping - Simple ping api
GET /api/demo - Demo endpoint
Shared Types
Import consistent types in both client and server:

import { DemoResponse } from '@shared/api';
Path aliases:

@shared/* - Shared folder
@/* - Client folder
Development Commands
npm run dev        # Start dev server (client + server)
npm run build      # Production build
npm run start      # Start production server
npm run typecheck  # TypeScript validation
npm test          # Run Vitest tests
Adding Features
Add new colors to the theme
Open client/global.css and tailwind.config.ts and add new tailwind colors.

New API Route
Optional: Create a shared interface in shared/api.ts:
export interface MyRouteResponse {
  message: string;
  // Add other response properties here
}
Create a new route handler in server/routes/my-route.ts:
import { RequestHandler } from "express";
import { MyRouteResponse } from "@shared/api"; // Optional: for type safety

export const handleMyRoute: RequestHandler = (req, res) => {
  const response: MyRouteResponse = {
    message: 'Hello from my endpoint!'
  };
  res.json(response);
};
Register the route in server/index.ts:
import { handleMyRoute } from "./routes/my-route";

// Add to the createServer function:
app.get("/api/my-endpoint", handleMyRoute);
Use in React components with type safety:
import { MyRouteResponse } from '@shared/api'; // Optional: for type safety

const response = await fetch('/api/my-endpoint');
const data: MyRouteResponse = await response.json();
New Page Route
Create component in client/pages/MyPage.tsx
Add route in client/App.tsx:
<Route path="/my-page" element={<MyPage />} />
Production Deployment
Standard: npm run build + npm start
Binary: Self-contained executables (Linux, macOS, Windows)
Cloud Deployment: Use either Netlify or Vercel via their MCP integrations for easy deployment. Both providers work well with this starter template.
Architecture Notes
Single-port development with Vite + Express integration
TypeScript throughout (client, server, shared)
Full hot reload for rapid development
Production-ready with multiple deployment options
Comprehensive UI component library included
Type-safe API communication via shared interfaces
