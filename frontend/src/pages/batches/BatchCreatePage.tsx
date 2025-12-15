import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
  message
} from "antd";
import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import dayjs from "dayjs";

interface RawMaterial {
  rm_id: number;
  rm_name: string;
  unit: string;
}

interface RMRow {
  key: number;
}

export default function BatchCreatePage() {
  const [form] = Form.useForm();
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [rows, setRows] = useState<RMRow[]>([{ key: 1 }]);

  useEffect(() => {
    (async () => {
      const [rmRes, prodRes] = await Promise.all([
        api.get("/crud/raw-materials"),
        api.get("/crud/products")
      ]);
      setRawMaterials(rmRes.data.items || rmRes.data);
      setProducts(prodRes.data.items || prodRes.data);
    })();
  }, []);

  const addRow = () => {
    setRows((prev) => [...prev, { key: Date.now() }]);
  };

  const submit = async () => {
    try {
      const values = await form.validateFields();
      if (!rows.length) {
        message.error("Add at least one raw material");
        return;
      }
      const payload = {
        batch_code: values.batch_code,
        batch_date: values.batch_date.format("YYYY-MM-DD"),
        product_id: values.product_id,
        expected_output_qty: values.expected_output_qty,
        actual_output_qty: values.actual_output_qty,
        byproduct_qty: values.byproduct_qty,
        operator_name: values.operator_name,
        remarks: values.remarks,
        raw_materials: rows
          .map((_, idx) => ({
            rm_id: values[`rm_${idx}`],
            qty_used: values[`qty_${idx}`]
          }))
          .filter((r) => r.rm_id && r.qty_used)
      };
      if (!payload.raw_materials.length) {
        message.error("Add at least one raw material");
        return;
      }
      await api.post("/batches", payload);
      message.success("Batch created");
      form.resetFields();
      setRows([{ key: 1 }]);
    } catch {
      // validation or api error
    }
  };

  const columns = [
    {
      title: "Raw Material",
      dataIndex: "rm_id",
      render: (_: any, __: RMRow, idx: number) => (
        <Form.Item
          name={`rm_${idx}`}
          rules={[{ required: true, message: "Select raw material" }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            options={rawMaterials.map((r) => ({
              value: r.rm_id,
              label: `${r.rm_name} (${r.unit})`
            }))}
          />
        </Form.Item>
      )
    },
    {
      title: "Qty Used",
      dataIndex: "qty_used",
      render: (_: any, __: RMRow, idx: number) => (
        <Form.Item
          name={`qty_${idx}`}
          rules={[{ required: true, message: "Enter qty" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      )
    }
  ];

  return (
    <Card title="Batch Creation">
      <Form layout="vertical" form={form}>
        <Space style={{ width: "100%" }} wrap>
          <Form.Item
            label="Batch Code"
            name="batch_code"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Batch Date"
            name="batch_date"
            rules={[{ required: true }]}
            initialValue={dayjs()}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Product"
            name="product_id"
            rules={[{ required: true }]}
          >
            <Select
              options={products.map((p) => ({
                value: p.product_id,
                label: p.product_name
              }))}
            />
          </Form.Item>
        </Space>

        <Space style={{ width: "100%" }} wrap>
          <Form.Item label="Expected Output Qty" name="expected_output_qty">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Actual Output Qty" name="actual_output_qty">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Byproduct Qty" name="byproduct_qty">
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Operator" name="operator_name">
            <Input />
          </Form.Item>
        </Space>

        <Form.Item label="Remarks" name="remarks">
          <Input.TextArea rows={2} />
        </Form.Item>

        <h3>Raw Materials Used</h3>
        <Table
          columns={columns as any}
          dataSource={rows}
          rowKey="key"
          pagination={false}
        />
        <Button style={{ marginTop: 8 }} onClick={addRow}>
          Add Raw Material
        </Button>

        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={submit}>
            Save Batch
          </Button>
        </div>
      </Form>
    </Card>
  );
}


