import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Mail, MousePointerClick, TrendingUp } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useLanguage } from "../contexts/LanguageContext";

// Unused for now - can be used for KPI cards in future
// const kpiData = [
//   { title: "Contactos Totales", value: "1,247", icon: Users, trend: "+12.5%", color: "text-brand" },
//   { title: "Nuevos Hoy", value: "23", icon: TrendingUp, trend: "+8.3%", color: "text-success" },
//   { title: "Tasa de Apertura", value: "42.3%", icon: Mail, trend: "+2.1%", color: "text-warning" },
//   { title: "CTR Promedio", value: "3.8%", icon: MousePointerClick, trend: "+0.5%", color: "text-brand-600" },
// ];

const chartData = [
  { date: "Lun", aperturas: 245, clics: 89 },
  { date: "Mar", aperturas: 312, clics: 118 },
  { date: "Mié", aperturas: 289, clics: 95 },
  { date: "Jue", aperturas: 401, clics: 152 },
  { date: "Vie", aperturas: 378, clics: 143 },
  { date: "Sáb", aperturas: 189, clics: 67 },
  { date: "Dom", aperturas: 156, clics: 54 },
];

const recentEvents = [
  { type: "open", contact: "María González", campaign: "Bienvenida A", time: "Hace 2 min", country: "RD" },
  { type: "click", contact: "Carlos Pérez", campaign: "Oferta Especial", time: "Hace 5 min", country: "MX" },
  { type: "submit", contact: "Ana Martínez", campaign: "Lead Magnet", time: "Hace 8 min", country: "CO" },
  { type: "open", contact: "Luis Rodríguez", campaign: "Newsletter Semanal", time: "Hace 12 min", country: "ES" },
  { type: "click", contact: "Sofia Torres", campaign: "Bienvenida A", time: "Hace 15 min", country: "RD" },
];

const abTest = {
  variantA: { name: "Asunto A: Beneficios exclusivos", opens: 256, rate: 45.2 },
  variantB: { name: "Asunto B: Últimas 48 horas", opens: 198, rate: 35.1 },
  winner: "A",
  difference: "+10.1%"
};

const getEventIcon = (type: string) => {
  switch (type) {
    case "open": return "📧";
    case "click": return "👆";
    case "submit": return "✅";
    default: return "•";
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case "open": return "text-brand";
    case "click": return "text-warning";
    case "submit": return "text-success";
    default: return "text-gray-500";
  }
};

export function DashboardNew() {
  const { t, language } = useLanguage();

  const kpiDataTranslated = [
    { 
      title: language === "es" ? "Contactos Totales" : "Total Contacts", 
      value: "1,247", 
      icon: Users, 
      trend: "+12.5%", 
      color: "text-brand" 
    },
    { 
      title: language === "es" ? "Nuevos Hoy" : "New Today", 
      value: "23", 
      icon: TrendingUp, 
      trend: "+8.3%", 
      color: "text-success" 
    },
    { 
      title: language === "es" ? "Tasa de Apertura" : "Open Rate", 
      value: "42.3%", 
      icon: Mail, 
      trend: "+2.1%", 
      color: "text-warning" 
    },
    { 
      title: language === "es" ? "CTR Promedio" : "Avg CTR", 
      value: "3.8%", 
      icon: MousePointerClick, 
      trend: "+0.5%", 
      color: "text-brand-600" 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl">{t("dashboard.title")}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t("dashboard.subtitle")}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiDataTranslated.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-3xl">{kpi.value}</p>
                  <p className={`text-sm ${kpi.color}`}>
                    {kpi.trend} {language === "es" ? "vs ayer" : "vs yesterday"}
                  </p>
                </div>
                <kpi.icon className={`h-8 w-8 ${kpi.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "es" ? "Aperturas vs Clics (Últimos 7 días)" : "Opens vs Clicks (Last 7 days)"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)'
                  }} 
                />
                <Bar dataKey="aperturas" fill="var(--brand)" name="Aperturas" />
                <Bar dataKey="clics" fill="var(--warning)" name="Clics" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* A/B Test Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Prueba A/B Activa</CardTitle>
              <Badge className="bg-success text-white">En curso</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <div className="flex-1">
                  <p className="text-sm">{abTest.variantA.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{abTest.variantA.opens} aperturas</p>
                </div>
                <div className="text-right">
                  <p className="text-xl text-success">{abTest.variantA.rate}%</p>
                  {abTest.winner === "A" && <Badge className="mt-1 bg-success text-white">Ganador</Badge>}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="text-sm">{abTest.variantB.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{abTest.variantB.opens} aperturas</p>
                </div>
                <div className="text-right">
                  <p className="text-xl">{abTest.variantB.rate}%</p>
                </div>
              </div>
            </div>
            
            <div className="pt-3 border-t">
              <p className="text-sm text-muted-foreground">Diferencia</p>
              <p className="text-xl text-success">{abTest.difference}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Eventos Recientes</CardTitle>
            <Button variant="ghost" size="sm">Ver todos</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEvents.map((event, index) => (
              <div key={index} className="flex items-center gap-4 p-3 hover:bg-accent rounded-lg transition-colors">
                <span className={`text-2xl ${getEventColor(event.type)}`}>{getEventIcon(event.type)}</span>
                <div className="flex-1">
                  <p className="text-sm">{event.contact}</p>
                  <p className="text-xs text-muted-foreground">{event.campaign}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{event.time}</p>
                  <Badge variant="outline" className="mt-1">{event.country}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
