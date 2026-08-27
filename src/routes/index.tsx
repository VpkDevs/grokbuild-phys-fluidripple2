import { createFileRoute } from "@tanstack/react-router";
import { RippleStage } from "@/components/ripple-stage";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="fixed inset-0 overflow-hidden bg-bg">
      <RippleStage />
    </main>
  );
}
