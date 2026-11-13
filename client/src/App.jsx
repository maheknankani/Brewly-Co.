import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutPage } from './pages/AboutPage';
import { FaqPage } from './pages/FaqPage';
import { TrackLivePage } from './pages/TrackLivePage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { LiveChatWidget } from './components/LiveChatWidget';
import { RewardsModal } from './components/RewardsModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { FreeDeliverySubModal } from './components/FreeDeliverySubModal';
import { CustomCursor } from './components/CustomCursor';
import { ScrollToTop } from './components/ScrollToTop';
import { BackgroundEffect } from './components/BackgroundEffect';

const AppContent = () => {
  const { currentPage, toastMessage } = useStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'shop':
        return <Shop />;
      case 'subscriptions':
        return <SubscriptionPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'admin':
        return <AdminDashboard />;
      case 'about':
        return <AboutPage />;
      case 'faq':
        return <FaqPage />;
      case 'track-live':
        return <TrackLivePage />;
      case 'order-history':
        return <OrderHistoryPage />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-cream-100 text-espresso-900 font-sans selection:bg-amberGold-500 selection:text-white relative overflow-x-hidden">
      
      {/* Ambient Coffee Background Effect */}
      <BackgroundEffect />

      {/* Custom Smooth Magnetic Cursor */}
      <CustomCursor />

      <div>
        <Navbar />
        <main>
          {renderPage()}
        </main>
      </div>

      <Footer />

      {/* Global Slide-overs & Modals */}
      <Sidebar />
      <CartDrawer />
      <WishlistDrawer />
      <ProductDetailModal />
      <OrderTrackerModal />
      <OrderHistoryModal />
      <LiveChatWidget />
      <RewardsModal />
      <AdminLoginModal />

      {/* Smooth Scroll To Top Button */}
      <ScrollToTop />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-espresso-900 text-cream-100 border border-amberGold-500/40 px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span>☕</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
