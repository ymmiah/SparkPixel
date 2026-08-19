export type Page = 'home' | 'products' | 'design-studio' | 'checkout' | 'profile' | 'templates';

export type ProductCategory = 'business-cards' | 'marketing' | 'apparel' | 'homeware' | 'signs' | 'stickers';

export interface QuantityTier {
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  isPopular?: boolean;
}

export interface FinishOption {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number;
  badge?: string;
}

export interface CornerOption {
  id: string;
  name: string;
  priceAddon: number;
}

export type ProductSide = 'front' | 'back';

export interface PrintableAreaConfig {
  width: number; // percentage of container (0-100)
  height: number; // percentage of container (0-100)
  top: number; // percentage from top (0-100)
  left: number; // percentage from left (0-100)
  aspectRatio?: number; // width / height
  bleedMargin?: number; // percentage margin
  safeMargin?: number; // percentage margin
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  backImageUrl?: string;
  category: ProductCategory;
  basePrice: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  turnaroundDays: string;
  supportedSides: ProductSide[];
  printableArea: PrintableAreaConfig;
  backPrintableArea?: PrintableAreaConfig;
  quantityTiers: QuantityTier[];
  finishes?: FinishOption[];
  corners?: CornerOption[];
  sizes?: Array<{ id: string; name: string; dimensions: string; priceMultiplier: number }>;
  defaultTemplateCategory?: string;
}

export type DesignElementType = 'text' | 'image' | 'shape' | 'qr' | 'clipart';
export type ShapeType = 'rectangle' | 'circle' | 'line' | 'star' | 'triangle' | 'heart' | 'badge' | 'arrow';

export interface BaseDesignElement {
  id: string;
  type: DesignElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity?: number;
  locked?: boolean;
}

export interface TextElement extends BaseDesignElement {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  textAlign: 'left' | 'center' | 'right';
  color: string;
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase';
  curved?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
}

export interface ImageElement extends BaseDesignElement {
  type: 'image';
  src: string;
  filter?: 'none' | 'grayscale' | 'sepia' | 'vintage' | 'contrast' | 'invert';
  flipH?: boolean;
  flipV?: boolean;
  aspectRatio?: number;
}

export interface ShapeElement extends BaseDesignElement {
  type: 'shape';
  shapeType: ShapeType;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  borderRadius?: number;
}

export interface QRElement extends BaseDesignElement {
  type: 'qr';
  data: string;
  color: string;
  bgColor: string;
  label?: string;
}

export interface ClipartElement extends BaseDesignElement {
  type: 'clipart';
  iconName: string;
  color: string;
}

export type DesignElement = TextElement | ImageElement | ShapeElement | QRElement | ClipartElement;

export interface DesignTemplate {
  id: string;
  name: string;
  category: string;
  productType: string;
  previewUrl: string;
  elements: {
    front: DesignElement[];
    back?: DesignElement[];
  };
  tags: string[];
}

export interface Design {
  productId: string;
  frontElements: DesignElement[];
  backElements?: DesignElement[];
  elements?: DesignElement[];
  selectedFinish?: string;
  selectedCorner?: string;
  selectedSize?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  company?: string;
  phone?: string;
}

export interface OrderItem {
  product: Product;
  design: Design;
  quantity: number;
  unitPrice: number;
  previewImageUrl: string;
  backPreviewImageUrl?: string;
  selectedFinishName?: string;
  selectedCornerName?: string;
  selectedSizeName?: string;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'Processing' | 'In Production' | 'Shipped' | 'Delivered';
  shippingMethod: 'Standard' | 'Express Rush';
  trackingNumber?: string;
}
