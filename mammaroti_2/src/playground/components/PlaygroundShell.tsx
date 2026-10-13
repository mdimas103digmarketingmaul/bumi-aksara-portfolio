import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./PlaygroundShell.module.css";

type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  children: ReactNode;
};

export function PlaygroundShell({ eyebrow = "MammaRoti Design Playground", title, lead, children }: Props) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>MammaRoti Playground</div>
        <nav className={styles.nav} aria-label="Playground navigation">
          <Link href="/playground">Dashboard</Link>
          <Link href="/playground/compositions">Compositions</Link>
          <Link href="/">Production</Link>
        </nav>
      </header>
      <main className={styles.main}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        {lead ? <p className={styles.lead}>{lead}</p> : null}
        {children}
      </main>
    </div>
  );
}

export { styles as playgroundStyles };
