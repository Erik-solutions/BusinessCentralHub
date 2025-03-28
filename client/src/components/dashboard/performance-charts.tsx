import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  XAxis
} from "recharts";

interface SalesData {
  name: string;
  value: number;
}

interface CustomerSegment {
  name: string;
  value: number;
  color: string;
}

interface PerformanceChartsProps {
  salesData: SalesData[];
  customerSegments: CustomerSegment[];
}

export function PerformanceCharts({ salesData, customerSegments }: PerformanceChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Monthly Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <XAxis 
                  dataKey="name" 
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  tickMargin={8}
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Sales']}
                  contentStyle={{ 
                    borderRadius: '0.5rem',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  }}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Customer Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerSegments}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {customerSegments.map((segment, index) => (
                      <Cell key={`cell-${index}`} fill={segment.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, '']}
                    contentStyle={{ 
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center">
              {customerSegments.map((segment, index) => (
                <div key={index} className="flex items-center mb-2">
                  <span 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: segment.color }}
                  ></span>
                  <span className="text-xs text-neutral-600">{segment.name} ({segment.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
