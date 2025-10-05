"use client";
import React from "react";

export default function DetailCard({
  title = "Resource Title",
  price = 0,
  description = "No description available.",
  images = [{ src: "/placeholder.png", alt: "Resource Image" }],
  extraInfo = [],
  category = null,
  isOwner = false,
  availability_status = "available",
  hasTransaction = false, 
  onAddToBag = () => {},
  onEdit = () => {},
  onCheckStatus = () => {},
}) {
  const isAvailable = availability_status?.toLowerCase() === "available";

  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-2 md:gap-12 lg:py-16">
      {/* Left: Main image */}
      <div>
        <div className="aspect-square w-full overflow-hidden rounded-2xl">
          <img
            src={images[0]?.src}
            alt={images[0]?.alt}
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      {/* Right: Details */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h1>

        <p className="mt-3 text-2xl font-semibold text-gray-900">₹ {price}</p>

        <p className="mt-4 text-gray-600 leading-relaxed">{description}</p>

        {/* Extra Info + Category inline labels */}
        {(extraInfo.length > 0 || category) && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {extraInfo.map((info, idx) => (
              <span
                key={idx}
                className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-md"
              >
                Type: {info.type}
              </span>
            ))}

            {category && (
              <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
                Category: {category}
              </span>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-6 flex items-center gap-4">
          {isOwner ? (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 md:w-auto"
            >
              Edit Resource
            </button>
          ) : hasTransaction ? (
            <button
              type="button"
              onClick={onCheckStatus}
              className="inline-flex w-full items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 md:w-auto"
            >
              Check Status
            </button>
          ) : isAvailable ? (
            <button
              type="button"
              onClick={onAddToBag}
              className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 md:w-auto"
            >
              Contact Owner
            </button>
          ) : (
            <span className="inline-flex w-full items-center justify-center rounded-xl bg-gray-400 px-6 py-3 text-sm font-semibold text-white shadow-sm md:w-auto">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
