import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useStore } from '../context/StoreContext';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  LayoutDashboard, Package, ShoppingCart, Tag, AlertTriangle, Plus, Edit, Trash2, CheckCircle, Clock, RefreshCw, DollarSign, Award, ArrowUpRight, LogOut, Lock, ShieldAlert, Search, Filter, X, Eye, AlertCircle, Calendar, Power, Star, Truck
} from 'lucide-react';

export const AdminDashboard = () => {
  const {
    products,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    showToast,
    isAdminAuthenticated,
    adminUser,
    setIsAdminLoginModalOpen,
    adminLogout,
    role,
    fetchDiscounts,
    appliedDiscount,
    setAppliedDiscount,
    subscriberCode,
    setSubscriberCode
  } = useStore();

  const [activeTab, setActiveTab] = useState('products'); // 'products', 'analytics', 'orders', 'inventory', 'subscriptions', 'discounts'
  
  // Data States
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Search & Filters for Products Table
  const [searchQuery, setSearchQuery] = useState('');
  const [roastFilter, setRoastFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');

  // Modals & Active Edit/Delete States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);

  // Blank Form State for Adding / Editing Product
  const defaultProductForm = {
    name: '',
    slug: '',
    subtitle: '',
    shortDescription: '',
    description: '',
    origin: '',
    region: '',
    farm: '',
    altitude: '',
    processingMethod: 'Washed Process',
    roastLevel: 'Medium Roast',
    roastCategory: 'Daily',
    flavorNotes: '',
    aroma: 'Floral & Sweet',
    acidity: 'Medium',
    body: 'Medium Full',
    sweetness: 'Caramel',
    price: 22.00,
    discountPrice: 19.00,
    subscriptionPrice: 18.70,
    rating: 4.8,
    reviewCount: 42,
    bagImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    stock: 50,
    category: 'Single Origin',
    isFeatured: false,
    badge: 'New Roast',
    weightOptions: ['250g', '500g', '1kg'],
    grindOptions: ['Whole Bean', 'Espresso', 'Filter / Drip', 'French Press', 'Pour Over'],
    brewingMethods: ['Espresso', 'Pour Over', 'French Press']
  };

  const [formData, setFormData] = useState(defaultProductForm);
  const [formError, setFormError] = useState('');

  // Discount Form & Management States
  const defaultDiscountForm = {
    code: '',
    discountPercent: 15,
    description: '',
    active: true,
    startDate: '',
    endDate: ''
  };

  const [editingDiscount, setEditingDiscount] = useState(null);
  const [deletingDiscount, setDeletingDiscount] = useState(null);
  const [discFormData, setDiscFormData] = useState(defaultDiscountForm);
  const [discFormError, setDiscFormError] = useState('');

  const loadAdminData = async () => {
    try {
      setLoadingData(true);
      const [anRes, ordRes, subRes, discRes] = await Promise.all([
        api.getAnalytics().catch(() => ({ success: false })),
        api.getOrders().catch(() => ({ success: false })),
        api.getSubscriptions().catch(() => ({ success: false })),
        api.getDiscounts().catch(() => ({ success: false }))
      ]);

      if (anRes.success) setAnalytics(anRes.analytics);
      if (ordRes.success) setOrders(ordRes.orders);
      if (subRes.success) setSubscriptions(subRes.subscriptions);
      if (discRes.success && Array.isArray(discRes.discounts)) {
        setDiscounts(discRes.discounts);
      } else {
        setDiscounts([]);
      }
      fetchDiscounts();
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadAdminData();
    const interval = setInterval(() => {
      loadAdminData();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormData(defaultProductForm);
    setFormError('');
    setShowAddModal(true);
  };

  // Open Edit Modal with Pre-populated Data
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      rating: product.rating !== undefined ? product.rating : 4.8,
      reviewCount: product.reviewCount !== undefined ? product.reviewCount : 0,
      flavorNotes: Array.isArray(product.flavorNotes) ? product.flavorNotes.join(', ') : (product.flavorNotes || ''),
      weightOptions: product.weightOptions || ['250g', '500g', '1kg'],
      grindOptions: product.grindOptions || ['Whole Bean', 'Espresso', 'Filter / Drip', 'French Press', 'Pour Over'],
      brewingMethods: product.brewingMethods || ['Espresso', 'Pour Over', 'French Press']
    });
    setFormError('');
  };

  // Handle Create / Update Form Submission
  const handleSubmitProductForm = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) return setFormError('Product Name is required.');
    if (!formData.origin.trim()) return setFormError('Origin location is required.');
    if (!formData.price || formData.price <= 0) return setFormError('Please enter a valid price.');

    const parsedFlavorNotes = typeof formData.flavorNotes === 'string'
      ? formData.flavorNotes.split(',').map(s => s.trim()).filter(Boolean)
      : formData.flavorNotes;

    const payload = {
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
      subscriptionPrice: formData.subscriptionPrice ? parseFloat(formData.subscriptionPrice) : (parseFloat(formData.price) * 0.85),
      rating: formData.rating !== undefined && formData.rating !== '' ? parseFloat(formData.rating) : 4.8,
      reviewCount: formData.reviewCount !== undefined && formData.reviewCount !== '' ? parseInt(formData.reviewCount) : 0,
      stock: parseInt(formData.stock) || 0,
      flavorNotes: parsedFlavorNotes
    };

    if (editingProduct) {
      const res = await updateProduct(editingProduct.id, payload);
      if (res.success) {
        setEditingProduct(null);
        fetchProducts();
      } else {
        setFormError(res.message || 'Failed to update product.');
      }
    } else {
      const res = await addProduct(payload);
      if (res.success) {
        setShowAddModal(false);
        fetchProducts();
      } else {
        setFormError(res.message || 'Failed to add product.');
      }
    }
  };

  // Handle Delete Confirmation
  const confirmDeleteProduct = async () => {
    if (!deletingProduct) return;
    const res = await deleteProduct(deletingProduct.id);
    if (res.success) {
      setDeletingProduct(null);
      fetchProducts();
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const res = await api.updateOrderStatus(id, status);
      if (res.success) {
        showToast(`Order #${id} status updated to ${status}`);
        loadAdminData();
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleToggleSubscriptionStatus = async (sub) => {
    const newStatus = sub.status === 'Active' ? 'Paused' : 'Active';
    try {
      const res = await api.updateSubscriptionStatus(sub.id, newStatus);
      if (res.success) {
        setSubscriptions(prev => prev.map(s => s.id === sub.id ? { ...s, status: newStatus } : s));
        showToast(`Subscription ${sub.id} status updated to ${newStatus}`);
      } else {
        showToast(res.message || 'Failed to update subscription');
      }
    } catch (err) {
      showToast('Error updating subscription');
    }
  };

  // Discount Handlers
  const handleOpenAddDiscountModal = () => {
    setEditingDiscount(null);
    setDiscFormData(defaultDiscountForm);
    setDiscFormError('');
    setShowAddDiscountModal(true);
  };

  const handleOpenEditDiscountModal = (disc) => {
    setEditingDiscount(disc);
    setDiscFormData({
      code: disc.code || '',
      discountPercent: disc.discountPercent || 15,
      description: disc.description || '',
      active: disc.active !== undefined ? disc.active : true,
      startDate: disc.startDate ? new Date(disc.startDate).toISOString().split('T')[0] : '',
      endDate: disc.endDate ? new Date(disc.endDate).toISOString().split('T')[0] : ''
    });
    setDiscFormError('');
    setShowAddDiscountModal(true);
  };

  const handleSaveDiscount = async (e) => {
    e.preventDefault();
    setDiscFormError('');

    if (!discFormData.code.trim()) return setDiscFormError('Promo code is required.');
    if (!discFormData.discountPercent || discFormData.discountPercent <= 0) {
      return setDiscFormError('Please enter a valid discount percentage.');
    }

    try {
      if (editingDiscount) {
        const id = editingDiscount._id || editingDiscount.id;
        const res = await api.updateDiscount(id, discFormData);
        if (res.success) {
          showToast(`Promo code ${discFormData.code} updated!`);
          setShowAddDiscountModal(false);
          setEditingDiscount(null);
          loadAdminData();
        } else {
          setDiscFormError(res.message || 'Failed to update promo code');
        }
      } else {
        const res = await api.createDiscount(discFormData);
        if (res.success) {
          showToast(`Promo code ${discFormData.code} created!`);
          setShowAddDiscountModal(false);
          loadAdminData();
        } else {
          setDiscFormError(res.message || 'Failed to create promo code');
        }
      }
    } catch (err) {
      setDiscFormError(err.message || 'An error occurred while saving promo code');
    }
  };

  const handleToggleDiscountStatus = async (disc) => {
    try {
      const id = disc._id || disc.id || disc.code;
      const res = await api.toggleDiscount(id);
      if (res.success && res.discount) {
        showToast(`Promo code ${disc.code} ${res.discount.active ? 'enabled' : 'disabled'}`);
        await loadAdminData();
      } else {
        setDiscounts(prev => prev.map(d => {
          if ((d._id && d._id === disc._id) || d.code === disc.code) {
            return { ...d, active: !d.active };
          }
          return d;
        }));
        showToast(`Promo code ${disc.code} ${!disc.active ? 'enabled' : 'disabled'}`);
      }
    } catch (err) {
      console.error('Error toggling discount status:', err);
      setDiscounts(prev => prev.map(d => {
        if ((d._id && d._id === disc._id) || d.code === disc.code) {
          return { ...d, active: !d.active };
        }
        return d;
      }));
      showToast(`Promo code ${disc.code} ${!disc.active ? 'enabled' : 'disabled'}`);
    }
  };

  const confirmDeleteDiscount = async () => {
    if (!deletingDiscount) return;
    const deletedCode = deletingDiscount.code;
    const id = deletingDiscount._id || deletingDiscount.id || deletingDiscount.code;

    try {
      // Optimistically remove only the specific deleted discount from state
      setDiscounts(prev => prev.filter(d => {
        const itemId = d._id || d.id;
        const isTargetId = itemId && String(itemId) === String(id);
        const isTargetCode = d.code && d.code === deletedCode;
        return !isTargetId && !isTargetCode;
      }));

      if (appliedDiscount && appliedDiscount.code === deletedCode) {
        if (setAppliedDiscount) setAppliedDiscount(null);
      }
      if (subscriberCode === deletedCode) {
        if (setSubscriberCode) setSubscriberCode('');
        localStorage.removeItem('brewly_subscriber_code');
      }

      const res = await api.deleteDiscount(id);
      showToast(`Promo code ${deletedCode} deleted from database & store.`);
      setDeletingDiscount(null);

      await loadAdminData();
      if (fetchDiscounts) await fetchDiscounts();
    } catch (err) {
      console.error('Error deleting discount:', err);
      setDiscounts(prev => prev.filter(d => {
        const itemId = d._id || d.id;
        const isTargetId = itemId && String(itemId) === String(id);
        const isTargetCode = d.code && d.code === deletedCode;
        return !isTargetId && !isTargetCode;
      }));
      showToast(`Promo code ${deletedCode} removed.`);
      setDeletingDiscount(null);
      if (fetchDiscounts) fetchDiscounts();
    }
  };

  const getDiscountStatus = (d) => {
    if (!d.active) return { label: 'Disabled', color: 'bg-red-100 text-red-800 border-red-300' };
    const now = new Date();
    if (d.startDate && now < new Date(d.startDate)) {
      return { label: 'Scheduled', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
    if (d.endDate) {
      const endOfEndDay = new Date(d.endDate);
      endOfEndDay.setHours(23, 59, 59, 999);
      if (now > endOfEndDay) {
        return { label: 'Expired', color: 'bg-gray-200 text-gray-700 border-gray-400' };
      }
    }
    return { label: 'Active', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  };

  // Filtered Products Calculation
  const filteredProducts = products.filter(p => {
    const matchesSearch = searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(p.flavorNotes) && p.flavorNotes.some(n => n.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesRoast = roastFilter === 'All' || p.roastLevel.toLowerCase().includes(roastFilter.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || (p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());
    
    let matchesStock = true;
    if (stockFilter === 'In Stock') matchesStock = p.stock >= 30;
    if (stockFilter === 'Low Stock') matchesStock = p.stock > 0 && p.stock < 30;
    if (stockFilter === 'Out of Stock') matchesStock = p.stock === 0;

    return matchesSearch && matchesRoast && matchesCategory && matchesStock;
  });

  const lowStockProducts = products.filter(p => p.stock < 30);

  // Lock Screen if Not Admin Authenticated
  if (!isAdminAuthenticated || role !== 'admin') {
    return (
      <div className="py-20 bg-cream-100 min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-espresso-900 border border-amberGold-500/30 text-cream-100 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amberGold-500/15 border border-amberGold-500/30 text-amberGold-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock size={32} />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amberGold-400 font-bold block">ACCESS RESTRICTED</span>
            <h2 className="text-2xl font-serif font-bold text-cream-100">Admin Authorization Required</h2>
            <p className="text-xs text-cream-200/70 leading-relaxed">
              This roastery management panel requires an authenticated administrator session (`role: "admin"`).
            </p>
          </div>

          <button
            onClick={() => setIsAdminLoginModalOpen(true)}
            className="w-full bg-amberGold-500 hover:bg-amberGold-400 text-espresso-950 font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <ShieldAlert size={16} />
            <span>Authenticate Admin Credentials</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-cream-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Title Header & Profile Badge */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-espresso-900 text-cream-100 p-6 rounded-3xl shadow-lg border border-espresso-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-amberGold-400 font-bold block">BREWLY ROASTERY MANAGEMENT SUITE</span>
              <span className="bg-forest-700/80 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-forest-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>AUTHENTICATED ADMIN</span>
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-cream-100">Specialty Coffee Control Center</h1>
            <p className="text-xs text-cream-200/70">
              Authenticated as <strong className="text-amberGold-400">{adminUser?.name || 'Head Roaster Admin'}</strong> ({adminUser?.email || 'admin@brewly.com'}) — Role: <span className="text-cream-100 font-semibold">{adminUser?.role || 'admin'}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleOpenAddModal}
              className="bg-forest-700 hover:bg-forest-800 text-cream-100 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors"
            >
              <Plus size={16} />
              <span>Add Coffee Product</span>
            </button>
            <button
              onClick={adminLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all border border-red-500/40 hover:scale-105 active:scale-95 cursor-pointer"
              title="Logout Admin Session"
            >
              <LogOut size={16} />
              <span>Logout Admin</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-cream-300">
          {[
            { id: 'products', label: `Products Management (${products.length})`, icon: <Package size={16} /> },
            { id: 'analytics', label: 'Sales Analytics', icon: <LayoutDashboard size={16} /> },
            { id: 'orders', label: `Customer Orders (${orders.length})`, icon: <ShoppingCart size={16} /> },
            { id: 'inventory', label: `Stock & Inventory (${lowStockProducts.length} low)`, icon: <AlertTriangle size={16} /> },
            { id: 'subscriptions', label: `Subscribers (${subscriptions.length})`, icon: <RefreshCw size={16} /> },
            { id: 'discounts', label: 'Coupons & Promos', icon: <Tag size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-espresso-900 text-amberGold-400 shadow'
                  : 'bg-cream-200 text-espresso-900 hover:bg-cream-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: PRODUCTS CRUD SUITE */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Search and Filters Bar */}
            <div className="bg-cream-200/80 border border-cream-300 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search products by name, origin, or note..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-cream-100 text-espresso-900 text-xs rounded-xl pl-9 pr-3 py-2 border border-cream-300 focus:outline-none focus:border-forest-700"
                />
                <Search size={14} className="absolute left-3 top-2.5 text-espresso-900/50" />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
                {/* Roast Level Filter */}
                <select
                  value={roastFilter}
                  onChange={(e) => setRoastFilter(e.target.value)}
                  className="bg-cream-100 border border-cream-300 rounded-xl px-3 py-2 font-medium text-espresso-900 focus:outline-none"
                >
                  <option value="All">All Roast Levels</option>
                  <option value="Light">Light Roast</option>
                  <option value="Medium">Medium Roast</option>
                  <option value="Dark">Dark Roast</option>
                </select>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-cream-100 border border-cream-300 rounded-xl px-3 py-2 font-medium text-espresso-900 focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Single Origin">Single Origin</option>
                  <option value="Signature Blend">Signature Blend</option>
                  <option value="Micro-Lot">Micro-Lot</option>
                  <option value="Organic">Organic</option>
                </select>

                {/* Stock Status Filter */}
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="bg-cream-100 border border-cream-300 rounded-xl px-3 py-2 font-medium text-espresso-900 focus:outline-none"
                >
                  <option value="All">All Stock Statuses</option>
                  <option value="In Stock">In Stock (30+)</option>
                  <option value="Low Stock">Low Stock (&lt;30)</option>
                </select>
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-cream-200/60 border border-cream-300 rounded-2xl overflow-hidden shadow-sm">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <Package size={40} className="mx-auto text-espresso-900/30" />
                  <p className="font-serif text-lg font-bold text-espresso-900">No coffee products match your filters</p>
                  <p className="text-xs text-espresso-900/60">Try adjusting search terms or clearing filter dropdowns.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-espresso-900">
                    <thead className="bg-cream-300/80 uppercase font-mono text-[10px] text-espresso-900/70 border-b border-cream-300">
                      <tr>
                        <th className="p-4">Coffee Product</th>
                        <th className="p-4">Origin & Farm</th>
                        <th className="p-4">Roast & Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Rating & Reviews</th>
                        <th className="p-4">Stock Status</th>
                        <th className="p-4">Badge</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-300">
                      {filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-cream-100 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img src={p.bagImage} alt={p.name} className="w-12 h-14 object-cover rounded-lg shadow-sm border border-cream-300 shrink-0" />
                            <div>
                              <div className="font-serif font-bold text-sm text-espresso-900">{p.name}</div>
                              <div className="text-[10px] text-espresso-900/60 font-mono">ID: {p.id}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold">{p.origin}</div>
                            <div className="text-[10px] text-forest-700">{p.farm || p.region || 'Artisan Estate'}</div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-espresso-900">{p.roastLevel}</span>
                            <div className="text-[10px] text-espresso-900/60">{p.category || 'Single Origin'}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-serif font-bold text-base text-espresso-900">${p.price.toFixed(2)}</div>
                            {p.discountPrice && (
                              <div className="text-[10px] text-amberGold-600 font-bold">Sale: ${p.discountPrice.toFixed(2)}</div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1 font-bold text-espresso-900">
                              <Star size={13} className="fill-amberGold-500 text-amberGold-500" />
                              <span>{p.rating !== undefined ? p.rating : 4.8}</span>
                            </div>
                            <div className="text-[10px] text-espresso-900/60 font-mono">({p.reviewCount || 0} reviews)</div>
                          </td>
                          <td className="p-4">
                            {p.stock === 0 ? (
                              <span className="px-2.5 py-1 rounded-full font-mono text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">
                                Out of Stock
                              </span>
                            ) : p.stock < 30 ? (
                              <span className="px-2.5 py-1 rounded-full font-mono text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                Low Stock ({p.stock})
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full font-mono text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                In Stock ({p.stock})
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="bg-cream-300 text-espresso-900 px-2 py-0.5 rounded text-[10px] font-semibold">
                              {p.badge || 'Standard'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-2 text-forest-700 hover:text-forest-900 hover:bg-cream-200 rounded-lg transition-colors"
                              title="Edit Coffee Product"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => setDeletingProduct(p)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Coffee Product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SALES & ANALYTICS */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-cream-200/80 border border-cream-300 p-6 rounded-2xl shadow-sm">
                <div className="text-xs font-bold uppercase text-espresso-900/60">Total Revenue</div>
                <div className="text-3xl font-serif font-bold text-espresso-900 mt-1">
                  ${analytics.totalRevenue ? analytics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                </div>
                <div className="text-[11px] text-forest-700 font-semibold mt-2 flex items-center gap-1">
                  <ArrowUpRight size={14} /> Real Paid Orders & Subscriptions
                </div>
              </div>

              <div className="bg-cream-200/80 border border-cream-300 p-6 rounded-2xl shadow-sm">
                <div className="text-xs font-bold uppercase text-espresso-900/60">Total Orders</div>
                <div className="text-3xl font-serif font-bold text-espresso-900 mt-1">{analytics.totalOrders || 0}</div>
                <div className="text-[11px] text-forest-700 font-semibold mt-2 flex items-center gap-1">
                  <ArrowUpRight size={14} /> {analytics.fulfillmentRate || 0}% fulfillment rate
                </div>
              </div>

              <div className="bg-cream-200/80 border border-cream-300 p-6 rounded-2xl shadow-sm">
                <div className="text-xs font-bold uppercase text-espresso-900/60">Active Subscribers</div>
                <div className="text-3xl font-serif font-bold text-espresso-900 mt-1">{analytics.activeSubscribers || 0}</div>
                <div className="text-[11px] text-amberGold-600 font-semibold mt-2 flex items-center gap-1">
                  <RefreshCw size={12} /> {analytics.activeCoffeeSubs || 0} Coffee • {analytics.activeFdSubs || 0} Free Delivery
                </div>
              </div>

              <div className="bg-cream-200/80 border border-cream-300 p-6 rounded-2xl shadow-sm">
                <div className="text-xs font-bold uppercase text-espresso-900/60">Customer Rating</div>
                <div className="text-3xl font-serif font-bold text-espresso-900 mt-1">
                  {analytics.customerRating > 0 ? `${analytics.customerRating.toFixed(1)} / 5.0` : '0 / No data'}
                </div>
                <div className="text-[11px] text-forest-700 font-semibold mt-2">
                  {analytics.totalReviews > 0 ? `Based on ${analytics.totalReviews} actual review${analytics.totalReviews === 1 ? '' : 's'}` : 'No reviews recorded'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 bg-cream-200/60 border border-cream-300 rounded-3xl p-6 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-espresso-900 mb-4">Monthly Revenue Growth ($)</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.monthlyRevenue || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2DACB" />
                      <XAxis dataKey="month" stroke="#1C1310" fontSize={12} />
                      <YAxis stroke="#1C1310" fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#2D3E35" strokeWidth={3} dot={{ fill: '#D99B26', r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-5 bg-cream-200/60 border border-cream-300 rounded-3xl p-6 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-espresso-900 mb-4">Popular Roast Sales (Bags Sold)</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.productSales || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2DACB" />
                      <XAxis dataKey="name" stroke="#1C1310" fontSize={10} />
                      <YAxis stroke="#1C1310" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#D99B26" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso-900">Manage Orders & Fulfillment ({orders.length})</h2>

            {orders.length === 0 ? (
              <div className="bg-cream-200/60 border border-cream-300 rounded-2xl p-12 text-center space-y-2">
                <ShoppingCart size={40} className="mx-auto text-espresso-900/30" />
                <p className="font-serif text-lg font-bold text-espresso-900">0 / No data</p>
                <p className="text-xs text-espresso-900/60">No customer orders have been recorded in MongoDB yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(ord => (
                  <div key={ord.id} className="bg-cream-200/70 border border-cream-300 rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-cream-300 pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-amberGold-600">ORDER #{ord.id}</span>
                        <h3 className="font-serif text-lg font-bold text-espresso-900">{ord.customerName} ({ord.customerEmail})</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-espresso-900">Status:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-cream-100 border border-cream-300 rounded-xl px-3 py-1.5 text-xs font-bold text-forest-700 focus:outline-none"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Roasted">Roasted</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="font-bold uppercase tracking-wider text-espresso-900/60 mb-1">Items Ordered</div>
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="text-espresso-900">
                            • {it.productName} ({it.weight}, {it.grind}) x{it.quantity} — ${(it.price * it.quantity).toFixed(2)}
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="font-bold uppercase tracking-wider text-espresso-900/60 mb-1">Shipping Address</div>
                        <div className="text-espresso-900">
                          {ord.shippingAddress?.address}, {ord.shippingAddress?.city}, {ord.shippingAddress?.state} {ord.shippingAddress?.zip}
                        </div>
                        <div className="font-bold text-espresso-900 mt-2">Total Paid: ${ord.total.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: INVENTORY ALERTS & CONTROLS */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso-900">Inventory & Stock Controls</h2>

            {lowStockProducts.length > 0 && (
              <div className="bg-amberGold-500/15 border border-amberGold-500/40 rounded-2xl p-4 flex items-center gap-3 text-espresso-900 text-xs font-semibold">
                <AlertTriangle size={20} className="text-amberGold-600 shrink-0" />
                <span>Warning: {lowStockProducts.length} specialty coffee items have low stock (&lt; 30 bags). Refill inventory below!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <div key={p.id} className="bg-cream-200/60 border border-cream-300 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img src={p.bagImage} alt={p.name} className="w-12 h-14 object-cover rounded-lg border border-cream-300" />
                    <div>
                      <h3 className="font-serif font-bold text-base text-espresso-900">{p.name}</h3>
                      <div className="text-xs text-forest-700 font-semibold">{p.origin} • {p.roastLevel}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-cream-300 pt-3">
                    <div>
                      <div className="text-[10px] text-espresso-900/60 font-mono">STOCK LEVEL</div>
                      <div className={`text-lg font-mono font-bold ${p.stock < 30 ? 'text-red-600' : 'text-forest-700'}`}>
                        {p.stock} bags
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => updateProductStock(p.id, Math.max(0, p.stock - 10))}
                        className="bg-cream-300 hover:bg-cream-400 text-espresso-900 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-cream-400"
                        title="Deduct 10 Bags"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => updateProductStock(p.id, p.stock + 50)}
                        className="bg-forest-700 hover:bg-forest-800 text-cream-100 text-xs font-semibold px-3 py-1.5 rounded-lg shadow"
                        title="Refill 50 Bags"
                      >
                        +50 Bags
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SUBSCRIBERS */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-espresso-900">Active Subscribers ({subscriptions.length})</h2>

            <div className="bg-cream-200/60 border border-cream-300 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-espresso-900">
                <thead className="bg-cream-300/80 uppercase font-mono text-[10px] text-espresso-900/70 border-b border-cream-300">
                  <tr>
                    <th className="p-4">Sub ID</th>
                    <th className="p-4">Subscriber</th>
                    <th className="p-4">Plan Name</th>
                    <th className="p-4">Frequency</th>
                    <th className="p-4">Assigned Promo Code</th>
                    <th className="p-4">Next Delivery</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-300">
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-espresso-900/50">
                        0 / No active coffee subscriptions recorded in MongoDB yet.
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map(s => {
                      const codeName = s.assignedPromoCode || 'BREWLY5';
                      const matchingDiscount = discounts.find(d => d.code === codeName);
                      const isActive = matchingDiscount ? matchingDiscount.active !== false : true;
                      const isUsed = matchingDiscount ? matchingDiscount.isUsed : false;

                      return (
                        <tr key={s.id} className="hover:bg-cream-100">
                          <td className="p-4 font-mono font-bold text-amberGold-600">{s.id}</td>
                          <td className="p-4 font-semibold">{s.customerName} ({s.customerEmail})</td>
                          <td className="p-4 font-serif font-bold">{s.planName}</td>
                          <td className="p-4">{s.frequency}</td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="bg-espresso-900 text-amberGold-400 font-mono font-bold px-2.5 py-1 rounded-lg text-[11px] inline-flex items-center gap-1 shadow-sm">
                                  <Tag size={12} className="text-amberGold-400" />
                                  <span>{codeName}</span>
                                  <span className="text-[9px] text-emerald-400 font-sans">({s.promoDiscountPercent || matchingDiscount?.discountPercent || 5}% OFF)</span>
                                </span>
                              </div>
                              <div className="text-[10px] flex items-center gap-1.5">
                                <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] border ${
                                  isUsed
                                    ? 'bg-gray-200 text-gray-700 border-gray-300'
                                    : isActive
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : 'bg-red-100 text-red-800 border-red-300'
                                }`}>
                                  {isUsed ? 'Used' : isActive ? 'Active Perk' : 'Disabled'}
                                </span>
                                {matchingDiscount && (
                                  <button
                                    onClick={() => handleToggleDiscountStatus(matchingDiscount)}
                                    className="text-espresso-900/60 hover:text-espresso-900 underline text-[10px] font-semibold transition-colors"
                                  >
                                    {isActive ? 'Deactivate' : 'Enable'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-mono">{s.nextDelivery}</td>
                          <td className="p-4"><span className="bg-green-200 text-green-800 font-bold px-2 py-0.5 rounded text-[10px]">{s.status}</span></td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: DISCOUNTS */}
        {activeTab === 'discounts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-espresso-900">Promo Codes & Discount Management</h2>
                <p className="text-xs text-espresso-900/60">Create, schedule start/end dates, toggle active state, or delete customer promo codes.</p>
              </div>
              <button
                onClick={handleOpenAddDiscountModal}
                className="bg-amberGold-500 hover:bg-amberGold-600 text-espresso-900 text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition-colors"
              >
                <Plus size={16} />
                <span>New Promo Code</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discounts.map((d, i) => {
                const status = getDiscountStatus(d);
                return (
                  <div key={d._id || d.id || i} className="bg-cream-200/80 border border-cream-300 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="bg-espresso-900 text-amberGold-400 font-mono font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1">
                          <Tag size={12} />
                          <span>{d.code}</span>
                        </span>
                        <div className="flex items-center gap-1">
                          {d.isSubscriberOnly && (
                            <span className="px-2 py-0.5 rounded-full font-mono text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              Subscriber Perk
                            </span>
                          )}
                          <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${d.isUsed ? 'bg-gray-200 text-gray-700 border-gray-400' : status.color}`}>
                            {d.isUsed ? 'Used' : status.label}
                          </span>
                        </div>
                      </div>

                      <div className="font-serif text-3xl font-bold text-espresso-900">
                        {d.discountPercent}% OFF
                      </div>

                      {d.description && (
                        <p className="text-xs text-espresso-900/80 font-medium leading-relaxed">
                          {d.description}
                        </p>
                      )}

                      {d.customerEmail && (
                        <div className="text-[11px] font-semibold text-forest-700 bg-forest-50 p-2 rounded-lg border border-forest-100">
                          Assigned To: {d.customerEmail}
                        </div>
                      )}

                      <div className="pt-2 border-t border-cream-300 text-[11px] space-y-1 text-espresso-900/70 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-forest-700 shrink-0" />
                          <span>Start: {d.startDate ? new Date(d.startDate).toLocaleDateString() : 'Immediate'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-amberGold-600 shrink-0" />
                          <span>Expires: {d.endDate ? new Date(d.endDate).toLocaleDateString() : 'No expiration'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-cream-300 pt-3">
                      <button
                        onClick={() => handleToggleDiscountStatus(d)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1 transition-colors ${
                          d.active
                            ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                        title={d.active ? 'Disable Promo Code' : 'Enable Promo Code'}
                      >
                        <Power size={13} />
                        <span>{d.active ? 'Disable' : 'Enable'}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditDiscountModal(d)}
                          className="p-2 text-forest-700 hover:text-forest-900 hover:bg-cream-300 rounded-lg transition-colors"
                          title="Edit Promo Code"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingDiscount(d)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Promo Code"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}



        {/* MODAL: ADD / EDIT PRODUCT */}
        {(showAddModal || editingProduct) && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-espresso-900/60 backdrop-blur-sm">
            <div className="bg-cream-100 rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-cream-300 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto my-8">
              
              <div className="flex items-center justify-between border-b border-cream-300 pb-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-espresso-900">
                    {editingProduct ? 'Edit Coffee Product' : 'Add New Specialty Coffee'}
                  </h3>
                  <p className="text-xs text-espresso-900/60">
                    {editingProduct ? `Modifying ID: ${editingProduct.id}` : 'Fill in origin details, roast notes, pricing, and stock.'}
                  </p>
                </div>
                <button
                  onClick={() => { setShowAddModal(false); setEditingProduct(null); }}
                  className="p-2 text-espresso-900/60 hover:text-espresso-900 rounded-full hover:bg-cream-200"
                >
                  <X size={20} />
                </button>
              </div>

              {formError && (
                <div className="bg-red-100 border border-red-300 text-red-800 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitProductForm} className="space-y-4 text-xs">
                
                {/* Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-espresso-900 block mb-1">Product Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Panama Geisha Reserve"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5 font-semibold text-espresso-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-espresso-900 block mb-1">Slug (URL identifier)</label>
                    <input
                      type="text"
                      placeholder="e.g. panama-geisha-reserve"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5 font-mono text-espresso-900"
                    />
                  </div>
                </div>

                {/* Origin Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-espresso-900 block mb-1">Origin Country/State *</label>
                    <input
                      type="text"
                      placeholder="e.g. Boquete, Panama"
                      required
                      value={formData.origin}
                      onChange={(e) => setFormData({...formData, origin: e.target.value})}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-espresso-900 block mb-1">Region</label>
                    <input
                      type="text"
                      placeholder="e.g. Chiriquí Highlands"
                      value={formData.region}
                      onChange={(e) => setFormData({...formData, region: e.target.value})}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-espresso-900 block mb-1">Farm / Estate</label>
                    <input
                      type="text"
                      placeholder="e.g. Hacienda La Esmeralda"
                      value={formData.farm}
                      onChange={(e) => setFormData({...formData, farm: e.target.value})}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5"
                    />
                  </div>
                </div>

                {/* Roast & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-espresso-900 block mb-1">Roast Level *</label>
                    <select
                      value={formData.roastLevel}
                      onChange={(e) => setFormData({...formData, roastLevel: e.target.value})}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5 font-semibold"
                    >
                      <option value="Light Roast">Light Roast</option>
                      <option value="Medium Roast">Medium Roast</option>
                      <option value="Medium-Dark Roast">Medium-Dark Roast</option>
                      <option value="Dark Roast">Dark Roast</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-espresso-900 block mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5 font-semibold"
                    >
                      <option value="Single Origin">Single Origin</option>
                      <option value="Signature Blend">Signature Blend</option>
                      <option value="Micro-Lot">Micro-Lot</option>
                      <option value="Organic">Organic</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-espresso-900 block mb-1">Processing Method</label>
                    <input
                      type="text"
                      placeholder="e.g. Natural / Anaerobic"
                      value={formData.processingMethod}
                      onChange={(e) => setFormData({...formData, processingMethod: e.target.value})}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5"
                    />
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="font-bold text-espresso-900 block mb-1">Regular Price ($) *</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-espresso-900 block mb-1">Sale Price ($)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.discountPrice || ''}
                      onChange={(e) => setFormData({...formData, discountPrice: e.target.value})}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-espresso-900 block mb-1">Subscription Price ($)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.subscriptionPrice || ''}
                      onChange={(e) => setFormData({...formData, subscriptionPrice: e.target.value})}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-espresso-900 block mb-1">Stock (Bags) *</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Rating & Review Count */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-espresso-900 block mb-1">Product Rating (1.0 – 5.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      placeholder="4.8"
                      value={formData.rating !== undefined ? formData.rating : 4.8}
                      onChange={(e) => setFormData({...formData, rating: e.target.value})}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-espresso-900 block mb-1">Total Reviews Count</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="42"
                      value={formData.reviewCount !== undefined ? formData.reviewCount : 0}
                      onChange={(e) => setFormData({...formData, reviewCount: e.target.value})}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Flavor Notes & Descriptions */}
                <div>
                  <label className="font-bold text-espresso-900 block mb-1">Flavor Notes (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Jasmine, Peach, Bergamot, Honey"
                    value={formData.flavorNotes}
                    onChange={(e) => setFormData({...formData, flavorNotes: e.target.value})}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="font-bold text-espresso-900 block mb-1">Short Description</label>
                  <input
                    type="text"
                    placeholder="e.g. A rare floral single-origin with bright jasmine cup notes."
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="font-bold text-espresso-900 block mb-1">Full Description Narrative</label>
                  <textarea
                    rows={3}
                    placeholder="Write story and sensory description of this coffee..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5"
                  />
                </div>

                {/* Image URL & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-espresso-900 block mb-1">Product Bag Image URL</label>
                    <input
                      type="text"
                      value={formData.bagImage}
                      onChange={(e) => setFormData({...formData, bagImage: e.target.value})}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-espresso-900 block mb-1">Product Badge Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Rare Reserve, New, Limited"
                      value={formData.badge}
                      onChange={(e) => setFormData({...formData, badge: e.target.value})}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5"
                    />
                  </div>
                </div>

                {/* Submit Controls */}
                <div className="flex gap-3 pt-4 border-t border-cream-300">
                  <button
                    type="submit"
                    className="flex-1 bg-forest-700 hover:bg-forest-800 text-cream-100 font-bold py-3 rounded-xl shadow-md text-sm transition-colors"
                  >
                    {editingProduct ? 'Save Product Changes' : 'Create Coffee Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowAddModal(false); setEditingProduct(null); }}
                    className="px-6 bg-cream-200 text-espresso-900 font-semibold rounded-xl border border-cream-300 hover:bg-cream-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* MODAL: DELETE CONFIRMATION */}
        {deletingProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-espresso-900/60 backdrop-blur-sm">
            <div className="bg-cream-100 rounded-3xl p-6 max-w-md w-full border border-cream-300 shadow-2xl space-y-4 text-center">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
                <Trash2 size={26} />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-espresso-900">Delete Product Confirmation</h3>
                <p className="text-xs text-espresso-900/70">
                  Are you sure you want to delete <strong className="text-espresso-900">{deletingProduct.name}</strong> from MongoDB and the customer storefront?
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={confirmDeleteProduct}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-md text-xs transition-colors"
                >
                  Yes, Delete Product
                </button>
                <button
                  onClick={() => setDeletingProduct(null)}
                  className="flex-1 bg-cream-200 text-espresso-900 font-semibold py-3 rounded-xl border border-cream-300 hover:bg-cream-300 text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT DISCOUNT */}
        {showAddDiscountModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-espresso-900/60 backdrop-blur-sm">
            <div className="bg-cream-100 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-cream-300 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-cream-300 pb-3">
                <h3 className="font-serif text-xl font-bold text-espresso-900">
                  {editingDiscount ? 'Edit Promo Discount Code' : 'Create Promo Discount Code'}
                </h3>
                <button
                  onClick={() => { setShowAddDiscountModal(false); setEditingDiscount(null); }}
                  className="p-1.5 text-espresso-900/60 hover:text-espresso-900 rounded-full hover:bg-cream-200"
                >
                  <X size={18} />
                </button>
              </div>

              {discFormError && (
                <div className="bg-red-100 border border-red-300 text-red-800 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{discFormError}</span>
                </div>
              )}

              <form onSubmit={handleSaveDiscount} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-espresso-900 block mb-1">Promo Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. SUMMER25"
                    required
                    value={discFormData.code}
                    onChange={(e) => setDiscFormData({...discFormData, code: e.target.value.toUpperCase()})}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5 uppercase font-mono font-bold text-espresso-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-espresso-900 block mb-1">Discount Percentage (%) *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="e.g. 25"
                    required
                    value={discFormData.discountPercent}
                    onChange={(e) => setDiscFormData({...discFormData, discountPercent: e.target.value})}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5 font-bold text-espresso-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-espresso-900 block mb-1">Short Description</label>
                  <input
                    type="text"
                    placeholder="e.g. 25% off summer roast collection"
                    value={discFormData.description}
                    onChange={(e) => setDiscFormData({...discFormData, description: e.target.value})}
                    className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2.5 text-espresso-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-espresso-900 block mb-1">Start Date (Optional)</label>
                    <input
                      type="date"
                      value={discFormData.startDate}
                      onChange={(e) => setDiscFormData({...discFormData, startDate: e.target.value})}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2 text-espresso-900"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-espresso-900 block mb-1">End Date (Optional)</label>
                    <input
                      type="date"
                      value={discFormData.endDate}
                      onChange={(e) => setDiscFormData({...discFormData, endDate: e.target.value})}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2 text-espresso-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="discActiveCheckbox"
                    checked={discFormData.active}
                    onChange={(e) => setDiscFormData({...discFormData, active: e.target.checked})}
                    className="w-4 h-4 text-forest-700 rounded border-cream-300 cursor-pointer"
                  />
                  <label htmlFor="discActiveCheckbox" className="font-semibold text-espresso-900 cursor-pointer">
                    Enable Code Immediately (Active)
                  </label>
                </div>

                <div className="flex gap-2 pt-3 border-t border-cream-300">
                  <button type="submit" className="flex-1 bg-amberGold-500 hover:bg-amberGold-600 text-espresso-900 font-bold py-3 rounded-xl shadow transition-colors">
                    {editingDiscount ? 'Save Promo Changes' : 'Create Promo Code'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowAddDiscountModal(false); setEditingDiscount(null); }}
                    className="px-4 bg-cream-200 border border-cream-300 rounded-xl text-espresso-900 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: DELETE DISCOUNT CONFIRMATION */}
        {deletingDiscount && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-espresso-900/60 backdrop-blur-sm">
            <div className="bg-cream-100 rounded-3xl p-6 max-w-md w-full border border-cream-300 shadow-2xl space-y-4 text-center">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
                <Trash2 size={26} />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-espresso-900">Delete Promo Code Confirmation</h3>
                <p className="text-xs text-espresso-900/70">
                  Are you sure you want to delete promo code <strong className="text-espresso-900">{deletingDiscount.code}</strong>? Customers will no longer be able to use it at checkout.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={confirmDeleteDiscount}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-md text-xs transition-colors"
                >
                  Yes, Delete Promo Code
                </button>
                <button
                  onClick={() => setDeletingDiscount(null)}
                  className="flex-1 bg-cream-200 text-espresso-900 font-semibold py-3 rounded-xl border border-cream-300 hover:bg-cream-300 text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
