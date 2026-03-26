import { motion } from "framer-motion";
import { Building2, Phone, ShieldCheck, MapPinned } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const officePhoneDisplay = "+961348636";
const officePhoneHref = "tel:+961348636";

const officeParagraphLines = [
  "40 عاماً من الخبرة في عالم العقارات 🏡",
  "تسجيل – بيع – شراء – تقييم الأراضي بدقة عالية",
  "نواكبك بخطوات ثابتة نحو استثمار آمن وناجح",
  "خبرة على مستوى جميع الأراضي اللبنانية",
];

const Office = () => {
  const { language } = useLanguage();

  return (
    <div className="relative overflow-hidden bg-background py-12 md:py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_hsl(var(--accent)/0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_hsl(var(--primary)/0.12),_transparent_32%)]" />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-3xl"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            <Building2 className="h-4 w-4" />
            Office
          </div>

          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-foreground md:text-5xl">
            {language === "ar" ? "المكتب العقاري الحديث" : "Modern Real Estate Office"}
          </h1>

   
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_30px_80px_-40px_hsl(var(--foreground)/0.35)]"
          >
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-accent/25 via-sky-500/10 to-primary/20" />
            <div className="p-4 md:p-6">
              <div className="overflow-hidden rounded-[1.5rem] border border-border/80 bg-muted">
                <img
                  src="/office/office-card.jpeg"
                  alt="Modern Real Estate Office"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="flex flex-col justify-between rounded-[2rem] border border-border bg-card p-6 shadow-[0_30px_80px_-40px_hsl(var(--foreground)/0.28)] md:p-8"
          >
            <div>
              <div className="mb-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-secondary/60 p-4">
                  <ShieldCheck className="mb-3 h-5 w-5 text-accent" />
                  <div className="text-sm font-semibold text-foreground">
                    {language === "ar" ? "خبرة موثوقة" : "Trusted Experience"}
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-secondary/60 p-4">
                  <MapPinned className="mb-3 h-5 w-5 text-accent" />
                  <div className="text-sm font-semibold text-foreground">
                    {language === "ar" ? "كل لبنان" : "All Lebanon"}
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-secondary/60 p-4">
                  <Phone className="mb-3 h-5 w-5 text-accent" />
                  <div className="text-sm font-semibold text-foreground">
                    {language === "ar" ? "تواصل مباشر" : "Direct Contact"}
                  </div>
                </div>
              </div>

              <div
                dir="rtl"
                className="rounded-[1.75rem] bg-[linear-gradient(135deg,hsl(var(--secondary))_0%,hsl(var(--background))_100%)] p-6 ring-1 ring-border"
              >
                <h2 className="mb-5 text-2xl font-bold text-foreground md:text-3xl">
                  المكتب العقاري الحديث
                </h2>

                <div className="space-y-4 text-lg leading-8 text-foreground/90">
                  {officeParagraphLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[1.75rem] bg-primary p-6 text-primary-foreground">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-primary-foreground/70">
                    {language === "ar" ? "رقم المكتب" : "Office Number"}
                  </p>
                  <a
                    href={officePhoneHref}
                    className="mt-2 inline-block text-3xl font-bold tracking-wide transition-colors hover:text-accent"
                  >
                    {officePhoneDisplay}
                  </a>
                </div>

                <a
                  href={officePhoneHref}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-accent px-6 py-4 text-base font-semibold text-accent-foreground transition-all hover:opacity-90"
                >
                  <Phone className="h-5 w-5" />
                  {language === "ar" ? "اتصال مباشر" : "Call Now"}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Office;
