import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Mock RUL distribution data
const rulDistribution = [
  { range: '0-15', count: 63, label: 'Critical', color: '#ef4444' },
  { range: '16-30', count: 89, label: 'High Risk', color: '#f97316' },
  { range: '31-45', count: 124, label: 'Medium Risk', color: '#eab308' },
  { range: '46-60', count: 156, label: 'Low Risk', color: '#84cc16' },
  { range: '61-90', count: 198, label: 'Normal', color: '#22c55e' },
  { range: '91-120', count: 145, label: 'Good', color: '#16a34a' },
  { range: '120+', count: 89, label: 'Excellent', color: '#15803d' }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{`RUL Range: ${label} cycles`}</p>
        <p className="text-sm text-muted-foreground">{`Status: ${data.label}`}</p>
        <p className="text-sm">
          <span className="font-medium text-blue-600">{data.count}</span> engines
        </p>
        <p className="text-xs text-muted-foreground">
          {((data.count / 864) * 100).toFixed(1)}% of fleet
        </p>
      </div>
    );
  }
  return null;
};

export function RULDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>RUL Distribution Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">
          Fleet remaining useful life distribution across risk categories
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rulDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="range" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {rulDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Statistics */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-xl font-bold text-red-600">63</p>
            <p className="text-xs text-red-700">Critical Engines</p>
            <p className="text-xs text-muted-foreground">≤15 cycles</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-xl font-bold text-yellow-600">369</p>
            <p className="text-xs text-yellow-700">At Risk Engines</p>
            <p className="text-xs text-muted-foreground">16-60 cycles</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xl font-bold text-green-600">432</p>
            <p className="text-xs text-green-700">Healthy Engines</p>
            <p className="text-xs text-muted-foreground">&gt;60 cycles</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}