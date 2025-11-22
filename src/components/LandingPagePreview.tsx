import { useState } from "react";
import { Button } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface LandingPagePreviewProps {
  data: {
    title: string;
    subtitle?: string;
    description: string;
    benefits?: string[];
    buttonText: string;
    successMessage: string;
    captureSource?: boolean;
    sourceLabel?: string;
    fields: {
      name: boolean;
      email: boolean;
      company: boolean;
      phone: boolean;
      jobTitle: boolean;
      message: boolean;
    };
    gdprConsent: boolean;
    styling: {
      primaryColor: string;
      backgroundColor: string;
      textColor: string;
      buttonStyle: "solid" | "outline" | "gradient";
      layoutStyle: "centered" | "split" | "hero";
      imageUrl?: string;
    };
  };
  landingPageId?: string;
  onSubmit?: (formData: Record<string, string>, gdprAccepted: boolean) => Promise<void>;
}

export function LandingPagePreview({ data, landingPageId, onSubmit }: LandingPagePreviewProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🔄 [LandingPagePreview] Form submission started');
    console.log('📝 [LandingPagePreview] Form data:', formData);
    console.log('✅ [LandingPagePreview] GDPR accepted:', gdprAccepted);

    // Validation
    if (data.gdprConsent && !gdprAccepted) {
      toast.error("Debes aceptar la política de privacidad");
      return;
    }

    if (data.fields.email && !formData.email) {
      toast.error("El email es requerido");
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(formData, gdprAccepted);
      } else {
        // Simulación por defecto si no se pasa onSubmit
        console.log('🔄 [LandingPagePreview] Simulating API submission...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log('✅ [LandingPagePreview] Form submitted successfully', { landingPageId });
      setIsSubmitted(true);
      toast.success(data.successMessage || "¡Gracias! Tu información ha sido recibida.");
    } catch (error) {
      console.error('❌ [LandingPagePreview] Submission error:', error);
      toast.error("Hubo un error al enviar el formulario. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      padding: "12px 32px",
      fontSize: "16px",
      fontWeight: "600",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      width: "100%",
    };

    if (data.styling.buttonStyle === "gradient") {
      return {
        ...baseStyle,
        background: `linear-gradient(135deg, ${data.styling.primaryColor}, ${data.styling.primaryColor}dd)`,
        color: "#fff",
        border: "none",
      };
    } else if (data.styling.buttonStyle === "outline") {
      return {
        ...baseStyle,
        backgroundColor: "transparent",
        borderColor: data.styling.primaryColor,
        color: data.styling.primaryColor,
        borderWidth: "2px",
        borderStyle: "solid",
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: data.styling.primaryColor,
        color: "#fff",
        border: "none",
      };
    }
  };

  if (isSubmitted) {
    return (
      <div
        style={{
          backgroundColor: data.styling.backgroundColor,
          color: data.styling.textColor,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "600px" }}>
          <div style={{ marginBottom: "24px" }}>
            <CheckCircle2 size={64} style={{ color: data.styling.primaryColor, margin: "0 auto" }} />
          </div>
          <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}>
            ¡Éxito!
          </h2>
          <p style={{ fontSize: "18px", opacity: 0.8 }}>
            {data.successMessage}
          </p>
        </div>
      </div>
    );
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor: data.styling.backgroundColor,
    color: data.styling.textColor,
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    padding: "40px 20px",
  };

  const contentWrapperStyle: React.CSSProperties = {
    maxWidth: data.styling.layoutStyle === "split" ? "1200px" : "800px",
    margin: "0 auto",
    width: "100%",
    display: data.styling.layoutStyle === "split" ? "grid" : "block",
    gridTemplateColumns: data.styling.layoutStyle === "split" ? "1fr 1fr" : "1fr",
    gap: data.styling.layoutStyle === "split" ? "60px" : "0",
    alignItems: "center",
  };

  return (
    <div style={containerStyle}>
      <div style={contentWrapperStyle}>
        {/* Content Section */}
        <div style={{ marginBottom: data.styling.layoutStyle === "centered" ? "40px" : "0" }}>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "bold",
            marginBottom: "16px",
            lineHeight: "1.2",
          }}>
            {data.title}
          </h1>

          {data.subtitle && (
            <p style={{
              fontSize: "24px",
              opacity: 0.8,
              marginBottom: "24px"
            }}>
              {data.subtitle}
            </p>
          )}

          <p style={{
            fontSize: "18px",
            lineHeight: "1.6",
            marginBottom: "32px",
            opacity: 0.9,
          }}>
            {data.description}
          </p>

          {data.styling.imageUrl && data.styling.layoutStyle !== "split" && (
            <img
              src={data.styling.imageUrl}
              alt="Landing visual"
              style={{
                width: "100%",
                borderRadius: "14px",
                marginBottom: "24px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
              }}
            />
          )}

          {data.benefits && data.benefits.length > 0 && (
            <ul style={{ marginBottom: "24px", paddingLeft: "18px", color: "#16a34a" }}>
              {data.benefits.filter(Boolean).map((benefit, idx) => (
                <li key={idx} style={{ marginBottom: "6px" }}>{benefit}</li>
              ))}
            </ul>
          )}

          {data.benefits && data.benefits.length > 0 && (
            <ul style={{
              listStyle: "none",
              padding: 0,
              marginBottom: "32px"
            }}>
              {data.benefits.map((benefit, index) => (
                <li key={index} style={{
                  display: "flex",
                  alignItems: "start",
                  marginBottom: "12px",
                  fontSize: "16px",
                }}>
                  <CheckCircle2
                    size={20}
                    style={{
                      color: data.styling.primaryColor,
                      marginRight: "12px",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Form Section */}
        <div>
          <form onSubmit={handleSubmit} style={{
            backgroundColor: data.styling.layoutStyle === "split" ? "rgba(255,255,255,0.05)" : "transparent",
            padding: data.styling.layoutStyle === "split" ? "40px" : "0",
            borderRadius: "12px",
            border: data.styling.layoutStyle === "split" ? "1px solid rgba(0,0,0,0.1)" : "none",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {data.fields.name && (
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                    Nombre *
                  </label>
                  <Input
                    type="text"
                    placeholder="Tu nombre completo"
                    required
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    style={{ width: "100%", padding: "12px", fontSize: "16px" }}
                  />
                </div>
              )}

              {data.fields.email && (
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                    Email *
                  </label>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    required
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    style={{ width: "100%", padding: "12px", fontSize: "16px" }}
                  />
                </div>
              )}

              {data.fields.company && (
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                    Empresa
                  </label>
                  <Input
                    type="text"
                    placeholder="Nombre de tu empresa"
                    value={formData.company || ""}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    style={{ width: "100%", padding: "12px", fontSize: "16px" }}
                  />
                </div>
              )}

              {data.captureSource && (
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                    {data.sourceLabel || "Fuente / origen"}
                  </label>
                  <Input
                    type="text"
                    placeholder={data.sourceLabel || "Cómo nos conociste"}
                    value={formData.source || ""}
                    onChange={(e) => handleInputChange("source", e.target.value)}
                    style={{ width: "100%", padding: "12px", fontSize: "16px" }}
                  />
                </div>
              )}

              {data.fields.phone && (
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                    Teléfono
                  </label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    style={{ width: "100%", padding: "12px", fontSize: "16px" }}
                  />
                </div>
              )}

              {data.fields.jobTitle && (
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                    Cargo
                  </label>
                  <Input
                    type="text"
                    placeholder="Tu cargo o posición"
                    value={formData.jobTitle || ""}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    style={{ width: "100%", padding: "12px", fontSize: "16px" }}
                  />
                </div>
              )}

              {data.fields.message && (
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                    Mensaje
                  </label>
                  <Textarea
                    placeholder="Escribe tu mensaje aquí..."
                    value={formData.message || ""}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    style={{ width: "100%", padding: "12px", fontSize: "16px", minHeight: "120px" }}
                  />
                </div>
              )}

              {data.gdprConsent && (
                <div style={{ display: "flex", alignItems: "start", gap: "8px" }}>
                  <Checkbox
                    id="gdpr"
                    checked={gdprAccepted}
                    onCheckedChange={(checked) => setGdprAccepted(checked as boolean)}
                  />
                  <label htmlFor="gdpr" style={{ fontSize: "14px", opacity: 0.8, cursor: "pointer" }}>
                    Acepto la política de privacidad y el tratamiento de mis datos personales *
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                style={getButtonStyle()}
              >
                {isSubmitting ? "Enviando..." : data.buttonText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
