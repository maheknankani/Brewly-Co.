import React from 'react';
import { useStore } from '../context/StoreContext';
import { Star, Heart, ArrowRight, ShoppingBag } from 'lucide-react';

export const SignatureCollection = () => {
  const { products, addToCart, wishlist, toggleWishlist, setCurrentPage, setSelectedProductDetail } = useStore();

  const bestSellers = products.slice(0, 4);

  return (
    <section className="py-16 bg-cream-200/50 border-t border-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs uppercase font-mono font-bold tracking-widest text-forest-700">
              COMMUNITY FAVORITES
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-espresso-900 mt-1">
              Loved by Coffee People
            </h2>
            <p className="text-sm text-espresso-900/80 font-sans mt-2">
              Our most popular coffees, roasted fresh and ready for your next brew.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('shop')}
            className="inline-flex items-center gap-2 bg-cream-100 hover:bg-cream-300 text-espresso-900 border border-cream-300 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm self-start md:self-auto"
          >
            <span>View All Coffee</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 4 Best Seller Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map(product => {
            const isFavorite = wishlist.includes(product.id);

            return (
              <div
                key={product.id}
                className="group bg-cream-100 border border-cream-300 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Header & Favorite Toggle */}
                <div className="relative p-6 bg-cream-200/40 border-b border-cream-200/80 overflow-hidden text-center">
                  
                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-espresso-900 text-cream-100 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold tracking-wider">
                      {product.badge}
                    </span>
                  )}

                  {/* Wishlist Heart Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 text-espresso-900 hover:text-rose-600 transition-colors bg-cream-100 rounded-full shadow-sm"
                    title="Add to Favorites"
                  >
                    <Heart size={16} className={isFavorite ? "fill-rose-500 text-rose-500" : ""} />
                  </button>

                  {/* Product Bag Image */}
                  <img
                    src={product.bagImage}
                    alt={product.name}
                    onClick={() => setSelectedProductDetail(product)}
                    className="w-40 h-48 object-cover rounded-xl mx-auto shadow-lg transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                  />
                </div>

                {/* Card Details Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="text-[10px] uppercase font-mono font-bold text-forest-700 tracking-wider">
                      {product.origin} • {product.roastLevel}
                    </div>

                    <h3
                      onClick={() => setSelectedProductDetail(product)}
                      className="font-serif text-xl font-bold text-espresso-900 hover:text-forest-700 transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1.5 text-xs text-amberGold-600 font-semibold">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} className="fill-amberGold-500 text-amberGold-500" />
                        ))}
                      </div>
                      <span>{product.rating.toFixed(1)}</span>
                      <span className="text-espresso-900/40">({product.reviewCount})</span>
                    </div>

                    {/* Flavor Notes */}
                    <p className="text-xs text-espresso-900/70 font-sans line-clamp-1">
                      {product.flavorNotes.join(' • ')}
                    </p>
                  </div>

                  {/* Price & Add to Cart Footer */}
                  <div className="pt-3 border-t border-cream-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-espresso-900/50 block font-mono">250g Bag</span>
                      <span className="text-lg font-serif font-bold text-espresso-900">${product.price.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => addToCart(product, { weight: '250g', grind: 'Whole Bean' })}
                      className="bg-forest-700 hover:bg-forest-800 text-cream-100 p-2.5 rounded-full transition-all shadow hover:shadow-md flex items-center justify-center gap-1 text-xs font-semibold px-3.5"
                    >
                      <ShoppingBag size={14} />
                      <span>Add</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
