import { useEffect, useState } from "react";
import { Card, Tabs, Table } from "antd";
import api from "../../api/axiosClient";

export default function ExpiryReturnsReportPage() {
  const [data, setData] = useState<{ returns: any[]; expired_batches: any[] }>({
    returns: [],
    expired_batches: []
  });

  useEffect(() => {
    (async () => {
      const res = await api.get("/reports/expiry-returns");
      setData(res.data);
    })();
  }, []);

  return (
    <Card title="Expiry & Returns">
      <Tabs
        items={[
          {
            key: "returns",
            label: "Returns",
            children: (
              <Table
                size="small"
                rowKey="return_id"
                dataSource={data.returns}
                columns={[
                  { title: "Date", dataIndex: "return_date" },
                  { title: "Product", dataIndex: "product_name" },
                  { title: "Pack Size", dataIndex: "pack_size" },
                  { title: "Unit", dataIndex: "pack_unit" },
                  { title: "Qty Packs", dataIndex: "qty_packs" },
                  { title: "Reason", dataIndex: "reason" },
                  {
                    title: "Adjusted in Stock",
                    dataIndex: "adjusted_in_stock",
                    render: (v) => (v ? "Yes" : "No")
                  }
                ]}
              />
            )
          },
          {
            key: "expired",
            label: "Expired Batches",
            children: (
              <Table
                size="small"
                rowKey="batch_id"
                dataSource={data.expired_batches}
                columns={[
                  { title: "Batch Code", dataIndex: "batch_code" },
                  { title: "Product", dataIndex: "product_name" },
                  { title: "Batch Date", dataIndex: "batch_date" },
                  { title: "Expiry Date", dataIndex: "expiry_date" }
                ]}
              />
            )
          }
        ]}
      />
    </Card>
  );
}


