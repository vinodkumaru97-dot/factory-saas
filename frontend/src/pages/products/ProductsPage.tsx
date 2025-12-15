import CrudPage from "../crud/CrudPage";

export default function ProductsPage() {
  return (
    <CrudPage
      config={{
        title: "Products",
        apiBase: "/crud/products",
        idField: "product_id",
        columns: [
          { key: "product_id", title: "ID" },
          { key: "product_name", title: "Name" },
          { key: "category", title: "Category" },
          { key: "default_unit", title: "Default Unit" },
          { key: "shelf_life_days", title: "Shelf Life (days)" }
        ],
        fields: [
          { name: "product_name", label: "Name" },
          { name: "category", label: "Category" },
          { name: "default_unit", label: "Default Unit" },
          { name: "hsn_code", label: "HSN Code" },
          { name: "shelf_life_days", label: "Shelf Life (days)", input: "number" }
        ]
      }}
    />
  );
}


