import { useState, useEffect } from "react";
import { DashboardNew } from "./components/DashboardNew";
import { ContactsNew } from "./components/ContactsNew";
import { Segments } from "./components/Segments";
import { CampaignsNew } from "./components/CampaignsNew";
import { LandingPages } from "./components/LandingPages";
import { Reports } from "./components/Reports";
import { Settings } from "./components/Settings";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { 
  LayoutDashboard, 
  Users, 
  Filter, 
  Mail, 
  FileText, 
  BarChart3, 
  Settings as SettingsIcon,
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  Calendar
} from "lucide-react";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { Logo } from "./components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { Toaster } from "./components/ui/sonner";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Login } from "./components/Login";

type ViewType = "dashboard" | "contacts" | "segments" | "campaigns" | "landings" | "reports" | "settings";

function AppContent() {
  const { t } = useLanguage();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const navigation = [
    { name: t("nav.dashboard"), icon: LayoutDashboard, value: "dashboard" as ViewType },
    { name: t("nav.contacts"), icon: Users, value: "contacts" as ViewType },
    { name: t("nav.segments"), icon: Filter, value: "segments" as ViewType },
    { name: t("nav.campaigns"), icon: Mail, value: "campaigns" as ViewType },
    { name: t("nav.landings"), icon: FileText, value: "landings" as ViewType },
    { name: t("nav.reports"), icon: BarChart3, value: "reports" as ViewType },
    { name: t("nav.settings"), icon: SettingsIcon, value: "settings" as ViewType },
  ];

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardNew />;
      case "contacts":
        return <ContactsNew />;
      case "segments":
        return <Segments />;
      case "campaigns":
        return <CampaignsNew />;
      case "landings":
        return <LandingPages />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      default:
        return <DashboardNew />;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Logo variant="full" size="lg" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-background transition-colors overflow-x-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-border bg-gradient-to-br from-brand/5 to-transparent">
            <Logo variant="full" size="md" />
            <button
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  setCurrentView(item.value);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  currentView === item.value
                    ? "bg-brand text-white"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center">
                {t("footer.project")}
              </p>
              <p className="text-xs text-muted-foreground text-center">
                v0.1-local • Demo
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64 w-full">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border backdrop-blur-sm bg-opacity-95">
          <div className="px-4 sm:px-6 lg:px-8 py-3 w-full">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Mobile menu + Search */}
              <div className="flex items-center gap-4 flex-1">
                <button
                  className="lg:hidden text-muted-foreground hover:text-foreground"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </button>
                
                <div className="relative hidden sm:block flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("common.search") + "..."}
                    className="pl-10 h-9"
                  />
                </div>
              </div>

              {/* Right: Date range, notifications, theme, user */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t("reports.dateRange")}
                </Button>

                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                </Button>

                <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
                  {darkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-gradient-to-br from-brand to-brand-600 text-white">
                          AD
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div>
                        <p className="text-sm">{user?.name || "Usuario"}</p>
                        <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setCurrentView("settings")}>
                      <SettingsIcon className="h-4 w-4 mr-2" />
                      {t("nav.settings")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      {t("common.search") === "Buscar" ? "Cerrar sesión" : "Log out"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full max-w-full">
          {renderView()}
        </main>
      </div>
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
