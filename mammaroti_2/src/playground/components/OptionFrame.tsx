import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./OptionFrame.module.css";

type Props = {
  sectionSlug: string;
  sectionTitle: string;
  optionLabel: string;
  children: ReactNode;
};

export function OptionFrame({ sectionSlug, sectionTitle, optionLabel, children }: Props) {
  return (
    <div className={styles.preview}>
      <div className={styles.toolbar}>
        <Link href={`/playground/sections/${sectionSlug}`}>← Compare options</Link>
        <div className={styles.label}>{sectionTitle} · {optionLabel}</div>
        <Link href="/playground">Dashboard</Link>
      </div>
      <div className={styles.stage}>{children}</div>
    </div>
  );
}

export function OptionPlaceholder({
  sectionSlug,
  sectionTitle,
  optionLabel,
  fileHint,
}: {
  sectionSlug: string;
  sectionTitle: string;
  optionLabel: string;
  fileHint: string;
}) {
  return (
    <OptionFrame sectionSlug={sectionSlug} sectionTitle={sectionTitle} optionLabel={optionLabel}>
      <div className={styles.placeholder}>
        <div className={styles.placeholderCard}>
          <small>Ready for exploration</small>
          <h1>{sectionTitle}</h1>
          <p>
            {optionLabel} sudah memiliki URL dan file sendiri. Ganti placeholder ini dengan desain section
            yang ingin diuji. Production existing tidak tersentuh.
          </p>
          <div className={styles.codeHint}>{fileHint}</div>
        </div>
      </div>
    </OptionFrame>
  );
}
