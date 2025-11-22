import { useState, useEffect } from "react";
import { useLandingPages } from "../hooks/useLandingPages";
import { LandingPagePreview } from "./LandingPagePreview";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Plus,
  Eye,
  ExternalLink,
  Smartphone,
  Monitor,
  Edit2,
  Trash2,
  Copy,
  FileText,
  Palette,
  Code,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  MousePointerClick,
  Layout,
  Sparkles,
  X
} from "lucide-react";
import { Switch } from "./ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface LandingPageFormFields {
  name: boolean;
  email: boolean;
  company: boolean;
  phone: boolean;
  jobTitle: boolean;
  message: boolean;
}

interface LandingPageStyling {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonStyle: "solid" | "outline" | "gradient";
  layoutStyle: "centered" | "split" | "hero";
  imageUrl?: string;
}

interface LandingPageSEO {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
}

interface LandingPage {
  id: number | string;
  name: string;
  template: string;
  visits: number;
  submissions: number;
  conversionRate: number;
  status: "Publicada" | "Borrador" | "Archivada";
  url: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  buttonText: string;
  successMessage: string;
  fields: LandingPageFormFields;
  gdprConsent: boolean;
  styling: LandingPageStyling;
  seo: LandingPageSEO;
   captureSource?: boolean;
   sourceLabel?: string;
  createdAt: Date;
  lastEdited: Date;
  bounceRate?: number;
  avgTimeOnPage?: number;
}

interface Template {
  id: number;
  name: string;
  description: string;
  preview: string;
  category: "lead" | "event" | "newsletter" | "product";
  recommended?: boolean;
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const templatesData: Template[] = [
  { 
    id: 1, 
    name: "Lead Magnet Pro", 
    description: "Captura leads con descargable premium y seguimiento automático", 
    preview: "📄",
    category: "lead",
    recommended: true
  },
  { 
    id: 2, 
    name: "Newsletter Premium", 
    description: "Formulario optimizado para suscripciones con double opt-in", 
    preview: "📧",
    category: "newsletter",
    recommended: true
  },
  { 
    id: 3, 
    name: "Webinar Pro", 
    description: "Registro para eventos con calendario integrado", 
    preview: "🎥",
    category: "event"
  },
  { 
    id: 4, 
    name: "Demo Producto", 
    description: "Solicitud de demo con calificación automática", 
    preview: "💼",
    category: "product"
  },
  { 
    id: 5, 
    name: "Contacto Directo", 
    description: "Formulario de contacto con routing inteligente", 
    preview: "💬",
    category: "lead"
  },
  { 
    id: 6, 
    name: "Early Access", 
    description: "Lista de espera con gamificación", 
    preview: "🚀",
    category: "product"
  },
];

const defaultStyling: LandingPageStyling = {
  primaryColor: "#0EA5E9",
  backgroundColor: "#FFFFFF",
  textColor: "#111827",
  buttonStyle: "solid",
  layoutStyle: "centered",
};

const defaultSEO: LandingPageSEO = {
  metaTitle: "",
  metaDescription: "",
};

// ============================================================================
// PREVIEW DIALOG COMPONENT
// ============================================================================

interface PreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  selectedTemplate: Template | null;
}

