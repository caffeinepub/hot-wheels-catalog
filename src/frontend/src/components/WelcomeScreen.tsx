import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const features = [
  {
    icon: "🚗",
    title: "Browse the full catalog",
    desc: "Search & filter thousands of Hot Wheels models",
  },
  {
    icon: "⭐",
    title: "Save your favorites",
    desc: "Keep track of the cars you love",
  },
  {
    icon: "🛡️",
    title: "Manage your collection",
    desc: "Admins can add, edit, and curate entries",
  },
];

export default function WelcomeScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-6 py-10 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, #2A0B0E 0%, #0B0C10 70%)",
      }}
      data-ocid="welcome.page"
    >
      {/* Ambient glow orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,59,48,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Hero section */}
      <motion.div
        className="flex flex-col items-center gap-5 mt-8 w-full max-w-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="w-24 h-24"
        >
          <img
            src="/assets/generated/hw-flame-logo-transparent.dim_200x200.png"
            alt="Hot Wheels flame"
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Title */}
        <div className="text-center">
          <h1
            className="text-5xl font-display font-black tracking-tighter leading-none"
            style={{
              background:
                "linear-gradient(135deg, #FF3B30 0%, #FF5A1F 50%, #FF3B30 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            HOT WHEELS
          </h1>
          <p className="text-hw-muted text-base font-body mt-1 tracking-widest uppercase text-xs">
            The Ultimate Diecast Catalog
          </p>
        </div>

        {/* Description */}
        <p className="text-center text-hw-muted text-sm leading-relaxed max-w-xs font-body">
          Browse thousands of Hot Wheels models from every year and series.
          Track your collection, discover rare finds, and explore the complete
          catalog. Sign in to get started.
        </p>
      </motion.div>

      {/* Features */}
      <motion.div
        className="w-full max-w-sm flex flex-col gap-3 my-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="flex items-center gap-4 px-4 py-3 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,59,48,0.15)",
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
          >
            <span className="text-2xl">{f.icon}</span>
            <div>
              <p className="text-hw-text text-sm font-semibold font-body">
                {f.title}
              </p>
              <p className="text-hw-muted text-xs font-body">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        className="w-full max-w-sm flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Button
          onClick={login}
          disabled={isLoggingIn}
          className="w-full h-14 text-base font-bold font-display rounded-xl tracking-wide"
          style={{
            background: "linear-gradient(135deg, #FF3B30 0%, #FF5A1F 100%)",
            boxShadow: "0 8px 32px rgba(255,59,48,0.4)",
            border: "none",
            color: "white",
          }}
          data-ocid="welcome.login.button"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Connecting…
            </>
          ) : (
            "Connect with Internet Identity"
          )}
        </Button>

        <p className="text-hw-muted/50 text-xs font-body text-center">
          Powered by{" "}
          <span
            className="font-semibold"
            style={{ color: "rgba(255,59,48,0.7)" }}
          >
            Internet Computer
          </span>
        </p>
      </motion.div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-hw-muted/30 text-xs font-body">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-hw-muted/60 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
