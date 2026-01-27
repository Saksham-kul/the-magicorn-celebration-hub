import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, Instagram, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

const eventTypes = [
  "Birthday Party",
  "Wedding",
  "Corporate Event",
  "Baby Shower",
  "Anniversary",
  "Other",
];

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Message sent successfully! We'll get back to you soon.", {
      icon: <Sparkles className="w-4 h-4" />,
    });
    
    setFormData({
      name: "",
      email: "",
      phone: "",
      eventType: "",
      eventDate: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-purple-deep relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-64 h-64 bg-gold rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block font-body text-sm tracking-[0.3em] uppercase text-gold mb-4">
                Get In Touch
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Let's Create
                <br />
                <span className="text-gradient-gold">Magic Together</span>
              </h1>
              <p className="font-body text-lg text-primary-foreground/80">
                Ready to plan your celebration? We'd love to hear from you!
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                  Send Us a Message
                </h2>
                <p className="font-body text-muted-foreground mb-8">
                  Fill out the form below and we'll get back to you within 24
                  hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-body text-sm font-medium text-foreground mb-2">
                        Your Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="rounded-lg border-border focus:border-gold focus:ring-gold"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="rounded-lg border-border focus:border-gold focus:ring-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-body text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="rounded-lg border-border focus:border-gold focus:ring-gold"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-medium text-foreground mb-2">
                        Event Type *
                      </label>
                      <Select
                        value={formData.eventType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, eventType: value })
                        }
                      >
                        <SelectTrigger className="rounded-lg border-border bg-background">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border">
                          {eventTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-body text-sm font-medium text-foreground mb-2">
                      Event Date (if known)
                    </label>
                    <Input
                      name="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={handleChange}
                      className="rounded-lg border-border focus:border-gold focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label className="block font-body text-sm font-medium text-foreground mb-2">
                      Tell Us About Your Vision *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your event, theme preferences, budget range, and any special requirements..."
                      rows={5}
                      required
                      className="rounded-lg border-border focus:border-gold focus:ring-gold resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="btn-magical rounded-full px-10 py-6 font-body w-full md:w-auto"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:pl-8"
              >
                <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                  Contact Information
                </h2>
                <p className="font-body text-muted-foreground mb-8">
                  Prefer to reach out directly? Here's how you can contact us.
                </p>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-deep flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                        Phone
                      </h3>
                      <a
                        href="tel:+919876543210"
                        className="font-body text-muted-foreground hover:text-gold transition-colors"
                      >
                        +91 98765 43210
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-deep flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                        Email
                      </h3>
                      <a
                        href="mailto:hello@themagicorn.com"
                        className="font-body text-muted-foreground hover:text-gold transition-colors"
                      >
                        hello@themagicorn.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-deep flex items-center justify-center flex-shrink-0">
                      <Instagram className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                        Instagram
                      </h3>
                      <a
                        href="https://instagram.com/the_magicorn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-muted-foreground hover:text-gold transition-colors"
                      >
                        @the_magicorn
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-deep flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                        Location
                      </h3>
                      <p className="font-body text-muted-foreground">
                        Mumbai, Maharashtra, India
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="mt-12 p-8 bg-cream rounded-2xl">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                    Business Hours
                  </h3>
                  <div className="space-y-2 font-body text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="text-foreground">10:00 AM - 7:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="text-foreground">10:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="text-gold">By Appointment</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
