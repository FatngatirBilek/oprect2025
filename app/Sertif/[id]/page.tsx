"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

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

  if (loading) return <div className="text-center">Memuat...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!imageURL)
    return <div className="text-center">Gambar tidak ditemukan.</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f8ecd3] pt-8">
      {terima === false ? (
        <h2 className="text-red-600 font-bold mb-3 text-lg md:text-xl">
          Maaf Kamu Belum Diterima
        </h2>
      ) : terima === true ? (
        <h2 className="text-green-600 font-bold mb-3 text-lg md:text-xl">
          Selamat Kamu Diterima
        </h2>
      ) : null}
      <img
        src={imageURL}
        alt={nama ?? "Hasil"}
        className="max-w-[98vw] max-h-[70vh] rounded-xl mt-6 mb-0 object-contain block"
        style={{ marginBottom: 0, border: 0, padding: 0 }}
      />
      <div className="self-start -mt-4 ml-2">
        <Image src="/maskot.png" alt="maskot" width={270} height={300} />
      </div>
    </div>
  );
}
