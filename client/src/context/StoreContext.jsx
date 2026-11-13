import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { fallbackProducts } from '../data/fallbackProducts';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState(fallbackProducts);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(['prod-1']); // default saved favorite
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [subscriberCode, setSubscriberCode] = useState(() => {
    return localStorage.getItem('brewly_subscriber_code') || '';
  });
  const [discounts, setDiscounts] = useState([
    { code: 'SLOWMORNINGS', discountPercent: 10, description: '10% off your first ritual', active: true },
    { code: 'BREW15', discountPercent: 15, description: '15% subscriber welcome discount', active: true },
    { code: 'BREWLY5', discountPercent: 5, description: 'Exclusive 5% Subscriber Perk', active: true }
  ]);

  const fetchDiscounts = async () => {
    try {
      const res = await api.getDiscounts();
      if (res.success && Array.isArray(res.discounts) && res.discounts.length > 0) {
        setDiscounts(res.discounts);
      }
    } catch (e) {
      console.warn('StoreContext discounts fetch note:', e.message);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);
  
  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return !!localStorage.getItem('brewly_admin_token');
  });
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('brewly_admin_profile');
    return saved ? JSON.parse(saved) : { name: 'Head Roaster Admin', email: 'admin@brewly.com', role: 'Super Admin' };
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Auto verify admin session token on mount
  // Auto verify admin session token on mount
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('brewly_admin_token');
      if (token) {
        try {
          const res = await api.getAdminProfile();
          if (res.success && res.admin) {
            setAdminUser(res.admin);
            localStorage.setItem('brewly_admin_profile', JSON.stringify(res.admin));
            setIsAdminAuthenticated(true);
            setRole('admin');
          } else {
            adminLogout();
          }
        } catch (e) {
          console.warn('Admin token verification note:', e.message);
          adminLogout();
        }
      } else {
        setIsAdminAuthenticated(false);
        setRole('customer');
      }
    };
    verifySession();
  }, []);

  // User & Role State
  const [role, setRole] = useState(() => (localStorage.getItem('brewly_admin_token') ? 'admin' : 'customer'));
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('brewly_customer_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading saved customer user', e);
    }
    return {
      name: '',
      email: '',
      loyaltyPoints: 0,
      tier: 'Customer'
    };
  });

  // Active Navigation Page
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'shop', 'subscriptions', 'admin', 'checkout', 'profile'

  const adminLogin = async (username, password) => {
    try {
      const res = await api.adminLogin(username, password);
      if (res.success && res.token) {
        localStorage.setItem('brewly_admin_token', res.token);
        if (res.admin) {
          setAdminUser(res.admin);
          localStorage.setItem('brewly_admin_profile', JSON.stringify(res.admin));
        }
        setIsAdminAuthenticated(true);
        setRole('admin');
        setCurrentPage('admin');
        setIsAdminLoginModalOpen(false);
        showToast(`Welcome back, ${res.admin?.name || 'Head Roaster Admin'}! ☕`);
        return { success: true };
      } else {
        return { success: false, message: res.message || 'Invalid admin username/email or password' };
      }
    } catch (err) {
      return { success: false, message: 'Invalid admin username/email or password' };
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('brewly_admin_token');
    localStorage.removeItem('brewly_admin_profile');
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    setRole('customer');
    if (currentPage === 'admin') {
      setCurrentPage('home');
    }
    showToast('Admin session signed out safely.');
  };

  const toggleAdminRole = () => {
    if (isAdminAuthenticated) {
      if (currentPage === 'admin') {
        setCurrentPage('home');
      } else {
        setRole('admin');
        setCurrentPage('admin');
      }
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };
  
  // UI Drawers & Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [trackedOrder, setTrackedOrder] = useState(null);

  // Customer Order History State (scoped strictly to user's verified orders)
  const [userOrdersHistory, setUserOrdersHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('brewly_order_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading saved order history', e);
    }
    return [];
  });

  const fetchUserOrders = async (emailToFetch) => {
    const targetEmail = (emailToFetch || user.email || '').trim().toLowerCase();
    if (!targetEmail) {
      setUserOrdersHistory([]);
      return;
    }
    try {
      const res = await api.getMyOrders(targetEmail);
      if (res.success && Array.isArray(res.orders)) {
        setUserOrdersHistory(res.orders);
        try {
          localStorage.setItem('brewly_order_history', JSON.stringify(res.orders));
        } catch (e) {
          console.warn('Error saving order history', e);
        }
      }
    } catch (err) {
      console.warn('Error fetching user orders:', err.message);
    }
  };

  useEffect(() => {
    if (user.email) {
      fetchUserOrders(user.email);
    }
  }, [user.email]);

  const setCustomerAccount = (newEmail, newName) => {
    const cleanEmail = (newEmail || '').trim().toLowerCase();
    const updated = {
      ...user,
      email: cleanEmail,
      name: newName ? newName.trim() : (user.name || cleanEmail.split('@')[0] || 'Customer')
    };
    setUser(updated);
    try {
      localStorage.setItem('brewly_customer_user', JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving customer user', e);
    }
    fetchUserOrders(cleanEmail);
  };

  const addOrderToHistory = (newOrder) => {
    setUserOrdersHistory(prev => {
      const updated = [newOrder, ...prev.filter(o => o.id !== newOrder.id)];
      try {
        localStorage.setItem('brewly_order_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('Error saving order history', e);
      }
      return updated;
    });
  };

  // Notifications Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await api.getProducts();
      if (res.success && Array.isArray(res.products) && res.products.length > 0) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product, options = {}) => {
    const {
      weight = '250g',
      grind = 'Whole Bean',
      isSubscription = false,
      frequency = 'Every 2 Weeks',
      quantity = 1
    } = options;

    const unitPrice = isSubscription ? product.subscriptionPrice : product.price;
    const cartItemId = `${product.id}-${weight}-${grind}-${isSubscription ? frequency : 'one-time'}`;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prevCart,
        {
          cartItemId,
          productId: product.id,
          name: product.name,
          tagline: product.tagline,
          bagImage: product.bagImage,
          price: unitPrice,
          weight,
          grind,
          isSubscription,
          frequency,
          quantity
        }
      ];
    });

    showToast(`Added ${product.name} (${weight}, ${grind}) to cart!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedDiscount(null);
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from favorites');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added to your favorite ritual list ❤');
        return [...prev, productId];
      }
    });
  };

  const addLoyaltyPoints = (amountSpent) => {
    const earned = Math.floor(amountSpent);
    setUser(prev => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + earned
    }));
  };

  const addProduct = async (productData) => {
    try {
      const res = await api.createProduct(productData);
      if (res.success) {
        showToast(`Specialty coffee "${productData.name}" added! ☕`);
        await fetchProducts();
        return { success: true, product: res.product };
      } else {
        showToast(res.message || 'Error adding product');
        return { success: false, message: res.message };
      }
    } catch (err) {
      console.error('Error adding product:', err);
      showToast('Server error adding product');
      return { success: false, message: err.message };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const res = await api.updateProduct(id, productData);
      if (res.success) {
        showToast(`Updated product "${res.product.name}"!`);
        await fetchProducts();
        return { success: true, product: res.product };
      } else {
        showToast(res.message || 'Error updating product');
        return { success: false, message: res.message };
      }
    } catch (err) {
      console.error('Error updating product:', err);
      showToast('Server error updating product');
      return { success: false, message: err.message };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        showToast('Product deleted from inventory');
        await fetchProducts();
        return { success: true };
      } else {
        showToast(res.message || 'Error deleting product');
        return { success: false, message: res.message };
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      showToast('Server error deleting product');
      return { success: false, message: err.message };
    }
  };

  const updateProductStock = async (id, newStock) => {
    try {
      const res = await api.updateProduct(id, { stock: newStock });
      if (res.success) {
        showToast(`Stock updated to ${newStock} bags`);
        await fetchProducts();
        return { success: true };
      }
    } catch (err) {
      console.error('Error updating stock:', err);
    }
  };

  const NORMAL_DELIVERY_FEE = 150; // Standard delivery fee Rs. 150
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = appliedDiscount ? (subtotal * (appliedDiscount.discountPercent / 100)) : 0;
  const shipping = subtotal === 0 ? 0 : NORMAL_DELIVERY_FEE;
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

  // Notifications State & Logic
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const email = user.email ? user.email.trim().toLowerCase() : '';
      if (!email) {
        setNotifications([]);
        return;
      }
      const res = await api.getNotifications(email);
      if (res.success && Array.isArray(res.notifications)) {
        setNotifications(res.notifications);
      }
    } catch (e) {
      console.warn('Error fetching notifications:', e.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 8000);
    return () => clearInterval(interval);
  }, [user.email]);

  const markNotificationRead = async (id) => {
    try {
      const res = await api.markNotificationRead(id);
      if (res.success) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (e) {
      console.warn('Error marking notification read:', e.message);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      const email = user.email ? user.email.trim().toLowerCase() : '';
      if (!email) return;
      const res = await api.markAllNotificationsRead(email);
      if (res.success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        showToast('All notifications marked as read! 🔔');
      }
    } catch (e) {
      console.warn('Error marking all notifications read:', e.message);
    }
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  return (
    <StoreContext.Provider value={{
      products,
      loadingProducts,
      fetchProducts,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      subtotal,
      discountAmount,
      shipping,
      grandTotal,
      wishlist,
      toggleWishlist,
      appliedDiscount,
      setAppliedDiscount,
      subscriberCode,
      setSubscriberCode,
      discounts,
      fetchDiscounts,
      setDiscounts,
      isAdminAuthenticated,
      setIsAdminAuthenticated,
      adminUser,
      setAdminUser,
      isAdminLoginModalOpen,
      setIsAdminLoginModalOpen,
      adminLogin,
      adminLogout,
      toggleAdminRole,
      role,
      setRole,
      user,
      setUser,
      setCustomerAccount,
      fetchUserOrders,
      addLoyaltyPoints,
      addProduct,
      updateProduct,
      deleteProduct,
      updateProductStock,
      currentPage,
      setCurrentPage,
      isSidebarOpen,
      setIsSidebarOpen,
      isCartOpen,
      setIsCartOpen,
      isWishlistOpen,
      setIsWishlistOpen,
      isChatOpen,
      setIsChatOpen,
      isTrackerOpen,
      setIsTrackerOpen,
      isRewardsOpen,
      setIsRewardsOpen,
      selectedProductDetail,
      setSelectedProductDetail,
      trackedOrder,
      setTrackedOrder,
      userOrdersHistory,
      setUserOrdersHistory,
      isOrderHistoryOpen,
      setIsOrderHistoryOpen,
      addOrderToHistory,
      toastMessage,
      showToast,
      notifications,
      setNotifications,
      isNotificationsOpen,
      setIsNotificationsOpen,
      fetchNotifications,
      markNotificationRead,
      markAllNotificationsRead,
      unreadNotificationCount
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
