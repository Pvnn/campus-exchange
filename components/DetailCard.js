"use client";
import React, { useState } from "react";

const Star = ({ filled }) => (
  <svg
    aria-hidden="true"
    className={`h-5 w-5 ${filled ? "text-indigo-500" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z" />
  </svg>
);

export default function DetailCard({
  title = "Zip Tote Basket",
  price = 140,
  rating = 4,
  reviewCount = 128,
  description = "The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, shoulder sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps goods protected for all-day use.",
  images = [
    { src: "/images/bag-1.jpg", alt: "Front view" },
    { src: "/images/bag-2.jpg", alt: "Back view" },
    { src: "/images/bag-3.jpg", alt: "Side view" },
    { src: "/images/bag-4.jpg", alt: "Top view" }
  ],
  extraInfo = [], // <-- Array of available options from database [{type: "Sell"}, {type: "Rent"}]
  onAddToBag = () => {},
  onToggleWishlist = () => {}
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-2 md:gap-12 lg:py-16">
      {/* Left: Main image + thumbnails */}
      <div>
        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
          <img
            src={images[activeIndex]?.src}
            alt={images[activeIndex]?.alt}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="mt-4 grid grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`overflow-hidden rounded-xl border p-1 focus:outline-none ${
                idx === activeIndex
                  ? "border-indigo-500 ring-2 ring-indigo-500"
                  : "border-transparent hover:border-gray-300"
              }`}
              aria-label={`Thumbnail ${idx + 1}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="aspect-square w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Details */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h1>

        <div className="mt-3 flex items-center gap-3">
          <p className="text-2xl font-semibold text-gray-900">${price}</p>
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} filled={i < rating} />
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {rating}.0 ({reviewCount})
            </span>
          </div>
        </div>

        <p className="mt-4 text-gray-600 leading-relaxed">{description}</p>

        {/* Extra Info (Sell / Share / Rent) */}
        {extraInfo.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {extraInfo.map((info, idx) => (
              <span
                key={idx}
                className="bg-gray-200 px-4 py-2 text-base font-semibold text-gray-800 rounded-md transition-all duration-200 hover:bg-indigo-100 hover:text-indigo-700 cursor-pointer"
              >
                {info.type} {/* Shows only available options */}
              </span>
            ))}
          </div>
        )}

        {/* CTA row */}
        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => onAddToBag({ title, price })}
            className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 md:w-auto"
          >
            Contact Owner
          </button>

          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={() => onToggleWishlist({ title })}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.94 0-3.617 1.126-4.312 2.733C11.306 4.876 9.629 3.75 7.688 3.75 5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
