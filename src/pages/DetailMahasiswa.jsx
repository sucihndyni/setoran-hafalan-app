import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDetailMahasiswa } from "../services/api";
import Navbar from "../components/Navbar";

function DetailMahasiswa() {
  const { nim } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDetailMahasiswa(nim);
        setData(res.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    load();
  }, [nim]);

  if (!data) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 text-center">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-2 text-muted">Memuat data mahasiswa...</p>
        </div>
      </>
    );
  }

  const info = data.info || {};
  const setoran = data.setoran || {};
  const infoDasar = setoran.info_dasar || {};
  const ringkasan = setoran.ringkasan || [];

  return (
    <>
      <Navbar />
      <div className="min-vh-100 fade-in-up page-detail-mahasiswa">
        <div className="container pt-3 mt-2">

          <div className="mb-3">
            <h3 className="fw-bold mb-1 detail-title">Detail Mahasiswa</h3>
            <p className="text-muted small mb-0">Informasi akademik dan ringkasan pencapaian hafalan</p>
          </div>

          <div className="row g-3">
            <div className="col-lg-7">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body p-3">
                  <h5 className="section-title mb-3 detail-section-title">Profil Mahasiswa</h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="text-muted small d-block text-uppercase fw-bold detail-label-small">Nama Lengkap</label>
                      <span className="fs-5 fw-bold text-dark">{info.nama}</span>
                    </div>
                    <div className="col-12">
                      <label className="text-muted small d-block text-uppercase fw-bold detail-label-small">NIM</label>
                      <span className="fw-semibold">{info.nim}</span>
                    </div>
                    <div className="col-12">
                      <label className="text-muted small d-block text-uppercase fw-bold detail-label-small">Email</label>
                      <span className="fw-semibold">{info.email}</span>
                    </div>
                    <div className="col-6">
                      <label className="text-muted small d-block text-uppercase fw-bold detail-label-small">Angkatan</label>
                      <span className="fw-semibold">{info.angkatan}</span>
                    </div>
                    <div className="col-6">
                      <label className="text-muted small d-block text-uppercase fw-bold detail-label-small">Semester</label>
                      <span className="fw-semibold">{info.semester}</span>
                    </div>

                    <div className="col-12 mt-3 pt-3 border-top">
                      <label className="text-muted d-block text-uppercase fw-bold detail-last-setor">
                        Terakhir Kali Setor
                      </label>
                      <div className="d-flex align-items-center gap-2 mt-1">
                        <span className={`fw-bold ${infoDasar.terakhir_setor === 'Hari ini' ? 'text-success' : 'text-dark' } detail-last-setor-value`}>
                          {infoDasar.terakhir_setor || "Belum pernah setor"}
                        </span>
                        {infoDasar.tgl_terakhir_setor && (
                          <span className="text-muted detail-last-setor-date">
                            ({new Date(infoDasar.tgl_terakhir_setor).toLocaleDateString('id-ID', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card h-100 shadow-sm border-0 detail-card-gold-top">
                <div className="card-body p-3">
                  <h5 className="section-title mb-3 detail-section-title">Dosen Pembimbing</h5>
                  {info.dosen_pa ? (
                    <div className="d-flex flex-column gap-3">
                      <div>
                        <label className="text-muted small d-block text-uppercase fw-bold detail-label-small">Nama Dosen</label>
                        <span className="fw-bold text-dark">{info.dosen_pa.nama}</span>
                      </div>
                      <div>
                        <label className="text-muted small d-block text-uppercase fw-bold detail-label-small">NIP</label>
                        <span className="fw-semibold">{info.dosen_pa.nip}</span>
                      </div>
                      <div>
                        <label className="text-muted small d-block text-uppercase fw-bold detail-label-small">Email</label>
                        <span className="fw-semibold">{info.dosen_pa.email}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted small">Data dosen tidak tersedia</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-body p-3">
                  <h5 className="section-title mb-3 detail-section-title">Ringkasan Progres per Jenjang</h5>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light detail-table-head">
                        <tr>
                          <th>Kategori (Label)</th>
                          <th className="text-center">Wajib</th>
                          <th className="text-center">Sudah</th>
                          <th className="text-center">Belum</th>
                          <th>Progres</th>
                        </tr>
                      </thead>
                      <tbody className="detail-table-body">
                        {ringkasan.length > 0 ? ringkasan.map((item, index) => (
                          <tr key={index}>
                            <td className="fw-bold text-secondary">{item.label}</td>
                            <td className="text-center">{item.total_wajib_setor}</td>
                            <td className="text-center text-success fw-bold">{item.total_sudah_setor}</td>
                            <td className="text-center text-danger">{item.total_belum_setor}</td>
                            <td className="detail-min-width">
                              <div className="d-flex align-items-center gap-2">
                                <div className="progress flex-grow-1 detail-progress-thin">
                                  <div
                                    className="progress-bar detail-progress-value"
                                    role="progressbar"
                                    style={{ width: `${item.persentase_progres_setor}%` }}
                                  ></div>
                                </div>
                                <small className="fw-bold detail-last-setor-value">{item.persentase_progres_setor}%</small>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="5" className="text-center py-3 text-muted">Data ringkasan tidak ditemukan</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="stat-box h-100 d-flex flex-column justify-content-center">
                <span className="text-uppercase fw-bold small opacity-75 detail-stat-label">Total Wajib Setor</span>
                <h2 className="mb-0 fw-bold">{infoDasar.total_wajib_setor ?? "0"}</h2>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-box h-100 d-flex flex-column justify-content-center">
                <span className="text-uppercase fw-bold small opacity-75 detail-stat-label">Total Sudah Setor</span>
                <h2 className="mb-0 fw-bold text-success">{infoDasar.total_sudah_setor ?? "0"}</h2>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-box h-100 d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-uppercase fw-bold small opacity-75 detail-stat-label">Total Progres</span>
                  <h2 className="mb-0 fw-bold detail-stat-percent">
                    {infoDasar.persentase_progres_setor ?? "0"}%
                  </h2>
                </div>
                <div className="detail-stat-svg">
                  <svg viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#eee" strokeWidth="4"></circle>
                    <circle
                      className="progress-circle-value" 
                      cx="18" cy="18" r="16" fill="none" strokeWidth="4"
                      strokeDasharray={`${infoDasar.persentase_progres_setor || 0}, 100`}
                      strokeLinecap="round"
                    ></circle>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 d-flex justify-content-between align-items-center">
            <button className="btn btn-theme px-4 py-2 shadow-sm fw-bold" onClick={() => navigate(`/detail/${nim}/setoran`)}>
              Kelola Setoran & Riwayat →
            </button>
            <button className="btn btn-kembali btn-sm" onClick={() => navigate(-1)}>
              ← Kembali ke Daftar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailMahasiswa;