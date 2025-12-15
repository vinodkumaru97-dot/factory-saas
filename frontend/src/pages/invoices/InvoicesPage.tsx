import CrudPage from "../crud/CrudPage";

export default function InvoicesPage() {
  return (
    <CrudPage
      config={{
        title: "Invoices",
        apiBase: "/crud/invoices",
        idField: "invoice_id",
        columns: [
          { key: "invoice_id", title: "ID" },
          { key: "invoice_no", title: "Invoice No" },
          { key: "invoice_date", title: "Date" },
          { key: "customer_id", title: "Customer ID" },
          { key: "gross_total", title: "Gross" },
          { key: "net_amount", title: "Net" },
          { key: "payment_status", title: "Payment Status" }
        ],
        fields: [
          { name: "invoice_no", label: "Invoice No" },
          { name: "invoice_date", label: "Invoice Date" },
          { name: "customer_id", label: "Customer ID", input: "number" },
          { name: "order_id", label: "Order ID", input: "number" },
          { name: "gross_total", label: "Gross Total", input: "number" },
          { name: "discount", label: "Discount", input: "number" },
          { name: "tax_percent", label: "Tax %", input: "number" },
          { name: "tax_amount", label: "Tax Amount", input: "number" },
          { name: "net_amount", label: "Net Amount", input: "number" },
          { name: "payment_status", label: "Payment Status" },
          { name: "payment_mode", label: "Payment Mode" },
          { name: "remarks", label: "Remarks" }
        ]
      }}
    />
  );
}


