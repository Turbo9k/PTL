import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  // @ts-expect-error: custom user object
  if (!session?.user?.isAdmin) {
    return <div className="p-8 text-center text-red-500">Access denied.</div>;
  }
  const prisma = new PrismaClient();
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return <div className="p-8 text-center text-red-500">Product not found.</div>;

  async function deleteProduct() {
    "use server";
    await prisma.product.delete({ where: { id: params.id } });
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">Delete Product</h1>
        <p className="mb-4">Are you sure you want to delete <span className="font-semibold">{product.name}</span>?</p>
        <form action={deleteProduct}>
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-800 transition">Delete</button>
        </form>
        <a href="/admin/dashboard" className="block mt-4 text-blue-600 hover:underline">Cancel</a>
      </div>
    </div>
  );
} 