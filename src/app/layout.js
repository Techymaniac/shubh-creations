import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css"; // <--- THIS IS CRITICAL. IF MISSING, STYLES FAIL.
import { CartProvider } from "../context/CartContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair" 
});

export const metadata = {
  title: "Shubh Creations",
  description: "Elegance is an Attitude $$",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-white text-black`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}