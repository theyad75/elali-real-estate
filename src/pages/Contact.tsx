import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, WHATSAPP_URL } from "@/lib/contact";

const Contact = () => {
  const { language, t } = useLanguage();

  return (
    <div className="py-20">
      <div className="container max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold font-display text-foreground mb-4">
            {t.footer.contactUs}
          </h1>
          <p className="text-muted-foreground font-body">
            {language === "ar" ? "تواصل معنا اليوم ودعنا نساعدك" : "Get in touch with us today and let us help you"}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {[
              { icon: Phone, label: CONTACT_PHONE_DISPLAY },
              { icon: Mail, label: CONTACT_EMAIL },
              { icon: MapPin, label: t.footer.address },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                <item.icon className="h-6 w-6 text-accent" />
                <span className="font-body text-foreground">{item.label}</span>
              </div>
            ))}

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl bg-accent p-4 text-accent-foreground font-semibold font-body transition-all hover:opacity-90"
            >
              <MessageCircle className="h-6 w-6" />
              {t.cta.button}
            </a>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder={language === "ar" ? "الاسم" : "Name"}
              className="w-full rounded-xl bg-secondary px-5 py-4 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-accent transition-colors"
            />
            <input
              type="email"
              placeholder={language === "ar" ? "البريد الإلكتروني" : "Email"}
              className="w-full rounded-xl bg-secondary px-5 py-4 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-accent transition-colors"
            />
            <textarea
              rows={4}
              placeholder={language === "ar" ? "الرسالة" : "Message"}
              className="w-full rounded-xl bg-secondary px-5 py-4 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-accent transition-colors resize-none"
            />
            <button className="w-full rounded-xl bg-accent px-6 py-4 text-sm font-semibold text-accent-foreground font-body transition-all hover:opacity-90">
              {language === "ar" ? "إرسال" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
