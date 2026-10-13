import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./CompositionFrame.module.css";

type Props = {
  label: string;
  strategy: string;
  children: ReactNode;
};

export function CompositionFrame({ label, strategy, children }: Props) {
  return (
    <div className={styles.preview}>
      {children}
      <aside className={styles.controls} aria-label="Composition playground controls">
        <div className={styles.meta}>
          <small>{label}</small>
          <strong>{strategy}</strong>
          <span>02: Option 3 · 03: Option 2</span>
        </div>
        <div className={styles.links}>
          <Link href="/playground/compositions">Compare</Link>
          <Link href="/playground">Dashboard</Link>
        </div>
      </aside>
    </div>
  );
}
