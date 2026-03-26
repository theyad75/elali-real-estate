import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bed, Bath, Maximize, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Property } from "@/lib/properties";

interface PropertyCardProps {
  property: Property;
  index?: number;
}

const PropertyCard = ({ property, index = 0 }: PropertyCardProps) => {
  const { language, t } = useLanguage();

  const formatPrice = (price: number, status: string) => {
    if (status === "rent") return `$${price.toLocaleString()}/mo`;
    return `$${price.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/property/${property.id}`}
        className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
      >
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={property.images[0]}
            alt={property.title[language]}
            loading="lazy"
            width={800}
            height={600}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 start-4 flex gap-2">
            <span className="rounded-lg bg-accent px-3 py-1 text-xs font-bold text-accent-foreground uppercase font-body">
              {property.status === "sale" ? t.filters.forSale : t.filters.forRent}
            </span>
            <span className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground capitalize font-body">
              {property.type}
            </span>
          </div>
          <div className="absolute bottom-4 start-4">
            <span className="rounded-lg bg-card/90 backdrop-blur-sm px-4 py-2 text-lg font-bold text-foreground font-display">
              {formatPrice(property.price, property.status)}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold font-display text-card-foreground mb-2 line-clamp-1">
            {property.title[language]}
          </h3>
          <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-sm font-body">{property.location[language]}</span>
          </div>

          <div className="flex items-center gap-5 text-sm text-muted-foreground font-body border-t border-border pt-4">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4" />
                <span>{property.bedrooms} {t.property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms} {t.property.bathrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Maximize className="h-4 w-4" />
              <span>{property.area} {t.property.area}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