function PreviewDialog({ isOpen, onClose, formData, selectedTemplate }: PreviewDialogProps) {
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  const getButtonStyle = () => {
    const baseStyle: React.CSSProperties = {
      width: "100%",
    };

    if (formData.styling.buttonStyle === "gradient") {
      return {
        ...baseStyle,
        background: `linear-gradient(135deg, ${formData.styling.primaryColor}, ${formData.styling.primaryColor}dd)`,
        color: "#fff",
        border: "none",
      };
    } else if (formData.styling.buttonStyle === "outline") {
      return {
        ...baseStyle,
        backgroundColor: "transparent",
        borderColor: formData.styling.primaryColor,
        color: formData.styling.primaryColor,
        borderWidth: "2px",
        borderStyle: "solid",
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: formData.styling.primaryColor,
        color: "#fff",
        border: "none",
      };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
        <DialogDescription className="sr-only">
          Vista previa de la landing page en diferentes dispositivos
        </DialogDescription>
        <div className="sticky top-0 z-10 bg-background border-b p-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Vista Previa - {formData.title || "Landing Page"}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={previewDevice === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewDevice("desktop")}
              >
                <Monitor className="h-4 w-4 mr-2" />
                Desktop
              </Button>
              <Button
                variant={previewDevice === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewDevice("mobile")}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Móvil
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8 bg-muted/30">
          <div
            className={`mx-auto transition-all ${
              previewDevice === "mobile" ? "max-w-sm" : "max-w-5xl"
            }`}
          >
            <div
              className="rounded-lg shadow-2xl overflow-hidden"
              style={{
                backgroundColor: formData.styling.backgroundColor,
                color: formData.styling.textColor,
              }}
            >
              <div className="p-8 lg:p-12">
                <div
                  className={`space-y-8 ${
                    formData.styling.layoutStyle === "centered" ? "text-center max-w-2xl mx-auto" : ""
                  } ${
                    formData.styling.layoutStyle === "split"
                      ? "grid lg:grid-cols-2 gap-12 items-center"
                      : ""
                  }`}
                >
                  {/* Image for split layout */}
                  {formData.styling.layoutStyle === "split" && (
                    <div className="order-2 lg:order-1">
                      <div className="aspect-square bg-gradient-to-br from-brand/10 to-brand/5 rounded-2xl flex items-center justify-center p-12">
                        <div className="text-center space-y-4">
                          <div className="text-8xl">{selectedTemplate?.preview || "📄"}</div>
                          <p className="text-muted-foreground">Imagen de ejemplo</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className={`space-y-6 ${formData.styling.layoutStyle === "split" ? "order-1 lg:order-2" : ""}`}>
                    {/* Logo/Icon */}
                    <div
                      className={`w-20 h-20 rounded-xl flex items-center justify-center text-4xl shadow-lg ${
                        formData.styling.layoutStyle === "centered" ? "mx-auto" : ""
                      }`}
                      style={{
                        background:
                          formData.styling.buttonStyle === "gradient"
                            ? `linear-gradient(135deg, ${formData.styling.primaryColor}, ${formData.styling.primaryColor}dd)`
                            : formData.styling.primaryColor,
                      }}
                    >
                      {selectedTemplate?.preview || "📄"}
                    </div>

                    {/* Titles */}
                    <div className="space-y-3">
                      <h1
                        className="text-3xl lg:text-4xl xl:text-5xl"
                        style={{ color: formData.styling.textColor }}
                      >
                        {formData.title || "Título de tu Landing Page"}
                      </h1>
                      {formData.subtitle && (
                        <p className="text-lg lg:text-xl text-muted-foreground">{formData.subtitle}</p>
                      )}
                      {formData.description && (
                        <p className="text-muted-foreground">{formData.description}</p>
                      )}
                    </div>

                    {/* Benefits */}
                    {formData.benefits.filter((b: string) => b.trim()).length > 0 && (
                      <div className={`space-y-3 ${formData.styling.layoutStyle === "centered" ? "text-left inline-block" : "text-left"}`}>
                        {formData.benefits
                          .filter((b: string) => b.trim())
                          .map((benefit: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-3">
                              <CheckCircle2
                                className="h-6 w-6 mt-0.5 flex-shrink-0"
                                style={{ color: formData.styling.primaryColor }}
                              />
                              <span className="text-base">{benefit}</span>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Form */}
                    <div className={`space-y-4 pt-4 ${formData.styling.layoutStyle === "centered" ? "max-w-md mx-auto" : "max-w-lg"}`}>
                      {formData.fields.name && (
                        <Input placeholder="Nombre" className="h-12" />
                      )}
                      <Input type="email" placeholder="Email *" className="h-12" />
                      {formData.fields.company && (
                        <Input placeholder="Empresa" className="h-12" />
                      )}
                      {formData.fields.jobTitle && (
                        <Input placeholder="Cargo" className="h-12" />
                      )}
                      {formData.fields.phone && (
                        <Input placeholder="Teléfono" className="h-12" />
                      )}
                      {formData.fields.message && (
                        <Textarea placeholder="Mensaje" rows={4} />
                      )}

                      {formData.gdprConsent && (
                        <div className="flex items-start gap-3 text-sm">
                          <input type="checkbox" className="mt-1 h-4 w-4" />
                          <span className="text-muted-foreground">
                            Acepto la política de privacidad y recibir comunicaciones
                          </span>
                        </div>
                      )}

                      <Button
                        size="lg"
                        className="h-14 text-base"
                        style={getButtonStyle()}
                      >
                        {formData.buttonText || "Enviar"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function LandingPages() {
  const { t, language } = useLanguage();
  // Use real data from database via custom hook
  const {
    landingPages: landingPagesFromDB,
    loading: loadingPages,
    createLandingPage: createPage,
    updateLandingPage: updatePage,
    deleteLandingPage: deletePage,
    publishLandingPage: publishPage,
    refresh: refreshPages,
  } = useLandingPages();

  // Map DB data to component interface
  const landingPages = landingPagesFromDB.map((page: any) => ({
    id: page.id || page._id,
    name: page.name,
    template: "Custom", // Template info not stored in DB
    visits: page.visits || 0,
    submissions: page.submissions || 0,
    conversionRate: page.conversionRate || 0,
    status: page.status === 'published' ? 'Publicada' : page.status === 'draft' ? 'Borrador' : 'Archivada',
    url: `/l/${page.slug}`,
    title: page.title,
    subtitle: page.subtitle || '',
    description: page.description || page.content || '',
    benefits: page.benefits || [],
    buttonText: page.buttonText || 'Descargar ahora',
    successMessage: page.successMessage || '¡Gracias! Revisa tu email.',
    fields: page.formFields || { name: true, email: true, company: false, phone: false, jobTitle: false, message: false },
    gdprConsent: page.gdprConsent !== false,
    styling: page.styling || defaultStyling,
    seo: page.seo || defaultSEO,
    captureSource: page.captureSource,
    sourceLabel: page.sourceLabel,
    createdAt: new Date(page.createdAt || Date.now()),
    lastEdited: new Date(page.updatedAt || Date.now()),
    bounceRate: page.bounceRate || 0,
    avgTimeOnPage: page.avgTimeOnPage || 0,
  }));

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState("template");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editingLanding, setEditingLanding] = useState<LandingPage | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "Publicada" | "Borrador" | "Archivada">("all");
  const [sortBy, setSortBy] = useState<"recent" | "conversions" | "visits">("recent");
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    title: "",
    subtitle: "",
    description: "",
    benefits: ["", "", ""],
    buttonText: "",
    successMessage: "",
    fields: { name: true, email: true, company: false, phone: false, jobTitle: false, message: false },
    gdprConsent: true,
    styling: defaultStyling,
    seo: defaultSEO,
    captureSource: false,
    sourceLabel: "Fuente / origen",
  });

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    
    // Pre-fill with template-specific defaults
    const templateDefaults = getTemplateDefaults(template);
    setFormData({
      ...formData,
      ...templateDefaults,
      name: `${template.name} - ${new Date().toLocaleDateString()}`,
    });
    
    setCurrentTab("content");
    toast.success(`Plantilla "${template.name}" seleccionada`);
  };

  const getTemplateDefaults = (template: Template) => {
    const defaults: any = {
      buttonText: "Enviar",
      benefits: ["", "", ""],
      captureSource: true,
      sourceLabel: "Cómo nos conociste",
    };

    switch (template.category) {
      case "lead":
        defaults.buttonText = "Descargar Ahora";
        defaults.benefits = [
          "Contenido exclusivo y actualizado",
          "Plantillas descargables",
          "Acceso inmediato"
        ];
        break;
      case "newsletter":
        defaults.buttonText = "Suscribirme Gratis";
        defaults.benefits = [
          "Contenido semanal de valor",
          "Sin spam garantizado",
          "Cancela cuando quieras"
        ];
        defaults.fields = { ...formData.fields, company: false, jobTitle: true };
        break;
      case "event":
        defaults.buttonText = "Reservar Plaza";
        defaults.benefits = [
          "Evento en vivo con Q&A",
          "Certificado de asistencia",
          "Grabación disponible"
        ];
        defaults.fields = { ...formData.fields, company: true, jobTitle: true };
        break;
      case "product":
        defaults.buttonText = "Solicitar Demo";
        defaults.benefits = [
          "Demo personalizada 1:1",
          "Sin compromiso",
          "Respuesta en 24h"
        ];
        defaults.fields = { ...formData.fields, company: true, jobTitle: true, phone: true };
        break;
    }

    return defaults;
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("El nombre de la landing es requerido");
      return false;
    }
    if (!formData.url.trim()) {
      toast.error("La URL es requerida");
      return false;
    }
    if (!formData.title.trim()) {
      toast.error("El título es requerido");
      return false;
    }
    if (!formData.buttonText.trim()) {
      toast.error("El texto del botón es requerido");
      return false;
    }
    if (!formData.fields.email) {
      toast.error("El campo email es obligatorio");
      return false;
    }
    
    // Validate URL format
    const urlRegex = /^[a-z0-9-]+$/;
    if (!urlRegex.test(formData.url)) {
      toast.error("La URL solo puede contener letras minúsculas, números y guiones");
      return false;
    }

    return true;
  };

  const handleCreateLanding = async (isDraft: boolean) => {
    if (!validateForm()) return;
    setSaving(true);

    const payload: any = {
      name: formData.name,
      slug: formData.url,
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      benefits: formData.benefits.filter((b) => b.trim() !== ""),
      buttonText: formData.buttonText,
      successMessage: formData.successMessage || "¡Gracias! Revisa tu email.",
      formFields: formData.fields,
      gdprConsent: formData.gdprConsent,
      styling: formData.styling,
      seo: {
        metaTitle: formData.seo.metaTitle || formData.title,
        metaDescription: formData.seo.metaDescription || formData.description,
      },
      captureSource: formData.captureSource,
      sourceLabel: formData.sourceLabel,
      status: isDraft ? "draft" : "published",
    };

    try {
      let id: string | number | undefined = editingLanding?.id;

      if (editingLanding && editingLanding.id) {
        await updatePage(String(editingLanding.id), payload);
        id = editingLanding.id;
        toast.success(isDraft ? "Borrador actualizado" : "Landing page actualizada");
      } else {
        const created = await createPage(payload);
        const createdData = (created as any)?.data || created;
        id = createdData?._id || createdData?.id;
        toast.success(isDraft ? "Borrador guardado" : "Landing page creada");
      }

      if (!isDraft && id) {
        await publishPage(String(id));
      }

      await refreshPages();
      resetForm();
      setIsDialogOpen(false);
    } catch (err: any) {
      console.error("Error guardando landing:", err);
      toast.error(err?.message || "No se pudo guardar la landing");
    } finally {
      setSaving(false);
    }
  };

  const handleEditLanding = (landing: LandingPage) => {
    setEditingLanding(landing);
    setFormData({
      name: landing.name,
      url: landing.url.replace("/l/", ""),
      title: landing.title,
      subtitle: landing.subtitle,
      description: landing.description,
      benefits: [...landing.benefits, "", ""].slice(0, 3),
      buttonText: landing.buttonText,
      successMessage: landing.successMessage,
      fields: landing.fields,
      gdprConsent: landing.gdprConsent,
      styling: landing.styling,
      seo: landing.seo,
    });
    setSelectedTemplate(templatesData.find((t) => t.name === landing.template) || null);
    setCurrentTab("content");
    setIsDialogOpen(true);
  };

  const handlePreviewLanding = (landing: LandingPage) => {
    setPreviewData({
      title: landing.title,
      subtitle: landing.subtitle,
      description: landing.description,
      benefits: landing.benefits,
      buttonText: landing.buttonText,
      fields: landing.fields,
      gdprConsent: landing.gdprConsent,
      styling: landing.styling,
      captureSource: (landing as any).captureSource,
      sourceLabel: (landing as any).sourceLabel,
    });
    setIsPreviewOpen(true);
  };

  const handlePreviewCurrent = () => {
    setPreviewData(formData);
    setIsPreviewOpen(true);
  };

  const handleDeleteLanding = async (id: number | string) => {
    try {
      await deletePage(String(id));
      await refreshPages();
      toast.success("Landing page eliminada");
    } catch (err: any) {
      toast.error(err?.message || "No se pudo eliminar");
    }
  };

  const handleDuplicateLanding = async (landing: LandingPage) => {
    const now = Date.now();
    const slugBase = (landing.url || "").replace("/l/", "") || `landing-${now}`;
    const duplicatePayload = {
      name: `${landing.name} (Copia)`,
      slug: `${slugBase}-copia-${now}`,
      title: landing.title,
      subtitle: landing.subtitle,
      description: landing.description,
      benefits: landing.benefits,
      buttonText: landing.buttonText,
      successMessage: landing.successMessage,
      formFields: landing.fields,
      gdprConsent: landing.gdprConsent,
      styling: landing.styling,
      seo: landing.seo,
      status: "draft",
    };

    try {
      await createPage(duplicatePayload as any);
      await refreshPages();
      toast.success("Landing page duplicada");
    } catch (err: any) {
      toast.error(err?.message || "No se pudo duplicar");
    }
  };

  const handleArchiveLanding = async (id: number | string) => {
    try {
      await updatePage(String(id), { status: "archived" } as any);
      await refreshPages();
      toast.success("Landing page archivada");
    } catch (err: any) {
      toast.error(err?.message || "No se pudo archivar");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      url: "",
      title: "",
      subtitle: "",
      description: "",
      benefits: ["", "", ""],
      buttonText: "",
      successMessage: "",
      fields: { name: true, email: true, company: false, phone: false, jobTitle: false, message: false },
      gdprConsent: true,
      styling: defaultStyling,
      seo: defaultSEO,
      captureSource: false,
      sourceLabel: "Fuente / origen",
    });
    setSelectedTemplate(null);
    setEditingLanding(null);
    setCurrentTab("template");
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const addBenefit = () => {
    setFormData({ ...formData, benefits: [...formData.benefits, ""] });
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({ ...formData, benefits: newBenefits });
  };

  const removeBenefit = (index: number) => {
    setFormData({ ...formData, benefits: formData.benefits.filter((_, i) => i !== index) });
  };

  // ============================================================================
  // FILTERING & SORTING
  // ============================================================================

  const getFilteredAndSortedPages = () => {
    let filtered = landingPages;

    // Filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((lp) => lp.status === filterStatus);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return b.lastEdited.getTime() - a.lastEdited.getTime();
        case "conversions":
          return b.conversionRate - a.conversionRate;
        case "visits":
          return b.visits - a.visits;
        default:
          return 0;
      }
    });

    return sorted;
  };

  const displayedPages = getFilteredAndSortedPages();

  // ============================================================================
  // STATS
  // ============================================================================

  const totalVisits = landingPages.reduce((sum, lp) => sum + lp.visits, 0);
  const totalSubmissions = landingPages.reduce((sum, lp) => sum + lp.submissions, 0);
  const avgConversionRate = landingPages.length > 0
    ? landingPages.reduce((sum, lp) => sum + lp.conversionRate, 0) / landingPages.length
    : 0;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Preview Dialog */}
      {previewData && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
            <DialogDescription className="sr-only">
              Vista previa de la landing page funcional
            </DialogDescription>
            <div className="sticky top-0 z-10 bg-background border-b p-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Vista Previa - {previewData.title || "Landing Page"}
                </DialogTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsPreviewOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="overflow-y-auto">
              <LandingPagePreview data={previewData} landingPageId={previewData.id} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Header with Stats */}
      <div>
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl">{t("landings.title")}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {t("landings.subtitle")}
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <Button size="default" className="w-full sm:w-auto sm:flex-shrink-0">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="truncate">{t("landings.createLanding")}</span>
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {editingLanding ? (
                    <>
                      <Edit2 className="h-5 w-5" />
                      {language === "es" ? "Editar Landing Page" : "Edit Landing Page"}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 text-brand" />
                      {t("landings.createLanding")}
                    </>
                  )}
                </DialogTitle>
              </DialogHeader>

              <Tabs value={currentTab} onValueChange={setCurrentTab} className="py-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="template" className="text-xs sm:text-sm">
                    <Layout className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Plantilla</span>
                    <span className="sm:hidden">1</span>
                  </TabsTrigger>
                  <TabsTrigger value="content" disabled={!selectedTemplate && !editingLanding} className="text-xs sm:text-sm">
                    <FileText className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Contenido</span>
                    <span className="sm:hidden">2</span>
                  </TabsTrigger>
                  <TabsTrigger value="design" disabled={!selectedTemplate && !editingLanding} className="text-xs sm:text-sm">
                    <Palette className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Diseño</span>
                    <span className="sm:hidden">3</span>
                  </TabsTrigger>
                  <TabsTrigger value="seo" disabled={!selectedTemplate && !editingLanding} className="text-xs sm:text-sm">
                    <Code className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">SEO</span>
                    <span className="sm:hidden">4</span>
                  </TabsTrigger>
                </TabsList>

                {/* TEMPLATE TAB */}
                <TabsContent value="template" className="space-y-4 mt-6">
                  <div>
                    <h3 className="mb-2">Plantillas Recomendadas</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Selecciona una plantilla optimizada para tu objetivo
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templatesData.map((template) => (
                      <Card
                        key={template.id}
                        className={`cursor-pointer hover:border-brand hover:shadow-lg transition-all ${
                          selectedTemplate?.id === template.id ? "border-brand bg-brand/5 shadow-md" : ""
                        }`}
                        onClick={() => handleSelectTemplate(template)}
                      >
                        <CardContent className="pt-6">
                          <div className="text-center mb-4">
                            <div className="text-5xl mb-3">{template.preview}</div>
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <h4>{template.name}</h4>
                              {template.recommended && (
                                <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                                  Top
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                          </div>
                          {selectedTemplate?.id === template.id && (
                            <div className="flex items-center justify-center gap-2 mt-4">
                              <CheckCircle2 className="h-4 w-4 text-brand" />
                              <span className="text-sm text-brand">Seleccionada</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* CONTENT TAB */}
                <TabsContent value="content" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-4">Información Básica</h3>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Nombre Interno *</Label>
                            <Input
                              placeholder="Ej: Lead Magnet - Guía Marketing Q1 2025"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">Solo visible internamente</p>
                          </div>

                      <div className="space-y-2">
                        <Label>URL Slug *</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground px-3 py-2 bg-muted rounded-md whitespace-nowrap">/l/</span>
                          <Input
                            placeholder="guia-marketing-2025"
                            value={formData.url}
                            onChange={(e) =>
                              setFormData({ ...formData, url: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })
                            }
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Solo letras minúsculas, números y guiones</p>
                      </div>

                      <div className="space-y-2">
                        <Label>Imagen (opcional)</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                setFormData({
                                  ...formData,
                                  styling: { ...formData.styling, imageUrl: reader.result as string },
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <p className="text-xs text-muted-foreground">Se guarda como base64 para la vista pública.</p>
                        {formData.styling.imageUrl && (
                          <img
                            src={formData.styling.imageUrl}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded border"
                          />
                        )}
                      </div>
                    </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3>Campos del Formulario</h3>
                        <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={formData.fields.name}
                                onCheckedChange={(checked) =>
                                  setFormData({ ...formData, fields: { ...formData.fields, name: checked } })
                                }
                              />
                              <Label>Nombre</Label>
                            </div>
                            <Badge variant="outline" className="text-xs">Recomendado</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Switch checked disabled />
                              <Label>Email</Label>
                            </div>
                            <Badge className="text-xs bg-brand">Obligatorio</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={formData.fields.company}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, fields: { ...formData.fields, company: checked } })
                              }
                            />
                            <Label>Empresa</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={formData.captureSource}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, captureSource: checked })
                              }
                            />
                            <div className="flex flex-col">
                              <Label>Campo de fuente / origen</Label>
                              <p className="text-xs text-muted-foreground">Permite al usuario indicar de dónde llega.</p>
                            </div>
                          </div>
                          {formData.captureSource && (
                            <div className="space-y-2">
                              <Label>Etiqueta del campo</Label>
                              <Input
                                value={formData.sourceLabel}
                                onChange={(e) => setFormData({ ...formData, sourceLabel: e.target.value })}
                                placeholder="Ej: ¿Cómo nos conociste?"
                              />
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={formData.fields.jobTitle}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, fields: { ...formData.fields, jobTitle: checked } })
                              }
                            />
                            <Label>Cargo</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={formData.fields.phone}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, fields: { ...formData.fields, phone: checked } })
                              }
                            />
                            <Label>Teléfono</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={formData.fields.message}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, fields: { ...formData.fields, message: checked } })
                              }
                            />
                            <Label>Mensaje</Label>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                          <div>
                            <Label>Consentimiento GDPR</Label>
                            <p className="text-xs text-muted-foreground">Checkbox de política de privacidad</p>
                          </div>
                          <Switch
                            checked={formData.gdprConsent}
                            onCheckedChange={(checked) => setFormData({ ...formData, gdprConsent: checked })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-4">
                        <h3>Contenido de la Página</h3>

                        <div className="space-y-2">
                          <Label>Título Principal *</Label>
                          <Input
                            placeholder="Ej: Descarga tu Guía Gratuita"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Subtítulo</Label>
                          <Input
                            placeholder="Ej: Todo lo que necesitas para dominar el marketing"
                            value={formData.subtitle}
                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Descripción</Label>
                          <Textarea
                            placeholder="Descripción adicional del recurso o beneficio..."
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Beneficios Clave</Label>
                            <Button variant="ghost" size="sm" onClick={addBenefit}>
                              <Plus className="h-4 w-4 mr-1" />
                              Añadir
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {formData.benefits.map((benefit, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  placeholder={`Beneficio ${index + 1}`}
                                  value={benefit}
                                  onChange={(e) => updateBenefit(index, e.target.value)}
                                />
                                {formData.benefits.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeBenefit(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Texto del Botón *</Label>
                          <Input
                            placeholder="Ej: Descargar Ahora"
                            value={formData.buttonText}
                            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Mensaje de Éxito</Label>
                          <Textarea
                            placeholder="¡Gracias! Revisa tu email..."
                            rows={2}
                            value={formData.successMessage}
                            onChange={(e) => setFormData({ ...formData, successMessage: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button variant="outline" onClick={handlePreviewCurrent}>
                      <Eye className="h-4 w-4 mr-2" />
                      Vista Previa
                    </Button>
                    <Button onClick={() => setCurrentTab("design")}>
                      Continuar a Diseño
                    </Button>
                  </div>
                </TabsContent>

                {/* DESIGN TAB */}
                <TabsContent value="design" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3>Personalización Visual</h3>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Color Principal</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={formData.styling.primaryColor}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  styling: { ...formData.styling, primaryColor: e.target.value },
                                })
                              }
                              className="w-20 h-10"
                            />
                            <Input
                              value={formData.styling.primaryColor}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  styling: { ...formData.styling, primaryColor: e.target.value },
                                })
                              }
                              placeholder="#0EA5E9"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Estilo del Botón</Label>
                          <Select
                            value={formData.styling.buttonStyle}
                            onValueChange={(value: any) =>
                              setFormData({
                                ...formData,
                                styling: { ...formData.styling, buttonStyle: value },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="solid">Sólido</SelectItem>
                              <SelectItem value="outline">Outlined</SelectItem>
                              <SelectItem value="gradient">Gradiente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Layout</Label>
                          <Select
                            value={formData.styling.layoutStyle}
                            onValueChange={(value: any) =>
                              setFormData({
                                ...formData,
                                styling: { ...formData.styling, layoutStyle: value },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="centered">Centrado</SelectItem>
                              <SelectItem value="split">Split (Imagen + Contenido)</SelectItem>
                              <SelectItem value="hero">Hero con Background</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>URL de Imagen (Opcional)</Label>
                          <Input
                            placeholder="https://ejemplo.com/imagen.jpg"
                            value={formData.styling.imageUrl || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                styling: { ...formData.styling, imageUrl: e.target.value },
                              })
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            Para layout "split" o "hero"
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3>Vista Previa de Colores</h3>
                      <Card>
                        <CardContent className="pt-6 space-y-4">
                          <div className="p-4 rounded-lg" style={{ backgroundColor: formData.styling.primaryColor }}>
                            <p className="text-white text-center">Color Principal</p>
                          </div>
                          <Button
                            className="w-full"
                            style={
                              formData.styling.buttonStyle === "gradient"
                                ? {
                                    background: `linear-gradient(135deg, ${formData.styling.primaryColor}, ${formData.styling.primaryColor}dd)`,
                                    color: "#fff",
                                    border: "none",
                                  }
                                : formData.styling.buttonStyle === "outline"
                                ? {
                                    backgroundColor: "transparent",
                                    borderColor: formData.styling.primaryColor,
                                    borderWidth: "2px",
                                    color: formData.styling.primaryColor,
                                  }
                                : {
                                    backgroundColor: formData.styling.primaryColor,
                                    color: "#fff",
                                    border: "none",
                                  }
                            }
                          >
                            {formData.buttonText || "Preview Botón"}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button variant="outline" onClick={handlePreviewCurrent}>
                      <Eye className="h-4 w-4 mr-2" />
                      Vista Previa
                    </Button>
                    <Button onClick={() => setCurrentTab("seo")}>
                      Continuar a SEO
                    </Button>
                  </div>
                </TabsContent>

                {/* SEO TAB */}
                <TabsContent value="seo" className="space-y-6 mt-6">
                  <div className="max-w-2xl mx-auto space-y-4">
                    <div>
                      <h3 className="mb-2">Optimización para Buscadores</h3>
                      <p className="text-sm text-muted-foreground">
                        Mejora el posicionamiento y apariencia en resultados de búsqueda
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Meta Título</Label>
                        <Input
                          placeholder={formData.title || "Título para resultados de búsqueda"}
                          value={formData.seo.metaTitle}
                          onChange={(e) =>
                            setFormData({ ...formData, seo: { ...formData.seo, metaTitle: e.target.value } })
                          }
                          maxLength={60}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Recomendado: 50-60 caracteres</span>
                          <span>{formData.seo.metaTitle.length}/60</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Meta Descripción</Label>
                        <Textarea
                          placeholder={formData.description || "Descripción para resultados de búsqueda"}
                          value={formData.seo.metaDescription}
                          onChange={(e) =>
                            setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } })
                          }
                          rows={3}
                          maxLength={160}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Recomendado: 150-160 caracteres</span>
                          <span>{formData.seo.metaDescription.length}/160</span>
                        </div>
                      </div>

                      <Card className="bg-muted/50">
                        <CardContent className="pt-6">
                          <h4 className="mb-2">Vista previa en Google</h4>
                          <div className="bg-background p-4 rounded border">
                            <p className="text-brand text-sm mb-1">
                              {formData.seo.metaTitle || formData.title || "Título de tu página"}
                            </p>
                            <p className="text-xs text-success mb-2">/l/{formData.url || "tu-url"}</p>
                            <p className="text-sm text-muted-foreground">
                              {formData.seo.metaDescription || formData.description || "Descripción de tu landing page..."}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button variant="outline" onClick={handlePreviewCurrent}>
                      <Eye className="h-4 w-4 mr-2" />
                      Vista Previa
                    </Button>
                    <Button variant="outline" onClick={() => handleCreateLanding(true)} disabled={saving}>
                      {saving ? "Guardando..." : "Guardar Borrador"}
                    </Button>
                    <Button onClick={() => handleCreateLanding(false)} size="lg" disabled={saving}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {saving ? "Guardando..." : editingLanding ? "Actualizar" : "Publicar"}
                    </Button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Card className="bg-muted/60 border-dashed border-border">
                      <CardContent className="pt-4 space-y-2">
                        <p className="text-sm font-semibold">1. Datos básicos</p>
                        <p className="text-xs text-muted-foreground">Nombre, slug y mensaje principal. Activa la captura de fuente si quieres rastrear origen.</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/60 border-dashed border-border">
                      <CardContent className="pt-4 space-y-2">
                        <p className="text-sm font-semibold">2. Branding y campos</p>
                        <p className="text-xs text-muted-foreground">Sube imagen opcional, ajusta colores, botones y campos obligatorios.</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/60 border-dashed border-border">
                      <CardContent className="pt-4 space-y-2">
                        <p className="text-sm font-semibold">3. Publicar</p>
                        <p className="text-xs text-muted-foreground">Guarda borrador o publica para activar `/l/tu-slug` y comenzar a recibir leads.</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {language === "es" ? "Total Páginas" : "Total Pages"}
                  </p>
                  <p className="text-xl sm:text-2xl mt-1">{landingPages.length}</p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-brand flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {language === "es" ? "Total Visitas" : "Total Visits"}
                  </p>
                  <p className="text-xl sm:text-2xl mt-1">{totalVisits.toLocaleString()}</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-brand flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{t("landings.conversions")}</p>
                  <p className="text-xl sm:text-2xl mt-1 text-success">{totalSubmissions}</p>
                </div>
                <MousePointerClick className="h-6 w-6 sm:h-8 sm:w-8 text-success flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {language === "es" ? "CVR Promedio" : "Avg CVR"}
                  </p>
                  <p className="text-xl sm:text-2xl mt-1 text-brand">{avgConversionRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-brand flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col xs:flex-row gap-2 w-full">
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-full xs:w-[180px] sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("landings.allPages")}</SelectItem>
              <SelectItem value="Publicada">
                {language === "es" ? "Publicadas" : "Published"}
              </SelectItem>
              <SelectItem value="Borrador">
                {language === "es" ? "Borradores" : "Drafts"}
              </SelectItem>
              <SelectItem value="Archivada">
                {language === "es" ? "Archivadas" : "Archived"}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full xs:flex-1 sm:w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">
                {language === "es" ? "Más recientes" : "Most recent"}
              </SelectItem>
              <SelectItem value="conversions">
                {language === "es" ? "Mayor conversión" : "Highest conversion"}
              </SelectItem>
              <SelectItem value="visits">
                {language === "es" ? "Más visitadas" : "Most visited"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Badge variant="outline" className="self-start">
          {displayedPages.length} {language === "es" 
            ? (displayedPages.length === 1 ? "resultado" : "resultados")
            : (displayedPages.length === 1 ? "result" : "results")
          }
        </Badge>
      </div>

      {/* Landing Pages List */}
      {loadingPages ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {displayedPages.length === 0 ? (
          <Card>
            <CardContent className="pt-6 px-4 sm:px-6 text-center py-12 sm:py-16">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="mb-2">
                {language === "es" ? "No hay landing pages" : "No landing pages"}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {filterStatus !== "all"
                  ? (language === "es" ? "No hay páginas con este estado" : "No pages with this status")
                  : (language === "es" 
                      ? "Crea tu primera landing page para empezar a captar leads"
                      : "Create your first landing page to start capturing leads"
                    )}
              </p>
              {filterStatus === "all" && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === "es" ? "Crear Primera Landing" : "Create First Landing"}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          displayedPages.map((landing) => (
            <Card key={landing.id} className="hover:border-brand transition-all hover:shadow-md">
              <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                <div className="flex flex-col gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h3 className="text-lg sm:text-xl break-words">{landing.name}</h3>
                      <Badge variant="outline" className="flex-shrink-0">{landing.template}</Badge>
                      <Badge
                        className={
                          landing.status === "Publicada"
                            ? "bg-success text-white"
                            : landing.status === "Borrador"
                            ? "bg-warning text-white"
                            : "bg-gray-400 text-white"
                        }
                      >
                        {landing.status}
                      </Badge>
                      {landing.conversionRate > 10 && (
                        <Badge variant="outline" className="bg-brand/10 text-brand border-brand/20">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Top
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <button
                        onClick={() => window.open(landing.url, '_blank', 'noopener,noreferrer')}
                        className="flex items-center gap-2 hover:text-brand transition-colors cursor-pointer group max-w-full"
                        title={language === "es" ? "Abrir en nueva pestaña" : "Open in new tab"}
                      >
                        <ExternalLink className="h-4 w-4 flex-shrink-0 group-hover:text-brand" />
                        <code className="text-xs bg-muted px-2 py-1 rounded truncate group-hover:bg-brand/10 transition-colors max-w-[200px] sm:max-w-none">{landing.url}</code>
                      </button>
                      <span className="hidden sm:inline">•</span>
                      <span className="text-xs">
                        {language === "es" ? "Última edición:" : "Last edited:"} {landing.lastEdited.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end sm:justify-start">
                    <Button variant="outline" size="sm" onClick={() => handlePreviewLanding(landing)} className="flex-1 sm:flex-none min-w-[80px]">
                      <Eye className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">
                        {language === "es" ? "Vista previa" : "Preview"}
                      </span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditLanding(landing)} className="flex-1 sm:flex-none min-w-[80px]">
                      <Edit2 className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">
                        {language === "es" ? "Editar" : "Edit"}
                      </span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDuplicateLanding(landing)} className="w-10 sm:w-auto">
                      <Copy className="h-4 w-4" />
                    </Button>
                    {landing.status !== "Archivada" && (
                      <Button variant="outline" size="sm" onClick={() => handleArchiveLanding(landing.id)} className="hidden lg:inline-flex">
                        {language === "es" ? "Archivar" : "Archive"}
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {language === "es" ? "¿Eliminar landing page?" : "Delete landing page?"}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {language === "es" 
                              ? `Esta acción no se puede deshacer. Se eliminará permanentemente "${landing.name}" y todos sus datos.`
                              : `This action cannot be undone. This will permanently delete "${landing.name}" and all its data.`
                            }
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {language === "es" ? "Cancelar" : "Cancel"}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteLanding(landing.id)}
                            className="bg-destructive text-destructive-foreground"
                          >
                            {language === "es" ? "Eliminar" : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {landing.status === "Publicada" && (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 pt-4 border-t">
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">
                          {language === "es" ? "Visitas" : "Visits"}
                        </p>
                        <p className="text-lg sm:text-xl">{landing.visits.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">
                          {t("landings.conversions")}
                        </p>
                        <p className="text-lg sm:text-xl text-success">{landing.submissions}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">CVR</p>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <p className="text-lg sm:text-xl text-brand">{landing.conversionRate}%</p>
                          {landing.conversionRate > 10 && (
                            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-success flex-shrink-0" />
                          )}
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">
                          {language === "es" ? "Bounce Rate" : "Bounce Rate"}
                        </p>
                        <p className="text-lg sm:text-xl">{landing.bounceRate?.toFixed(1) || "N/A"}%</p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">
                          {language === "es" ? "Tiempo Prom." : "Avg. Time"}
                        </p>
                        <p className="text-lg sm:text-xl">{landing.avgTimeOnPage || "N/A"}s</p>
                      </div>
                    </div>

                    {/* Conversion Progress */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          {language === "es" ? "Rendimiento de conversión" : "Conversion Performance"}
                        </span>
                        <span className="text-sm">
                          {landing.conversionRate >= 15
                            ? (language === "es" ? "Excelente" : "Excellent")
                            : landing.conversionRate >= 10
                            ? (language === "es" ? "Bueno" : "Good")
                            : landing.conversionRate >= 5
                            ? (language === "es" ? "Promedio" : "Average")
                            : (language === "es" ? "Mejorable" : "Needs Work")}
                        </span>
                      </div>
                      <Progress value={Math.min(landing.conversionRate * 5, 100)} />
                    </div>
                  </div>
                )}

                {landing.status === "Borrador" && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>
                        {language === "es" 
                          ? "Esta página aún no está publicada. Publícala para empezar a recibir visitas."
                          : "This page is not published yet. Publish it to start receiving visits."}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
        </div>
      )}
    </div>
  );
}

export default LandingPages;
