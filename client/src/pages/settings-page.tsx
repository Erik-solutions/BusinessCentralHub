import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { TopNavbar } from "@/components/ui/top-navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Save, UploadCloud, Building, User, Shield, Link, Copy } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Schemas for profile and password forms
const profileFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  businessType: z.string().optional(),
  webLink: z.string().optional(),
  logo: z.string().optional(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Profile form setup
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      companyName: user?.companyName || "",
      businessType: user?.businessType || "",
      webLink: user?.webLink || "",
      logo: user?.logo || "",
    },
  });

  // Password form setup
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const res = await apiRequest("PUT", "/api/profile", data);
      return await res.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Password update (this would need a proper backend endpoint)
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormValues) => {
      // This is a placeholder. In a real app, you would have an API endpoint for this
      const res = await apiRequest("PUT", "/api/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      passwordForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to update password",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    updatePasswordMutation.mutate(data);
  };

  const handleCopyWeblink = () => {
    const webLink = user?.webLink || `bizmanager.com/${user?.companyName?.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(webLink);
    toast({
      title: "Link copied",
      description: "Your customer web link has been copied to clipboard.",
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return "B";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-100">
      <Sidebar className={isSidebarOpen ? "translate-x-0" : ""} />
      
      <div className="flex-1">
        <TopNavbar 
          title="Settings" 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Column - User avatar and tabs */}
              <div className="w-full md:w-1/4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-24 w-24 mb-4">
                        {user?.logo ? (
                          <img src={user.logo} alt={user.companyName} />
                        ) : (
                          <AvatarFallback className="bg-primary text-white text-xl">
                            {getInitials(user?.companyName)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <h2 className="text-xl font-medium mb-1">{user?.companyName}</h2>
                      <p className="text-neutral-600 text-sm">{user?.businessType || "Business"}</p>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium mb-2">Customer Web Link</h3>
                      <div className="flex items-center bg-neutral-100 p-2 rounded-md">
                        <Link className="h-4 w-4 text-neutral-500 mr-2" />
                        <span className="text-xs text-neutral-600 truncate flex-1">
                          {user?.webLink || `bizmanager.com/${user?.companyName?.toLowerCase().replace(/\s+/g, '-')}`}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 ml-1"
                          onClick={handleCopyWeblink}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Tabs defaultValue="profile" className="mt-6">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              {/* Right Column - Settings content */}
              <div className="w-full md:w-3/4">
                <Tabs defaultValue="profile">
                  <TabsContent value="profile">
                    <Card>
                      <CardHeader>
                        <CardTitle>Business Profile</CardTitle>
                        <CardDescription>
                          Update your business information and settings
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...profileForm}>
                          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                            <FormField
                              control={profileForm.control}
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
                              control={profileForm.control}
                              name="businessType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Business Type</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Retail, Restaurant, Service" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    This helps categorize your business in our directory.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="webLink"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Custom Web Link</FormLabel>
                                  <FormControl>
                                    <Input placeholder="bizmanager.com/your-business" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Customize the URL your customers will use to access your services.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="logo"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company Logo URL</FormLabel>
                                  <FormControl>
                                    <div className="flex space-x-2">
                                      <Input placeholder="URL to your logo image" {...field} />
                                      <Button 
                                        type="button"
                                        variant="outline"
                                        className="whitespace-nowrap"
                                      >
                                        <UploadCloud className="h-4 w-4 mr-2" />
                                        Upload
                                      </Button>
                                    </div>
                                  </FormControl>
                                  <FormDescription>
                                    Enter a URL to your company logo, or upload an image.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button 
                              type="submit" 
                              disabled={updateProfileMutation.isPending}
                            >
                              {updateProfileMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="mr-2 h-4 w-4" />
                                  Save Changes
                                </>
                              )}
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="security">
                    <Card>
                      <CardHeader>
                        <CardTitle>Security Settings</CardTitle>
                        <CardDescription>
                          Update your account security and password
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium">Change Password</h3>
                            <p className="text-sm text-neutral-600 mt-1">
                              Ensure your account is using a secure password that you don't use elsewhere.
                            </p>
                          </div>
                          <Separator />
                          <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                              <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                      <Input type="password" placeholder="Enter your current password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                      <Input type="password" placeholder="Enter new password" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      Your password must be at least 6 characters long.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                      <Input type="password" placeholder="Confirm new password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button 
                                type="submit" 
                                disabled={updatePasswordMutation.isPending}
                              >
                                {updatePasswordMutation.isPending ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  <>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Update Password
                                  </>
                                )}
                              </Button>
                            </form>
                          </Form>
                        </div>
                        
                        <Separator className="my-6" />
                        
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium">Account Actions</h3>
                            <p className="text-sm text-neutral-600 mt-1">
                              Manage your account settings and preferences.
                            </p>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                            <div>
                              <h4 className="font-medium text-red-800">Delete Account</h4>
                              <p className="text-sm text-red-700">
                                Permanently delete your account and all associated data.
                              </p>
                            </div>
                            <Button variant="destructive">Delete Account</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
