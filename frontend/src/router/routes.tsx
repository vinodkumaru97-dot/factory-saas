import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import RawMaterialsPage from "../pages/rawMaterials/RawMaterialsPage";
import ProductsPage from "../pages/products/ProductsPage";
import CustomersPage from "../pages/customers/CustomersPage";
import BatchCreatePage from "../pages/batches/BatchCreatePage";
import PackingCreatePage from "../pages/packing/PackingCreatePage";
import DispatchCreatePage from "../pages/dispatches/DispatchCreatePage";
import ReturnsPage from "../pages/returns/ReturnsPage";
import OrdersPage from "../pages/orders/OrdersPage";
import InvoicesPage from "../pages/invoices/InvoicesPage";
import RawMaterialStockReportPage from "../pages/reports/RawMaterialStockReportPage";
import FinishedGoodsStockReportPage from "../pages/reports/FinishedGoodsStockReportPage";
import BatchYieldReportPage from "../pages/reports/BatchYieldReportPage";
import SalesSummaryReportPage from "../pages/reports/SalesSummaryReportPage";
import ExpiryReturnsReportPage from "../pages/reports/ExpiryReturnsReportPage";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import UsersPage from "../pages/users/UsersPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/raw-materials"
          element={
            <ProtectedRoute roles={["OWNER", "MANAGER"]}>
              <MainLayout>
                <RawMaterialsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["OWNER"]}>
              <MainLayout>
                <UsersPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute roles={["OWNER", "MANAGER"]}>
              <MainLayout>
                <ProductsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute roles={["OWNER", "MANAGER"]}>
              <MainLayout>
                <CustomersPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/batches"
          element={
            <ProtectedRoute roles={["OWNER", "MANAGER"]}>
              <MainLayout>
                <BatchCreatePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/packing"
          element={
            <ProtectedRoute roles={["OWNER", "MANAGER"]}>
              <MainLayout>
                <PackingCreatePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dispatches"
          element={
            <ProtectedRoute roles={["OWNER", "MANAGER"]}>
              <MainLayout>
                <DispatchCreatePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/returns"
          element={
            <ProtectedRoute roles={["OWNER", "MANAGER"]}>
              <MainLayout>
                <ReturnsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute roles={["OWNER", "MANAGER"]}>
              <MainLayout>
                <OrdersPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <ProtectedRoute roles={["OWNER", "MANAGER"]}>
              <MainLayout>
                <InvoicesPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/raw-material-stock"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RawMaterialStockReportPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/fg-stock"
          element={
            <ProtectedRoute>
              <MainLayout>
                <FinishedGoodsStockReportPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/batch-yield"
          element={
            <ProtectedRoute>
              <MainLayout>
                <BatchYieldReportPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/sales-summary"
          element={
            <ProtectedRoute roles={["OWNER", "MANAGER"]}>
              <MainLayout>
                <SalesSummaryReportPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/expiry-returns"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ExpiryReturnsReportPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}


