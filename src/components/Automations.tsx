import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Plus, Play, Pause, Zap, ArrowRight, GitBranch } from "lucide-react";
import { Switch } from "./ui/switch";
import { useLanguage } from "../contexts/LanguageContext";

const automationsData = [
  { 
    id: 1, 
    name: "Bienvenida", 
    status: "Activa", 
    trigger: "Formulario enviado en Landing 'Lead Magnet'",
    actions: ["Asignar tag: nuevo", "Programar Campaña: Bienvenida en 5 min"],
    contacts: 45,
    completed: 42
  },
  { 
    id: 2, 
    name: "Re-engagement", 
    status: "Pausada", 
    trigger: "Etiqueta añadida: inactivo",
    actions: ["Programar Campaña: Oferta Especial"],
    contacts: 12,
    completed: 8
  },
];

export function Automations() {
  const { t, language } = useLanguage();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl">{t("automations.title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("automations.subtitle")}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("automations.createAutomation")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {language === "es" ? "Crear Automatización" : "Create Automation"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Nombre del Flujo</Label>
                <Input placeholder="Ej: Bienvenida a Nuevos Leads" />
              </div>

              {/* Trigger */}
              <div className="space-y-3">
                <Label>Disparador (Trigger)</Label>
                <Card className="bg-brand/5 border-brand">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <Zap className="h-8 w-8 text-brand" />
                      <div className="flex-1">
                        <Select defaultValue="form-submit">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="form-submit">Formulario enviado en Landing</SelectItem>
                            <SelectItem value="tag-added">Etiqueta añadida</SelectItem>
                            <SelectItem value="campaign-open">Campaña abierta</SelectItem>
                            <SelectItem value="campaign-click">Click en campaña</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-3 ml-11">
                      <Label className="text-xs">Seleccionar Landing Page</Label>
                      <Select>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Selecciona una landing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lead-magnet">Lead Magnet - Guía Marketing</SelectItem>
                          <SelectItem value="newsletter">Newsletter Suscripción</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Acciones</Label>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir acción
                  </Button>
                </div>

                <div className="space-y-3 ml-11">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  
                  <Card>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <Select defaultValue="assign-tag">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="assign-tag">Asignar Etiqueta</SelectItem>
                            <SelectItem value="send-campaign">Enviar Campaña</SelectItem>
                            <SelectItem value="remove-tag">Remover Etiqueta</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input placeholder="Nombre de la etiqueta" defaultValue="nuevo" />
                      </div>
                    </CardContent>
                  </Card>

                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  
                  <Card>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <Select defaultValue="send-campaign">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="assign-tag">Asignar Etiqueta</SelectItem>
                            <SelectItem value="send-campaign">Enviar Campaña</SelectItem>
                            <SelectItem value="remove-tag">Remover Etiqueta</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar campaña" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bienvenida">Bienvenida A</SelectItem>
                            <SelectItem value="newsletter">Newsletter Semanal</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Esperar</Label>
                          <Input type="number" defaultValue="5" className="w-20" />
                          <Select defaultValue="min">
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="min">minutos</SelectItem>
                              <SelectItem value="hours">horas</SelectItem>
                              <SelectItem value="days">días</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                <div>
                  <Label>Estado del Flujo</Label>
                  <p className="text-xs text-muted-foreground">Activar inmediatamente</p>
                </div>
                <Switch defaultChecked />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Crear Automatización</Button>
                <Button variant="outline" className="flex-1">Guardar Borrador</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Automations List */}
      <div className="grid gap-4">
        {automationsData.map((automation) => (
          <Card key={automation.id} className="hover:border-brand transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="h-6 w-6 text-brand" />
                    <h3 className="text-xl">{automation.name}</h3>
                    <Badge className={automation.status === "Activa" ? "bg-success text-white" : "bg-gray-300 text-gray-700"}>
                      {automation.status}
                    </Badge>
                  </div>

                  {/* Flow Visualization */}
                  <div className="space-y-3 ml-9">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-brand rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">Disparador</p>
                        <p className="text-xs text-muted-foreground">{automation.trigger}</p>
                      </div>
                    </div>

                    <div className="ml-1 border-l-2 border-dashed border-brand h-6"></div>

                    <div className="space-y-3">
                      {automation.actions.map((action, idx) => (
                        <div key={idx}>
                          <div className="flex items-start gap-3">
                            <ArrowRight className="h-4 w-4 text-brand mt-1" />
                            <div className="flex-1 p-2 bg-accent rounded">
                              <p className="text-sm">{action}</p>
                            </div>
                          </div>
                          {idx < automation.actions.length - 1 && (
                            <div className="ml-2 border-l-2 border-dashed border-gray-300 h-4"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {automation.status === "Activa" ? (
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4 mr-2" />
                      Pausar
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Activar
                    </Button>
                  )}
                  <Button variant="outline" size="sm">Editar</Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Contactos en flujo</p>
                  <p className="text-2xl">{automation.contacts}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completados</p>
                  <p className="text-2xl text-success">{automation.completed}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tasa de éxito</p>
                  <p className="text-2xl text-brand">
                    {((automation.completed / automation.contacts) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {automationsData.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl mb-2">Automatiza tu marketing</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Crea flujos automatizados para ahorrar tiempo y mejorar tus conversiones
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Automatización
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
