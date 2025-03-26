import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import GlassCard from "@/components/GlassCard";
import AnimatedTitle from "@/components/AnimatedTitle";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, register } = useAuth();
  const { toast } = useToast();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/account");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast({
        title: "Validation error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoggingIn(true);

    try {
      const success = await login(loginEmail, loginPassword);
      if (success) {
        navigate("/account");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !registerName ||
      !registerEmail ||
      !registerPassword ||
      !registerConfirmPassword
    ) {
      toast({
        title: "Validation error",
        description: "Please fill out all fields",
        variant: "destructive",
      });
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      toast({
        title: "Validation error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsRegistering(true);

    try {
      const success = await register(
        registerName,
        registerEmail,
        registerPassword
      );
      if (success) {
        navigate("/account");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <AnimatedTitle subtitle="User Authentication">
          Sign In / Sign Up
        </AnimatedTitle>

        <div className="max-w-md mx-auto">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <GlassCard>
                <form onSubmit={handleLogin}>
                  <h3 className="text-xl font-semibold mb-6">
                    Sign In to Your Account
                  </h3>

                  <div className="grid gap-6 mb-6">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full"
                  >
                    {isLoggingIn ? "Signing In..." : "Sign In"}
                  </Button>

                  <p className="text-center text-white/50 mt-4 text-sm">
                    For demo: Use email 'demo@example.com' and password
                    'password123'
                  </p>
                </form>
              </GlassCard>
            </TabsContent>

            <TabsContent value="register">
              <GlassCard>
                <form onSubmit={handleRegister}>
                  <h3 className="text-xl font-semibold mb-6">
                    Create an Account
                  </h3>

                  <div className="grid gap-6 mb-6">
                    <div>
                      <Label htmlFor="register-name">Name</Label>
                      <Input
                        id="register-name"
                        type="text"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder="Enter your name"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="Choose a password"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="register-confirm-password">
                        Confirm Password
                      </Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        value={registerConfirmPassword}
                        onChange={(e) =>
                          setRegisterConfirmPassword(e.target.value)
                        }
                        placeholder="Confirm your password"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full"
                  >
                    {isRegistering ? "Creating Account..." : "Sign Up"}
                  </Button>
                </form>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
