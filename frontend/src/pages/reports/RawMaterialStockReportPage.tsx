import { useEffect, useState } from "react";
import { Table, Card } from "antd";
import api from "../../api/axiosClient";

export default function RawMaterialStockReportPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await api.get("/reports/raw-material-stock");
      setData(res.data);
    })();
  }, []);

  return (
    <Card title="Raw Material Stock">
      <Table
        size="small"
        rowKey="rm_id"
        dataSource={data}
        columns={[
          { title: "RM ID", dataIndex: "rm_id" },
          { title: "Name", dataIndex: "rm_name" },
          { title: "Unit", dataIndex: "unit" },
          { title: "Balance Qty", dataIndex: "balance_qty" },
          { title: "Min Stock", dataIndex: "min_stock_qty" }
        ]}
      />
    </Card>
  );
}


