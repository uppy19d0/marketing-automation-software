import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Play, Pause, Edit, Copy, Trash2, Zap, GitBranch, Clock, CheckCircle } from "lucide-react";

const workflowsData = [
  {
    id: 1,
    name: "Serie de Bienvenida",
    trigger: "Nuevo suscriptor",
    status: "Activa",
    contacts: 1247,
    completed: 892,
    active: 355,
    emails: 3,
    conversionRate: "28.5%"
  },
  {
    id: 2,
    name: "Recuperación de Carrito",
    trigger: "Carrito abandonado",
    status: "Activa",
    contacts: 456,
    completed: 289,
    active: 167,
    emails: 2,
    conversionRate: "42.3%"
  },
  {
    id: 3,
    name: "Re-engagement",
    trigger: "30 días sin actividad",
    status: "Activa",
    contacts: 234,
    completed: 156,
    active: 78,
    emails: 4,
    conversionRate: "15.8%"
  },
  {
    id: 4,
    name: "Cumpleaños",
    trigger: "Fecha de cumpleaños",
    status: "Pausada",
    contacts: 89,
    completed: 89,
    active: 0,
    emails: 1,
    conversionRate: "52.1%"
  },
  {
    id: 5,
    name: "Post-Compra",
    trigger: "Compra realizada",
    status: "Activa",
    contacts: 678,
    completed: 534,
    active: 144,
    emails: 5,
    conversionRate: "35.7%"
  },
];

const workflowTemplates = [
  {
    name: "Serie de Bienvenida",
    description: "Envía automáticamente una serie de emails a nuevos suscriptores",
    icon: Zap,
    emails: 3
  },
  {
    name: "Recuperación de Carrito",
    description: "Recupera ventas perdidas con recordatorios automáticos",
    icon: GitBranch,
    emails: 2
  },
  {
    name: "Nurturing de Leads",
    description: "Convierte prospectos en clientes con contenido educativo",
    icon: CheckCircle,
    emails: 5
  },
  {
    name: "Re-engagement",
    description: "Reactiva contactos inactivos con ofertas especiales",
    icon: Clock,
    emails: 4
  },
];

export function Workflows() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activa":
        return "bg-green-100 text-green-800";
      case "Pausada":
        return "bg-yellow-100 text-yellow-800";
      case "Borrador":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl dark:text-white">Flujos de Automatización</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Configura workflows automatizados para nutrir tus leads</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Flujo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Flujo de Automatización</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <h3 className="text-lg">Configuración Básica</h3>
                <div className="space-y-2">
                  <Label>Nombre del Flujo</Label>
                  <Input placeholder="Ej: Serie de Bienvenida" />
                </div>
                <div className="space-y-2">
                  <Label>Disparador</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar disparador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subscribe">Nuevo suscriptor</SelectItem>
                      <SelectItem value="cart">Carrito abandonado</SelectItem>
                      <SelectItem value="purchase">Compra realizada</SelectItem>
                      <SelectItem value="birthday">Cumpleaños</SelectItem>
                      <SelectItem value="inactive">Inactividad (días)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg">Plantillas Predefinidas</h3>
                <div className="grid grid-cols-2 gap-4">
                  {workflowTemplates.map((template, index) => (
                    <Card key={index} className="cursor-pointer hover:border-blue-500 transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <template.icon className="h-8 w-8 text-blue-600" />
                          <div>
                            <h4>{template.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                            <Badge className="mt-2">{template.emails} emails</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Usar Plantilla</Button>
                <Button variant="outline" className="flex-1">Crear desde Cero</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workflows Grid */}
      <div className="grid gap-4">
        {workflowsData.map((workflow) => (
          <Card key={workflow.id} className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <h3 className="text-xl dark:text-white">{workflow.name}</h3>
                    <Badge className={getStatusColor(workflow.status)}>{workflow.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <GitBranch className="h-4 w-4" />
                    <span>Disparador: {workflow.trigger}</span>
                    <span className="mx-2">•</span>
                    <span>{workflow.emails} emails en la secuencia</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {workflow.status === "Activa" ? (
                    <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                      <Pause className="h-4 w-4 mr-2" />
                      Pausar
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                      <Play className="h-4 w-4 mr-2" />
                      Activar
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t dark:border-gray-700">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Contactos</div>
                  <div className="text-2xl dark:text-white">{workflow.contacts.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completados</div>
                  <div className="text-2xl text-green-600 dark:text-green-400">{workflow.completed.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">En Proceso</div>
                  <div className="text-2xl text-blue-600 dark:text-blue-400">{workflow.active.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tasa Conversión</div>
                  <div className="text-2xl text-purple-600 dark:text-purple-400">{workflow.conversionRate}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rendimiento</div>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: workflow.conversionRate }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow Steps Preview */}
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="dark:text-gray-300">Email 1: Bienvenida</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="dark:text-gray-300">Email 2: Contenido</span>
                  </div>
                  {workflow.emails > 2 && (
                    <>
                      <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="dark:text-gray-300">+{workflow.emails - 2} más</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
