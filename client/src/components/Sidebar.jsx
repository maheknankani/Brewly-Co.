import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  X, Home, Coffee, Package, Sparkles, RefreshCw, Truck, Award, MessageSquare, ShieldCheck, UserCheck, ChevronRight, Clock, Info, HelpCircle, LogOut, Lock, Heart
} from 'lucide-react';

export const Sidebar = () => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    currentPage,
    setCurrentPage,
    role,
    isAdminAuthenticated,
    toggleAdminRole,
    user,
    wishlist,
    setIsWishlistOpen,
    setIsTrackerOpen,
    setIsOrderHistoryOpen,
    setIsRewardsOpen,
    setIsChatOpen
  } = useStore();

  if (!isSidebarOpen) return null;

  const navigateTo = (page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Main Coffee Ritual', icon: <Home size={18} />, description: 'Hero customizer & featured roasts' },
    { id: 'shop', label: '12 World Coffee Origins', icon: <Coffee size={18} />, description: 'Single-origins from Ethiopia, Colombia & more' },
    { id: 'subscriptions', label: 'Subscriptions & Delivery', icon: <RefreshCw size={18} />, description: 'Recurring 15% discount plans' },
    { id: 'about', label: 'About Brewly & Co.', icon: <Info size={18} />, description: 'Our roastery story, values & ethically sourced beans' },
    { id: 'faq', label: 'FAQs & Support', icon: <HelpCircle size={18} />, description: 'Clear answers on shipping, coffee & payments' },
    { id: 'order-history', label: 'Order History Portal', icon: <Clock size={18} />, description: 'View past receipts & purchased items' },
    { id: 'track-live', label: 'Live Shipment Tracking', icon: <Truck size={18} />, description: 'Real-time roasting & delivery timeline' }
  ];

  const quickActions = [
    { label: 'Saved Favorites Wishlist', icon: <Heart size={16} className="text-amberGold-500 fill-amberGold-500" />, badge: `${wishlist.length} saved`, action: () => { setIsSidebarOpen(false); setIsWishlistOpen(true); } },
    { label: 'Customer Order History Page', icon: <Clock size={16} />, action: () => navigateTo('order-history') },
    { label: 'Track Live Shipment Page', icon: <Truck size={16} />, action: () => navigateTo('track-live') },
    { label: 'Quick Order History Drawer', icon: <Clock size={16} />, action: () => { setIsSidebarOpen(false); setIsOrderHistoryOpen(true); } },
    { label: 'Quick Order Tracker Drawer', icon: <Truck size={16} />, action: () => { setIsSidebarOpen(false); setIsTrackerOpen(true); } },
    { label: 'Loyalty & Ritual Rewards', icon: <Award size={16} />, badge: `${user.loyaltyPoints} Pts`, action: () => { setIsSidebarOpen(false); setIsRewardsOpen(true); } },
    { label: 'Live Barista Support Chat', icon: <MessageSquare size={16} />, action: () => { setIsSidebarOpen(false); setIsChatOpen(true); } }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className="fixed inset-0 bg-espresso-900/60 backdrop-blur-md transition-opacity"
      ></div>

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-sm bg-cream-100 shadow-2xl flex flex-col justify-between border-r border-cream-300">
          
          {/* Header */}
          <div className="p-6 border-b border-cream-300 flex items-center justify-between bg-cream-200/50">
            <div className="cursor-pointer" onClick={() => navigateTo('home')}>
              <h2 className="font-serif text-2xl font-bold text-espresso-900 tracking-tight">
                Brewly & Co. <span className="text-forest-700 text-xs font-sans uppercase tracking-widest block font-normal">- Navigation Menu</span>
              </h2>
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-espresso-900/70 hover:text-espresso-900 rounded-full hover:bg-cream-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Primary Page Links */}
            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-espresso-900/50 block mb-3">
                MAIN NAVIGATION
              </span>
              <div className="space-y-1.5">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                      currentPage === item.id
                        ? 'bg-forest-700 text-cream-100 border-forest-700 shadow-md'
                        : 'bg-cream-50 hover:bg-cream-200 text-espresso-900 border-cream-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${currentPage === item.id ? 'bg-forest-800 text-amberGold-400' : 'bg-cream-200 text-forest-700'}`}>
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-serif font-bold text-base">{item.label}</div>
                        <div className={`text-[10px] ${currentPage === item.id ? 'text-cream-200/80' : 'text-espresso-900/60'}`}>{item.description}</div>
                      </div>
                    </div>

                    <ChevronRight size={16} className={`transition-transform group-hover:translate-x-1 ${currentPage === item.id ? 'text-amberGold-400' : 'text-espresso-900/40'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Interactive Tools */}
            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-espresso-900/50 block mb-3">
                RITUAL TOOLS & SERVICES
              </span>
              <div className="space-y-1.5">
                {quickActions.map((qa, i) => (
                  <button
                    key={i}
                    onClick={qa.action}
                    className="w-full p-3 bg-cream-50 hover:bg-cream-200 border border-cream-300 rounded-xl text-left text-xs font-semibold text-espresso-900 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-forest-700">{qa.icon}</span>
                      <span>{qa.label}</span>
                    </div>

                    {qa.badge ? (
                      <span className="bg-amberGold-500/20 text-amberGold-600 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        {qa.badge}
                      </span>
                    ) : (
                      <ChevronRight size={14} className="text-espresso-900/30" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Admin Management / Portal Gateway */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  toggleAdminRole();
                }}
                className={`w-full p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                  role === 'admin' && isAdminAuthenticated
                    ? 'bg-espresso-900 text-amberGold-400 border-espresso-900 shadow-md'
                    : 'bg-cream-200 text-espresso-900 border-cream-300 hover:bg-cream-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {role === 'admin' && isAdminAuthenticated ? <ShieldCheck size={18} className="text-amberGold-400" /> : <Lock size={18} className="text-espresso-900" />}
                  <span>{role === 'admin' && isAdminAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cream-100/20">
                  {role === 'admin' && isAdminAuthenticated ? 'Manage' : 'Login'}
                </span>
              </button>
            </div>

          </div>

          {/* Footer User & Quality Info */}
          <div className="p-6 border-t border-cream-300 bg-cream-200/50 space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-forest-700 text-cream-100 flex items-center justify-center font-bold font-serif text-sm">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-espresso-900">{user.name}</div>
                <div className="text-[10px] text-forest-700 font-semibold">{user.tier} Member • {user.loyaltyPoints} Pts</div>
              </div>
            </div>

            <div className="pt-2 border-t border-cream-300 text-[10px] text-espresso-900/60 font-mono flex items-center justify-between">
              <span>Code: SLOWMORNINGS</span>
              <span className="text-forest-700 font-bold">10% OFF</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
