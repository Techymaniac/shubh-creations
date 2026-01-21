"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { client, urlFor } from "../sanity/client";
import { useCart } from "../context/CartContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const { cart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const newArrivalsQuery = `
          *[_type == "product" && isNew == true]{
            ...,
            "videoUrl": video.asset->url
          }
        `;
        let data = await client.fetch(newArrivalsQuery);

        if (!data || data.length === 0) {
          const fallbackQuery = `
            *[_type == "product"] | order(_createdAt desc)[0...4]{
              ...,
              "videoUrl": video.asset->url
            }
          `;
          data = await client.fetch(fallbackQuery);
        }

        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="bg-white min-h-screen">
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="font-serif font-bold uppercase tracking-widest text-black">
            Shubh Creations
          </Link>
          <Link href="/cart">
            <button className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
              Bag ({cart.length})
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="relative h-[80vh] w-full flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1521334884684-d80222895322?q=80&w=1920&auto=format&fit=crop)",
        }}
      >
        <div className="absolute inset-0 bg-white/65"></div>
        <div className="relative text-center z-10 px-4">
          <p className="text-sm font-bold tracking-[0.3em] text-gray-600 uppercase">
            New Collection 2026
          </p>
          <p className="mt-2 text-xs tracking-widest text-gray-500 uppercase">
            Managed by Jayshree Maru
          </p>
          <h2 className="text-5xl md:text-7xl font-serif text-gray-900">
            Defining <br /> Elegance.
          </h2>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-10">
          <h3 className="text-3xl font-serif text-black">New Season Arrivals</h3>
          <span className="text-sm text-gray-400">{products.length} Items</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product) => (
            <div key={product._id} className="group cursor-pointer">
              <Link href={`/product/${product._id}`}>
                <div className="relative h-[400px] w-full overflow-hidden bg-gray-100 mb-4">
                  {product.videoUrl ? (
                    <video
                      src={product.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    product.image && (
                      <img
                        src={urlFor(product.image).width(600).url()}
                        alt={product.name}
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    )
                  )}
                </div>
              </Link>

              <h4 className="font-serif text-lg text-gray-900 truncate">
                {product.name}
              </h4>
              <p className="text-sm font-bold text-black">
                ₹{product.price}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
