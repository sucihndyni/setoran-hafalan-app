import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDetailMahasiswa, batalSetoran } from "../services/api";
import Navbar from "../components/Navbar";
import SetoranForm from "../components/SetoranForm";

function SetoranDetail() {
  const { nim } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDetailMahasiswa(nim);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Gagal ambil detail setoran mahasiswa");
    } finally {
      setLoading(false);
    }
  }, [nim]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBatalSetoran = async (item) => {
    if (!item.info_setoran) return;
    const confirmCancel = window.confirm(`Batalkan setoran ${item.nama}?`);
    if (!confirmCancel) return;

    try {
      await batalSetoran(nim, [
        {
          id: item.info_setoran.id,
          id_komponen_setoran: item.id,
          nama_komponen_setoran: item.nama,
        },
      ]);
      alert("Setoran berhasil dibatalkan");
      loadData();
    } catch (err) {
      console.error(err);
      alert("Gagal batalkan setoran");
    }
  };

  if (loading || !data) return <p className="mt-4 text-center text-muted">Memuat data setoran...</p>;

  const { info, setoran } = data;
  const detail = setoran?.detail || [];

  return (
    <>
      <Navbar />
      
      <div className="min-vh-100 fade-in-up page-setoran-detail">
        <div className="container pt-4">
          
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h2 className="fw-bold mb-1 setoran-title">Detail Setoran</h2>
              <p className="mb-0 fw-semibold text-muted fs-5">
                {info.nama} <span className="mx-2 text-gold">|</span> NIM: {info.nim}
              </p>
            </div>
          </div>

          <div className="card mb-5 border-0 shadow-sm setoran-card-rounded">
            <div className="card-body p-4 p-md-5">
              <h5 className="section-title mb-4 setoran-section-title-sm">Tambah Setoran Baru</h5>
              <SetoranForm nim={nim} reload={loadData} detail={detail} />
            </div>
          </div>

          <div className="mb-4 d-flex align-items-center">
            <h4 className="section-title mb-0 fw-bold setoran-history-title">Riwayat Daftar Setoran</h4>
            <div className="flex-grow-1 ms-3 border-bottom opacity-25"></div>
          </div>
          
          {detail.length === 0 ? (
            <div className="alert alert-light text-center py-5 border-dashed shadow-sm">
              <p className="text-muted mb-0">Belum ada riwayat setoran yang tercatat.</p>
            </div>
          ) : (
            <div className="row g-4">
              {detail.map((item) => (
                <div key={item.id} className="col-xl-4 col-md-6 col-12">
                  <div className="p-4 h-100 rounded border-0 bg-white shadow-sm hover-lift d-flex flex-column setoran-card-item">
                    
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold text-dark mb-0 text-truncate maxw-70">
                        {item.nama}
                      </h5>
                      <span className={`badge px-3 py-2 ${item.sudah_setor ? "bg-success" : "bg-danger"} setoran-badge-small`}>
                        {item.sudah_setor ? "Sudah Setor" : "Belum Setor"}
                      </span>
                    </div>

                    <div className="mb-4">
                      <small className="text-muted fw-bold text-uppercase setoran-label-small">
                        Label: {item.label}
                      </small>
                    </div>

                    <div className="mt-auto pt-3 border-top">
                      {item.info_setoran ? (
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex justify-content-between">
                            <small className="text-muted fw-semibold">Tanggal Setor:</small>
                            <small className="fw-bold text-dark">{item.info_setoran.tgl_setoran || "-"}</small>
                          </div>
                          <div className="d-flex justify-content-between">
                            <small className="text-muted fw-semibold">Validasi:</small>
                            <small className="fw-bold text-gold">{item.info_setoran.tgl_validasi || "-"}</small>
                          </div>
                          
                          <button 
                            className="btn btn-link btn-sm text-danger text-decoration-none p-0 mt-2 text-start fw-bold" 
                            onClick={() => handleBatalSetoran(item)}
                          >
                            <small>✕ Batalkan Setoran</small>
                          </button>
                        </div>
                      ) : (
                        <div className="py-2 text-center bg-light rounded-pill">
                          <small className="text-muted italic setoran-alert-text">Data rekaman belum tersedia</small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mt-4">
            <button className="btn btn-theme btn-sm px-3 py-2 shadow-sm" onClick={() => navigate(`/detail/${nim}/riwayat`)}>
              Riwayat Log
            </button>
            <button className="btn btn-kembali btn-sm" onClick={() => navigate(-1)}>
              ← Kembali
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SetoranDetail;