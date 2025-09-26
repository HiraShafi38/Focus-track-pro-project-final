import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import LoginForm, { LoginFormValues } from "@/components/auth/LoginForm";
import RegisterForm, { RegisterFormValues } from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Get mode from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const initial = queryParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initial);

  // keep URL in sync (preserves your UX)
  useEffect(() => {
    const qp = new URLSearchParams(location.search);
    if (qp.get("mode") !== mode) {
      qp.set("mode", mode);
      navigate({ pathname: "/auth", search: qp.toString() }, { replace: true });
    }
  }, [mode]);

  const handleAuthSuccess = () => {
    navigate("/app"); // IMPORTANT: correct route after auth
  };

  // ⬇️ These actually talk to the backend and set the token
  async function handleLoginSubmit(values: LoginFormValues) {
    await login(values.email, values.password);     // sets tm_jwt in localStorage
    handleAuthSuccess();
  }
  async function handleRegisterSubmit(values: RegisterFormValues) {
    await register(values.email, values.password, values.name); // sets tm_jwt
    handleAuthSuccess();
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Left side (branding) — unchanged */}
      <div className="sm:w-1/2 bg-todo-primary/10 flex flex-col justify-center items-center p-6 sm:p-10">
        <Link to="/" className="mb-8 self-start">
          <Button variant="ghost" className="text-todo-primary">
            ← Back to home
          </Button>
        </Link>

        <div className="max-w-md mx-auto text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-todo-primary mb-6">
            TaskMaster
          </h1>
          <p className="text-lg mb-6 text-foreground/80">
            The simple task management app that helps you stay organized and boost your productivity.
          </p>

          <div className="bg-white rounded-lg shadow-md p-4 border mb-6">
            <div className="flex items-center gap-2 mb-2">
              {/* … your icons & bullets unchanged … */}
              <span className="font-medium">Create and organize tasks</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">Set priorities and deadlines</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Track progress and productivity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side (form) — unchanged layout */}
      <div className="sm:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="bg-background border rounded-lg p-1 inline-flex">
              <Link
                to="/auth?mode=login"
                className={`px-4 py-2 rounded-md ${mode === "login" ? "bg-todo-primary text-white" : ""}`}
                onClick={() => setMode("login")}
              >
                Log In
              </Link>
              <Link
                to="/auth?mode=register"
                className={`px-4 py-2 rounded-md ${mode === "register" ? "bg-todo-primary text-white" : ""}`}
                onClick={() => setMode("register")}
              >
                Register
              </Link>
            </div>
          </div>

          {mode === "login" ? (
            <LoginForm onSuccess={handleAuthSuccess} onSubmit={handleLoginSubmit} />
          ) : (
            <RegisterForm onSuccess={handleAuthSuccess} onSubmit={handleRegisterSubmit} />
          )}

          {mode === "login" ? (
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/auth?mode=register" className="text-todo-primary hover:underline" onClick={() => setMode("register")}>
                  Sign up
                </Link>
              </p>
            </div>
          ) : (
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/auth?mode=login" className="text-todo-primary hover:underline" onClick={() => setMode("login")}>
                  Log in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
