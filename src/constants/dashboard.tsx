import mainAxios from "../Instance/mainAxios";
import type { Order, Table } from "../types/dashboard";

// Initialize empty arrays
export let mockTables: Table[] = [];
export let mockOrders: Order[] = [];

interface DashboardResponse {
  total_orders_today?: number;
  revenue_today?: number;
  available_tables?: number;
  menu_items?: number;
  recent_orders?: {
    order_id?: number;
    table_number?: number;
    items_count?: number;
    amount?: number;
    status?: string;
  }[];
}

export async function fetchDashboardData(): Promise<void> {
  try {
    const { data } = await mainAxios.get<DashboardResponse>(
      'dashboard/overview'
    );

    // Safely generate tables
    const numTables = data.available_tables ?? 0; // fallback to 0 if undefined
    mockTables = Array.from({ length: numTables }, (_, i) => ({
      id: `${i + 1}`,
      number: i + 1,
      capacity: 4, // fallback or use API if available
      status: 'available' as const,
    }));

    // Safely map recent orders
    mockOrders = (data.recent_orders ?? []).map((o) => ({
      id: `${o.order_id ?? 0}`,
      tableId: `${o.table_number ?? 0}`,
      items: Array.from({ length: o.items_count ?? 1 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Item ${i + 1}`, // Replace with actual item names if available
        quantity: 1,
        price: o.amount && o.items_count ? o.amount / o.items_count : 0,
      })),
      status: (o.status?.toLowerCase() as 'preparing' | 'completed' | 'served') || 'preparing',
      total: o.amount ?? 0,
      createdAt: new Date(), // replace if API provides real date
    }));

  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  }
}
