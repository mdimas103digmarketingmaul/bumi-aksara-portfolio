import { OptionPlaceholder } from "../../../components/OptionFrame";
import styles from "./styles.module.css";

export default function ProductsOption1() {
  return (
    <div className={styles.scope}>
      <OptionPlaceholder
        sectionSlug="05-products"
        sectionTitle="Produk Lainnya"
        optionLabel="Option 1"
        fileHint="src/playground/sections/05-products/option-1/Option.tsx"
      />
    </div>
  );
}
