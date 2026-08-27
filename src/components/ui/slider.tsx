import * as SliderPrimitive from "@radix-ui/react-slider";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Slider({
  className,
  ...props
}: ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex h-11 w-full touch-none select-none items-center",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-surface-subtle">
        <SliderPrimitive.Range className="absolute h-full bg-accent" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-4 rounded-full bg-fg shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-[var(--motion-quick)] ease-[var(--ease-smooth-out)] hover:shadow-[var(--shadow-border-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg" />
    </SliderPrimitive.Root>
  );
}
