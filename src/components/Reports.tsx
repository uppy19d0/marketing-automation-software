import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Download, TrendingDown, Users, Mail, MousePointerClick, Target } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useLanguage } from "../contexts/LanguageContext";

const funnelData = [
  { stage: "Visitas", count: 1567, rate: 100, color: "var(--brand)" },
  { stage: "Registros", count: 289, rate: 18.4, color: "var(--brand-600)" },
  { stage: "Aperturas", count: 156, rate: 54.0, color: "var(--success)" },
  { stage: "Clics", count: 67, rate: 42.9, color: "var(--warning)" },
  { stage: "Conversiones", count: 23, rate: 34.3, color: "#10B981" },
];

const cohortData = [
  { week: "Semana 1", registros: 45, week1: 42, week2: 38, week3: 35, week4: 32 },
  { week: "Semana 2", registros: 52, week1: 48, week2: 45, week3: 41, week4: 0 },
  { week: "Semana 3", registros: 38, week1: 35, week2: 32, week3: 0, week4: 0 },
  { week: "Semana 4", registros: 67, week1: 63, week2: 0, week3: 0, week4: 0 },
];

const campaignMetrics = [
  { campaign: "Bienvenida A/B", sent: 566, opens: 256, openRate: 45.2, clicks: 47, ctr: 8.3, conversions: 12, revenue: 1840 },
  { campaign: "Newsletter Semanal", sent: 1247, opens: 524, openRate: 42.0, clicks: 85, ctr: 6.8, conversions: 18, revenue: 2760 },
  { campaign: "Oferta Especial", sent: 892, opens: 298, openRate: 33.4, clicks: 56, ctr: 6.3, conversions: 9, revenue: 1380 },
  { campaign: "Lead Magnet", sent: 234, opens: 156, openRate: 66.7, clicks: 67, ctr: 28.6, conversions: 23, revenue: 3520 },
];

export function Reports() {
  const { t, language } = useLanguage();
  
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

      {/* Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Embudo de Conversión</CardTitle>
        </CardHeader>
        <CardContent>
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
                {index < funnelData.length - 1 && (
                  <div className="flex items-center gap-2 my-2 ml-4">
                    <TrendingDown className="h-4 w-4 text-error" />
                    <span className="text-xs text-muted-foreground">
                      {((1 - funnelData[index + 1].count / stage.count) * 100).toFixed(1)}% abandono
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cohorts */}
      <Card>
        <CardHeader>
          <CardTitle>Retención por Cohortes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cohorte</TableHead>
                  <TableHead className="text-center">Registros</TableHead>
                  <TableHead className="text-center">Semana 1</TableHead>
                  <TableHead className="text-center">Semana 2</TableHead>
                  <TableHead className="text-center">Semana 3</TableHead>
                  <TableHead className="text-center">Semana 4</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cohortData.map((cohort, index) => (
                  <TableRow key={index}>
                    <TableCell>{cohort.week}</TableCell>
                    <TableCell className="text-center">{cohort.registros}</TableCell>
                    <TableCell className="text-center">
                      <div className="inline-block px-3 py-1 rounded" style={{ 
                        backgroundColor: `rgba(14, 165, 233, ${cohort.week1 / cohort.registros})` 
                      }}>
                        {((cohort.week1 / cohort.registros) * 100).toFixed(0)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {cohort.week2 > 0 ? (
                        <div className="inline-block px-3 py-1 rounded" style={{ 
                          backgroundColor: `rgba(14, 165, 233, ${cohort.week2 / cohort.registros})` 
                        }}>
                          {((cohort.week2 / cohort.registros) * 100).toFixed(0)}%
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {cohort.week3 > 0 ? (
                        <div className="inline-block px-3 py-1 rounded" style={{ 
                          backgroundColor: `rgba(14, 165, 233, ${cohort.week3 / cohort.registros})` 
                        }}>
                          {((cohort.week3 / cohort.registros) * 100).toFixed(0)}%
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {cohort.week4 > 0 ? (
                        <div className="inline-block px-3 py-1 rounded" style={{ 
                          backgroundColor: `rgba(14, 165, 233, ${cohort.week4 / cohort.registros})` 
                        }}>
                          {((cohort.week4 / cohort.registros) * 100).toFixed(0)}%
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            * Porcentaje de contactos que abrieron al menos un email en cada semana
          </p>
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
                {campaignMetrics.map((campaign, index) => (
                  <TableRow key={index}>
                    <TableCell>{campaign.campaign}</TableCell>
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
                <TableRow className="bg-accent">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">
                    {campaignMetrics.reduce((sum, c) => sum + c.sent, 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {campaignMetrics.reduce((sum, c) => sum + c.opens, 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {(campaignMetrics.reduce((sum, c) => sum + c.opens, 0) / 
                      campaignMetrics.reduce((sum, c) => sum + c.sent, 0) * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {campaignMetrics.reduce((sum, c) => sum + c.clicks, 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {(campaignMetrics.reduce((sum, c) => sum + c.clicks, 0) / 
                      campaignMetrics.reduce((sum, c) => sum + c.sent, 0) * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right text-brand">
                    {campaignMetrics.reduce((sum, c) => sum + c.conversions, 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${campaignMetrics.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
