import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { Instagram, Mail, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(100, "Name must be under 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email")
    .max(255, "Email must be under 255 characters"),
  message: z
    .string()
    .trim()
    .min(10, "Please share a bit more (10+ characters)")
    .max(1000, "Message must be under 1000 characters"),
});

type FormState = z.infer<typeof contactSchema>;
type FormErrors = Partial<Record<keyof FormState, string>>;

const ContactSection = () => {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FormState;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Please correct the highlighted fields.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    toast.success("Thank you. We'll be in touch shortly.");
    setForm({ name: "", email: "", message: "" });
    setSubmitting(false);
  };

  return (
    <section
      id="contact"
      className="section-dark py-24 lg:py-32 border-t border-gold/10"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="eyebrow">Get In Touch</span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary-foreground mt-4 mb-6">
            Contact Us
          </h2>
          <div className="gold-divider mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 max-w-5xl mx-auto">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 space-y-6"
            noValidate
          >
            <div>
              <label
                htmlFor="name"
                className="block font-body text-xs tracking-[0.25em] uppercase text-primary-foreground/70 mb-3"
              >
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                maxLength={100}
                aria-invalid={!!errors.name}
                className="h-12 rounded-none bg-transparent border-0 border-b border-gold/30 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-0 focus-visible:border-gold focus:border-gold px-0"
              />
              {errors.name && (
                <p className="mt-2 text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-body text-xs tracking-[0.25em] uppercase text-primary-foreground/70 mb-3"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                maxLength={255}
                aria-invalid={!!errors.email}
                className="h-12 rounded-none bg-transparent border-0 border-b border-gold/30 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-0 focus-visible:border-gold focus:border-gold px-0"
              />
              {errors.email && (
                <p className="mt-2 text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="message"
                className="block font-body text-xs tracking-[0.25em] uppercase text-primary-foreground/70 mb-3"
              >
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                maxLength={1000}
                aria-invalid={!!errors.message}
                className="rounded-none bg-transparent border-0 border-b border-gold/30 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-0 focus-visible:border-gold focus:border-gold px-0 resize-none"
              />
              {errors.message && (
                <p className="mt-2 text-xs text-destructive">
                  {errors.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="btn-magical rounded-none px-10 py-6 font-body text-xs tracking-[0.25em]"
            >
              {submitting ? "SENDING…" : (<>SEND MESSAGE <Send className="ml-2 w-4 h-4" /></>)}
            </Button>
          </motion.form>

          {/* Contact details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-2 space-y-8 lg:pl-8 lg:border-l lg:border-gold/15"
          >
            <div>
              <div className="eyebrow mb-2">Email</div>
              <a
                href="mailto:collectives@themagicorn.com"
                className="font-body text-primary-foreground/80 hover:text-gold transition-colors flex items-center gap-3"
              >
                <Mail className="w-4 h-4 text-gold" strokeWidth={1.25} />
                collectives@themagicorn.com
              </a>
            </div>
            <div>
              <div className="eyebrow mb-2">Phone</div>
              <a
                href="tel:+919910105734"
                className="font-body text-primary-foreground/80 hover:text-gold transition-colors flex items-center gap-3"
              >
                <Phone className="w-4 h-4 text-gold" strokeWidth={1.25} />
                +91 99101 05734
              </a>
            </div>
            <div>
              <div className="eyebrow mb-2">Instagram</div>
              <a
                href="https://instagram.com/the_magicorn"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-primary-foreground/80 hover:text-gold transition-colors flex items-center gap-3"
              >
                <Instagram className="w-4 h-4 text-gold" strokeWidth={1.25} />
                @the_magicorn
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
