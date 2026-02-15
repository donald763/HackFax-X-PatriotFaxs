"use client";

import { FadeImage } from "@/components/fade-image";

const accessories = [
  {
    id: 1,
    name: "Starter Plan",
    description: "Perfect for trying AI tutoring with core subjects",
    price: "$9.99/mo",
    image: "/images/hero-side-1.png",
  },
  {
    id: 2,
    name: "Pro Plan",
    description: "Unlimited subjects with advanced analytics",
    price: "$24.99/mo",
    image: "/images/hero-side-2.png",
  },
  {
    id: 3,
    name: "Premium Plan",
    description: "Everything plus 1-on-1 expert mentor sessions",
    price: "$49.99/mo",
    image: "/images/hero-side-4.png",
  },
];

export function CollectionSection() {
  return (
    <section id="pricing" className="bg-green-50">
      {/* Section Title */}
      <div className="px-6 py-20 md:px-12 lg:px-20 md:py-10">
        <h2 className="text-3xl font-bold tracking-tight text-green-900 md:text-4xl">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg text-green-700 mt-2">Choose the plan that works for you</p>
      </div>

      {/* Pricing Grid/Carousel */}
      <div className="pb-24">
        {/* Mobile: Horizontal Carousel */}
        <div className="flex gap-6 overflow-x-auto px-6 pb-4 md:hidden snap-x snap-mandatory scrollbar-hide">
          {accessories.map((accessory) => (
            <div key={accessory.id} className="group flex-shrink-0 w-[75vw] snap-center">
              {/* Image */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-green-100 border border-green-300">
                <FadeImage
                  src={accessory.image || "/placeholder.svg"}
                  alt={accessory.name}
                  fill
                  className="object-cover group-hover:scale-105 opacity-60"
                />
              </div>

              {/* Content */}
              <div className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold leading-snug text-green-900">
                      {accessory.name}
                    </h3>
                    <p className="mt-2 text-sm text-green-700">
                      {accessory.description}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {accessory.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 md:px-12 lg:px-20">
          {accessories.map((accessory) => (
            <div key={accessory.id} className="group bg-white p-8 rounded-2xl border border-green-200 hover:border-green-400 hover:shadow-lg transition-all">
              {/* Image */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-green-100 mb-6">
                <FadeImage
                  src={accessory.image || "/placeholder.svg"}
                  alt={accessory.name}
                  fill
                  className="object-cover group-hover:scale-105 opacity-60"
                />
              </div>

              {/* Content */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold leading-snug text-green-900">
                      {accessory.name}
                    </h3>
                    <p className="mt-3 text-sm text-green-700">
                      {accessory.description}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-green-200 mt-4">
                  <span className="font-bold text-2xl text-green-600">
                    {accessory.price}
                  </span>
                </div>
                <button className="w-full mt-6 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
