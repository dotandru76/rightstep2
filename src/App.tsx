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
  const userDataExists = () => {
    try {
      return !!localStorage.getItem("userData");
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return false;
    }
  };
  
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
    
    checkUpdates();
    
    const intervalId = setInterval(checkUpdates, 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleUpdateComplete = () => {
    setShowUpdateDialog(false);
    window.location.reload();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ProgramProvider>
          <BrowserRouter>
            <Routes>
              <Route 
                path="/" 
                element={
                  userDataExists() ? 
                    <Index /> : 
                    <Navigate to="/register" replace />
                } 
              />
              <Route path="/register" element={<Register />} />
              <Route path="/profile-complete" element={<ProfileComplete />} />
              <Route path="/week/:weekNumber" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
          {updateInfo && (
            <UpdateNotification
              open={showUpdateDialog}
              updateInfo={updateInfo}
              onClose={() => setShowUpdateDialog(false)}
              onUpdate={handleUpdateComplete}
            />
          )}
        </ProgramProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
