import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  DatabaseOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  LogoutOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";

const { Header, Sider, Content } = Layout;

export default function MainLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { logout } = useAuth();

  const selectedKey = location.pathname;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div
          style={{
            height: 64,
            color: "white",
            textAlign: "center",
            lineHeight: "64px",
            fontWeight: 600,
            fontSize: 18
          }}
        >
          Factory SaaS
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]}>
          <Menu.Item key="/" icon={<DashboardOutlined />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.SubMenu
            key="/masters"
            icon={<DatabaseOutlined />}
            title="Masters"
          >
            <Menu.Item key="/users" icon={<UserOutlined />}>
              <Link to="/users">Users</Link>
            </Menu.Item>
            <Menu.Item key="/raw-materials">
              <Link to="/raw-materials">Raw Materials</Link>
            </Menu.Item>
            <Menu.Item key="/products">
              <Link to="/products">Products</Link>
            </Menu.Item>
            <Menu.Item key="/customers">
              <Link to="/customers">Customers</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="/production"
            icon={<ShoppingCartOutlined />}
            title="Production"
          >
            <Menu.Item key="/batches">
              <Link to="/batches">Batch Creation</Link>
            </Menu.Item>
            <Menu.Item key="/packing">
              <Link to="/packing">Packing</Link>
            </Menu.Item>
            <Menu.Item key="/dispatches">
              <Link to="/dispatches">Dispatch</Link>
            </Menu.Item>
            <Menu.Item key="/returns">
              <Link to="/returns">Returns</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="/sales"
            icon={<ShoppingCartOutlined />}
            title="Sales"
          >
            <Menu.Item key="/orders">
              <Link to="/orders">Orders</Link>
            </Menu.Item>
            <Menu.Item key="/invoices">
              <Link to="/invoices">Invoices</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="/reports"
            icon={<BarChartOutlined />}
            title="Reports"
          >
            <Menu.Item key="/reports/raw-material-stock">
              <Link to="/reports/raw-material-stock">RM Stock</Link>
            </Menu.Item>
            <Menu.Item key="/reports/fg-stock">
              <Link to="/reports/fg-stock">FG Stock</Link>
            </Menu.Item>
            <Menu.Item key="/reports/batch-yield">
              <Link to="/reports/batch-yield">Batch Yield</Link>
            </Menu.Item>
            <Menu.Item key="/reports/sales-summary">
              <Link to="/reports/sales-summary">Sales Summary</Link>
            </Menu.Item>
            <Menu.Item key="/reports/expiry-returns">
              <Link to="/reports/expiry-returns">Expiry & Returns</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            onClick={() => logout()}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end"
          }}
        ></Header>
        <Content style={{ margin: "16px" }}>
          <div
            style={{
              padding: 16,
              minHeight: "calc(100vh - 128px)",
              background: "#fff",
              borderRadius: 8
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}


