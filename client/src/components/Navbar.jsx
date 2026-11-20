import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Heart, Award, ShieldCheck, Menu, Clock, Truck, Lock } from 'lucide-react';

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

  const [isScrolled, setIsScrolled] = useState(false);

  /* ── Valid promo codes ── */
  const validPromoCodes = (discounts || []).filter(d => {
    if (d.active === false) return false;
    const now = new Date();
    if (d.startDate && now < new Date(d.startDate)) return false;
    if (d.endDate) {
      const end = new Date(d.endDate);
      end.setHours(23, 59, 59, 999);
      if (now > end) return false;
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
    ? { code: subscriberCode, discountPercent: 5, description: 'Subscriber Perk' }
    : { code: 'SLOWMORNINGS', discountPercent: 10, description: '10% off your first order' };

  const currentPromo = validPromoCodes.length > 0
    ? validPromoCodes[activePromoIdx % validPromoCodes.length]
    : defaultPromo;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleNavClick = (pageId, targetHash) => {
    setCurrentPage(pageId);
    if (targetHash) {
      setTimeout(() => {
        const el = document.getElementById(targetHash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
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

      {/* ── PROMOTIONAL STRIP ── */}
      <div className="bg-espresso-900 px-3 flex items-center justify-center">

        {/* MOBILE: single plain text line — no box, no wrapping */}
        <p
          className="sm:hidden py-1 text-[10px] text-cream-200/90 font-sans text-center whitespace-nowrap overflow-hidden text-ellipsis w-full cursor-pointer"
          onClick={() => {
            navigator.clipboard?.writeText(currentPromo.code);
            showToast?.(`Code ${currentPromo.code} copied! 📋`);
          }}
        >
          <span className="text-amberGold-400 font-bold font-mono">{currentPromo.code}</span>
          <span className="text-cream-200/60"> · {currentPromo.discountPercent}% OFF · tap to copy</span>
        </p>

        {/* DESKTOP (sm+): pill button layout */}
        <div className="hidden sm:flex items-center justify-center gap-2 py-1.5">
          <span className="hidden md:inline text-[11px] text-cream-200/70 font-sans">
            Fresh Artisan Coffee · Direct To Your Door ·
          </span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(currentPromo.code);
              showToast?.(`Code ${currentPromo.code} copied! 📋`);
            }}
            className="inline-flex items-center gap-1.5 bg-espresso-800 hover:bg-espresso-700 text-amberGold-400 border border-amberGold-500/30 px-3 py-0.5 rounded-full font-mono font-bold text-[11px] transition-colors cursor-pointer"
            title="Click to copy promo code"
          >
            <span className="text-cream-200/70 font-sans font-normal">Use code</span>
            <span>{currentPromo.code}</span>
            <span className="text-cream-200/50 font-sans font-normal">— {currentPromo.discountPercent}% OFF</span>
          </button>

          {validPromoCodes.length > 1 && (
            <div className="hidden md:flex items-center gap-1 text-[10px] font-mono text-cream-200/40">
              <button onClick={() => setActivePromoIdx(p => (p - 1 + validPromoCodes.length) % validPromoCodes.length)} className="hover:text-amberGold-400 px-0.5">‹</button>
              <span>{activePromoIdx + 1}/{validPromoCodes.length}</span>
              <button onClick={() => setActivePromoIdx(p => (p + 1) % validPromoCodes.length)} className="hover:text-amberGold-400 px-0.5">›</button>
            </div>
          )}
        </div>

      </div>

      {/* ── MAIN HEADER NAV ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between gap-2 transition-all duration-300 ${isScrolled ? 'h-12 sm:h-14' : 'h-14 sm:h-18'}`}>

          {/* LEFT: Hamburger + desktop nav */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-cream-200 border border-cream-300 rounded-xl text-forest-700"
              title="Menu"
            >
              <Menu size={17} />
            </button>

            {/* Desktop nav links */}
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
                      isActive ? 'text-forest-700 bg-forest-700/10' : 'text-espresso-900/80 hover:text-forest-700 hover:bg-cream-200/80'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`absolute bottom-1 left-3 right-3 h-0.5 bg-forest-700 rounded-full transition-all duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 origin-left'}`}></span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* MIDDLE: Brand logo */}
          <div
            className="text-center cursor-pointer px-1 min-w-0 flex-1 lg:flex-none"
            onClick={() => handleNavClick('home')}
          >
            <h1 className="font-serif text-base sm:text-2xl md:text-3xl font-bold tracking-tight text-espresso-900 hover:text-forest-700 transition-colors whitespace-nowrap">
              BREWLY &amp; CO.
            </h1>
            <span className="hidden sm:block text-[9px] font-sans uppercase tracking-widest text-espresso-900/50 font-medium">
              Coffee For Calm Mornings
            </span>
          </div>

          {/* RIGHT: Icons — trimmed on mobile */}
          <div className="flex items-center justify-end shrink-0 gap-0.5 sm:gap-1">

            {/* Track Live — sm+ only */}
            <button
              onClick={() => handleNavClick('track-live')}
              className={`p-1.5 hidden sm:flex transition-colors ${currentPage === 'track-live' ? 'text-forest-700' : 'text-espresso-900 hover:text-forest-700'}`}
              title="Track Order"
            >
              <Truck size={17} />
            </button>

            {/* Order History — sm+ only */}
            <button
              onClick={() => handleNavClick('order-history')}
              className={`p-1.5 hidden sm:flex transition-colors ${currentPage === 'order-history' ? 'text-forest-700' : 'text-espresso-900 hover:text-forest-700'}`}
              title="Order History"
            >
              <Clock size={17} />
            </button>

            {/* Rewards — hidden on mobile, sm+ only */}
            <button
              onClick={() => setIsRewardsOpen(true)}
              className="p-1.5 hidden sm:flex text-espresso-900 hover:text-forest-700 transition-colors"
              title={`Rewards (${user.loyaltyPoints} Pts)`}
            >
              <Award size={17} className="text-amberGold-600" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-1.5 text-espresso-900 hover:text-forest-700 transition-colors"
              title="Wishlist"
            >
              <Heart size={17} className={wishlist.length > 0 ? 'fill-amberGold-500 text-amberGold-500' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-amberGold-500 text-white text-[8px] font-bold w-3 h-3 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 text-espresso-900 hover:text-forest-700 transition-colors flex items-center gap-1"
              title="Cart"
            >
              <ShoppingBag size={19} />
              <span className="bg-forest-700 text-cream-100 font-bold px-1.5 py-0.5 rounded-full text-[10px]">
                {totalCartCount}
              </span>
            </button>

            {/* Admin lock/shield */}
            <div className="border-l border-cream-300 pl-1 sm:pl-2 ml-0.5">
              <button
                onClick={toggleAdminRole}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  role === 'admin' && isAdminAuthenticated
                    ? 'bg-espresso-900 text-amberGold-400 border-espresso-900 shadow-sm'
                    : 'bg-cream-200 text-espresso-900 hover:bg-cream-300 border-cream-300'
                }`}
                title={isAdminAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
              >
                {role === 'admin' && isAdminAuthenticated
                  ? <ShieldCheck size={15} className="text-amberGold-400" />
                  : <Lock size={15} className="text-espresso-900" />}
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
