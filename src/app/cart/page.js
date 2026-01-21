"use client";
import { useCart } from "../../context/CartContext";
import { urlFor } from "../../sanity/client";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  const totalAmount = cart.reduce((total, item) => total + item.price, 0);

  const handleCheckout = () => {
    const phoneNumber = "918369262534";

    let message = `*New Order Inquiry from Shubh Creations* 🛍️%0a%0a`;

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.selectedSize}) - ₹${item.price}%0a`;
    });

    message += `%0a*Total Estimate: ₹${totalAmount}*%0a`;
    message += `%0aIs this available? Please confirm shipping details.`;

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/">
            <h1 className="text-xl font-serif font-bold tracking-widest uppercase">
              Shubh Creations
            </h1>
          </Link>
          <Link href="/" className="text-sm underline text-gray-500 hover:text-black">
            Continue Shopping
          </Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto p-6 py-12">
        <h1 className="text-3xl font-serif mb-8">
          Your Inquiry Bag ({cart.length})
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl text-gray-400 mb-4">Your bag is empty</h2>
            <Link href="/">
              <button className="bg-black text-white px-8 py-3 uppercase tracking-widest text-sm hover:bg-gray-800 transition">
                Browse Collection
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {cart.map((item) => (
                <div
                  key={item.cartId}
                  className="flex gap-4 p-4 border-b border-gray-100 last:border-0 items-center"
                >
                  {/* MEDIA */}
                  <div className="relative w-20 h-24 bg-gray-100 rounded overflow-hidden">
                    {item.video?.asset ? (
                      <video
                        src={item.video.asset.url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      item.image && (
                        <Image
                          src={urlFor(item.image).url()}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )
                    )}
                  </div>

                  {/* DETAILS */}
                  <div className="flex-grow">
                    <h3 className="font-serif text-lg text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">
                      {item.category}
                    </p>
                    {item.selectedSize &&
                      item.selectedSize !== "One Size" && (
                        <p className="text-sm font-bold mt-1">
                          Size: {item.selectedSize}
                        </p>
                      )}
                  </div>

                  {/* PRICE */}
                  <div className="text-right">
                    <p className="font-bold">₹{item.price}</p>
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="text-xs text-red-500 underline hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between mb-6">
                <span className="text-gray-500">Estimated Total</span>
                <span className="text-2xl font-bold font-serif">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-green-700 transition"
              >
                Confirm Order via WhatsApp
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
