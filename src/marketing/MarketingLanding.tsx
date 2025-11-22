import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Check, ArrowRight, Sparkles, FileText, Users, Layers, Shield, Rocket } from "lucide-react";

const highlights = [
  "SaaS listo para escalar",
  "Modelos de negocio validados",
  "Soporte dedicado",
  "Documentación clara",
];

const modules = [
  { icon: Users, title: "CRM & Contactos", desc: "Gestiona leads, segmenta y activa audiencias." },
  { icon: Rocket, title: "Automatización", desc: "Flujos listos y APIs para tu backend." },
  { icon: Layers, title: "Landing Factory", desc: "Crea landings y captura origen de tráfico." },
  { icon: Shield, title: "Seguridad", desc: "Roles, JWT, rate limiting y buenas prácticas." },
];

export function MarketingLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-16">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <Badge className="bg-emerald-500 text-white">SaaS Marketing Automation</Badge>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Acelera tu lanzamiento con un stack listo y documentado
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl">
              Página pública para contar la historia del proyecto, compartir documentación y mostrar cómo usar el SaaS,
              incluyendo modelos de negocio y soporte dedicado.
            </p>
            <div className="flex flex-wrap gap-3">
              {highlights.map((item) => (
                <Badge key={item} variant="outline" className="border-emerald-500/40 text-emerald-200 bg-emerald-500/10">
                  <Check className="h-3 w-3 mr-1" /> {item}
                </Badge>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950">
                Probar demo <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Ver documentación <FileText className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-2xl w-full md:w-96">
            <div className="flex items-center gap-2 text-emerald-300 mb-3">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm uppercase tracking-wide">SaaS Overview</span>
            </div>
            <p className="text-slate-200 mb-3">Tu landing pública, lista para captar tráfico y explicar el producto.</p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Arquitectura y modelos de negocio</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Documentación y onboarding</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Captura de origen y analítica</li>
            </ul>
          </div>
        </header>

        <section className="grid md:grid-cols-2 gap-8">
          {modules.map((m) => (
            <Card key={m.title} className="bg-white/5 border-white/10">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <m.icon className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-xl font-semibold">{m.title}</h3>
                </div>
                <p className="text-slate-300">{m.desc}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/30">
            <CardContent className="pt-6 space-y-3">
              <Badge className="bg-white/20 text-white">Documentación</Badge>
              <h3 className="text-2xl font-semibold">Docs y guías</h3>
              <p className="text-slate-100">Rutas API, workflows de landing y ejemplos para integrarte rápido.</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6 space-y-3">
              <Badge variant="outline" className="border-emerald-400/40 text-emerald-200 bg-emerald-500/5">Soporte</Badge>
              <h3 className="text-2xl font-semibold">Apoyo dedicado</h3>
              <p className="text-slate-100">Acompañamiento para adaptar el SaaS a tu modelo de negocio.</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6 space-y-3">
              <Badge variant="outline" className="border-white/30 text-white">Modelos</Badge>
              <h3 className="text-2xl font-semibold">Playbooks de ingresos</h3>
              <p className="text-slate-100">Freemium, usage-based, seats: elige y lanza con plantillas listas.</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
