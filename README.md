# Spark Pixel — Custom Printing & Live Design Studio

Spark Pixel is a modern, full-featured web application for on-demand custom printing and merchandise personalization. Users can select merchandise (apparel, mugs, homeware, posters), design custom artwork using an interactive multi-layer studio canvas, get AI-powered creative suggestions, preview their products in real time, and place orders.

---

## ✨ Features

- **🛍️ Product Catalog & Categorization**
  - Explore apparel (T-shirts, hoodies, totes), drinkware (ceramic mugs, travel tumblers), and print products (posters, canvas prints).
  - Filter products dynamically by category with responsive product cards and pricing details.

- **🎨 Interactive Live Design Studio**
  - Real-time product mockup canvas with designated printable zones.
  - Add text with customizable fonts, colors, sizes, alignment, and letter tracking.
  - Upload custom artwork, illustrations, or photos via drag-and-drop or file picker.
  - Add vector shapes (circles, rectangles, accent lines) with custom stroke and fill colors.
  - Multi-touch & pointer-enabled draggable, rotatable, and resizable design elements.
  - Layer ordering (Bring Forward, Send Backward) and element deletion.

- **💡 AI-Powered Creative Assistant**
  - Integrated with the `@google/genai` SDK using Gemini models to generate descriptive merchandise concepts and visual layout ideas based on theme prompts.
  - Safe lazy initialization and fallback design generator for instant creativity in all environments.

- **🛒 Shopping Cart & Checkout**
  - Persistent multi-item cart with live item count badge in the header.
  - Adjustable item quantities and instant removal in the checkout summary.
  - Automated canvas composite preview generation and export for accurate print rendering.
  - Streamlined checkout flow with guest checkout support and demo account switching.

- **👤 User Profile & Order Tracking**
  - View order history with full itemized breakdowns, dates, statuses, and custom design thumbnails.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite
- **Styling**: Tailwind CSS
- **AI Integration**: `@google/genai` SDK
- **Icons**: Custom SVG icons with Lucide iconography patterns

---

## 📁 Project Structure

```
├── App.tsx                     # Main application container & view routing
├── index.html                  # HTML entry point
├── index.tsx                   # React root mount
├── metadata.json               # Application metadata and capabilities
├── package.json                # Project dependencies and scripts
├── types.ts                    # TypeScript data models and interfaces
├── vite.config.ts              # Vite build configuration
├── components/
│   ├── Button.tsx              # Reusable button component
│   ├── Footer.tsx              # Application footer
│   ├── Header.tsx              # Navigation bar with cart badge and user menu
│   ├── ProductCard.tsx         # Product display card
│   └── icons.tsx               # Vector icon components
├── contexts/
│   └── AppContext.tsx          # Global application state (cart, user, orders)
├── database/
│   └── mockDatabase.ts         # Mock product catalog, users, and order repository
├── pages/
│   ├── CheckoutPage.tsx        # Cart summary, shipping, payment, and order confirmation
│   ├── DesignStudioPage.tsx    # Interactive canvas editor with AI ideation & tools
│   ├── HomePage.tsx            # Landing page with hero banner & feature overview
│   ├── ProductSelectionPage.tsx# Filterable product grid
│   └── ProfilePage.tsx         # User profile and order history
└── services/
    └── geminiService.ts        # Gemini API integration and creative generator
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
1. Clone the repository or navigate to the project directory:
   ```bash
   npm install
   ```

2. (Optional) Set up your Gemini API key:
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🔒 Security & AI Configuration

- The app uses lazy initialization for AI services to prevent startup crashes when keys are omitted.
- `metadata.json` is configured with `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`.
