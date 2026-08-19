# Spark Pixel Studio — Custom Print & Personalization Platform

Spark Pixel is a professional, full-featured web application offering a custom printing and merchandise personalization experience on par with platforms like **Vistaprint**. Users can browse an extensive catalog of business cards, marketing collateral, apparel, drinkware, and signage, customize designs with a multi-layer vector studio, generate AI copy with Gemini, preview 3D proofs with realistic paper finishes, and order with volume discounts.

---

## ✨ Key Features & Capabilities

- **📇 Comprehensive Product Catalog & Options**
  - **Business Cards**: Standard 16pt, Rounded Corners, Velvet Matte, Glossy UV, Metallic Foil, and Linen Textures.
  - **Marketing Materials**: Full-Color Trifold Brochures, Postcards, Presentation Folders, and Rack Cards.
  - **Apparel & Merch**: Heavyweight Cotton Tees, Hoodies, Canvas Tote Bags, and Embroidered Caps.
  - **Drinkware & Homeware**: 11oz/15oz Ceramic Mugs, Stainless Steel Tumblers, and Coasters.
  - **Signs & Banners**: Retractable Trade Show Banners, Vinyl Banners with Grommets, and Yard Signs.
  - **Stickers & Decals**: Die-cut Waterproof Vinyl Stickers, Sheet Labels, and Clear Window Decals.
  - **Tiered Volume Pricing**: Dynamic tier calculations offering up to 70% bulk discounts.

- **🎨 Multi-Layer Interactive Design Studio**
  - **Full-Bleed & Safe Margin Guides**: Real-world print guides, bleed margin warnings, and snap-to-center alignments.
  - **Typography Suite**: Google Fonts library (Montserrat, Playfair Display, Space Grotesk, Oswald, Cinzel, Dancing Script, etc.) with custom weights, line heights, letter-spacing, and drop shadows.
  - **Vector Shapes & Clipart**: Badges, ribbons, arrows, stars, geometric shapes with custom fills, borders, and rounded corners.
  - **Dynamic QR Code Generator**: Deterministic vector QR matrix generator for URLs, WiFi, contact cards, and phone numbers.
  - **Dual-Sided Editing**: Seamless front and back design switching with independent layer stacks.
  - **Layer Ordering & Controls**: Bring to front, send to back, duplicate, lock, rotate, flip, and delete.

- **💡 Gemini AI Marketing & Design Co-Pilot**
  - Instant generation of industry-specific taglines, promotional slogans, contact bios, and value propositions.
  - Intelligent starter layout suggestions directly placed onto the canvas.

- **🖼️ Designer Templates Gallery**
  - Over 100+ curated starter templates spanning Real Estate, Tech Startups, Artisan Cafes, Streetwear, and Corporate Events.
  - 1-Click loading into the Design Studio.

- **🔍 High-Fidelity 3D Proof Mockup Modal**
  - Interactive 3D perspective viewer simulating paper stocks (Velvet Matte, Glossy UV, Metallic Foil, Natural Linen).
  - Printable resolution proof approval with print specifications breakdown.

- **🛒 Full E-Commerce Cart & Checkout**
  - Custom finishing options selector (finishes, corners, sizes).
  - Promo code discounts (e.g. `PRINTPRO` for 15% off).
  - Standard vs. Express Rush delivery options.
  - Confetti celebration upon order confirmation with digital receipt, order ID, and tracking code.

- **👤 Account & Order Management**
  - Profile hub with past order history, order statuses (In Production, Shipped, Delivered), item previews, and tracking codes.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Google Fonts
- **Canvas & Graphics**: HTML5 Canvas API, SVG Vector Matrix
- **AI Intelligence**: `@google/genai` Gemini SDK
- **Animation & Effects**: `canvas-confetti`, CSS 3D Perspective Transforms

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```
