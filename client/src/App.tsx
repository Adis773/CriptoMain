import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PremiumPage from "@/pages/PremiumPage";
import SkinsPage from "@/pages/SkinsPage";
import AuthPage from "@/pages/AuthPage";
import { GameProvider } from "@/lib/gameState";
import Toast from "@/components/Toast";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/premium" component={PremiumPage} />
      <ProtectedRoute path="/skins" component={SkinsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <Router />
        <Toaster />
        <Toast />
      </GameProvider>
    </QueryClientProvider>
  );
}

export default App;
