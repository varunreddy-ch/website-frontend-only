import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
// import User from "./pages/User";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import AdminJobs from "./pages/AdminJobs";
import AdminDemos from "./pages/AdminDemos";
import ApplierForm from "./pages/ApplierForm";
import Demo from "./pages/Demo";

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<Toaster />
			<Sonner />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Index />} />
					<Route path="/signin" element={<SignIn />} />
					{/* <Route path="/user" element={<User />} /> */}
					<Route path="/signup" element={<SignUp />} />
					<Route path="/profile/:id" element={<Profile />} />
					<Route path="/analytics" element={<Analytics />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/jobs" element={<Jobs />} />
					<Route path="/admin" element={<Admin />} />
					<Route path="/admin/jobs" element={<AdminJobs />} />
					<Route path="/admin/demos" element={<AdminDemos />} />
					<Route
						path="/admin/dashboard"
						element={<AdminDashboard />}
					/>
					<Route path="/applier-form" element={<ApplierForm />} />
					<Route path="/demo" element={<Demo />} />
					{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
