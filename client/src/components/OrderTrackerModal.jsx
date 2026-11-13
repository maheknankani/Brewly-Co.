import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../utils/api';
import { X, Search, CheckCircle2, Clock, Truck, MapPin } from 'lucide-react';

const defaultOrderFallback = {
  id: "BRW-9482",
  customerName: "Alex Mercer",
  customerEmail: "alex.mercer@example.com",
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

export const OrderTrackerModal = () => {
  const { isTrackerOpen, setIsTrackerOpen, trackedOrder, setTrackedOrder } = useStore();
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
        setErrorMsg('Order not found. Showing sample tracking for #BRW-9482.');
        setTrackedOrder(defaultOrderFallback);
      }
    } catch (err) {
      setErrorMsg('Showing offline sample tracking for #BRW-9482.');
      setTrackedOrder(defaultOrderFallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isTrackerOpen) return;

    if (trackedOrder && trackedOrder.id) {
      setSearchId(trackedOrder.id);
      return;
    }

    const defaultQuery = 'BRW-9482';
    setSearchId(defaultQuery);

    const loadDefaultOrder = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await api.getOrder(defaultQuery);
        if (res.success && res.order) {
          setTrackedOrder(res.order);
        } else {
          setTrackedOrder(defaultOrderFallback);
        }
      } catch (err) {
        setTrackedOrder(defaultOrderFallback);
      } finally {
        setLoading(false);
      }
    };

    loadDefaultOrder();
  }, [isTrackerOpen, trackedOrder]);

  if (!isTrackerOpen) return null;

  // Active tracked order or instant default fallback
  const activeOrder = trackedOrder || defaultOrderFallback;

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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-espresso-950/80 backdrop-blur-md animate-fadeIn">
      
      {/* Backdrop */}
      <div
        onClick={() => setIsTrackerOpen(false)}
        className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="relative bg-cream-100 rounded-3xl max-w-2xl w-full border border-cream-300 shadow-2xl overflow-hidden z-10 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream-300 pb-4">
          <div className="flex items-center gap-2">
            <Truck size={22} className="text-forest-700" />
            <h2 className="font-serif text-2xl font-bold text-espresso-900">Live Coffee Order Tracking</h2>
          </div>
          <button
            onClick={() => setIsTrackerOpen(false)}
            className="p-2 text-espresso-900/70 hover:text-espresso-900 rounded-full hover:bg-cream-200 transition-colors"
            title="Close Tracker"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchOrder} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter Order ID (e.g. BRW-9482)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-cream-50 border border-cream-300 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-espresso-900 uppercase focus:outline-none focus:border-forest-700 shadow-sm"
            />
            <Search size={16} className="absolute left-3 top-3 text-espresso-900/50" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-forest-700 hover:bg-forest-800 text-cream-100 font-semibold text-xs px-5 py-2.5 rounded-xl shadow transition-all"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {errorMsg && (
          <div className="p-3 bg-red-100 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Order Details & Progress Timeline */}
        <div className="space-y-6 pt-2">
          
          {/* Status Summary Banner */}
          <div className="bg-cream-200/80 border border-cream-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div>
              <span className="text-[10px] text-espresso-900/60 uppercase font-mono font-bold">Order ID #{orderId}</span>
              <h3 className="font-serif text-lg font-bold text-espresso-900">
                Customer: {customerName}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-forest-700 font-semibold mt-0.5">
                <MapPin size={12} />
                <span>{addressDisplay}</span>
              </div>
            </div>

            <div className="bg-forest-700 text-cream-100 px-3.5 py-1.5 rounded-full text-xs font-bold font-mono tracking-wider shadow-sm">
              Status: {orderStatus}
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-espresso-900">Roastery & Delivery Timeline</h4>
            
            <div className="relative border-l-2 border-cream-300 pl-6 space-y-6 ml-3">
              {steps.map((step, idx) => (
                <div key={idx} className="relative group">
                  
                  {/* Circle Node */}
                  <div
                    className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      step.completed
                        ? 'bg-forest-700 border-forest-700 text-white'
                        : 'bg-cream-100 border-cream-300 text-cream-400'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 size={14} /> : <Clock size={12} />}
                  </div>

                  <div>
                    <div className={`text-sm font-bold font-serif ${step.completed ? 'text-espresso-900' : 'text-espresso-900/50'}`}>
                      {step.step}
                    </div>
                    <div className="text-[11px] text-espresso-900/60 font-mono">
                      {step.date}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Items Breakdown */}
          {itemsList.length > 0 && (
            <div className="border-t border-cream-300 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-espresso-900 mb-2">Package Contents</h4>
              <div className="space-y-2">
                {itemsList.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs text-espresso-900 bg-cream-50 p-2.5 rounded-xl border border-cream-300">
                    <div>
                      <span className="font-bold">{item.productName || item.name || 'Specialty Coffee'}</span>
                      <span className="text-espresso-900/60 ml-2">({item.weight || '250g'} • {item.grind || 'Whole Bean'})</span>
                    </div>
                    <span className="font-semibold">{item.quantity || 1}x — ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
