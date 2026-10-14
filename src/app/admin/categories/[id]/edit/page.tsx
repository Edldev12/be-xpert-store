
import { Suspense } from "react";
import EditCategoryForm from "./EditCategoryForm";


export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = Number(id);

  return (
    <Suspense fallback={<p className="p-6">Loading edit form...</p>}>
      <EditCategoryForm categoryId={categoryId} />
    </Suspense>
  );
}
