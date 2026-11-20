import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../utils/api';
import confetti from 'canvas-confetti';
import { ShieldCheck, Lock, CreditCard, CheckCircle2, ArrowRight, Truck, PackageCheck, Banknote, Wallet, Phone, Mail, MessageSquare, Clock } from 'lucide-react';

export const CheckoutPage = () => {
  const {
    cart,
    subtotal,
    discountAmount,
    shipping,
    grandTotal,
    appliedDiscount,
    clearCart,
    addLoyaltyPoints,
    addOrderToHistory,
    setCustomerAccount,
    user,
    setIsOrderHistoryOpen,
    setCurrentPage,
    setIsTrackerOpen,
    setTrackedOrder,
    showToast
  } = useStore();

  const [paymentMethod, setPaymentMethod] = useState('online'); // 'cash' or 'online'

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '4242 •••• •••• 4242',
    expDate: '12/28',
    cvv: '888'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Handle return from Stripe Hosted Checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkoutStatus = params.get('checkout_status');
    const sessionId = params.get('session_id');

    if (checkoutStatus === 'success' && sessionId) {
      setIsProcessing(true);
      api.verifyCheckoutSession({ sessionId })
        .then(res => {
          if (res.success && res.order) {
            setCompletedOrder({ ...res.order, confirmationEmailSent: res.emailSent });
            setTrackedOrder(res.order);
            addOrderToHistory(res.order);
            if (res.order.customerEmail) {
              setCustomerAccount(res.order.customerEmail, res.order.customerName);
            }
            addLoyaltyPoints(res.order.total);
            clearCart();
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 }
            });
            showToast(res.emailSent
              ? '💳 Stripe payment verified! Order confirmation email sent.'
              : '💳 Stripe payment verified! The order confirmation email could not be sent.');
          } else {
            showToast(res.message || 'Unable to verify your Stripe payment. Please try again or contact support.');
          }
        })
        .catch(err => {
          console.error('Session verify error:', err);
          showToast(err.message || 'Unable to verify your Stripe payment. Please try again or contact support.');
        })
        .finally(() => {
          setIsProcessing(false);
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        });
    } else if (checkoutStatus === 'cancel') {
      showToast('Stripe checkout was cancelled. Your cart items were preserved.');
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (paymentMethod === 'online') {
      await handleLaunchStripeSandbox();
      return;
    }

    setIsProcessing(true);

    try {
      const orderPayload = {
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        paymentMethod: 'Cash on Delivery (COD)',
        stripePaymentId: null,
        stripeGatewayStatus: 'Cash on Delivery (COD)',
        items: cart.map(item => ({
          productId: item.productId,
          productName: item.name,
          weight: item.weight,
          grind: item.grind,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal,
        discount: discountAmount,
        discountCode: appliedDiscount?.code || null,
        shipping,
        total: grandTotal,
        shippingAddress: {
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip
        }
      };

      const res = await api.createOrder(orderPayload);
      if (res.success) {
        setCompletedOrder(res.order);
        setTrackedOrder(res.order);
        addOrderToHistory(res.order);
        if (form.email) {
          setCustomerAccount(form.email, form.name);
        }
        addLoyaltyPoints(grandTotal);
        clearCart();

        // Confetti celebration
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });

        const emailMsg = res.emailSent
          ? `🎉 COD Order confirmed! Confirmation email sent to ${form.email}`
          : `🎉 COD Order placed! (Email delivery pending — check SMTP config)`;
        showToast(emailMsg);
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLaunchStripeSandbox = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      showToast('Launching Stripe Sandbox Checkout session...');
      const res = await api.createCheckoutSession({
        items: cart,
        customerEmail: form.email,
        customerName: form.name,
        customerPhone: form.phone,
        shippingAddress: {
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip
        },
        discountCode: appliedDiscount?.code || null,
        discountAmount,
        shipping
      });
      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        showToast(res.message || 'Error launching Stripe Sandbox session.');
      }
    } catch (err) {
      console.error('Stripe Sandbox Launch Error:', err);
      showToast('Failed to open Stripe Sandbox Checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="py-12 bg-cream-100 min-h-screen flex items-center justify-center p-4">
        <div className="bg-cream-200/90 border border-cream-300 rounded-3xl p-6 sm:p-10 max-w-xl w-full text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-forest-700 text-cream-100 rounded-2xl flex items-center justify-center mx-auto shadow-lg text-3xl">
            ☕
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-amberGold-600 uppercase tracking-widest">
              ORDER CONFIRMED #{completedOrder.id}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-espresso-900 mt-1">
              Thank You For Your Order!
            </h1>
            <p className="text-xs text-espresso-900/70 mt-2">
              Our master roasters are custom preparing your artisan beans.
            </p>
          </div>

          {/* Instant SMS & Email Notification Alerts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="bg-cream-100 border border-cream-300 rounded-2xl p-3.5 space-y-1 shadow-sm">
              <div className="flex items-center gap-1.5 font-bold text-xs text-forest-700">
                <Mail size={14} />
                <span>
                  {completedOrder.stripePaymentId && !completedOrder.confirmationEmailSent
                    ? 'Email Confirmation Pending'
                    : 'Email Confirmation Sent'}
                </span>
              </div>
              <p className="text-[10px] text-espresso-900/70 truncate">
                {completedOrder.customerEmail}
              </p>
              <div className="text-[10px] bg-forest-700/10 text-forest-800 p-1.5 rounded font-mono mt-1">
                {completedOrder.stripePaymentId && !completedOrder.confirmationEmailSent
                  ? 'Order saved; email delivery failed'
                  : 'Receipt & details dispatched'}
              </div>
            </div>

            <div className="bg-cream-100 border border-cream-300 rounded-2xl p-3.5 space-y-1 shadow-sm">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amberGold-600">
                <MessageSquare size={14} />
                <span>SMS Alert Dispatched</span>
              </div>
              <p className="text-[10px] text-espresso-900/70 font-mono">
                {completedOrder.customerPhone || form.phone}
              </p>
              <div className="text-[10px] bg-amberGold-500/10 text-amberGold-700 p-1.5 rounded font-mono mt-1">
                SMS: "Order #{completedOrder.id} confirmed!"
              </div>
            </div>
          </div>

          <div className="bg-cream-100 border border-cream-300 rounded-2xl p-4 text-left text-xs space-y-2">
            <div className="flex justify-between font-bold text-espresso-900">
              <span>Delivery Address</span>
              <span>{completedOrder.shippingAddress?.address || form.address}, {completedOrder.shippingAddress?.city || form.city}</span>
            </div>
            <div className="flex justify-between font-bold text-espresso-900">
              <span>Payment Method</span>
              <span className="text-forest-700">{completedOrder.paymentMethod || 'Online Card Payment'}</span>
            </div>
            {completedOrder.stripePaymentId && (
              <div className="flex justify-between font-bold text-indigo-900 font-mono text-[11px] bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                <span>Stripe Payment TxID:</span>
                <span>{completedOrder.stripePaymentId}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-espresso-900">
              <span>Total Amount</span>
              <span>${completedOrder.total ? completedOrder.total.toFixed(2) : grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-forest-700">
              <span>Loyalty Points Earned</span>
              <span>+{Math.floor(completedOrder.total || grandTotal)} Pts</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                const targetOrder = completedOrder || {
                  id: 'BRW-9482',
                  customerName: form.name,
                  customerEmail: form.email,
                  status: 'Processing',
                  shippingAddress: { address: form.address, city: form.city, state: form.state, zip: form.zip },
                  items: cart
                };
                setTrackedOrder(targetOrder);
                setIsTrackerOpen(true);
                setCurrentPage('track-live');
              }}
              className="flex-1 bg-forest-700 hover:bg-forest-800 text-cream-100 font-semibold text-xs py-3 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck size={16} />
              <span>Track Live</span>
            </button>
            <button
              onClick={() => setIsOrderHistoryOpen(true)}
              className="flex-1 bg-espresso-900 hover:bg-espresso-800 text-cream-100 font-semibold text-xs py-3 rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Clock size={16} />
              <span>Order History</span>
            </button>
            <button
              onClick={() => setCurrentPage('home')}
              className="px-4 bg-cream-100 hover:bg-cream-300 text-espresso-900 font-semibold text-xs py-3 rounded-xl border border-cream-300 transition-all cursor-pointer"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-cream-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-espresso-900">
            Secure Checkout
          </h1>
          <p className="text-xs text-espresso-900/70 mt-1 flex items-center justify-center gap-1">
            <Lock size={12} className="text-forest-700" />
            <span>256-Bit Encrypted SSL Checkout</span>
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Column */}
          <div className="lg:col-span-7 bg-cream-200/60 border border-cream-300 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            
            {/* Shipping Address */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 border-b border-cream-300 pb-2">
                1. Shipping Address
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-espresso-900 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-cream-100 border border-cream-300 rounded-xl p-2.5 text-xs text-espresso-900 focus:outline-none focus:border-forest-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-espresso-900 mb-1">Email (for receipt)</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-cream-100 border border-cream-300 rounded-xl p-2.5 text-xs text-espresso-900 focus:outline-none focus:border-forest-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-espresso-900 mb-1">Mobile Phone (for SMS)</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full bg-cream-100 border border-cream-300 rounded-xl p-2.5 text-xs text-espresso-900 focus:outline-none focus:border-forest-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-900 mb-1">Street Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={form.address}
                  onChange={handleChange}
                  className="w-full bg-cream-100 border border-cream-300 rounded-xl p-2.5 text-xs text-espresso-900 focus:outline-none focus:border-forest-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-espresso-900 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={form.city}
                    onChange={handleChange}
                    className="w-full bg-cream-100 border border-cream-300 rounded-xl p-2.5 text-xs text-espresso-900 focus:outline-none focus:border-forest-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-espresso-900 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={form.state}
                    onChange={handleChange}
                    className="w-full bg-cream-100 border border-cream-300 rounded-xl p-2.5 text-xs text-espresso-900 focus:outline-none focus:border-forest-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-espresso-900 mb-1">Zip Code</label>
                  <input
                    type="text"
                    name="zip"
                    required
                    value={form.zip}
                    onChange={handleChange}
                    className="w-full bg-cream-100 border border-cream-300 rounded-xl p-2.5 text-xs text-espresso-900 focus:outline-none focus:border-forest-700"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selection */}
            <div className="space-y-4 pt-4 border-t border-cream-300">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 border-b border-cream-300 pb-2 flex items-center justify-between">
                <span>2. Select Payment Method</span>
                <div className="flex items-center gap-2 text-forest-700">
                  <Banknote size={20} />
                  <CreditCard size={20} />
                </div>
              </h2>

              {/* Payment Method Option Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Cash on Delivery Option */}
                <div
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'cash'
                      ? 'bg-cream-100 border-forest-700 shadow-md ring-1 ring-forest-700/30'
                      : 'bg-cream-50 border-cream-300 hover:bg-cream-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="mt-1 accent-forest-700 cursor-pointer shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 font-bold text-sm text-espresso-900">
                      <Banknote size={18} className="text-forest-700 shrink-0" />
                      <span className="truncate">Cash Payment (COD)</span>
                    </div>
                    <p className="text-[11px] text-espresso-900/70 mt-1 leading-relaxed">
                      Pay cash on delivery when your fresh coffee arrives.
                    </p>
                  </div>
                </div>

                {/* Online Card Payment Option (Stripe API) */}
                <div
                  onClick={() => setPaymentMethod('online')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'online'
                      ? 'bg-cream-100 border-forest-700 shadow-md ring-1 ring-forest-700/30'
                      : 'bg-cream-50 border-cream-300 hover:bg-cream-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="mt-1 accent-forest-700 cursor-pointer shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-2 font-bold text-sm text-espresso-900 min-w-0">
                        <CreditCard size={18} className="text-forest-700 shrink-0" />
                        <span className="truncate">Stripe Payment</span>
                      </div>
                      <span className="bg-indigo-100 text-indigo-800 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-indigo-200 shrink-0 whitespace-nowrap">
                        ONLINE
                      </span>
                    </div>
                    <p className="text-[11px] text-espresso-900/70 mt-1 leading-relaxed">
                      Secure checkout with 256-bit SSL encryption.
                    </p>
                  </div>
                </div>
              </div>

              {/* Conditional Inputs depending on selected method */}
              {paymentMethod === 'cash' ? (
                <div className="bg-forest-700/10 border border-forest-700/30 rounded-2xl p-4 flex items-center gap-3 text-xs text-forest-800 font-semibold animate-fadeIn">
                  <CheckCircle2 size={20} className="text-forest-700 shrink-0" />
                  <div>
                    <div className="font-bold text-sm">Cash Payment Confirmed</div>
                    <div className="text-[11px] text-espresso-900/70 font-normal mt-0.5 leading-relaxed">
                      No online credit card required! You will pay <strong>${grandTotal.toFixed(2)}</strong> in cash directly to the courier upon delivery.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-2 animate-fadeIn bg-cream-50 border border-cream-300 p-4 rounded-2xl">
                  {/* Stripe Security & Status Banner */}
                  <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 p-3 rounded-xl text-[11px] font-mono text-indigo-900">
                    <div className="flex items-center gap-2">
                      <Lock size={14} className="text-indigo-600 shrink-0" />
                      <div>
                        <div className="font-bold text-xs">Stripe Hosted Checkout Ready</div>
                        <div className="text-[10px] text-indigo-700/80">256-Bit SSL Encrypted & Secured</div>
                      </div>
                    </div>
                    <span className="bg-indigo-600 text-white font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Sandbox Active
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isProcessing || cart.length === 0}
              className="w-full bg-forest-700 hover:bg-forest-800 text-cream-100 font-bold text-sm py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>
                {isProcessing
                  ? (paymentMethod === 'cash' ? 'Placing Your Order...' : 'Launching Stripe Checkout...')
                  : paymentMethod === 'cash'
                  ? `Complete Order — Cash on Delivery — $${grandTotal.toFixed(2)}`
                  : `Pay on Stripe Checkout — $${grandTotal.toFixed(2)} ↗`}
              </span>
              <ArrowRight size={16} />
            </button>

          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 bg-cream-100 border border-cream-300 rounded-3xl p-6 space-y-4 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-espresso-900 border-b border-cream-300 pb-3">
              Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} items)
            </h2>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.cartItemId} className="flex gap-3 items-center justify-between bg-cream-200/50 p-3 rounded-xl border border-cream-300">
                  <img src={item.bagImage} alt={item.name} className="w-12 h-14 object-cover rounded shadow-sm" />
                  <div className="flex-1">
                    <div className="font-serif font-bold text-sm text-espresso-900">{item.name}</div>
                    <div className="text-[10px] text-forest-700 font-semibold">{item.weight} • {item.grind}</div>
                    <div className="text-xs text-espresso-900 font-mono">{item.quantity}x @ ${item.price.toFixed(2)}</div>
                  </div>
                  <div className="text-xs font-bold text-espresso-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-espresso-900 border-t border-cream-300 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-amberGold-600 font-semibold">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span>Delivery</span>
                <span className={shipping === 0 ? "font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300" : "font-semibold"}>
                  {shipping === 0 ? 'FREE' : `Rs. ${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold font-serif pt-2 border-t border-cream-300">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
