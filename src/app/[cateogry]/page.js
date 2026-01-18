"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { client, urlFor } from "../../sanity/client";
import { useCart } from "../../context/CartContext";

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useCart();

  useEffect(() => {
    const fetchAndFilter = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch ALL products (This guarantees we get the data)
        const query = `*[_type == "product"]`;
        const data = await client.fetch(query);
        
        // 2. Filter safely in JavaScript (Ignores capital letters)
        if (params?.category) {
          const targetCategory = decodeURIComponent(params.category).toLowerCase().trim();
          
          // "jewellery" matches "Jewellery" perfectly here
          const matches = data.filter(item => {
             const itemCategory = item.category ? item.category.toLowerCase().trim() : "";
             return itemCategory === targetCategory || itemCategory.includes(targetCategory);
          });
          
          setProducts(matches);
        } else {
          setProducts(data);
        }

      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params?.category) {
      fetchAndFilter();
    }
  }, [params?.category]);

  // Loading State
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm p-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="font-serif font-bold uppercase text-lg tracking-widest cursor-pointer">Shubh Creations</h1>
        </Link>
        <Link href="/cart">
          <button className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition">
            Bag ({cart.length})
          </button>
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <Link href="/" className="text-sm text-gray-500 hover:text-black mb-6 inline-block">← Back to Home</Link>
        
        <h1 className="text-4xl font-serif capitalize mb-2">{decodeURIComponent(params.category)}</h1>
        <p className="text-gray-500 mb-10">{products.length} Items Available</p>

        {products.length === 0 ? (
          <div className="text-center py-20">
             <h3 className="text-xl text-gray-400">No items found.</h3>
             <p className="text-sm text-gray-400 mt-2">
               We checked for "{decodeURIComponent(params.category)}".
             </p>
             <Link href="/" className="text-black underline mt-4 block">Return Home</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((item) => (
              <div key={item._id} className="bg-white rounded-lg overflow-hidden shadow-sm group hover:shadow-md transition-all">
                <Link href={`/product/${item._id}`}>
                  <div className="relative h-96 w-full cursor-pointer overflow-hidden bg-gray-100">
                    {/* STANDARD HTML IMAGE TAG (Fixes missing images) */}
                    {item.image ? (
                      <img
                        src={urlFor(item.image).width(600).url()}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 bg-gray-200">No Image</div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <h4 className="font-serif text-lg truncate">{item.name}</h4>
                  <p className="font-bold text-gray-900 mt-1">₹{item.price}</p>
                  <button onClick={() => addToCart(item, "One Size")} className="w-full mt-4 border border-black py-3 uppercase text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-colors">Add to Bag</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}