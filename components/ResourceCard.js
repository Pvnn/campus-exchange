// src/components/ResourceCard.js

/*
  ResourceCard — How to use

  What it shows
  - Square image on a light gray canvas
  - One simple availability line (SHARE / RENT / SALE) directly under the image
  - Title (name) and price, centered
  - Entire card is clickable and routes to the product page

  Required setup
  - Create routes:
      • Collection page:   /product            (app/product/page.js)
      • Detail page:       /product/[id]       (app/product/[id]/page.js)

  Minimal example
    <ResourceCard
      id={42}                                 // navigates to /product/42
      imageSrc="https://example.com/item.jpg"
      imageAlt="Leather journal"
      title="Leatherbound Daily Journal"
      price="$50"
      status="sale"                           // "share" | "rent" | "sale" (case-insensitive)
    />

  Custom link example (if using slugs)
    <ResourceCard
      href="/products/leatherbound-daily-journal"  // overrides id-based link
      imageSrc="https://example.com/journal.jpg"
      title="Leatherbound Daily Journal"
      price="$50"
      status="rent"
    />

  Mapping a list
    {items.map(item => (
      <ResourceCard
        key={item.id}
        id={item.id}
        imageSrc={item.image}
        imageAlt={item.name}
        title={item.name}
        price={item.price}
        status={item.status} // "share" | "rent" | "sale"
      />
    ))}

  Notes
  - Status text is plain (no badges), centered, and optional (hidden if missing/unknown).
  - Uses client-side navigation; no click handlers are needed or passed down.
  - Keep props serializable when rendered from a server component.
*/

"use client";
import React from "react";
import Link from "next/link";

export default function ResourceCard({
  id,
  imageSrc,
  imageAlt,
  title,
  price,
  status,
  href,
  className = "",
}) {
  const to = href || (id != null ? `/resource/${id}` : "#");

  // Normalize and map status to a display label
  const norm = typeof status === "string" ? status.toLowerCase() : "";
  const label =
    norm === "share" ? "SHARE" :
    norm === "lend"  ? "RENT"  :
    norm === "sell"  ? "SALE"  :
    null;

  return (
    <Link
      href={to}
      aria-label={title}
      className={`block rounded-2xl bg-white p-4 sm:p-5 border-0 ring-0 shadow-none
                  transition-transform duration-200 ease-out
                  hover:-translate-y-0.5 hover:scale-[1.01]
                  ${className}`}
    >
      {/* Image */}
      <div className="aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt || title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Availability (plain text, centered) */}
      {label && (
        <p className="mt-3 text-xs text-gray-500 text-center tracking-tight">
          {label}
        </p>
      )}

      {/* Title */}
      {title && (
        <h3 className="mt-2 text-center text-sm sm:text-base font-medium text-gray-900 tracking-tight">
          {title}
        </h3>
      )}

      {/* Price */}
      {price && (
        <p className="mt-1 text-center text-sm text-gray-900">
          &#8377;{`${price}`}
        </p>
      )}
    </Link>
  );
}
