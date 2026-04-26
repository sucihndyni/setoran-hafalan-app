import { useEffect, useState } from "react";
import { getPaSaya } from "../services/api";
import MahasiswaCard from "../components/MahasiswaCard";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  const loadData = async () => {
    try {
      const res = await getPaSaya();
      setDashboardData(res.data.data);
    } catch (err) {
      console.error("ERROR:", err.response?.data);
      alert("Gagal ambil data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const mahasiswa = dashboardData?.info_mahasiswa_pa?.daftar_mahasiswa || [];
  const ringkasan = dashboardData?.info_mahasiswa_pa?.ringkasan || [];

  return (
    <>
      <Navbar />
      <div className="min-vh-100 fade-in-up page-dashboard">
        <div className="container mt-4">
          
          <div className="dashboard-header shadow-sm mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3 className="fw-bold mb-1">Dashboard Dosen PA</h3>
                <p className="mb-0 opacity-75">Pantau progres hafalan dan data bimbingan mahasiswa Anda.</p>
              </div>
              <div className="d-none d-md-block text-end">
              </div>
            </div>
          </div>

          {!dashboardData ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status"></div>
              <p className="mt-3 text-muted fw-semibold">Sinkronisasi data...</p>
            </div>
          ) : (
            <>
              <div className="row g-4 mb-5">
                  <div className="col-lg-4">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body p-4">
                      <h6 className="section-title mb-4">Informasi Dosen</h6>
                      <div className="d-flex flex-column gap-3">
                        <div>
                          <small className="text-muted d-block text-uppercase fw-bold detail-label-small">Nama Lengkap</small>
                          <div className="fw-bold fs-5 text-dark">{dashboardData.nama}</div>
                        </div>
                        <div className="border-top pt-2">
                          <small className="text-muted d-block text-uppercase fw-bold detail-label-small">NIP / Identitas</small>
                          <div className="fw-semibold">{dashboardData.nip}</div>
                        </div>
                        <div className="border-top pt-2">
                          <small className="text-muted d-block text-uppercase fw-bold detail-label-small">Email Resmi</small>
                          <div className="fw-semibold text-truncate">{dashboardData.email}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-8">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body p-4">
                      <h6 className="section-title mb-4">Ringkasan Mahasiswa</h6>
                      <div className="row g-3">
                        {ringkasan.length > 0 ? (
                          ringkasan.map((item) => (
                            <div className="col-md-4 col-6" key={item.tahun}>
                              <div className="p-3 rounded shadow-sm d-flex flex-column dashboard-ringkasan-card">
                                <small className="text-muted fw-bold dashboard-ringkasan-label">ANGKATAN</small>
                                <h4 className="fw-bold mb-0 dashboard-ringkasan-value">{item.tahun}</h4>
                                <small className="mt-1 fw-semibold text-dark">Total: {item.total}</small>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-12 py-3 text-center text-muted border rounded">Belum ada data ringkasan.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4 d-flex align-items-center">
                <h5 className="section-title mb-0 fs-4 fw-bold">Daftar Mahasiswa ({mahasiswa.length})</h5>
                <div className="flex-grow-1 ms-3 border-bottom opacity-25"></div>
              </div>

              {mahasiswa.length === 0 ? (
                <div className="card p-5 text-center shadow-sm border-0">
                  <p className="text-muted mb-0">Belum ada mahasiswa dalam daftar bimbingan Anda.</p>
                </div>
              ) : (
                <div className="row g-4">
                  {mahasiswa.map((mhs) => (
                    <div className="col-xl-4 col-md-6" key={mhs.nim}>
                      <MahasiswaCard mhs={mhs} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;