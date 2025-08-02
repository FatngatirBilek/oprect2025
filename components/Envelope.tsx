"use client";
import { useState } from "react";
import styles from "../styles/Envelope.module.css";

export default function Envelope() {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={styles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.valentines}>
        <div className={styles.envelope}></div>
        <div className={styles.front}></div>
        <div
          className={`${styles.card} ${isHovered ? styles.cardHovered : ""}`}
        >
          <div className={styles.text}>
            Ini
            <br /> Pengumuman
            <br /> Seleksi {"?"}
          </div>
          <div className={styles.magnifier}>
            <div className={styles["magnifier-circle"]}></div>
            <div className={styles["magnifier-handle"]}></div>
          </div>
        </div>
        {/* Animasi hearts bisa diubah jadi pin/sidik jari jika ingin sekalian */}
      </div>
      {/* <div className={styles.shadow}></div> */}
    </div>
  );
}
