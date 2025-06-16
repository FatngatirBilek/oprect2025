"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Hasil {
  _id: string;
  nama: string;
  terima: boolean;
  // timestamps if you need them
}

export default function LihatHasilPage() {
  const { id } = useParams<{ id: string }>();
  const [hasil, setHasil] = useState<Hasil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHasil() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/hasil/${id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Gagal memuat data");
        }
        const data = await res.json();
        setHasil(data.hasil);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchHasil();
  }, [id]);

  if (loading) return <div>Memuat...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!hasil) return <div>Data tidak ditemukan.</div>;

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", textAlign: "center" }}>
      <h2>Hasil Suara</h2>
      <p>
        <strong>Nama:</strong> {hasil.nama}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        {hasil.terima ? (
          <span style={{ color: "green", fontWeight: "bold" }}>Diterima</span>
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>Ditolak</span>
        )}
      </p>
    </div>
  );
}
