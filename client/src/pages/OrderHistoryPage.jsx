import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Clock,
  Truck,
  MapPin,
  CreditCard,
  Banknote,
  Calendar,
  Award,
  ArrowRight,
  Bell,
  CheckCheck,
  Mail,
  UserCheck,
  RefreshCw,
  Search,
  CheckCircle2,
  Package
} from 'lucide-react';

export const OrderHistoryPage = () => {
  const {
    user,
    setCustomerAccount,
    userOrdersHistory,
    fetchUserOrders,
    setTrackedOrder,
    setCurrentPage,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    showToast
  } = useStore();

  const [inputEmail, setInputEmail] = useState(user?.email || '');
  const [isEditingEmail, setIsEditingEmail] = useState(!user?.email);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setInputEmail(user.email);
      fetchUserOrders(user.email);
    }
  }, [user?.email]);

  const handleLookupAccount = async (e) => {
    e.preventDefault();
    const clean = inputEmail.trim().toLowerCase();
    if (!clean) {
      showToast('Please enter an email address.');
      return;
    }
    setIsSearching(true);
    setCustomerAccount(clean);
    await fetchUserOrders(clean);
    setIsSearching(false);
    setIsEditingEmail(false);
    showToast(`Viewing orders for ${clean}`);
  };

  const handleTrackOrder = (order) => {
    setTrackedOrder(order);
    setCurrentPage('track-live');
  };

  const hasVerifiedEmail = Boolean(user?.email && user.email.trim());

  return (
    <div className="bg-cream-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Page Header */}
      <section className="max-w-4xl mx-auto text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 bg-cream-200 border border-cream-300 text-forest-700 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
          <Clock size={16} className="text-amberGold-500" />
          <span>Customer Account Portal</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-espresso-900 tracking-tight">
          Your Account & Order History
        </h1>

        <p className="text-sm sm:text-base text-espresso-900/80 max-w-xl mx-auto font-sans leading-relaxed">
          Access your personal orders, delivery notifications, and live shipment tracking.
        </p>
      </section>

      {/* User Account Verification / Email Filter Bar */}
      <section className="max-w-3xl mx-auto">
        {hasVerifiedEmail && !isEditingEmail ? (
          <div className="bg-cream-50 border border-cream-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-700/15 text-forest-700 flex items-center justify-center shrink-0">
                <UserCheck size={20} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-forest-700 tracking-wider block">
                  ACTIVE USER ACCOUNT
                </span>
                <span className="font-serif font-bold text-espresso-900 text-base">
                  {user.email}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsEditingEmail(true)}
              className="text-xs font-bold text-forest-700 hover:text-forest-800 underline transition-colors cursor-pointer"
            >
              Switch Account / Lookup Other Email
            </button>
          </div>
        ) : (
          <div className="bg-espresso-900 text-cream-100 border border-amberGold-500/30 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amberGold-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Mail size={16} />
                <span>USER ACCOUNT LOOKUP</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-cream-100">
                Access Your Personal Order History
              </h3>
              <p className="text-xs text-cream-200/70 max-w-lg leading-relaxed">
                Enter your order email address below to view only your own orders and real-time delivery notifications.
              </p>
            </div>

            <form onSubmit={handleLookupAccount} className="flex flex-col sm:flex-row gap-3 pt-1">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-200/50" size={16} />
                <input
                  type="email"
                  required
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="Enter your customer email address..."
                  className="w-full bg-espresso-800 border border-espresso-700 focus:border-amberGold-500 rounded-xl pl-10 pr-4 py-3 text-xs text-cream-100 placeholder-cream-200/40 focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSearching}
                  className="bg-amberGold-500 hover:bg-amberGold-400 text-espresso-950 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Search size={15} />
                  <span>{isSearching ? 'Finding Orders...' : 'View My Orders'}</span>
                </button>
                {hasVerifiedEmail && (
                  <button
                    type="button"
                    onClick={() => setIsEditingEmail(false)}
                    className="border border-cream-300/30 text-cream-200/80 hover:text-cream-100 px-4 py-3 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </section>

      {/* Notifications Section Card (Strictly scoped to user's notifications) */}
      {hasVerifiedEmail && Array.isArray(notifications) && notifications.length > 0 && (
        <section className="max-w-3xl mx-auto bg-cream-50 border border-cream-300 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-cream-300 pb-3">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-forest-700" />
              <h3 className="font-serif font-bold text-xl text-espresso-900">Delivery Status Notifications</h3>
              <span className="bg-forest-100 text-forest-800 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
                {notifications.length} Total
              </span>
            </div>
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-bold text-forest-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck size={14} />
              <span>Mark All Read</span>
            </button>
          </div>

          <div className="space-y-2">
            {notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => !notif.read && markNotificationRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                  notif.read ? 'bg-cream-100/50 border-cream-300' : 'bg-cream-100 border-amberGold-500/50 shadow-sm ring-1 ring-amberGold-500/20'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                      notif.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                      notif.status === 'Out for Delivery' ? 'bg-amber-100 text-amber-900' :
                      notif.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-cream-200 text-forest-800'
                    }`}>
                      {notif.status}
                    </span>
                    <span className="font-mono text-xs font-bold text-amberGold-600">ORDER #{notif.orderId}</span>
                  </div>
                  <p className="font-serif font-bold text-sm text-espresso-900 mt-1">
                    "{notif.message}"
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-espresso-900/50 font-mono block">
                    {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!notif.read && (
                    <span className="text-[10px] font-bold text-amberGold-600 bg-amberGold-500/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                      Unread Notification
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Orders List (Strictly scoped to user's orders) */}
      <section className="max-w-3xl mx-auto space-y-6">
        {!hasVerifiedEmail ? (
          <div className="text-center py-16 bg-cream-50 border border-cream-300 rounded-3xl space-y-3 p-6">
            <div className="w-14 h-14 bg-cream-200 text-espresso-900/50 rounded-full flex items-center justify-center mx-auto text-2xl font-serif">
              🔒
            </div>
            <h3 className="font-serif text-xl font-bold text-espresso-900">Your Account is Private</h3>
            <p className="text-xs text-espresso-900/60 max-w-sm mx-auto">
              Please enter your order email address above to view your personalized order history and tracking receipts.
            </p>
          </div>
        ) : (!Array.isArray(userOrdersHistory) || userOrdersHistory.length === 0) ? (
          <div className="text-center py-20 bg-cream-50 border border-cream-300 rounded-3xl space-y-4 p-6">
            <div className="w-16 h-16 bg-cream-200 text-espresso-900/40 rounded-full flex items-center justify-center mx-auto text-3xl font-serif">
              ☕
            </div>
            <h3 className="font-serif text-2xl font-bold text-espresso-900">No Past Orders Found</h3>
            <p className="text-xs text-espresso-900/60 max-w-xs mx-auto">
              No previous orders were found for <strong>{user.email}</strong>. Once you place an order, your receipts will be recorded here.
            </p>
            <button
              onClick={() => setCurrentPage('shop')}
              className="bg-forest-700 hover:bg-forest-800 text-cream-100 font-semibold text-xs px-6 py-3 rounded-full shadow transition-all inline-block mt-2 cursor-pointer"
            >
              Browse Specialty Coffees
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
                key={ord.id || ord._id || Math.random()}
                className="bg-cream-50 border border-cream-300 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-cream-300 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amberGold-600">ORDER #{ord.id || 'BRW-9482'}</span>
                      <span className="text-[10px] text-espresso-900/40">•</span>
                      <span className="text-xs text-espresso-900/60 flex items-center gap-1 font-mono">
                        <Calendar size={13} />
                        <span>{formattedDate}</span>
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-lg text-espresso-900 mt-1">
                      Your Artisan Coffee Order
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-forest-700 text-cream-100 text-xs font-mono font-bold px-3.5 py-1.5 rounded-full shadow-sm">
                      Status: {ord.status || 'Processing'}
                    </span>
                    <button
                      onClick={() => handleTrackOrder(ord)}
                      className="bg-cream-200 hover:bg-cream-300 text-espresso-900 border border-cream-300 px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Truck size={14} className="text-forest-700" />
                      <span>Track Live</span>
                    </button>
                  </div>
                </div>

                {/* Items */}
                {items.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-espresso-900/60 block">
                      Purchased Package Contents ({items.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {items.map((item, idx) => (
                        <div key={idx} className="bg-cream-100 border border-cream-200 p-3 rounded-xl text-xs flex justify-between items-center">
                          <div>
                            <div className="font-serif font-bold text-espresso-900 text-sm">{item.productName || item.name || 'Specialty Coffee'}</div>
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

                {/* Footer details */}
                <div className="pt-4 border-t border-cream-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                  <div className="space-y-1.5 text-espresso-900/80">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <MapPin size={14} className="text-forest-700 shrink-0" />
                      <span>{addressStr}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-forest-700">
                      {ord.paymentMethod?.includes('Cash') ? <Banknote size={14} /> : <CreditCard size={14} />}
                      <span>Payment Method: <strong>{ord.paymentMethod || 'Online Card Payment'}</strong></span>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:border-cream-300 sm:pl-6">
                    <div className="text-base font-bold text-espresso-900">
                      Total Paid: <span className="font-serif text-xl text-forest-700">${orderTotal.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-amberGold-600 font-semibold flex items-center justify-end gap-1 mt-0.5">
                      <Award size={13} />
                      <span>Earned +{Math.floor(orderTotal)} Loyalty Pts</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </section>

      {/* Return to Shop */}
      <div className="text-center">
        <button
          onClick={() => setCurrentPage('shop')}
          className="bg-forest-700 hover:bg-forest-800 text-cream-100 font-semibold text-xs px-8 py-3.5 rounded-full transition-all shadow flex items-center gap-2 mx-auto cursor-pointer"
        >
          <span>Explore More Specialty Coffee</span>
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
};
