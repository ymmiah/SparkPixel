import { Product, User, Order, OrderItem } from '../types';

export const products: Product[] = [
  {
    id: 'business-cards-standard',
    name: 'Standard Business Cards',
    tagline: 'Make an unforgettable first impression',
    description: 'High-definition full-color printing on premium cardstock with crisp edges, rich ink saturation, and durable coating options.',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    category: 'business-cards',
    basePrice: 19.99,
    rating: 4.9,
    reviewsCount: 1420,
    badge: 'Bestseller',
    turnaroundDays: '2 - 3 business days',
    supportedSides: ['front', 'back'],
    printableArea: { width: 85, height: 75, top: 12.5, left: 7.5, aspectRatio: 3.5 / 2 },
    backPrintableArea: { width: 85, height: 75, top: 12.5, left: 7.5, aspectRatio: 3.5 / 2 },
    quantityTiers: [
      { quantity: 100, unitPrice: 0.20, discountPercent: 0 },
      { quantity: 250, unitPrice: 0.14, discountPercent: 30, isPopular: true },
      { quantity: 500, unitPrice: 0.09, discountPercent: 55 },
      { quantity: 1000, unitPrice: 0.06, discountPercent: 70 },
      { quantity: 2500, unitPrice: 0.045, discountPercent: 77 },
    ],
    finishes: [
      { id: 'matte', name: 'Premium Matte (16pt)', description: 'Smooth, non-reflective velvety texture perfect for writing on', priceMultiplier: 1.0 },
      { id: 'glossy', name: 'High Gloss UV (16pt)', description: 'Brilliant shiny coat that makes vibrant colors pop', priceMultiplier: 1.15, badge: 'Popular' },
      { id: 'linen', name: 'Textured Woven Linen', description: 'Sophisticated woven fabric feel for timeless luxury', priceMultiplier: 1.35 },
      { id: 'soft-touch', name: 'Velvet Soft-Touch', description: 'Sensory suede-like feel with fingerprint resistance', priceMultiplier: 1.45, badge: 'Luxury' },
    ],
    corners: [
      { id: 'standard', name: 'Standard Square Corners', priceAddon: 0 },
      { id: 'rounded', name: 'Rounded Corners (1/4" radius)', priceAddon: 4.99 },
    ],
    sizes: [
      { id: 'us-std', name: 'Standard US', dimensions: '3.5" x 2.0"', priceMultiplier: 1.0 },
      { id: 'square', name: 'Modern Square', dimensions: '2.5" x 2.5"', priceMultiplier: 1.1 },
      { id: 'slim', name: 'Euro Slim', dimensions: '3.3" x 1.6"', priceMultiplier: 1.05 },
    ],
    defaultTemplateCategory: 'Real Estate'
  },
  {
    id: 'tshirt-classic-crew',
    name: 'Heavyweight Unisex Cotton T-Shirt',
    tagline: 'Ultra-soft ring-spun cotton with vivid direct-to-garment print',
    description: '100% pre-shrunk combed cotton jersey. Tailored modern fit with taped neck and shoulders. Wash-resistant vibrant textile inks.',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    category: 'apparel',
    basePrice: 22.99,
    rating: 4.8,
    reviewsCount: 890,
    badge: 'Trending',
    turnaroundDays: '3 - 4 business days',
    supportedSides: ['front', 'back'],
    printableArea: { width: 50, height: 60, top: 22, left: 25, aspectRatio: 1 },
    backPrintableArea: { width: 50, height: 60, top: 20, left: 25, aspectRatio: 1 },
    quantityTiers: [
      { quantity: 1, unitPrice: 22.99, discountPercent: 0 },
      { quantity: 5, unitPrice: 19.50, discountPercent: 15 },
      { quantity: 12, unitPrice: 16.20, discountPercent: 29, isPopular: true },
      { quantity: 24, unitPrice: 13.90, discountPercent: 40 },
      { quantity: 50, unitPrice: 11.50, discountPercent: 50 },
      { quantity: 100, unitPrice: 9.80, discountPercent: 57 },
    ],
    sizes: [
      { id: 's', name: 'Small', dimensions: 'Chest 34-36"', priceMultiplier: 1.0 },
      { id: 'm', name: 'Medium', dimensions: 'Chest 38-40"', priceMultiplier: 1.0 },
      { id: 'l', name: 'Large', dimensions: 'Chest 42-44"', priceMultiplier: 1.0 },
      { id: 'xl', name: 'XL', dimensions: 'Chest 46-48"', priceMultiplier: 1.0 },
      { id: '2xl', name: '2XL', dimensions: 'Chest 50-52"', priceMultiplier: 1.15 },
    ],
    defaultTemplateCategory: 'Fashion & Streetwear'
  },
  {
    id: 'hoodie-premium-fleece',
    name: 'Premium Fleece Pullover Hoodie',
    tagline: 'Cozy brushed interior with double-lined drawstring hood',
    description: 'Plush 8.5 oz cotton-poly fleece blend. Front kangaroo pocket and ribbed cuffs. Superior surface print fidelity.',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=600&q=80',
    category: 'apparel',
    basePrice: 38.99,
    rating: 4.9,
    reviewsCount: 520,
    turnaroundDays: '3 - 5 business days',
    supportedSides: ['front', 'back'],
    printableArea: { width: 45, height: 45, top: 25, left: 27.5, aspectRatio: 1 },
    backPrintableArea: { width: 50, height: 55, top: 20, left: 25, aspectRatio: 1 },
    quantityTiers: [
      { quantity: 1, unitPrice: 38.99, discountPercent: 0 },
      { quantity: 5, unitPrice: 33.99, discountPercent: 12 },
      { quantity: 12, unitPrice: 28.50, discountPercent: 26, isPopular: true },
      { quantity: 25, unitPrice: 24.90, discountPercent: 36 },
      { quantity: 50, unitPrice: 21.00, discountPercent: 46 },
    ],
    sizes: [
      { id: 's', name: 'Small', dimensions: 'Chest 34-36"', priceMultiplier: 1.0 },
      { id: 'm', name: 'Medium', dimensions: 'Chest 38-40"', priceMultiplier: 1.0 },
      { id: 'l', name: 'Large', dimensions: 'Chest 42-44"', priceMultiplier: 1.0 },
      { id: 'xl', name: 'XL', dimensions: 'Chest 46-48"', priceMultiplier: 1.0 },
      { id: '2xl', name: '2XL', dimensions: 'Chest 50-52"', priceMultiplier: 1.15 },
    ],
  },
  {
    id: 'flyers-promotional',
    name: 'Glossy Marketing Flyers & Leaflets',
    tagline: 'High-impact promotional handouts for events and menus',
    description: 'Printed on 100lb glossy text stock with protective aqueous coating. Vibrant edge-to-edge color fidelity.',
    imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=600&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80',
    category: 'marketing',
    basePrice: 29.99,
    rating: 4.8,
    reviewsCount: 760,
    badge: 'Popular',
    turnaroundDays: '2 - 3 business days',
    supportedSides: ['front', 'back'],
    printableArea: { width: 90, height: 90, top: 5, left: 5, aspectRatio: 8.5 / 11 },
    backPrintableArea: { width: 90, height: 90, top: 5, left: 5, aspectRatio: 8.5 / 11 },
    quantityTiers: [
      { quantity: 50, unitPrice: 0.60, discountPercent: 0 },
      { quantity: 100, unitPrice: 0.38, discountPercent: 36 },
      { quantity: 250, unitPrice: 0.22, discountPercent: 63, isPopular: true },
      { quantity: 500, unitPrice: 0.15, discountPercent: 75 },
      { quantity: 1000, unitPrice: 0.09, discountPercent: 85 },
      { quantity: 2500, unitPrice: 0.06, discountPercent: 90 },
    ],
    finishes: [
      { id: 'gloss', name: 'High-Gloss 100lb Paper', description: 'Maximum shine and saturated colors', priceMultiplier: 1.0 },
      { id: 'matte', name: 'Matte Recycled 100lb Paper', description: 'Anti-glare clean corporate finish', priceMultiplier: 1.1 },
    ],
    sizes: [
      { id: 'a5', name: 'Half Page (5.5" x 8.5")', dimensions: '5.5" x 8.5"', priceMultiplier: 1.0 },
      { id: 'a4', name: 'Standard Letter (8.5" x 11")', dimensions: '8.5" x 11"', priceMultiplier: 1.3 },
      { id: 'postcard', name: 'Handout Card (4" x 6")', dimensions: '4" x 6"', priceMultiplier: 0.85 },
    ],
    defaultTemplateCategory: 'Events & Promotions'
  },
  {
    id: 'ceramic-mug-photo',
    name: '11oz Glossy Ceramic Mug',
    tagline: 'Microwave & dishwasher safe photo mug with full wrap print',
    description: 'Durable AAA-grade ceramic with lead-free sublimation glaze. High-gloss finish ensures sharp photographic reproduction and daily durability.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    category: 'homeware',
    basePrice: 14.99,
    rating: 4.9,
    reviewsCount: 1180,
    badge: 'Gift Choice',
    turnaroundDays: '2 - 3 business days',
    supportedSides: ['front'],
    printableArea: { width: 75, height: 65, top: 18, left: 12.5, aspectRatio: 1.2 },
    quantityTiers: [
      { quantity: 1, unitPrice: 14.99, discountPercent: 0 },
      { quantity: 6, unitPrice: 11.99, discountPercent: 20 },
      { quantity: 12, unitPrice: 9.50, discountPercent: 36, isPopular: true },
      { quantity: 36, unitPrice: 7.90, discountPercent: 47 },
      { quantity: 72, unitPrice: 6.20, discountPercent: 58 },
    ],
    defaultTemplateCategory: 'Food & Beverage'
  },
  {
    id: 'tote-canvas-bag',
    name: 'Heavy Duty Organic Canvas Tote',
    tagline: 'Eco-friendly 10oz natural cotton with reinforced handles',
    description: 'Generous 15" x 16" size with reinforced shoulder straps. Perfect for retail merchandise, giveaways, trade shows, and groceries.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    category: 'apparel',
    basePrice: 16.99,
    rating: 4.7,
    reviewsCount: 340,
    turnaroundDays: '2 - 4 business days',
    supportedSides: ['front'],
    printableArea: { width: 55, height: 55, top: 25, left: 22.5, aspectRatio: 1 },
    quantityTiers: [
      { quantity: 1, unitPrice: 16.99, discountPercent: 0 },
      { quantity: 10, unitPrice: 12.99, discountPercent: 23 },
      { quantity: 25, unitPrice: 9.99, discountPercent: 41, isPopular: true },
      { quantity: 50, unitPrice: 7.80, discountPercent: 54 },
      { quantity: 100, unitPrice: 5.90, discountPercent: 65 },
    ],
  },
  {
    id: 'stickers-diecut-vinyl',
    name: 'Custom Die-Cut Vinyl Stickers',
    tagline: 'Thick waterproof & weatherproof vinyl cut to any shape',
    description: 'Precision contour-cut thick vinyl with UV protective laminate. Scratch, rain, and sunlight resistant with easy-peel backing.',
    imageUrl: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=600&q=80',
    category: 'stickers',
    basePrice: 24.99,
    rating: 4.9,
    reviewsCount: 940,
    badge: 'Popular',
    turnaroundDays: '2 - 3 business days',
    supportedSides: ['front'],
    printableArea: { width: 80, height: 80, top: 10, left: 10, aspectRatio: 1 },
    quantityTiers: [
      { quantity: 50, unitPrice: 0.50, discountPercent: 0 },
      { quantity: 100, unitPrice: 0.32, discountPercent: 36, isPopular: true },
      { quantity: 250, unitPrice: 0.20, discountPercent: 60 },
      { quantity: 500, unitPrice: 0.14, discountPercent: 72 },
      { quantity: 1000, unitPrice: 0.09, discountPercent: 82 },
    ],
    finishes: [
      { id: 'glossy-vinyl', name: 'Glossy White Vinyl', description: 'Vibrant shine and deep colors', priceMultiplier: 1.0 },
      { id: 'matte-vinyl', name: 'Satin Matte Vinyl', description: 'Modern glare-free surface', priceMultiplier: 1.1 },
      { id: 'holographic', name: 'Holographic Rainbow Foil', description: 'Eye-catching prism reflection effect', priceMultiplier: 1.4, badge: 'Special' },
    ],
    sizes: [
      { id: '2x2', name: 'Small (2" x 2")', dimensions: '2" x 2"', priceMultiplier: 0.8 },
      { id: '3x3', name: 'Standard (3" x 3")', dimensions: '3" x 3"', priceMultiplier: 1.0 },
      { id: '4x4', name: 'Large (4" x 4")', dimensions: '4" x 4"', priceMultiplier: 1.35 },
    ]
  },
  {
    id: 'rollup-banner-stand',
    name: 'Retractable Roll-Up Banner & Stand',
    tagline: 'Portable 33" x 81" banner stand with aluminum base & carrying case',
    description: 'Premium curl-free 13oz vinyl installed in a lightweight aluminum cassette stand. Sets up in under 60 seconds for conferences and expos.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    category: 'signs',
    basePrice: 89.99,
    rating: 4.8,
    reviewsCount: 310,
    badge: 'Event Essential',
    turnaroundDays: '2 - 3 business days',
    supportedSides: ['front'],
    printableArea: { width: 70, height: 90, top: 5, left: 15, aspectRatio: 33 / 81 },
    quantityTiers: [
      { quantity: 1, unitPrice: 89.99, discountPercent: 0 },
      { quantity: 2, unitPrice: 79.99, discountPercent: 11, isPopular: true },
      { quantity: 5, unitPrice: 69.50, discountPercent: 22 },
      { quantity: 10, unitPrice: 59.00, discountPercent: 34 },
    ]
  },
  {
    id: 'posters-fine-art',
    name: 'Archival Matte Fine Art Posters',
    tagline: 'Museum-grade 230gsm matte paper with 12-color archival giclée print',
    description: 'Heavyweight matte stock designed for high-resolution graphics and photographic gallery displays without reflections.',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    category: 'marketing',
    basePrice: 18.99,
    rating: 4.9,
    reviewsCount: 460,
    turnaroundDays: '2 - 3 business days',
    supportedSides: ['front'],
    printableArea: { width: 88, height: 88, top: 6, left: 6, aspectRatio: 18 / 24 },
    quantityTiers: [
      { quantity: 1, unitPrice: 18.99, discountPercent: 0 },
      { quantity: 5, unitPrice: 14.50, discountPercent: 23 },
      { quantity: 10, unitPrice: 11.20, discountPercent: 41, isPopular: true },
      { quantity: 25, unitPrice: 8.50, discountPercent: 55 },
      { quantity: 50, unitPrice: 6.90, discountPercent: 63 },
    ],
    sizes: [
      { id: '12x18', name: '12" x 18" Medium', dimensions: '12" x 18"', priceMultiplier: 0.8 },
      { id: '18x24', name: '18" x 24" Standard', dimensions: '18" x 24"', priceMultiplier: 1.0 },
      { id: '24x36', name: '24" x 36" Large', dimensions: '24" x 36"', priceMultiplier: 1.5 },
    ]
  },
  {
    id: 'yard-signs-corrugated',
    name: 'Weatherproof Corrugated Yard Signs',
    tagline: '4mm corrugated plastic with metal H-stake included',
    description: 'Double-sided or single-sided full-color UV outdoor ink. Waterproof, wind-resistant, and sunlight fade-proof for lawn promotions.',
    imageUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80',
    category: 'signs',
    basePrice: 22.99,
    rating: 4.7,
    reviewsCount: 280,
    turnaroundDays: '2 - 4 business days',
    supportedSides: ['front', 'back'],
    printableArea: { width: 85, height: 80, top: 10, left: 7.5, aspectRatio: 24 / 18 },
    backPrintableArea: { width: 85, height: 80, top: 10, left: 7.5, aspectRatio: 24 / 18 },
    quantityTiers: [
      { quantity: 1, unitPrice: 22.99, discountPercent: 0 },
      { quantity: 5, unitPrice: 17.50, discountPercent: 24 },
      { quantity: 10, unitPrice: 13.90, discountPercent: 39, isPopular: true },
      { quantity: 25, unitPrice: 10.50, discountPercent: 54 },
      { quantity: 50, unitPrice: 8.20, discountPercent: 64 },
    ]
  }
];

