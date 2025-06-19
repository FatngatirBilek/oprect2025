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
        <div className="notepad relative">
          <div className="top relative">
            <button
              className="absolute top-2 right-2 text-white z-10 close-button"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
          </div>
          <div className="paper">
            <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
              Selamat
              <FlipWords className="capitalize" words={words} />
              ❤️
            </h4>
            <div className="pb-10 flex flex-wrap gap-x-5 gap-y-7 items-start justify-start max-w-full">
              <span className="font-bold mx-5">Kamis, 27 Maret 2025</span>
              <div className="flex items-center justify-center">
                <span className="mx-10">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Maecenas egestas mollis urna quis bibendum. Nunc porta
                  consequat arcu eu scelerisque. Ut eleifend ipsum ut neque
                  malesuada lobortis. Nulla semper, dolor vitae elementum
                  posuere, nunc neque dictum elit, id iaculis libero tellus sed
                  quam. Vestibulum elementum condimentum felis, id fringilla
                  metus. Fusce lobortis interdum nulla, ut dictum magna pulvinar
                  non. Sed viverra id leo eu viverra. Integer velit dui,
                  facilisis faucibus tellus quis, feugiat bibendum felis. In
                  euismod vestibulum mattis. Integer sed augue pharetra, laoreet
                  odio vel, facilisis leo. Aenean sit amet interdum justo.
                  Integer eget neque a tortor dapibus scelerisque a ut sem.
                  Etiam consectetur nunc vel nunc convallis volutpat. Aliquam id
                  lectus non nunc tempor tempus sed vel mi. Vivamus varius dui
                  in mi convallis ultricies. Praesent dictum leo magna.{" "}
                </span>
              </div>
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
    <div className="w-[100%] items-center justify-center flex">
      <ModalProvider>
        <Modal>
          <ModalTrigger>
            <div>
              <Envelope />
            </div>
          </ModalTrigger>
          <ModalBody>
            <ModalContentWithCloseButton />
            <ModalFooter className="gap-4 flex items-center">
              <span className="text-left">Made with ❤️ by Fathir</span>
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
