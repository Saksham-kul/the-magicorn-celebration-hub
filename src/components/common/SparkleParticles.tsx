import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x?: number;
  y?: number;
  angle?: number;
  distance?: number;
  size: number;
  duration: number;
  delay: number;
}

interface SparkleParticlesProps {
  count?: number;
  variant?: "radial" | "scattered";
}

const SparkleParticles = ({ count = 15, variant = "radial" }: SparkleParticlesProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (variant === "radial") {
      // Radiating sparkles from center (for logo)
      const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
        id: i,
        angle: (360 / count) * i + (Math.random() - 0.5) * 30,
        distance: Math.random() * 60 + 40,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 1.5 + 1.5,
        delay: Math.random() * 0.3,
      }));
      setParticles(newParticles);
    } else {
      // Scattered sparkles across entire container (for hero)
      const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1.5,
        duration: Math.random() * 3 + 4,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);
    }
  }, [count, variant]);

  if (variant === "radial") {
    // Radial layout for logo
    return (
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => {
          const radians = ((particle.angle || 0) * Math.PI) / 180;
          const xEnd = Math.cos(radians) * (particle.distance || 0);
          const yEnd = Math.sin(radians) * (particle.distance || 0);

          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-gradient-to-r from-gold to-yellow-300 shadow-lg"
              style={{
                left: "50%",
                top: "50%",
                width: particle.size,
                height: particle.size,
                marginLeft: -particle.size / 2,
                marginTop: -particle.size / 2,
              }}
              animate={{
                x: xEnd,
                y: yEnd,
                opacity: [0, 1, 0.8, 0],
                scale: [0.5, 1, 0.8, 0],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          );
        })}
      </div>
    );
  }

  // Scattered layout for hero
  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gold"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            opacity: [0, 0.5, 0.4, 0],
            scale: [0, 0.95, 0.75, 0],
            y: [0, -80, -120],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default SparkleParticles;
