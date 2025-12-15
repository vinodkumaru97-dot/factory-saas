import { useEffect, useState } from "react";
import { Table, Card } from "antd";
import api from "../../api/axiosClient";

export default function BatchYieldReportPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await api.get("/reports/batch-yield");
      setData(res.data);
    })();
  }, []);

  return (
    <Card title="Batch Yield">
      <Table
        size="small"
        rowKey="batch_id"
        dataSource={data}
        columns={[
          { title: "Batch Code", dataIndex: "batch_code" },
          { title: "Date", dataIndex: "batch_date" },
          { title: "Product", dataIndex: "product_name" },
          { title: "Expected", dataIndex: "expected_output_qty" },
          { title: "Actual", dataIndex: "actual_output_qty" },
          { title: "Yield %", dataIndex: "yield_pct" }
        ]}
      />
    </Card>
  );
}


