import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProperties } from "@/hooks/use-properties";
import PropertyCard from "./PropertyCard";

const FeaturedProperties = () => {
  const { language, t } = useLanguage();
  const propertiesQuery = useProperties();
  const featured = (propertiesQuery.data ?? []).filter((property) => property.featured).slice(0, 6);

  const loadingMessage = language === "ar" ? "جارٍ تحميل العقارات المميزة..." : "Loading featured properties...";
  const errorMessage = language === "ar" ? "تعذر تحميل العقارات المميزة حالياً." : "Featured properties are unavailable right now.";
  const emptyMessage = language === "ar" ? "لا توجد عقارات مميزة حالياً." : "No featured properties are available yet.";

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
              {t.featured.title}
            </h2>
            <div className="mt-3 h-1 w-16 rounded-full bg-accent" />
          </div>
          <Link
            to="/properties"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-accent font-body hover:underline"
          >
            {t.featured.viewAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {propertiesQuery.isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-[360px] animate-pulse rounded-2xl border border-border bg-card" />
            ))}
          </div>
        )}

        {propertiesQuery.isError && (
          <div className="rounded-2xl border border-border bg-card px-6 py-10 text-center text-muted-foreground font-body">
            {errorMessage}
          </div>
        )}

        {!propertiesQuery.isLoading && !propertiesQuery.isError && featured.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
        )}

        {!propertiesQuery.isLoading && !propertiesQuery.isError && featured.length === 0 && (
          <div className="rounded-2xl border border-border bg-card px-6 py-10 text-center text-muted-foreground font-body">
            {emptyMessage}
          </div>
        )}

        <div className="mt-10 text-center md:hidden">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground font-body"
          >
            {propertiesQuery.isLoading ? loadingMessage : t.featured.viewAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
