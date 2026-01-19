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
  const [error, setError] = useState(null);
  const { cart } = useCart();

  useEffect(() => {
    const fetchAndFilter = async () => {
      try {
        setLoading(true);
        setError(null);

        const query = `*[_type == "product"]`;
        const data = await client.fetch(query);

        if (params?.category) {
          const targetCategory = decodeURIComponent(params.category)
            .toLowerCase()
            .trim();

          const matches = data.filter((item) => {
            const itemCategory = item.category
              ? item.category.toLowerCase().trim()
              : "";
            return (
              itemCategory === targetCategory ||
              itemCategory.includes(targetCategory)
            );
          });

          setProducts(matches);
        } else {
          setProducts(data);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to connect to store. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (params?.category) fetchAndFilter();
  }, [params?.category]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
        <p className="text-black font-bold">
          Loading {params?.category}...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="font-serif font-bold uppercase text-lg tracking-widest text-black">
            Shubh Creations
          </h1>
        </Link>
        <Link href="/cart">
          <button className="bg-black text-white px-4 py-2 rounded-full text-sm">
            Bag ({cart.length})
          </button>
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-serif capitalize mb-2 text-black">
          {decodeURIComponent(params.category)}
        </h1>
        <p className="text-gray-500 mb-10">
          {products.length} Items Available
        </p>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl text-gray-400">
              No items found in this category.
            </h3>
            <Link href="/" className="text-black underline mt-4 block">
              Return Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((item) => (
              <div key={item._id} className="group">
                <Link href={`/product/${item._id}`}>
                  <div className="relative h-96 w-full overflow-hidden bg-gray-100">
                    {item.image && (
                      <img
                        src={urlFor(item.image).width(600).url()}
                        alt={item.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                      />
                    )}
                  </div>
                </Link>

                <div className="mt-4">
                  <h4 className="font-serif text-lg text-black">
                    {item.name}
                  </h4>
                  <p className="font-bold text-black mt-1">
                    ₹{item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
