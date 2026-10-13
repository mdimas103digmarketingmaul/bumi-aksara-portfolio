import type { Metadata } from 'next';
import { RedesignOption1 } from '../../../../../playground/compositions/redesign/option-1/Composition';

export const metadata: Metadata = {
  title: 'MammaRoti — Redesign Option 1 (Pull-apart)',
  description: 'Your everyday coffebun',
};

export default function Page() {
  return <RedesignOption1 />;
}
