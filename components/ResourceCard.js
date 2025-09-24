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
    norm === "rent"  ? "RENT"  :
    norm === "sale"  ? "SALE"  :
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
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt || title}
            className="h-36 sm:h-44 md:h-48 object-contain"
          />
        ) : (
          <div className="h-36 sm:h-44 md:h-48 w-full" />
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
          {`$${price}`}
        </p>
      )}
    </Link>
  );
}
