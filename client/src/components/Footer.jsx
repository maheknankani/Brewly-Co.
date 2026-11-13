import React from 'react';
import { useStore } from '../context/StoreContext';

export const Footer = () => {
  const { setCurrentPage, setIsTrackerOpen } = useStore();

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
    <footer className="bg-espresso-900 text-cream-100 border-t border-espresso-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Four Columns Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-espresso-800">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-cream-100">
              Brewly
            </h2>
            <p className="text-xs text-cream-200/70 leading-relaxed font-sans">
              Discover Your Perfect Brew. Specialty coffee harvested at peak ripeness, roasted in small batches and delivered fresh.
            </p>
          </div>

          {/* Column 2: Shop */}
          <div className="space-y-3 text-xs">
            <h3 className="font-serif font-bold text-base text-amberGold-400">Shop</h3>
            <ul className="space-y-2 text-cream-200/80 font-sans">
              <li><button onClick={() => handleNavClick('shop')} className="hover:text-amberGold-400">All Coffee</button></li>
              <li><button onClick={() => handleNavClick('shop')} className="hover:text-amberGold-400">Single Origin</button></li>
              <li><button onClick={() => handleNavClick('shop')} className="hover:text-amberGold-400">Signature Blends</button></li>
              <li><button onClick={() => handleNavClick('shop')} className="hover:text-amberGold-400">Equipment</button></li>
              <li><button onClick={() => handleNavClick('subscriptions')} className="hover:text-amberGold-400">Subscriptions</button></li>
            </ul>
          </div>

          {/* Column 3: Learn */}
          <div className="space-y-3 text-xs">
            <h3 className="font-serif font-bold text-base text-amberGold-400">Learn</h3>
            <ul className="space-y-2 text-cream-200/80 font-sans">
              <li><button onClick={() => handleNavClick('home', 'coffee-finder')} className="hover:text-amberGold-400">Coffee Finder</button></li>
              <li><button onClick={() => handleNavClick('home', 'customizer-box')} className="hover:text-amberGold-400">Brewing Guides</button></li>
              <li><button onClick={() => handleNavClick('about')} className="hover:text-amberGold-400">Our Story</button></li>
              <li><button onClick={() => handleNavClick('faq')} className="hover:text-amberGold-400">FAQ</button></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="space-y-3 text-xs">
            <h3 className="font-serif font-bold text-base text-amberGold-400">Support</h3>
            <ul className="space-y-2 text-cream-200/80 font-sans">
              <li><button onClick={() => handleNavClick('faq')} className="hover:text-amberGold-400">Contact Support</button></li>
              <li><button onClick={() => handleNavClick('faq')} className="hover:text-amberGold-400">Shipping Info</button></li>
              <li><button onClick={() => handleNavClick('faq')} className="hover:text-amberGold-400">Returns & Guarantees</button></li>
              <li><button onClick={() => setIsTrackerOpen(true)} className="hover:text-amberGold-400 font-bold text-amberGold-400">Track Order</button></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-cream-200/50">
          <div>© 2026 Brewly. All rights reserved.</div>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <button onClick={() => handleNavClick('faq')} className="hover:text-amberGold-400">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => handleNavClick('faq')} className="hover:text-amberGold-400">Terms of Service</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
