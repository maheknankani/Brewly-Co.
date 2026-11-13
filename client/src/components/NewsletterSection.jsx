import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, CheckCircle2 } from 'lucide-react';

export const NewsletterSection = () => {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed! Check your inbox for your 10% discount code: SLOWMORNINGS ☕');
  };

  return (
    <section className="py-16 bg-cream-100 border-t border-cream-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="bg-cream-200/80 border border-cream-300 rounded-3xl p-8 sm:p-12 space-y-6 shadow-sm">
          
          <div className="w-12 h-12 rounded-2xl bg-forest-700/15 text-forest-700 flex items-center justify-center mx-auto border border-forest-700/30">
            <Mail size={22} />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-espresso-900">
              Good Coffee, Delivered to Your Inbox.
            </h2>
            <p className="text-sm text-espresso-900/80 font-sans max-w-md mx-auto">
              Get brewing tips, new roast releases and 10% off your first order.
            </p>
          </div>

          {subscribed ? (
            <div className="p-4 bg-emerald-100 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-2 max-w-md mx-auto animate-fadeIn">
              <CheckCircle2 size={16} />
              <span>Thank you for subscribing! Your 10% discount code is: <strong>SLOWMORNINGS</strong></span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-cream-50 border border-cream-300 rounded-full px-5 py-3 text-xs font-semibold text-espresso-900 focus:outline-none focus:border-forest-700 shadow-sm placeholder:text-espresso-900/50"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-forest-700 hover:bg-forest-800 text-cream-100 font-bold text-xs px-8 py-3 rounded-full transition-all shadow-md shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}

        </div>

      </div>
    </section>
  );
};
