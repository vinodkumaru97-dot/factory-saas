import {
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  message
} from "antd";
import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import dayjs from "dayjs";

export default function PackingCreatePage() {
  const [form] = Form.useForm();
  const [batches, setBatches] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [batchRes, prodRes] = await Promise.all([
        api.get("/batches"),
        api.get("/crud/products")
      ]);
      setBatches(batchRes.data.items || batchRes.data || []);
      setProducts(prodRes.data.items || prodRes.data || []);
    })();
  }, []);

  const submit = async () => {
    try {
      const v = await form.validateFields();
      await api.post("/packing", {
        packing_date: v.packing_date.format("YYYY-MM-DD"),
        batch_id: v.batch_id,
        product_id: v.product_id,
        pack_size: v.pack_size,
        pack_unit: v.pack_unit,
        no_of_packs: v.no_of_packs,
        total_qty_packed: v.total_qty_packed,
        remarks: v.remarks
      });
      message.success("Packing saved");
      form.resetFields();
    } catch {
      // ignore
    }
  };

  return (
    <Card title="Packing">
      <Form form={form} layout="vertical">
        <Form.Item
          label="Packing Date"
          name="packing_date"
          rules={[{ required: true }]}
          initialValue={dayjs()}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="Batch"
          name="batch_id"
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            options={batches.map((b: any) => ({
              value: b.batch_id,
              label: b.batch_code
            }))}
          />
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
        <Form.Item
          label="Pack Size"
          name="pack_size"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          label="Pack Unit"
          name="pack_unit"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="No of Packs"
          name="no_of_packs"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item
          label="Total Qty Packed"
          name="total_qty_packed"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Remarks" name="remarks">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Button type="primary" onClick={submit}>
          Save
        </Button>
      </Form>
    </Card>
  );
}


