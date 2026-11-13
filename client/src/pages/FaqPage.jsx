import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { HelpCircle, ChevronDown, Search, Truck, Coffee, RefreshCw, CreditCard, MessageSquare, ArrowRight } from 'lucide-react';

export const FaqPage = () => {
  const { setCurrentPage, setIsChatOpen } = useStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(0); // first item open by default

  const categories = [
    { id: 'all', label: 'All Questions', icon: <HelpCircle size={16} /> },
    { id: 'shipping', label: 'Shipping & Delivery', icon: <Truck size={16} /> },
    { id: 'coffee', label: 'Coffee & Roasting', icon: <Coffee size={16} /> },
    { id: 'subscription', label: 'Subscriptions', icon: <RefreshCw size={16} /> },
    { id: 'payment', label: 'Payments & Returns', icon: <CreditCard size={16} /> }
  ];

  const faqs = [
    {
      category: 'shipping',
      question: 'How fast will my coffee arrive?',
      answer: 'We roast your coffee fresh and ship it within 24 hours. Standard delivery fee is Rs. 150. Activate our Free Delivery Subscription (1, 2, or 3 Months) to enjoy Rs. 0 FREE delivery on all orders!'
    },
    {
      category: 'shipping',
      question: 'How can I track my active order?',
      answer: 'Once your order is placed, you will receive an SMS and email notification with your tracking link. You can also click "Track Active Order" anytime in our menu or header to view live delivery status.'
    },
    {
      category: 'coffee',
      question: 'How fresh is the coffee when it reaches me?',
      answer: 'Your coffee is roasted in small batches right before shipping. Every bag comes stamped with its exact roast date. We recommend resting whole beans for 3-5 days after roasting for peak flavor.'
    },
    {
      category: 'coffee',
      question: 'Should I choose Whole Bean or Ground coffee?',
      answer: 'If you have a coffee grinder at home, Whole Bean is best because grinding right before brewing yields the richest aroma. If you do not have a grinder, choose your brew method (Espresso, Drip Filter, French Press, or Cold Brew) and we will grind it perfectly for you.'
    },
    {
      category: 'subscription',
      question: 'How do coffee subscriptions work?',
      answer: 'With a subscription, you save 15% on every order and get fresh coffee delivered to your door every week, 2 weeks, or month. You can pause, skip a delivery, or cancel anytime with zero hidden fees.'
    },
    {
      category: 'subscription',
      question: 'Can I swap coffee flavors or change delivery frequency?',
      answer: 'Yes! You can customize your roast ritual, change your bag size (250g, 500g, 1kg), or adjust delivery frequency easily through your account settings or by speaking with our barista support.'
    },
    {
      category: 'payment',
      question: 'What payment options do you support?',
      answer: 'We support Cash on Delivery (COD) for convenient doorstep payments, as well as instant secure online card payments (Visa, Mastercard, American Express).'
    },
    {
      category: 'payment',
      question: 'What is your freshness refund policy?',
      answer: 'We want you to love every cup! If you are not completely delighted with the taste or freshness of your coffee, contact us within 14 days and we will send you a replacement bag or give you a full refund.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-cream-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* FAQ Header */}
      <section className="max-w-4xl mx-auto text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 bg-cream-200 border border-cream-300 text-forest-700 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
          <HelpCircle size={14} className="text-amberGold-500" />
          <span>Frequently Asked Questions</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-espresso-900 tracking-tight">
          How Can We Help You Today?
        </h1>

        <p className="text-sm sm:text-base text-espresso-900/80 max-w-2xl mx-auto font-sans leading-relaxed">
          Find simple, clear answers to common questions about our coffee roasting process, shipping, subscriptions, and payment methods.
        </p>

        {/* Live Search Bar */}
        <div className="pt-4 max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder="Search questions (e.g. shipping, subscriptions, freshness)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cream-50 border border-cream-300 rounded-full px-5 py-3.5 pl-12 text-sm text-espresso-900 focus:outline-none focus:border-forest-700 shadow-sm placeholder:text-espresso-900/50"
          />
          <Search size={18} className="absolute left-4 top-4 text-espresso-900/50" />
        </div>
      </section>

      {/* Category Pills Filter */}
      <section className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                activeCategory === cat.id
                  ? 'bg-forest-700 text-cream-100 border-forest-700 shadow-md'
                  : 'bg-cream-200 text-espresso-900 hover:bg-cream-300 border-cream-300'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Accordion FAQ List */}
      <section className="max-w-3xl mx-auto space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center p-12 bg-cream-200/50 border border-cream-300 rounded-2xl space-y-3">
            <p className="text-espresso-900/60 font-serif text-lg">No matching questions found.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="text-xs font-bold text-forest-700 underline"
            >
              Clear filters and show all FAQs
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-cream-50 border border-cream-300 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-serif text-lg font-bold text-espresso-900 hover:text-forest-700 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-forest-700 font-sans text-sm">Q.</span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-espresso-900/60 transition-transform duration-300 ${isOpen ? 'transform rotate-180 text-forest-700' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-sm text-espresso-900/80 font-sans leading-relaxed border-t border-cream-200/80 pt-4 bg-cream-100/50">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Barista Live Chat Assistance Footer Box */}
      <section className="max-w-3xl mx-auto bg-cream-200 border border-cream-300 rounded-3xl p-8 text-center space-y-4 shadow-sm">
        <h3 className="text-2xl font-serif font-bold text-espresso-900">Still have a question?</h3>
        <p className="text-xs sm:text-sm text-espresso-900/80 max-w-md mx-auto">
          Our friendly coffee expert team is online to assist you with roast recommendations or order help.
        </p>
        <div className="pt-2 flex items-center justify-center gap-4">
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-forest-700 hover:bg-forest-800 text-cream-100 text-xs font-bold px-6 py-3 rounded-full transition-all shadow-md flex items-center gap-2"
          >
            <MessageSquare size={16} />
            <span>Chat With Live Barista Support</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('shop')}
            className="bg-cream-100 hover:bg-cream-300 text-espresso-900 border border-cream-300 text-xs font-bold px-6 py-3 rounded-full transition-all"
          >
            Browse Coffee Shop
          </button>
        </div>
      </section>

    </div>
  );
};
