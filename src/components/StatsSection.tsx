import { motion } from "framer-motion";
import { Building2, Users, Award, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const StatsSection = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: Building2, value: "500+", label: t.stats.properties },
    { icon: Users, value: "1,200+", label: t.stats.clients },
    { icon: Award, value: "15+", label: t.stats.years },
    { icon: MapPin, value: "25+", label: t.stats.cities },
  ];

  return (
    <section className="py-16 bg-primary">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="h-8 w-8 mx-auto mb-3 text-accent" />
              <div className="text-3xl md:text-4xl font-bold font-display text-primary-foreground">
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-body text-primary-foreground/70">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
