import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { TopNavbar } from "@/components/ui/top-navbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, PlusIcon, Search, Tag, Grid3X3, Package, Banknote, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema } from "@shared/schema";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Create a form schema based on product schema
const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional().or(z.literal("")),
  price: z.string().min(1, "Price is required"),
  category: z.string().optional().or(z.literal("")),
  inventory: z.string().optional().transform(val => val ? parseInt(val) : 0),
  image: z.string().optional().or(z.literal("")),
  isPublished: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function MarketplacePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch products data
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Form setup
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      inventory: "0",
      image: "",
      isPublished: true,
    },
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const res = await apiRequest("POST", "/api/products", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Product added",
        description: "New product has been added successfully.",
      });
      setIsAddProductDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to add product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    createProductMutation.mutate(data);
  };

  // Get unique categories for filter
  const categories = products 
    ? Array.from(new Set(products.map(product => product.category).filter(Boolean)))
    : [];

  // Filter products based on search query and category
  const filteredProducts = products?.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-100">
      <Sidebar className={isSidebarOpen ? "translate-x-0" : ""} />
      
      <div className="flex-1">
        <TopNavbar 
          title="Marketplace" 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-2xl font-semibold text-neutral-800">Product Marketplace</h1>
                  <p className="text-neutral-600">Manage and showcase your products to customers</p>
                </div>
                <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                      <DialogDescription>
                        Enter the product details to add to your marketplace.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter product name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Product description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price *</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. 19.99" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Electronics, Clothing" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="inventory"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Inventory</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="Quantity in stock" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Image URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="URL to product image" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="isPublished"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Publish Product</FormLabel>
                                <FormDescription>
                                  Make this product visible in your marketplace
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button 
                            type="submit" 
                            disabled={createProductMutation.isPending}
                          >
                            {createProductMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                              </>
                            ) : "Add Product"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Select 
                  onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category, index) => (
                      <SelectItem key={index} value={category || ""}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant={viewMode === "grid" ? "default" : "outline"} 
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "default" : "outline"} 
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <ShoppingBag className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products Display */}
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredProducts && filteredProducts.length > 0 ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {filteredProducts.map((product) => (
                        <Card key={product.id} className="overflow-hidden">
                          <div className="h-40 bg-neutral-200 relative">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Package className="h-12 w-12 text-neutral-400" />
                              </div>
                            )}
                            {!product.isPublished && (
                              <div className="absolute top-2 left-2">
                                <Badge variant="secondary">Draft</Badge>
                              </div>
                            )}
                            {product.category && (
                              <div className="absolute bottom-2 left-2">
                                <Badge variant="outline" className="bg-white/80">
                                  {product.category}
                                </Badge>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium text-lg">{product.name}</h3>
                            <div className="flex items-center mt-2">
                              <Banknote className="h-4 w-4 text-neutral-500 mr-1" />
                              <span className="font-medium text-neutral-800">${product.price}</span>
                            </div>
                            {product.description && (
                              <p className="text-neutral-600 text-sm mt-2 line-clamp-2">
                                {product.description}
                              </p>
                            )}
                          </CardContent>
                          <CardFooter className="border-t p-4 flex justify-between">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm">View</Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredProducts.map((product) => (
                        <Card key={product.id}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center">
                              <div className="w-full md:w-16 h-16 bg-neutral-200 rounded flex-shrink-0 mb-4 md:mb-0 md:mr-4 flex items-center justify-center overflow-hidden">
                                {product.image ? (
                                  <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Package className="h-8 w-8 text-neutral-400" />
                                )}
                              </div>
                              <div className="flex-grow">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-medium">{product.name}</h3>
                                    {product.description && (
                                      <p className="text-neutral-600 text-sm mt-1">
                                        {product.description}
                                      </p>
                                    )}
                                    <div className="flex items-center mt-2 space-x-2">
                                      <span className="font-medium text-neutral-800">${product.price}</span>
                                      {product.category && (
                                        <Badge variant="outline">
                                          {product.category}
                                        </Badge>
                                      )}
                                      {!product.isPublished && (
                                        <Badge variant="secondary">Draft</Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">Edit</Button>
                                    <Button variant="ghost" size="sm">View</Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Tag className="h-12 w-12 text-neutral-300 mb-4" />
                    <h3 className="text-lg font-medium text-neutral-800 mb-1">No products found</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      {searchQuery || selectedCategory ? 
                        "No products match your search criteria" : 
                        "Start adding products to your marketplace"}
                    </p>
                    {searchQuery || selectedCategory ? (
                      <Button variant="outline" onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory(null);
                      }}>Clear Filters</Button>
                    ) : (
                      <Button onClick={() => setIsAddProductDialogOpen(true)}>Add Your First Product</Button>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="published">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className={viewMode === "grid" ? 
                    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : 
                    "space-y-4"
                  }>
                    {filteredProducts
                      ?.filter(product => product.isPublished)
                      .map((product) => (
                        viewMode === "grid" ? (
                          <Card key={product.id} className="overflow-hidden">
                            <div className="h-40 bg-neutral-200 relative">
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Package className="h-12 w-12 text-neutral-400" />
                                </div>
                              )}
                              {product.category && (
                                <div className="absolute bottom-2 left-2">
                                  <Badge variant="outline" className="bg-white/80">
                                    {product.category}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-medium text-lg">{product.name}</h3>
                              <div className="flex items-center mt-2">
                                <Banknote className="h-4 w-4 text-neutral-500 mr-1" />
                                <span className="font-medium text-neutral-800">${product.price}</span>
                              </div>
                              {product.description && (
                                <p className="text-neutral-600 text-sm mt-2 line-clamp-2">
                                  {product.description}
                                </p>
                              )}
                            </CardContent>
                            <CardFooter className="border-t p-4 flex justify-between">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm">View</Button>
                            </CardFooter>
                          </Card>
                        ) : (
                          <Card key={product.id}>
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row md:items-center">
                                <div className="w-full md:w-16 h-16 bg-neutral-200 rounded flex-shrink-0 mb-4 md:mb-0 md:mr-4 flex items-center justify-center overflow-hidden">
                                  {product.image ? (
                                    <img 
                                      src={product.image} 
                                      alt={product.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Package className="h-8 w-8 text-neutral-400" />
                                  )}
                                </div>
                                <div className="flex-grow">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="font-medium">{product.name}</h3>
                                      {product.description && (
                                        <p className="text-neutral-600 text-sm mt-1">
                                          {product.description}
                                        </p>
                                      )}
                                      <div className="flex items-center mt-2 space-x-2">
                                        <span className="font-medium text-neutral-800">${product.price}</span>
                                        {product.category && (
                                          <Badge variant="outline">
                                            {product.category}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button variant="outline" size="sm">Edit</Button>
                                      <Button variant="ghost" size="sm">View</Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="draft">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className={viewMode === "grid" ? 
                    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : 
                    "space-y-4"
                  }>
                    {filteredProducts
                      ?.filter(product => !product.isPublished)
                      .map((product) => (
                        viewMode === "grid" ? (
                          <Card key={product.id} className="overflow-hidden">
                            <div className="h-40 bg-neutral-200 relative">
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Package className="h-12 w-12 text-neutral-400" />
                                </div>
                              )}
                              <div className="absolute top-2 left-2">
                                <Badge variant="secondary">Draft</Badge>
                              </div>
                              {product.category && (
                                <div className="absolute bottom-2 left-2">
                                  <Badge variant="outline" className="bg-white/80">
                                    {product.category}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-medium text-lg">{product.name}</h3>
                              <div className="flex items-center mt-2">
                                <Banknote className="h-4 w-4 text-neutral-500 mr-1" />
                                <span className="font-medium text-neutral-800">${product.price}</span>
                              </div>
                              {product.description && (
                                <p className="text-neutral-600 text-sm mt-2 line-clamp-2">
                                  {product.description}
                                </p>
                              )}
                            </CardContent>
                            <CardFooter className="border-t p-4 flex justify-between">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm">View</Button>
                            </CardFooter>
                          </Card>
                        ) : (
                          <Card key={product.id}>
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row md:items-center">
                                <div className="w-full md:w-16 h-16 bg-neutral-200 rounded flex-shrink-0 mb-4 md:mb-0 md:mr-4 flex items-center justify-center overflow-hidden">
                                  {product.image ? (
                                    <img 
                                      src={product.image} 
                                      alt={product.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Package className="h-8 w-8 text-neutral-400" />
                                  )}
                                </div>
                                <div className="flex-grow">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="font-medium">{product.name}</h3>
                                      {product.description && (
                                        <p className="text-neutral-600 text-sm mt-1">
                                          {product.description}
                                        </p>
                                      )}
                                      <div className="flex items-center mt-2 space-x-2">
                                        <span className="font-medium text-neutral-800">${product.price}</span>
                                        {product.category && (
                                          <Badge variant="outline">
                                            {product.category}
                                          </Badge>
                                        )}
                                        <Badge variant="secondary">Draft</Badge>
                                      </div>
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button variant="outline" size="sm">Edit</Button>
                                      <Button variant="ghost" size="sm">View</Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
