"use client";
import Image from "next/image";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { useState } from "react";

export default async function Home() {
  const prisma = new PrismaClient();
  const products = await prisma.product.findMany({ where: { active: true } });

  // Move the logo/animation logic to a client component
  function LogoWithAnimation() {
    const [hovered, setHovered] = useState(false);
    return (
      <Link href="/" className="mb-2" aria-label="Home"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: "block", width: 80, height: 80 }}
      >
        {hovered ? (
          <video
            src="/animation1.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <Image src="/ptl-logo.png" alt="Push The Limits Logo" width={80} height={80} priority />
        )}
      </Link>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header with home button logo and social links */}
      <header className="flex flex-col items-center py-4 border-b w-full">
        <LogoWithAnimation />
        <div className="flex gap-4 mt-2">
          <Link href="https://www.youtube.com/@pushthelimitsmedia" target="_blank" rel="noopener noreferrer">
            <Image src="/yt.svg" alt="YouTube" width={32} height={32} />
          </Link>
          <Link href="https://www.instagram.com/pushthelimitsmedia" target="_blank" rel="noopener noreferrer">
            <Image src="/ig.svg" alt="Instagram" width={32} height={32} />
          </Link>
          <Link href="https://www.facebook.com/pushthelimitsmedia" target="_blank" rel="noopener noreferrer">
            <Image src="/fb.svg" alt="Facebook" width={32} height={32} />
          </Link>
        </div>
      </header>
      {/* Banner */}
      <div className="w-full">
        <Image src="/ptl-banner.jpg" alt="Push The Limits Banner" width={1920} height={400} className="w-full object-cover" priority />
      </div>
      {/* Product grid */}
      <main className="flex-1 p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto w-full">
        {products.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No merch available yet. Check back soon!</div>
        )}
        {products.map((product: any) => (
          <div key={product.id} className="border rounded-lg shadow-sm p-4 flex flex-col items-center bg-white">
            {product.imageUrl && (
              <Image src={product.imageUrl} alt={product.name} width={200} height={200} className="mb-4 object-contain" />
            )}
            <h2 className="text-lg font-semibold mb-2 text-center">{product.name}</h2>
            <p className="text-gray-600 mb-2 text-center">{product.description}</p>
            <div className="text-xl font-bold mb-4">${(product.price / 100).toFixed(2)}</div>
            <form action={`/api/cart/add`} method="POST" className="w-full flex flex-col items-center">
              <input type="hidden" name="productId" value={product.id} />
              <button type="submit" className="bg-black text-white px-4 py-2 rounded font-semibold hover:bg-gray-800 transition w-full">Add to Cart</button>
            </form>
          </div>
        ))}
      </main>
      {/* Footer with social links */}
      <footer className="py-6 border-t flex flex-col items-center gap-2">
        <div className="flex gap-4">
          <Link href="https://www.youtube.com/@pushthelimitsmedia" target="_blank" rel="noopener noreferrer">
            <Image src="/yt.svg" alt="YouTube" width={24} height={24} />
          </Link>
          <Link href="https://www.instagram.com/pushthelimitsmedia" target="_blank" rel="noopener noreferrer">
            <Image src="/ig.svg" alt="Instagram" width={24} height={24} />
          </Link>
          <Link href="https://www.facebook.com/pushthelimitsmedia" target="_blank" rel="noopener noreferrer">
            <Image src="/fb.svg" alt="Facebook" width={24} height={24} />
          </Link>
        </div>
        <div className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Push The Limits Media</div>
      </footer>
    </div>
  );
}
