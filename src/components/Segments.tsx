import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Plus, Users, X, Play } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useLanguage } from "../contexts/LanguageContext";

const segmentsData = [
  { id: 1, name: "Nuevos Leads RD", count: 156, type: "Dinámico", rules: "Tag=nuevo AND País=RD AND Score≥50" },
  { id: 2, name: "VIPs México", count: 89, type: "Dinámico", rules: "Tag=vip AND País=MX" },
  { id: 3, name: "Lead Magnet Activos", count: 234, type: "Dinámico", rules: "Tag=lead-magnet AND Creado después 2024-01-01" },
  { id: 4, name: "Lista Black Friday", count: 512, type: "Estático", rules: "Manual" },
];

const previewContacts = [
  { email: "maria.gonzalez@email.com", name: "María González", tags: ["nuevo", "lead-magnet"], score: 85 },
  { email: "sofia.torres@email.com", name: "Sofía Torres", tags: ["nuevo"], score: 72 },
  { email: "laura.diaz@email.com", name: "Laura Díaz", tags: ["nuevo", "lead-magnet"], score: 58 },
];

export function Segments() {
  const { t, language } = useLanguage();
  const [rules, setRules] = useState<Array<{ field: string; operator: string; value: string; logic: string }>>([
    { field: "tag", operator: "contiene", value: "nuevo", logic: "AND" }
  ]);
  const [showPreview, setShowPreview] = useState(false);

  const addRule = () => {
    setRules([...rules, { field: "tag", operator: "contiene", value: "", logic: "AND" }]);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, field: string, value: string) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl">{t("segments.title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("segments.subtitle")}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("segments.createSegment")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Segmento</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre del Segmento</Label>
                  <Input placeholder="Ej: Nuevos Leads RD" />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select defaultValue="dynamic">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dynamic">Dinámico (se actualiza automáticamente)</SelectItem>
                      <SelectItem value="static">Estático (fijo en el momento de creación)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Rules Builder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Reglas de Segmentación</Label>
                  <Button variant="outline" size="sm" onClick={addRule}>
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir regla
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {rules.map((rule, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-accent rounded-lg">
                      {index > 0 && (
                        <Select value={rule.logic} onValueChange={(v) => updateRule(index, "logic", v)}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AND">Y</SelectItem>
                            <SelectItem value="OR">O</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      
                      <Select value={rule.field} onValueChange={(v) => updateRule(index, "field", v)}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tag">Etiqueta</SelectItem>
                          <SelectItem value="country">País</SelectItem>
                          <SelectItem value="score">Score</SelectItem>
                          <SelectItem value="created">Creado</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={rule.operator} onValueChange={(v) => updateRule(index, "operator", v)}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="contiene">Contiene</SelectItem>
                          <SelectItem value="es">Es igual a</SelectItem>
                          <SelectItem value="mayor">Mayor o igual</SelectItem>
                          <SelectItem value="menor">Menor o igual</SelectItem>
                          <SelectItem value="despues">Después de</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        value={rule.value}
                        onChange={(e) => updateRule(index, "value", e.target.value)}
                        placeholder="Valor"
                        className="flex-1"
                      />

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRule(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Vista Previa</Label>
                  <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                    <Play className="h-4 w-4 mr-2" />
                    {showPreview ? "Ocultar" : "Actualizar"} vista previa
                  </Button>
                </div>
                
                {showPreview && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {previewContacts.length} contactos coinciden
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Etiquetas</TableHead>
                            <TableHead>Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewContacts.map((contact, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="text-sm">{contact.email}</TableCell>
                              <TableCell>{contact.name}</TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  {contact.tags.map((tag, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>{contact.score}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Guardar Segmento</Button>
                <Button variant="outline" className="flex-1">Cancelar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Segments List */}
      <div className="grid gap-4">
        {segmentsData.map((segment) => (
          <Card key={segment.id} className="hover:border-brand transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-brand" />
                    <h3 className="text-xl">{segment.name}</h3>
                    <Badge variant="outline">{segment.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{segment.rules}</p>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-2xl text-brand">{segment.count}</p>
                      <p className="text-xs text-muted-foreground">contactos</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Editar</Button>
                  <Button variant="outline" size="sm">Duplicar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {segmentsData.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl mb-2">Aún no tienes segmentos</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Crea tu primer segmento para organizar tus contactos
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Segmento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
