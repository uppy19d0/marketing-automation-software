import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Users,
  MousePointerClick,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Activity,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface AnalyticsData {
  stats: {
    visits: number;
    submissions: number;
    conversionRate: number;
    avgTimeOnPage: number;
    bounceRate: number;
  };
  metrics: {
    pageViews: number;
    formSubmits: number;
    buttonClicks: number;
    uniqueVisitors: number;
  };
  devices: Record<string, number>;
  browsers: Record<string, number>;
  timeline: Array<{
    _id: {
      date: string;
      eventType: string;
    };
    count: number;
  }>;
}

interface LandingPageAnalyticsProps {
  landingPageId: string;
  landingPageName: string;
}

const COLORS = {
  primary: "#0EA5E9",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  pink: "#EC4899",
};

const DEVICE_COLORS = ["#0EA5E9", "#10B981", "#F59E0B"];
const BROWSER_COLORS = ["#0EA5E9", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

export function LandingPageAnalytics({ landingPageId, landingPageName }: LandingPageAnalyticsProps) {
  const { language } = useLanguage();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "/api"}/landing-pages/${landingPageId}/analytics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching analytics");
        }

        const result = await response.json();
        setAnalytics(result.data);
      } catch (error) {
        console.error("Error loading analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [landingPageId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">
          {language === "es" ? "Cargando analytics..." : "Loading analytics..."}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">
          {language === "es" ? "No hay datos disponibles" : "No data available"}
        </div>
      </div>
    );
  }

  // Preparar datos para gráficos
  const deviceData = Object.entries(analytics.devices).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const browserData = Object.entries(analytics.browsers).map(([name, value]) => ({
    name,
    value,
  }));

  // Agrupar timeline por fecha
  const timelineByDate: Record<string, Record<string, number>> = {};
  analytics.timeline.forEach((item) => {
    const date = item._id.date;
    const eventType = item._id.eventType;

    if (!timelineByDate[date]) {
      timelineByDate[date] = {};
    }
    timelineByDate[date][eventType] = item.count;
  });

  const timelineData = Object.entries(timelineByDate)
    .map(([date, events]) => ({
      date,
      ...events,
    }))
    .slice(-30); // Últimos 30 días

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">
          {language === "es" ? "Analytics Detallado" : "Detailed Analytics"}
        </h2>
        <p className="text-muted-foreground">{landingPageName}</p>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "es" ? "Visitantes Únicos" : "Unique Visitors"}
                </p>
                <p className="text-3xl font-bold">{analytics.metrics.uniqueVisitors}</p>
              </div>
              <Users className="h-8 w-8 text-brand" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "es" ? "Tasa de Conversión" : "Conversion Rate"}
                </p>
                <p className="text-3xl font-bold text-success">
                  {analytics.stats.conversionRate.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "es" ? "Tiempo Promedio" : "Avg. Time"}
                </p>
                <p className="text-3xl font-bold text-brand">
                  {analytics.stats.avgTimeOnPage}s
                </p>
              </div>
              <Clock className="h-8 w-8 text-brand" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "es" ? "Tasa de Rebote" : "Bounce Rate"}
                </p>
                <p className="text-3xl font-bold text-warning">
                  {analytics.stats.bounceRate}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">
            {language === "es" ? "Timeline" : "Timeline"}
          </TabsTrigger>
          <TabsTrigger value="devices">
            {language === "es" ? "Dispositivos" : "Devices"}
          </TabsTrigger>
          <TabsTrigger value="browsers">
            {language === "es" ? "Navegadores" : "Browsers"}
          </TabsTrigger>
          <TabsTrigger value="engagement">
            {language === "es" ? "Engagement" : "Engagement"}
          </TabsTrigger>
        </TabsList>

        {/* Timeline */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "es" ? "Actividad en los Últimos 30 Días" : "Activity in Last 30 Days"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="page_view"
                    stroke={COLORS.primary}
                    name={language === "es" ? "Vistas" : "Page Views"}
                  />
                  <Line
                    type="monotone"
                    dataKey="form_submit"
                    stroke={COLORS.success}
                    name={language === "es" ? "Envíos" : "Submissions"}
                  />
                  <Line
                    type="monotone"
                    dataKey="button_click"
                    stroke={COLORS.warning}
                    name={language === "es" ? "Clicks" : "Clicks"}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Devices */}
        <TabsContent value="devices">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "es" ? "Distribución por Dispositivo" : "Device Distribution"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {language === "es" ? "Visitantes por Dispositivo" : "Visitors by Device"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {deviceData.map((device, index) => {
                  const Icon = device.name === "Mobile" ? Smartphone : device.name === "Tablet" ? Tablet : Monitor;
                  const totalVisitors = deviceData.reduce((sum, d) => sum + d.value, 0);
                  const percentage = totalVisitors > 0 ? ((device.value / totalVisitors) * 100).toFixed(1) : "0";

                  return (
                    <div key={device.name} className="flex items-center gap-4">
                      <Icon className="h-8 w-8" style={{ color: DEVICE_COLORS[index] }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{device.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {device.value} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: DEVICE_COLORS[index],
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Browsers */}
        <TabsContent value="browsers">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "es" ? "Navegadores más Usados" : "Most Used Browsers"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={browserData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name={language === "es" ? "Visitas" : "Visits"}>
                    {browserData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BROWSER_COLORS[index % BROWSER_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement */}
        <TabsContent value="engagement">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointerClick className="h-5 w-5" />
                  {language === "es" ? "Clicks en Botones" : "Button Clicks"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-brand">{analytics.metrics.buttonClicks}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  {language === "es" ? "Interacciones totales" : "Total interactions"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {language === "es" ? "Vistas de Página" : "Page Views"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-success">{analytics.metrics.pageViews}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  {language === "es" ? "Vistas totales" : "Total views"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {language === "es" ? "Envíos de Formulario" : "Form Submissions"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple">{analytics.metrics.formSubmits}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  {language === "es" ? "Conversiones totales" : "Total conversions"}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
