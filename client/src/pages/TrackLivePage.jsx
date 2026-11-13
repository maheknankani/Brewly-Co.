import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../utils/api';
import { Search, Truck, CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react';

const defaultOrderFallback = {
  id: "BRW-9482",
  customerName: "Valued Customer",
  customerEmail: "",
  date: "2026-09-15T10:00:00Z",
  paymentMethod: "Online Card Payment",
  items: [
    { productId: "prod-1", productName: "Ethiopian Yirgacheffe", weight: "250g", grind: "Whole Bean", quantity: 2, price: 22.00 }
  ],
  subtotal: 44.00,
  discount: 4.40,
  shipping: 0.00,
  total: 39.60,
  status: "Shipped",
  trackingSteps: [
    { step: "Order Placed", date: "Sep 15, 10:00", completed: true },
    { step: "Small-Batch Roasted", date: "Sep 15, 11:30", completed: true },
    { step: "Quality Inspected & Packed", date: "Sep 15, 13:00", completed: true },
    { step: "Dispatched with Carrier", date: "Sep 15, 14:20", completed: true },
    { step: "Out for Delivery", date: "Expected Today", completed: false }
  ],
  shippingAddress: {
    address: "104 Woolwich Street",
    city: "Seattle",
    state: "WA",
    zip: "98101"
  }
};

export const TrackLivePage = () => {
  const { trackedOrder, setTrackedOrder, setCurrentPage } = useStore();
  const [searchId, setSearchId] = useState('BRW-9482');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const activeOrder = trackedOrder || defaultOrderFallback;

  const handleSearchOrder = async (e) => {
    e?.preventDefault();
    const query = searchId.trim() || 'BRW-9482';
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.getOrder(query);
      if (res.success && res.order) {
        setTrackedOrder(res.order);
      } else {
        setErrorMsg('Order ID not found. Showing default sample shipment #BRW-9482.');
        setTrackedOrder(defaultOrderFallback);
      }
    } catch (err) {
      setErrorMsg('Showing default sample shipment #BRW-9482.');
      setTrackedOrder(defaultOrderFallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!trackedOrder) {
      setTrackedOrder(defaultOrderFallback);
    }
  }, []);

  const orderId = activeOrder.id || 'BRW-9482';
  const customerName = activeOrder.customerName || 'Valued Customer';
  const orderStatus = activeOrder.status || 'Processing';

  let addressDisplay = 'Seattle, WA';
  if (activeOrder.shippingAddress) {
    if (typeof activeOrder.shippingAddress === 'object') {
      const city = activeOrder.shippingAddress.city || '';
      const state = activeOrder.shippingAddress.state || '';
      addressDisplay = [city, state].filter(Boolean).join(', ') || 'Seattle, WA';
    } else if (typeof activeOrder.shippingAddress === 'string') {
      addressDisplay = activeOrder.shippingAddress;
    }
  }

  const steps = Array.isArray(activeOrder.trackingSteps) && activeOrder.trackingSteps.length > 0
    ? activeOrder.trackingSteps
    : defaultOrderFallback.trackingSteps;

  const itemsList = Array.isArray(activeOrder.items) && activeOrder.items.length > 0
    ? activeOrder.items
    : defaultOrderFallback.items;

  return (
    <div className="bg-cream-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Page Header */}
      <section className="max-w-4xl mx-auto text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 bg-cream-200 border border-cream-300 text-forest-700 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
          <Truck size={16} className="text-amberGold-500" />
          <span>Real-Time Shipment Status</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-espresso-900 tracking-tight">
          Track Your Coffee Dispatch
        </h1>

        <p className="text-sm sm:text-base text-espresso-900/80 max-w-xl mx-auto font-sans leading-relaxed">
          Monitor your small-batch roasting, quality inspection, and carrier dispatch in real-time.
        </p>

        {/* Live Search Bar */}
        <div className="pt-4 max-w-xl mx-auto">
          <form onSubmit={handleSearchOrder} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Order ID (e.g. BRW-9482)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full bg-cream-50 border border-cream-300 rounded-full px-5 py-3.5 pl-12 text-sm font-semibold text-espresso-900 uppercase focus:outline-none focus:border-forest-700 shadow-sm placeholder:text-espresso-900/50"
              />
              <Search size={18} className="absolute left-4 top-4 text-espresso-900/50" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-forest-700 hover:bg-forest-800 text-cream-100 font-semibold text-xs px-8 py-3.5 rounded-full shadow-md transition-all shrink-0"
            >
              {loading ? 'Searching...' : 'Track Live'}
            </button>
          </form>
        </div>

        {errorMsg && (
          <div className="p-3 bg-amberGold-500/15 text-amberGold-700 text-xs rounded-2xl border border-amberGold-500/30 max-w-xl mx-auto font-medium">
            {errorMsg}
          </div>
        )}
      </section>

      {/* Main Order Status Container */}
      <section className="max-w-3xl mx-auto bg-cream-50 border border-cream-300 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
        
        {/* Banner */}
        <div className="bg-cream-200/80 border border-cream-300 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-espresso-900/60 font-mono font-bold uppercase">ORDER NUMBER #{orderId}</span>
            <h3 className="font-serif text-2xl font-bold text-espresso-900 mt-0.5">
              Customer: {customerName}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-forest-700 font-semibold mt-1">
              <MapPin size={14} />
              <span>Destination: {addressDisplay}</span>
            </div>
          </div>

          <div className="bg-forest-700 text-cream-100 px-4 py-2 rounded-full text-xs font-bold font-mono tracking-wider shadow">
            Status: {orderStatus}
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-espresso-900">
            Roastery & Delivery Progress
          </h3>

          <div className="relative border-l-2 border-cream-300 pl-8 space-y-8 ml-4">
            {steps.map((step, idx) => (
              <div key={idx} className="relative group">
                <div
                  className={`absolute -left-[41px] top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    step.completed
                      ? 'bg-forest-700 border-forest-700 text-white shadow-md'
                      : 'bg-cream-100 border-cream-300 text-cream-400'
                  }`}
                >
                  {step.completed ? <CheckCircle2 size={16} /> : <Clock size={14} />}
                </div>

                <div>
                  <div className={`text-base font-serif font-bold ${step.completed ? 'text-espresso-900' : 'text-espresso-900/50'}`}>
                    {step.step}
                  </div>
                  <div className="text-xs text-espresso-900/60 font-mono mt-0.5">
                    {step.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Package Contents */}
        {itemsList.length > 0 && (
          <div className="border-t border-cream-300 pt-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-espresso-900">
              Package Contents
            </h3>
            <div className="space-y-2">
              {itemsList.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs text-espresso-900 bg-cream-100 p-3.5 rounded-xl border border-cream-200">
                  <div>
                    <span className="font-bold font-serif text-sm">{item.productName || item.name || 'Specialty Coffee'}</span>
                    <span className="text-espresso-900/60 ml-2 font-mono">({item.weight || '250g'} • {item.grind || 'Whole Bean'})</span>
                  </div>
                  <span className="font-semibold font-mono text-forest-700">{item.quantity || 1}x — ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>

      {/* Return to Shop CTA */}
      <div className="text-center">
        <button
          onClick={() => setCurrentPage('shop')}
          className="bg-cream-200 hover:bg-cream-300 text-espresso-900 border border-cream-300 font-semibold text-xs px-8 py-3 rounded-full transition-all inline-flex items-center gap-2"
        >
          <span>Continue Coffee Shopping</span>
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
};
