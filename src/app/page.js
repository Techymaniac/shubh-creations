"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { client, urlFor } from "../sanity/client";
import { useCart } from "../context/CartContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [mounted, setMounted] = useState(false);
  const { cart } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const query = '*[_type == "product" && isNew == true]';
      let data = await client.fetch(query);

      if (!data || data.length === 0) {
        data = await client.fetch(
          '*[_type == "product"] | order(_createdAt desc)[0...4]'
        );
      }

      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <main className="bg-white min-h-screen">
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="group flex items-center gap-3 cursor-pointer">
            <img
              src="/logo.png"
              alt="Shubh Creations"
              className="h-10 w-10 md:h-12 md:w-12 object-contain transition-all duration-300 group-hover:scale-110"
            />
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
        className="relative h-[80vh] flex items-center justify-center bg-center bg-cover"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1521334884684-d80222895322?q=80&w=1920&auto=format&fit=crop)",
        }}
      >
        <div className="absolute inset-0 bg-white/65"></div>

        <div className="relative text-center px-4">
          <p className="text-sm font-bold tracking-[0.3em] text-gray-600 uppercase">
            New Collection 2026
          </p>
          <p className="mt-2 text-xs tracking-widest text-gray-500 uppercase">
            Managed by Jayshree Maru
          </p>

          <h2 className="mt-6 text-5xl md:text-7xl font-serif text-gray-900">
            Defining <br /> Elegance.
          </h2>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-xl font-serif mb-10 text-center italic text-black">
          Shop by Category
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Jewellery",
              image:
                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
            },
            {
              name: "Dresses",
              image:
                "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
            },
            {
              name: "Bags",
              image:
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
            },
          ].map((cat) => (
            <Link key={cat.name} href={`/${cat.name.toLowerCase()}`}>
              <div
                className="h-64 relative flex items-center justify-center bg-cover bg-center border group overflow-hidden"
                style={{ backgroundImage: `url(${cat.image})` }}
              >
                <div className="absolute inset-0 bg-white/70 group-hover:bg-white/50 transition" />
                <span className="relative text-2xl font-serif text-black transform group-hover:scale-110 transition duration-500">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h3 className="text-3xl font-serif text-black mb-10">
          New Arrivals
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link key={product._id} href={`/product/${product._id}`}>
              <div className="group cursor-pointer">
                <div className="relative h-[400px] w-full overflow-hidden bg-gray-100">
                  {mounted && product.video?.asset ? (
                    <video
                      src={product.video.asset.url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    product.image && (
                      <img
                        src={urlFor(product.image).width(600).url()}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                      />
                    )
                  )}
                </div>

                <h4 className="mt-4 font-serif text-lg text-black">
                  {product.name}
                </h4>
                <p className="font-bold text-black">
                  ₹{product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
