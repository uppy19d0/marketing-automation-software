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
  Mail,
  Github,
  Twitter,
  Linkedin,
  MessageSquare,
  TrendingUp,
  BarChart3,
  Globe,
  Lock,
  Code,
  Workflow,
  Clock,
  Star,
  ChevronDown,
  ExternalLink,
  Play,
  Download,
} from "lucide-react";
import { useState } from "react";

const highlights = [
  "SaaS listo para escalar",
  "Modelos de negocio validados",
  "Soporte dedicado 24/7",
  "Documentación completa",
];

const features = [
  {
    icon: Users,
    title: "CRM & Gestión de Contactos",
    desc: "Gestiona leads, segmenta audiencias y activa campañas personalizadas con un CRM integrado.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
  },
  {
    icon: Rocket,
    title: "Automatización Avanzada",
    desc: "Flujos de trabajo automáticos, integraciones API y webhooks para conectar todo tu stack.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
  },
  {
    icon: Layers,
    title: "Landing Page Factory",
    desc: "Crea landings ilimitadas, captura origen de tráfico y mide conversiones en tiempo real.",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop",
  },
  {
    icon: BarChart3,
    title: "Analytics & Métricas",
    desc: "Dashboard completo con métricas de conversión, ROI, y atribución multicanal.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
  },
  {
    icon: Shield,
    title: "Seguridad Enterprise",
    desc: "JWT, roles, rate limiting, encriptación y cumplimiento GDPR incluido de serie.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop",
  },
  {
    icon: Cpu,
    title: "Infraestructura Moderna",
    desc: "Vite + React + Express + MongoDB. Stack probado y optimizado para producción.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
  },
];

const testimonials = [
  {
    name: "María González",
    role: "CEO en StartupX",
    company: "StartupX",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    quote: "Redujimos el tiempo de desarrollo de 6 meses a 2 semanas. La plataforma tiene todo lo que necesitábamos para lanzar nuestro SaaS.",
    rating: 5,
  },
  {
    name: "Carlos Ruiz",
    role: "CTO en TechFlow",
    company: "TechFlow",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    quote: "La arquitectura es sólida y escalable. Pasamos de 0 a 10,000 usuarios sin problemas de rendimiento.",
    rating: 5,
  },
  {
    name: "Ana Martínez",
    role: "Marketing Director",
    company: "GrowthCo",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    quote: "El sistema de landing pages y tracking nos permitió aumentar conversiones en un 300%. Impresionante.",
    rating: 5,
  },
];

const faqs = [
  {
    question: "¿Qué incluye la plataforma?",
    answer: "Incluye todo el código fuente (frontend y backend), documentación completa, integración con bases de datos, sistema de autenticación, CRM, automatización de marketing, landing page builder, analytics, y soporte técnico dedicado.",
  },
  {
    question: "¿Puedo personalizar el diseño y funcionalidades?",
    answer: "Absolutamente. Tienes acceso completo al código fuente. Puedes personalizar diseño, colores, funcionalidades y agregar nuevas características. Además, ofrecemos soporte para ayudarte con las personalizaciones.",
  },
  {
    question: "¿Qué tecnologías usa?",
    answer: "Frontend: React, Vite, TypeScript, Tailwind CSS, Shadcn UI. Backend: Node.js, Express, MongoDB, JWT. Todo con las mejores prácticas y listo para escalar.",
  },
  {
    question: "¿Cómo funciona el soporte?",
    answer: "Ofrecemos soporte dedicado por email, chat y videollamadas. También incluimos documentación extensa, guías paso a paso, y una comunidad activa de desarrolladores.",
  },
  {
    question: "¿Es seguro y cumple con GDPR?",
    answer: "Sí. Incluye autenticación JWT, encriptación de datos, rate limiting, validación de inputs, y todas las configuraciones necesarias para cumplir con GDPR y otras regulaciones.",
  },
  {
    question: "¿Cuánto tiempo toma implementarlo?",
    answer: "La mayoría de nuestros clientes tienen su SaaS funcionando en 1-2 semanas. Incluye setup inicial, personalización básica y deployment. El tiempo exacto depende de tus personalizaciones.",
  },
];

const docSections = [
  {
    icon: Rocket,
    title: "Guía de Inicio Rápido",
    desc: "Instala y configura tu SaaS en menos de 10 minutos",
    link: "/docs/quickstart",
  },
  {
    icon: Code,
    title: "Referencia API",
    desc: "Documentación completa de todos los endpoints y webhooks",
    link: "/docs/api",
  },
  {
    icon: Workflow,
    title: "Automatización",
    desc: "Crea flujos de trabajo y automatizaciones avanzadas",
    link: "/docs/automation",
  },
  {
    icon: Users,
    title: "Gestión de Usuarios",
    desc: "Autenticación, roles, permisos y gestión de equipos",
    link: "/docs/users",
  },
  {
    icon: BarChart3,
    title: "Analytics & Tracking",
    desc: "Implementa tracking, métricas y reportes personalizados",
    link: "/docs/analytics",
  },
  {
    icon: Globe,
    title: "Deployment",
    desc: "Despliega en producción con Vercel, AWS, o tu infraestructura",
    link: "/docs/deployment",
  },
];

