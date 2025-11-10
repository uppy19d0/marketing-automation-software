import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Plus, Mail, BarChart3, Calendar, Sparkles, Check, AlertCircle } from "lucide-react";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { useLanguage } from "../contexts/LanguageContext";

const campaignsData = [
  { id: 1, name: "Bienvenida A/B", status: "Enviada", subject: "Beneficios exclusivos", sent: 566, opens: 256, openRate: 45.2, ctr: 8.3, type: "A/B Test" },
  { id: 2, name: "Newsletter Semanal", status: "Enviada", subject: "Novedades de esta semana", sent: 1247, opens: 524, openRate: 42.0, ctr: 6.8, type: "Normal" },
  { id: 3, name: "Oferta Especial", status: "Programada", subject: "48 horas para aprovechar", sent: 0, opens: 0, openRate: 0, ctr: 0, type: "Normal" },
  { id: 4, name: "Lead Magnet Follow-up", status: "Borrador", subject: "", sent: 0, opens: 0, openRate: 0, ctr: 0, type: "Normal" },
];

const aiSuggestions = {
  subjects: [
    "{{first_name}}, activa tu beneficio en 48h",
    "Solo hoy: Descuento exclusivo para ti",
    "Tu guía gratuita te está esperando"
  ],
  ctas: [
    "Empieza ahora",
    "Ver beneficios",
    "Descargar guía"
  ]
};

const copyScore = {
  total: 78,
  checks: [
    { name: "Longitud del asunto (< 55 caracteres)", passed: true },
    { name: "Incluye verbo de acción", passed: true },
    { name: "Contiene número o dato", passed: false },
    { name: "Genera urgencia", passed: true },
    { name: "Evita palabras spam", passed: true }
  ]
};

