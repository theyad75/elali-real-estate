import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProperties } from "@/hooks/use-properties";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const propertiesQuery = useProperties();
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");

  const locationOptions = useMemo(() => {
    const seen = new Map<string, { value: string; label: string }>();

    for (const property of propertiesQuery.data ?? []) {
      if (!seen.has(property.location.en)) {
        seen.set(property.location.en, {
          value: property.location.en,
          label: property.location[language],
        });
      }
    }

    return Array.from(seen.values());
  }, [language, propertiesQuery.data]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (propertyType) params.set("type", propertyType);
    if (status) params.set("status", status);
    if (location) params.set("location", location);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/90" />
      </div>

      <div className="container relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-display text-primary-foreground mb-6 leading-tight">
            {t.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 font-body mb-12">
            {t.hero.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl flex flex-col md:flex-row md:flex-wrap gap-2">
            <input
              type="text"
              placeholder={t.hero.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-xl bg-secondary px-5 py-4 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none"
            />
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="rounded-xl bg-secondary px-5 py-4 text-sm font-body text-foreground outline-none min-w-[140px]"
            >
              <option value="">{t.filters.propertyType}</option>
              <option value="apartment">{t.filters.apartment}</option>
              <option value="villa">{t.filters.villa}</option>
              <option value="land">{t.filters.land}</option>
              <option value="office">{t.filters.office}</option>
              <option value="shop">{t.filters.shop}</option>
              <option value="penthouse">{t.filters.penthouse}</option>
              <option value="studio">{t.filters.studio}</option>
              <option value="chalet">{t.filters.chalet}</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl bg-secondary px-5 py-4 text-sm font-body text-foreground outline-none min-w-[130px]"
            >
              <option value="">{t.filters.status}</option>
              <option value="sale">{t.filters.forSale}</option>
              <option value="rent">{t.filters.forRent}</option>
            </select>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-xl bg-secondary px-5 py-4 text-sm font-body text-foreground outline-none min-w-[160px]"
            >
              <option value="">{t.filters.location}</option>
              {locationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90 font-body"
            >
              <Search className="h-4 w-4" />
              {t.hero.search}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
