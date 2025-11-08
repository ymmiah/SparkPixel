export type Page = 'home' | 'products' | 'design-studio' | 'checkout' | 'profile';

export type ProductCategory = 'apparel' | 'homeware' | 'print';

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  category: ProductCategory;
  printableArea: {
    width: number; // percentage of container
    height: number; // percentage of container
    top: number; // percentage from top
    left: number; // percentage from left
  };
}

export type DesignElementType = 'image';

export interface BaseDesignElement {
  id:string;
  type: DesignElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface ImageElement extends BaseDesignElement {
  type: 'image';
  src: string;
}

export type DesignElement = ImageElement;

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Design {
  productId: string;
  elements: DesignElement[];
}

export interface OrderItem {
  product: Product;
  design: Design;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}
