import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Plus, Mail, Send } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { campaignService, Campaign } from "../services/campaignService";

export function CampaignsNew() {
  const { t, language } = useLanguage();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    preheader: "",
    content: "",
    segmentId: "",
  });

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await campaignService.getCampaigns();
      const list = Array.isArray((response as any).data) ? ((response as any).data as Campaign[]) : [];
      setCampaigns(list);
    } catch (err: any) {
      setError(err.message || "No se pudieron cargar las campañas");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    if (!formData.name || !formData.subject) {
      setError("Nombre y asunto son obligatorios");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const payload: Campaign = {
        name: formData.name,
        subject: formData.subject,
        preheader: formData.preheader,
        content: {
          html: formData.content || `<p>${formData.subject}</p>`,
          blocks: [],
        },
        isABTest: false,
        variants: [],
        status: "draft",
        segmentId: formData.segmentId || undefined,
      };

      const created = await campaignService.createCampaign(payload);
      setCampaigns((prev) => [created, ...prev]);
      setFormData({ name: "", subject: "", preheader: "", content: "", segmentId: "" });
      setDialogOpen(false);
    } catch (err: any) {
      setError(err.message || "No se pudo crear la campaña");
    } finally {
      setCreating(false);
    }
  };

  const handleSendCampaign = async (id?: string) => {
    if (!id) return;
    setSendingId(id);
    try {
      const response = await campaignService.sendCampaign(id);
      const updated = (response as any).data || response;
      setCampaigns((prev) =>
        prev.map((c) => (c._id === id ? { ...c, ...(updated || {}), status: "sent", sentAt: new Date() as any } : c))
      );
    } catch (err: any) {
      setError(err.message || "No se pudo enviar la campaña");
    } finally {
      setSendingId(null);
    }
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return "—";
    const parsed = typeof date === "string" ? new Date(date) : date;
    return parsed.toLocaleDateString();
  };

  const formatRate = (value?: number) => {
    if (!value) return "0%";
    return `${value.toFixed(1)}%`;
  };

  const getOpenRate = (campaign: Campaign) => {
    const sent = campaign.stats?.sent ?? campaign.recipientCount ?? 0;
    if (sent === 0) return 0;
    return (
      campaign.openRate ??
      (((campaign.stats?.uniqueOpens ?? campaign.stats?.opens ?? 0) / sent) * 100)
    );
  };

  const getCtr = (campaign: Campaign) => {
    const sent = campaign.stats?.sent ?? campaign.recipientCount ?? 0;
    if (sent === 0) return 0;
    return campaign.ctr ?? (((campaign.stats?.uniqueClicks ?? campaign.stats?.clicks ?? 0) / sent) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl">{t("campaigns.title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("campaigns.subtitle")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("campaigns.createCampaign")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{language === "es" ? "Crear Nueva Campaña" : "Create campaign"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Promoción Primavera"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Segmento (opcional)</Label>
                  <Input
                    value={formData.segmentId}
                    onChange={(e) => setFormData({ ...formData, segmentId: e.target.value })}
                    placeholder="ID de segmento"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Asunto</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Asunto del email"
                />
              </div>
              <div className="space-y-2">
                <Label>Preheader</Label>
                <Input
                  value={formData.preheader}
                  onChange={(e) => setFormData({ ...formData, preheader: e.target.value })}
                  placeholder="Texto previo"
                />
              </div>
              <div className="space-y-2">
                <Label>Contenido (HTML básico)</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="<p>Hola {{firstName}}</p>"
                  rows={6}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex justify-end">
                <Button onClick={handleCreateCampaign} disabled={creating}>
                  {creating ? "Guardando..." : "Crear campaña"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Campañas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando campañas...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : campaigns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay campañas aún.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Asunto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Enviados</TableHead>
                  <TableHead>Open Rate</TableHead>
                  <TableHead>CTR</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign._id || campaign.name}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{campaign.subject}</TableCell>
                    <TableCell>
                      <Badge variant={campaign.status === "sent" ? "secondary" : "outline"}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{campaign.stats?.sent ?? campaign.recipientCount ?? 0}</TableCell>
                    <TableCell>{formatRate(getOpenRate(campaign))}</TableCell>
                    <TableCell>{formatRate(getCtr(campaign))}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(campaign.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSendCampaign(campaign._id)}
                        disabled={campaign.status === "sent" || sendingId === campaign._id}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {sendingId === campaign._id ? "Enviando..." : "Enviar"}
                      </Button>
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
