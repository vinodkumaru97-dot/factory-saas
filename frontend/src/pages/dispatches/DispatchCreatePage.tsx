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

interface Row {
  key: number;
}

export default function DispatchCreatePage() {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [rows, setRows] = useState<Row[]>([{ key: 1 }]);

  useEffect(() => {
    (async () => {
      const [custRes, prodRes] = await Promise.all([
        api.get("/crud/customers"),
        api.get("/crud/products")
      ]);
      setCustomers(custRes.data.items || custRes.data);
      setProducts(prodRes.data.items || prodRes.data);
    })();
  }, []);

  const addRow = () => setRows((r) => [...r, { key: Date.now() }]);

  const submit = async () => {
    try {
      const v = await form.validateFields();
      const items = rows
        .map((_, idx) => ({
          product_id: v[`product_${idx}`],
          pack_size: v[`pack_size_${idx}`],
          pack_unit: v[`pack_unit_${idx}`],
          qty_packs: v[`qty_${idx}`]
        }))
        .filter((i) => i.product_id && i.qty_packs);
      if (!items.length) {
        message.error("Add at least one line item");
        return;
      }
      await api.post("/dispatches", {
        dispatch_no: v.dispatch_no,
        dispatch_date: v.dispatch_date.format("YYYY-MM-DD"),
        order_id: v.order_id,
        customer_id: v.customer_id,
        transport_details: v.transport_details,
        status: v.status,
        remarks: v.remarks,
        items
      });
      message.success("Dispatch saved");
      form.resetFields();
      setRows([{ key: 1 }]);
    } catch {
      // ignore
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "product_id",
      render: (_: any, __: Row, idx: number) => (
        <Form.Item
          name={`product_${idx}`}
          rules={[{ required: true, message: "Select product" }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            options={products.map((p) => ({
              value: p.product_id,
              label: p.product_name
            }))}
          />
        </Form.Item>
      )
    },
    {
      title: "Pack Size",
      dataIndex: "pack_size",
      render: (_: any, __: Row, idx: number) => (
        <Form.Item
          name={`pack_size_${idx}`}
          rules={[{ required: true, message: "Enter size" }]}
        >
          <InputNumber min={0} />
        </Form.Item>
      )
    },
    {
      title: "Unit",
      dataIndex: "pack_unit",
      render: (_: any, __: Row, idx: number) => (
        <Form.Item
          name={`pack_unit_${idx}`}
          rules={[{ required: true, message: "Unit" }]}
        >
          <Input />
        </Form.Item>
      )
    },
    {
      title: "Qty Packs",
      dataIndex: "qty_packs",
      render: (_: any, __: Row, idx: number) => (
        <Form.Item
          name={`qty_${idx}`}
          rules={[{ required: true, message: "Qty" }]}
        >
          <InputNumber min={1} />
        </Form.Item>
      )
    }
  ];

  return (
    <Card title="Dispatch">
      <Form layout="vertical" form={form}>
        <Space wrap style={{ width: "100%" }}>
          <Form.Item
            label="Dispatch No"
            name="dispatch_no"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Dispatch Date"
            name="dispatch_date"
            rules={[{ required: true }]}
            initialValue={dayjs()}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Customer"
            name="customer_id"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              options={customers.map((c) => ({
                value: c.customer_id,
                label: c.customer_name
              }))}
            />
          </Form.Item>
        </Space>

        <Form.Item label="Order ID" name="order_id">
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item label="Transport Details" name="transport_details">
          <Input />
        </Form.Item>
        <Form.Item label="Status" name="status" initialValue="DISPATCHED">
          <Select
            options={[
              { value: "PENDING", label: "Pending" },
              { value: "DISPATCHED", label: "Dispatched" },
              { value: "DELIVERED", label: "Delivered" }
            ]}
          />
        </Form.Item>
        <Form.Item label="Remarks" name="remarks">
          <Input.TextArea rows={2} />
        </Form.Item>

        <h3>Dispatch Items</h3>
        <Table
          columns={columns as any}
          dataSource={rows}
          rowKey="key"
          pagination={false}
        />
        <Button style={{ marginTop: 8 }} onClick={addRow}>
          Add Item
        </Button>

        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={submit}>
            Save Dispatch
          </Button>
        </div>
      </Form>
    </Card>
  );
}


