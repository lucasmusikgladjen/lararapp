export const INSTRUMENTS = ['Piano', 'Gitarr', 'Sång', 'Fiol', 'Trummor', 'Bas'] as const;
export type Instrument = typeof INSTRUMENTS[number];

export function parseMultiSelect(val: unknown): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val) return val.split(',').map(s => s.trim()).filter(Boolean);
  return [];
}
