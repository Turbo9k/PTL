export function generateStaticParams() { return []; }
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

  async function updateProduct(formData: FormData) {
    "use server";
    await prisma.product.update({
      where: { id: params.id },
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
      <form action={updateProduct} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Product</h1>
        <input name="name" defaultValue={product.name} placeholder="Name" className="w-full mb-4 p-2 border rounded" required />
        <textarea name="description" defaultValue={product.description || ""} placeholder="Description" className="w-full mb-4 p-2 border rounded" />
        <input name="price" type="number" defaultValue={product.price} placeholder="Price (cents)" className="w-full mb-4 p-2 border rounded" required min="0" />
        <input name="imageUrl" defaultValue={product.imageUrl || ""} placeholder="Image URL" className="w-full mb-4 p-2 border rounded" />
        <label className="flex items-center mb-4">
          <input name="active" type="checkbox" className="mr-2" defaultChecked={product.active} /> Active
        </label>
        <button type="submit" className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-800 transition">Save Changes</button>
      </form>
    </div>
  );
} 