export const users: User[] = [
  { 
    id: 'user-1', 
    name: 'Alex Doe', 
    email: 'alex.doe@example.com',
    company: 'Vanguard Dynamics LLC',
    phone: '+1 (555) 492-3819'
  }
];

let orders: Order[] = [
  {
    id: 'SPX-8942',
    userId: 'user-1',
    date: '2026-08-14',
    items: [
      {
        product: products[0], // Standard Business Cards
        design: { 
          productId: 'business-cards-standard', 
          frontElements: [],
          selectedFinish: 'matte',
          selectedCorner: 'rounded'
        },
        quantity: 250,
        unitPrice: 0.14,
        selectedFinishName: 'Premium Matte (16pt)',
        selectedCornerName: 'Rounded Corners (1/4" radius)',
        previewImageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
      }
    ],
    subtotal: 35.00,
    shipping: 5.99,
    tax: 3.28,
    total: 44.27,
    status: 'In Production',
    shippingMethod: 'Standard',
    trackingNumber: 'TRK-98421094US'
  },
  {
    id: 'SPX-7104',
    userId: 'user-1',
    date: '2026-07-28',
    items: [
      {
        product: products[1], // T-Shirt
        design: { 
          productId: 'tshirt-classic-crew', 
          frontElements: [],
          selectedSize: 'l'
        },
        quantity: 12,
        unitPrice: 16.20,
        selectedSizeName: 'Large',
        previewImageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
      }
    ],
    subtotal: 194.40,
    shipping: 0.00,
    tax: 15.55,
    total: 209.95,
    status: 'Delivered',
    shippingMethod: 'Express Rush',
    trackingNumber: 'TRK-84192043US'
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  getProducts: async (): Promise<Product[]> => {
    await delay(100);
    return [...products];
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    await delay(50);
    return products.find(p => p.id === id);
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    await delay(50);
    return users.find(u => u.id === id);
  },

  getOrdersByUserId: async (userId: string): Promise<Order[]> => {
    await delay(100);
    return orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  createOrder: async (userId: string, items: OrderItem[], shippingMethod: 'Standard' | 'Express Rush' = 'Standard'): Promise<Order> => {
    await delay(300);
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const shipping = subtotal > 75 ? 0 : (shippingMethod === 'Express Rush' ? 14.99 : 5.99);
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const newOrder: Order = {
      id: `SPX-${Math.floor(Math.random() * 9000) + 1000}`,
      userId,
      items,
      subtotal,
      shipping,
      tax,
      total,
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
      shippingMethod,
      trackingNumber: `TRK-${Math.floor(Math.random() * 90000000) + 10000000}US`
    };
    orders.unshift(newOrder);
    return newOrder;
  }
};
