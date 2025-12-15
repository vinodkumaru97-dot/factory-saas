import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  message
} from "antd";
import api from "../../api/axiosClient";

interface UserRow {
  user_id: number;
  username: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function UsersPage() {
  const [data, setData] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setData(res.data);
    } catch (e) {
      console.error(e);
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  const openEdit = (user: UserRow) => {
    setEditing(user);
    form.setFieldsValue({
      role: user.role,
      is_active: user.is_active
    });
    setModalVisible(true);
  };

  const handleDelete = async (user: UserRow) => {
    try {
      await api.delete(`/users/${user.user_id}`);
      message.success("User deleted");
      fetchUsers();
    } catch {
      message.error("Delete failed");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await api.put(`/users/${editing.user_id}`, {
          role: values.role,
          is_active: values.is_active,
          password: values.password || undefined
        });
        message.success("User updated");
      } else {
        await api.post("/users", {
          username: values.username,
          password: values.password,
          role: values.role,
          is_active: values.is_active
        });
        message.success("User created");
      }
      setModalVisible(false);
      fetchUsers();
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error("Save failed");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "user_id" },
    { title: "Username", dataIndex: "username" },
    {
      title: "Role",
      dataIndex: "role",
      render: (r: string) => <Tag color={r === "OWNER" ? "gold" : "blue"}>{r}</Tag>
    },
    {
      title: "Active",
      dataIndex: "is_active",
      render: (v: boolean) => (v ? "Yes" : "No")
    },
    { title: "Created At", dataIndex: "created_at" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: UserRow) => (
        <Space>
          <Button size="small" onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Button
            danger
            size="small"
            onClick={() => handleDelete(record)}
            disabled={record.username === "admin"}
          >
            Delete
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Space
        style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}
      >
        <h2 style={{ margin: 0 }}>Users</h2>
        <Button type="primary" onClick={openCreate}>
          Add User
        </Button>
      </Space>
      <Table<UserRow>
        size="small"
        rowKey="user_id"
        loading={loading}
        columns={columns as any}
        dataSource={data}
      />

      <Modal
        open={modalVisible}
        title={editing ? "Edit User" : "Add User"}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          {!editing && (
            <>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: "Username is required" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 6, message: "Minimum 6 characters" }
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}
          {editing && (
            <Form.Item
              name="password"
              label="New Password"
              tooltip="Leave blank to keep existing password"
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Role is required" }]}
          >
            <Select
              options={[
                { value: "OWNER", label: "OWNER" },
                { value: "MANAGER", label: "MANAGER" },
                { value: "OPERATOR", label: "OPERATOR" }
              ]}
            />
          </Form.Item>
          <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}


