import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDetailMahasiswa } from "../services/api";
import Navbar from "../components/Navbar";

function RiwayatLog() {
  const { nim } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getDetailMahasiswa(nim);
        setData(res.data.data);
      } catch (err) {
        console.error(err);
        alert("Gagal ambil riwayat log mahasiswa");
      }
    };
    loadData();
  }, [nim]);

  if (!data) return <p className="mt-4 text-center text-muted">Memuat Riwayat...</p>;

  const { info, setoran } = data;
  
  const logArray = Array.isArray(setoran?.log) ? [...setoran.log] : [];
  const sortedLog = logArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = sortedLog.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedLog.length / itemsPerPage);

  return (
    <>
      <Navbar />
      <div className="min-vh-100 page-riwayat-log">
        <div className="container pt-4">
          
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h4 className="fw-bold mb-1 riwayat-title">Riwayat Aktivitas</h4>
              <p className="mb-0 small text-muted fw-semibold">{info.nama} | NIM: {info.nim}</p>
            </div>
          </div>

          {sortedLog.length === 0 ? (
            <div className="bg-white p-5 text-center rounded shadow-sm border">
              <small className="text-muted">Tidak ada riwayat aktivitas ditemukan.</small>
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {currentLogs.map((entry) => (
                <div key={entry.id} className="bg-white p-3 rounded shadow-sm border-start border-4 border-success d-flex justify-content-between align-items-center">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-bold text-dark small riwayat-aksi-text">{entry.aksi}</span>
                      <span className="text-muted riwayat-time-text">• {formatDate(entry.timestamp)}</span>
                    </div>
                    <p className="mb-0 text-muted riwayat-desc-text">
                      {entry.keterangan} 
                      <span className="mx-2 opacity-25">|</span>
                      <span className="fw-semibold text-dark">
                        Validator: {entry.dosen_yang_mengesahkan?.nama || "Sistem"}
                      </span>
                    </p>
                  </div>
                  
                  <div className="text-end d-none d-md-block riwayat-meta">
                    <code className="d-block text-success fw-bold riwayat-meta-code">IP: {entry.ip}</code>
                    
                    <small className="d-block text-muted text-truncate riwayat-meta-small" title={entry.user_agent}>
                      App: {entry.user_agent ? (entry.user_agent.includes("Postman") ? "🚀 Postman" : "🌐 Browser") : "Unknown"}
                    </small>
                    
                    <small className="text-muted opacity-50 riwayat-meta-small">ID: {entry.id}</small>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-kembali btn-sm" onClick={() => navigate(-1)}>
              ← Kembali
            </button>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="fixed-bottom d-flex justify-content-end p-4 pagination-fixed">
            <div className="bg-white shadow-lg border d-flex align-items-center gap-3 px-3 py-2 pagination-panel">
              <button 
                className="btn btn-light btn-sm border-0 shadow-sm pagination-circle" 
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                  window.scrollTo(0, 0);
                }}
                disabled={currentPage === 1}
              >
                ❮
              </button>
              
              <div className="text-center flex-grow-1">
                <span className="fw-bold text-muted pagination-counter">
                   {currentPage} / {totalPages}
                </span>
              </div>

              <button 
                className="btn btn-light btn-sm border-0 shadow-sm pagination-circle" 
                onClick={() => {
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  window.scrollTo(0, 0);
                }}
                disabled={currentPage === totalPages}
              >
                ❯
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  ); 
}

export default RiwayatLog;