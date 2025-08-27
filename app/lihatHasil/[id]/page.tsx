"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FlipWords } from "@/components/ui/flip-words";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
  useModal,
  ModalProvider,
} from "@/components/ui/animated-modals";
import Envelope from "@/components/Envelope";
import "@/styles/notepad-style.css";

export default function LihatHasilModal() {
  const { id } = useParams<{ id: string }>();

  const [hasil, setHasil] = useState<null | { nama: string; terima: boolean }>(
    null,
  );
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchNama() {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(`/api/hasil/${id}`);
        if (!res.ok) {
          setNotFound(true);
          setHasil(null);
        } else {
          const data = await res.json();
          if (mounted && data.hasil) {
            setHasil({
              nama: data.hasil?.nama ?? "",
              terima: data.hasil?.terima,
            });
          } else {
            setNotFound(true);
            setHasil(null);
          }
        }
      } catch (err) {
        setNotFound(true);
        setHasil(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchNama();
    return () => {
      mounted = false;
    };
  }, [id]);

  const words = [hasil?.nama || ""];

  const ModalContentWithCloseButton = () => {
    const { setOpen } = useModal();
    return (
      <ModalContent>
        <div className="notepad">
          {/* HEADER */}
          <div className="notepad-header">
            <span className="badge-confidential">CONFIDENTIAL</span>
            <span
              style={{ display: "inline-block", marginLeft: 6, marginRight: 7 }}
            >
              {/* Magnifier SVG */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 22 22"
                style={{ verticalAlign: "middle" }}
              >
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  stroke="#a4251d"
                  strokeWidth="2"
                  fill="none"
                />
                <rect
                  x="15"
                  y="15"
                  width="5"
                  height="2"
                  rx="1"
                  fill="#b9925b"
                  transform="rotate(45 15 15)"
                />
              </svg>
            </span>
            <span className="case-title">
              Case File:{" "}
              <span style={{ color: "#a4251d", marginLeft: "3px" }}>
                <FlipWords className="capitalize" words={words} />
              </span>
            </span>
            <button
              className="close-button"
              onClick={() => setOpen(false)}
              aria-label="Tutup"
            >
              &times;
            </button>
          </div>
          {/* PAPER */}
          <div className="paper">
            <span className="paper-date">Rabu, 3 September 2025</span>
            <div>
              Setiap dari kalian adalah bintang yang bersinar dengan caranya
              masing-masing. Hari ini, kami umumkan Calon MPK Satriya Adhijaya
              yang akan melanjutkan estafet kepemimpinan. Bagi yang terpilih,
              jadilah pemimpin yang rendah hati dan menginspirasi. Bagi yang
              belum, ingatlah bahwa nilai kalian tak terukur hanya dari seleksi
              ini. Teruslah berkarya dan memberikan yang terbaik bagi Satriya
              Adhijaya. Selamat kepada Calon MPK Satriya Adhijaya terpilih, dan
              jangan berkecil hati bagi yang belum terpilih!! Teruslah berjuang
              dan buktikan kemampuanmu. Karena ini bukanlah sebuah kegagalan,
              tetapi langkah awal menuju Kesuksesan menantimu. Hati kami terbuka
              untuk semua yang telah berpartisipasi. Teruslah berkarya dengan
              cinta dan semangat❤️‍🩹❤️‍🩹
            </div>
          </div>
        </div>
      </ModalContent>
    );
  };

  if (loading) {
    return (
      <div
        className="w-full flex justify-center items-center"
        style={{ minHeight: "40vh" }}
      >
        <span>Loading...</span>
      </div>
    );
  }

  if (notFound || !hasil) {
    return (
      <div
        className="w-full flex justify-center items-center"
        style={{ minHeight: "40vh" }}
      >
        <span className="text-lg text-red-600 font-bold">Data not found</span>
      </div>
    );
  }

  // Only wrap once with ModalProvider (at app root or here)
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <ModalProvider>
        <Modal>
          <ModalTrigger>
            <div>
              <Envelope />
            </div>
          </ModalTrigger>
          <ModalBody>
            <ModalContentWithCloseButton />
            <ModalFooter>
              <span>
                Made with{" "}
                <span role="img" aria-label="detective">
                  🕵️‍♂️
                </span>{" "}
                by MPK Satriya Adhijaya
              </span>
              <Link
                href={`/Sertif/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Lihat Hasil
              </Link>
            </ModalFooter>
          </ModalBody>
        </Modal>
      </ModalProvider>
    </div>
  );
}
