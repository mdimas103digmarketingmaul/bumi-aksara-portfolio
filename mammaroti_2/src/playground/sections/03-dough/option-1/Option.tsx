"use client";

import { useState } from "react";
import { OptionFrame } from "../../../components/OptionFrame";
import { doughOrder, doughs, type DoughVariant } from "../doughData";
import styles from "./styles.module.css";

export default function DoughOption1() {
  const [active, setActive] = useState<DoughVariant>("original");
  const dough = doughs[active];

  return (
    <OptionFrame
      sectionSlug="03-dough"
      sectionTitle="Our Dough"
      optionLabel="Option 1 · Flavor Switch"
    >
      <section
        className={`${styles.section} ${active === "taro" ? styles.taro : styles.original}`}
        aria-label="Our Dough — interactive flavor switch"
      >
        <div className={styles.topline}>
          <span>03 / OUR DOUGH</span>
          <span>Choose your dough</span>
        </div>

        <div className={styles.layout}>
          <div className={styles.selector} aria-label="Pilih dough">
            {doughOrder.map((id) => {
              const item = doughs[id];
              const selected = id === active;
              return (
                <button
                  className={`${styles.flavorButton} ${selected ? styles.selected : ""}`}
                  key={id}
                  type="button"
                  onClick={() => setActive(id)}
                  aria-pressed={selected}
                >
                  <span>{item.number}</span>
                  <strong>{item.name}</strong>
                </button>
              );
            })}
          </div>

          <div className={styles.visual}>
            <div className={styles.wordmark} aria-hidden="true">{dough.name}</div>
            <div className={styles.halo} aria-hidden="true" />
            <img
              key={dough.id}
              className={styles.doughImage}
              src={dough.image}
              alt={`MammaRoti ${dough.name} dengan isian custard`}
            />
            <span className={styles.variantBadge}>{dough.number} / 02</span>
          </div>

          <div className={styles.fillings}>
            <span className={styles.label}>Filling choices</span>
            <ol>
              {dough.fillings.map((filling, index) => (
                <li key={filling}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{filling}</strong>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className={styles.bottomline}>
          <span>CRUNCH OUTSIDE · SOFT INSIDE</span>
          <span>Switch Original ↔ Taro</span>
        </div>
      </section>
    </OptionFrame>
  );
}
