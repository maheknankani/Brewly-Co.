const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const handleResponse = async (res) => {
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  const text = await res.text();
  console.error(`API response error (${res.status}):`, text);
  return {
    success: false,
    message: `Server returned non-JSON response (${res.status}). Ensure backend server is running on port 5000.`
  };
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('brewly_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Products
  async getProducts() {
    const res = await fetch(`${BASE_URL}/products`);
    return res.json();
  },
  async getProduct(id) {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    return res.json();
  },
  async createProduct(data) {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async updateProduct(id, data) {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async deleteProduct(id) {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Orders
  // Admin Only: Fetch all customer orders
  async getOrders() {
    const res = await fetch(`${BASE_URL}/orders`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },
  // Customer Only: Fetch own orders by customer email
  async getMyOrders(email) {
    if (!email || !email.trim()) return { success: true, orders: [] };
    const res = await fetch(`${BASE_URL}/my-orders?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    return res.json();
  },
  async getOrder(id) {
    const res = await fetch(`${BASE_URL}/orders/${id}`);
    return res.json();
  },
  async createOrder(orderData) {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },
  async updateOrderStatus(id, status) {
    const res = await fetch(`${BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Subscriptions
  async getSubscriptions() {
    const res = await fetch(`${BASE_URL}/subscriptions`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },
  async updateSubscriptionStatus(id, status) {
    const res = await fetch(`${BASE_URL}/subscriptions/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return res.json();
  },
  async deleteSubscription(id) {
    const res = await fetch(`${BASE_URL}/subscriptions/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },
  async createSubscription(subData) {
    const res = await fetch(`${BASE_URL}/subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subData)
    });
    return res.json();
  },

  // Free Delivery Subscriptions
  async getFreeDeliverySubscriptions() {
    const res = await fetch(`${BASE_URL}/free-delivery-subscriptions`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },
  async getUserFreeDeliverySub(email, userId) {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`${BASE_URL}/free-delivery-subscriptions/user/${encodeURIComponent(email)}${query}`);
    return res.json();
  },
  async createSubscriptionCheckoutSession(data) {
    const res = await fetch(`${BASE_URL}/create-subscription-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  async verifyStripeSubscriptionSession(data) {
    const res = await fetch(`${BASE_URL}/free-delivery-subscriptions/verify-stripe-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  async createFreeDeliverySub(data) {
    const res = await fetch(`${BASE_URL}/free-delivery-subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async cancelFreeDeliverySub(id) {
    const res = await fetch(`${BASE_URL}/free-delivery-subscriptions/${encodeURIComponent(id)}/cancel`, {
      method: 'PATCH'
    });
    return res.json();
  },

  // Discounts
  async getDiscounts() {
    const res = await fetch(`${BASE_URL}/discounts`);
    return res.json();
  },
  async validateDiscount(code) {
    const res = await fetch(`${BASE_URL}/discounts/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    return res.json();
  },
  async createDiscount(data) {
    const res = await fetch(`${BASE_URL}/discounts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async updateDiscount(id, data) {
    const res = await fetch(`${BASE_URL}/discounts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async toggleDiscount(id) {
    const res = await fetch(`${BASE_URL}/discounts/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return res.json();
  },
  async deleteDiscount(id) {
    const res = await fetch(`${BASE_URL}/discounts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Reviews
  async getReviews(productId) {
    const url = productId ? `${BASE_URL}/reviews?productId=${productId}` : `${BASE_URL}/reviews`;
    const res = await fetch(url);
    return res.json();
  },
  async createReview(data) {
    const res = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Chat
  async getChatMessages() {
    const res = await fetch(`${BASE_URL}/chat`);
    return res.json();
  },
  async sendChatMessage(sender, text) {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender, text })
    });
    return res.json();
  },

  // Analytics
  async getAnalytics() {
    const res = await fetch(`${BASE_URL}/analytics`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Admin Auth
  async adminLogin(username, password) {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  async getAdminProfile() {
    const token = localStorage.getItem('brewly_admin_token');
    if (!token) return { success: false, message: 'No token' };
    const res = await fetch(`${BASE_URL}/admin/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return res.json();
  },

  async adminRegister(adminData) {
    const token = localStorage.getItem('brewly_admin_token');
    const res = await fetch(`${BASE_URL}/admin/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(adminData)
    });
    return res.json();
  },

  // SMTP Email Dispatch
  async sendEmail(orderData) {
    const res = await fetch(`${BASE_URL}/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  // Stripe Payments
  async createPaymentIntent(paymentData) {
    const res = await fetch(`${BASE_URL}/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return handleResponse(res);
  },

  async createCheckoutSession(sessionData) {
    const res = await fetch(`${BASE_URL}/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData)
    });
    return handleResponse(res);
  },
  async verifyCheckoutSession(data) {
    const res = await fetch(`${BASE_URL}/verify-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Notifications
  async getNotifications(email, orderId) {
    let params = [];
    if (email) params.push(`email=${encodeURIComponent(email)}`);
    if (orderId) params.push(`orderId=${encodeURIComponent(orderId)}`);
    const query = params.length > 0 ? `?${params.join('&')}` : '';
    const res = await fetch(`${BASE_URL}/notifications${query}`);
    return handleResponse(res);
  },

  async markNotificationRead(id) {
    const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH'
    });
    return handleResponse(res);
  },

  async markAllNotificationsRead(email) {
    const res = await fetch(`${BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return handleResponse(res);
  }
};
