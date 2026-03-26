export const PROPERTY_TYPES = [
  "apartment",
  "villa",
  "land",
  "office",
  "shop",
  "penthouse",
  "studio",
  "chalet",
] as const;

export const PROPERTY_STATUS = ["sale", "rent"] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type PropertyStatus = (typeof PROPERTY_STATUS)[number];

export interface LocalizedText {
  en: string;
  ar: string;
}

export interface Property {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  price: number;
  type: PropertyType;
  status: PropertyStatus;
  location: LocalizedText;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  imageSources: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFormValues {
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  price: string;
  type: PropertyType;
  status: PropertyStatus;
  locationEn: string;
  locationAr: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  images: string;
  featured: boolean;
}

export const defaultPropertyFormValues: PropertyFormValues = {
  titleEn: "",
  titleAr: "",
  descEn: "",
  descAr: "",
  price: "",
  type: "apartment",
  status: "sale",
  locationEn: "",
  locationAr: "",
  bedrooms: "0",
  bathrooms: "0",
  area: "0",
  images: "",
  featured: false,
};

const placeholderImage = "/placeholder.svg";

export const splitImageSources = (value: string) => {
  const normalized = value
    .split(/\r?\n|,/)
    .map((source) => source.trim())
    .filter(Boolean);

  return normalized.length > 0 ? normalized : [placeholderImage];
};

export const toPropertyFormValues = (property: Property): PropertyFormValues => ({
  titleEn: property.title.en,
  titleAr: property.title.ar,
  descEn: property.description.en,
  descAr: property.description.ar,
  price: String(property.price),
  type: property.type,
  status: property.status,
  locationEn: property.location.en,
  locationAr: property.location.ar,
  bedrooms: String(property.bedrooms),
  bathrooms: String(property.bathrooms),
  area: String(property.area),
  images: property.imageSources.join("\n"),
  featured: property.featured,
});

export const toPropertyPayload = (values: PropertyFormValues) => ({
  titleEn: values.titleEn.trim(),
  titleAr: values.titleAr.trim(),
  descEn: values.descEn.trim(),
  descAr: values.descAr.trim(),
  price: Number(values.price),
  type: values.type,
  status: values.status,
  locationEn: values.locationEn.trim(),
  locationAr: values.locationAr.trim(),
  bedrooms: Number(values.bedrooms) || 0,
  bathrooms: Number(values.bathrooms) || 0,
  area: Number(values.area) || 0,
  images: splitImageSources(values.images),
  featured: values.featured,
});
