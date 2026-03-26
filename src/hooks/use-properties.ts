import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminToken } from "@/lib/admin-auth";
import { apiRequest } from "@/lib/api";
import { toPropertyPayload, type Property, type PropertyFormValues } from "@/lib/properties";

const propertiesQueryKey = ["properties"] as const;

const authHeaders = () => {
  const token = getAdminToken();

  if (!token) {
    throw new Error("Admin authentication is required.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const fetchProperties = () => apiRequest<Property[]>("/properties");

const fetchProperty = (id: string) => apiRequest<Property | null>(`/properties/${id}`);

const saveProperty = ({
  id,
  values,
}: {
  id?: string;
  values: PropertyFormValues;
}) =>
  apiRequest<Property>(id ? `/properties/${id}` : "/properties", {
    method: id ? "PUT" : "POST",
    headers: authHeaders(),
    body: JSON.stringify(toPropertyPayload(values)),
  });

const removeProperty = async (id: string) => {
  await apiRequest<void>(`/properties/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return id;
};

export const useProperties = () =>
  useQuery({
    queryKey: propertiesQueryKey,
    queryFn: fetchProperties,
  });

export const useProperty = (id?: string) =>
  useQuery({
    queryKey: [...propertiesQueryKey, id],
    queryFn: () => fetchProperty(id as string),
    enabled: Boolean(id),
  });

export const useSaveProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveProperty,
    onSuccess: async (property) => {
      queryClient.setQueryData([...propertiesQueryKey, property.id], property);
      await queryClient.invalidateQueries({ queryKey: propertiesQueryKey });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeProperty,
    onSuccess: async (id) => {
      queryClient.removeQueries({ queryKey: [...propertiesQueryKey, id] });
      await queryClient.invalidateQueries({ queryKey: propertiesQueryKey });
    },
  });
};
