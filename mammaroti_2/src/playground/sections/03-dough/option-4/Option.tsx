"use client";

import { useState } from "react";
import { OptionFrame } from "../../../components/OptionFrame";
import { doughOrder, doughs, type DoughVariant } from "../doughData";
import styles from "./styles.module.css";

export default function DoughOption4() {
  const [active, setActive] = useState<DoughVariant>("original");
  const dough = doughs[active];

  return (
    <OptionFrame
      sectionSlug="03-dough"
      sectionTitle="Our Dough"
      optionLabel="Option 4 · Dough Orbit"
    >
      <section
        className={`${styles.section} ${active === "taro" ? styles.taro : ""}`}
        aria-label="Our Dough — immersive orbit"
      >
        <header className={styles.header}>
          <span>03 · DOUGH LAB</span>
          <div className={styles.switcher} role="group" aria-label="Dough variant">
            {doughOrder.map((id) => (
              <button
                key={id}
                type="button"
                className={active === id ? styles.active : ""}
                aria-pressed={active === id}
                onClick={() => setActive(id)}
              >
                {doughs[id].name}
              </button>
            ))}
          </div>
          <span>02 VARIANTS</span>
        </header>

        <div className={styles.heroCopy}>
          <span>OPEN THE BUN</span>
          <h1>Meet what&apos;s<br />inside.</h1>
        </div>

        <div className={styles.orbitStage}>
          <div className={styles.glow} aria-hidden="true" />
          <div className={`${styles.orbit} ${styles.orbitOne}`} aria-hidden="true" />
          <div className={`${styles.orbit} ${styles.orbitTwo}`} aria-hidden="true" />
          <div className={`${styles.orbit} ${styles.orbitThree}`} aria-hidden="true" />

          <img
            key={dough.id}
            className={styles.doughImage}
            src={dough.image}
            alt={`MammaRoti ${dough.name} dengan isian custard`}
          />

          {dough.fillings.map((filling, index) => (
            <div
              className={`${styles.filling} ${styles[`filling${index + 1}`]}`}
              key={filling}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{filling}</strong>
            </div>
          ))}
        </div>

        <div className={styles.flavorTitle} aria-hidden="true">{dough.name}</div>

        <footer className={styles.footer}>
          <span>{dough.number} / 02</span>
          <span>Hover with your eyes. Switch with your thumb.</span>
          <span>MAMMAROTI</span>
        </footer>
      </section>
    </OptionFrame>
  );
}
