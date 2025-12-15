import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  message
} from "antd";
import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import dayjs from "dayjs";

export default function ReturnsPage() {
  const [form] = Form.useForm();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await api.get("/crud/products");
      setProducts(res.data.items || res.data);
    })();
  }, []);

  const submit = async () => {
    try {
      const v = await form.validateFields();
      await api.post("/returns", {
        return_date: v.return_date.format("YYYY-MM-DD"),
        source_type: v.source_type,
        source_ref: v.source_ref,
        product_id: v.product_id,
        pack_size: v.pack_size,
        pack_unit: v.pack_unit,
        qty_packs: v.qty_packs,
        reason: v.reason,
        adjusted_in_stock: v.adjusted_in_stock,
        remarks: v.remarks
      });
      message.success("Return saved");
      form.resetFields();
    } catch {
      // ignore
    }
  };

  return (
    <Card title="Returns & Expiry">
      <Form form={form} layout="vertical">
        <Form.Item
          label="Return Date"
          name="return_date"
          rules={[{ required: true }]}
          initialValue={dayjs()}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="Source Type"
          name="source_type"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: "CUSTOMER", label: "Customer" },
              { value: "INTERNAL", label: "Internal" },
              { value: "EXPIRY", label: "Expiry" }
            ]}
          />
        </Form.Item>
        <Form.Item label="Source Ref (Order/Invoice)" name="source_ref">
          <Input />
        </Form.Item>
        <Form.Item
          label="Product"
          name="product_id"
          rules={[{ required: true }]}
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
          label="Qty Packs"
          name="qty_packs"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item label="Reason" name="reason">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item
          label="Adjust back into stock"
          name="adjusted_in_stock"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>
        <Form.Item label="Remarks" name="remarks">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Button type="primary" onClick={submit}>
          Save Return
        </Button>
      </Form>
    </Card>
  );
}


