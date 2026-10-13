"use client";

import { useState } from "react";
import { OptionFrame } from "../../../components/OptionFrame";
import { doughOrder, doughs, type DoughVariant } from "../doughData";
import styles from "./styles.module.css";

export default function DoughOption3() {
  const [active, setActive] = useState<DoughVariant>("original");
  const dough = doughs[active];

  return (
    <OptionFrame
      sectionSlug="03-dough"
      sectionTitle="Our Dough"
      optionLabel="Option 3 · Custard Index"
    >
      <section className={styles.section} aria-label="Our Dough — editorial custard index">
        <div className={styles.marquee} aria-hidden="true">
          <div>OUR DOUGH · CUSTARD INDEX · OUR DOUGH · CUSTARD INDEX · OUR DOUGH · CUSTARD INDEX ·</div>
        </div>

        <div className={styles.sheet}>
          <header className={styles.header}>
            <div>
              <span className={styles.kicker}>MAMMAROTI FIELD NOTES / 03</span>
              <h1>Our<br />Dough</h1>
            </div>
            <p>
              Dua karakter dough, beberapa pilihan custard. Gunakan index ini untuk menjelajahi tiap varian.
            </p>
          </header>

          <div className={styles.tabs} role="group" aria-label="Dough variant">
            {doughOrder.map((id) => {
              const item = doughs[id];
              const selected = id === active;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selected}
                  className={selected ? styles.activeTab : ""}
                  onClick={() => setActive(id)}
                >
                  <span>{item.number}</span>
                  {item.name}
                </button>
              );
            })}
          </div>

          <div className={styles.content}>
            <div className={`${styles.photoPanel} ${active === "taro" ? styles.taroPanel : ""}`}>
              <span className={styles.bigNumber}>{dough.number}</span>
              <img
                key={dough.id}
                src={dough.image}
                alt={`MammaRoti ${dough.name} dengan isian custard`}
              />
              <span className={styles.flavorStamp}>{dough.name}</span>
            </div>

            <div className={styles.indexPanel}>
              <div className={styles.indexHead}>
                <span>FILLING INDEX</span>
                <span>{String(dough.fillings.length).padStart(2, "0")} CHOICES</span>
              </div>
              <ol>
                {dough.fillings.map((filling, index) => (
                  <li key={filling}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{filling}</strong>
                    <span className={styles.arrow}>↗</span>
                  </li>
                ))}
              </ol>
              <div className={styles.note}>
                <span>NOTE</span>
                <p>Tap Original atau Taro untuk mengganti lembar pilihan tanpa meninggalkan section.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </OptionFrame>
  );
}
