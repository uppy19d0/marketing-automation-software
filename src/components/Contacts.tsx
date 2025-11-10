import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Search, Users, Mail, Tag, Download, Upload, Filter } from "lucide-react";

const contactsData = [
  {
    id: 1,
    name: "María García",
    email: "maria.garcia@email.com",
    status: "Activo",
    segment: "Cliente VIP",
    score: 95,
    lastActivity: "Hace 2 horas",
    campaigns: 12,
    opens: 85,
    clicks: 42
  },
  {
    id: 2,
    name: "Juan Pérez",
    email: "juan.perez@email.com",
    status: "Activo",
    segment: "Nuevo Suscriptor",
    score: 45,
    lastActivity: "Hace 1 día",
    campaigns: 3,
    opens: 2,
    clicks: 1
  },
  {
    id: 3,
    name: "Ana Rodríguez",
    email: "ana.rodriguez@email.com",
    status: "Activo",
    segment: "Cliente Regular",
    score: 72,
    lastActivity: "Hace 5 horas",
    campaigns: 8,
    opens: 54,
    clicks: 28
  },
  {
    id: 4,
    name: "Carlos López",
    email: "carlos.lopez@email.com",
    status: "Inactivo",
    segment: "Cliente Inactivo",
    score: 15,
    lastActivity: "Hace 30 días",
    campaigns: 15,
    opens: 12,
    clicks: 3
  },
  {
    id: 5,
    name: "Laura Martínez",
    email: "laura.martinez@email.com",
    status: "Activo",
    segment: "Cliente VIP",
    score: 88,
    lastActivity: "Hace 1 hora",
    campaigns: 20,
    opens: 158,
    clicks: 89
  },
  {
    id: 6,
    name: "Pedro Sánchez",
    email: "pedro.sanchez@email.com",
    status: "Activo",
    segment: "Cliente Regular",
    score: 63,
    lastActivity: "Hace 3 días",
    campaigns: 7,
    opens: 38,
    clicks: 19
  },
  {
    id: 7,
    name: "Sofia Torres",
    email: "sofia.torres@email.com",
    status: "Pendiente",
    segment: "Nuevo Suscriptor",
    score: 0,
    lastActivity: "Nunca",
    campaigns: 0,
    opens: 0,
    clicks: 0
  },
  {
    id: 8,
    name: "Miguel Ángel Ruiz",
    email: "miguel.ruiz@email.com",
    status: "Activo",
    segment: "Cliente Regular",
    score: 56,
    lastActivity: "Hace 2 días",
    campaigns: 9,
    opens: 45,
    clicks: 18
  },
];

const segments = [
  { name: "Cliente VIP", count: 234, color: "bg-purple-100 text-purple-800" },
  { name: "Cliente Regular", count: 1456, color: "bg-blue-100 text-blue-800" },
  { name: "Nuevo Suscriptor", count: 567, color: "bg-green-100 text-green-800" },
  { name: "Cliente Inactivo", count: 123, color: "bg-gray-100 text-gray-800" },
];

export function Contacts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSegment, setFilterSegment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredContacts = contactsData.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = filterSegment === "all" || contact.segment === filterSegment;
    const matchesStatus = filterStatus === "all" || contact.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesSegment && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "bg-green-100 text-green-800";
      case "Inactivo":
        return "bg-red-100 text-red-800";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl dark:text-white">Contactos</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gestiona tu base de datos de contactos y segmentos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Contacto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Contacto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nombre Completo</Label>
                  <Input placeholder="Juan Pérez" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="juan.perez@email.com" />
                </div>
                <div className="space-y-2">
                  <Label>Segmento</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar segmento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vip">Cliente VIP</SelectItem>
                      <SelectItem value="regular">Cliente Regular</SelectItem>
                      <SelectItem value="new">Nuevo Suscriptor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Teléfono (opcional)</Label>
                  <Input placeholder="+34 600 000 000" />
                </div>
                <Button className="w-full">Agregar Contacto</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Segments Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        {segments.map((segment, index) => (
          <Card key={index} className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm dark:text-gray-300">{segment.name}</CardTitle>
              <Tag className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl dark:text-white">{segment.count.toLocaleString()}</div>
              <Badge className={`${segment.color} mt-2`}>{segment.name}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <Select value={filterSegment} onValueChange={setFilterSegment}>
              <SelectTrigger className="w-[200px] dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Segmento" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectItem value="all">Todos los segmentos</SelectItem>
                <SelectItem value="Cliente VIP">Cliente VIP</SelectItem>
                <SelectItem value="Cliente Regular">Cliente Regular</SelectItem>
                <SelectItem value="Nuevo Suscriptor">Nuevo Suscriptor</SelectItem>
                <SelectItem value="Cliente Inactivo">Cliente Inactivo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px] dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 px-4 dark:text-gray-300">Contacto</th>
                  <th className="text-left py-3 px-4 dark:text-gray-300">Estado</th>
                  <th className="text-left py-3 px-4 dark:text-gray-300">Segmento</th>
                  <th className="text-center py-3 px-4 dark:text-gray-300">Puntuación</th>
                  <th className="text-left py-3 px-4 dark:text-gray-300">Última Actividad</th>
                  <th className="text-center py-3 px-4 dark:text-gray-300">Campañas</th>
                  <th className="text-center py-3 px-4 dark:text-gray-300">Aperturas</th>
                  <th className="text-center py-3 px-4 dark:text-gray-300">Clicks</th>
                  <th className="text-center py-3 px-4 dark:text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="dark:text-white">{contact.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{contact.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(contact.status)}>{contact.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm dark:text-gray-300">{contact.segment}</span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`${getScoreColor(contact.score)}`}>{contact.score}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{contact.lastActivity}</td>
                    <td className="text-center py-3 px-4 dark:text-gray-300">{contact.campaigns}</td>
                    <td className="text-center py-3 px-4 dark:text-gray-300">{contact.opens}</td>
                    <td className="text-center py-3 px-4 dark:text-gray-300">{contact.clicks}</td>
                    <td className="text-center py-3 px-4">
                      <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Ver</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
