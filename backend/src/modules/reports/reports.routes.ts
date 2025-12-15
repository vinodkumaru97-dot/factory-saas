import { Router } from "express";
import {
  rawMaterialStock,
  finishedGoodsStock,
  batchYield,
  salesSummary,
  expiryAndReturns,
  kpiSummary
} from "./reports.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/raw-material-stock", rawMaterialStock);
router.get("/finished-goods-stock", finishedGoodsStock);
router.get("/batch-yield", batchYield);
router.get("/sales-summary", salesSummary);
router.get("/expiry-returns", expiryAndReturns);
router.get("/kpis", kpiSummary);

export default router;


