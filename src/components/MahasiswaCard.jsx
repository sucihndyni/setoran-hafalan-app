import { useNavigate } from "react-router-dom";

function MahasiswaCard({ mhs }) {
  const navigate = useNavigate();
  const progress = mhs.info_setoran?.persentase_progres_setor || 0;

  return (
    <div className="card mahasiswa-card h-100 position-relative">
      <div className="card-body d-flex flex-column">
        <span className="badge-pa">PA</span>
        <div>
          <h6>{mhs.nama}</h6>
          <p className="text-muted mb-2">{mhs.nim}</p>
        </div>
        <div className="progress mb-3 progress-thin">
          <div className="progress-bar progress-bar-gold" style={{ width: `${progress}%` }} />
        </div>
        <button className="btn btn-theme mt-auto" onClick={() => navigate(`/detail/${mhs.nim}`)}>
          Detail Mahasiswa
        </button>
      </div>
    </div>
  );
}

export default MahasiswaCard;
