import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import {
  Check,
  ArrowRight,
  Sparkles,
  FileText,
  Users,
  Layers,
  Shield,
  Rocket,
  Zap,
  Cpu,
  BookOpen,
  Headset,
} from "lucide-react";

const highlights = [
  "SaaS listo para escalar",
  "Modelos de negocio validados",
  "Soporte dedicado",
  "Documentación clara",
];

const modules = [
  { icon: Users, title: "CRM & Contactos", desc: "Gestiona leads, segmenta y activa audiencias." },
  { icon: Rocket, title: "Automatización", desc: "Flujos listos y APIs para tu backend." },
  { icon: Layers, title: "Landing Factory", desc: "Crea landings, captura origen y mide conversiones." },
  { icon: Shield, title: "Seguridad", desc: "Roles, JWT, rate limiting y hardening por defecto." },
  { icon: Cpu, title: "Infra lista", desc: "Vite + Express + Mongo + CI listos para deploy." },
  { icon: BookOpen, title: "Docs vivas", desc: "Playbooks de negocio y guías de integración." },
];

const steps = [
  { title: "Explora el demo", body: "Revisa la UX y el flujo público en minutos." },
  { title: "Conecta tu marca", body: "Personaliza estilos, imágenes y mensaje sin romper el core." },
  { title: "Lanza y mide", body: "Captura fuente de tráfico, envía a la API y activa campañas." },
];

export function MarketingLanding() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute top-40 right-0 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-12 space-y-16">
        <header className="grid lg:grid-cols-[1.2fr,0.8fr] gap-10 items-center">
          <div className="space-y-4">
            <Badge className="bg-emerald-500 text-white">SaaS Marketing Automation</Badge>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Lanza tu SaaS con una landing potente, documentada y medible
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl">
              Página pública para contar tu proyecto, compartir documentación y explicar los modelos de negocio.
              Captura origen de tráfico, conecta con el backend y arranca con soporte dedicado.
            </p>
            <div className="flex flex-wrap gap-3">
              {highlights.map((item) => (
                <Badge key={item} variant="outline" className="border-emerald-500/40 text-emerald-200 bg-emerald-500/10">
                  <Check className="h-3 w-3 mr-1" /> {item}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950">
                Probar demo <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Ver documentación <FileText className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              {[
                { label: "Stack listo", value: "Vite + Express" },
                { label: "Seguridad", value: "JWT + Helmet" },
                { label: "Data", value: "Mongo + Mongoose" },
                { label: "UI", value: "Tailwind + Shadcn" },
              ].map((item) => (
                <Card key={item.label} className="bg-white/5 border-white/10">
                  <CardContent className="pt-4">
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="font-semibold text-white">{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 text-emerald-300 mb-3">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm uppercase tracking-wide">Landing mejorada</span>
            </div>
            <p className="text-slate-200 mb-4">
              Página enfocada en marketing: CTA claros, secciones de valor y captura de origen para medir resultados.
            </p>
            <div className="space-y-3 text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-400" />
                <span>CTA principal + ruta para documentación</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400" />
                <span>Secciones de features y proceso de onboarding</span>
              </div>
              <div className="flex items-center gap-2">
                <Headset className="h-4 w-4 text-emerald-400" />
                <span>Apoyo dedicado y playbooks de negocio</span>
              </div>
            </div>
          </div>
        </header>

        <section className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-emerald-500/25 to-emerald-500/5 border-emerald-500/30">
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

        <section className="grid md:grid-cols-3 gap-6">
          {modules.map((m) => (
            <Card key={m.title} className="bg-white/5 border-white/10 hover:border-emerald-400/40 transition-colors">
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

        <section className="grid md:grid-cols-3 gap-6 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="space-y-2">
            <Badge className="bg-emerald-500 text-slate-950">Proceso</Badge>
            <h3 className="text-2xl font-semibold">Cómo te acompañamos</h3>
            <p className="text-slate-200">Del demo al lanzamiento con métricas y captura de origen integrada.</p>
          </div>
          {steps.map((step, idx) => (
            <div key={step.title} className="flex gap-3">
              <div className="h-9 w-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-200 font-semibold">
                {idx + 1}
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-lg">{step.title}</h4>
                <p className="text-slate-300 text-sm">{step.body}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-emerald-200 uppercase tracking-wide">Landing pública mejorada</p>
            <h3 className="text-2xl font-semibold mt-2">Listo para recibir tráfico y medir origen</h3>
            <p className="text-slate-300 max-w-2xl mt-1">
              Activa el campo de fuente/origen en tus landings, personaliza imagen y estilos, y enlaza a esta página de marketing en /promo.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950">Ver landing demo</Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Abrir docs</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
