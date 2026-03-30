export type ProductColor = {
  id: string;
  name: string;
  image: string;
  felt?: string | null;
  art?: string | null;
  size?: string | null;
  price?: number | null;
  is_new?: boolean;
};

export type CollectionCard = {
  id: string;
  name: string;
  description: string;
  preview_image: string;
  colors: ProductColor[];
};

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: "user" | "admin";
};

export type AuthResponse = {
  user: SessionUser;
  message: string;
};

export type ContactRequestCreate = {
  customer_name: string;
  phone: string;
  email?: string;
  subject?: string;
  comment?: string;
};

export type ContactRequestRead = {
  id: number;
  customer_name: string;
  phone: string;
  email?: string | null;
  subject?: string | null;
  comment?: string | null;
};

export type CartItem = {
  id: number;
  user_id: number;
  product_id: string;
  collection_id: string;
  product_name: string;
  image: string;
  art?: string | null;
  size?: string | null;
  felt?: string | null;
  price?: number | null;
  quantity: number;
};

export type WishlistItem = {
  id: number;
  user_id: number;
  product_id: string;
  collection_id: string;
  product_name: string;
  image: string;
  art?: string | null;
  size?: string | null;
  felt?: string | null;
  price?: number | null;
  note?: string | null;
};

export type OrderItem = {
  id: number;
  product_id?: string | null;
  collection_id?: string | null;
  product_name: string;
  image: string;
  art?: string | null;
  size?: string | null;
  felt?: string | null;
  price?: number | null;
  quantity: number;
  line_total: number;
};

export type OrderRead = {
  id: number;
  user_id?: number | null;
  order_number: string;
  status: string;
  customer_name: string;
  phone: string;
  email: string;
  comment?: string | null;
  total_amount: number;
  items: OrderItem[];
};

export type SiteSettings = {
  hero_eyebrow: string;
  hero_title: string;
  hero_button_label: string;
  about_eyebrow: string;
  about_title: string;
  about_text_primary: string;
  about_text_secondary: string;
  about_quote: string;
  bitrix_webhook_url: string;
  bitrix_pipeline_id: string;
  bitrix_responsible_id: string;
  bitrix_sync_orders: boolean;
  bitrix_sync_contacts: boolean;
  metrika_counter_id: string;
  metrika_enabled: boolean;
};

export type AnalyticsEventRead = {
  id: number;
  user_id?: number | null;
  event_type: string;
  page_url?: string | null;
  payload_json?: string | null;
  created_at?: string | null;
};

export type CrmSyncLogItem = {
  id: number;
  entity_type: string;
  entity_id: string;
  status: string;
  request_url?: string | null;
  payload_json?: string | null;
  response_body?: string | null;
  error_message?: string | null;
  created_at?: string | null;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let detail = "Request failed";
    try {
      const data = await response.json();
      detail = data.detail ?? detail;
    } catch {}
    throw new Error(detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function getCollections(): Promise<CollectionCard[]> {
  return request<CollectionCard[]>("/products", {
    next: { revalidate: 60 },
  });
}

export async function getCollection(id: string): Promise<CollectionCard> {
  return request<CollectionCard>(`/products/${id}`, {
    next: { revalidate: 60 },
  });
}

export async function registerUser(payload: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateUser(
  userId: number,
  payload: { name: string; phone?: string; password?: string },
): Promise<AuthResponse> {
  return request<AuthResponse>(`/auth/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function listUsers(): Promise<SessionUser[]> {
  return request<SessionUser[]>("/auth/users", { cache: "no-store" });
}

export async function listCartItems(userId: number): Promise<CartItem[]> {
  return request<CartItem[]>(`/users/${userId}/cart`, { cache: "no-store" });
}

export async function addCartItem(
  userId: number,
  payload: Omit<CartItem, "id" | "user_id">,
): Promise<CartItem> {
  return request<CartItem>(`/users/${userId}/cart/items`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function removeCartItem(userId: number, itemId: number) {
  return request<void>(`/users/${userId}/cart/items/${itemId}`, {
    method: "DELETE",
  });
}

export async function clearCartItems(userId: number) {
  return request<void>(`/users/${userId}/cart`, {
    method: "DELETE",
  });
}

export async function listWishlistItems(userId: number): Promise<WishlistItem[]> {
  return request<WishlistItem[]>(`/users/${userId}/wishlist`, { cache: "no-store" });
}

export async function addWishlistItem(
  userId: number,
  payload: Omit<WishlistItem, "id" | "user_id">,
): Promise<WishlistItem> {
  return request<WishlistItem>(`/users/${userId}/wishlist/items`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function removeWishlistItem(userId: number, itemId: number) {
  return request<void>(`/users/${userId}/wishlist/items/${itemId}`, {
    method: "DELETE",
  });
}

export async function clearWishlistItems(userId: number) {
  return request<void>(`/users/${userId}/wishlist`, {
    method: "DELETE",
  });
}

export async function listOrders(userId?: number): Promise<OrderRead[]> {
  const suffix = typeof userId === "number" ? `?user_id=${userId}` : "";
  return request<OrderRead[]>(`/orders${suffix}`, { cache: "no-store" });
}

export async function createOrder(payload: {
  user_id?: number;
  customer_name: string;
  phone: string;
  email: string;
  comment?: string;
  items: Array<{
    product_id?: string | null;
    collection_id?: string | null;
    product_name: string;
    image: string;
    art?: string | null;
    size?: string | null;
    felt?: string | null;
    price?: number | null;
    quantity: number;
  }>;
}): Promise<OrderRead> {
  return request<OrderRead>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createContactRequest(payload: ContactRequestCreate) {
  return request<ContactRequestRead>("/contact-requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listContactRequests(): Promise<ContactRequestRead[]> {
  return request<ContactRequestRead[]>("/contact-requests", {
    cache: "no-store",
  });
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return request<SiteSettings>("/settings/site", { cache: "no-store" });
}

export async function updateSiteSettings(payload: Partial<SiteSettings>): Promise<SiteSettings> {
  return request<SiteSettings>("/settings/site", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function createAnalyticsEvent(payload: {
  user_id?: number;
  event_type: string;
  page_url?: string;
  payload_json?: string;
}) {
  return request<AnalyticsEventRead>("/analytics-events", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listAnalyticsEvents(): Promise<AnalyticsEventRead[]> {
  return request<AnalyticsEventRead[]>("/analytics-events", { cache: "no-store" });
}

export async function listCrmSyncLog(): Promise<CrmSyncLogItem[]> {
  return request<CrmSyncLogItem[]>("/crm/sync-log", { cache: "no-store" });
}

export async function createProductItem(payload: {
  collection_id: string;
  name: string;
  image: string;
  felt?: string;
  art?: string;
  size?: string;
  price?: number | null;
  is_new?: boolean;
}) {
  return request("/products/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProductItem(
  itemId: string,
  payload: {
    name?: string;
    image?: string;
    felt?: string;
    art?: string;
    size?: string;
    price?: number | null;
    is_new?: boolean;
  },
) {
  return request(`/products/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteProductItem(itemId: string) {
  return request<void>(`/products/items/${itemId}`, {
    method: "DELETE",
  });
}
