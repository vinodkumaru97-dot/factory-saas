-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "RawMaterial" (
    "rm_id" SERIAL NOT NULL,
    "rm_name" TEXT NOT NULL,
    "category" TEXT,
    "unit" TEXT NOT NULL,
    "min_stock_qty" DOUBLE PRECISION,
    "notes" TEXT,

    CONSTRAINT "RawMaterial_pkey" PRIMARY KEY ("rm_id")
);

-- CreateTable
CREATE TABLE "Product" (
    "product_id" SERIAL NOT NULL,
    "product_name" TEXT NOT NULL,
    "category" TEXT,
    "default_unit" TEXT NOT NULL,
    "hsn_code" TEXT,
    "shelf_life_days" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "customer_id" SERIAL NOT NULL,
    "customer_name" TEXT NOT NULL,
    "type" TEXT,
    "contact_no" TEXT,
    "whatsapp_no" TEXT,
    "email" TEXT,
    "address" TEXT,
    "gstin" TEXT,
    "remarks" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "RMStockMovement" (
    "id" SERIAL NOT NULL,
    "txn_date" TIMESTAMP(3) NOT NULL,
    "rm_id" INTEGER NOT NULL,
    "txn_type" TEXT NOT NULL,
    "qty_in" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "qty_out" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rate_per_unit" DOUBLE PRECISION,
    "total_amount" DOUBLE PRECISION,
    "reference_type" TEXT,
    "reference_id" INTEGER,

    CONSTRAINT "RMStockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batch" (
    "batch_id" SERIAL NOT NULL,
    "batch_code" TEXT NOT NULL,
    "batch_date" TIMESTAMP(3) NOT NULL,
    "product_id" INTEGER NOT NULL,
    "expected_output_qty" DOUBLE PRECISION,
    "actual_output_qty" DOUBLE PRECISION,
    "byproduct_qty" DOUBLE PRECISION,
    "yield_pct" DOUBLE PRECISION,
    "operator_name" TEXT,
    "remarks" TEXT,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("batch_id")
);

-- CreateTable
CREATE TABLE "BatchRawMaterial" (
    "id" SERIAL NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "rm_id" INTEGER NOT NULL,
    "qty_used" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BatchRawMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Packing" (
    "packing_id" SERIAL NOT NULL,
    "packing_date" TIMESTAMP(3) NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "pack_size" DOUBLE PRECISION NOT NULL,
    "pack_unit" TEXT NOT NULL,
    "no_of_packs" INTEGER NOT NULL,
    "total_qty_packed" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT,

    CONSTRAINT "Packing_pkey" PRIMARY KEY ("packing_id")
);

-- CreateTable
CREATE TABLE "FGStockMovement" (
    "id" SERIAL NOT NULL,
    "movement_date" TIMESTAMP(3) NOT NULL,
    "product_id" INTEGER NOT NULL,
    "pack_size" DOUBLE PRECISION NOT NULL,
    "pack_unit" TEXT NOT NULL,
    "txn_type" TEXT NOT NULL,
    "qty_packs_in" INTEGER NOT NULL DEFAULT 0,
    "qty_packs_out" INTEGER NOT NULL DEFAULT 0,
    "reference_type" TEXT,
    "reference_id" INTEGER,
    "remarks" TEXT,

    CONSTRAINT "FGStockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "order_id" SERIAL NOT NULL,
    "order_no" TEXT NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL,
    "order_channel" TEXT,
    "customer_id" INTEGER NOT NULL,
    "status" TEXT,
    "payment_status" TEXT,
    "remarks" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "pack_size" DOUBLE PRECISION NOT NULL,
    "pack_unit" TEXT NOT NULL,
    "qty_packs" INTEGER NOT NULL,
    "rate_per_unit" DOUBLE PRECISION NOT NULL,
    "line_total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispatch" (
    "dispatch_id" SERIAL NOT NULL,
    "dispatch_no" TEXT NOT NULL,
    "dispatch_date" TIMESTAMP(3) NOT NULL,
    "order_id" INTEGER,
    "customer_id" INTEGER NOT NULL,
    "transport_details" TEXT,
    "status" TEXT,
    "remarks" TEXT,

    CONSTRAINT "Dispatch_pkey" PRIMARY KEY ("dispatch_id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "invoice_id" SERIAL NOT NULL,
    "invoice_no" TEXT NOT NULL,
    "invoice_date" TIMESTAMP(3) NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "order_id" INTEGER,
    "gross_total" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tax_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tax_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "net_amount" DOUBLE PRECISION NOT NULL,
    "payment_status" TEXT,
    "payment_date" TIMESTAMP(3),
    "payment_mode" TEXT,
    "remarks" TEXT,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("invoice_id")
);

-- CreateTable
CREATE TABLE "Return" (
    "return_id" SERIAL NOT NULL,
    "return_date" TIMESTAMP(3) NOT NULL,
    "source_type" TEXT NOT NULL,
    "source_ref" TEXT,
    "product_id" INTEGER NOT NULL,
    "pack_size" DOUBLE PRECISION NOT NULL,
    "pack_unit" TEXT NOT NULL,
    "qty_packs" INTEGER NOT NULL,
    "reason" TEXT,
    "adjusted_in_stock" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,

    CONSTRAINT "Return_pkey" PRIMARY KEY ("return_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Batch_batch_code_key" ON "Batch"("batch_code");

-- CreateIndex
CREATE UNIQUE INDEX "Order_order_no_key" ON "Order"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "Dispatch_dispatch_no_key" ON "Dispatch"("dispatch_no");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoice_no_key" ON "Invoice"("invoice_no");

-- AddForeignKey
ALTER TABLE "RMStockMovement" ADD CONSTRAINT "RMStockMovement_rm_id_fkey" FOREIGN KEY ("rm_id") REFERENCES "RawMaterial"("rm_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchRawMaterial" ADD CONSTRAINT "BatchRawMaterial_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "Batch"("batch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchRawMaterial" ADD CONSTRAINT "BatchRawMaterial_rm_id_fkey" FOREIGN KEY ("rm_id") REFERENCES "RawMaterial"("rm_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Packing" ADD CONSTRAINT "Packing_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "Batch"("batch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Packing" ADD CONSTRAINT "Packing_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FGStockMovement" ADD CONSTRAINT "FGStockMovement_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispatch" ADD CONSTRAINT "Dispatch_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispatch" ADD CONSTRAINT "Dispatch_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Return" ADD CONSTRAINT "Return_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
