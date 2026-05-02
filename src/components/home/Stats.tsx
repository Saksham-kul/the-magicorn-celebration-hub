import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 100, suffix: "+", label: "Clients" },
  { value: 50, suffix: "+", label: "Projects" },
  { value: 5, suffix: "+", label: "Industries" },
];

const CountUp = ({ to, suffix }: { to: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * to));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

const Stats = () => {
  return (
    <section className="section-dark py-20 lg:py-28 border-t border-gold/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-6 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative"
            >
              <div
                className="font-display text-5xl md:text-6xl font-semibold text-gold leading-none"
                style={{ textShadow: "0 0 30px hsl(43 72% 53% / 0.25)" }}
              >
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-4 font-body text-xs md:text-sm tracking-[0.3em] uppercase text-primary-foreground/70">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
