"use client";
import React from "react";
import { FlipWords } from "./ui/flip-words";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
  useModal,
  ModalProvider,
} from "@/components/ui/animated-modals";
import Envelope from "./Envelope";

export default function Modals() {
  const words = ["Adekk", "test"];

  const ModalContentWithCloseButton = () => {
    const { setOpen } = useModal();

    return (
      <ModalContent>
        <div className="notepad relative">
          <div className="top relative">
            <button
              className="absolute top-2 right-2 text-white z-10 close-button" // Ensure the close button is on top and add a class
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
                <span className="mx-10">Kamu ditolak</span>
              </div>
            </div>
          </div>
        </div>
      </ModalContent>
    );
  };

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
            <ModalFooter className="gap-4">
              <span className="text-left w-full">Made with ❤️ by Fathir</span>
            </ModalFooter>
          </ModalBody>
        </Modal>
      </ModalProvider>
    </div>
  );
}
