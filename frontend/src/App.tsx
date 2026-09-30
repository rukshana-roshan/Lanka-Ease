import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PwaProvider } from './context/PwaContext';
import './i18n/i18n';

// Layout Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { OfflineBanner } from './components/OfflineBanner';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
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

// Newly added viewable pages
import { ServicesPage } from './pages/ServicesPage';
import { ProvidersPage } from './pages/ProvidersPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

const queryClient = new QueryClient();

// Helper Wrapper for inner app pages to keep max-w-7xl layout consistency
const AppContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
    {children}
  </div>
);

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <PwaProvider>
            <BrowserRouter>
              <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-brand-500 selection:text-white">
                <OfflineBanner />
                <Navbar />

                <main className="flex-1 w-full">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/services" element={<AppContainer><ServicesPage /></AppContainer>} />
                    <Route path="/providers" element={<AppContainer><ProvidersPage /></AppContainer>} />
                    <Route path="/how-it-works" element={<AppContainer><HowItWorksPage /></AppContainer>} />
                    <Route path="/about" element={<AppContainer><AboutPage /></AppContainer>} />
                    <Route path="/contact" element={<AppContainer><ContactPage /></AppContainer>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Customer App Routes */}
                    <Route path="/app" element={<AppContainer><CustomerDashboard /></AppContainer>} />
                    <Route path="/app/explore" element={<AppContainer><ProvidersPage /></AppContainer>} />
                    <Route path="/app/request" element={<AppContainer><RequestWizard /></AppContainer>} />
                    <Route path="/app/requests" element={<AppContainer><RequestsListPage /></AppContainer>} />
                    <Route path="/app/requests/:id" element={<AppContainer><RequestTrackingPage /></AppContainer>} />
                    <Route path="/app/messages" element={<AppContainer><MessagesPage /></AppContainer>} />
                    <Route path="/app/family" element={<AppContainer><FamilyAssistancePage /></AppContainer>} />
                    <Route path="/app/invoices" element={<AppContainer><InvoicesPage /></AppContainer>} />
                    <Route path="/app/payments" element={<AppContainer><CheckoutPage /></AppContainer>} />
                    <Route path="/app/profile" element={<AppContainer><CustomerDashboard /></AppContainer>} />

                    {/* Provider App Routes */}
                    <Route path="/provider" element={<AppContainer><ProviderDashboard /></AppContainer>} />
                    <Route path="/provider/*" element={<AppContainer><ProviderDashboard /></AppContainer>} />

                    {/* Admin App Routes */}
                    <Route path="/admin" element={<AppContainer><AdminDashboard /></AppContainer>} />
                    <Route path="/admin/*" element={<AppContainer><AdminDashboard /></AppContainer>} />

                    {/* Fallback Catch-all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>

                <Footer />
                <PwaInstallBanner />
                <BottomNav />
              </div>
            </BrowserRouter>
          </PwaProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
