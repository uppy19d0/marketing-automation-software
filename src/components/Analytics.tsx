import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Mail, MousePointerClick, Users, DollarSign } from "lucide-react";

const engagementData = [
  { date: "1 Jun", enviados: 3200, abiertos: 1120, clicks: 560, bounces: 64 },
  { date: "8 Jun", enviados: 3800, abiertos: 1330, clicks: 665, bounces: 76 },
  { date: "15 Jun", enviados: 4200, abiertos: 1470, clicks: 735, bounces: 84 },
  { date: "22 Jun", enviados: 3600, abiertos: 1260, clicks: 630, bounces: 72 },
  { date: "29 Jun", enviados: 4500, abiertos: 1575, clicks: 787, bounces: 90 },
  { date: "6 Jul", enviados: 5000, abiertos: 1750, clicks: 875, bounces: 100 },
];

const revenueData = [
  { month: "Enero", ingresos: 12400, conversiones: 145 },
  { month: "Febrero", ingresos: 15600, conversiones: 182 },
  { month: "Marzo", ingresos: 18900, conversiones: 221 },
  { month: "Abril", ingresos: 16200, conversiones: 189 },
  { month: "Mayo", ingresos: 21500, conversiones: 251 },
  { month: "Junio", ingresos: 24800, conversiones: 290 },
];

const deviceData = [
  { device: "Desktop", value: 45 },
  { device: "Mobile", value: 40 },
  { device: "Tablet", value: 15 },
];

const topCampaigns = [
  { name: "Serie de Bienvenida", openRate: 70.5, clickRate: 35.2, conversions: 289, revenue: 15680 },
  { name: "Recuperación de Carrito", openRate: 42.3, clickRate: 19.8, conversions: 156, revenue: 12450 },
  { name: "Oferta de Verano", openRate: 32.8, clickRate: 16.5, conversions: 234, revenue: 18900 },
  { name: "Newsletter Mensual", openRate: 28.5, clickRate: 12.3, conversions: 98, revenue: 6780 },
  { name: "Black Friday", openRate: 65.2, clickRate: 42.8, conversions: 456, revenue: 45600 },
];

const hourlyPerformance = [
  { hour: "00:00", opens: 120 },
  { hour: "03:00", opens: 80 },
  { hour: "06:00", opens: 150 },
  { hour: "09:00", opens: 450 },
  { hour: "12:00", opens: 380 },
  { hour: "15:00", opens: 420 },
  { hour: "18:00", opens: 520 },
  { hour: "21:00", opens: 340 },
];

export function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl dark:text-white">Análisis y Reportes</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Monitorea el rendimiento de tus campañas de marketing</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm dark:text-gray-300">Tasa de Apertura Promedio</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl dark:text-white">35.2%</div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.5% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm dark:text-gray-300">Tasa de Clicks Promedio</CardTitle>
            <MousePointerClick className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl dark:text-white">17.5%</div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +1.8% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm dark:text-gray-300">Tasa de Rebote</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl dark:text-white">2.1%</div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              -0.3% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm dark:text-gray-300">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl dark:text-white">$109,380</div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.3% vs mes anterior
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList className="dark:bg-gray-800 dark:border-gray-700">
          <TabsTrigger value="engagement" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700">Engagement</TabsTrigger>
          <TabsTrigger value="revenue" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700">Ingresos</TabsTrigger>
          <TabsTrigger value="timing" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700">Mejor Horario</TabsTrigger>
          <TabsTrigger value="campaigns" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700">Top Campañas</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-4">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Métricas de Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
                  <XAxis dataKey="date" className="dark:fill-gray-400" />
                  <YAxis className="dark:fill-gray-400" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} />
                  <Legend />
                  <Area type="monotone" dataKey="enviados" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Enviados" />
                  <Area type="monotone" dataKey="abiertos" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Abiertos" />
                  <Area type="monotone" dataKey="clicks" stackId="3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Clicks" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Ingresos y Conversiones</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
                  <XAxis dataKey="month" className="dark:fill-gray-400" />
                  <YAxis yAxisId="left" className="dark:fill-gray-400" />
                  <YAxis yAxisId="right" orientation="right" className="dark:fill-gray-400" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="ingresos" fill="#10b981" name="Ingresos ($)" />
                  <Bar yAxisId="right" dataKey="conversiones" fill="#3b82f6" name="Conversiones" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timing" className="space-y-4">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Rendimiento por Hora del Día</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={hourlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
                  <XAxis dataKey="hour" className="dark:fill-gray-400" />
                  <YAxis className="dark:fill-gray-400" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="opens" stroke="#8b5cf6" strokeWidth={3} name="Aperturas" />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                💡 El mejor momento para enviar emails es entre las 18:00 y 21:00
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Campañas con Mejor Rendimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-3 px-4 dark:text-gray-300">Campaña</th>
                      <th className="text-right py-3 px-4 dark:text-gray-300">Tasa Apertura</th>
                      <th className="text-right py-3 px-4 dark:text-gray-300">Tasa Clicks</th>
                      <th className="text-right py-3 px-4 dark:text-gray-300">Conversiones</th>
                      <th className="text-right py-3 px-4 dark:text-gray-300">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCampaigns.map((campaign, index) => (
                      <tr key={index} className="border-b dark:border-gray-700">
                        <td className="py-3 px-4 dark:text-gray-200">{campaign.name}</td>
                        <td className="text-right py-3 px-4">
                          <span className="text-green-600 dark:text-green-400">{campaign.openRate}%</span>
                        </td>
                        <td className="text-right py-3 px-4">
                          <span className="text-blue-600 dark:text-blue-400">{campaign.clickRate}%</span>
                        </td>
                        <td className="text-right py-3 px-4 dark:text-gray-200">{campaign.conversions}</td>
                        <td className="text-right py-3 px-4">
                          <span className="text-orange-600 dark:text-orange-400">${campaign.revenue.toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