export function CampaignsNew() {
  const { t, language } = useLanguage();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [abTestEnabled, setAbTestEnabled] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);

  const steps = ["Detalles", "Contenido", "Audiencia", "Revisión"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Enviada": return "bg-success text-white";
      case "Programada": return "bg-brand text-white";
      case "Borrador": return "bg-gray-300 text-gray-700";
      default: return "bg-gray-300 text-gray-700";
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl">{t("campaigns.title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("campaigns.subtitle")}</p>
        </div>
        <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setWizardOpen(true); setCurrentStep(1); }}>
              <Plus className="h-4 w-4 mr-2" />
              {t("campaigns.createCampaign")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>
                {language === "es" ? "Crear Nueva Campaña" : "Create New Campaign"}
              </DialogTitle>
            </DialogHeader>
            
            {/* Stepper */}
            <div className="py-4">
              <div className="flex items-center justify-between mb-2">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center flex-1">
                    <div className={`flex items-center gap-2 ${index + 1 <= currentStep ? 'text-brand' : 'text-muted-foreground'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        index + 1 < currentStep ? 'bg-brand text-white' :
                        index + 1 === currentStep ? 'border-2 border-brand bg-white' :
                        'border-2 border-gray-300'
                      }`}>
                        {index + 1 < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                      </div>
                      <span className="text-sm hidden md:inline">{step}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 ${index + 1 < currentStep ? 'bg-brand' : 'bg-gray-300'}`} />
                    )}
                  </div>
                ))}
              </div>
              <Progress value={(currentStep / steps.length) * 100} className="h-1" />
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto py-4">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre de la Campaña</Label>
                      <Input placeholder="Ej: Promoción de Primavera" />
                    </div>
                    <div className="space-y-2">
                      <Label>Remitente (demo)</Label>
                      <Input placeholder="marketing@ejemplo.com" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Asunto del Email</Label>
                    <Input placeholder="Escribe un asunto atractivo" />
                    <p className="text-xs text-muted-foreground">Longitud recomendada: 40-55 caracteres</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Preheader</Label>
                    <Input placeholder="Texto que aparece después del asunto" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                    <div>
                      <Label>Habilitar Prueba A/B</Label>
                      <p className="text-xs text-muted-foreground">Prueba 2 versiones del asunto</p>
                    </div>
                    <Switch checked={abTestEnabled} onCheckedChange={setAbTestEnabled} />
                  </div>

                  {abTestEnabled && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label>Asunto Variante B</Label>
                        <Input placeholder="Escribe una variante diferente" />
                      </div>
                      <div className="space-y-2">
                        <Label>División del tráfico: {50}% / {50}%</Label>
                        <Slider defaultValue={[50]} max={100} step={10} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-4">
                    <div className="space-y-2">
                      <Label>Contenido del Email</Label>
                      <div className="border rounded-lg p-4 min-h-[400px] space-y-4">
                        <div className="p-4 bg-accent rounded">
                          <p className="text-sm text-muted-foreground mb-1">Título</p>
                          <Input placeholder="Hola {{first_name}}" className="bg-white" />
                        </div>
                        <div className="p-4 bg-accent rounded">
                          <p className="text-sm text-muted-foreground mb-1">Párrafo</p>
                          <Textarea 
                            placeholder="Escribe tu mensaje aquí. Usa {{first_name}} para personalizar." 
                            rows={6}
                            className="bg-white"
                          />
                        </div>
                        <div className="p-4 bg-accent rounded">
                          <p className="text-sm text-muted-foreground mb-1">Botón</p>
                          <Input placeholder="Texto del botón" className="bg-white" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">+ Título</Button>
                        <Button variant="outline" size="sm">+ Párrafo</Button>
                        <Button variant="outline" size="sm">+ Imagen</Button>
                        <Button variant="outline" size="sm">+ Botón</Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-brand" />
                            IA Local
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="mb-2 block">Sugerir Asunto</Label>
                          <Button variant="outline" className="w-full mb-2" size="sm">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generar sugerencias
                          </Button>
                          <div className="space-y-2">
                            {aiSuggestions.subjects.map((subject, idx) => (
                              <div key={idx} className="p-2 bg-accent rounded text-xs hover:bg-brand hover:text-white cursor-pointer transition-colors">
                                {subject}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="mb-2 block">Mejorar CTA</Label>
                          <div className="space-y-2">
                            {aiSuggestions.ctas.map((cta, idx) => (
                              <div key={idx} className="p-2 bg-accent rounded text-xs hover:bg-brand hover:text-white cursor-pointer transition-colors">
                                {cta}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <Label className="mb-2 block">Score de Copy</Label>
                          <div className="text-center mb-3">
                            <div className="text-4xl text-brand mb-1">{copyScore.total}</div>
                            <Progress value={copyScore.total} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            {copyScore.checks.map((check, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs">
                                {check.passed ? (
                                  <Check className="h-4 w-4 text-success flex-shrink-0" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-warning flex-shrink-0" />
                                )}
                                <span className={check.passed ? "text-muted-foreground" : ""}>
                                  {check.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 bg-warning/10 rounded text-xs">
                          <p className="text-warning">⚠️ El asunto supera 55 caracteres</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Seleccionar Audiencia</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los contactos (1,247)</SelectItem>
                        <SelectItem value="nuevos-rd">Nuevos Leads RD (156)</SelectItem>
                        <SelectItem value="vips-mx">VIPs México (89)</SelectItem>
                        <SelectItem value="lead-magnet">Lead Magnet Activos (234)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Resumen de Audiencia</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-3xl text-brand">1,247</p>
                          <p className="text-xs text-muted-foreground">Contactos</p>
                        </div>
                        <div>
                          <p className="text-3xl text-success">4</p>
                          <p className="text-xs text-muted-foreground">Países</p>
                        </div>
                        <div>
                          <p className="text-3xl text-warning">~525</p>
                          <p className="text-xs text-muted-foreground">Aperturas esperadas</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Revisión Final</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Nombre</p>
                          <p>Promoción de Primavera</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Asunto</p>
                          <p>Beneficios exclusivos para ti</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Audiencia</p>
                          <p>Nuevos Leads RD (156 contactos)</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tipo</p>
                          <p>{abTestEnabled ? "Prueba A/B" : "Campaña Normal"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    <Label>Programación</Label>
                    <Tabs defaultValue="now">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="now">Enviar Ahora</TabsTrigger>
                        <TabsTrigger value="schedule">Programar</TabsTrigger>
                      </TabsList>
                      <TabsContent value="schedule" className="space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <Input type="date" />
                          <Input type="time" />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                Anterior
              </Button>
              <div className="flex gap-2">
                {currentStep < 4 ? (
                  <Button onClick={nextStep}>Siguiente</Button>
                ) : (
                  <>
                    <Button variant="outline">Guardar Borrador</Button>
                    <Button onClick={() => setWizardOpen(false)}>
                      Programar Campaña
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaigns List */}
      <div className="grid gap-4">
        {campaignsData.map((campaign) => (
          <Card key={campaign.id} className="hover:border-brand transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-5 w-5 text-brand" />
                    <h3 className="text-xl">{campaign.name}</h3>
                    <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                    {campaign.type === "A/B Test" && (
                      <Badge variant="outline">A/B Test</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{campaign.subject || "Sin asunto"}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Ver detalle</Button>
                  <Button variant="outline" size="sm">Duplicar</Button>
                </div>
              </div>

              {campaign.status === "Enviada" && (
                <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Enviados</p>
                    <p className="text-2xl">{campaign.sent}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Aperturas</p>
                    <p className="text-2xl text-success">{campaign.opens}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tasa Apertura</p>
                    <p className="text-2xl text-brand">{campaign.openRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CTR</p>
                    <p className="text-2xl text-warning">{campaign.ctr}%</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
