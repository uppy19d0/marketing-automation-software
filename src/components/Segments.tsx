import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Plus, Users, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useLanguage } from "../contexts/LanguageContext";
import { segmentService, Segment } from "../services/segmentService";

type Rule = { field: string; operator: string; value: string; logic: string };

const fieldMap: Record<string, string> = {
  tag: "tags",
  country: "country",
  score: "score",
  created: "createdAt",
};

export function Segments() {
  const { t, language } = useLanguage();
  const [segments, setSegments] = useState<Segment[]>([]);
  const [rules, setRules] = useState<Rule[]>([
    { field: "tag", operator: "contiene", value: "nuevo", logic: "AND" },
  ]);
  const [segmentName, setSegmentName] = useState("");
  const [segmentType, setSegmentType] = useState<"dynamic" | "static">("dynamic");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadSegments();
  }, []);

  const loadSegments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await segmentService.getSegments();
      const list = Array.isArray((response as any).data) ? ((response as any).data as Segment[]) : [];
      setSegments(list);
    } catch (err: any) {
      setError(err.message || "No se pudieron cargar los segmentos");
    } finally {
      setLoading(false);
    }
  };

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

  const handleCreateSegment = async () => {
    if (!segmentName) {
      setError("El nombre es obligatorio");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const apiRules = rules.map((rule, index) => ({
        field: fieldMap[rule.field] || rule.field,
        operator: rule.operator,
        value: rule.value,
        logic: index === 0 ? undefined : rule.logic,
      }));

      const created = await segmentService.createSegment({
        name: segmentName,
        type: segmentType,
        rules: apiRules,
      });

      setSegments((prev) => [created, ...prev]);
      setSegmentName("");
      setSegmentType("dynamic");
      setRules([{ field: "tag", operator: "contiene", value: "", logic: "AND" }]);
      setDialogOpen(false);
    } catch (err: any) {
      setError(err.message || "No se pudo crear el segmento");
    } finally {
      setCreating(false);
    }
  };

  const formatRules = (segment: Segment) => {
    if (!segment.rules || segment.rules.length === 0) return "—";
    return segment.rules
      .map((rule, index) => {
        const connector = index > 0 ? ` ${rule.logic || "AND"} ` : "";
        return `${connector}${rule.field} ${rule.operator} ${rule.value}`;
      })
      .join("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl">{t("segments.title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("segments.subtitle")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre del Segmento</Label>
                  <Input
                    placeholder="Ej: Nuevos Leads RD"
                    value={segmentName}
                    onChange={(e) => setSegmentName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={segmentType} onValueChange={(v: "dynamic" | "static") => setSegmentType(v)}>
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

                      <Button variant="ghost" size="sm" onClick={() => removeRule(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex justify-end">
                <Button onClick={handleCreateSegment} disabled={creating}>
                  {creating ? "Guardando..." : "Crear segmento"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            {language === "es" ? "Segmentos activos" : "Active segments"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando segmentos...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : segments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay segmentos aún.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Contactos</TableHead>
                  <TableHead>Reglas</TableHead>
                  <TableHead>Creado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {segments.map((segment) => (
                  <TableRow key={segment._id || segment.name}>
                    <TableCell className="font-medium">{segment.name}</TableCell>
                    <TableCell>
                      <Badge variant={segment.type === "dynamic" ? "secondary" : "outline"}>
                        {segment.type === "dynamic" ? "Dinámico" : "Estático"}
                      </Badge>
                    </TableCell>
                    <TableCell>{segment.contactCount ?? 0}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatRules(segment)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {segment.createdAt ? new Date(segment.createdAt).toLocaleDateString() : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
