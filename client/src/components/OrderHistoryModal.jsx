import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Clock, Truck, MapPin, CreditCard, Banknote, Calendar, Award } from 'lucide-react';

export const OrderHistoryModal = () => {
  const {
    isOrderHistoryOpen,
    setIsOrderHistoryOpen,
    userOrdersHistory,
    setTrackedOrder,
    setIsTrackerOpen,
    setCurrentPage
  } = useStore();

  if (!isOrderHistoryOpen) return null;

  const handleTrackOrder = (order) => {
    setTrackedOrder(order);
    setIsOrderHistoryOpen(false);
    setIsTrackerOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-espresso-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative bg-cream-100 rounded-3xl max-w-3xl w-full border border-cream-300 shadow-2xl overflow-hidden z-10 p-6 sm:p-8 space-y-6 max-h-[90vh] flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream-300 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-700/15 border border-forest-700/30 flex items-center justify-center text-forest-700 shadow-inner">
              <Clock size={22} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-forest-700 font-bold block">CUSTOMER ACCOUNT</span>
              <h2 className="text-2xl font-serif font-bold text-espresso-900">Your Coffee Order History</h2>
            </div>
          </div>

          <button
            onClick={() => setIsOrderHistoryOpen(false)}
            className="p-2 text-espresso-900/70 hover:text-espresso-900 rounded-full hover:bg-cream-200 transition-colors"
            title="Close Order History"
          >
            <X size={20} />
          </button>
        </div>

        {/* Orders Feed */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {(!Array.isArray(userOrdersHistory) || userOrdersHistory.length === 0) ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 bg-cream-200 text-espresso-900/40 rounded-full flex items-center justify-center mx-auto text-2xl font-serif">
                ☕
              </div>
              <h3 className="font-serif text-xl font-bold text-espresso-900">No Orders Found Yet</h3>
              <p className="text-xs text-espresso-900/60 max-w-xs mx-auto">
                Once you place an artisan coffee order, your complete order history and receipts will be recorded here.
              </p>
              <button
                onClick={() => {
                  setIsOrderHistoryOpen(false);
                  setCurrentPage('shop');
                }}
                className="bg-forest-700 hover:bg-forest-800 text-cream-100 font-semibold text-xs px-5 py-2.5 rounded-xl shadow transition-all inline-block mt-2"
              >
                Browse Specialty Roasts
              </button>
            </div>
          ) : (
            userOrdersHistory.map((ord) => {
              const formattedDate = ord.date
                ? new Date(ord.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Recent Order';

              const items = Array.isArray(ord.items) ? ord.items : [];
              const orderTotal = typeof ord.total === 'number' ? ord.total : (ord.subtotal || 0);

              let addressStr = 'Standard Delivery Address';
              if (ord.shippingAddress) {
                if (typeof ord.shippingAddress === 'object') {
                  const parts = [ord.shippingAddress.address, ord.shippingAddress.city, ord.shippingAddress.state].filter(Boolean);
                  addressStr = parts.join(', ') || 'Standard Delivery Address';
                } else if (typeof ord.shippingAddress === 'string') {
                  addressStr = ord.shippingAddress;
                }
              }

              return (
                <div
                  key={ord.id || Math.random()}
                  className="bg-cream-50 border border-cream-300 rounded-2xl p-5 space-y-4 hover:shadow-md transition-shadow"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-cream-300 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amberGold-600">ORDER #{ord.id || 'BRW-9482'}</span>
                        <span className="text-[10px] text-espresso-900/40">•</span>
                        <span className="text-xs text-espresso-900/60 flex items-center gap-1 font-mono">
                          <Calendar size={12} />
                          <span>{formattedDate}</span>
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-espresso-900 mt-0.5">
                        Your Artisan Coffee Order
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-forest-700 text-cream-100 text-[11px] font-mono font-bold px-3 py-1 rounded-full shadow-sm">
                        Status: {ord.status || 'Processing'}
                      </span>
                      <button
                        onClick={() => handleTrackOrder(ord)}
                        className="bg-cream-200 hover:bg-cream-300 text-espresso-900 border border-cream-300 px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="View Live Shipment Tracking"
                      >
                        <Truck size={14} className="text-forest-700" />
                        <span>Track Live</span>
                      </button>
                    </div>
                  </div>

                  {/* Purchased Items List */}
                  {items.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-espresso-900/60 block">
                        Purchased Items ({items.length})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {items.map((item, idx) => (
                          <div key={idx} className="bg-cream-100 border border-cream-200 p-2.5 rounded-xl text-xs flex justify-between items-center">
                            <div>
                              <div className="font-serif font-bold text-espresso-900">{item.productName || item.name || 'Specialty Coffee'}</div>
                              <div className="text-[10px] text-forest-700 font-semibold">{item.weight || '250g'} • {item.grind || 'Whole Bean'}</div>
                            </div>
                            <div className="text-xs font-bold text-espresso-900 font-mono">
                              {item.quantity || 1}x @ ${(item.price || 0).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Order Details Footer */}
                  <div className="pt-3 border-t border-cream-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                    <div className="space-y-1 text-espresso-900/80">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <MapPin size={13} className="text-forest-700 shrink-0" />
                        <span>{addressStr}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-forest-700">
                        {ord.paymentMethod?.includes('Cash') ? <Banknote size={14} /> : <CreditCard size={14} />}
                        <span>Payment Method: <strong>{ord.paymentMethod || 'Online Card Payment'}</strong></span>
                      </div>
                    </div>

                    <div className="text-right sm:border-l sm:border-cream-300 sm:pl-4">
                      <div className="text-sm font-bold text-espresso-900">
                        Total Amount: <span className="font-serif text-base text-forest-700">${orderTotal.toFixed(2)}</span>
                      </div>
                      <div className="text-[11px] text-amberGold-600 font-semibold flex items-center justify-end gap-1 mt-0.5">
                        <Award size={12} />
                        <span>Earned +{Math.floor(orderTotal)} Loyalty Pts</span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="pt-3 border-t border-cream-300 flex items-center justify-between text-xs text-espresso-900/60 font-mono">
          <span>Total Orders: {Array.isArray(userOrdersHistory) ? userOrdersHistory.length : 0}</span>
          <span className="text-forest-700 font-semibold">☕ Brewly Artisan Customer Portal</span>
        </div>

      </div>
    </div>
  );
};
