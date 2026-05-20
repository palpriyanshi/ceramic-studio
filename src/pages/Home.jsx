import React from "react";
import { ArrowRight } from "lucide-react";

export default function Home({ products, setActiveView, onProductClick }) {
  // Take first 6 products for home feature
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="animate-fade-in font-sans">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center bg-sand-900 text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://static.wixstatic.com/media/d01231e46af34161be7ad101d281a441.jpg"
            alt="Ceramic table layout"
            className="w-full h-full object-cover opacity-60 scale-105 animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-neutral-900/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
          <span className="text-xs uppercase tracking-[0.4em] font-sans text-sand-300 block animate-slide-up">
            Clay & Craftsmanship
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light tracking-[0.15em] text-sand-50 uppercase leading-none animate-slide-up [animation-delay:200ms]">
            Artisan Pottery
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-sand-200 font-sans tracking-wide max-w-xl mx-auto font-light leading-relaxed animate-slide-up [animation-delay:400ms]">
            Carefully curated collections, hand-thrown in our local studio. Functional wares created to elevate everyday moments.
          </p>
          <div className="pt-4 animate-slide-up [animation-delay:600ms]">
            <button
              onClick={() => setActiveView("shop")}
              className="bg-sand-100 hover:bg-white text-neutral-950 text-xs font-sans font-semibold tracking-widest uppercase px-10 py-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Collection Gallery */}
      <section className="max-w-7xl mx-auto py-24 px-4 md:px-8 bg-sand-100">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-medium tracking-wide text-neutral-950">
            OUR COLLECTION
          </h2>
          <div className="w-12 h-[2px] bg-sand-700 mx-auto" />
          <p className="text-sm text-neutral-600 leading-relaxed font-sans font-light">
            Each ceramic item is lovingly hand-thrown in our San Francisco studio. Utilizing raw stoneware clay and our signature mineral glazes, every bowl, plate, and mug has its own subtle variations in color, weight, and shape, making it truly one of a kind.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {featuredProducts.map((product) => {
            const displayPrice = product.salePrice || product.price;
            return (
              <div
                key={product.id}
                onClick={() => onProductClick(product)}
                className="group cursor-pointer flex flex-col space-y-4"
              >
                {/* Image Wrap */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-200 border border-sand-300/40">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Secondary Hover Image overlay */}
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
                </div>

                {/* Meta */}
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

        {/* View All CTA */}
        <div className="text-center mt-16">
          <button
            onClick={() => setActiveView("shop")}
            className="inline-flex items-center space-x-2 border-b-2 border-neutral-900 pb-1 text-sm font-sans tracking-widest uppercase text-neutral-950 hover:text-sand-700 hover:border-sand-700 transition-colors cursor-pointer group"
          >
            <span>View All Products</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* Editorial Process Banner */}
      <section className="bg-sand-200 py-20 px-4 md:px-8 border-t border-b border-sand-300/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Left Text */}
          <div className="w-full md:w-1/2 space-y-6">
            <span className="text-xs uppercase tracking-widest text-sand-700 font-semibold block">
              Our Studio
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-neutral-950">
              Honoring the Natural Beauty of Raw Stoneware
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-sans font-light">
              We believe in slowing down. Every stage of the process—from sourcing raw clay slips, wedging, centering, throwing on the wheel, trimming, bisquing, glazing, to the final wood-fire in the kiln—is done by hand with intention.
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed font-sans font-light">
              Our glazes are mixed in small batches using local minerals. The resulting textures are organic, warm, and highly tactile, creating an earthy connection between nature and your home.
            </p>
            <button
              onClick={() => setActiveView("about")}
              className="bg-neutral-950 hover:bg-neutral-850 text-white text-xs font-sans tracking-widest uppercase px-8 py-3.5 transition-colors cursor-pointer"
            >
              Read Our Story
            </button>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-1/2 aspect-[4/3] bg-sand-300 overflow-hidden shadow-lg">
            <img
              src="https://static.wixstatic.com/media/697bc8_c0ed76883931447399276af2f461f9cc~mv2_d_3000_1744_s_2.jpg"
              alt="Artisan pottery making"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
