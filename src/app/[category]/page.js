"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { client, urlFor } from "../../sanity/client";
import { useCart } from "../../context/CartContext";

const CATEGORY_IMAGES = {
  jewellery:
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop",
  dresses:
    "https://images.unsplash.com/photo-1520975922284-9f1e9f9e0b99?q=80&w=1600&auto=format&fit=crop",
  bags:
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600&auto=format&fit=crop",
};

export default function CategoryPage() {
  const params = useParams();
  const normalizedCategory = params?.category?.toLowerCase();
  const heroImage = CATEGORY_IMAGES[normalizedCategory];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart } = useCart();

  useEffect(() => {
    if (!normalizedCategory) return;

    const fetchProducts = async () => {
      const data = await client.fetch(
        '*[_type == "product" && category == $cat]{ ..., "videoUrl": video.asset->url }',
        { cat: normalizedCategory }
      );
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, [normalizedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black">
        Loading {params.category}...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
        <Link href="/" className="font-serif font-bold uppercase tracking-widest text-black">
          Shubh Creations
        </Link>
        <Link href="/cart">
          <button className="bg-black text-white px-4 py-2 rounded-full text-sm">
            Bag ({cart.length})
          </button>
        </Link>
      </nav>

      {heroImage && (
        <section
          className="relative h-[45vh] bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-white/65"></div>
          <h1 className="relative text-5xl font-serif capitalize text-black">
            {params.category}
          </h1>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-6 py-14">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-serif text-gray-400 mb-2">
              No items found
            </h3>
            <p className="text-sm text-gray-500">
              0 items available in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((item) => (
              <div key={item._id} className="group">
                <Link href={`/product/${item._id}`}>
                  <div className="relative h-96 w-full overflow-hidden bg-gray-100">
                    {item.videoUrl ? (
                      <video
                        src={item.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-contain bg-black
 group-hover:scale-105 transition duration-500"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    ) : (
                      item.image && (
                        <img
                          src={urlFor(item.image).width(600).url()}
                          alt={item.name}
                          className="w-full h-full object-contain bg-black
 group-hover:scale-105 transition duration-500"
                        />
                      )
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
