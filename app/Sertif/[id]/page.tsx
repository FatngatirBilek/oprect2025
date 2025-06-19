"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface HasilData {
  imageURL: string;
  nama: string;
  terima: boolean;
}

export default function HasilImagePage() {
  const { id } = useParams<{ id: string }>();
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [nama, setNama] = useState<string | null>(null);
  const [terima, setTerima] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/hasil/${id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Gagal memuat data");
        }
        const data = await res.json();
        setImageURL(data.hasil?.imageURL ?? null);
        setNama(data.hasil?.nama ?? null);
        setTerima(data.hasil?.terima ?? null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchImage();
  }, [id]);

  if (loading) return <div style={{ textAlign: "center" }}>Memuat...</div>;
  if (error)
    return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;
  if (!imageURL)
    return <div style={{ textAlign: "center" }}>Gambar tidak ditemukan.</div>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 30,
      }}
    >
      {terima === false ? (
        <h2 style={{ color: "red", fontWeight: 700, marginBottom: 12 }}>
          Maaf Kamu Belum Diterima
        </h2>
      ) : terima === true ? (
        <h2 style={{ color: "green", fontWeight: 700, marginBottom: 12 }}>
          Selamat Kamu Diterima
        </h2>
      ) : null}
      <img
        src={imageURL}
        alt={nama ?? "Hasil"}
        style={{
          maxWidth: "90vw",
          maxHeight: "80vh",
          borderRadius: 12,
          marginTop: 24,
          objectFit: "contain",
        }}
      />
    </div>
  );
}
