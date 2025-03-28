import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Building2, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  companyName: z.string().min(1, "Company name is required"),
  businessType: z.string().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      companyName: "",
      businessType: "",
    },
  });

  const onLoginSubmit = (data: LoginValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterValues) => {
    registerMutation.mutate(data);
  };

  // Redirect if user is already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 bg-primary rounded-lg text-white mb-4">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-800 font-heading">BizManager</h1>
            <p className="text-neutral-600 mt-2">The all-in-one platform for small & medium businesses</p>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>Sign in to your account to continue</CardDescription>
                </CardHeader>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Signing in..." : "Sign In"}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>Register your business to get started</CardDescription>
                </CardHeader>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your business name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="businessType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Type (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Retail, Restaurant, Service" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Choose a username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Create a password (min. 6 characters)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero section */}
      <div className="flex-1 bg-primary p-6 flex items-center justify-center hidden md:flex">
        <div className="max-w-md text-white">
          <Building2 className="h-16 w-16 mb-6" />
          <h2 className="text-3xl font-bold font-heading mb-4">
            All-in-one Business Management Solution
          </h2>
          <p className="text-primary-foreground mb-6">
            Streamline your operations, enhance customer engagement, and manage your entire business with a single platform designed for small and medium businesses.
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-white/10 p-2 rounded mr-3">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Integrated Modules</h3>
                <p className="text-sm text-primary-foreground">CRM, HR, Accounting, Operations, and Marketplace all in one place.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-white/10 p-2 rounded mr-3">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Custom Customer Portal</h3>
                <p className="text-sm text-primary-foreground">Generate a unique web link for your customers to access services.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-white/10 p-2 rounded mr-3">
                <ArrowRight className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Scale With Ease</h3>
                <p className="text-sm text-primary-foreground">Our platform grows with your business, from startup to established enterprise.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
