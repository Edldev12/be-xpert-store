import { Suspense } from "react";
import EditProductForm from "./EditProductForm";
export const instant = false;
export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);

  return (
    <Suspense fallback={<p className="p-6">Loading edit form...</p>}>
      <EditProductForm productId={productId} />
    </Suspense>
  );
}