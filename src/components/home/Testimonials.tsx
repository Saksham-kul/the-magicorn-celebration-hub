import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Bride",
    content:
      "The Magicorn made our wedding absolutely magical! The trousseau packing was exquisite, and every detail was perfect. Our guests couldn't stop complimenting the beautiful packaging.",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    role: "Corporate Client",
    content:
      "We've been working with The Magicorn for our corporate gifting needs for over 2 years. Their attention to detail and ability to customize gifts for our brand is exceptional.",
    rating: 5,
  },
  {
    name: "Ananya Patel",
    role: "Birthday Party Host",
    content:
      "My daughter's birthday party was a dream come true! The decorations, the theme execution, everything was beyond perfect. The Magicorn truly brings magic to celebrations.",
    rating: 5,
  },
  {
    name: "Vikram Mehta",
    role: "Anniversary Celebration",
    content:
      "Surprised my wife with a beautifully curated anniversary hamper. The presentation was stunning and the selection of items showed incredible thoughtfulness. Highly recommend!",
    rating: 5,
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-24 lg:py-32 bg-purple-deep relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-light/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block font-body text-sm tracking-[0.3em] uppercase text-gold mb-4">
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
            What Our <span className="text-gradient-gold">Clients Say</span>
          </h2>
          <div className="decorative-line w-24 mx-auto" />
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Quote className="w-16 h-16 text-gold/30 mx-auto mb-8" />
              
              <p className="font-body text-xl md:text-2xl text-primary-foreground/90 leading-relaxed mb-8 italic">
                "{testimonials[currentIndex].content}"
              </p>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1 mb-6">
                {Array.from({ length: testimonials[currentIndex].rating }).map(
                  (_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-gold fill-gold"
                    />
                  )
                )}
              </div>

              {/* Author */}
              <h4 className="font-display text-xl font-semibold text-primary-foreground">
                {testimonials[currentIndex].name}
              </h4>
              <p className="font-body text-gold">
                {testimonials[currentIndex].role}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-purple-deep transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-gold"
                      : "bg-gold/30 hover:bg-gold/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-purple-deep transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
