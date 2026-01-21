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
  const categoryKey = params?.category?.toLowerCase();
  const heroImage = CATEGORY_IMAGES[categoryKey];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart } = useCart();

  useEffect(() => {
    const fetchAndFilter = async () => {
      // UPDATED QUERY: Fetches existing data + the new videoUrl
      const query = `*[_type == "product"]{
        ...,
        "videoUrl": animation.asset->url
      }`;
      
      const data = await client.fetch(query);

      const matches = data.filter((item) => {
        const itemCategory = item.category
          ? item.category.toLowerCase().trim()
          : "";
        return itemCategory === categoryKey;
      });

      setProducts(matches);
      setLoading(false);
    };

    if (categoryKey) fetchAndFilter();
  }, [categoryKey]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black">
        Loading {params.category}...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="font-serif font-bold uppercase tracking-widest text-black">
            Shubh Creations
          </h1>
        </Link>
        <Link href="/cart">
          <button className="bg-black text-white px-4 py-2 rounded-full text-sm">
            Bag ({cart.length})
          </button>
        </Link>
      </nav>

      {/* CATEGORY HERO */}
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

      {/* PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        {products.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            No items found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((item) => (
              <div key={item._id} className="group">
                <Link href={`/product/${item._id}`}>
                  <div className="relative h-96 w-full overflow-hidden bg-gray-100">
                    {/* --- HYBRID PLAYER LOGIC --- */}
                    {item.videoUrl ? (
                      // If video exists: Play it, but use image as poster
                      <video
                        src={item.videoUrl}
                        poster={item.image ? urlFor(item.image).width(600).url() : ""}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      // Fallback: Just show image
                      item.image && (
                        <img
                          src={urlFor(item.image).width(600).url()}
                          alt={item.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                        />
                      )
                    )}
                    {/* --------------------------- */}
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