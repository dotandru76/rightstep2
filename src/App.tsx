
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import ProfileComplete from "./pages/ProfileComplete";
import { checkForUpdates } from "./services/UpdateService";
import UpdateNotification from "./components/UpdateNotification";
import { ProgramProvider } from "./contexts/ProgramContext";

const queryClient = new QueryClient();

const App = () => {
  // Update to use a function to check if user data exists
  const userDataExists = () => !!localStorage.getItem("userData");
  
  const [updateInfo, setUpdateInfo] = useState<any>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  useEffect(() => {
    const checkUpdates = async () => {
      const { hasUpdate, updateInfo } = await checkForUpdates();
      
      if (hasUpdate && updateInfo) {
        setUpdateInfo(updateInfo);
        setShowUpdateDialog(true);
      }
    };
    
    // Check for updates when app loads
    checkUpdates();
    
    // Schedule regular update checks (every hour)
    const intervalId = setInterval(checkUpdates, 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleUpdateComplete = () => {
    setShowUpdateDialog(false);
    // In a real app, you might want to reload the app here
    window.location.reload();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ProgramProvider>
          <BrowserRouter>
            <Routes>
              {/* Update to use function to check dynamically */}
              <Route path="/" element={userDataExists() ? <Index /> : <Navigate to="/register" />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile-complete" element={<ProfileComplete />} />
              {/* Redirect week routes to index */}
              <Route path="/week/:weekNumber" element={<Navigate to="/" />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
          {updateInfo && (
            <UpdateNotification
              open={showUpdateDialog}
              updateInfo={updateInfo}
              onClose={() => setShowWeekDetails(false)}
              onUpdate={handleUpdateComplete}
            />
          )}
        </ProgramProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
