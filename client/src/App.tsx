import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Registration from "@/pages/registration";
import SpinWheelPage from "@/pages/spin-wheel";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Registration} />
      <Route path="/spin/:id" component={SpinWheelPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Set dark mode by default
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
