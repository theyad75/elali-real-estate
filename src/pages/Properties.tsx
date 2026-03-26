import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/hooks/use-properties";

const Properties = () => {
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const propertiesQuery = useProperties();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeType, setActiveType] = useState(searchParams.get("type") || "");
  const [activeStatus, setActiveStatus] = useState(searchParams.get("status") || "");
  const [activeLocation, setActiveLocation] = useState(searchParams.get("location") || "");

  const types = [
    { value: "", label: t.filters.all },
    { value: "apartment", label: t.filters.apartment },
    { value: "villa", label: t.filters.villa },
    { value: "land", label: t.filters.land },
    { value: "office", label: t.filters.office },
    { value: "shop", label: t.filters.shop },
    { value: "penthouse", label: t.filters.penthouse },
    { value: "studio", label: t.filters.studio },
    { value: "chalet", label: t.filters.chalet },
  ];

  const locations = useMemo(() => {
    const seen = new Map<string, string>();

    for (const property of propertiesQuery.data ?? []) {
      if (!seen.has(property.location.en)) {
        seen.set(property.location.en, property.location[language]);
      }
    }

    return Array.from(seen.entries()).map(([value, label]) => ({ value, label }));
  }, [language, propertiesQuery.data]);

  const filtered = useMemo(() => {
    return (propertiesQuery.data ?? []).filter((p) => {
      if (activeType && p.type !== activeType) return false;
      if (activeStatus && p.status !== activeStatus) return false;
      if (activeLocation && p.location.en !== activeLocation) return false;
      if (searchQuery) {
        const normalizedQuery = searchQuery.trim().toLowerCase();
        const haystack = [
          p.title.en,
          p.title.ar,
          p.description.en,
          p.description.ar,
          p.location.en,
          p.location.ar,
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(normalizedQuery)) return false;
      }
      return true;
    });
  }, [activeLocation, activeStatus, activeType, propertiesQuery.data, searchQuery]);

  const loadingMessage = language === "ar" ? "جارٍ تحميل العقارات..." : "Loading properties...";
  const errorMessage = language === "ar" ? "تعذر تحميل العقارات. تأكد من إعداد قاعدة البيانات." : "Unable to load properties. Make sure the database migration has been applied.";
  const emptyMessage = language === "ar" ? "لم يتم العثور على عقارات تطابق عوامل التصفية." : "No properties found matching your filters.";

  return (
    <div className="py-12">
      <div className="container">
        <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-2">
          {t.nav.properties}
        </h1>
        <div className="mt-2 h-1 w-16 rounded-full bg-accent mb-8" />

        {/* Filters */}
        <div className="mb-6 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t.hero.searchPlaceholder}
            className="rounded-xl border border-border bg-secondary px-5 py-4 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-accent"
          />

          <select
            value={activeLocation}
            onChange={(event) => setActiveLocation(event.target.value)}
            className="rounded-xl border border-border bg-secondary px-5 py-4 text-sm font-body text-foreground outline-none transition-colors focus:border-accent"
          >
            <option value="">{t.filters.location}</option>
            {locations.map((location) => (
              <option key={location.value} value={location.value}>
                {location.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {types.map((type) => (
            <button
              key={type.value}
              onClick={() => setActiveType(type.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium font-body transition-colors ${
                activeType === type.value
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {type.label}
            </button>
          ))}
          <div className="w-px bg-border mx-2" />
          <button
            onClick={() => setActiveStatus("")}
            className={`rounded-lg px-4 py-2 text-sm font-medium font-body transition-colors ${
              !activeStatus ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            {t.filters.all}
          </button>
          <button
            onClick={() => setActiveStatus("sale")}
            className={`rounded-lg px-4 py-2 text-sm font-medium font-body transition-colors ${
              activeStatus === "sale" ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            {t.filters.forSale}
          </button>
          <button
            onClick={() => setActiveStatus("rent")}
            className={`rounded-lg px-4 py-2 text-sm font-medium font-body transition-colors ${
              activeStatus === "rent" ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            {t.filters.forRent}
          </button>
        </div>

        {propertiesQuery.isLoading && (
          <div className="text-center py-20 text-muted-foreground font-body">
            {loadingMessage}
          </div>
        )}

        {propertiesQuery.isError && (
          <div className="text-center py-20 text-destructive font-body">{errorMessage}</div>
        )}

        {!propertiesQuery.isLoading && !propertiesQuery.isError && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))}
          </div>
        )}

        {!propertiesQuery.isLoading && !propertiesQuery.isError && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground font-body">{emptyMessage}</div>
        )}
      </div>
    </div>
  );
};

export default Properties;
