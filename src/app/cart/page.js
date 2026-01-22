"use client";

import { useCart } from "../../context/CartContext";
import { urlFor } from "../../sanity/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const [failedVideos, setFailedVideos] = useState({});

  const totalAmount = cart.reduce((total, item) => total + item.price, 0);

  const handleWhatsAppCheckout = () => {
    const messageLines = cart.map((item, index) => {
      const sizeText =
        item.selectedSize && item.selectedSize !== "One Size"
          ? ` (Size: ${item.selectedSize})`
          : "";

      return `${index + 1}. ${item.name}${sizeText} - ₹${item.price}`;
    });

    const message = `
Hello, I would like to inquire about the following products:

${messageLines.join("\n")}

Total Amount: ₹${totalAmount}
    `.trim();

    const whatsappUrl = `https://wa.me/918369262534?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="font-serif font-bold uppercase tracking-widest"
          >
            Shubh Creations
          </Link>
          <Link
            href="/"
            className="text-sm underline text-gray-500 hover:text-black"
          >
            Continue Shopping
          </Link>
        </div>
      </nav>

      {/* CART CONTENT */}
      <section className="max-w-4xl mx-auto p-6 py-12">
        <h1 className="text-3xl font-serif mb-8">
          Your Inquiry Bag ({cart.length})
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl text-gray-400 mb-4">
              Your bag is empty
            </h2>
            <Link href="/">
              <button className="bg-black text-white px-8 py-3 uppercase tracking-widest text-sm">
                Browse Collection
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {cart.map((item) => (
                <div
                  key={item.cartId}
                  className="flex gap-4 p-4 border-b border-gray-100 items-center"
                >
                  <div className="relative w-20 h-24 bg-black rounded overflow-hidden">
                    {item.videoUrl && !failedVideos[item.cartId] ? (
                      <video
                        src={item.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 w-full h-full object-contain bg-black"
                        onError={() =>
                          setFailedVideos((p) => ({
                            ...p,
                            [item.cartId]: true,
                          }))
                        }
                      />
                    ) : (
                      item.image && (
                        <Image
                          src={urlFor(item.image).url()}
                          alt={item.name}
                          fill
                          className="object-contain bg-black"
                        />
                      )
                    )}
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-serif text-lg text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">
                      {item.category}
                    </p>
                    {item.selectedSize &&
                      item.selectedSize !== "One Size" && (
                        <p className="text-sm font-bold mt-1">
                          Size: {item.selectedSize}
                        </p>
                      )}
                  </div>

                  <div className="text-right">
                    <p className="font-bold">₹{item.price}</p>
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-xs text-red-500 underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* CHECKOUT */}
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xl font-bold">
                Total: ₹{totalAmount}
              </p>

              <button
                onClick={handleWhatsAppCheckout}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 uppercase tracking-widest text-sm font-bold rounded"
              >
                Send Inquiry on WhatsApp
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
