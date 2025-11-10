import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Mail, Target, MousePointerClick } from "lucide-react";

const statsData = [
  { title: "Total de Contactos", value: "12,458", change: "+12.5%", icon: Users, color: "text-blue-600" },
  { title: "Correos Enviados", value: "45,234", change: "+8.2%", icon: Mail, color: "text-green-600" },
  { title: "Tasa de Apertura", value: "32.8%", change: "+2.4%", icon: MousePointerClick, color: "text-purple-600" },
  { title: "Conversiones", value: "1,247", change: "+15.3%", icon: Target, color: "text-orange-600" },
];

const emailPerformance = [
  { month: "Ene", enviados: 4000, abiertos: 1200, clicks: 800 },
  { month: "Feb", enviados: 3000, abiertos: 1398, clicks: 900 },
  { month: "Mar", enviados: 5000, abiertos: 1800, clicks: 1200 },
  { month: "Abr", enviados: 4500, abiertos: 1680, clicks: 1100 },
  { month: "May", enviados: 6000, abiertos: 2100, clicks: 1500 },
  { month: "Jun", enviados: 5500, abiertos: 1950, clicks: 1350 },
];

const campaignTypes = [
  { name: "Newsletter", value: 400, color: "#3b82f6" },
  { name: "Promocional", value: 300, color: "#10b981" },
  { name: "Transaccional", value: 200, color: "#f59e0b" },
  { name: "Bienvenida", value: 100, color: "#8b5cf6" },
];

const recentCampaigns = [
  { name: "Oferta de Verano 2024", status: "Activa", sent: 5420, opens: 1780, clicks: 892, revenue: "$12,450" },
  { name: "Newsletter Semanal", status: "Completada", sent: 12458, opens: 4102, clicks: 1956, revenue: "$8,230" },
  { name: "Lanzamiento de Producto", status: "Programada", sent: 0, opens: 0, clicks: 0, revenue: "$0" },
  { name: "Recuperación de Carrito", status: "Activa", sent: 2340, opens: 856, clicks: 445, revenue: "$15,680" },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm dark:text-gray-300">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl dark:text-white">{stat.value}</div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">{stat.change} vs mes anterior</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Email Performance Chart */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Rendimiento de Correos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={emailPerformance}>
                <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
                <XAxis dataKey="month" className="dark:fill-gray-400" />
                <YAxis className="dark:fill-gray-400" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} />
                <Line type="monotone" dataKey="enviados" stroke="#3b82f6" strokeWidth={2} name="Enviados" />
                <Line type="monotone" dataKey="abiertos" stroke="#10b981" strokeWidth={2} name="Abiertos" />
                <Line type="monotone" dataKey="clicks" stroke="#f59e0b" strokeWidth={2} name="Clicks" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Campaign Types Chart */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Tipos de Campañas</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={campaignTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {campaignTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Campañas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 px-4 dark:text-gray-300">Campaña</th>
                  <th className="text-left py-3 px-4 dark:text-gray-300">Estado</th>
                  <th className="text-right py-3 px-4 dark:text-gray-300">Enviados</th>
                  <th className="text-right py-3 px-4 dark:text-gray-300">Aperturas</th>
                  <th className="text-right py-3 px-4 dark:text-gray-300">Clicks</th>
                  <th className="text-right py-3 px-4 dark:text-gray-300">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {recentCampaigns.map((campaign, index) => (
                  <tr key={index} className="border-b dark:border-gray-700">
                    <td className="py-3 px-4 dark:text-gray-200">{campaign.name}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                        campaign.status === 'Activa' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                        campaign.status === 'Completada' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="text-right py-3 px-4 dark:text-gray-200">{campaign.sent.toLocaleString()}</td>
                    <td className="text-right py-3 px-4 dark:text-gray-200">{campaign.opens.toLocaleString()}</td>
                    <td className="text-right py-3 px-4 dark:text-gray-200">{campaign.clicks.toLocaleString()}</td>
                    <td className="text-right py-3 px-4 dark:text-gray-200">{campaign.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
