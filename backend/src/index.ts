import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import authRoutes from "./auth/auth.routes";
import crudRoutes from "./crud/crud.routes";
import batchesRoutes from "./modules/batches/batches.routes";
import packingRoutes from "./modules/packing/packing.routes";
import dispatchesRoutes from "./modules/dispatches/dispatches.routes";
import returnsRoutes from "./modules/returns/returns.routes";
import usersRoutes from "./modules/users/users.routes";
import rawMaterialsRoutes from "./modules/rawMaterials/rawMaterials.routes";
import productsRoutes from "./modules/products/products.routes";
import customersRoutes from "./modules/customers/customers.routes";
import ordersRoutes from "./modules/orders/orders.routes";
import invoicesRoutes from "./modules/invoices/invoices.routes";
import reportsRoutes from "./modules/reports/reports.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    // origin: ENV.CLIENT_URL,
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175"
    ],
    credentials: false
  })
);
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/crud", crudRoutes);

app.use("/api/raw-materials", rawMaterialsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/invoices", invoicesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/batches", batchesRoutes);
app.use("/api/packing", packingRoutes);
app.use("/api/dispatches", dispatchesRoutes);
app.use("/api/returns", returnsRoutes);
app.use("/api/reports", reportsRoutes);

app.use(errorHandler);

app.listen(Number(ENV.PORT), () => {
  console.log(`Backend server running on port ${ENV.PORT}`);
});


