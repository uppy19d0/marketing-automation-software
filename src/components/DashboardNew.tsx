import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Mail, MousePointerClick, TrendingUp } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import { DashboardOverview, dashboardService } from "../services/dashboardService";

type EventType = "email_open" | "email_click" | "form_submit" | "page_view" | "unsubscribe" | string;

const getEventIcon = (type: EventType) => {
  switch (type) {
    case "email_open":
      return "📧";
    case "email_click":
      return "👆";
    case "form_submit":
      return "✅";
    case "page_view":
      return "👀";
    case "unsubscribe":
      return "🚫";
    default:
      return "•";
  }
};

const getEventColor = (type: EventType) => {
  switch (type) {
    case "email_open":
      return "text-brand";
    case "email_click":
      return "text-warning";
    case "form_submit":
      return "text-success";
    case "unsubscribe":
      return "text-error";
    default:
      return "text-muted-foreground";
  }
};

const formatDateLabel = (date: string, language: string) => {
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.toLocaleDateString(language === "es" ? "es-ES" : "en-US", { weekday: "short" });
};

const formatTimestamp = (value: string, language: string) => {
  const parsed = new Date(value);
  return parsed.toLocaleString(language === "es" ? "es-ES" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatNumber = (value?: number, language?: string) => {
  const safe = Number.isFinite(value) ? Number(value) : 0;
  return safe.toLocaleString(language === "es" ? "es-ES" : "en-US");
};

export function DashboardNew() {
  const { t, language } = useLanguage();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getOverview();
      setOverview(data);
    } catch (err: any) {
      setError(
        err?.message ||
          (language === "es" ? "No se pudo cargar el dashboard" : "Could not load dashboard")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const chartData = useMemo(() => {
    if (!overview?.chart?.length) return [];
    return overview.chart.map((point) => ({
      ...point,
      label: formatDateLabel(point.date, language),
    }));
  }, [overview, language]);

  const kpis = useMemo(() => {
    if (!overview) return [];
    return [
      {
        title: language === "es" ? "Contactos totales" : "Total contacts",
        value: formatNumber(overview.totals.contacts, language),
        helper: `${language === "es" ? "Últimos 7 días" : "Last 7 days"}: +${formatNumber(
          overview.totals.newContacts,
          language
        )}`,
        icon: Users,
      },
      {
        title: language === "es" ? "Campañas activas" : "Active campaigns",
        value: formatNumber(overview.totals.campaigns.active, language),
        helper: `${formatNumber(overview.totals.campaigns.total, language)} ${
          language === "es" ? "en total" : "total"
        }`,
        icon: Mail,
      },
      {
        title: language === "es" ? "Tasa de apertura" : "Open rate",
        value: `${(overview.rates.openRate || 0).toFixed(1)}%`,
        helper: `${language === "es" ? "CTR" : "CTR"} ${(overview.rates.clickRate || 0).toFixed(
          1
        )}%`,
        icon: MousePointerClick,
      },
      {
        title: language === "es" ? "Conversiones de landing" : "Landing conversions",
        value: `${(overview.rates.conversionRate || 0).toFixed(1)}%`,
        helper: `${formatNumber(overview.landingMetrics.submissions, language)} ${
          language === "es" ? "envíos" : "submits"
        }`,
        icon: TrendingUp,
      },
    ];
  }, [overview, language]);

  if (loading) {
    return (
      <div className="min-h-[320px] flex items-center justify-center text-muted-foreground">
        {language === "es" ? "Cargando métricas..." : "Loading metrics..."}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/5 text-sm text-destructive">
          {error}
        </div>
        <Button onClick={loadOverview}>
          {language === "es" ? "Reintentar" : "Retry"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl">{t("dashboard.title")}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t("dashboard.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-3xl">{kpi.value}</p>
                  <p className="text-sm text-muted-foreground">{kpi.helper}</p>
                </div>
                <kpi.icon className="h-8 w-8 text-brand" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "es"
                ? "Aperturas, clics y formularios (últimos 7 días)"
                : "Opens, clicks and forms (last 7 days)"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="label" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar
                    dataKey="opens"
                    fill="var(--brand)"
                    name={language === "es" ? "Aperturas" : "Opens"}
                    stackId="events"
                  />
                  <Bar
                    dataKey="clicks"
                    fill="var(--warning)"
                    name={language === "es" ? "Clics" : "Clicks"}
                    stackId="events"
                  />
                  <Bar
                    dataKey="submissions"
                    fill="var(--success)"
                    name={language === "es" ? "Formularios" : "Form submits"}
                    stackId="events"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground">
                {language === "es"
                  ? "Aún no hay eventos registrados esta semana."
                  : "No engagement events recorded this week yet."}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {language === "es" ? "Rendimiento de campañas" : "Campaign performance"}
              </CardTitle>
              <Badge variant="outline">
                {language === "es"
                  ? `${formatNumber(overview?.totals.campaigns.sent, language)} enviadas`
                  : `${formatNumber(overview?.totals.campaigns.sent, language)} sent`}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview?.topCampaigns?.length ? (
              overview.topCampaigns.map((campaign) => (
                <div
                  key={campaign.id || campaign.name}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{campaign.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {language === "es" ? "Estado" : "Status"}: {campaign.status} •{" "}
                      {formatNumber(campaign.sent, language)}{" "}
                      {language === "es" ? "enviados" : "sent"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-success">
                      {(campaign.openRate || 0).toFixed(1)}%{" "}
                      {language === "es" ? "apertura" : "open"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === "es" ? "CTR" : "CTR"} {(campaign.ctr || 0).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                {language === "es"
                  ? "Aún no hay campañas con datos para mostrar."
                  : "No campaign data to show yet."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{language === "es" ? "Eventos recientes" : "Recent events"}</CardTitle>
        </CardHeader>
        <CardContent>
          {overview?.recentEvents?.length ? (
            <div className="space-y-3">
              {overview.recentEvents.map((event) => (
                <div
                  key={event.id || event.createdAt}
                  className="flex items-center gap-4 p-3 hover:bg-accent rounded-lg transition-colors"
                >
                  <span className={`text-2xl ${getEventColor(event.type)}`}>
                    {getEventIcon(event.type)}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm">
                      {event.contact ||
                        event.email ||
                        (language === "es" ? "Contacto" : "Contact")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.campaign || event.landingPage || event.email || event.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(event.createdAt, language)}
                    </p>
                    {event.country && (
                      <Badge variant="outline" className="mt-1">
                        {event.country}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {language === "es"
                ? "Sin eventos recientes aún."
                : "No recent events yet."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
