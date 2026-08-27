export type ColorMapId = "abyss" | "tide" | "ink" | "glacier" | "copper";

export type Palette = {
  id: ColorMapId;
  label: string;
  /** Four RGB stops, 0–1, dark → highlight. */
  stops: readonly [Rgb, Rgb, Rgb, Rgb];
  swatch: string;
};

type Rgb = readonly [number, number, number];

export const COLOR_MAPS: readonly Palette[] = [
  {
    id: "abyss",
    label: "Abyss",
    stops: [
      [0.02, 0.05, 0.08],
      [0.04, 0.2, 0.3],
      [0.12, 0.48, 0.5],
      [0.74, 0.91, 0.88],
    ],
    swatch: "linear-gradient(135deg, #0a1418 0%, #0a334d 48%, #bde8e0 100%)",
  },
  {
    id: "tide",
    label: "Tide",
    stops: [
      [0.02, 0.08, 0.07],
      [0.05, 0.3, 0.24],
      [0.2, 0.58, 0.46],
      [0.72, 0.91, 0.78],
    ],
    swatch: "linear-gradient(135deg, #0a1614 0%, #0d4a3d 48%, #b8e8c7 100%)",
  },
  {
    id: "ink",
    label: "Ink",
    stops: [
      [0.035, 0.035, 0.04],
      [0.16, 0.16, 0.18],
      [0.4, 0.4, 0.44],
      [0.88, 0.87, 0.84],
    ],
    swatch: "linear-gradient(135deg, #0c0c0e 0%, #3a3a42 50%, #e0ded6 100%)",
  },
  {
    id: "glacier",
    label: "Glacier",
    stops: [
      [0.04, 0.08, 0.14],
      [0.12, 0.3, 0.44],
      [0.42, 0.64, 0.8],
      [0.9, 0.94, 0.98],
    ],
    swatch: "linear-gradient(135deg, #0c1824 0%, #1e4e70 48%, #e4f0fa 100%)",
  },
  {
    id: "copper",
    label: "Copper",
    stops: [
      [0.08, 0.035, 0.025],
      [0.34, 0.14, 0.08],
      [0.64, 0.36, 0.18],
      [0.94, 0.84, 0.7],
    ],
    swatch: "linear-gradient(135deg, #160c08 0%, #5c2814 48%, #f0d6b2 100%)",
  },
] as const;

export const DEFAULT_COLOR_MAP: ColorMapId = "abyss";

export function getPalette(id: ColorMapId): Palette {
  return COLOR_MAPS.find((p) => p.id === id) ?? COLOR_MAPS[0];
}

export function samplePalette(stops: Palette["stops"], t: number): Rgb {
  const x = Math.min(1, Math.max(0, t));
  if (x < 1 / 3) return mixRgb(stops[0], stops[1], x / (1 / 3));
  if (x < 2 / 3) return mixRgb(stops[1], stops[2], (x - 1 / 3) / (1 / 3));
  return mixRgb(stops[2], stops[3], (x - 2 / 3) / (1 / 3));
}

function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  const k = Math.min(1, Math.max(0, t));
  return [
    a[0] + (b[0] - a[0]) * k,
    a[1] + (b[1] - a[1]) * k,
    a[2] + (b[2] - a[2]) * k,
  ];
}
