import { Button, Card, Form, Input, Typography, message } from "antd";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      await login(values.username, values.password);
      navigate("/");
    } catch {
      message.error("Invalid username or password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, rgba(255,165,0,0.1), rgba(255,215,0,0.1))"
      }}
    >
      <Card
        style={{ width: 360, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
        bordered={false}
      >
        <Typography.Title level={3} style={{ textAlign: "center" }}>
          Factory SaaS Login
        </Typography.Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true }]}
          >
            <Input placeholder="owner" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="owner123" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}


