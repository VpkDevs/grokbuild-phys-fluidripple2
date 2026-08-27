import { useCallback, useEffect, useRef, useState } from "react";
import { ControlDock } from "@/components/control-dock";
import { RippleEngine } from "@/lib/ripple/engine";
import type { ColorMapId } from "@/lib/ripple/palettes";
import { loadSettings, saveSettings } from "@/lib/ripple/settings";
import { cn } from "@/lib/utils";

type TestApi = {
  splash: (x: number, y: number) => void;
  clear: () => void;
  getEnergy: () => number;
  setColorMap: (id: ColorMapId) => void;
};

declare global {
  interface Window {
    __rippleTest?: TestApi;
  }
}

export function RippleStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<RippleEngine | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState(loadSettings);
  const [hint, setHint] = useState(true);
  const [finePointer, setFinePointer] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applySettings = useCallback(
    (next: Partial<typeof settings>) => {
      setSettings((prev) => {
        const merged = { ...prev, ...next };
        saveSettings(merged);
        const engine = engineRef.current;
        if (engine) {
          engine.setViscosity(merged.viscosity);
          engine.setStrength(merged.strength);
          engine.setColorMap(merged.colorMap);
        }
        return merged;
      });
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let engine: RippleEngine;
    try {
      engine = new RippleEngine(canvas);
      engine.setViscosity(settings.viscosity);
      engine.setStrength(settings.strength);
      engine.setColorMap(settings.colorMap);
      engine.start();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start the surface.");
      return;
    }
    engineRef.current = engine;

    const api: TestApi = {
      splash: (x, y) => engine.splash(x, y),
      clear: () => engine.clear(),
      getEnergy: () => engine.getEnergy(),
      setColorMap: (id) => {
        applySettings({ colorMap: id });
      },
    };
    window.__rippleTest = api;

    const onResize = () => engine.resize();
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas.parentElement ?? canvas);
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);

    const onKey = (event: KeyboardEvent) => {
      if (event.code === "KeyC" || event.code === "Space") {
        const target = event.target as HTMLElement | null;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
          return;
        }
        event.preventDefault();
        engine.clear();
      }
    };
    window.addEventListener("keydown", onKey);

    const mq = window.matchMedia("(pointer: fine)");
    const syncPointer = () => setFinePointer(mq.matches);
    syncPointer();
    mq.addEventListener("change", syncPointer);

    const onVis = () => {
      if (document.hidden) engine.pointerUp(-1);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      delete window.__rippleTest;
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", syncPointer);
      document.removeEventListener("visibilitychange", onVis);
      engine.destroy();
      engineRef.current = null;
    };
    // Engine is created once; settings flow through applySettings.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const localPoint = (event: PointerEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const moveCursor = (x: number, y: number, visible: boolean) => {
    const el = cursorRef.current;
    if (!el) return;
    el.style.opacity = visible ? "1" : "0";
    el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const engine = engineRef.current;
    if (!engine) return;
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    const { x, y } = localPoint(event.nativeEvent, canvas);
    const coalesced =
      event.nativeEvent.getCoalescedEvents?.() ?? [event.nativeEvent];
    const first = coalesced[0] ?? event.nativeEvent;
    const start = localPoint(first, canvas);
    engine.pointerDown(event.pointerId, start.x, start.y, event.pressure);
    for (let i = 1; i < coalesced.length; i++) {
      const ce = coalesced[i];
      if (!ce) continue;
      const p = localPoint(ce, canvas);
      engine.pointerMove(event.pointerId, p.x, p.y, ce.pressure);
    }
    setHint(false);
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      moveCursor(x, y, true);
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const { x, y } = localPoint(event.nativeEvent, canvas);
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      moveCursor(x, y, true);
    }
    const engine = engineRef.current;
    if (!engine || !canvas.hasPointerCapture(event.pointerId)) return;
    const coalesced =
      event.nativeEvent.getCoalescedEvents?.() ?? [event.nativeEvent];
    for (const ce of coalesced) {
      const p = localPoint(ce, canvas);
      engine.pointerMove(event.pointerId, p.x, p.y, ce.pressure);
    }
  };

  const endPointer = (event: React.PointerEvent<HTMLCanvasElement>) => {
    engineRef.current?.pointerUp(event.pointerId);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className="relative h-full min-h-0 w-full select-none overflow-hidden bg-bg text-fg">
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 size-full touch-none",
          finePointer && "cursor-none",
        )}
        aria-label="Ripple surface"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onPointerLeave={() => moveCursor(0, 0, false)}
        onContextMenu={(event) => event.preventDefault()}
      />

      {finePointer ? (
        <div ref={cursorRef} className="ripple-cursor" aria-hidden="true" />
      ) : null}

      <div className="dock-slot">
        <ControlDock
          viscosity={settings.viscosity}
          strength={settings.strength}
          colorMap={settings.colorMap}
          onViscosity={(viscosity) => applySettings({ viscosity })}
          onStrength={(strength) => applySettings({ strength })}
          onColorMap={(colorMap) => applySettings({ colorMap })}
          onClear={() => engineRef.current?.clear()}
        />
      </div>

      <p
        className={cn(
          "hint-copy text-center text-sm text-muted",
          "transition-opacity duration-[var(--motion-slow)] ease-[var(--ease-smooth-out)]",
          hint ? "opacity-100" : "opacity-0",
        )}
      >
        Drag across the surface
      </p>

      {error ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-bg p-6 text-center">
          <p className="max-w-sm text-sm text-muted">{error}</p>
        </div>
      ) : null}
    </div>
  );
}
