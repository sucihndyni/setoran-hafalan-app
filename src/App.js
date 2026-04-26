import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DetailMahasiswa from "./pages/DetailMahasiswa";
import SetoranDetail from "./pages/SetoranDetail";
import RiwayatLog from "./pages/RiwayatLog";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail/:nim"
          element={
            <ProtectedRoute>
              <DetailMahasiswa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail/:nim/setoran"
          element={
            <ProtectedRoute>
              <SetoranDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail/:nim/riwayat"
          element={
            <ProtectedRoute>
              <RiwayatLog />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;