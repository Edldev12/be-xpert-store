export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Delivered"
  | "Cancelled";

export interface Order {
  id: string;
  userId: number;
  customer: string;
  email: string;
  product: string;
  date: string;
  status: OrderStatus;
  total: number;
}

const STORAGE_KEY = "be-xpert-orders";

const DEMO_ORDERS: Order[] = [
  {
    id: "BX-1024",
    userId: 1,
    customer: "Abebe Kebede",
    email: "abebe@example.com",
    product: "Wireless Headphones",
    date: "2026-10-14",
    status: "Delivered",
    total: 89,
  },
  {
    id: "BX-1023",
    userId: 2,
    customer: "Sara Ahmed",
    email: "sara@example.com",
    product: "Smart Watch",
    date: "2026-10-13",
    status: "Processing",
    total: 120,
  },
  {
    id: "BX-1022",
    userId: 3,
    customer: "Daniel Bekele",
    email: "daniel@example.com",
    product: "Laptop Stand",
    date: "2026-10-12",
    status: "Pending",
    total: 45,
  },
  {
    id: "BX-1021",
    userId: 4,
    customer: "Hana Tesfaye",
    email: "hana@example.com",
    product: "Mechanical Keyboard",
    date: "2026-10-11",
    status: "Delivered",
    total: 75,
  },
  {
    id: "BX-1020",
    userId: 5,
    customer: "Mikael Alemu",
    email: "mikael@example.com",
    product: "USB-C Hub",
    date: "2026-10-10",
    status: "Processing",
    total: 35,
  },
];

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved !== null) {
    try {
      return JSON.parse(saved) as Order[];
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_ORDERS));
  return DEMO_ORDERS;
}

export function saveOrders(orders: Order[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function addOrder(order: Order): void {
  const orders = getOrders();
  saveOrders([order, ...orders]);
}