import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Download, TrendingDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useLanguage } from "../contexts/LanguageContext";
import { ReportsOverview, dashboardService } from "../services/dashboardService";

export function Reports() {
  const { t } = useLanguage();
  const [data, setData] = useState<ReportsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getReports();
      setData(response);
    } catch (err: any) {
      setError(err?.message || "No se pudieron cargar los reportes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const funnelData = useMemo(() => {
    const visits = data?.funnel.visits || 0;
    const submissions = data?.funnel.submissions || 0;
    const opens = data?.funnel.opens || 0;
    const clicks = data?.funnel.clicks || 0;

    if (visits === 0 && submissions === 0 && opens === 0 && clicks === 0) {
      return [];
    }

    const ratio = (value: number) => (visits > 0 ? (value / visits) * 100 : 0);

    return [
      { stage: "Visitas", count: visits, rate: 100, color: "var(--brand)" },
      { stage: "Formularios", count: submissions, rate: ratio(submissions), color: "var(--success)" },
      { stage: "Aperturas", count: opens, rate: ratio(opens), color: "var(--brand-600)" },
      { stage: "Clics", count: clicks, rate: ratio(clicks), color: "var(--warning)" },
    ];
  }, [data]);

  const weeklyContacts = data?.weeklyContacts || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl">{t("reports.title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("reports.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {loading && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Cargando reportes reales...
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="py-6 space-y-3">
            <p className="text-sm text-destructive">{error}</p>
            <Button onClick={loadReports} size="sm">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && data && (
        <>
          {/* Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Embudo de Conversión</CardTitle>
            </CardHeader>
            <CardContent>
              {funnelData.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aún no hay suficientes datos para el embudo.
                </p>
              ) : (
                <div className="space-y-3">
                  {funnelData.map((stage, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{stage.stage}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm">{stage.count.toLocaleString()}</span>
                          <span className="text-sm text-muted-foreground w-16 text-right">
                            {stage.rate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="h-12 rounded-lg overflow-hidden bg-accent relative">
                        <div 
                          className="h-full flex items-center px-4 transition-all duration-500"
                          style={{ 
                            width: `${stage.rate}%`,
                            backgroundColor: stage.color
                          }}
                        >
                          <span className="text-white text-sm">
                            {stage.count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {index < funnelData.length - 1 && stage.count > 0 && (
                        <div className="flex items-center gap-2 my-2 ml-4">
                          <TrendingDown className="h-4 w-4 text-error" />
                          <span className="text-xs text-muted-foreground">
                            {((1 - (funnelData[index + 1].count || 0) / stage.count) * 100).toFixed(1)}% abandono
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cohorts */}
          <Card>
            <CardHeader>
              <CardTitle>Nuevos contactos (últimas semanas)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Semana</TableHead>
                      <TableHead className="text-center">Nuevos contactos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(weeklyContacts.length ? weeklyContacts : [{ week: "—", count: 0 }]).map((cohort, index) => (
                      <TableRow key={index}>
                        <TableCell>{cohort.week}</TableCell>
                        <TableCell className="text-center">{cohort.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Metrics Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Métricas por Campaña</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaña</TableHead>
                      <TableHead className="text-right">Enviados</TableHead>
                      <TableHead className="text-right">Aperturas</TableHead>
                      <TableHead className="text-right">% Apertura</TableHead>
                      <TableHead className="text-right">Clics</TableHead>
                      <TableHead className="text-right">CTR</TableHead>
                      <TableHead className="text-right">Conversiones</TableHead>
                      <TableHead className="text-right">Ingresos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(data?.campaignMetrics?.length ? data.campaignMetrics : []).map((campaign, index) => (
                      <TableRow key={campaign.id || index}>
                        <TableCell>{campaign.name}</TableCell>
                        <TableCell className="text-right">{campaign.sent.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{campaign.opens.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <span className={campaign.openRate >= 40 ? "text-success" : campaign.openRate >= 30 ? "text-warning" : "text-error"}>
                            {campaign.openRate.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{campaign.clicks.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <span className={campaign.ctr >= 7 ? "text-success" : "text-warning"}>
                            {campaign.ctr.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-brand">{campaign.conversions}</TableCell>
                        <TableCell className="text-right">
                          ${campaign.revenue.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!data?.campaignMetrics || data.campaignMetrics.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          Sin datos de campañas todavía.
                        </TableCell>
                      </TableRow>
                    )}
                    {data?.campaignMetrics?.length ? (
                      <TableRow className="bg-accent">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">
                          {data.campaignMetrics.reduce((sum, c) => sum + c.sent, 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {data.campaignMetrics.reduce((sum, c) => sum + c.opens, 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {(data.campaignMetrics.reduce((sum, c) => sum + c.opens, 0) / 
                            Math.max(data.campaignMetrics.reduce((sum, c) => sum + c.sent, 0), 1) * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell className="text-right">
                          {data.campaignMetrics.reduce((sum, c) => sum + c.clicks, 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {(data.campaignMetrics.reduce((sum, c) => sum + c.clicks, 0) / 
                            Math.max(data.campaignMetrics.reduce((sum, c) => sum + c.sent, 0), 1) * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell className="text-right text-brand">
                          {data.campaignMetrics.reduce((sum, c) => sum + c.conversions, 0)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${data.campaignMetrics.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
