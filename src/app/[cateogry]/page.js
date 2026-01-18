"use client";
import { useState, useEffect } from "react"; // Removed 'use' to be safe
import Link from "next/link";
import Image from "next/image";
import { client, urlFor } from "../../sanity/client"; 
import { useCart } from "../../context/CartContext";

export default function CategoryPage({ params }) {
  const [categoryName, setCategoryName] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useCart();

  // --- SAFE PARAMETER UNWRAPPING ---
  useEffect(() => {
    // This handles both Next.js 14 and 15 safely
    if (params instanceof Promise) {
      params.then((p) => setCategoryName(p.category));
    } else {
      setCategoryName(params.category);
    }
  }, [params]);

  // --- FETCH PRODUCTS ---
  useEffect(() => {
    if (!categoryName) return; // Stop if we don't have a category yet

    const fetchProducts = async () => {
      // 1. Capitalize first letter (jewellery -> Jewellery)
      const dbCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
      
      // 2. Query Sanity
      const query = `*[_type == "product" && category == "${dbCategory}" && isOutOfStock != true]`;
      const data = await client.fetch(query);
      
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, [categoryName]);

  // --- GUARD CLAUSE: Prevent Crash if loading ---
  if (!categoryName) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm p-4 flex justify-between items-center">
        <Link href="/">
            <h1 className="font-serif font-bold uppercase text-lg tracking-widest">Shubh Creations</h1>
        </Link>
        <Link href="/cart">
            <button className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition">
                Bag ({cart.length})
            </button>
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <Link href="/" className="text-sm text-gray-500 hover:text-black mb-6 inline-block">← Back to Home</Link>
        
        <h1 className="text-4xl font-serif capitalize mb-2">{categoryName}</h1>
        <p className="text-gray-500 mb-10">{products.length} Items Available</p>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading collection...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            {/* Display the capitalized name so you can debug the spelling if needed */}
            <h3 className="text-xl text-gray-400">
                No items found in {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}.
            </h3>
            <Link href="/" className="text-black underline mt-4 block">Return Home</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((item) => (
              <div key={item._id} className="bg-white rounded-lg overflow-hidden shadow-sm group hover:shadow-md transition-all">
                
                {/* Product Image */}
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
                    {item.isNew && <span className="absolute top-2 left-2 bg-white text-xs px-2 py-1 font-bold tracking-wider">NEW</span>}
                  </div>
                </Link>

                {/* Info & Add Button */}
                <div className="p-4">
                    <h4 className="font-serif text-lg truncate">{item.name}</h4>
                    <p className="font-bold text-gray-900 mt-1">₹{item.price}</p>
                    
                    <button 
                        onClick={() => addToCart(item, item.category === 'Dresses' ? "Select Size" : "One Size")}
                        className="w-full mt-4 border border-black py-3 uppercase text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-colors"
                    >
                        {item.category === 'Dresses' ? "Quick Add (Select Size)" : "Add to Bag"}
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