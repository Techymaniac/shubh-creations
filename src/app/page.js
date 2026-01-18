// src/app/page.js
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { client, urlFor } from "../sanity/client";
import { useCart } from "../context/CartContext";

export default function Home() {
  const { cart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const query = '*[_type == "product" && isNew == true]';
      const data = await client.fetch(query);
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const categories = [
    { 
      name: "Dresses", 
      link: "/dresses", 
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop" 
    },
    { 
      name: "Bags", 
      link: "/bags", 
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop" 
    },
    { 
      name: "Jewellery", 
      // 👇 UPDATED IMAGE LINK BELOW 👇
      link: "/jewellery", 
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop" 
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-serif font-bold tracking-widest uppercase">
            Shubh Creations
          </h1>
          
          <Link href="/cart">
            <button className="bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-gray-800 transition">
              Inquiry Bag ({cart.length}) ➔
            </button>
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
            alt="Hero" fill className="object-cover brightness-75" priority 
          />
        </div>
        <div className="relative z-10 text-center text-white p-6">
          <p className="text-sm uppercase tracking-[0.3em] mb-4">New Season Arrivals</p>
          <h2 className="text-5xl md:text-7xl font-serif mb-8">
            Timeless Elegance <br/> for Every Occasion
          </h2>
        </div>
      </section>

      {/* --- CATEGORIES --- */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-serif text-center mb-12">Shop by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.link} className="group relative h-[500px] overflow-hidden rounded-lg shadow-lg">
                <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition" />
                <div className="absolute bottom-10 left-0 right-0 text-center">
                  <h3 className="text-3xl font-serif text-white uppercase tracking-widest">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}