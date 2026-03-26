import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Bed, Bath, Maximize, MapPin, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProperty } from "@/hooks/use-properties";
import { WHATSAPP_URL } from "@/lib/contact";

const PropertyDetail = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const propertyQuery = useProperty(id);
  const property = propertyQuery.data;

  const loadingMessage = language === "ar" ? "جارٍ تحميل تفاصيل العقار..." : "Loading property details...";
  const notFoundMessage = language === "ar" ? "العقار غير موجود." : "Property not found.";
  const backMessage = language === "ar" ? "العودة إلى العقارات" : "Back to Properties";
  const errorMessage = language === "ar" ? "تعذر تحميل تفاصيل العقار." : "Unable to load the property details.";

  if (propertyQuery.isLoading) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground font-body">{loadingMessage}</p>
      </div>
    );
  }

  if (propertyQuery.isError) {
    return (
      <div className="container py-20 text-center">
        <p className="text-destructive font-body">{errorMessage}</p>
        <Link to="/properties" className="text-accent font-body mt-4 inline-block">
          {backMessage}
        </Link>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground font-body">{notFoundMessage}</p>
        <Link to="/properties" className="text-accent font-body mt-4 inline-block">
          {backMessage}
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number, status: string) => {
    if (status === "rent") return `$${price.toLocaleString()}/mo`;
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="py-8">
      <div className="container">
        <Link to="/properties" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-body mb-6">
          <ArrowLeft className="h-4 w-4" />
          {t.nav.properties}
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="rounded-2xl overflow-hidden aspect-[4/3]">
            <img
              src={property.images[0]}
              alt={property.title[language]}
              className="h-full w-full object-cover"
              width={800}
              height={600}
            />
          </div>

          <div>
            <div className="flex gap-2 mb-4">
              <span className="rounded-lg bg-accent px-3 py-1 text-xs font-bold text-accent-foreground uppercase font-body">
                {property.status === "sale" ? t.filters.forSale : t.filters.forRent}
              </span>
              <span className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground capitalize font-body">
                {property.type}
              </span>
            </div>

            <h1 className="text-3xl font-bold font-display text-foreground mb-3">
              {property.title[language]}
            </h1>

            <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
              <MapPin className="h-4 w-4" />
              <span className="font-body">{property.location[language]}</span>
            </div>

            <div className="text-3xl font-bold font-display text-accent mb-6">
              {formatPrice(property.price, property.status)}
            </div>

            <div className="flex gap-6 mb-8 p-4 rounded-xl bg-secondary">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-2 text-foreground">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span className="font-body font-medium">{property.bedrooms} {t.property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-2 text-foreground">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <span className="font-body font-medium">{property.bathrooms} {t.property.bathrooms}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-foreground">
                <Maximize className="h-5 w-5 text-muted-foreground" />
                <span className="font-body font-medium">{property.area} {t.property.area}</span>
              </div>
            </div>

            <p className="text-muted-foreground font-body leading-relaxed mb-8">
              {property.description[language]}
            </p>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-xl bg-accent px-8 py-4 text-base font-semibold text-accent-foreground font-body transition-all hover:opacity-90"
            >
              <MessageCircle className="h-5 w-5" />
              {t.cta.button}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
