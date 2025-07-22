"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    setCart(stored ? JSON.parse(stored) : []);
  }, []);

  const updateQuantity = (id: string, qty: number) => {
    const updated = cart.map(item => item.id === id ? { ...item, quantity: qty } : item);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id: string) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="text-gray-500">Your cart is empty. <Link href="/">Go shopping</Link></div>
      ) : (
        <div className="w-full max-w-2xl">
          {cart.map(item => (
            <div key={item.id} className="flex items-center border-b py-4 gap-4">
              {item.imageUrl && <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="object-contain" />}
              <div className="flex-1">
                <div className="font-semibold">{item.name}</div>
                <div className="text-gray-600">${(item.price / 100).toFixed(2)}</div>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => updateQuantity(item.id, Number(e.target.value))}
                  className="border rounded px-2 py-1 w-16 mt-2"
                />
                <button onClick={() => removeItem(item.id)} className="ml-4 text-red-600 hover:underline">Remove</button>
              </div>
            </div>
          ))}
          <div className="text-right font-bold text-xl mt-6">Total: ${(total / 100).toFixed(2)}</div>
          <form action="/api/checkout" method="POST" className="mt-8 flex justify-end">
            <input type="hidden" name="cart" value={JSON.stringify(cart)} />
            <button type="submit" className="bg-black text-white px-6 py-2 rounded font-semibold hover:bg-gray-800 transition">Checkout</button>
          </form>
        </div>
      )}
    </div>
  );
} 