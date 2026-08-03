import { useState } from "react";
import { Mail, Phone, Clock, Twitter, Linkedin, Github, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function Contact() {
  const t = useTranslations("Contact");
  const faqs = getFaqsForRoute("unknown-slug");
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
        toast.error(t("errors.configurationMissing"));
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

      toast.success(t("success.sent"));
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("EmailJS error:", error);
      toast.error(t("errors.sendFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      {/* Hero Section */}
      <section className="section-py section-px relative overflow-hidden">
        {/* Background Gradient */}
        <div
          className="absolute inset-0 w-full h-96 bg-hero-radial pointer-events-none"
          style={{ top: "0" }}
        />

        <div className="container-full relative z-10">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight gradient-text">
              {t("title")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("description")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-py section-px">
        <div className="container-full">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2 animate-slide-up">
              <div className="premium-card p-8 rounded-3xl border border-border/40 hover:shadow-lg transition-all">
                <h2 className="text-2xl font-bold mb-8">{t("formTitle")}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-semibold text-foreground">
                        {t("name")}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-modern w-full rounded-xl px-4 py-3"
                        placeholder={t("namePlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold text-foreground">
                        {t("email")}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-modern w-full rounded-xl px-4 py-3"
                        placeholder={t("emailPlaceholder")}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-semibold text-foreground">
                      {t("subject")}
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="input-modern w-full rounded-xl px-4 py-3"
                      placeholder={t("subjectPlaceholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-semibold text-foreground">
                      {t("message")}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="input-modern w-full rounded-xl px-4 py-3 resize-none"
                      placeholder={t("messagePlaceholder")}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    size="md"
                    className="w-full gap-2"
                    isLoading={isLoading}
                  >
                    {!isLoading && <Send className="w-5 h-5" />}
                    {isLoading ? t("sending") : t("sendMessage")}
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6 animate-slide-down">
              <div className="premium-card p-6 rounded-2xl border border-border/40 hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold mb-6">{t("information")}</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{t("email")}</h4>
                      <p className="text-sm text-muted-foreground">support@ilovetechtools.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{t("support")}</h4>
                      <p className="text-sm text-muted-foreground">{t("available")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{t("availability")}</h4>
                      <p className="text-sm text-muted-foreground">{t("hours")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="premium-card p-6 rounded-2xl border border-border/40 hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold mb-6">{t("followUs")}</h3>
                <div className="flex gap-4">
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center hover:bg-primary/20 hover:shadow-md hover:scale-110 transition-all"
                  >
                    <Twitter className="w-5 h-5 text-primary" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center hover:bg-primary/20 hover:shadow-md hover:scale-110 transition-all"
                  >
                    <Linkedin className="w-5 h-5 text-primary" />
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center hover:bg-primary/20 hover:shadow-md hover:scale-110 transition-all"
                  >
                    <Github className="w-5 h-5 text-primary" />
                  </a>
                </div>
              </div>

              {/* Quick Response */}
              <div className="premium-card p-6 rounded-2xl border border-border/40 bg-gradient-indigo-soft hover:shadow-lg transition-all">
                <h3 className="text-lg font-bold mb-3">{t("quickResponse")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("quickResponseText")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </div>
  );
}
