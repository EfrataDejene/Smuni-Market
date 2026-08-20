import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FeaturedProducts from '../../components/FeaturedProducts';
import { Search, SlidersHorizontal, ArrowUpDown, X, Star } from 'lucide-react';

export default function Products() {
  const { products, categories, brands, inventory } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();

  // Search/Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // price_asc, price_desc, rating, newest

  // Sync state with URL params on load
  useEffect(() => {
    const catParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const dealsParam = searchParams.get('deals');

    if (catParam) setSelectedCat(catParam);
    if (searchParam) setSearchQuery(searchParam);
    if (dealsParam) {
      // deals filter
      setMinPrice('100'); // simple placeholder min
      // discount > 0 will be filtered
    }
  }, [searchParams]);

  // Clean filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCat('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSortBy('newest');
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter(product => {
    // 1. Search Query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // 2. Category
    if (selectedCat) {
      const catObj = categories.find(c => c.name === selectedCat);
      if (catObj && product.categoryId !== catObj.id) return false;
    }
    // 3. Brand
    if (selectedBrand) {
      const brandObj = brands.find(b => b.name === selectedBrand);
      if (brandObj && product.brandId !== brandObj.id) return false;
    }
    // 4. Price range (based on final discounted price)
    const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
    if (minPrice && discountedPrice < parseFloat(minPrice)) return false;
    if (maxPrice && discountedPrice > parseFloat(maxPrice)) return false;

    // 5. Deals
    if (searchParams.get('deals') && product.discount === 0) return false;

    // 6. In stock check
    if (inStockOnly) {
      const invRecord = inventory.find(i => i.productId === product.productId);
      if (!invRecord || invRecord.quantity <= 0) return false;
    }

    return true;
  }).sort((a, b) => {
    const priceA = a.price * (1 - (a.discount || 0) / 100);
    const priceB = b.price * (1 - (b.discount || 0) / 100);
    
    if (sortBy === 'price_asc') return priceA - priceB;
    if (sortBy === 'price_desc') return priceB - priceA;
    if (sortBy === 'rating') return 5 - 4.5; // simple sorting fallback
    return new Date(b.createdAt) - new Date(a.createdAt); // newest
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header />
        <Navbar />

        <div className="max-w-[1280px] mx-auto px-4 py-6">
          {/* Page Title & Breadcrumbs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Explore Catalog</h1>
              <p className="text-xs text-gray-400 mt-1">
                Showing {filteredProducts.length} results of {products.length} products
              </p>
            </div>
            
            {/* Sorting controls */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <ArrowUpDown size={16} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-500">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#0066D6] focus:border-[#0066D6]"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-6 h-fit">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                  <SlidersHorizontal size={16} /> Filters
                </span>
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-0.5 transition-colors"
                >
                  <X size={12} /> Clear All
                </button>
              </div>

              {/* Keyword Search */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Search Keyword</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#0066D6]"
                  />
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Categories Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categories</label>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  <button
                    onClick={() => setSelectedCat('')}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                      !selectedCat ? 'bg-blue-50 text-[#0066D6] font-semibold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCat(cat.name)}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                        selectedCat === cat.name ? 'bg-blue-50 text-[#0066D6] font-semibold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brands</label>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  <button
                    onClick={() => setSelectedBrand('')}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                      !selectedBrand ? 'bg-blue-50 text-[#0066D6] font-semibold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    All Brands
                  </button>
                  {brands.map(brand => (
                    <button
                      key={brand.id}
                      onClick={() => setSelectedBrand(brand.name)}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                        selectedBrand === brand.name ? 'bg-blue-50 text-[#0066D6] font-semibold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price Range (ETB)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#0066D6]"
                  />
                  <span className="text-gray-400 text-xs">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#0066D6]"
                  />
                </div>
              </div>

              {/* Stock Filter */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-[#0066D6] focus:ring-[#0066D6] w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-gray-600 select-none">In Stock Only</span>
                </label>
              </div>
            </div>

            {/* Product Grid Area */}
            <div className="lg:col-span-3">
              {filteredProducts.length > 0 ? (
                <FeaturedProducts products={filteredProducts} />
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <SlidersHorizontal size={40} className="text-gray-300 mb-4" />
                  <h3 className="font-bold text-gray-800 mb-1">No Matches Found</h3>
                  <p className="text-xs text-gray-400 max-w-sm mb-6">
                    We couldn't find any products matching your specific combinations of keyword, categories, or price settings.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-[#0066D6] hover:bg-[#0052B4] text-white font-semibold text-xs px-6 py-2.5 rounded-lg transition-all active:scale-95 shadow-md"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
