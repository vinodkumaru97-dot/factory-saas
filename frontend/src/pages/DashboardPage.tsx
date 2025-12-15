import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
import api from "../api/axiosClient";

export default function DashboardPage() {
  const [kpi, setKpi] = useState<any>({
    productsCount: 0,
    customersCount: 0,
    openOrders: 0,
    totalNetSales: 0
  });

  useEffect(() => {
    (async () => {
      const res = await api.get("/reports/kpis");
      setKpi(res.data);
    })();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="Products" value={kpi.productsCount} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="Customers" value={kpi.customersCount} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="Open Orders" value={kpi.openOrders} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic
              title="Total Net Sales"
              value={kpi.totalNetSales}
              precision={2}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}


