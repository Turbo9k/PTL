import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  // @ts-expect-error: custom user object
  if (!session?.user?.isAdmin) {
    return <div className="p-8 text-center text-red-500">Access denied.</div>;
  }
  const prisma = new PrismaClient();
  const products = await prisma.product.findMany();
  const orders = await prisma.order.findMany({ include: { orderItems: { include: { product: true } }, user: true } });

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Products</h2>
          <Link href="/admin/products/new" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Add Product</Link>
        </div>
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Active</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id} className="border-t">
                <td className="p-2">{product.name}</td>
                <td className="p-2">${(product.price / 100).toFixed(2)}</td>
                <td className="p-2">{product.active ? "Yes" : "No"}</td>
                <td className="p-2 flex gap-2">
                  <Link href={`/admin/products/${product.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                  <Link href={`/admin/products/${product.id}/delete`} className="text-red-600 hover:underline">Delete</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Order ID</th>
              <th className="p-2">User</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
              <th className="p-2">Items</th>
              <th className="p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id} className="border-t">
                <td className="p-2">{order.id}</td>
                <td className="p-2">{order.user?.email || "Guest"}</td>
                <td className="p-2">${(order.total / 100).toFixed(2)}</td>
                <td className="p-2">{order.status}</td>
                <td className="p-2">
                  {order.orderItems.map((item: any) => (
                    <div key={item.id}>{item.product.name} x{item.quantity}</div>
                  ))}
                </td>
                <td className="p-2">{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 