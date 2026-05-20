import React from "react";

export default function About() {
  return (
    <div className="max-w-7xl mx-auto py-16 px-4 md:px-8 bg-sand-100 font-sans animate-fade-in">
      {/* Top Banner Title */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <span className="text-xs uppercase tracking-[0.3em] font-sans text-sand-700 font-semibold block">
          Our Philosophy
        </span>
        <h1 className="text-3xl md:text-5xl font-serif font-medium tracking-wide uppercase text-neutral-950">
          The Slow Craft of Clay
        </h1>
        <div className="w-12 h-[2px] bg-sand-700 mx-auto mt-4" />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        {/* Image Column */}
        <div className="aspect-[4/3] bg-sand-200 overflow-hidden shadow-lg relative group">
          <img
            src="https://static.wixstatic.com/media/697bc8_737c1c161f394fd386b56034244adf2b~mv2_d_3000_1744_s_2.jpg"
            alt="Artisan ceramics on display"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Text Story Column */}
        <div className="space-y-6 text-sm text-neutral-600 leading-relaxed font-sans font-light">
          <h2 className="text-2xl font-serif font-medium text-neutral-950 leading-tight">
            Hand-centered, hand-shaped, and fired with intention in San Francisco.
          </h2>
          <p>
            Established in 2018, Ceramic-Studio was born out of a desire to create a more mindful, tactile relationship with the items we use daily. In a world of mass production and speed, we choose to stand at the wheel, wedging clay, and mixing glazes from mineral materials.
          </p>
          <p>
            Every piece we make starts as a simple block of stoneware or porcelain clay. Centered on the wheel, it is shaped through a sequence of careful touches. Once trimmed, it is set to slow dry for up to two weeks before undergoing its first bisque fire. 
          </p>
          <p>
            We formulate all of our own glazes in-house, blending ash, quartz, and metal oxides to yield rich, earthy tones like desert sage, warm sandstone, and charcoal. The wares are fired to cone 10 (approx. 2350°F) in gas kilns, yielding dinnerware that is both visually warm and extremely durable.
          </p>
        </div>
      </div>

      {/* Meet the Maker Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-16 border-t border-sand-300">
        {/* Story details */}
        <div className="space-y-6 text-sm text-neutral-600 leading-relaxed font-sans font-light order-2 lg:order-1">
          <span className="text-xs uppercase tracking-widest text-sand-700 font-semibold block">
            The Maker
          </span>
          <h2 className="text-2xl font-serif font-medium text-neutral-950 leading-tight">
            Meet Sarah Jenkins
          </h2>
          <p>
            Sarah Jenkins is the founder and sole maker behind Ceramic-Studio. She holds a Bachelor of Fine Arts in Ceramics and spent years researching glazing chemistry before establishing her studio in San Francisco.
          </p>
          <p>
            "Pottery is an exercise in letting go," Sarah says. "You can throw the perfect cylinder, trim it beautifully, and glaze it with care, but ultimately the heat of the kiln determines its final form. Those small anomalies—a running glaze drip, a speck of iron bleeding through the slip—are where the beauty of handmade ceramics truly resides."
          </p>
          <div className="p-4 bg-sand-200/50 border border-sand-200/50 flex flex-col space-y-1 rounded-none italic text-xs text-neutral-650">
            <p>"May these wares bring warmth and awareness to your daily tea, meals, and gatherings."</p>
            <p className="font-semibold text-neutral-800 not-italic mt-1">— Sarah J., Founder</p>
          </div>
        </div>

        {/* Maker Image Column */}
        <div className="aspect-[4/5] bg-sand-200 overflow-hidden shadow-lg relative group order-1 lg:order-2 max-h-[500px]">
          <img
            src="https://static.wixstatic.com/media/697bc8_86a73d621f9d46229e011939975c116e~mv2_d_3000_1744_s_2.jpg"
            alt="Ceramic artist painting glaze"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
}
