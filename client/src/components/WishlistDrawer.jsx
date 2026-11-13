import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistDrawer = () => {
  const {
    products,
    wishlist,
    toggleWishlist,
    addToCart,
    isWishlistOpen,
    setIsWishlistOpen,
    setCurrentPage,
    setSelectedProductDetail,
    showToast
  } = useStore();

  if (!isWishlistOpen) return null;

  const favoritedProducts = products.filter(p => wishlist.includes(p.id));

  const handleClearAll = () => {
    wishlist.forEach(id => toggleWishlist(id));
    showToast('Cleared all saved favorites');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsWishlistOpen(false)}
        className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-cream-100 shadow-2xl flex flex-col justify-between border-l border-cream-300">
          
          {/* Header */}
          <div className="p-6 border-b border-cream-300 flex items-center justify-between bg-cream-200/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amberGold-500/20 text-amberGold-600 rounded-xl">
                <Heart size={20} className="fill-amberGold-500" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-espresso-900">Your Favorite Rituals</h2>
                <p className="text-[11px] text-espresso-900/60 font-medium">
                  {favoritedProducts.length} saved {favoritedProducts.length === 1 ? 'roast' : 'roasts'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 text-espresso-900/70 hover:text-espresso-900 rounded-full hover:bg-cream-300 transition-colors"
              title="Close Drawer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Wishlist Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {favoritedProducts.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 bg-amberGold-500/10 text-amberGold-600 rounded-full flex items-center justify-center mx-auto text-2xl font-serif border border-amberGold-500/30">
                  <Heart size={28} className="text-amberGold-500" />
                </div>
                <p className="font-serif text-xl font-bold text-espresso-900">Your wishlist is empty</p>
                <p className="text-xs text-espresso-900/60 max-w-xs mx-auto">
                  Click the heart icon on any coffee product while browsing to save your favorite roasts for later.
                </p>
                <button
                  onClick={() => {
                    setIsWishlistOpen(false);
                    setCurrentPage('shop');
                  }}
                  className="bg-forest-700 hover:bg-forest-800 text-cream-100 text-xs font-semibold px-5 py-2.5 rounded-xl shadow transition-all inline-flex items-center gap-2 mt-2"
                >
                  <span>Explore Signature Roasts</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              favoritedProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-cream-50 border border-cream-300 rounded-2xl p-4 flex gap-4 items-center justify-between shadow-sm hover:shadow-md transition-all group"
                >
                  <img
                    src={product.bagImage}
                    alt={product.name}
                    onClick={() => {
                      setIsWishlistOpen(false);
                      setSelectedProductDetail(product);
                    }}
                    className="w-16 h-20 object-cover rounded-xl shadow-sm border border-cream-300 cursor-pointer group-hover:scale-105 transition-transform"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div
                      onClick={() => {
                        setIsWishlistOpen(false);
                        setSelectedProductDetail(product);
                      }}
                      className="cursor-pointer"
                    >
                      <h3 className="font-serif font-bold text-base text-espresso-900 truncate group-hover:text-forest-700 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[10px] text-forest-700 font-semibold mt-0.5">
                        <span className="bg-forest-100 text-forest-800 px-1.5 py-0.5 rounded font-mono">
                          {product.roastLevel}
                        </span>
                        <span>•</span>
                        <span>${product.price.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Flavor Notes */}
                    {product.flavorNotes && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.flavorNotes.slice(0, 3).map((note, idx) => (
                          <span key={idx} className="bg-cream-200 text-espresso-900/80 text-[9px] px-1.5 py-0.5 rounded-full font-medium">
                            {note}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove from Wishlist"
                    >
                      <Trash2 size={16} />
                    </button>

                    <button
                      onClick={() => {
                        addToCart(product);
                        setIsWishlistOpen(false);
                      }}
                      className="bg-forest-700 hover:bg-forest-800 text-cream-100 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
                      title="Add to Cart"
                    >
                      <ShoppingBag size={12} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Clear All */}
          {favoritedProducts.length > 0 && (
            <div className="p-6 border-t border-cream-300 bg-cream-200/50 space-y-3">
              <div className="flex items-center justify-between text-xs text-espresso-900">
                <span className="text-espresso-900/70 font-medium">Total Saved Items</span>
                <span className="font-bold font-mono text-forest-700">{favoritedProducts.length}</span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleClearAll}
                  className="flex-1 bg-cream-200 hover:bg-cream-300 text-espresso-900 text-xs font-semibold py-3 rounded-xl transition-colors border border-cream-300"
                >
                  Clear Wishlist
                </button>
                <button
                  onClick={() => {
                    setIsWishlistOpen(false);
                    setCurrentPage('shop');
                  }}
                  className="flex-1 bg-forest-700 hover:bg-forest-800 text-cream-100 text-xs font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Browse Shop</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
