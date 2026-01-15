import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/LanguageSelector';
import { logout, getPolitician } from '@/services/storage.service';
import {
  LayoutDashboard,
  Users,
  Image,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Cake,
  CreditCard,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const politician = getPolitician();

  const navItems = [
    { path: '/dashboard', label: t('common.dashboard'), icon: LayoutDashboard },
    { path: '/karyakartas', label: t('common.karyakartas'), icon: Users },
    { path: '/banner', label: t('common.bannerPreview'), icon: Image },
    { path: '/logs', label: t('common.whatsappLogs'), icon: MessageSquare },
    { path: '/subscription', label: t('common.subscription'), icon: CreditCard },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-saffron">
              <Cake className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">
              {t('common.appName')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className={`gap-2 ${isActive ? 'gradient-saffron' : ''}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <LanguageSelector variant="ghost" showLabel={false} />

            {/* Profile */}
            <Link to="/profile">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer">
                <div className="h-7 w-7 rounded-full gradient-saffron flex items-center justify-center text-xs font-bold text-primary-foreground overflow-hidden">
                  {politician.photo ? (
                    <img src={politician.photo} alt={politician.name} className="h-full w-full object-cover" />
                  ) : (
                    politician.name.charAt(0)
                  )}
                </div>
                <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                  {politician.name.split(' ')[0]}
                </span>
              </div>
            </Link>

            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-card"
            >
              <div className="container py-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        className={`w-full justify-start gap-2 ${isActive ? 'gradient-saffron' : ''}`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}

                <div className="border-t border-border my-2 pt-2">
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <div className="h-5 w-5 rounded-full gradient-saffron flex items-center justify-center text-[10px] font-bold text-primary-foreground overflow-hidden">
                        {politician.photo ? (
                          <img src={politician.photo} alt={politician.name} className="h-full w-full object-cover" />
                        ) : (
                          politician.name.charAt(0)
                        )}
                      </div>
                      <span className="truncate">{politician.name}</span>
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    {t('common.logout')}
                  </Button>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
