import CrudPage from "../crud/CrudPage";

export default function CustomersPage() {
  return (
    <CrudPage
      config={{
        title: "Customers",
        apiBase: "/crud/customers",
        idField: "customer_id",
        columns: [
          { key: "customer_id", title: "ID" },
          { key: "customer_name", title: "Name" },
          { key: "type", title: "Type" },
          { key: "contact_no", title: "Contact" },
          { key: "whatsapp_no", title: "WhatsApp" }
        ],
        fields: [
          { name: "customer_name", label: "Name" },
          { name: "type", label: "Type" },
          { name: "contact_no", label: "Contact No" },
          { name: "whatsapp_no", label: "WhatsApp No" },
          { name: "email", label: "Email" },
          { name: "address", label: "Address" },
          { name: "gstin", label: "GSTIN" },
          { name: "remarks", label: "Remarks" }
        ]
      }}
    />
  );
}


