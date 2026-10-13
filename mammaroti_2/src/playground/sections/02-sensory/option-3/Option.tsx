import { OptionFrame } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

export function SensoryOption3Content() {
  return (
    <section className={styles.section} aria-label="Sensory Experience — Immersive Compass">
      <div className={styles.noise} aria-hidden="true" />

      <header className={styles.heading}>
        <span>04 SENSORY NOTES</span>
        <h1>Taste it<br />before you<br />name it.</h1>
      </header>

      <div className={styles.compass}>
        <div className={`${styles.ring} ${styles.ringOuter}`} />
        <div className={`${styles.ring} ${styles.ringMiddle}`} />
        <div className={`${styles.ring} ${styles.ringInner}`} />

        <img
          className={styles.bun}
          src="/images/split-bun.webp"
          alt="Coffee bun MammaRoti terbelah"
        />

        <div className={`${styles.marker} ${styles.markerTop}`}>
          <b>CRUNCHY</b><span>first bite</span>
        </div>
        <div className={`${styles.marker} ${styles.markerRight}`}>
          <b>MELT</b><span>soft center</span>
        </div>
        <div className={`${styles.marker} ${styles.markerBottom}`}>
          <b>SWEET</b><span>balanced finish</span>
        </div>
        <div className={`${styles.marker} ${styles.markerLeft}`}>
          <b>JOY</b><span>familiar aroma</span>
        </div>

        <div className={`${styles.beacon} ${styles.beaconTop}`} />
        <div className={`${styles.beacon} ${styles.beaconRight}`} />
        <div className={`${styles.beacon} ${styles.beaconBottom}`} />
        <div className={`${styles.beacon} ${styles.beaconLeft}`} />
      </div>

      <aside className={styles.sideCopy}>
        <span>YOUR EVERYDAY COFFEEBUN</span>
        <p>Empat sensasi. Satu pengalaman yang kembali terasa familiar setiap kali MammaRoti hadir hangat di tangan.</p>
      </aside>

      <div className={styles.counter}>02 / 10</div>
    </section>
  );
}

export default function SensoryOption3() {
  return (
    <OptionFrame
      sectionSlug="02-sensory"
      sectionTitle="Sensory Experience"
      optionLabel="Option 3 · Immersive Compass"
    >
      <SensoryOption3Content />
    </OptionFrame>
  );
}
