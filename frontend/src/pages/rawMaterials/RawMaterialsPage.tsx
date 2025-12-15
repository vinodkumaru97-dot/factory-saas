import CrudPage from "../crud/CrudPage";

export default function RawMaterialsPage() {
  return (
    <CrudPage
      config={{
        title: "Raw Materials",
        apiBase: "/crud/raw-materials",
        idField: "rm_id",
        columns: [
          { key: "rm_id", title: "ID" },
          { key: "rm_name", title: "Name" },
          { key: "category", title: "Category" },
          { key: "unit", title: "Unit" },
          { key: "min_stock_qty", title: "Min Stock" }
        ],
        fields: [
          { name: "rm_name", label: "Name" },
          { name: "category", label: "Category" },
          { name: "unit", label: "Unit" },
          { name: "min_stock_qty", label: "Min Stock Qty", input: "number" },
          { name: "notes", label: "Notes" }
        ]
      }}
    />
  );
}


