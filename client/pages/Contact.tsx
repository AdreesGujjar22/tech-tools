import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, Clock, Twitter, Linkedin, Github, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || process.env.VITE_EMAILJS_SERVICE_ID || "";
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || process.env.VITE_EMAILJS_TEMPLATE_ID || "";
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY || "";

      if (!serviceId || !templateId || !publicKey) {
        toast.error("EmailJS configuration is missing. Please check environment variables.");
        setIsLoading(false);
        return;
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        publicKey
      );

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("EmailJS error:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Background Gradient */}
        <div
          className="absolute inset-0 w-full h-96 bg-hero-radial pointer-events-none"
          style={{ top: "0" }}
        />

        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight gradient-text">
              Contact TechTools
            </h1>
            <p className="text-lg text-[#C7C4D8] max-w-[800px] mx-auto leading-relaxed">
              Have questions, feedback, or need support? We're here to help. Reach out to us and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="glass-card-dark p-8 rounded-[24px]">
                <h2 className="text-2xl font-semibold text-[#DAE2FD] mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-[#C7C4D8]">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-[12px] bg-[rgba(23,31,51,0.60)] border border-[#464555] text-[#DAE2FD] placeholder-[#918FA1] focus:outline-none focus:border-[#C3C0FF] transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-[#C7C4D8]">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-[12px] bg-[rgba(23,31,51,0.60)] border border-[#464555] text-[#DAE2FD] placeholder-[#918FA1] focus:outline-none focus:border-[#C3C0FF] transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-[#C7C4D8]">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-[12px] bg-[rgba(23,31,51,0.60)] border border-[#464555] text-[#DAE2FD] placeholder-[#918FA1] focus:outline-none focus:border-[#C3C0FF] transition-colors"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-[#C7C4D8]">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-[12px] bg-[rgba(23,31,51,0.60)] border border-[#464555] text-[#DAE2FD] placeholder-[#918FA1] focus:outline-none focus:border-[#C3C0FF] transition-colors resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-4 rounded-[12px] bg-gradient-indigo-cyan text-white font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_20px_25px_-5px_rgba(79,70,229,0.20)]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="glass-card-dark p-6 rounded-[24px]">
                <h2 className="text-2xl font-semibold text-[#DAE2FD] mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[12px] bg-[rgba(195,192,255,0.10)] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-[#C3C0FF]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#DAE2FD] mb-1">Email</h3>
                      <p className="text-sm text-[#C7C4D8]">support@techtools.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[12px] bg-[rgba(76,215,246,0.10)] flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#4CD7F6]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#DAE2FD] mb-1">Support</h3>
                      <p className="text-sm text-[#C7C4D8]">Available 24/7 for urgent issues</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-[12px] bg-[rgba(255,180,171,0.10)] flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#FFB4AB]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#DAE2FD] mb-1">Availability</h3>
                      <p className="text-sm text-[#C7C4D8]">Mon - Fri: 9AM - 6PM UTC</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="glass-card-dark p-6 rounded-[24px]">
                <h2 className="text-2xl font-semibold text-[#DAE2FD] mb-6">Follow Us</h2>
                <div className="flex gap-4">
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-[12px] bg-[rgba(195,192,255,0.10)] flex items-center justify-center hover:bg-[rgba(195,192,255,0.20)] transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-[#C3C0FF]" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-[12px] bg-[rgba(76,215,246,0.10)] flex items-center justify-center hover:bg-[rgba(76,215,246,0.20)] transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-[#4CD7F6]" />
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-[12px] bg-[rgba(255,180,171,0.10)] flex items-center justify-center hover:bg-[rgba(255,180,171,0.20)] transition-colors"
                  >
                    <Github className="w-5 h-5 text-[#FFB4AB]" />
                  </a>
                </div>
              </div>

              {/* Quick Response */}
              <div className="glass-card-dark p-6 rounded-[24px] bg-gradient-card">
                <h2 className="text-xl font-semibold text-[#DAE2FD] mb-3">Quick Response</h2>
                <p className="text-sm text-[#C7C4D8]">
                  We typically respond to all inquiries within 24 hours. For urgent matters, please include "URGENT" in your subject line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
