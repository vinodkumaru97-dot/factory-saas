import { useEffect, useState } from "react";
import { Card, DatePicker, Button, Space, Statistic } from "antd";
import api from "../../api/axiosClient";
import dayjs, { Dayjs } from "dayjs";

export default function SalesSummaryReportPage() {
  const [from, setFrom] = useState<Dayjs | null>(dayjs().startOf("month"));
  const [to, setTo] = useState<Dayjs | null>(dayjs());
  const [data, setData] = useState<any | null>(null);

  const load = async () => {
    const res = await api.get("/reports/sales-summary", {
      params: {
        from: from?.format("YYYY-MM-DD"),
        to: to?.format("YYYY-MM-DD")
      }
    });
    setData(res.data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card title="Sales Summary">
      <Space style={{ marginBottom: 16 }}>
        <DatePicker value={from} onChange={setFrom} />
        <DatePicker value={to} onChange={setTo} />
        <Button type="primary" onClick={load}>
          Refresh
        </Button>
      </Space>

      {data && (
        <Space wrap>
          <Statistic title="Invoices" value={data.totalInvoices} />
          <Statistic title="Gross Total" value={data.totalGross} precision={2} />
          <Statistic title="Net Total" value={data.totalNet} precision={2} />
          <Statistic title="Tax Amount" value={data.totalTax} precision={2} />
        </Space>
      )}
    </Card>
  );
}


