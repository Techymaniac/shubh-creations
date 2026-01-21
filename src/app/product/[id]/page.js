"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "../../../sanity/client";
import { useCart } from "../../../context/CartContext";

export default function ProductPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [videoFailed, setVideoFailed] = useState(false);

  const { addToCart, cart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const query = `
        *[_type == "product" && _id == "${productId}"][0]{
          ...,
          "videoUrl": video.asset->url
        }
      `;
      const data = await client.fetch(query);
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

  if (loading)
    return <div className="text-center py-20 text-black">Loading details...</div>;

  if (!product)
    return <div className="text-center py-20 text-black">Product not found</div>;

  const hasSizes = product.category === "dresses";

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) {
      alert("Please select a size first!");
      return;
    }
    addToCart(product, hasSizes ? selectedSize : "One Size");
  };

  return (
    <main className="min-h-screen bg-white">
      <nav className="p-4 flex justify-between items-center sticky top-0 bg-white z-50 border-b border-gray-100">
        <Link href="/" className="font-serif font-bold uppercase tracking-widest text-black">
          Shubh Creations
        </Link>
        <Link href="/cart">
          <button className="bg-black text-white px-5 py-2 rounded-full text-sm">
            Bag ({cart.length})
          </button>
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
        <div className="relative h-[500px] md:h-[600px] bg-gray-100 rounded-lg overflow-hidden">
          {product.videoUrl && !videoFailed ? (
            <video
              src={product.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-contain bg-black
"
              onError={() => setVideoFailed(true)}
            />
          ) : (
            product.image && (
              <Image
                src={urlFor(product.image).url()}
                alt={product.name}
                fill
                className="object-contain bg-black
"
              />
            )
          )}
        </div>

        <div className="flex flex-col justify-center">
          <p className="uppercase tracking-widest text-sm text-gray-400 mb-2">
            {product.category}
          </p>

          <h1 className="text-4xl md:text-5xl font-serif mb-6 text-black leading-tight">
            {product.name}
          </h1>

          <p className="text-3xl font-medium text-black mb-8">
            ₹{product.price}
          </p>

          {hasSizes && (
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wide text-black mb-3">
                Select Size
              </h3>
              <div className="flex gap-3">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 border flex items-center justify-center transition-all text-sm font-medium ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-5 uppercase tracking-widest font-bold text-sm hover:bg-gray-800 transition-all"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </main>
  );
}
