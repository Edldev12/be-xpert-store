import { Suspense } from "react";
import EditCategoryForm from "./EditCategoryForm";

async function EditCategoryContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = Number(id);

  return <EditCategoryForm categoryId={categoryId} />;
}

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={<p className="p-6">Loading edit form...</p>}
    >
      <EditCategoryContent params={params} />
    </Suspense>
  );
}