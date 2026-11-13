import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Heart, Search, Award, ShieldCheck, UserCheck, Menu, Clock, Truck, Lock, PackageCheck } from 'lucide-react';

export const Navbar = () => {
  const {
    cart,
    wishlist,
    role,
    isAdminAuthenticated,
    toggleAdminRole,
    currentPage,
    setCurrentPage,
    setIsSidebarOpen,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsRewardsOpen,
    user,
    products,
    setSelectedProductDetail,
    discounts,
    subscriberCode,
    showToast
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Filter only active, currently valid promo codes
  const validPromoCodes = (discounts || []).filter(d => {
    if (d.active === false) return false;
    const now = new Date();
    if (d.startDate && now < new Date(d.startDate)) return false;
    if (d.endDate) {
      const endOfEndDay = new Date(d.endDate);
      endOfEndDay.setHours(23, 59, 59, 999);
      if (now > endOfEndDay) return false;
    }
    return true;
  });

  const [activePromoIdx, setActivePromoIdx] = useState(0);

  useEffect(() => {
    if (validPromoCodes.length <= 1) return;
    const interval = setInterval(() => {
      setActivePromoIdx(prev => (prev + 1) % validPromoCodes.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [validPromoCodes.length]);

  const defaultPromo = subscriberCode
    ? { code: subscriberCode, discountPercent: 5, description: 'Exclusive 5% Subscriber Perk' }
    : { code: 'SLOWMORNINGS', discountPercent: 10, description: 'Get 10% off your first ritual' };

  const currentPromo = validPromoCodes.length > 0
    ? validPromoCodes[activePromoIdx % validPromoCodes.length]
    : defaultPromo;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const filteredProducts = searchQuery.trim() === ''
    ? []
    : products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.flavorNotes.some(n => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.roastLevel.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleNavClick = (pageId, targetHash) => {
    setCurrentPage(pageId);
    if (targetHash) {
      setTimeout(() => {
        const el = document.getElementById(targetHash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled
        ? 'bg-cream-100/95 backdrop-blur-md shadow-sm border-b border-cream-300'
        : 'bg-cream-100 border-b border-cream-300'
    }`}>
      
      {/* Dynamic Announcement Bar */}
      <div className="bg-espresso-900 text-cream-100 text-xs py-2 px-4 text-center tracking-wide font-sans flex items-center justify-center gap-2 relative overflow-hidden">
        <span className="font-semibold text-amberGold-400 shrink-0">Fresh Artisan Coffee Delivered Directly To Your Door.</span>
        <span className="hidden sm:inline text-cream-200/50">•</span>
        <div className="flex items-center gap-2 transition-all duration-500">
          <span>
            {currentPromo.description
              ? `${currentPromo.description} with code:`
              : `Get ${currentPromo.discountPercent}% off with code:`}
          </span>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(currentPromo.code);
              }
              showToast?.(`Promo code ${currentPromo.code} copied to clipboard! 📋`);
            }}
            className="bg-espresso-800 hover:bg-espresso-700 text-amberGold-400 border border-amberGold-500/30 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title="Click to Copy Promo Code"
          >
            <span>{currentPromo.code}</span>
            <span className="text-[10px] opacity-75 font-sans">({currentPromo.discountPercent}% OFF)</span>
          </button>
        </div>

        {validPromoCodes.length > 1 && (
          <div className="hidden md:flex items-center gap-1.5 ml-3 pl-3 border-l border-espresso-800 text-[10px] font-mono text-cream-200/60">
            <button
              onClick={() => setActivePromoIdx(prev => (prev - 1 + validPromoCodes.length) % validPromoCodes.length)}
              className="hover:text-amberGold-400 p-0.5"
              title="Previous Promo"
            >
              ‹
            </button>
            <span>{activePromoIdx + 1}/{validPromoCodes.length}</span>
            <button
              onClick={() => setActivePromoIdx(prev => (prev + 1) % validPromoCodes.length)}
              className="hover:text-amberGold-400 p-0.5"
              title="Next Promo"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Main Header Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between gap-2 transition-all duration-300 ${isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'}`}>
          
          {/* LEFT SIDE: Navigation Links & Mobile Menu Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-cream-200 border border-cream-300 text-espresso-900 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold"
              title="Open Navigation Menu"
            >
              <Menu size={18} className="text-forest-700" />
            </button>

            {/* Desktop Left Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
              {[
                { id: 'shop', label: 'Shop' },
                { id: 'coffee-finder', label: 'Coffee Finder', action: () => handleNavClick('home', 'coffee-finder') },
                { id: 'subscriptions', label: 'Subscriptions' },
                { id: 'about', label: 'Our Story' },
                { id: 'faq', label: 'FAQs' }
              ].map(item => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={item.action || (() => handleNavClick(item.id))}
                    className={`relative px-3 py-1.5 rounded-xl transition-all duration-300 font-bold flex items-center group ${
                      isActive
                        ? 'text-forest-700 bg-forest-700/10'
                        : 'text-espresso-900/80 hover:text-forest-700 hover:bg-cream-200/80'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`absolute bottom-1 left-3 right-3 h-0.5 bg-forest-700 rounded-full transition-all duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 origin-left'
                      }`}
                    ></span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* MIDDLE: Centered Brand Logo */}
          <div className="text-center cursor-pointer px-1 sm:px-2 min-w-0" onClick={() => handleNavClick('home')}>
            <h1 className="font-serif text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-espresso-900 hover:text-forest-700 transition-colors whitespace-nowrap">
              BREWLY & CO.
            </h1>
            <span className="hidden sm:block text-[9px] font-sans uppercase tracking-widest text-espresso-900/60 font-medium">
              Coffee For Calm Mornings
            </span>
          </div>

          {/* RIGHT SIDE: Action Icons & Quick Pages */}
          <div className="flex items-center justify-end space-x-1 sm:space-x-2 shrink-0">
            
            {/* Live Search */}
            <div className="relative hidden 2xl:block w-40">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search coffee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="w-full bg-cream-200/80 text-espresso-900 text-xs rounded-full pl-8 pr-3 py-1.5 border border-cream-300 focus:outline-none focus:border-forest-700 transition-all placeholder:text-espresso-900/50"
                />
                <Search size={14} className="absolute left-2.5 top-2 text-espresso-900/60" />
              </div>

              {/* Autocomplete Dropdown */}
              {isSearchFocused && filteredProducts.length > 0 && (
                <div className="absolute right-0 mt-2 w-64 bg-cream-50 rounded-xl shadow-xl border border-cream-300 overflow-hidden z-50 max-h-72 overflow-y-auto">
                  {filteredProducts.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedProductDetail(p);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-cream-200 cursor-pointer border-b border-cream-200 last:border-0"
                    >
                      <img src={p.bagImage} alt={p.name} className="w-10 h-10 object-cover rounded" />
                      <div>
                        <div className="text-sm font-semibold font-serif text-espresso-900">{p.name}</div>
                        <div className="text-xs text-forest-700">{p.roastLevel} • ${p.price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Link to Track Live Page */}
            <button
              onClick={() => handleNavClick('track-live')}
              className={`p-1.5 sm:p-2 hidden sm:block transition-colors ${currentPage === 'track-live' ? 'text-forest-700 font-bold' : 'text-espresso-900 hover:text-forest-700'}`}
              title="Track Live Shipment"
            >
              <Truck size={18} />
            </button>

            {/* Direct Link to Order History Page */}
            <button
              onClick={() => handleNavClick('order-history')}
              className={`p-1.5 sm:p-2 hidden sm:block transition-colors ${currentPage === 'order-history' ? 'text-forest-700 font-bold' : 'text-espresso-900 hover:text-forest-700'}`}
              title="View Order History"
            >
              <Clock size={18} />
            </button>

            {/* Loyalty Rewards */}
            <button
              onClick={() => setIsRewardsOpen(true)}
              className="p-1.5 sm:p-2 text-espresso-900 hover:text-forest-700 transition-colors"
              title={`View Loyalty Rewards (${user.loyaltyPoints} Pts)`}
            >
              <Award size={18} className="text-amberGold-600" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-1.5 sm:p-2 text-espresso-900 hover:text-forest-700 transition-colors"
              title="View Favorites"
            >
              <Heart size={18} className={wishlist.length > 0 ? "fill-amberGold-500 text-amberGold-500" : ""} />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-amberGold-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 sm:p-2 text-espresso-900 hover:text-forest-700 transition-colors flex items-center gap-1"
              title="Shopping Cart"
            >
              <ShoppingBag size={20} />
              <span className="bg-forest-700 text-cream-100 font-bold px-1.5 py-0.5 rounded-full text-[10px] shadow-sm">
                {totalCartCount}
              </span>
            </button>

            {/* Account / Admin Portal */}
            <div className="border-l border-cream-300 pl-1 sm:pl-2">
              <button
                onClick={toggleAdminRole}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  role === 'admin' && isAdminAuthenticated
                    ? 'bg-espresso-900 text-amberGold-400 border-espresso-900 shadow-sm'
                    : 'bg-cream-200 text-espresso-900 hover:bg-cream-300 border-cream-300'
                }`}
                title={isAdminAuthenticated ? "Go to Admin Dashboard" : "Admin Login"}
              >
                {role === 'admin' && isAdminAuthenticated ? (
                  <ShieldCheck size={16} className="text-amberGold-400" />
                ) : (
                  <Lock size={16} className="text-espresso-900" />
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
