import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ADMIN_PASSWORD, unlock } from "@/lib/studioAuth";
import { toast } from "sonner";

export default function StudioGate({ onUnlock }: { onUnlock: () => void }) {
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(0);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow, noarchive";
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = "Studio · Restricted";
    return () => {
      document.head.removeChild(meta);
      document.title = prevTitle;
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    if (pwd === ADMIN_PASSWORD) {
      unlock();
      toast.success("Welcome to the Studio");
      onUnlock();
    } else {
      setShake((s) => s + 1);
      toast.error("Incorrect access key");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-deep px-6 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-purple-glow/20 blur-3xl" />
      </div>

      <motion.div
        key={shake}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          x: shake ? [0, -10, 10, -8, 8, 0] : 0,
        }}
        transition={{ duration: shake ? 0.4 : 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-purple-deep/60 backdrop-blur-xl border border-gold/20 rounded-2xl p-10 shadow-elevated">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center mb-5 bg-gold/5">
              <Lock className="w-5 h-5 text-gold" />
            </div>
            <p className="eyebrow mb-3">Restricted</p>
            <h1 className="font-display text-3xl text-primary-foreground mb-2">
              The Magicorn <span className="text-gold italic">Studio</span>
            </h1>
            <div className="gold-divider mx-auto my-3" />
            <p className="text-sm text-primary-foreground/60 max-w-xs">
              Internal media management. Enter your access key to continue.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <Input
              type="password"
              autoFocus
              placeholder="Access key"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="h-12 bg-purple-deep/40 border-gold/20 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-gold/40 focus-visible:border-gold/40"
            />
            <button
              type="submit"
              disabled={loading || !pwd}
              className="w-full h-12 rounded-md border border-gold text-gold tracking-[0.25em] text-xs uppercase font-medium hover:bg-gold/10 hover:shadow-gold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                  <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse [animation-delay:120ms]" />
                  <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse [animation-delay:240ms]" />
                </span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Enter Studio
                </>
              )}
            </button>
          </form>
        </div>
        <p className="text-center text-[10px] tracking-[0.3em] uppercase text-primary-foreground/30 mt-6">
          The Magicorn · Internal
        </p>
      </motion.div>
    </div>
  );
}
