"use client";
import { useEffect, useState } from "react";
import styles from "../styles/Envelope.module.css";

export default function Envelope() {
  const [isHovered, setIsHovered] = useState(false);

  // Automatically open the envelope after a delay
  useEffect(() => {
    const timer = setTimeout(() => setIsHovered(true), 1000); // 1000ms = 1s
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
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
      </div>
      {/* <div className={styles.shadow}></div> */}
    </div>
  );
}
