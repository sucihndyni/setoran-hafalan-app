import { useState } from "react";
import { simpanSetoran } from "../services/api";

function SetoranForm({ nim, reload, detail = [] }) {
  const availableSurahs = detail.filter((item) => !item.info_setoran);
  const [surah, setSurah] = useState("");
  const [tanggal, setTanggal] = useState("");

  const selectedSurah = availableSurahs.find((item) => item.id?.toString() === surah);

  const handleSubmit = async () => {
    if (!surah) {
      alert("Pilih surah terlebih dahulu.");
      return;
    }

    if (!selectedSurah) {
      alert("Surah tidak ditemukan, pilih surah lagi.");
      return;
    }

    if (!tanggal) {
      alert("Pilih tanggal setoran.");
      return;
    }

    try {
      await simpanSetoran(nim, {
        id_komponen_setoran: selectedSurah?.id,
        nama_komponen_setoran: selectedSurah?.nama,
        tanggal
      });

      alert("Berhasil simpan!");
      reload();
    } catch (err) {
      console.error(err);
      alert(
        `Gagal simpan: ${err.response?.data?.message ?? err.response?.data ?? err.message}`
      );
    }
  };

  return (
    <div className="card theme-card form-card mt-3">
      <div className="card-body">
        <h5 className="mb-3">Tambah Setoran</h5>

        <select
          className="form-control mb-3 input-theme"
          value={surah}
          onChange={(e) => setSurah(e.target.value)}
        >
          <option value="">Pilih surah</option>
          {availableSurahs.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nama} ({item.nama_arab})
            </option>
          ))}
        </select>

        <input
          type="date"
          className="form-control mb-3 input-theme"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
        />

        <button
          className="btn btn-theme w-100"
          onClick={handleSubmit}
          disabled={availableSurahs.length === 0}
        >
          Simpan Setoran
        </button>

        {availableSurahs.length === 0 && (
          <p className="text-muted mt-2 mb-0">Semua surah sudah setor atau tidak ada pilihan.</p>
        )}
      </div>
    </div>
  );
}

export default SetoranForm;