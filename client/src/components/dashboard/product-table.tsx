import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Product {
  id: string;
  name: string;
  image?: string;
  category: string;
  sales: number;
  revenue: string;
  conversion: number;
}

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Sales</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Conversion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 rounded bg-neutral-100 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-10 w-10 rounded object-cover" 
                      />
                    ) : (
                      <div className="h-10 w-10 flex items-center justify-center bg-primary/10 text-primary font-medium">
                        {product.name.substring(0, 2)}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-neutral-800">{product.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-neutral-600">{product.category}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-neutral-800">{product.sales}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-neutral-800">{product.revenue}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className="w-16 bg-neutral-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-primary rounded-full h-2" 
                      style={{ width: `${product.conversion}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-neutral-600">{product.conversion}%</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
