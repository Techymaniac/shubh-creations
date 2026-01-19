import "./globals.css"; // Ensure this is the very first line
import { CartProvider } from "../context/CartContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black min-h-screen">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}