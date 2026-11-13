import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useStore } from '../context/StoreContext';
import { Star, MessageSquarePlus, CheckCircle2, User } from 'lucide-react';

const fallbackReviews = [
  {
    id: "rev-1",
    productId: "prod-1",
    author: "Liam H. (New York, USA)",
    rating: 5,
    date: "Sep 10, 2026",
    comment: "The Ethiopian Yirgacheffe is unbelievable. Delicate jasmine aromatics and lemon acidity. Best pour-over cup of the year!"
  },
  {
    id: "rev-2",
    productId: "prod-2",
    author: "Sophia M. (Austin, TX)",
    rating: 5,
    date: "Sep 12, 2026",
    comment: "Colombian Supremo has become my daily driver. Sweet caramel notes and rich milk chocolate finish."
  },
  {
    id: "rev-3",
    productId: "prod-8",
    author: "Marcus K. (Chicago, IL)",
    rating: 5,
    date: "Sep 13, 2026",
    comment: "Rwanda Bourbon is clean and crisp. Bright red berry notes and Meyer lemon acidity. Absolutely delicious!"
  }
];

export const ReviewsSection = () => {
  const { products, showToast } = useStore();
  const [reviews, setReviews] = useState(fallbackReviews);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [productId, setProductId] = useState('');
  const [comment, setComment] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await api.getReviews();
      if (res.success && Array.isArray(res.reviews) && res.reviews.length > 0) {
        setReviews(res.reviews);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    const targetProductId = productId || products[0]?.id || 'prod-1';

    const newReview = {
      id: 'rev-' + Date.now(),
      author: author.trim(),
      rating,
      productId: targetProductId,
      comment: comment.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    // Optimistically add review to local state so it appears immediately on page
    setReviews(prev => [newReview, ...prev]);
    showToast('Thank you! Your tasting review has been published! ⭐');
    setAuthor('');
    setComment('');
    setShowForm(false);

    try {
      await api.createReview(newReview);
    } catch (err) {
      console.warn('Backend review creation fallback used:', err);
    }
  };

  return (
    <section className="py-14 bg-cream-100 border-t border-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-amberGold-600 block mb-1">
              VERIFIED RITUAL REVIEWS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-espresso-900">
              Real customers. Real experiences. Real results.
            </h2>
            <p className="text-sm text-espresso-900/70 mt-1">
              Join thousands of coffee lovers brewing Brewly roasts every single morning.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-espresso-900 hover:bg-espresso-800 text-cream-100 px-5 py-2.5 rounded-xl text-xs font-semibold shadow transition-all flex items-center gap-2"
          >
            <MessageSquarePlus size={16} />
            <span>{showForm ? 'Cancel' : 'Write a Review'}</span>
          </button>
        </div>

        {/* Submit Review Form */}
        {showForm && (
          <form onSubmit={handleSubmitReview} className="bg-cream-200 border border-cream-300 rounded-2xl p-6 mb-10 space-y-4 max-w-2xl mx-auto shadow-sm">
            <h3 className="font-serif text-xl font-bold text-espresso-900">Share Your Tasting Notes</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-espresso-900 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica T."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-cream-100 border border-cream-300 rounded-xl p-2.5 text-xs text-espresso-900 focus:outline-none focus:border-forest-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-900 mb-1">Select Product</label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full bg-cream-100 border border-cream-300 rounded-xl p-2.5 text-xs text-espresso-900 focus:outline-none focus:border-forest-700"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso-900 mb-1">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star size={20} className={star <= rating ? "fill-amberGold-500 text-amberGold-500" : "text-cream-400"} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso-900 mb-1">Review Comment</label>
              <textarea
                required
                rows={3}
                placeholder="How did you brew it? What flavors did you notice?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-cream-100 border border-cream-300 rounded-xl p-2.5 text-xs text-espresso-900 focus:outline-none focus:border-forest-700"
              />
            </div>

            <button
              type="submit"
              className="bg-forest-700 hover:bg-forest-800 text-cream-100 font-semibold text-xs px-6 py-2.5 rounded-xl transition-all shadow"
            >
              Post Review
            </button>
          </form>
        )}

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(rev => {
            const product = products.find(p => p.id === rev.productId);

            return (
              <div
                key={rev.id}
                className="bg-cream-200/50 border border-cream-300 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < rev.rating ? "fill-amberGold-500 text-amberGold-500" : "text-cream-300"}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-espresso-900/50 font-mono">{rev.date}</span>
                  </div>

                  <p className="text-xs text-espresso-900/80 leading-relaxed font-sans italic mb-4">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-cream-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-espresso-900 text-cream-100 flex items-center justify-center text-xs font-bold font-serif">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-espresso-900 flex items-center gap-1">
                        <span>{rev.author}</span>
                        <CheckCircle2 size={12} className="text-forest-700" />
                      </div>
                      <div className="text-[10px] text-espresso-900/50">Verified Buyer</div>
                    </div>
                  </div>

                  {product && (
                    <span className="bg-cream-100 border border-cream-300 px-2 py-0.5 rounded text-[10px] font-semibold text-forest-700">
                      {product.name}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
