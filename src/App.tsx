// src/App.tsx - Added detailed logging for debugging loading issue

import React, { useEffect, useState } from 'react';
// Make sure router imports are correct for your setup (HashRouter/MemoryRouter might be in main.tsx)
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Loader2 } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster"; // Adjust path if needed
import { Toaster as Sonner } from "@/components/ui/sonner"; // Adjust path if needed
import { TooltipProvider } from "@/components/ui/tooltip"; // Adjust path if needed
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// --- Page Components ---
import Index from './pages/Index'; // Adjust path if needed
import NotFound from './pages/NotFound'; // Adjust path if needed
import Register from './pages/Register'; // Adjust path if needed
import ProfileComplete from './pages/ProfileComplete'; // Adjust path if needed
import WelcomeScreen from './pages/WelcomeScreen'; // Adjust path if needed

// --- Services & Context ---
// Ensure these paths are correct for your project structure
import { checkForUpdates } from "./services/UpdateService";
import UpdateNotification from "./components/UpdateNotification";
import { ProgramProvider } from "./contexts/ProgramContext";

// Initialize Query Client
const queryClient = new QueryClient();

const App = () => {
    console.log("App component rendering (Top Level)"); // Log top-level render

    // --- State to manage initial app flow ---
    const [isLoading, setIsLoading] = useState(true); // Start loading
    const [showWelcome, setShowWelcome] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    // --- State for Update Notification ---
    const [updateInfo, setUpdateInfo] = useState<any>(null);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);

    // --- Effect for Initial Checks and Update Polling ---
    useEffect(() => {
        console.log("App useEffect: Starting checks..."); // <-- Added log
        try {
            const welcomeSeen = localStorage.getItem('welcomeSeen') === 'true';
            const userDataExists = !!localStorage.getItem('userData');

            setIsRegistered(userDataExists);
            setShowWelcome(!welcomeSeen && !userDataExists);
            // Log the results of the checks
            console.log("App useEffect: Initial Checks Completed:", { welcomeSeen, userDataExists, showWelcome: !welcomeSeen && !userDataExists }); // <-- Modified log
        } catch (error) {
            // Log any errors during localStorage access
            console.error("App useEffect: Error accessing localStorage on init:", error); // <-- Modified log
            // Set default state on error
            setIsRegistered(false);
            setShowWelcome(true);
        } finally {
            // Log entry into the finally block
            console.log("App useEffect: Entering finally block..."); // <-- Added log
            // Attempt to set loading state to false
            setIsLoading(false);
             // Log immediately after setting state (confirming execution)
            console.log("App useEffect: setIsLoading(false) CALLED."); // <-- Added log
        }

        // --- Update Check Logic ---
        const checkUpdates = async () => {
            try {
                console.log("App useEffect: Checking for updates..."); // <-- Added log
                const { hasUpdate, updateInfo: fetchedUpdateInfo } = await checkForUpdates();
                if (hasUpdate && fetchedUpdateInfo) {
                     // Log if an update is found
                    console.log("App useEffect: Update found.", fetchedUpdateInfo); // <-- Added log
                    setUpdateInfo(fetchedUpdateInfo);
                    setShowUpdateDialog(true);
                } else {
                     // Log if no update is found
                    console.log("App useEffect: No update found or info missing."); // <-- Added log
                }
            } catch (error) {
                 // Log errors during the update check
                console.error("App useEffect: Error checking for updates:", error); // <-- Modified log
            }
        };

        checkUpdates(); // Perform initial update check

        // Temporarily commenting out interval during debugging to simplify logs
        // const intervalId = setInterval(checkUpdates, 60 * 60 * 1000); // Check every hour
        // return () => clearInterval(intervalId); // Cleanup interval on unmount

        // Log when the effect setup is complete
        console.log("App useEffect: Exiting effect setup."); // <-- Added log

    }, []); // Empty dependency array ensures this runs only once on mount


    // --- Update Notification Handlers ---
    const handleUpdateComplete = () => {
        setShowUpdateDialog(false);
        window.location.reload(); // Reload the app after update confirmed
    };
    // ------------------------------------


    // --- Render Loading State ---
    if (isLoading) {
        console.log("App rendering: Loading state (isLoading is true)"); // Log loading render
        return (
            <div className="min-h-screen bg-rightstep-gradient flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        );
    }

    // --- Render Welcome Screen (if needed) ---
    if (showWelcome) {
        console.log("App rendering: WelcomeScreen (showWelcome is true)"); // Log welcome render
        // WelcomeScreen handles setting 'welcomeSeen' flag and navigating to '/register'
        return <WelcomeScreen />;
    }

    // --- Render Main App Structure (if not loading and welcome not needed) ---
    console.log("App rendering: Main App Structure (QueryClientProvider, etc.)"); // Log main render
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <ProgramProvider>
                    {/* Pass registration status to AppRoutes */}
                    <AppRoutes isRegistered={isRegistered} />
                    {/* Include Toasters for notifications */}
                    <Toaster />
                    <Sonner />
                    {/* Conditionally render Update Notification */}
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

// --- Sub-component for Routing Logic ---
// Ensures useLocation is used within Router context (Router likely in main.tsx)
const AppRoutes = ({ isRegistered }: { isRegistered: boolean }) => {
    const location = useLocation();
    // Log current route and registration status for routing decisions
    console.log(`AppRoutes rendering: Location=${location.pathname}, isRegistered=${isRegistered}`);

    return (
        <Routes>
            {/* Default route: Navigate based on registration status */}
            <Route
                path="/"
                element={isRegistered ? <Index /> : <Navigate to="/register" replace />}
            />
            {/* Register route: Allow only if not registered */}
            <Route
                path="/register/*" // Use wildcard if Register might have sub-routes
                element={!isRegistered ? <Register /> : <Navigate to="/" replace />}
            />
            {/* Profile complete: Allow if registered */}
            {/* Note: Might need adjustment if access should be restricted after first view */}
            <Route
                path="/profile-complete"
                element={isRegistered ? <ProfileComplete /> : <Navigate to="/register" replace />}
            />
            {/* Catch-all for Not Found */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default App;