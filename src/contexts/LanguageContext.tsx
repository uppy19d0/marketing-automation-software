import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Comprehensive translations for the entire app
const translations = {
  es: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.contacts": "Contactos",
    "nav.segments": "Segmentos",
    "nav.campaigns": "Campañas",
    "nav.landings": "Landing Pages",
    "nav.automations": "Automatizaciones",
    "nav.reports": "Reportes",
    "nav.settings": "Configuración",
    
    // Common
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.export": "Exportar",
    "common.import": "Importar",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.create": "Crear",
    "common.new": "Nuevo",
    "common.all": "Todos",
    "common.active": "Activo",
    "common.inactive": "Inactivo",
    "common.draft": "Borrador",
    "common.published": "Publicado",
    "common.scheduled": "Programado",
    "common.name": "Nombre",
    "common.email": "Email",
    "common.status": "Estado",
    "common.actions": "Acciones",
    "common.date": "Fecha",
    "common.view": "Ver",
    "common.download": "Descargar",
    "common.loading": "Cargando...",
    
    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Resumen de tu actividad de marketing",
    "dashboard.totalContacts": "Total Contactos",
    "dashboard.activeSegments": "Segmentos Activos",
    "dashboard.activeCampaigns": "Campañas Activas",
    "dashboard.conversionRate": "Tasa de Conversión",
    "dashboard.recentActivity": "Actividad Reciente",
    "dashboard.topCampaigns": "Mejores Campañas",
    "dashboard.growthChart": "Crecimiento de Contactos",
    "dashboard.openRate": "Tasa de Apertura",
    "dashboard.clickRate": "Tasa de Click",
    
    // Contacts
    "contacts.title": "Contactos",
    "contacts.subtitle": "Gestiona tu base de contactos",
    "contacts.addContact": "Agregar Contacto",
    "contacts.importContacts": "Importar Contactos",
    "contacts.exportContacts": "Exportar Contactos",
    "contacts.searchPlaceholder": "Buscar contactos...",
    "contacts.allContacts": "Todos los Contactos",
    "contacts.subscribed": "Suscritos",
    "contacts.unsubscribed": "Desuscritos",
    "contacts.firstName": "Nombre",
    "contacts.lastName": "Apellido",
    "contacts.country": "País",
    "contacts.segment": "Segmento",
    "contacts.createdAt": "Creado",
    
    // Segments
    "segments.title": "Segmentos",
    "segments.subtitle": "Organiza tus contactos en grupos específicos",
    "segments.createSegment": "Crear Segmento",
    "segments.allSegments": "Todos los Segmentos",
    "segments.contacts": "contactos",
    "segments.conditions": "condiciones",
    
    // Campaigns
    "campaigns.title": "Campañas",
    "campaigns.subtitle": "Gestiona tus campañas de email marketing",
    "campaigns.createCampaign": "Crear Campaña",
    "campaigns.allCampaigns": "Todas",
    "campaigns.sent": "Enviadas",
    "campaigns.subject": "Asunto",
    "campaigns.recipients": "Destinatarios",
    "campaigns.openRate": "Tasa Apertura",
    "campaigns.clickRate": "Tasa Click",
    
    // Landing Pages
    "landings.title": "Landing Pages",
    "landings.subtitle": "Crea y gestiona tus páginas de aterrizaje",
    "landings.createLanding": "Crear Landing Page",
    "landings.allPages": "Todas",
    "landings.template": "Plantilla",
    "landings.views": "Vistas",
    "landings.conversions": "Conversiones",
    "landings.conversionRate": "Tasa Conv.",
    
    // Automations
    "automations.title": "Automatizaciones",
    "automations.subtitle": "Configura flujos de trabajo automatizados",
    "automations.createAutomation": "Crear Automatización",
    "automations.allAutomations": "Todas",
    "automations.trigger": "Disparador",
    "automations.actions": "acciones",
    
    // Reports
    "reports.title": "Reportes",
    "reports.subtitle": "Analiza el rendimiento de tus campañas",
    "reports.dateRange": "Rango de Fechas",
    "reports.campaignPerformance": "Rendimiento de Campañas",
    "reports.audienceGrowth": "Crecimiento de Audiencia",
    "reports.engagementMetrics": "Métricas de Engagement",
    
    // Settings
    "settings.title": "Configuración",
    "settings.subtitle": "Gestiona la configuración de tu cuenta",
    "settings.general": "General",
    "settings.customFields": "Campos Personalizados",
    "settings.systemVariables": "Variables del Sistema",
    "settings.aiDemo": "IA Local (Demo)",
    "settings.workspaceInfo": "Información del Workspace",
    "settings.workspaceName": "Nombre del Workspace",
    "settings.timezone": "Zona Horaria",
    "settings.language": "Idioma",
    "settings.saveChanges": "Guardar Cambios",
    "settings.saved": "Cambios guardados exitosamente",
    "settings.languageChanged": "Idioma cambiado a Español",
    
    // Footer
    "footer.project": "Unicaribe proyecto grupal - Luis A. Tavarez",
  },
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.contacts": "Contacts",
    "nav.segments": "Segments",
    "nav.campaigns": "Campaigns",
    "nav.landings": "Landing Pages",
    "nav.automations": "Automations",
    "nav.reports": "Reports",
    "nav.settings": "Settings",
    
    // Common
    "common.search": "Search",
    "common.filter": "Filter",
    "common.export": "Export",
    "common.import": "Import",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.create": "Create",
    "common.new": "New",
    "common.all": "All",
    "common.active": "Active",
    "common.inactive": "Inactive",
    "common.draft": "Draft",
    "common.published": "Published",
    "common.scheduled": "Scheduled",
    "common.name": "Name",
    "common.email": "Email",
    "common.status": "Status",
    "common.actions": "Actions",
    "common.date": "Date",
    "common.view": "View",
    "common.download": "Download",
    "common.loading": "Loading...",
    
    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Overview of your marketing activity",
    "dashboard.totalContacts": "Total Contacts",
    "dashboard.activeSegments": "Active Segments",
    "dashboard.activeCampaigns": "Active Campaigns",
    "dashboard.conversionRate": "Conversion Rate",
    "dashboard.recentActivity": "Recent Activity",
    "dashboard.topCampaigns": "Top Campaigns",
    "dashboard.growthChart": "Contacts Growth",
    "dashboard.openRate": "Open Rate",
    "dashboard.clickRate": "Click Rate",
    
    // Contacts
    "contacts.title": "Contacts",
    "contacts.subtitle": "Manage your contact database",
    "contacts.addContact": "Add Contact",
    "contacts.importContacts": "Import Contacts",
    "contacts.exportContacts": "Export Contacts",
    "contacts.searchPlaceholder": "Search contacts...",
    "contacts.allContacts": "All Contacts",
    "contacts.subscribed": "Subscribed",
    "contacts.unsubscribed": "Unsubscribed",
    "contacts.firstName": "First Name",
    "contacts.lastName": "Last Name",
    "contacts.country": "Country",
    "contacts.segment": "Segment",
    "contacts.createdAt": "Created",
    
    // Segments
    "segments.title": "Segments",
    "segments.subtitle": "Organize your contacts into specific groups",
    "segments.createSegment": "Create Segment",
    "segments.allSegments": "All Segments",
    "segments.contacts": "contacts",
    "segments.conditions": "conditions",
    
    // Campaigns
    "campaigns.title": "Campaigns",
    "campaigns.subtitle": "Manage your email marketing campaigns",
    "campaigns.createCampaign": "Create Campaign",
    "campaigns.allCampaigns": "All",
    "campaigns.sent": "Sent",
    "campaigns.subject": "Subject",
    "campaigns.recipients": "Recipients",
    "campaigns.openRate": "Open Rate",
    "campaigns.clickRate": "Click Rate",
    
    // Landing Pages
    "landings.title": "Landing Pages",
    "landings.subtitle": "Create and manage your landing pages",
    "landings.createLanding": "Create Landing Page",
    "landings.allPages": "All",
    "landings.template": "Template",
    "landings.views": "Views",
    "landings.conversions": "Conversions",
    "landings.conversionRate": "Conv. Rate",
    
    // Automations
    "automations.title": "Automations",
    "automations.subtitle": "Set up automated workflows",
    "automations.createAutomation": "Create Automation",
    "automations.allAutomations": "All",
    "automations.trigger": "Trigger",
    "automations.actions": "actions",
    
    // Reports
    "reports.title": "Reports",
    "reports.subtitle": "Analyze your campaign performance",
    "reports.dateRange": "Date Range",
    "reports.campaignPerformance": "Campaign Performance",
    "reports.audienceGrowth": "Audience Growth",
    "reports.engagementMetrics": "Engagement Metrics",
    
    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Manage your account settings",
    "settings.general": "General",
    "settings.customFields": "Custom Fields",
    "settings.systemVariables": "System Variables",
    "settings.aiDemo": "Local AI (Demo)",
    "settings.workspaceInfo": "Workspace Information",
    "settings.workspaceName": "Workspace Name",
    "settings.timezone": "Time Zone",
    "settings.language": "Language",
    "settings.saveChanges": "Save Changes",
    "settings.saved": "Changes saved successfully",
    "settings.languageChanged": "Language changed to English",
    
    // Footer
    "footer.project": "Unicaribe group project",
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("language") as Language) || "es";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.es] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
