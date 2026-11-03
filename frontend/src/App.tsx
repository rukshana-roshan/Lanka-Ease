import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PwaProvider } from './context/PwaContext';
import './i18n/i18n';

// Layout Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import type { Role } from './types';
import { OfflineBanner } from './components/OfflineBanner';
import { PageFrame } from './components/PageFrame';

// Pages
import { WelcomeLandingPage } from './pages/WelcomeLandingPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PasswordResetPage } from './pages/PasswordResetPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { RequestWizard } from './pages/RequestWizard';
import { RequestTrackingPage } from './pages/RequestTrackingPage';
import { RequestsListPage } from './pages/RequestsListPage';
import { FamilyAssistancePage } from './pages/FamilyAssistancePage';
import { MessagesPage } from './pages/MessagesPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProviderDashboard } from './pages/ProviderDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

// Public Explore Pages
import { ServicesPage } from './pages/ServicesPage';
import { ProvidersPage } from './pages/ProvidersPage';
import { MarketplaceProfilePage } from './pages/MarketplaceProfilePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

const queryClient = new QueryClient();

// Helper Wrapper for inner app pages to keep max-w-7xl layout consistency
const AppContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PageFrame>{children}</PageFrame>
);

// Route Guard: restricts access to authenticated users only.
// Unauthenticated users are redirected to /login with the target URL preserved.
const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: Role[] }> = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  if (roles && user && !roles.includes(user.role)) return <Navigate to={user.role === 'ADMIN' ? '/admin' : user.role === 'PROVIDER' ? '/provider' : '/app'} replace />;
  return <>{children}</>;
};

// App Layout that controls navbar/footer visibility based on auth state and path
const AppContent: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, isDemo } = useAuth();
  const isPublicPage = ['/', '/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);
  const showNav = !isPublicPage && isAuthenticated;
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const page = location.pathname.split('/').filter(Boolean).pop() || 'Home';
    document.title = `${page === 'app' ? 'Your workspace' : page.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase())} · LankaEase`;
  }, [location.pathname]);

  return (
    <div className="lanka-app min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-brand-500 selection:text-white">
      <OfflineBanner />
      {showNav && <Navbar />}
      {showNav && isDemo && <div className="demo-workspace-notice" role="status">Demo workspace ? Sample records are stored on this browser. No real bookings or payments are sent.</div>}

      <main className="flex-1 w-full">
        <Routes>
          <Route path="/forgot-password" element={<PasswordResetPage />} />
          <Route path="/reset-password" element={<PasswordResetPage />} />
          {/* Public Welcome Landing Page */}
          <Route path="/" element={<WelcomeLandingPage />} />

          {/* Authentication Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Main Website Homepage (Requires Register or Sign In) */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* Website Pages (Require Register or Sign In) */}
          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <AppContainer><ServicesPage /></AppContainer>
              </ProtectedRoute>
            }
          />
          <Route
            path="/providers"
            element={
                <AppContainer><ProvidersPage /></AppContainer>
            }
          />
          <Route
            path="/how-it-works"
            element={
              <ProtectedRoute>
                <AppContainer><HowItWorksPage /></AppContainer>
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <AppContainer><AboutPage /></AppContainer>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <AppContainer><ContactPage /></AppContainer>
              </ProtectedRoute>
            }
          />

          {/* Customer App Routes (Require Register or Sign In) */}
          <Route path="/app" element={<ProtectedRoute><AppContainer><CustomerDashboard /></AppContainer></ProtectedRoute>} />
          <Route path="/app/explore" element={<ProtectedRoute><AppContainer><ProvidersPage /></AppContainer></ProtectedRoute>} />
          <Route path="/app/request" element={<ProtectedRoute><AppContainer><RequestWizard /></AppContainer></ProtectedRoute>} />
          <Route path="/app/requests" element={<ProtectedRoute><AppContainer><RequestsListPage /></AppContainer></ProtectedRoute>} />
          <Route path="/app/requests/:id" element={<ProtectedRoute><AppContainer><RequestTrackingPage /></AppContainer></ProtectedRoute>} />
          <Route path="/app/messages" element={<ProtectedRoute><AppContainer><MessagesPage /></AppContainer></ProtectedRoute>} />
          <Route path="/app/family" element={<ProtectedRoute><AppContainer><FamilyAssistancePage /></AppContainer></ProtectedRoute>} />
          <Route path="/app/invoices" element={<ProtectedRoute><AppContainer><InvoicesPage /></AppContainer></ProtectedRoute>} />
          <Route path="/app/payments" element={<ProtectedRoute><AppContainer><CheckoutPage /></AppContainer></ProtectedRoute>} />
          <Route path="/app/profile" element={<ProtectedRoute><AppContainer><CustomerDashboard /></AppContainer></ProtectedRoute>} />

          {/* Provider App Routes (Require Register or Sign In) */}
          <Route path="/provider" element={<ProtectedRoute roles={['PROVIDER']}><AppContainer><ProviderDashboard /></AppContainer></ProtectedRoute>} />
          <Route path="/providers/:id" element={<AppContainer><MarketplaceProfilePage /></AppContainer>} />
          <Route path="/provider/*" element={<ProtectedRoute roles={['PROVIDER']}><AppContainer><ProviderDashboard /></AppContainer></ProtectedRoute>} />

          {/* Admin App Routes (Require Register or Sign In) */}
          <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AppContainer><AdminDashboard /></AppContainer></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute roles={['ADMIN']}><AppContainer><AdminDashboard /></AppContainer></ProtectedRoute>} />

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {showNav && <Footer />}
      {showNav && <PwaInstallBanner />}
      {showNav && <BottomNav />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <PwaProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </PwaProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
