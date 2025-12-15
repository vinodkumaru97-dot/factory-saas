import { useEffect, useState } from "react";
import { Table, Card } from "antd";
import api from "../../api/axiosClient";

export default function FinishedGoodsStockReportPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await api.get("/reports/finished-goods-stock");
      setData(res.data);
    })();
  }, []);

  return (
    <Card title="Finished Goods Stock">
      <Table
        size="small"
        rowKey={(r) => `${r.product_id}-${r.pack_size}-${r.pack_unit}`}
        dataSource={data}
        columns={[
          { title: "Product", dataIndex: "product_name" },
          { title: "Pack Size", dataIndex: "pack_size" },
          { title: "Unit", dataIndex: "pack_unit" },
          { title: "Balance Packs", dataIndex: "balance_packs" }
        ]}
      />
    </Card>
  );
}


