"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Hasil {
  _id: string;
  nama: string;
  terima: boolean;
  imageURL: string;
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
        <strong>Status:</strong> {hasil.terima ? "Diterima" : "Ditolak"}
      </p>
      <img
        src={hasil.imageURL}
        alt={hasil.nama}
        width={200}
        height={200}
        style={{ margin: "1rem auto", borderRadius: 12, objectFit: "cover" }}
      />
    </div>
  );
}
