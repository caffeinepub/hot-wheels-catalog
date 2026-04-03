import { Toaster } from "@/components/ui/sonner";
import CatalogApp from "./components/CatalogApp";
import WelcomeScreen from "./components/WelcomeScreen";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "radial-gradient(ellipse at center, #2A0B0E 0%, #0B0C10 70%)",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-hw-accent border-t-transparent animate-spin" />
          <p className="text-hw-muted text-sm font-body">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {identity ? <CatalogApp /> : <WelcomeScreen />}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#111217",
            color: "#F2F2F2",
            border: "1px solid rgba(255,59,48,0.3)",
          },
        }}
      />
    </>
  );
}
