import { DEFAULT_COLOR_MAP, type ColorMapId } from "./palettes";

const KEY = "wake.settings.v1";

export type RippleSettings = {
  viscosity: number;
  strength: number;
  colorMap: ColorMapId;
};

export const DEFAULT_SETTINGS: RippleSettings = {
  viscosity: 32,
  strength: 64,
  colorMap: DEFAULT_COLOR_MAP,
};

export function loadSettings(): RippleSettings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<RippleSettings>;
    return {
      viscosity: clampNum(parsed.viscosity, 0, 100, DEFAULT_SETTINGS.viscosity),
      strength: clampNum(parsed.strength, 0, 100, DEFAULT_SETTINGS.strength),
      colorMap: isColorMap(parsed.colorMap)
        ? parsed.colorMap
        : DEFAULT_SETTINGS.colorMap,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: RippleSettings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    /* private mode / quota */
  }
}

function clampNum(value: unknown, min: number, max: number, fallback: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : fallback;
}

function isColorMap(value: unknown): value is ColorMapId {
  return (
    value === "abyss" ||
    value === "tide" ||
    value === "ink" ||
    value === "glacier" ||
    value === "copper"
  );
}
