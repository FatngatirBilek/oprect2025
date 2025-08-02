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
            <span className="paper-date">Kamis, 27 Maret 2025</span>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
              egestas mollis urna quis bibendum. Nunc porta consequat arcu eu
              scelerisque. Ut eleifend ipsum ut neque malesuada lobortis. Nulla
              semper, dolor vitae elementum posuere, nunc neque dictum elit, id
              iaculis libero tellus sed quam. Vestibulum elementum condimentum
              felis, id fringilla metus. Fusce lobortis interdum nulla, ut
              dictum magna pulvinar non. Sed viverra id leo eu viverra. Integer
              velit dui, facilisis faucibus tellus quis, feugiat bibendum felis.
              In euismod vestibulum mattis. Integer sed augue pharetra, laoreet
              odio vel, facilisis leo. Aenean sit amet interdum justo. Integer
              eget neque a tortor dapibus scelerisque a ut sem. Etiam
              consectetur nunc vel nunc convallis volutpat. Aliquam id lectus
              non nunc tempor tempus sed vel mi. Vivamus varius dui in mi
              convallis ultricies. Praesent dictum leo magna.
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
                by Fathir
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
