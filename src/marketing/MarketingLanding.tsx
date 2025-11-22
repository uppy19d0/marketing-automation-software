import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Check,
  ArrowRight,
  Sparkles,
  Users,
  Shield,
  Rocket,
  Zap,
  BarChart3,
  Mail,
  Github,
  Twitter,
  Linkedin,
  MessageSquare,
  TrendingUp,
  Star,
  Menu,
  X,
  Phone,
  MapPin,
  Send,
  Target,
  Brain,
  Workflow,
  Globe,
  Instagram,
  Youtube,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function MarketingLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  const navItems = [
    { id: "inicio", label: "Inicio" },
    { id: "caracteristicas", label: "Características" },
    { id: "soluciones", label: "Soluciones" },
    { id: "testimonios", label: "Testimonios" },
    { id: "precios", label: "Precios" },
    { id: "contacto", label: "Contacto" },
  ];

  const features = [
    {
      icon: Users,
      title: "CRM Inteligente",
      description: "Gestiona tus contactos, leads y clientes con un CRM potente y fácil de usar.",
      gradient: "from-blue-600 to-cyan-600",
      lightGradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Rocket,
      title: "Automatización Total",
      description: "Automatiza tus campañas de marketing y ahorra tiempo con flujos de trabajo inteligentes.",
      gradient: "from-violet-600 to-purple-600",
      lightGradient: "from-violet-500/20 to-purple-500/20",
    },
    {
      icon: BarChart3,
      title: "Analytics Avanzado",
      description: "Toma decisiones basadas en datos con reportes detallados y métricas en tiempo real.",
      gradient: "from-fuchsia-600 to-pink-600",
      lightGradient: "from-fuchsia-500/20 to-pink-500/20",
    },
    {
      icon: Target,
      title: "Segmentación Precisa",
      description: "Crea segmentos de audiencia personalizados para campañas más efectivas.",
      gradient: "from-orange-600 to-amber-600",
      lightGradient: "from-orange-500/20 to-amber-500/20",
    },
    {
      icon: Brain,
      title: "IA Integrada",
      description: "Usa inteligencia artificial para optimizar tus campañas y predecir comportamientos.",
      gradient: "from-teal-600 to-emerald-600",
      lightGradient: "from-teal-500/20 to-emerald-500/20",
    },
    {
      icon: Workflow,
      title: "Integraciones",
      description: "Conecta con todas tus herramientas favoritas mediante APIs y webhooks.",
      gradient: "from-indigo-600 to-blue-600",
      lightGradient: "from-indigo-500/20 to-blue-500/20",
    },
  ];

  const solutions = [
    {
      title: "E-commerce",
      description: "Aumenta tus ventas con automatización de carritos abandonados y campañas personalizadas.",
      icon: "🛒",
      benefits: ["Recuperación de carritos", "Emails transaccionales", "Segmentación por compras"],
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "SaaS",
      description: "Convierte más trial users en clientes pagos con onboarding automatizado.",
      icon: "💻",
      benefits: ["Onboarding automatizado", "Engagement por uso", "Retención de usuarios"],
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Educación",
      description: "Gestiona cursos, estudiantes y comunicaciones desde una sola plataforma.",
      icon: "🎓",
      benefits: ["Gestión de cursos", "Recordatorios automáticos", "Certificados digitales"],
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  const testimonials = [
    {
      name: "María González",
      role: "CEO, TechStartup",
      content: "Esta plataforma transformó completamente nuestra estrategia de marketing. En 3 meses aumentamos nuestras conversiones en un 240%.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      name: "Carlos Ruiz",
      role: "Director de Marketing, GrowthCo",
      content: "La automatización nos ahorró más de 20 horas semanales. Ahora podemos enfocarnos en estrategia mientras la plataforma hace el trabajo pesado.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    {
      name: "Ana Martínez",
      role: "Fundadora, EduOnline",
      content: "El CRM es intuitivo y poderoso. Finalmente tenemos todos nuestros datos de clientes organizados y accesibles en un solo lugar.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/mes",
      description: "Perfecto para emprendedores y pequeños negocios",
      features: [
        "Hasta 1,000 contactos",
        "5 landing pages",
        "Email marketing básico",
        "Analytics básico",
        "Soporte por email",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$99",
      period: "/mes",
      description: "Ideal para equipos en crecimiento",
      features: [
        "Hasta 10,000 contactos",
        "Landing pages ilimitadas",
        "Automatización avanzada",
        "Analytics completo",
        "A/B Testing",
        "Soporte prioritario 24/7",
        "API access",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Para grandes empresas con necesidades específicas",
      features: [
        "Contactos ilimitados",
        "Todo lo de Professional",
        "Integraciones personalizadas",
        "Gerente de cuenta dedicado",
        "SLA garantizado",
        "Onboarding personalizado",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 backdrop-blur-xl shadow-2xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl border border-white/30">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white">
                MarketingPro
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`text-sm font-bold transition-colors ${
                    activeSection === item.id ? "text-white" : "text-white/80 hover:text-white"
                  }`}
                  whileHover={{ y: -2 }}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20 font-semibold border border-white/30">
                Iniciar Sesión
              </Button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-white text-purple-600 hover:bg-white/90 shadow-xl font-bold">
                  Prueba Gratis <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                className="md:hidden pt-4 pb-6 space-y-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-white hover:text-white/80 py-2 font-semibold"
                    onClick={() => {
                      setActiveSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="pt-4 space-y-3">
                  <Button variant="outline" className="w-full border-white/40 text-white hover:bg-white/20 font-semibold">
                    Iniciar Sesión
                  </Button>
                  <Button className="w-full bg-white text-purple-600 hover:bg-white/90 shadow-xl font-bold">
                    Prueba Gratis <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="inicio" className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-b from-violet-950/50 to-slate-950">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/30 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-200 border-violet-500/30 px-4 py-1.5 text-sm">
                <Sparkles className="h-3.5 w-3.5 mr-2 inline" />
                La Plataforma de Marketing #1 en Latinoamérica
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-black leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-violet-200 bg-clip-text text-transparent">
                Automatiza tu Marketing
              </span>
              <br />
              <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                Multiplica tus Ventas
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              La plataforma todo-en-uno que usan más de 10,000 empresas para gestionar campañas,
              automatizar workflows y convertir leads en clientes felices.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold px-10 py-7 text-lg shadow-2xl shadow-violet-500/50"
                >
                  Comenzar Gratis <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-violet-500/30 text-white hover:bg-violet-500/10 px-10 py-7 text-lg"
                >
                  Ver Demo <MessageSquare className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {[
                { value: "10,000+", label: "Empresas", color: "from-blue-400 to-cyan-400" },
                { value: "99.9%", label: "Uptime", color: "from-emerald-400 to-teal-400" },
                { value: "50M+", label: "Emails/mes", color: "from-violet-400 to-fuchsia-400" },
                { value: "4.9/5", label: "Rating", color: "from-orange-400 to-amber-400" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400 mt-1 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            className="mt-20 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="relative rounded-3xl overflow-hidden border border-violet-500/30 shadow-2xl shadow-violet-500/20">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1400&h=800&fit=crop"
                alt="Dashboard"
                className="w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-violet-950 via-transparent to-transparent" />
            </div>

            {/* Floating Cards */}
            <motion.div
              className="absolute -top-8 -left-8 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-5 shadow-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="text-sm text-slate-300 font-medium">Conversión</div>
                  <div className="text-3xl font-black bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">+187%</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-8 -right-8 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-5 shadow-2xl"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="text-sm text-slate-300 font-medium">Nuevos Leads</div>
                  <div className="text-3xl font-black bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">+2,543</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="py-24 px-6 bg-gradient-to-b from-slate-950 to-slate-900/80">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 border-cyan-500/30 mb-4">
              Características
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Todo lo que necesitas para{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                dominar el mercado
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Herramientas poderosas que transforman tu forma de hacer marketing
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className={`bg-gradient-to-br ${feature.lightGradient} backdrop-blur-sm border-white/10 hover:border-white/20 transition-all h-full shadow-xl`}>
                  <CardContent className="pt-6">
                    <div
                      className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 mb-5 shadow-lg`}
                    >
                      <feature.icon className="h-full w-full text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="soluciones" className="py-24 px-6 bg-gradient-to-b from-slate-900/80 to-slate-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-200 border-orange-500/30 mb-4">
              Soluciones
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Perfecto para tu{" "}
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                industria
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Soluciones especializadas que se adaptan a tu negocio
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((solution, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-white/10 hover:border-white/20 transition-all h-full backdrop-blur-sm">
                  <CardHeader>
                    <div className="text-6xl mb-4">{solution.icon}</div>
                    <CardTitle className="text-3xl font-bold">{solution.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 mb-6 text-lg leading-relaxed">{solution.description}</p>
                    <ul className="space-y-3">
                      {solution.benefits.map((benefit, bidx) => (
                        <li key={bidx} className="flex items-center gap-3 text-slate-300">
                          <div className={`h-6 w-6 rounded-full bg-gradient-to-br ${solution.gradient} flex items-center justify-center flex-shrink-0`}>
                            <Check className="h-4 w-4 text-white" />
                          </div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="py-24 px-6 bg-gradient-to-b from-slate-950 to-slate-900/80">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-200 border-pink-500/30 mb-4">
              Testimonios
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Lo que dicen nuestros{" "}
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                clientes
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Miles de empresas confían en nosotros cada día
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-pink-500/10 hover:border-pink-500/30 transition-all h-full">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-200 text-lg italic mb-6 leading-relaxed">"{testimonial.content}"</p>
                    <div className="flex items-center gap-4 pt-4 border-t border-pink-500/20">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="h-14 w-14 rounded-full object-cover border-2 border-pink-500/50 shadow-lg"
                      />
                      <div>
                        <div className="font-bold text-white text-lg">{testimonial.name}</div>
                        <div className="text-sm text-slate-400">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precios" className="py-24 px-6 bg-gradient-to-b from-slate-900/80 to-slate-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-200 border-emerald-500/30 mb-4">
              Precios
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Planes para cada{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                etapa de crecimiento
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Comienza gratis y escala cuando lo necesites
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
              >
                <Card
                  className={`relative h-full ${
                    plan.popular
                      ? "bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/30"
                      : "bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-white/10"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-1.5 shadow-lg shadow-emerald-500/50 font-bold">
                        ⭐ Más Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-8">
                    <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>
                    <div className="mt-6">
                      <span className="text-6xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{plan.price}</span>
                      <span className="text-slate-400 text-xl">{plan.period}</span>
                    </div>
                    <p className="text-slate-300 mt-4 text-lg">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-slate-200 text-lg">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full py-6 text-lg font-bold ${
                        plan.popular
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/50"
                          : "bg-white/10 hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      {plan.price === "Custom" ? "Contactar Ventas" : "Comenzar Ahora"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              ¿Listo para transformar tu marketing?
            </h2>
            <p className="text-2xl text-white/90 mb-10 leading-relaxed">
              Únete a más de 10,000 empresas que ya están creciendo.
              <br />
              <span className="font-bold">14 días gratis, sin tarjeta de crédito.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-white text-violet-600 hover:bg-slate-100 font-black px-12 py-7 text-xl shadow-2xl"
                >
                  Comenzar Gratis <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-3 border-white text-white hover:bg-white hover:text-violet-600 px-12 py-7 text-xl font-bold"
                >
                  Agendar Demo
                </Button>
              </motion.div>
            </div>
            <p className="text-white/80 mt-8 text-lg">
              <Shield className="h-5 w-5 inline mr-2" />
              Cancela cuando quieras · GDPR compliant · Soporte 24/7
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-24 px-6 bg-gradient-to-b from-slate-950 to-slate-900/80">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl font-black mb-6">
                Hablemos de tu{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                  proyecto
                </span>
              </h2>
              <p className="text-slate-300 mb-8 text-xl leading-relaxed">
                ¿Tienes preguntas o necesitas ayuda? Nuestro equipo está listo para impulsar tu negocio.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 font-medium">Email</div>
                    <div className="font-bold text-xl text-white">hola@marketingpro.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 font-medium">Teléfono</div>
                    <div className="font-bold text-xl text-white">+1 (555) 123-4567</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 font-medium">Oficina</div>
                    <div className="font-bold text-xl text-white">San Francisco, CA</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-indigo-500/30">
                <CardContent className="pt-6">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold mb-3 text-white">Nombre</label>
                      <input
                        type="text"
                        className="w-full px-5 py-3 rounded-xl bg-white/10 border border-indigo-500/30 focus:border-indigo-500 focus:outline-none text-white placeholder-slate-400 transition-all"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-3 text-white">Email</label>
                      <input
                        type="email"
                        className="w-full px-5 py-3 rounded-xl bg-white/10 border border-indigo-500/30 focus:border-indigo-500 focus:outline-none text-white placeholder-slate-400 transition-all"
                        placeholder="tu@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-3 text-white">Empresa</label>
                      <input
                        type="text"
                        className="w-full px-5 py-3 rounded-xl bg-white/10 border border-indigo-500/30 focus:border-indigo-500 focus:outline-none text-white placeholder-slate-400 transition-all"
                        placeholder="Tu empresa"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-3 text-white">Mensaje</label>
                      <textarea
                        rows={4}
                        className="w-full px-5 py-3 rounded-xl bg-white/10 border border-indigo-500/30 focus:border-indigo-500 focus:outline-none text-white placeholder-slate-400 transition-all"
                        placeholder="Cuéntanos sobre tu proyecto"
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 py-6 text-lg font-bold shadow-lg shadow-indigo-500/50">
                      Enviar Mensaje <Send className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-violet-500/20 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/50">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                  MarketingPro
                </span>
              </div>
              <p className="text-slate-400 mb-6 max-w-sm text-lg leading-relaxed">
                La plataforma de marketing automation que transforma la forma en que creces tu negocio.
              </p>
              <div className="flex gap-4">
                {[Twitter, Linkedin, Instagram, Youtube].map((Icon, idx) => (
                  <motion.a
                    key={idx}
                    href="#"
                    className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 hover:from-violet-500 hover:to-fuchsia-500 flex items-center justify-center transition-all border border-violet-500/30"
                    whileHover={{ scale: 1.1, y: -4 }}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              {
                title: "Producto",
                links: ["Características", "Integraciones", "Precios", "Changelog"],
              },
              {
                title: "Recursos",
                links: ["Blog", "Documentación", "Tutoriales", "API"],
              },
              {
                title: "Empresa",
                links: ["Sobre nosotros", "Carreras", "Contacto", "Partners"],
              },
            ].map((column, idx) => (
              <div key={idx}>
                <h3 className="font-black text-white mb-4 text-lg">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-slate-400 hover:text-violet-400 transition-colors text-base"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-violet-500/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400">
              © 2024 MarketingPro. Todos los derechos reservados.
            </p>
            <div className="flex gap-8 text-slate-400">
              <a href="#" className="hover:text-violet-400 transition-colors font-medium">
                Privacidad
              </a>
              <a href="#" className="hover:text-violet-400 transition-colors font-medium">
                Términos
              </a>
              <a href="#" className="hover:text-violet-400 transition-colors font-medium">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
