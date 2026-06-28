import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth
import LoginPage from "./pages/auth/LoginPage";
import OtpPage from "./pages/auth/OtpPage";

// Customer
import BerandaPage from "./pages/customer/BerandaPage";
import KatalogTenantPage from "./pages/customer/KatalogTenantPage";
import DetailTenantPage from "./pages/customer/DetailTenantPage";
import KeranjangPage from "./pages/customer/KeranjangPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import KonfirmasiPesananPage from "./pages/customer/KonfirmasiPesananPage";
import StatusAntrianPage from "./pages/customer/StatusAntrianPage";
import ProfilPage from "./pages/customer/ProfilPage";
import KartuNfcPage from "./pages/customer/KartuNfcPage";
import VerifikasiLokasiPage from "./pages/customer/VerifikasiLokasiPage";

// Tenant
import DashboardTenantPage from "./pages/tenant/DashboardTenantPage";
import CrudMenuPage from "./pages/tenant/CrudMenuPage";
import CetakTagHargaPage from "./pages/tenant/CetakTagHargaPage";
import KasirPosPage from "./pages/tenant/KasirPosPage";
import PesananAntrianPage from "./pages/tenant/PesananAntrianPage";
import ScanQrPage from "./pages/tenant/ScanQrPage";
import LaporanTenantPage from "./pages/tenant/LaporanTenantPage";

// Pengelola
import DashboardPengelolaPage from "./pages/pengelola/DashboardPengelolaPage";
import KelolaTenantPage from "./pages/pengelola/KelolaTenantPage";
import KelolaKartuNfcPage from "./pages/pengelola/KelolaKartuNfcPage";
import GeofencePage from "./pages/pengelola/GeofencePage";
import LaporanSettlementPage from "./pages/pengelola/LaporanSettlementPage";

// Papan Antrian Publik
import PapanAntrianPage from "./pages/papan/PapanAntrianPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/beranda" replace />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OtpPage />} />

        {/* Customer */}
        <Route path="/beranda" element={<BerandaPage />} />
        <Route path="/tenant" element={<KatalogTenantPage />} />
        <Route path="/tenant/:id" element={<DetailTenantPage />} />
        <Route path="/cart" element={<KeranjangPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/:id/confirm" element={<KonfirmasiPesananPage />} />
        <Route path="/antrian" element={<StatusAntrianPage />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/kartu-nfc" element={<KartuNfcPage />} />
        <Route path="/verifikasi-lokasi" element={<VerifikasiLokasiPage />} />

        {/* Tenant Panel */}
        <Route path="/tenant-panel" element={<Navigate to="/tenant-panel/dashboard" replace />} />
        <Route path="/tenant-panel/dashboard" element={<DashboardTenantPage />} />
        <Route path="/tenant-panel/menu" element={<CrudMenuPage />} />
        <Route path="/tenant-panel/cetak-tag" element={<CetakTagHargaPage />} />
        <Route path="/tenant-panel/kasir" element={<KasirPosPage />} />
        <Route path="/tenant-panel/pesanan" element={<PesananAntrianPage />} />
        <Route path="/tenant-panel/scan-qr" element={<ScanQrPage />} />
        <Route path="/tenant-panel/laporan" element={<LaporanTenantPage />} />

        {/* Pengelola Panel */}
        <Route path="/pengelola" element={<Navigate to="/pengelola/dashboard" replace />} />
        <Route path="/pengelola/dashboard" element={<DashboardPengelolaPage />} />
        <Route path="/pengelola/tenant" element={<KelolaTenantPage />} />
        <Route path="/pengelola/kartu-nfc" element={<KelolaKartuNfcPage />} />
        <Route path="/pengelola/geofence" element={<GeofencePage />} />
        <Route path="/pengelola/laporan" element={<LaporanSettlementPage />} />

        {/* Papan Antrian Publik (fullscreen) */}
        <Route path="/papan-antrian" element={<PapanAntrianPage />} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/beranda" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
