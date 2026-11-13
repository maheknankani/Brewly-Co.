import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Filter, Star, ShoppingBag, Heart, Eye } from 'lucide-react';

export const Shop = () => {
  const { products, wishlist, toggleWishlist, addToCart, setSelectedProductDetail } = useStore();
  
  const [search, setSearch] = useState('');
  const [roastFilter, setRoastFilter] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.flavorNotes.some(n => n.toLowerCase().includes(search.toLowerCase())) ||
                          p.origin.toLowerCase().includes(search.toLowerCase());
    const matchesRoast = roastFilter === 'All' || p.roastLevel === roastFilter;
    return matchesSearch && matchesRoast;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default order
  });

  return (
    <div className="py-10 bg-cream-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-bold text-amberGold-600 block mb-1">
            EXPLORE THE FULL CATALOG
          </span>
          <h1 className="text-4xl font-serif font-bold text-espresso-900">
            Artisan Coffee Collection
          </h1>
          <p className="text-sm text-espresso-900/70 mt-2">
            100% Specialty Grade Arabica roasted fresh to order in small batches.
          </p>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="bg-cream-200/60 border border-cream-300 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          
          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search origin, roast, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-cream-100 border border-cream-300 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-espresso-900 focus:outline-none focus:border-forest-700"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-espresso-900/50" />
          </div>

          {/* Roast Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <span className="text-xs font-bold text-espresso-900 shrink-0 flex items-center gap-1">
              <Filter size={14} /> Roast:
            </span>
            {['All', 'Light Roast', 'Medium Roast', 'Medium-Dark Roast'].map(r => (
              <button
                key={r}
                onClick={() => setRoastFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  roastFilter === r
                    ? 'bg-forest-700 text-cream-100 shadow'
                    : 'bg-cream-100 border border-cream-300 text-espresso-900 hover:bg-cream-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="w-full md:w-auto flex items-center gap-2">
            <span className="text-xs font-bold text-espresso-900 shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-cream-100 border border-cream-300 rounded-xl px-3 py-2 text-xs font-semibold text-espresso-900 focus:outline-none focus:border-forest-700"
            >
              <option value="featured">Featured Selection</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Coffee Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(product => {
            const isFav = wishlist.includes(product.id);

            return (
              <div
                key={product.id}
                className="bg-cream-200/60 border border-cream-300 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative bg-cream-100/90 p-8 flex items-center justify-center min-h-[280px]">
                  {product.badge && (
                    <span className="absolute top-4 left-4 bg-forest-700 text-cream-100 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full z-10">
                      {product.badge}
                    </span>
                  )}

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-4 right-4 p-2 bg-cream-50/80 rounded-full border border-cream-300 hover:bg-cream-100 transition-colors z-10"
                  >
                    <Heart size={16} className={isFav ? "fill-amberGold-500 text-amberGold-500" : "text-espresso-900"} />
                  </button>

                  <img
                    src={product.bagImage}
                    alt={product.name}
                    className="w-48 h-60 object-cover rounded-xl shadow-md transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                    onClick={() => setSelectedProductDetail(product)}
                  />

                  <div className="absolute bottom-3 right-4 flex items-center gap-1 bg-cream-50/90 backdrop-blur-sm border border-cream-300 px-2.5 py-1 rounded-full text-[11px] font-bold text-espresso-900">
                    <Star size={12} className="fill-amberGold-500 text-amberGold-500" />
                    <span>{product.rating}</span>
                    <span className="text-espresso-900/40">({product.reviewCount})</span>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-forest-700 font-semibold uppercase tracking-wider">
                      {product.origin}
                    </div>
                    <h3
                      onClick={() => setSelectedProductDetail(product)}
                      className="text-2xl font-serif font-bold text-espresso-900 hover:text-forest-700 transition-colors cursor-pointer mt-1"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-espresso-900/70 mt-1 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="bg-cream-300/80 text-espresso-900 text-[10px] font-bold px-2 py-0.5 rounded">
                        {product.roastLevel}
                      </span>
                      {product.flavorNotes.map(note => (
                        <span key={note} className="bg-cream-100 text-espresso-900/80 text-[10px] px-2 py-0.5 rounded border border-cream-300">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-cream-300 flex items-center justify-between">
                    <div>
                      <div className="text-base font-bold text-espresso-900">
                        ${product.price.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-forest-700 font-semibold">
                        Sub: ${product.subscriptionPrice.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedProductDetail(product)}
                        className="p-2 rounded-xl border border-cream-300 hover:bg-cream-200 text-espresso-900 transition-colors"
                        title="Quick Customizer"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-forest-700 hover:bg-forest-800 text-cream-100 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <ShoppingBag size={14} />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
