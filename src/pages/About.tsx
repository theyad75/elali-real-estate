import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Heart, Award } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const About = () => {
  const { language } = useLanguage();

  const values = [
    {
      icon: Shield,
      title: language === "ar" ? "الثقة" : "Trust",
      desc: language === "ar" ? "نبني علاقات طويلة الأمد مبنية على الشفافية والنزاهة." : "We build lasting relationships based on transparency and integrity.",
    },
    {
      icon: Heart,
      title: language === "ar" ? "الشغف" : "Passion",
      desc: language === "ar" ? "شغفنا بالعقارات يدفعنا لتقديم أفضل الخيارات." : "Our passion for real estate drives us to deliver the best options.",
    },
    {
      icon: Award,
      title: language === "ar" ? "التميّز" : "Excellence",
      desc: language === "ar" ? "نسعى للتميز في كل صفقة وكل تفاعل مع عملائنا." : "We strive for excellence in every deal and every interaction.",
    },
  ];

  return (
    <div className="py-20">
      <div className="container max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <img src={logo} alt="El Ali" className="h-24 w-24 rounded-2xl object-cover mx-auto mb-6" />
          <h1 className="text-4xl font-bold font-display text-foreground mb-4">
            {language === "ar" ? "من نحن" : "About El Ali Real Estate"}
          </h1>
          <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-2xl mx-auto">
            {language === "ar"
              ? "العلي للعقارات هي شركة عقارية رائدة في لبنان، متخصصة في بيع وتأجير العقارات السكنية والتجارية في جميع أنحاء البلاد."
              : "El Ali Real Estate is a leading real estate company in Lebanon, specializing in the sale and rental of residential and commercial properties across the country."}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center p-6 rounded-2xl bg-card border border-border"
            >
              <v.icon className="h-10 w-10 mx-auto mb-4 text-accent" />
              <h3 className="text-lg font-bold font-display text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
