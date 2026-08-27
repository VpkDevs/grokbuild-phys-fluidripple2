import { RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { COLOR_MAPS, type ColorMapId } from "@/lib/ripple/palettes";
import { cn } from "@/lib/utils";

type ControlDockProps = {
  viscosity: number;
  strength: number;
  colorMap: ColorMapId;
  onViscosity: (value: number) => void;
  onStrength: (value: number) => void;
  onColorMap: (id: ColorMapId) => void;
  onClear: () => void;
};

export function ControlDock({
  viscosity,
  strength,
  colorMap,
  onViscosity,
  onStrength,
  onColorMap,
  onClear,
}: ControlDockProps) {
  return (
    <aside
      className={cn(
        "pointer-events-auto w-full max-w-sm",
        "rounded-xl bg-surface/90 p-4 text-fg shadow-[var(--shadow-border)]",
        "backdrop-saturate-150",
        "md:max-w-72",
      )}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-xl leading-tight tracking-display text-fg">
            Wake
          </p>
          <p className="mt-1 text-sm leading-snug text-muted">
            Drag to send a wave.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="shrink-0 rounded-sm"
          onClick={onClear}
        >
          <RotateCcw />
          Clear
        </Button>
      </div>

      <div className="mt-5 space-y-4">
        <Field
          label="Viscosity"
          value={Math.round(viscosity)}
          id="viscosity"
        >
          <Slider
            id="viscosity"
            min={0}
            max={100}
            step={1}
            value={[viscosity]}
            onValueChange={(v) => onViscosity(v[0] ?? viscosity)}
            aria-label="Viscosity"
          />
        </Field>
        <Field
          label="Wave strength"
          value={Math.round(strength)}
          id="strength"
        >
          <Slider
            id="strength"
            min={0}
            max={100}
            step={1}
            value={[strength]}
            onValueChange={(v) => onStrength(v[0] ?? strength)}
            aria-label="Wave strength"
          />
        </Field>
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-subtle">
            Color map
          </p>
          <div
            role="radiogroup"
            aria-label="Color map"
            className="flex flex-wrap gap-2"
          >
            {COLOR_MAPS.map((palette) => {
              const selected = palette.id === colorMap;
              return (
                <button
                  key={palette.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={palette.label}
                  title={palette.label}
                  onClick={() => onColorMap(palette.id)}
                  className={cn(
                    "relative size-11 shrink-0 overflow-hidden rounded-sm p-0",
                    "shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-smooth-out)]",
                    "hover:shadow-[var(--shadow-border-hover)] active:scale-[0.96]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                    selected && "ring-2 ring-fg ring-offset-2 ring-offset-bg",
                  )}
                >
                  <span
                    className="absolute inset-0"
                    style={{ background: palette.swatch }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

function Field({
  label,
  value,
  id,
  children,
}: {
  label: string;
  value: number;
  id: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-fg">
          {label}
        </label>
        <span className="font-mono text-xs tabular-nums text-subtle">
          {value}
        </span>
      </div>
      {children}
    </div>
  );
}
