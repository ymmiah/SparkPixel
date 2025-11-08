import { Product, User, Order, OrderItem } from '../types';

// --- MOCK DATA ---
const products: Product[] = [
  {
    id: 'tshirt-white',
    name: 'Classic T-Shirt',
    imageUrl: 'https://picsum.photos/id/10/400/400',
    price: 19.99,
    category: 'apparel',
    printableArea: { width: 40, height: 50, top: 20, left: 30 },
  },
  {
    id: 'mug-white',
    name: 'Coffee Mug',
    imageUrl: 'https://picsum.photos/id/30/400/400',
    price: 14.99,
    category: 'homeware',
    printableArea: { width: 80, height: 70, top: 15, left: 10 },
  },
  {
    id: 'poster-18x24',
    name: '18x24 Poster',
    imageUrl: 'https://picsum.photos/id/40/400/400',
    price: 24.99,
    category: 'print',
    printableArea: { width: 90, height: 90, top: 5, left: 5 },
  },
  {
    id: 'poster-12x18',
    name: '12x18 Poster',
    imageUrl: 'https://picsum.photos/id/41/400/400',
    price: 18.99,
    category: 'print',
    printableArea: { width: 90, height: 90, top: 5, left: 5 },
  },
  {
    id: 'poster-24x36',
    name: '24x36 Poster',
    imageUrl: 'https://picsum.photos/id/42/400/400',
    price: 32.99,
    category: 'print',
    printableArea: { width: 90, height: 90, top: 5, left: 5 },
  },
  {
    id: 'tote-bag',
    name: 'Canvas Tote Bag',
    imageUrl: 'https://picsum.photos/id/50/400/400',
    price: 17.99,
    category: 'apparel',
    printableArea: { width: 60, height: 60, top: 20, left: 20 },
  },
  {
    id: 'flyer-a5',
    name: 'A5 Flyer (x50)',
    imageUrl: 'https://picsum.photos/id/60/400/400',
    price: 29.99,
    category: 'print',
    printableArea: { width: 95, height: 95, top: 2.5, left: 2.5 },
  },
  {
    id: 'brochure-a4',
    name: 'A4 Brochure (x50)',
    imageUrl: 'https://picsum.photos/id/70/400/400',
    price: 49.99,
    category: 'print',
    printableArea: { width: 95, height: 95, top: 2.5, left: 2.5 },
  },
  {
    id: 'postcard-a6',
    name: 'A6 Postcard (x100)',
    imageUrl: 'https://picsum.photos/id/80/400/400',
    price: 34.99,
    category: 'print',
    printableArea: { width: 95, height: 95, top: 2.5, left: 2.5 },
  },
  {
    id: 'business-card',
    name: 'Business Cards (x100)',
    imageUrl: 'https://picsum.photos/id/90/400/400',
    price: 19.99,
    category: 'print',
    printableArea: { width: 95, height: 95, top: 2.5, left: 2.5 },
  },
];

const users: User[] = [
    { id: 'user-1', name: 'Alex Doe', email: 'alex.doe@example.com' }
];

let orders: Order[] = [
    {
        id: 'SPX-1001',
        userId: 'user-1',
        date: '2023-09-15',
        items: [{
            product: products[1],
            design: { productId: 'mug-white', elements: [] },
            quantity: 1,
        }],
        total: 14.99,
        status: 'Delivered',
    }
];


// --- MOCK API FUNCTIONS ---

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  // PRODUCTS
  getProducts: async (): Promise<Product[]> => {
    await delay(200);
    return [...products];
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    await delay(100);
    return products.find(p => p.id === id);
  },

  // USERS
  getUserById: async (id: string): Promise<User | undefined> => {
    await delay(100);
    return users.find(u => u.id === id);
  },

  // ORDERS
  getOrdersByUserId: async (userId: string): Promise<Order[]> => {
    await delay(300);
    return orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  createOrder: async (userId: string, items: OrderItem[]): Promise<Order> => {
    await delay(500);
    const total = items.reduce((sum, item) => {
        const itemTotal = item.product.price * item.quantity;
        const tax = itemTotal * 0.08; // 8% tax
        const shipping = 5.00 / items.length; // prorated shipping
        return sum + itemTotal + tax + shipping;
    }, 0);

    const newOrder: Order = {
        id: `SPX-${Math.floor(Math.random() * 9000) + 1000}`,
        userId,
        items,
        total,
        date: new Date().toISOString().split('T')[0],
        status: 'Processing',
    };
    orders.unshift(newOrder); // Add to the beginning of the array
    return newOrder;
  }
};
