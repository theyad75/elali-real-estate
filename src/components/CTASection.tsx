import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { WHATSAPP_URL } from "@/lib/contact";

const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-accent">
      <div className="container text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display text-accent-foreground mb-4">
            {t.cta.title}
          </h2>
          <p className="text-lg text-accent-foreground/80 font-body mb-8">
            {t.cta.subtitle}
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-xl bg-card px-8 py-4 text-base font-semibold text-foreground shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 font-body"
          >
            <MessageCircle className="h-5 w-5" />
            {t.cta.button}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
