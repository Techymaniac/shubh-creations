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
        const newArrivalsQuery = '*[_type == "product" && isNew == true]';
        let data = await client.fetch(newArrivalsQuery);

        if (!data || data.length === 0) {
          const fallbackQuery =
            '*[_type == "product"] | order(_createdAt desc)[0...4]';
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
          <Link href="/">
            <h1 className="text-2xl font-serif font-bold tracking-widest uppercase cursor-pointer text-black">
              Shubh Creations
            </h1>
          </Link>
          <Link href="/cart">
            <button className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition">
              Bag ({cart.length})
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative h-[80vh] w-full bg-[#f4f4f4] flex items-center justify-center">
        <div className="text-center z-10 px-4">
          <p className="text-sm font-bold tracking-[0.3em] text-gray-500 mb-4 uppercase">
            New Collection 2025
          </p>
          <h2 className="text-5xl md:text-7xl font-serif text-gray-900">
            Elegance is <br /> an Attitude.
          </h2>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-xl font-serif mb-10 text-center italic text-black">
          Shop by Category
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Jewellery", "Dresses", "Bags"].map((cat) => (
            <Link key={cat} href={`/${cat.toLowerCase()}`}>
              <div className="h-64 bg-gray-50 flex items-center justify-center border border-gray-100 hover:border-black cursor-pointer transition-all group">
                {/* FIX: transform added */}
                <span className="text-2xl font-serif text-black transform group-hover:scale-110 transition duration-500">
                  {cat}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex justify-between items-end mb-10">
          <h3 className="text-3xl font-serif text-black">
            New Season Arrivals
          </h3>
          <span className="text-sm text-gray-400">
            {products.length} Items
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          {products.length === 0 ? (
            <div className="col-span-4 text-center text-gray-400 py-10">
              Loading New Arrivals...
            </div>
          ) : (
            products.map((product) => (
              <div key={product._id} className="group cursor-pointer">
                <Link href={`/product/${product._id}`}>
                  <div className="relative h-[400px] w-full overflow-hidden bg-gray-100 mb-4">
                    {product.image && (
                      <img
                        src={urlFor(product.image).width(600).url()}
                        alt={product.name}
                        className="w-full h-full object-cover transform transition duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                </Link>

                <div className="mt-4">
                  <h4 className="font-serif text-lg text-gray-900 truncate">
                    {product.name}
                  </h4>
                  <p className="text-sm font-bold text-black">
                    ₹{product.price}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
