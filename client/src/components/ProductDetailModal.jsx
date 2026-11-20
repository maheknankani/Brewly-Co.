import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../utils/api';
import { X, Star, ShoppingBag, Heart, MapPin, Plus, Minus, MessageSquarePlus, CheckCircle2 } from 'lucide-react';

export const ProductDetailModal = () => {
  const {
    selectedProductDetail,
    setSelectedProductDetail,
    addToCart,
    wishlist,
    toggleWishlist,
    fetchProducts,
    showToast
  } = useStore();

  const [weight, setWeight] = useState('250g');
  const [grind, setGrind] = useState('Whole Bean');
  const [purchaseType, setPurchaseType] = useState('onetime');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Review & Rating State
  const [productReviews, setProductReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (selectedProductDetail) {
      api.getReviews(selectedProductDetail.id)
        .then(res => {
          if (res.success && Array.isArray(res.reviews)) {
            setProductReviews(res.reviews);
          }
        })
        .catch(err => console.error('Error fetching product reviews:', err));
    }
  }, [selectedProductDetail]);

  if (!selectedProductDetail) return null;

  const isFav = wishlist.includes(selectedProductDetail.id);

  let weightMultiplier = 1.0;
  if (weight === '500g') weightMultiplier = 1.75;
  if (weight === '1kg') weightMultiplier = 3.2;

  const basePrice = (selectedProductDetail.price || 20) * weightMultiplier;
  const subPrice = (selectedProductDetail.discountPrice || selectedProductDetail.subscriptionPrice || basePrice * 0.85) * weightMultiplier;
  const currentPrice = purchaseType === 'subscribe' ? subPrice : basePrice;

  const imagesList = selectedProductDetail.images && selectedProductDetail.images.length > 0
    ? selectedProductDetail.images
    : [selectedProductDetail.bagImage, selectedProductDetail.cupImage].filter(Boolean);

  const handleAddToCart = () => {
    addToCart(selectedProductDetail, {
      weight,
      grind,
      isSubscription: purchaseType === 'subscribe',
      quantity
    });
    setSelectedProductDetail(null);
  };

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!authorName.trim() || !userComment.trim()) return;

    try {
      setSubmittingReview(true);
      const reviewPayload = {
        productId: selectedProductDetail.id,
        author: authorName.trim(),
        rating: userRating,
        comment: userComment.trim()
      };

      const res = await api.createReview(reviewPayload);
      if (res.success) {
        showToast(`Thank you! Your ${userRating}★ rating & review has been posted! ⭐`);
        setProductReviews(prev => [res.review || { ...reviewPayload, id: 'rev-' + Date.now(), date: 'Just now' }, ...prev]);
        setAuthorName('');
        setUserComment('');
        setUserRating(5);
        setShowReviewForm(false);
        if (fetchProducts) fetchProducts();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      showToast('Review submitted!');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setSelectedProductDetail(null)}
        className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="relative bg-cream-100 rounded-3xl max-w-4xl w-full border border-cream-300 shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col">
        
        {/* Header Close Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-300 bg-cream-200/50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-forest-700 text-cream-100 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              {selectedProductDetail.category || 'Specialty Roast'}
            </span>
            <span className="text-xs font-serif font-bold text-espresso-900">{selectedProductDetail.name}</span>
          </div>
          <button
            onClick={() => setSelectedProductDetail(null)}
            className="p-1.5 text-espresso-900/70 hover:text-espresso-900 bg-cream-300/80 rounded-full hover:bg-cream-300 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 flex-1 pb-20 sm:pb-6 md:pb-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column: Image Gallery */}
            <div className="md:col-span-5 bg-cream-200/70 border border-cream-300 rounded-2xl p-3 sm:p-6 flex flex-col items-center justify-between relative space-y-3 sm:space-y-4">
              {selectedProductDetail.badge && (
                <span className="absolute top-3 left-3 bg-forest-700 text-cream-100 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full z-10">
                  {selectedProductDetail.badge}
                </span>
              )}

              <div className="w-full flex justify-center py-2">
                <img
                  src={imagesList[activeImageIndex] || selectedProductDetail.bagImage}
                  alt={selectedProductDetail.name}
                  className="w-36 h-44 sm:w-52 sm:h-64 object-cover rounded-xl shadow-lg border border-cream-300 animate-float"
                />
              </div>

              {/* Thumbnail Gallery */}
              {imagesList.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {imagesList.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-12 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx ? 'border-forest-700 scale-105 shadow' : 'border-cream-300 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Rating Pill */}
              <div className="flex items-center gap-1.5 bg-cream-100 border border-cream-300 px-3 py-1.5 rounded-full text-xs font-bold text-espresso-900 shadow-sm">
                <Star size={15} className="fill-amberGold-500 text-amberGold-500" />
                <span>{selectedProductDetail.rating !== undefined ? selectedProductDetail.rating : 4.8}</span>
                <span className="text-espresso-900/50 font-normal">({selectedProductDetail.reviewCount || productReviews.length || 42} reviews)</span>
              </div>
            </div>

            {/* Right Column: E-commerce Details */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-forest-700 uppercase tracking-wider">
                  <MapPin size={14} className="text-amberGold-600" />
                  <span>{selectedProductDetail.origin} • {selectedProductDetail.region || 'Artisan Estate'}</span>
                </div>
                
                <h2 className="text-3xl font-serif font-bold text-espresso-900 mt-1">
                  {selectedProductDetail.name}
                </h2>

                <p className="text-xs text-forest-700 font-semibold italic mt-0.5">
                  "{selectedProductDetail.shortDescription || selectedProductDetail.tagline}"
                </p>
              </div>

              {/* Farm & Origin Metadata Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-espresso-900/80 bg-cream-50 p-3 rounded-xl border border-cream-300 font-mono">
                <div><strong>Farm:</strong> {selectedProductDetail.farm || "Estates"}</div>
                <div><strong>Elevation:</strong> {selectedProductDetail.altitude || "1,600m"}</div>
                <div><strong>Processing:</strong> {selectedProductDetail.processingMethod || selectedProductDetail.processMethod || "Washed"}</div>
                <div><strong>Roast Date:</strong> {selectedProductDetail.roastDate || "Fresh Batch"}</div>
              </div>

              {/* Cupping Sensory Specs */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-cream-200/60 p-2 rounded-xl border border-cream-300">
                  <span className="text-[10px] text-espresso-900/60 uppercase block font-mono">Acidity</span>
                  <span className="font-bold text-espresso-900">{selectedProductDetail.acidity || 'Medium'}</span>
                </div>
                <div className="bg-cream-200/60 p-2 rounded-xl border border-cream-300">
                  <span className="text-[10px] text-espresso-900/60 uppercase block font-mono">Body</span>
                  <span className="font-bold text-espresso-900">{selectedProductDetail.body || 'Medium Full'}</span>
                </div>
                <div className="bg-cream-200/60 p-2 rounded-xl border border-cream-300">
                  <span className="text-[10px] text-espresso-900/60 uppercase block font-mono">Sweetness</span>
                  <span className="font-bold text-espresso-900">{selectedProductDetail.sweetness || 'Caramel'}</span>
                </div>
              </div>

              {/* Flavor Notes Pills */}
              {selectedProductDetail.flavorNotes && selectedProductDetail.flavorNotes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedProductDetail.flavorNotes.map(note => (
                    <span key={note} className="bg-amberGold-500/15 text-amberGold-600 border border-amberGold-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      ☕ {note}
                    </span>
                  ))}
                </div>
              )}

              {/* Customization Options */}
              <div className="space-y-3 pt-2 border-t border-cream-300">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-espresso-900 uppercase mb-1">Weight</label>
                    <select
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2 text-xs font-semibold text-espresso-900 focus:outline-none focus:border-forest-700"
                    >
                      {(selectedProductDetail.weightOptions || ['250g', '500g', '1kg']).map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-espresso-900 uppercase mb-1">Grind Preference</label>
                    <select
                      value={grind}
                      onChange={(e) => setGrind(e.target.value)}
                      className="w-full bg-cream-50 border border-cream-300 rounded-xl p-2 text-xs font-semibold text-espresso-900 focus:outline-none focus:border-forest-700"
                    >
                      {(selectedProductDetail.grindOptions || ['Whole Bean', 'Espresso', 'Filter / Drip', 'French Press', 'Pour Over']).map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Purchase Mode */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setPurchaseType('onetime')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      purchaseType === 'onetime'
                        ? 'border-forest-700 bg-forest-700/10 font-bold'
                        : 'border-cream-300 bg-cream-50'
                    }`}
                  >
                    <div className="text-xs font-semibold text-espresso-900">One-Time ({weight})</div>
                    <div className="text-xs font-bold text-espresso-900">${basePrice.toFixed(2)}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPurchaseType('subscribe')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      purchaseType === 'subscribe'
                        ? 'border-forest-700 bg-forest-700/10 font-bold'
                        : 'border-cream-300 bg-cream-50'
                    }`}
                  >
                    <div className="text-xs font-semibold text-forest-700 flex items-center justify-between">
                      <span>Subscribe ({weight})</span>
                      <span className="text-[10px] bg-amberGold-500/20 text-amberGold-600 px-1 rounded">Save 15%</span>
                    </div>
                    <div className="text-xs font-bold text-espresso-900">${subPrice.toFixed(2)}</div>
                  </button>
                </div>
              </div>

              {/* Actions & Stock Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-cream-300">
                <div className="flex items-center border border-cream-300 rounded-xl bg-cream-50 px-2 py-1.5 text-xs font-semibold">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:text-forest-700 text-espresso-900">
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center font-mono font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:text-forest-700 text-espresso-900">
                    <Plus size={12} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={selectedProductDetail.stock === 0}
                  className={`flex-1 font-semibold text-xs py-3 rounded-xl shadow transition-all flex items-center justify-center gap-2 ${
                    selectedProductDetail.stock === 0
                      ? 'bg-cream-300 text-espresso-900/50 cursor-not-allowed'
                      : 'bg-forest-700 hover:bg-forest-800 text-cream-100'
                  }`}
                >
                  <ShoppingBag size={14} />
                  <span>
                    {selectedProductDetail.stock === 0
                      ? 'Out of Stock'
                      : `Add to Cart — $${(currentPrice * quantity).toFixed(2)}`}
                  </span>
                </button>

                <button
                  onClick={() => toggleWishlist(selectedProductDetail.id)}
                  className="p-3 border border-cream-300 rounded-xl bg-cream-50 hover:bg-cream-200 text-espresso-900 transition-colors"
                >
                  <Heart size={16} className={isFav ? "fill-amberGold-500 text-amberGold-500" : ""} />
                </button>
              </div>

            </div>

          </div>

          {/* CUSTOMER REVIEWS & RATING SECTION */}
          <div className="border-t border-cream-300 pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-espresso-900 flex items-center gap-2">
                  <span>Customer Reviews & Ratings</span>
                  <span className="text-xs bg-cream-200 border border-cream-300 text-forest-700 font-mono font-bold px-2.5 py-0.5 rounded-full">
                    ⭐ {selectedProductDetail.rating !== undefined ? selectedProductDetail.rating : 4.8} / 5
                  </span>
                </h3>
                <p className="text-xs text-espresso-900/70">Verified tasting feedback for {selectedProductDetail.name}</p>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-espresso-900 hover:bg-espresso-800 text-cream-100 px-4 py-2 rounded-xl text-xs font-semibold shadow transition-all flex items-center gap-1.5"
              >
                <MessageSquarePlus size={15} />
                <span>{showReviewForm ? 'Cancel' : 'Write a Review'}</span>
              </button>
            </div>

            {/* Inline Review Form */}
            {showReviewForm && (
              <form onSubmit={handlePostReview} className="bg-cream-200/80 border border-cream-300 rounded-2xl p-5 space-y-4 text-xs shadow-sm">
                <h4 className="font-serif font-bold text-base text-espresso-900">Rate & Review {selectedProductDetail.name}</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-espresso-900 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex M."
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full bg-cream-100 border border-cream-300 rounded-xl p-2.5 font-semibold text-espresso-900 focus:outline-none focus:border-forest-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-espresso-900 mb-1">Your Rating *</label>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star size={22} className={star <= userRating ? "fill-amberGold-500 text-amberGold-500" : "text-cream-400"} />
                        </button>
                      ))}
                      <span className="ml-2 font-mono font-bold text-espresso-900">{userRating} / 5 Stars</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-espresso-900 mb-1">Your Review & Tasting Notes *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe aroma, acidity, body, and overall brewing experience..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    className="w-full bg-cream-100 border border-cream-300 rounded-xl p-2.5 text-espresso-900 focus:outline-none focus:border-forest-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-forest-700 hover:bg-forest-800 text-cream-100 font-bold px-6 py-2.5 rounded-xl transition-all shadow"
                >
                  {submittingReview ? 'Publishing Review...' : 'Submit Rating & Review'}
                </button>
              </form>
            )}

            {/* List of Product Reviews */}
            {productReviews.length === 0 ? (
              <div className="bg-cream-50 border border-cream-300 rounded-2xl p-6 text-center space-y-2">
                <Star size={28} className="mx-auto text-amberGold-500/50" />
                <p className="text-sm font-semibold text-espresso-900">Be the first to review {selectedProductDetail.name}!</p>
                <p className="text-xs text-espresso-900/60">Share your brewing setup and sensory feedback with the roastery community.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {productReviews.map((rev, idx) => (
                  <div key={rev.id || idx} className="bg-cream-50 border border-cream-300 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amberGold-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            className={i < (rev.rating || 5) ? "fill-amberGold-500 text-amberGold-500" : "text-cream-300"}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-espresso-900/50 font-mono">{rev.date || 'Verified Purchase'}</span>
                    </div>

                    <p className="text-xs text-espresso-900/80 italic">"{rev.comment}"</p>

                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-espresso-900 pt-2 border-t border-cream-200">
                      <span>{rev.author}</span>
                      <CheckCircle2 size={12} className="text-forest-700" />
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
