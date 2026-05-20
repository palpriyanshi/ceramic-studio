import React, { useState, useMemo } from "react";
import { SlidersHorizontal, ArrowUpDown, Grid, Search, X } from "lucide-react";

export default function Shop({
  products,
  categories,
  onProductClick,
  onAddToCart,
  searchQuery,
  setSearchQuery
}) {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sortOption, setSortOption] = useState("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter products by category AND search query
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All Products" || product.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts];
    switch (sortOption) {
      case "price-asc":
        return items.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      case "price-desc":
        return items.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      case "name-asc":
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return items.sort((a, b) => b.name.localeCompare(a.name));
      case "newest":
        // Since we have static list, just reverse
        return items.reverse();
      case "recommended":
      default:
        return items;
    }
  }, [filteredProducts, sortOption]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setMobileFiltersOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 bg-sand-100 font-sans min-h-screen">
      {/* Page Title */}
      <div className="text-center space-y-2 mb-12">
        <h1 className="text-3xl md:text-5xl font-serif font-medium tracking-wide uppercase text-neutral-950">
          Shop Our Pottery
        </h1>
        <p className="text-xs tracking-widest text-neutral-500 uppercase">
          {selectedCategory} {searchQuery && `| Search: "${searchQuery}"`}
        </p>
      </div>

      {/* Top action row */}
      <div className="flex flex-wrap items-center justify-between border-b border-sand-300 pb-4 mb-8 gap-4">
        
        {/* Left: Desktop categories info, Mobile trigger */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center space-x-2 text-xs font-sans tracking-widest uppercase border border-sand-300 px-4 py-2 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>

          <span className="hidden md:inline text-xs text-neutral-500 font-sans tracking-wide">
            Showing {sortedProducts.length} unique pottery pieces
          </span>
        </div>

        {/* Right: Sort & search controls */}
        <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
          {searchQuery && (
            <div className="flex items-center bg-sand-200 px-3 py-1.5 rounded-full text-xs text-neutral-700">
              <span className="mr-1">Search: "{searchQuery}"</span>
              <button onClick={() => setSearchQuery("")} className="hover:text-neutral-950 transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Sort Selector */}
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="h-4 w-4 text-neutral-500" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-transparent border-none text-xs font-sans uppercase tracking-widest text-neutral-800 focus:outline-none cursor-pointer py-1"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A - Z</option>
              <option value="name-desc">Name: Z - A</option>
              <option value="newest">Newest Arrival</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main E-comm content area */}
      <div className="flex gap-8">
        
        {/* Left: Desktop Filters Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0 space-y-6">
          <div>
            <h3 className="text-xs font-sans font-bold tracking-widest uppercase text-neutral-950 mb-4 pb-2 border-b border-sand-300">
              Collections
            </h3>
            <ul className="space-y-3">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <li key={cat}>
                    <button
                      onClick={() => handleCategorySelect(cat)}
                      className={`text-left text-sm tracking-wide transition-colors cursor-pointer w-full
                        ${isActive ? "text-sand-700 font-semibold pl-1 border-l-2 border-sand-700" : "text-neutral-500 hover:text-neutral-950"}
                      `}
                    >
                      {cat}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="bg-sand-200/50 p-4 border border-sand-200/50 text-xs text-neutral-600 space-y-2">
            <p className="font-semibold text-neutral-900">Custom Commissions</p>
            <p className="leading-relaxed">
              Looking for a custom dinnerware set or ceramic design? Feel free to contact us with your specifications.
            </p>
          </div>
        </aside>

        {/* Right: Products Grid */}
        <div className="flex-1">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <p className="text-neutral-500">No products found matching your selections.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All Products");
                  setSearchQuery("");
                }}
                className="border border-neutral-950 text-xs font-sans tracking-widest uppercase px-6 py-2.5 hover:bg-neutral-950 hover:text-white transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {sortedProducts.map((product) => {
                const displayPrice = product.salePrice || product.price;
                return (
                  <div
                    key={product.id}
                    className="group flex flex-col space-y-4 cursor-pointer"
                    onClick={() => onProductClick(product)}
                  >
                    {/* Image wrap */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-200 border border-sand-300/40">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {product.hoverImage && (
                        <img
                          src={product.hoverImage}
                          alt={`${product.name} alternate view`}
                          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                        />
                      )}
                      
                      {product.salePrice && (
                        <span className="absolute top-3 left-3 bg-clay-500 text-white text-[9px] uppercase tracking-widest px-2 py-0.5">
                          Sale
                        </span>
                      )}

                      {/* Add to Cart Overlay on hover */}
                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-350 bg-gradient-to-t from-black/50 to-transparent">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product, 1);
                          }}
                          className="w-full bg-white hover:bg-neutral-100 text-neutral-950 text-[10px] font-sans tracking-wider font-semibold py-2.5 transition-colors uppercase shadow cursor-pointer"
                        >
                          Quick Add to Cart
                        </button>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-col items-center text-center space-y-1">
                      <h3 className="text-base font-serif font-medium text-neutral-900 group-hover:text-sand-700 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs font-sans text-neutral-600">
                        {product.salePrice ? (
                          <>
                            <span className="text-clay-500 font-semibold">${product.salePrice.toFixed(2)}</span>
                            <span className="text-neutral-400 line-through">${product.price.toFixed(2)}</span>
                          </>
                        ) : (
                          <span>${product.price.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer/Modal for category filters */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-xs bg-sand-100 shadow-2xl flex flex-col p-6 animate-slide-right">
              <div className="flex items-center justify-between border-b border-sand-300 pb-4 mb-6">
                <h3 className="text-sm font-sans font-bold tracking-widest uppercase text-neutral-950">
                  Filter By Collection
                </h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-2 -mr-2 text-neutral-500 hover:text-neutral-950">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ul className="space-y-4">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <li key={cat}>
                      <button
                        onClick={() => handleCategorySelect(cat)}
                        className={`text-left text-sm tracking-wide w-full py-1.5 cursor-pointer
                          ${isActive ? "text-sand-700 font-semibold pl-2 border-l-2 border-sand-700" : "text-neutral-500 hover:text-neutral-950"}
                        `}
                      >
                        {cat}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
