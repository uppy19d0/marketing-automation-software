import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Search, Upload, Trash2, Tag, Plus, Mail, MousePointerClick, UserCheck, Eye } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { contactService, Contact, ContactDetailResponse } from "../services/contactService";

type ContactEvent = {
  _id?: string;
  type?: string;
  createdAt?: string;
  campaignId?: { name?: string };
  landingPageId?: { title?: string; name?: string; slug?: string };
  linkUrl?: string;
};

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  country: "",
  city: "",
  tags: "",
};

export function ContactsNew() {
  const { t, language } = useLanguage();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactEvents, setContactEvents] = useState<ContactEvent[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialForm);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<string | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await contactService.getContacts();
      const list = Array.isArray((response as any).data) ? (response as any).data as Contact[] : [];
      setContacts(list);
      if (list.length > 0) {
        setSelectedContact(list[0]);
        setContactEvents([]);
      }
    } catch (err: any) {
      setError(err.message || "No se pudieron cargar los contactos");
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const name = `${contact.firstName || ""} ${contact.lastName || ""}`.trim();
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [contacts, searchTerm]);

  const toggleRow = (id?: string) => {
    if (!id) return;
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    if (selectedRows.length === filteredContacts.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredContacts.map((c) => c._id || ""));
    }
  };

  const getScoreColor = (score?: number) => {
    if (score !== undefined && score >= 80) return "text-success";
    if (score !== undefined && score >= 60) return "text-warning";
    return "text-error";
  };

  const getEventIcon = (type?: string) => {
    switch (type) {
      case "email_open":
        return <Mail className="h-4 w-4 text-brand" />;
      case "email_click":
        return <MousePointerClick className="h-4 w-4 text-warning" />;
      case "form_submit":
        return <UserCheck className="h-4 w-4 text-success" />;
      case "page_view":
        return <Eye className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const handleCreateContact = async () => {
    if (!formData.email) {
      setStatusMessage("El email es obligatorio");
      return;
    }

    setCreating(true);
    setStatusMessage(null);

    try {
      const payload = {
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        email: formData.email,
        country: formData.country || undefined,
        city: formData.city || undefined,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        status: "subscribed" as const,
      };

      const created = await contactService.createContact(payload);
      setContacts((prev) => [created, ...prev]);
      setFormData(initialForm);
      setStatusMessage(language === "es" ? "Contacto creado" : "Contact created");
    } catch (err: any) {
      setStatusMessage(err.message || "No se pudo crear el contacto");
    } finally {
      setCreating(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      setImportResult("Selecciona un archivo CSV primero");
      return;
    }

    setImporting(true);
    setImportResult(null);

    try {
      const result = await contactService.importContacts(importFile);
      setImportResult(
        `${language === "es" ? "Importados" : "Imported"}: ${result.imported} ${
          result.errors ? `• Errores: ${result.errors.length}` : ""
        }`
      );
      await loadContacts();
    } catch (err: any) {
      setImportResult(err.message || "Error al importar contactos");
    } finally {
      setImporting(false);
    }
  };

  const openContactDetail = async (contact: Contact) => {
    if (!contact._id) return;
    setDetailLoading(true);
    setSheetOpen(true);
    try {
      const response = await contactService.getContactById(contact._id);
      if ((response as ContactDetailResponse).contact) {
        const detail = response as ContactDetailResponse;
        setSelectedContact(detail.contact);
        setContactEvents(detail.events || []);
      } else {
        setSelectedContact(response as Contact);
        setContactEvents([]);
      }
    } catch (err: any) {
      setError(err.message || "No se pudo obtener el detalle del contacto");
    } finally {
      setDetailLoading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";
    const parsed = new Date(date);
    return parsed.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
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
                  {language === "es" ? "Importar contactos desde CSV" : "Import contacts from CSV"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Archivo CSV</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Columnas soportadas: email, firstName, lastName, country, city, tags
                  </p>
                </div>
                <Button className="w-full" onClick={handleImport} disabled={importing}>
                  {importing ? "Importando..." : "Importar contactos"}
                </Button>
                {importResult && <p className="text-sm text-muted-foreground">{importResult}</p>}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t("contacts.addContact")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{language === "es" ? "Nuevo contacto" : "New contact"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Apellido</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Apellido"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@ejemplo.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>País</Label>
                    <Input
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="RD, MX..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ciudad</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Ciudad"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Etiquetas (separadas por coma)</Label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="lead, vip"
                  />
                </div>
                <Button onClick={handleCreateContact} disabled={creating} className="w-full">
                  {creating ? "Guardando..." : "Crear contacto"}
                </Button>
                {statusMessage && <p className="text-sm text-muted-foreground">{statusMessage}</p>}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="subscribed">Suscritos</SelectItem>
                <SelectItem value="unsubscribed">Dado de baja</SelectItem>
                <SelectItem value="bounced">Rebotados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedRows.length > 0 && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-accent rounded-lg">
              <p className="text-sm flex-1">{selectedRows.length} contacto(s) seleccionado(s)</p>
              <Button variant="outline" size="sm" disabled>
                <Tag className="h-4 w-4 mr-2" />
                Etiquetar
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando contactos...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : filteredContacts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay contactos aún.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRows.length > 0 && selectedRows.length === filteredContacts.length}
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
                  <TableRow key={contact._id || contact.email}>
                    <TableCell>
                      <Checkbox
                        checked={contact._id ? selectedRows.includes(contact._id) : false}
                        onCheckedChange={() => toggleRow(contact._id)}
                      />
                    </TableCell>
                    <TableCell className="text-sm">{contact.email}</TableCell>
                    <TableCell>{`${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {(contact.tags || []).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {[contact.country, contact.city].filter(Boolean).join(" • ") || "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={getScoreColor(contact.score)}>
                        {contact.score ?? 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(contact.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openContactDetail(contact)}>
                        Ver detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Detalle del contacto</SheetTitle>
          </SheetHeader>
          {detailLoading ? (
            <p className="text-sm text-muted-foreground py-4">Cargando...</p>
          ) : selectedContact ? (
            <div className="space-y-6 py-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white text-xl uppercase">
                    {(selectedContact.firstName?.[0] || selectedContact.email?.[0] || "").toString()}
                  </div>
                  <div>
                    <p className="font-medium">{`${selectedContact.firstName || ""} ${selectedContact.lastName || ""}`.trim() || selectedContact.email}</p>
                    <p className="text-sm text-muted-foreground">{selectedContact.email}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(selectedContact.tags || []).map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-2xl">{selectedContact.score ?? 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Score</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-2xl">{selectedContact.country || "—"}</p>
                    <p className="text-xs text-muted-foreground mt-1">País</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <p className="text-2xl">{selectedContact.city || "—"}</p>
                    <p className="text-xs text-muted-foreground mt-1">Ciudad</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="mb-3">Timeline de eventos</h4>
                <div className="space-y-3">
                  {contactEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sin eventos aún.</p>
                  ) : (
                    contactEvents.map((event) => (
                      <div key={event._id || event.createdAt} className="flex items-start gap-3 p-3 bg-accent rounded-lg">
                        {getEventIcon(event.type)}
                        <div className="flex-1">
                          <p className="text-sm capitalize">
                            {event.type?.replace("_", " ")}{" "}
                            {event.campaignId?.name ? `• ${event.campaignId.name}` : ""}
                            {event.landingPageId?.title ? ` • ${event.landingPageId.title}` : ""}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {event.createdAt ? new Date(event.createdAt).toLocaleString() : ""}
                          </p>
                          {event.linkUrl && (
                            <p className="text-xs text-muted-foreground break-all">{event.linkUrl}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4">Selecciona un contacto.</p>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
