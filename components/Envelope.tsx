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
            <br /> Seleksi {"<3"}
          </div>
          <div className={styles.heart}></div>
        </div>
        <div className={styles.hearts}>
          <div className={styles.one}></div>
          <div className={styles.two}></div>
          <div className={styles.three}></div>
          <div className={styles.four}></div>
          <div className={styles.five}></div>
        </div>
      </div>
      {/* <div className={styles.shadow}></div> */}
    </div>
  );
}
