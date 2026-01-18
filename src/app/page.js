"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
// FIX: Using '../' to go UP one level to finding 'sanity' and 'context'
import { client, urlFor } from "../sanity/client"; 
import { useCart } from "../context/CartContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const { cart } = useCart();

  useEffect(() => {
    // Fetch only items where 'Is New Arrival' is turned ON
    const fetchProducts = async () => {
      try {
        const query = '*[_type == "product" && isNew == true]';
        const data = await client.fetch(query);
        setProducts(data);
      } catch (err) {
        console.error("Failed to load new arrivals", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className="bg-white min-h-screen">
      <nav className="fixed w-full z-50 top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            <Link href="/">
              <h1 className="text-2xl font-serif font-bold tracking-widest uppercase cursor-pointer">Shubh Creations</h1>
            </Link>
            <Link href="/cart">
              <button className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition">
                Bag ({cart.length})
              </button>
            </Link>
        </div>
      </nav>

      {/* HERO SECTION - NO BUTTON */}
      <section className="relative h-[80vh] w-full bg-[#f4f4f4] flex items-center justify-center">
        <div className="text-center z-10 px-4">
            <p className="text-sm font-bold tracking-[0.3em] text-gray-500 mb-4 uppercase">New Collection 2025</p>
            <h2 className="text-5xl md:text-7xl font-serif text-gray-900">Elegance is <br/> an Attitude.</h2>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-xl font-serif mb-10 text-center italic">Shop by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Jewellery', 'Dresses', 'Bags'].map((cat) => (
                <Link key={cat} href={`/${cat.toLowerCase()}`}>
                    <div className="h-64 bg-gray-50 flex items-center justify-center border border-gray-100 hover:border-black cursor-pointer transition-all group">
                        <span className="text-2xl font-serif group-hover:scale-110 transition duration-500">{cat}</span>
                    </div>
                </Link>
            ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex justify-between items-end mb-10">
            <h3 className="text-3xl font-serif">New Season Arrivals</h3>
            <span className="text-sm text-gray-400">{products.length} Items</span>
        </div>
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((product) => (
                <div key={product._id} className="group cursor-pointer">
                    <Link href={`/product/${product._id}`}>
                        <div className="relative h-[400px] w-full overflow-hidden bg-gray-100 mb-4">
                            {product.image && (
                                <Image 
                                    src={urlFor(product.image).width(600).url()} 
                                    alt={product.name} 
                                    fill 
                                    className="object-cover transition duration-700 group-hover:scale-105" 
                                />
                            )}
                        </div>
                    </Link>
                    <div className="mt-4">
                        <h4 className="font-serif text-lg text-gray-900 truncate">{product.name}</h4>
                        <p className="text-sm font-bold">₹{product.price}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>
    </main>
  );
}