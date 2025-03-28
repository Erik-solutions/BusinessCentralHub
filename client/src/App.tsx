import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import CRMPage from "@/pages/crm-page";
import HRPage from "@/pages/hr-page";
import AccountingPage from "@/pages/accounting-page";
import OperationsPage from "@/pages/operations-page";
import MarketplacePage from "@/pages/marketplace-page";
import SettingsPage from "@/pages/settings-page";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/crm" component={CRMPage} />
      <ProtectedRoute path="/hr" component={HRPage} />
      <ProtectedRoute path="/accounting" component={AccountingPage} />
      <ProtectedRoute path="/operations" component={OperationsPage} />
      <ProtectedRoute path="/marketplace" component={MarketplacePage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
