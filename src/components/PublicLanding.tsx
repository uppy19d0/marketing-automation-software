import { useEffect, useState } from "react";
import { landingPageService, LandingPage } from "../services/landingPageService";
import { LandingPagePreview } from "./LandingPagePreview";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";

interface PublicLandingProps {
  slug: string;
}

export function PublicLanding({ slug }: PublicLandingProps) {
  const [landing, setLanding] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLanding = async () => {
      try {
        const response = await landingPageService.getLandingPageBySlug(slug);
        const data = (response as any)?.data || response;
        setLanding(data);
        setError(null);
      } catch (err: any) {
        setError(err?.message || "Landing no encontrada");
      } finally {
        setLoading(false);
      }
    };

    fetchLanding();
  }, [slug]);

  const handleSubmit = async (formData: Record<string, string>) => {
    if (!landing?._id) {
      throw new Error("Landing no encontrada");
    }

    const payload: any = {
      email: formData.email,
      firstName: formData.name,
      lastName: "",
      company: formData.company,
      phone: formData.phone,
      jobTitle: formData.jobTitle,
      message: formData.message,
    };

    await landingPageService.submitLandingPage(landing._id, payload);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted text-foreground">
        Cargando landing...
        <Toaster />
      </div>
    );
  }

  if (error || !landing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted text-foreground">
        {error || "Landing no encontrada"}
        <Toaster />
      </div>
    );
  }

  return (
    <>
      <LandingPagePreview
        landingPageId={landing._id}
        data={{
          title: landing.title,
          subtitle: (landing as any).subtitle,
          description: landing.description || "",
          benefits: (landing as any).benefits || [],
          buttonText: (landing as any).buttonText || "Enviar",
          successMessage: (landing as any).successMessage || "¡Gracias! Revisa tu email.",
          fields: (landing as any).formFields || {
            name: true,
            email: true,
            company: false,
            phone: false,
            jobTitle: false,
            message: false,
          },
          gdprConsent: (landing as any).gdprConsent !== false,
          styling: (landing as any).styling || {
            primaryColor: "#0EA5E9",
            backgroundColor: "#FFFFFF",
            textColor: "#111827",
            buttonStyle: "solid",
            layoutStyle: "centered",
          },
        }}
        onSubmit={async (form, gdpr) => {
          if ((landing as any).gdprConsent && !gdpr) {
            toast.error("Debes aceptar la política de privacidad");
            throw new Error("GDPR no aceptado");
          }
          await handleSubmit(form);
        }}
      />
      <Toaster />
    </>
  );
}
