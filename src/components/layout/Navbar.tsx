
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  // Mock authentication state (will be replaced with real auth)
  const isAuthenticated = false; 

  return (
    <header className="border-b border-border bg-background sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-todo-primary font-bold text-2xl">TaskMaster</div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground/80 hover:text-foreground">
            Home
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="text-foreground/80 hover:text-foreground">
              Dashboard
            </Link>
          )}
          <Link to="#features" className="text-foreground/80 hover:text-foreground">
            Features
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link to="/auth?mode=login">
                <Button variant="outline">Log In</Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button className="bg-todo-primary hover:bg-todo-primary/90">Sign Up</Button>
              </Link>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => console.log("Logout")}
                className="text-foreground/80 hover:text-foreground"
              >
                Log out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
