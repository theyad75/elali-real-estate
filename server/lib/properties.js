const placeholderImage = "/placeholder.svg";

const asTrimmedString = (value) => (typeof value === "string" ? value.trim() : "");
const asNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const serializeProperty = (property) => ({
  id: property._id.toString(),
  title: property.title,
  description: property.description,
  price: property.price,
  type: property.type,
  status: property.status,
  location: property.location,
  bedrooms: property.bedrooms,
  bathrooms: property.bathrooms,
  area: property.area,
  images: property.images?.length ? property.images : [placeholderImage],
  imageSources: property.images?.length ? property.images : [placeholderImage],
  featured: property.featured,
  createdAt: property.createdAt.toISOString(),
  updatedAt: property.updatedAt.toISOString(),
});

export const toPropertyDocument = (payload) => {
  const images = Array.isArray(payload?.images)
    ? payload.images.map((item) => asTrimmedString(item)).filter(Boolean)
    : [];

  return {
    title: {
      en: asTrimmedString(payload?.titleEn),
      ar: asTrimmedString(payload?.titleAr),
    },
    description: {
      en: asTrimmedString(payload?.descEn),
      ar: asTrimmedString(payload?.descAr),
    },
    price: asNumber(payload?.price),
    type: payload?.type,
    status: payload?.status,
    location: {
      en: asTrimmedString(payload?.locationEn),
      ar: asTrimmedString(payload?.locationAr),
    },
    bedrooms: asNumber(payload?.bedrooms),
    bathrooms: asNumber(payload?.bathrooms),
    area: asNumber(payload?.area),
    images: images.length ? images : [placeholderImage],
    featured: Boolean(payload?.featured),
  };
};
