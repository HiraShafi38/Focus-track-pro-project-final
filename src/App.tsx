import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import IndexPage from "@/pages/Index";
import NotFound from "@/pages/NotFound";

function Protected({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div />;                    // quiet while checking
  if (!user) return <Navigate to="/auth?mode=login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/app" element={<Protected><Dashboard /></Protected>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
