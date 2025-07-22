import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);
  // @ts-expect-error: custom user object
  if (!session?.user?.isAdmin) {
    return <div className="p-8 text-center text-red-500">Access denied.</div>;
  }

  async function createProduct(formData: FormData) {
    "use server";
    const prisma = new PrismaClient();
    await prisma.product.create({
      data: {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        imageUrl: formData.get("imageUrl") as string,
        active: formData.get("active") === "on",
      },
    });
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form action={createProduct} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Product</h1>
        <input name="name" placeholder="Name" className="w-full mb-4 p-2 border rounded" required />
        <textarea name="description" placeholder="Description" className="w-full mb-4 p-2 border rounded" />
        <input name="price" type="number" placeholder="Price (cents)" className="w-full mb-4 p-2 border rounded" required min="0" />
        <input name="imageUrl" placeholder="Image URL" className="w-full mb-4 p-2 border rounded" />
        <label className="flex items-center mb-4">
          <input name="active" type="checkbox" className="mr-2" defaultChecked /> Active
        </label>
        <button type="submit" className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-800 transition">Add Product</button>
      </form>
    </div>
  );
} 