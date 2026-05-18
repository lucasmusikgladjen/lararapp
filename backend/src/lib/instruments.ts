import { normalizeMultiSelect, parseMultiSelect } from '../services/airtable';

export { normalizeMultiSelect, parseMultiSelect };
export const INSTRUMENTS = ['Piano', 'Gitarr', 'Sång', 'Fiol', 'Trummor', 'Bas'] as const;
export type Instrument = typeof INSTRUMENTS[number];

export function instrumentsOverlap(a: string, b: string): boolean {
  const listA = a.split(/,\s*/).map(s => s.toLowerCase().trim()).filter(Boolean);
  const listB = b.split(/,\s*/).map(s => s.toLowerCase().trim()).filter(Boolean);
  return listA.some(ia => listB.includes(ia));
}

export function getInstrumentOverlap(a: string, b: string): string {
  const listA = a.split(/,\s*/).map(s => s.trim()).filter(Boolean);
  const listB = b.split(/,\s*/).map(s => s.toLowerCase().trim()).filter(Boolean);
  return listA.find(ia => listB.includes(ia.toLowerCase())) || '';
}
