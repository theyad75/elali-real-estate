import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ImageUp, KeyRound, LogOut, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDeleteProperty, useProperties, useSaveProperty } from "@/hooks/use-properties";
import { clearAdminSession, getAdminToken, getAdminUsername, setAdminSession } from "@/lib/admin-auth";
import { apiRequest } from "@/lib/api";
import {
  defaultPropertyFormValues,
  PROPERTY_TYPES,
  type Property,
  type PropertyFormValues,
  splitImageSources,
  toPropertyFormValues,
} from "@/lib/properties";

const Admin = () => {
  const { language, t } = useLanguage();
  const propertiesQuery = useProperties();
  const saveProperty = useSaveProperty();
  const deleteProperty = useDeleteProperty();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [form, setForm] = useState<PropertyFormValues>(defaultPropertyFormValues);
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const properties = propertiesQuery.data ?? [];
  const inputClass =
    "w-full rounded-lg bg-secondary px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-accent transition-colors";
  const adminText =
    language === "ar"
      ? {
          cancel: "إلغاء",
          featured: "عقار مميز",
          imageUrls: "روابط الصور",
          imageHint: "ضع رابطاً واحداً في كل سطر. إذا تركتها فارغة سيُستخدم العنصر الافتراضي.",
          uploadFromDevice: "رفع صور من الجهاز",
          uploadImagesLoading: "جارٍ رفع الصور...",
          uploadSuccess: "تم رفع الصور وإضافتها إلى العقار.",
          uploadError: "تعذر رفع الصور.",
          previewImages: "معاينة الصور الحالية",
          removeImageHint: "لحذف صورة، احذف رابطها من الحقل أعلاه.",
          loading: "جارٍ تحميل العقارات...",
          loadError: "تعذر تحميل العقارات. تأكد من تشغيل API وربط MongoDB.",
          empty: "لا توجد عقارات محفوظة بعد.",
          saveSuccess: "تم إنشاء العقار وحفظه في قاعدة البيانات.",
          updateSuccess: "تم تحديث العقار في قاعدة البيانات.",
          saveError: "تعذر حفظ العقار.",
          deleteSuccess: "تم حذف العقار.",
          deleteError: "تعذر حذف العقار.",
          confirmDelete: "هل تريد حذف هذا العقار نهائياً؟",
          storageNote: "أي تعديل هنا يُحفظ مباشرة في MongoDB بعد تسجيل دخول المسؤول.",
          submitLoading: "جارٍ الحفظ...",
          signInTitle: "دخول المسؤول",
          signInSubtitle: "استخدم اسم المستخدم وكلمة المرور للوصول إلى لوحة التحكم.",
          username: "اسم المستخدم",
          password: "كلمة المرور",
          signIn: "تسجيل الدخول",
          signInLoading: "جارٍ تسجيل الدخول...",
          signInSuccess: "تم تسجيل الدخول بنجاح.",
          signInError: "تعذر تسجيل الدخول.",
          signOut: "تسجيل الخروج",
          signOutSuccess: "تم تسجيل الخروج.",
          signedInAs: "مسجل الدخول باسم",
          authChecking: "جارٍ التحقق من جلسة المسؤول...",
          changePassword: "تغيير كلمة المرور",
          changePasswordTitle: "تحديث كلمة مرور المسؤول",
          changePasswordDescription: "غيّر كلمة المرور من داخل لوحة التحكم واحفظها مباشرة في قاعدة البيانات.",
          currentPassword: "كلمة المرور الحالية",
          newPassword: "كلمة المرور الجديدة",
          confirmPassword: "تأكيد كلمة المرور الجديدة",
          passwordRequirements: "يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل.",
          passwordSave: "حفظ كلمة المرور",
          passwordSaving: "جارٍ تحديث كلمة المرور...",
          passwordChangeSuccess: "تم تحديث كلمة مرور المسؤول.",
          passwordChangeError: "تعذر تحديث كلمة المرور.",
          passwordMismatch: "كلمتا المرور الجديدتان غير متطابقتين.",
        }
      : {
          cancel: "Cancel",
          featured: "Featured Property",
          imageUrls: "Image URLs",
          imageHint: "Use one image URL per line. Empty values fall back to the placeholder image.",
          uploadFromDevice: "Upload From Device",
          uploadImagesLoading: "Uploading images...",
          uploadSuccess: "Images uploaded and added to the property.",
          uploadError: "Unable to upload images.",
          previewImages: "Current Image Preview",
          removeImageHint: "To remove an image, delete its URL from the field above.",
          loading: "Loading properties...",
          loadError: "Unable to load properties. Make sure the API is running and MongoDB is connected.",
          empty: "No properties have been saved yet.",
          saveSuccess: "Property created and saved to the database.",
          updateSuccess: "Property updated in the database.",
          saveError: "Unable to save the property.",
          deleteSuccess: "Property deleted.",
          deleteError: "Unable to delete the property.",
          confirmDelete: "Delete this property permanently?",
          storageNote: "Changes made here are saved directly to MongoDB after the admin signs in.",
          submitLoading: "Saving...",
          signInTitle: "Admin Sign In",
          signInSubtitle: "Use the admin username and password to access the dashboard.",
          username: "Username",
          password: "Password",
          signIn: "Sign In",
          signInLoading: "Signing in...",
          signInSuccess: "Signed in successfully.",
          signInError: "Unable to sign in.",
          signOut: "Sign Out",
          signOutSuccess: "Signed out.",
          signedInAs: "Signed in as",
          authChecking: "Checking admin session...",
          changePassword: "Change Password",
          changePasswordTitle: "Update Admin Password",
          changePasswordDescription: "Change the admin password here and save it directly to the database.",
          currentPassword: "Current Password",
          newPassword: "New Password",
          confirmPassword: "Confirm New Password",
          passwordRequirements: "The new password must be at least 6 characters long.",
          passwordSave: "Save Password",
          passwordSaving: "Updating password...",
          passwordChangeSuccess: "Admin password updated.",
          passwordChangeError: "Unable to update the password.",
          passwordMismatch: "The new passwords do not match.",
        };

  useEffect(() => {
    const token = getAdminToken();
    const storedUsername = getAdminUsername();

    if (!token) {
      setAuthLoading(false);
      return;
    }

    if (storedUsername) {
      setAdminUsername(storedUsername);
    }

    void apiRequest<{ authenticated: boolean; username: string }>("/admin/session", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setIsAuthenticated(response.authenticated);
        setAdminUsername(response.username);
      })
      .catch(() => {
        clearAdminSession();
        setIsAuthenticated(false);
        setAdminUsername("");
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);

  const typeOptions = PROPERTY_TYPES.map((type) => ({
    value: type,
    label:
      type === "apartment"
        ? t.filters.apartment
        : type === "villa"
          ? t.filters.villa
          : type === "land"
            ? t.filters.land
            : type === "office"
              ? t.filters.office
              : type === "shop"
                ? t.filters.shop
                : type === "penthouse"
                  ? t.filters.penthouse
                  : type === "studio"
                    ? t.filters.studio
                    : t.filters.chalet,
  }));
  const previewImages = form.images.trim() ? splitImageSources(form.images) : [];

  const resetForm = () => {
    setForm(defaultPropertyFormValues);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (property: Property) => {
    setForm(toPropertyFormValues(property));
    setEditingId(property.id);
    setShowForm(true);
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthSubmitting(true);

    try {
      const response = await apiRequest<{ token: string; username: string }>("/admin/login", {
        method: "POST",
        body: JSON.stringify(loginForm),
      });

      setAdminSession(response.token, response.username);
      setAdminUsername(response.username);
      setIsAuthenticated(true);
      setLoginForm((current) => ({ ...current, password: "" }));
      toast.success(adminText.signInSuccess);
    } catch (error) {
      toast.error(adminText.signInError, {
        description: error instanceof Error ? error.message : adminText.signInError,
      });
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSignOut = () => {
    clearAdminSession();
    setIsAuthenticated(false);
    setAdminUsername("");
    setShowForm(false);
    setShowPasswordForm(false);
    setEditingId(null);
    setForm(defaultPropertyFormValues);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    toast.success(adminText.signOutSuccess);
  };

  const resetPasswordForm = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswordForm(false);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await saveProperty.mutateAsync({
        id: editingId ?? undefined,
        values: form,
      });

      toast.success(editingId ? adminText.updateSuccess : adminText.saveSuccess);
      resetForm();
    } catch (error) {
      toast.error(adminText.saveError, {
        description: error instanceof Error ? error.message : adminText.saveError,
      });
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const token = getAdminToken();

    if (files.length === 0) {
      return;
    }

    if (!token) {
      toast.error(adminText.uploadError, {
        description: "Admin authentication is required.",
      });
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    setUploadingImages(true);

    try {
      const response = await apiRequest<{ urls: string[] }>("/uploads", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      setForm((current) => {
        const merged = [...(current.images.trim() ? splitImageSources(current.images) : []), ...response.urls];

        return {
          ...current,
          images: merged.join("\n"),
        };
      });

      toast.success(adminText.uploadSuccess);
    } catch (error) {
      toast.error(adminText.uploadError, {
        description: error instanceof Error ? error.message : adminText.uploadError,
      });
    } finally {
      setUploadingImages(false);
      event.target.value = "";
    }
  };

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = getAdminToken();
    const trimmedNewPassword = passwordForm.newPassword.trim();

    if (!token) {
      clearAdminSession();
      setIsAuthenticated(false);
      setAdminUsername("");
      toast.error(adminText.passwordChangeError);
      return;
    }

    if (trimmedNewPassword.length < 6) {
      toast.error(adminText.passwordChangeError, {
        description: adminText.passwordRequirements,
      });
      return;
    }

    if (trimmedNewPassword !== passwordForm.confirmPassword.trim()) {
      toast.error(adminText.passwordChangeError, {
        description: adminText.passwordMismatch,
      });
      return;
    }

    setPasswordSubmitting(true);

    try {
      await apiRequest<{ success: boolean; username: string }>("/admin/password", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: trimmedNewPassword,
        }),
      });

      resetPasswordForm();
      toast.success(adminText.passwordChangeSuccess);
    } catch (error) {
      toast.error(adminText.passwordChangeError, {
        description: error instanceof Error ? error.message : adminText.passwordChangeError,
      });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(adminText.confirmDelete)) {
      return;
    }

    setDeletingId(id);

    try {
      await deleteProperty.mutateAsync(id);
      toast.success(adminText.deleteSuccess);
    } catch (error) {
      toast.error(adminText.deleteError, {
        description: error instanceof Error ? error.message : adminText.deleteError,
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="py-12">
        <div className="container">
          <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center text-muted-foreground font-body">
            {adminText.authChecking}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="py-12">
        <div className="container max-w-lg">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h1 className="text-3xl font-bold font-display text-foreground">{adminText.signInTitle}</h1>
            <div className="mt-2 h-1 w-16 rounded-full bg-accent" />
            <p className="mt-4 text-sm text-muted-foreground font-body">{adminText.signInSubtitle}</p>

            <form onSubmit={handleSignIn} className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium font-body text-foreground">
                  {adminText.username}
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={loginForm.username}
                  onChange={(event) => setLoginForm({ ...loginForm, username: event.target.value })}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium font-body text-foreground">
                  {adminText.password}
                </label>
                <input
                  type="password"
                  className={inputClass}
                  value={loginForm.password}
                  onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground font-body transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {authSubmitting ? adminText.signInLoading : adminText.signIn}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">{t.admin.title}</h1>
            <div className="mt-2 h-1 w-16 rounded-full bg-accent" />
            <p className="mt-4 text-sm text-muted-foreground font-body">{adminText.storageNote}</p>
            <p className="mt-2 text-xs text-muted-foreground font-body">
              {adminText.signedInAs} {adminUsername}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground font-body transition-all hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              {t.admin.addProperty}
            </button>

            <button
              onClick={() => setShowPasswordForm((current) => !current)}
              className="flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground font-body transition-colors hover:bg-secondary"
            >
              <KeyRound className="h-4 w-4" />
              {adminText.changePassword}
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground font-body transition-colors hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" />
              {adminText.signOut}
            </button>
          </div>
        </div>

        {showPasswordForm && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent/5 via-card to-card shadow-sm">
            <div className="border-b border-border px-6 py-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-foreground">{adminText.changePasswordTitle}</h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground font-body">
                    {adminText.changePasswordDescription}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={resetPasswordForm}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="grid gap-4 px-6 py-6 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium font-body text-foreground">
                  {adminText.currentPassword}
                </label>
                <input
                  type="password"
                  className={inputClass}
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      currentPassword: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium font-body text-foreground">
                  {adminText.newPassword}
                </label>
                <input
                  type="password"
                  className={inputClass}
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      newPassword: event.target.value,
                    }))
                  }
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium font-body text-foreground">
                  {adminText.confirmPassword}
                </label>
                <input
                  type="password"
                  className={inputClass}
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      confirmPassword: event.target.value,
                    }))
                  }
                  minLength={6}
                  required
                />
              </div>

              <div className="md:col-span-3 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <p className="text-xs text-muted-foreground font-body">{adminText.passwordRequirements}</p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={resetPasswordForm}
                    className="rounded-lg px-5 py-3 text-sm font-medium font-body text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {adminText.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={passwordSubmitting}
                    className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground font-body transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {passwordSubmitting ? adminText.passwordSaving : adminText.passwordSave}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
            <form
              onSubmit={handleSave}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold font-display text-foreground">
                  {editingId ? t.admin.edit : t.admin.addProperty}
                </h2>
                <button type="button" onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className={inputClass}
                  placeholder="Title (English)"
                  value={form.titleEn}
                  onChange={(event) => setForm({ ...form, titleEn: event.target.value })}
                  required
                />
                <input
                  className={inputClass}
                  placeholder="العنوان (عربي)"
                  value={form.titleAr}
                  onChange={(event) => setForm({ ...form, titleAr: event.target.value })}
                  dir="rtl"
                  required
                />
                <textarea
                  className={inputClass}
                  placeholder="Description (English)"
                  value={form.descEn}
                  onChange={(event) => setForm({ ...form, descEn: event.target.value })}
                  rows={3}
                  required
                />
                <textarea
                  className={inputClass}
                  placeholder="الوصف (عربي)"
                  value={form.descAr}
                  onChange={(event) => setForm({ ...form, descAr: event.target.value })}
                  rows={3}
                  dir="rtl"
                  required
                />
                <input
                  className={inputClass}
                  placeholder={t.admin.price}
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                  required
                />
                <select
                  className={inputClass}
                  value={form.type}
                  onChange={(event) =>
                    setForm({ ...form, type: event.target.value as PropertyFormValues["type"] })
                  }
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value as PropertyFormValues["status"] })
                  }
                >
                  <option value="sale">{t.filters.forSale}</option>
                  <option value="rent">{t.filters.forRent}</option>
                </select>
                <input
                  className={inputClass}
                  placeholder="Location (English)"
                  value={form.locationEn}
                  onChange={(event) => setForm({ ...form, locationEn: event.target.value })}
                  required
                />
                <input
                  className={inputClass}
                  placeholder="الموقع (عربي)"
                  value={form.locationAr}
                  onChange={(event) => setForm({ ...form, locationAr: event.target.value })}
                  dir="rtl"
                  required
                />
                <input
                  className={inputClass}
                  placeholder="Bedrooms"
                  type="number"
                  min="0"
                  value={form.bedrooms}
                  onChange={(event) => setForm({ ...form, bedrooms: event.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Bathrooms"
                  type="number"
                  min="0"
                  value={form.bathrooms}
                  onChange={(event) => setForm({ ...form, bathrooms: event.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Area (m²)"
                  type="number"
                  min="0"
                  value={form.area}
                  onChange={(event) => setForm({ ...form, area: event.target.value })}
                />
                <div className="md:col-span-2">
                  <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <label className="block text-sm font-medium font-body text-foreground">
                      {adminText.imageUrls}
                    </label>

                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-semibold font-body text-foreground transition-colors hover:border-accent hover:text-accent">
                      <ImageUp className="h-4 w-4" />
                      {uploadingImages ? adminText.uploadImagesLoading : adminText.uploadFromDevice}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadingImages}
                      />
                    </label>
                  </div>

                  <textarea
                    className={inputClass}
                    placeholder="https://example.com/property-1.jpg"
                    value={form.images}
                    onChange={(event) => setForm({ ...form, images: event.target.value })}
                    rows={3}
                  />
                  <p className="mt-2 text-xs text-muted-foreground font-body">{adminText.imageHint}</p>
                  <p className="mt-1 text-xs text-muted-foreground font-body">{adminText.removeImageHint}</p>

                  {previewImages.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-3 text-sm font-medium font-body text-foreground">{adminText.previewImages}</p>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {previewImages.map((image, index) => (
                          <div key={`${image}-${index}`} className="overflow-hidden rounded-xl border border-border bg-muted">
                            <img
                              src={image}
                              alt={`Property upload ${index + 1}`}
                              className="h-28 w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <label className="md:col-span-2 flex items-center gap-3 rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-body text-foreground">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => setForm({ ...form, featured: event.target.checked })}
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                  />
                  <span>{adminText.featured}</span>
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg px-5 py-3 text-sm font-medium font-body text-muted-foreground transition-colors hover:text-foreground"
                >
                  {adminText.cancel}
                </button>
                <button
                  type="submit"
                  disabled={saveProperty.isPending}
                  className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground font-body transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saveProperty.isPending ? adminText.submitLoading : t.admin.save}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {propertiesQuery.isLoading && (
            <div className="px-6 py-10 text-center text-muted-foreground font-body">{adminText.loading}</div>
          )}

          {propertiesQuery.isError && (
            <div className="border-b border-border px-6 py-6 text-sm text-destructive font-body">
              {adminText.loadError}
            </div>
          )}

          {!propertiesQuery.isLoading && !propertiesQuery.isError && properties.length === 0 && (
            <div className="px-6 py-10 text-center text-muted-foreground font-body">{adminText.empty}</div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="px-6 py-4 text-start text-xs font-bold uppercase tracking-wider text-muted-foreground font-body">
                    Property
                  </th>
                  <th className="px-6 py-4 text-start text-xs font-bold uppercase tracking-wider text-muted-foreground font-body">
                    Type
                  </th>
                  <th className="px-6 py-4 text-start text-xs font-bold uppercase tracking-wider text-muted-foreground font-body">
                    Status
                  </th>
                  <th className="px-6 py-4 text-start text-xs font-bold uppercase tracking-wider text-muted-foreground font-body">
                    Price
                  </th>
                  <th className="px-6 py-4 text-start text-xs font-bold uppercase tracking-wider text-muted-foreground font-body">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr
                    key={property.id}
                    className="border-b border-border last:border-0 transition-colors hover:bg-secondary/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={property.images[0]} alt="" className="h-12 w-12 rounded-lg object-cover" />
                        <div>
                          <div className="text-sm font-medium font-body text-foreground">
                            {property.title[language]}
                          </div>
                          <div className="text-xs text-muted-foreground font-body">
                            {property.location[language]}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-body capitalize text-foreground">{property.type}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold font-body ${
                          property.status === "sale" ? "bg-accent/10 text-accent" : "bg-sky/10 text-sky"
                        }`}
                      >
                        {property.status === "sale" ? t.filters.forSale : t.filters.forRent}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold font-body text-foreground">
                      ${property.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(property)}
                          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          disabled={deletingId === property.id}
                          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
