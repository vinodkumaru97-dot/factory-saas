import CrudPage from "../crud/CrudPage";

export default function OrdersPage() {
  return (
    <CrudPage
      config={{
        title: "Orders",
        apiBase: "/crud/orders",
        idField: "order_id",
        columns: [
          { key: "order_id", title: "ID" },
          { key: "order_no", title: "Order No" },
          { key: "order_date", title: "Date" },
          { key: "order_channel", title: "Channel" },
          { key: "customer_id", title: "Customer ID" },
          { key: "status", title: "Status" },
          { key: "payment_status", title: "Payment Status" }
        ],
        fields: [
          { name: "order_no", label: "Order No" },
          { name: "order_date", label: "Order Date" },
          { name: "order_channel", label: "Channel" },
          { name: "customer_id", label: "Customer ID", input: "number" },
          { name: "status", label: "Status" },
          { name: "payment_status", label: "Payment Status" },
          { name: "remarks", label: "Remarks" }
        ]
      }}
    />
  );
}


