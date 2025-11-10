import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Search, Upload, Trash2, Tag, Plus, Mail, MousePointerClick, UserCheck } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const contactsData = [
  { id: 1, email: "maria.gonzalez@email.com", name: "María González", tags: ["nuevo", "lead-magnet"], country: "RD", city: "Santo Domingo", score: 85, created: "2024-01-15" },
  { id: 2, email: "carlos.perez@email.com", name: "Carlos Pérez", tags: ["vip"], country: "MX", city: "Ciudad de México", score: 92, created: "2024-01-10" },
  { id: 3, email: "ana.martinez@email.com", name: "Ana Martínez", tags: ["nuevo"], country: "CO", city: "Bogotá", score: 65, created: "2024-01-18" },
  { id: 4, email: "luis.rodriguez@email.com", name: "Luis Rodríguez", tags: ["lead-magnet", "vip"], country: "ES", city: "Madrid", score: 88, created: "2024-01-12" },
  { id: 5, email: "sofia.torres@email.com", name: "Sofía Torres", tags: ["nuevo"], country: "RD", city: "Santiago", score: 72, created: "2024-01-20" },
  { id: 6, email: "miguel.sanchez@email.com", name: "Miguel Sánchez", tags: ["vip"], country: "MX", city: "Guadalajara", score: 95, created: "2024-01-08" },
  { id: 7, email: "laura.diaz@email.com", name: "Laura Díaz", tags: ["nuevo", "lead-magnet"], country: "CO", city: "Medellín", score: 58, created: "2024-01-22" },
  { id: 8, email: "jorge.ramirez@email.com", name: "Jorge Ramírez", tags: ["lead-magnet"], country: "ES", city: "Barcelona", score: 76, created: "2024-01-14" },
];

const timelineEvents = [
  { type: "open", campaign: "Bienvenida A", date: "2024-01-22 10:30" },
  { type: "click", campaign: "Oferta Especial", date: "2024-01-22 09:15" },
  { type: "submit", campaign: "Lead Magnet", date: "2024-01-20 14:22" },
  { type: "open", campaign: "Newsletter", date: "2024-01-19 08:45" },
];

export function ContactsNew() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(contactsData[0]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const filteredContacts = contactsData.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRow = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedRows(
      selectedRows.length === filteredContacts.length ? [] : filteredContacts.map(c => c.id)
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-error";
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "open": return <Mail className="h-4 w-4 text-brand" />;
      case "click": return <MousePointerClick className="h-4 w-4 text-warning" />;
      case "submit": return <UserCheck className="h-4 w-4 text-success" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl">{t("contacts.title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("contacts.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                {t("contacts.importContacts")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {language === "es" ? "Importar Contactos desde CSV" : "Import Contacts from CSV"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm">Arrastra tu archivo CSV aquí</p>
                  <p className="text-xs text-muted-foreground mt-1">o haz clic para seleccionar</p>
                </div>
                <div className="space-y-2">
                  <Label>Mapeo de Columnas</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Select defaultValue="email">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="nombre">Nombre</SelectItem>
                        <SelectItem value="pais">País</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Columna CSV" value="email" disabled />
                  </div>
                </div>
                <Button className="w-full">Importar Contactos</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("contacts.addContact")}
          </Button>
        </div>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("contacts.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select defaultValue="all-tags">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-tags">Todas las etiquetas</SelectItem>
                <SelectItem value="nuevo">Nuevo</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="lead-magnet">Lead Magnet</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-countries">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-countries">Todos los países</SelectItem>
                <SelectItem value="RD">República Dominicana</SelectItem>
                <SelectItem value="MX">México</SelectItem>
                <SelectItem value="CO">Colombia</SelectItem>
                <SelectItem value="ES">España</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-accent rounded-lg">
              <p className="text-sm flex-1">{selectedRows.length} contacto(s) seleccionado(s)</p>
              <Button variant="outline" size="sm">
                <Tag className="h-4 w-4 mr-2" />
                Asignar etiqueta
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.length === filteredContacts.length}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Etiquetas</TableHead>
                <TableHead>País/Ciudad</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(contact.id)}
                      onCheckedChange={() => toggleRow(contact.id)}
                    />
                  </TableCell>
                  <TableCell className="text-sm">{contact.email}</TableCell>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {contact.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {contact.country} • {contact.city}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`${getScoreColor(contact.score)}`}>
                      {contact.score}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {contact.created}
                  </TableCell>
                  <TableCell className="text-right">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedContact(contact)}
                        >
                          Ver detalle
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-[400px] sm:w-[540px]">
                        <SheetHeader>
                          <SheetTitle>Detalle del Contacto</SheetTitle>
                        </SheetHeader>
                        <div className="space-y-6 py-6">
                          {/* Profile */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white text-xl">
                                {selectedContact.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">{selectedContact.name}</p>
                                <p className="text-sm text-muted-foreground">{selectedContact.email}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {selectedContact.tags.map((tag, idx) => (
                                <Badge key={idx} variant="secondary">{tag}</Badge>
                              ))}
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-4">
                            <Card>
                              <CardContent className="pt-4 text-center">
                                <p className="text-2xl">{selectedContact.score}</p>
                                <p className="text-xs text-muted-foreground mt-1">Score</p>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="pt-4 text-center">
                                <p className="text-2xl">{selectedContact.country}</p>
                                <p className="text-xs text-muted-foreground mt-1">País</p>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="pt-4 text-center">
                                <p className="text-2xl">3</p>
                                <p className="text-xs text-muted-foreground mt-1">Segmentos</p>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Timeline */}
                          <div>
                            <h4 className="mb-3">Timeline de Eventos</h4>
                            <div className="space-y-3">
                              {timelineEvents.map((event, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 bg-accent rounded-lg">
                                  {getEventIcon(event.type)}
                                  <div className="flex-1">
                                    <p className="text-sm">{event.campaign}</p>
                                    <p className="text-xs text-muted-foreground">{event.date}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Edit Tags */}
                          <div>
                            <Label className="mb-2 block">Editar Etiquetas</Label>
                            <div className="flex gap-2">
                              <Input placeholder="Nueva etiqueta" />
                              <Button size="sm">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