const stats = [
  { value: "10,000+", label: "Usuarios Activos" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Soporte" },
  { value: "<100ms", label: "Respuesta API" },
];

export function MarketingLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute top-40 right-0 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute top-[800px] left-1/2 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12 space-y-24">
        {/* Hero Section */}
        <header className="grid lg:grid-cols-2 gap-12 items-center pt-12">
          <div className="space-y-6">
            <Badge className="bg-emerald-500 text-white text-sm px-4 py-1">
              <Sparkles className="h-3 w-3 mr-1 inline" />
              SaaS Marketing Automation Platform
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
              Lanza tu SaaS en semanas, no meses
            </h1>

            <p className="text-xl text-slate-300 max-w-xl leading-relaxed">
              Plataforma completa de marketing automation con CRM, landing pages, automatización y analytics.
              Todo el código, documentación y soporte que necesitas.
            </p>

            <div className="flex flex-wrap gap-3">
              {highlights.map((item) => (
                <Badge key={item} variant="outline" className="border-emerald-500/40 text-emerald-200 bg-emerald-500/10 px-3 py-1">
                  <Check className="h-3 w-3 mr-1" /> {item}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-lg px-8">
                Probar Demo Gratis <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-semibold text-lg px-8">
                <Play className="h-5 w-5 mr-2" /> Ver Video
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 pt-8 border-t border-white/10">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
            <img
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop"
              alt="Dashboard Preview"
              className="relative rounded-2xl shadow-2xl border border-white/10 w-full transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute -bottom-6 -right-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Conversión promedio</p>
                  <p className="text-2xl font-bold text-white">+287%</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Tech Stack */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <Badge className="bg-cyan-500/20 text-cyan-200 border-cyan-500/30 mb-4">Stack Tecnológico</Badge>
            <h2 className="text-3xl font-bold">Tecnologías Modernas y Probadas</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Frontend", value: "React + Vite", icon: Zap },
              { label: "Backend", value: "Node + Express", icon: Cpu },
              { label: "Database", value: "MongoDB", icon: Layers },
              { label: "UI/UX", value: "Tailwind + Shadcn", icon: Sparkles },
            ].map((item) => (
              <Card key={item.label} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <CardContent className="pt-6 text-center">
                  <item.icon className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="font-semibold text-white text-lg">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features con imágenes */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <Badge className="bg-emerald-500 text-white">Características Principales</Badge>
            <h2 className="text-4xl md:text-5xl font-bold">Todo lo que necesitas en una sola plataforma</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Desde captación de leads hasta automatización de campañas, tenemos todas las herramientas que tu negocio necesita
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Card key={feature.title} className="bg-white/5 border-white/10 hover:border-emerald-400/40 transition-all duration-300 overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <feature.icon className="h-8 w-8 text-emerald-400" />
                  </div>
                </div>
                <CardContent className="pt-6 space-y-3">
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-slate-300">{feature.desc}</p>
                  <Button variant="link" className="text-emerald-400 p-0 h-auto font-semibold">
                    Aprender más <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-500 text-slate-950 mb-4">Proceso Simple</Badge>
            <h2 className="text-4xl font-bold mb-4">Comienza en 3 pasos</h2>
            <p className="text-xl text-slate-300">Del demo al lanzamiento en tiempo récord</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Prueba el Demo",
                desc: "Explora todas las funcionalidades y ve cómo funciona la plataforma en tiempo real.",
                icon: Play,
              },
              {
                num: "02",
                title: "Personaliza tu Marca",
                desc: "Ajusta colores, logos, contenido y configuraciones sin tocar el código core.",
                icon: Sparkles,
              },
              {
                num: "03",
                title: "Lanza y Escala",
                desc: "Despliega en producción, captura leads y comienza a crecer tu negocio.",
                icon: Rocket,
              },
            ].map((step) => (
              <div key={step.num} className="relative">
                <div className="text-7xl font-bold text-emerald-500/20 absolute -top-4 -left-2">{step.num}</div>
                <div className="relative bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-4 hover:bg-white/10 transition-colors">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                  <p className="text-slate-300">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <Badge className="bg-purple-500/20 text-purple-200 border-purple-500/30">Testimonios</Badge>
            <h2 className="text-4xl font-bold">Lo que dicen nuestros clientes</h2>
            <p className="text-xl text-slate-300">Miles de empresas confían en nuestra plataforma</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-200 italic leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-emerald-400/40"
                    />
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Documentation Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <Badge className="bg-cyan-500/20 text-cyan-200 border-cyan-500/30">
              <BookOpen className="h-3 w-3 mr-1 inline" />
              Documentación
            </Badge>
            <h2 className="text-4xl font-bold">Documentación Completa y Actualizada</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Guías paso a paso, referencias API, ejemplos de código y mejores prácticas para aprovechar al máximo la plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docSections.map((section) => (
              <Card
                key={section.title}
                className="bg-gradient-to-br from-white/10 to-white/5 border-white/10 hover:border-cyan-400/40 transition-all duration-300 cursor-pointer group"
              >
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                    <section.icon className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-slate-300 text-sm">{section.desc}</p>
                  </div>
                  <Button variant="link" className="text-cyan-400 p-0 h-auto font-semibold group-hover:gap-2 transition-all">
                    Ver documentación <ExternalLink className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-8 text-center">
            <BookOpen className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">¿No encuentras lo que buscas?</h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Nuestro equipo de soporte está disponible 24/7 para ayudarte con cualquier pregunta técnica o de implementación
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contactar Soporte
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Github className="h-4 w-4 mr-2" />
                Ver en GitHub
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-500/30">
              Preguntas Frecuentes
            </Badge>
            <h2 className="text-4xl font-bold">¿Tienes preguntas? Tenemos respuestas</h2>
            <p className="text-xl text-slate-300">Todo lo que necesitas saber sobre la plataforma</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <Card
                key={idx}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                    <ChevronDown
                      className={`h-5 w-5 text-emerald-400 flex-shrink-0 transition-transform ${
                        openFaq === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  {openFaq === idx && (
                    <p className="text-slate-300 mt-4 leading-relaxed">{faq.answer}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <p className="text-slate-400 mb-4">¿Aún tienes más preguntas?</p>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Headset className="h-4 w-4 mr-2" />
              Hablar con un Experto
            </Button>
          </div>
        </section>

        {/* Help & Support Section */}
        <section className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <Badge className="bg-purple-500 text-white mb-4">
              <Headset className="h-3 w-3 mr-1 inline" />
              Centro de Ayuda
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Soporte cuando lo necesites</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Múltiples canales de soporte para asegurarnos de que nunca estés bloqueado
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MessageSquare,
                title: "Chat en Vivo",
                desc: "Respuesta inmediata de nuestro equipo",
                action: "Iniciar chat",
              },
              {
                icon: Mail,
                title: "Email Support",
                desc: "Respuesta en menos de 2 horas",
                action: "Enviar email",
              },
              {
                icon: BookOpen,
                title: "Base de Conocimiento",
                desc: "Cientos de artículos y tutoriales",
                action: "Explorar docs",
              },
              {
                icon: Users,
                title: "Comunidad",
                desc: "Únete a miles de desarrolladores",
                action: "Unirse",
              },
            ].map((support) => (
              <Card key={support.title} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <CardContent className="pt-6 space-y-4 text-center">
                  <div className="h-14 w-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto">
                    <support.icon className="h-7 w-7 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{support.title}</h3>
                    <p className="text-sm text-slate-400">{support.desc}</p>
                  </div>
                  <Button variant="link" className="text-purple-400 p-0 h-auto font-semibold">
                    {support.action} <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-600 to-cyan-600 px-8 py-16 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />

          <div className="relative text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Listo para lanzar tu SaaS
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Únete a miles de empresas que ya están escalando sus negocios con nuestra plataforma.
              Comienza tu prueba gratuita hoy, sin tarjeta de crédito.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white hover:bg-slate-100 text-emerald-600 font-bold text-lg px-10 py-6">
                <Download className="h-5 w-5 mr-2" />
                Comenzar Gratis
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-bold text-lg px-10 py-6"
              >
                Agendar Demo
              </Button>
            </div>

            <p className="text-sm text-white/70 pt-4">
              <Lock className="h-4 w-4 inline mr-1" />
              Sin tarjeta de crédito · Cancelación en cualquier momento · GDPR compliant
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 pt-12 pb-8 space-y-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Rocket className="h-8 w-8 text-emerald-400" />
                <span className="text-xl font-bold">Marketing Automation</span>
              </div>
              <p className="text-slate-400 max-w-sm">
                La plataforma completa para lanzar, escalar y optimizar tu SaaS. Todo lo que necesitas en un solo lugar.
              </p>
              <div className="flex gap-3">
                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Github className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Casos de uso</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Demo</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Guías</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Centro de ayuda</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Comunidad</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Estado del servicio</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10">
            <p className="text-slate-400 text-sm">
              © 2024 Marketing Automation. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Términos</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Cookies</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
