import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Sparkles, Plus, Trash2, AlertCircle } from "lucide-react";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";

const customFields = [
  { id: 1, name: "Empresa", nameEn: "Company", type: "text", required: false },
  { id: 2, name: "Cargo", nameEn: "Position", type: "text", required: false },
  { id: 3, name: "Teléfono", nameEn: "Phone", type: "text", required: false },
];

const systemVariables = [
  { variable: "{{first_name}}", description: "Nombre del contacto", descriptionEn: "Contact first name" },
  { variable: "{{last_name}}", description: "Apellido del contacto", descriptionEn: "Contact last name" },
  { variable: "{{email}}", description: "Email del contacto", descriptionEn: "Contact email" },
  { variable: "{{country}}", description: "País del contacto", descriptionEn: "Contact country" },
  { variable: "{{company}}", description: "Empresa del contacto", descriptionEn: "Contact company" },
];

export function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const [workspaceName, setWorkspaceName] = useState("Mi Empresa Marketing");
  const [timezone, setTimezone] = useState("america-santo-domingo");

  const handleSaveChanges = () => {
    toast.success(t("settings.saved"));
  };

  const handleLanguageChange = (newLanguage: "es" | "en") => {
    setLanguage(newLanguage);
    toast.success(t("settings.languageChanged"));
  };

  const handleCopyVariable = (variable: string) => {
    navigator.clipboard.writeText(variable);
    toast.success(
      language === "es" ? "Variable copiada al portapapeles" : "Variable copied to clipboard"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl">{t("settings.title")}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t("settings.subtitle")}</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">{t("settings.general")}</TabsTrigger>
          <TabsTrigger value="fields">{t("settings.customFields")}</TabsTrigger>
          <TabsTrigger value="variables">{t("settings.systemVariables")}</TabsTrigger>
          <TabsTrigger value="ai">{t("settings.aiDemo")}</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.workspaceInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("settings.workspaceName")}</Label>
                <Input 
                  value={workspaceName} 
                  onChange={(e) => setWorkspaceName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("settings.timezone")}</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america-santo-domingo">América/Santo Domingo (AST)</SelectItem>
                      <SelectItem value="america-mexico">América/México (CST)</SelectItem>
                      <SelectItem value="america-bogota">América/Bogotá (COT)</SelectItem>
                      <SelectItem value="europe-madrid">Europa/Madrid (CET)</SelectItem>
                      <SelectItem value="america-new-york">America/New York (EST)</SelectItem>
                      <SelectItem value="america-los-angeles">America/Los Angeles (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("settings.language")}</Label>
                  <Select value={language} onValueChange={(value: "es" | "en") => handleLanguageChange(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveChanges}>{t("settings.saveChanges")}</Button>
            </CardContent>
          </Card>

          <Card className="border-warning bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm">
                    {language === "es" ? "Aplicación de Demostración Local" : "Local Demo Application"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === "es" 
                      ? "Esta es una versión demo sin integraciones externas. Todos los datos son simulados y se almacenan localmente en tu navegador."
                      : "This is a demo version without external integrations. All data is simulated and stored locally in your browser."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Fields */}
        <TabsContent value="fields" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t("settings.customFields")}</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === "es" ? "Nuevo Campo" : "New Field"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customFields.map((field) => (
                  <div key={field.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <div>
                        <p className="text-sm">{language === "es" ? field.name : field.nameEn}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{field.type}</Badge>
                          {field.required && (
                            <Badge variant="secondary" className="text-xs">
                              {language === "es" ? "Obligatorio" : "Required"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        {language === "es" ? "Editar" : "Edit"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variables */}
        <TabsContent value="variables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.systemVariables")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {language === "es"
                  ? "Usa estas variables en tus emails y landing pages para personalizar el contenido"
                  : "Use these variables in your emails and landing pages to personalize content"}
              </p>
              <div className="space-y-2">
                {systemVariables.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div>
                      <code className="text-sm text-brand bg-white px-2 py-1 rounded">
                        {item.variable}
                      </code>
                      <p className="text-xs text-muted-foreground mt-1">
                        {language === "es" ? item.description : item.descriptionEn}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCopyVariable(item.variable)}
                    >
                      {language === "es" ? "Copiar" : "Copy"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Demo */}
        <TabsContent value="ai" className="space-y-4">
          <Card className="border-brand bg-brand/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand" />
                <CardTitle>{t("settings.aiDemo")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === "es"
                    ? "Estas herramientas de IA están disponibles en el editor de campañas para mejorar tu copy"
                    : "These AI tools are available in the campaign editor to improve your copy"}
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    {language === "es" ? "Sugerir Asunto y CTA" : "Suggest Subject & CTA"}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {language === "es"
                      ? "Genera automáticamente sugerencias de asuntos optimizados y llamadas a la acción efectivas"
                      : "Automatically generate suggestions for optimized subjects and effective calls to action"}
                  </p>
                  <div className="space-y-2">
                    <div className="text-xs">
                      <span className="text-muted-foreground">
                        {language === "es" ? "Ejemplo:" : "Example:"}
                      </span>
                      <div className="mt-1 p-2 bg-accent rounded">
                        {language === "es" 
                          ? `"{{first_name}}, activa tu beneficio en 48h"`
                          : `"{{first_name}}, activate your benefit in 48h"`
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    {language === "es" ? "Score de Copy" : "Copy Score"}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {language === "es"
                      ? "Analiza tu copy y recibe un puntaje con recomendaciones de mejora"
                      : "Analyze your copy and receive a score with improvement recommendations"}
                  </p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">
                          {language === "es" ? "Score Total" : "Total Score"}
                        </span>
                        <span className="text-2xl text-brand">78</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div className="text-xs space-y-1">
                      {language === "es" ? (
                        <>
                          <p className="text-success">✓ Longitud del asunto adecuada</p>
                          <p className="text-success">✓ Incluye verbo de acción</p>
                          <p className="text-warning">⚠ Podría incluir un número</p>
                          <p className="text-success">✓ Genera sensación de urgencia</p>
                          <p className="text-success">✓ No contiene palabras spam</p>
                        </>
                      ) : (
                        <>
                          <p className="text-success">✓ Adequate subject length</p>
                          <p className="text-success">✓ Includes action verb</p>
                          <p className="text-warning">⚠ Could include a number</p>
                          <p className="text-success">✓ Creates sense of urgency</p>
                          <p className="text-success">✓ Contains no spam words</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    {language === "es" ? "Alertas y Advertencias" : "Alerts and Warnings"}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {language === "es"
                      ? "Recibe alertas en tiempo real sobre posibles problemas"
                      : "Receive real-time alerts about potential issues"}
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-warning/10 rounded flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                      <span>
                        {language === "es"
                          ? "El asunto supera 55 caracteres (puede cortarse en móvil)"
                          : "Subject exceeds 55 characters (may be cut off on mobile)"}
                      </span>
                    </div>
                    <div className="p-2 bg-error/10 rounded flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-error flex-shrink-0 mt-0.5" />
                      <span>
                        {language === "es"
                          ? 'Evita palabras como "GRATIS", "URGENTE" en mayúsculas (spam)'
                          : 'Avoid words like "FREE", "URGENT" in uppercase (spam)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-accent rounded-lg">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>{language === "es" ? "Nota:" : "Note:"}</strong>{" "}
                  {language === "es"
                    ? "Estas funciones de IA son demostrativas y locales. No se conectan a servicios externos ni envían datos."
                    : "These AI features are demonstrative and local. They don't connect to external services or send data."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
