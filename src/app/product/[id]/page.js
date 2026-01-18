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
  
  const { addToCart, cart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      // Query: Find the specific product with this ID
      const query = `*[_type == "product" && _id == "${productId}"][0]`;
      const data = await client.fetch(query);
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

  if (loading) return <div className="text-center py-20">Loading details...</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  // Logic: Only dresses need size selection
  const hasSizes = product.category === "dresses";

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) {
      alert("Please select a size first!");
      return;
    }
    // If it's a bag/jewellery, we default to "One Size"
    const finalSize = hasSizes ? selectedSize : "One Size";
    
    addToCart(product, finalSize);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar (Minimal) */}
      <nav className="p-4 flex justify-between items-center sticky top-0 bg-white z-50 shadow-sm">
        <Link href="/">
          <h1 className="text-xl font-serif font-bold uppercase tracking-widest">Shubh Creations</h1>
        </Link>
        <Link href="/cart">
            <button className="bg-black text-white px-5 py-2 rounded-full text-sm">
                Bag ({cart.length})
            </button>
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
        
        {/* LEFT: Product Image */}
        <div className="relative h-[500px] md:h-[600px] bg-gray-100 rounded-lg overflow-hidden">
          {product.image && (
            <Image 
              src={urlFor(product.image).url()} 
              alt={product.name} 
              fill 
              className="object-cover"
            />
          )}
        </div>

        {/* RIGHT: Product Details */}
        <div className="flex flex-col justify-center">
          <Link href={`/${product.category}`} className="text-sm text-gray-500 hover:text-black mb-6 inline-flex items-center">
             ← Back to {product.category}
          </Link>

          <p className="uppercase tracking-widest text-sm text-gray-400 mb-2">{product.category}</p>
          <h1 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900 leading-tight">{product.name}</h1>
          <p className="text-3xl font-medium text-gray-900 mb-8">₹{product.price}</p>

          {/* Size Selector (Only shows for Dresses) */}
          {hasSizes && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wide">Select Size</h3>
                <span className="text-xs text-gray-500 underline cursor-pointer">Size Guide</span>
              </div>
              
              <div className="flex gap-3">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 border flex items-center justify-center transition-all text-sm font-medium
                      ${selectedSize === size 
                        ? "bg-black text-white border-black shadow-md" 
                        : "bg-white text-gray-600 border-gray-200 hover:border-black"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && <p className="text-red-500 text-xs mt-2">Please select a size</p>}
            </div>
          )}

          {/* Action Button */}
          <button 
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-5 uppercase tracking-widest font-bold text-sm hover:bg-gray-800 transition-all shadow-lg active:scale-95"
          >
            Add to Bag
          </button>
          
          <div className="mt-8 space-y-2 text-sm text-gray-500">
            <p>✓ Premium Quality Material</p>
            <p>✓ Free Shipping on orders above ₹5000</p>
            <p>✓ Secure Checkout via WhatsApp</p>
          </div>
        </div>
      </div>
    </main>
  );
}