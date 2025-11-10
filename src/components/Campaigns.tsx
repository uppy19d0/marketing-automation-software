import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Search, Mail, Calendar, Users, TrendingUp, Edit, Trash2, Copy } from "lucide-react";

const campaignsData = [
  {
    id: 1,
    name: "Oferta de Verano 2024",
    type: "Promocional",
    status: "Activa",
    sent: 5420,
    opens: 1780,
    clicks: 892,
    openRate: "32.8%",
    clickRate: "16.5%",
    created: "2024-06-01",
    scheduled: "2024-06-05"
  },
  {
    id: 2,
    name: "Newsletter Semanal",
    type: "Newsletter",
    status: "Completada",
    sent: 12458,
    opens: 4102,
    clicks: 1956,
    openRate: "32.9%",
    clickRate: "15.7%",
    created: "2024-05-28",
    scheduled: "2024-06-01"
  },
  {
    id: 3,
    name: "Lanzamiento de Producto",
    type: "Promocional",
    status: "Borrador",
    sent: 0,
    opens: 0,
    clicks: 0,
    openRate: "-",
    clickRate: "-",
    created: "2024-06-03",
    scheduled: "2024-06-15"
  },
  {
    id: 4,
    name: "Recuperación de Carrito",
    type: "Automatizada",
    status: "Activa",
    sent: 2340,
    opens: 856,
    clicks: 445,
    openRate: "36.6%",
    clickRate: "19.0%",
    created: "2024-05-20",
    scheduled: "Automática"
  },
  {
    id: 5,
    name: "Serie de Bienvenida",
    type: "Bienvenida",
    status: "Activa",
    sent: 890,
    opens: 623,
    clicks: 312,
    openRate: "70.0%",
    clickRate: "35.1%",
    created: "2024-05-15",
    scheduled: "Automática"
  },
];

export function Campaigns() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredCampaigns = campaignsData.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || campaign.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activa":
        return "bg-green-100 text-green-800";
      case "Completada":
        return "bg-gray-100 text-gray-800";
      case "Borrador":
        return "bg-yellow-100 text-yellow-800";
      case "Programada":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl dark:text-white">Campañas de Email</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gestiona y monitorea tus campañas de marketing</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Campaña
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Campaña</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nombre de la Campaña</Label>
                <Input placeholder="Ej: Promoción de Primavera" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Campaña</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="promotional">Promocional</SelectItem>
                      <SelectItem value="transactional">Transaccional</SelectItem>
                      <SelectItem value="welcome">Bienvenida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Segmento de Audiencia</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar segmento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los contactos</SelectItem>
                      <SelectItem value="active">Clientes activos</SelectItem>
                      <SelectItem value="inactive">Clientes inactivos</SelectItem>
                      <SelectItem value="new">Nuevos suscriptores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Asunto del Email</Label>
                <Input placeholder="Ingresa el asunto del email" />
              </div>
              <div className="space-y-2">
                <Label>Contenido del Email</Label>
                <Textarea placeholder="Escribe el contenido de tu email..." rows={6} />
              </div>
              <div className="space-y-2">
                <Label>Fecha de Envío</Label>
                <Input type="datetime-local" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Crear Campaña</Button>
                <Button variant="outline">Guardar Borrador</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar campañas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px] dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="activa">Activa</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="borrador">Borrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Grid */}
      <div className="grid gap-4">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl dark:text-white">{campaign.name}</h3>
                    <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">{campaign.type}</Badge>
                    <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                  </div>
                  <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Creada: {campaign.created}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Programada: {campaign.scheduled}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
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
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Enviados</div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-xl dark:text-white">{campaign.sent.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Aperturas</div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-xl dark:text-white">{campaign.opens.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Clicks</div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-xl dark:text-white">{campaign.clicks.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tasa Apertura</div>
                  <div className="text-xl text-green-600 dark:text-green-400">{campaign.openRate}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tasa Clicks</div>
                  <div className="text-xl text-purple-600 dark:text-purple-400">{campaign.clickRate}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
