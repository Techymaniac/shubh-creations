"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { client, urlFor } from "../../sanity/client";
import { useCart } from "../../context/CartContext";

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      // Safety Check
      if (!params?.category) return;

      try {
        setLoading(true);
        const rawCategory = decodeURIComponent(params.category); // e.g., "jewellery"
        
        // Create versions: "jewellery" AND "Jewellery"
        const lowerCat = rawCategory.toLowerCase();
        const capitalCat = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1);

        console.log(`Searching for: ${lowerCat} OR ${capitalCat}`);

        // FIX: Ask for BOTH versions so it matches no matter what
        const query = `*[_type == "product" && (category == "${lowerCat}" || category == "${capitalCat}")]`;
        
        const data = await client.fetch(query);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Force loading off
      }
    };

    fetchProducts();
  }, [params]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400 tracking-widest uppercase text-sm animate-pulse">Loading Collection...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm p-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="font-serif font-bold uppercase text-lg tracking-widest cursor-pointer">
            Shubh Creations
          </h1>
        </Link>
        <Link href="/cart">
          <button className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition">
            Bag ({cart.length})
          </button>
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <Link href="/" className="text-sm text-gray-500 hover:text-black mb-6 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-serif capitalize mb-2">
          {params?.category ? decodeURIComponent(params.category) : 'Collection'}
        </h1>
        <p className="text-gray-500 mb-10">{products.length} Items Available</p>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl text-gray-400">No items found in this category.</h3>
            <p className="text-sm text-gray-400 mt-2">
               (We searched for both "Jewellery" and "jewellery")
            </p>
            <Link href="/" className="text-black underline mt-4 block">
              Return Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((item) => (
              <div key={item._id} className="bg-white rounded-lg overflow-hidden shadow-sm group hover:shadow-md transition-all">
                <Link href={`/product/${item._id}`}>
                  <div className="relative h-96 w-full cursor-pointer overflow-hidden bg-gray-100">
                    {item.image && (
                      <Image
                        src={urlFor(item.image).width(600).url()}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <h4 className="font-serif text-lg truncate">{item.name}</h4>
                  <p className="font-bold text-gray-900 mt-1">₹{item.price}</p>
                  <button
                    onClick={() => addToCart(item, "One Size")}
                    className="w-full mt-4 border border-black py-3 uppercase text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-colors"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}