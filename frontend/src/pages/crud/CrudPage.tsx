import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Space, Table, message } from "antd";
import api from "../../api/axiosClient";

export interface CrudField {
  name: string;
  label: string;
  input?: "text" | "number";
}

export interface CrudConfig {
  title: string;
  apiBase: string;
  columns: { key: string; title: string }[];
  fields: CrudField[];
  idField: string;
}

export default function CrudPage({ config }: { config: CrudConfig }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(config.apiBase);
      setData(res.data.items || res.data);
    } catch (e) {
      console.error(e);
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [config.apiBase]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (record: any) => {
    try {
      await api.delete(`${config.apiBase}/${record[config.idField]}`);
      message.success("Deleted");
      fetchData();
    } catch {
      message.error("Delete failed");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await api.put(
          `${config.apiBase}/${editing[config.idField]}`,
          values
        );
        message.success("Updated");
      } else {
        await api.post(config.apiBase, values);
        message.success("Created");
      }
      setModalVisible(false);
      fetchData();
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error("Save failed");
    }
  };

  const columns = [
    ...config.columns.map((c) => ({
      title: c.title,
      dataIndex: c.key,
      key: c.key
    })),
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Button danger size="small" onClick={() => handleDelete(record)}>
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
        <h2 style={{ margin: 0 }}>{config.title}</h2>
        <Button type="primary" onClick={openCreate}>
          Add
        </Button>
      </Space>

      <Table
        rowKey={config.idField}
        loading={loading}
        columns={columns as any}
        dataSource={data}
        size="small"
        pagination={{ pageSize: 20 }}
        scroll={{ x: true }}
      />

      <Modal
        open={modalVisible}
        title={editing ? "Edit" : "Add"}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        destroyOnClose
      >
        <Form layout="vertical" form={form}>
          {config.fields.map((f) => (
            <Form.Item key={f.name} name={f.name} label={f.label}>
              <Input type={f.input === "number" ? "number" : "text"} />
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </div>
  );
}


