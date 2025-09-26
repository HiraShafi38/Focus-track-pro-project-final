
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Organize your tasks,
                  <span className="block text-todo-primary">boost your productivity</span>
                </h1>
                <p className="text-xl text-foreground/80 max-w-md">
                  A simple, intuitive to-do list app that helps you stay focused and get things done.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/auth?mode=register">
                    <Button className="bg-todo-primary hover:bg-todo-primary/90 px-8 py-6 text-lg">
                      Get Started for Free
                    </Button>
                  </Link>
                  <Link to="/auth?mode=login">
                    <Button variant="outline" className="px-8 py-6 text-lg">
                      Log In
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="md:w-1/2 mt-10 md:mt-0">
                <div className="relative">
                  <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="h-4 w-4 rounded-full bg-todo-primary mr-2"></span>
                        <p className="font-medium">Complete project proposal</p>
                      </div>
                      <div className="flex items-center">
                        <span className="h-4 w-4 rounded-full bg-todo-warning mr-2"></span>
                        <p className="font-medium">Review team feedback</p>
                      </div>
                      <div className="flex items-center">
                        <span className="h-4 w-4 rounded-full bg-todo-success mr-2"></span>
                        <p className="font-medium">Schedule client meeting</p>
                      </div>
                      <div className="flex items-center opacity-50">
                        <span className="h-4 w-4 rounded-full bg-gray-300 mr-2"></span>
                        <p className="font-medium line-through">Update calendar</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-4 -right-4 bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm font-medium">
                    Productivity +35% this week!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4" id="features">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Features designed for <span className="text-todo-primary">focus</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background rounded-lg p-6 shadow-sm border">
                <div className="h-12 w-12 rounded-lg bg-todo-primary/10 text-todo-primary flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Task Organization</h3>
                <p className="text-foreground/80">
                  Organize your tasks by categories and priorities to stay focused on what matters most.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6 shadow-sm border">
                <div className="h-12 w-12 rounded-lg bg-todo-accent/10 text-todo-accent flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Due Dates</h3>
                <p className="text-foreground/80">
                  Set due dates for your tasks and get reminders to ensure you never miss a deadline.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6 shadow-sm border">
                <div className="h-12 w-12 rounded-lg bg-todo-success/10 text-todo-success flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Secure Access</h3>
                <p className="text-foreground/80">
                  Your tasks are private and securely stored. Only you can access your personal task list.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-todo-primary/5 py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to boost your productivity?
            </h2>
            <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of users who use TaskMaster to organize their work and personal life.
            </p>
            <Link to="/auth?mode=register">
              <Button className="bg-todo-primary hover:bg-todo-primary/90 px-8 py-6 text-lg">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-background border-t py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-todo-primary font-bold text-xl">TaskMaster</div>
              <p className="text-sm text-foreground/70">
                © {new Date().getFullYear()} TaskMaster. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-foreground/70 hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-foreground/70 hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-foreground/70 hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
