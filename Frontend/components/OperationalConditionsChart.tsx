import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Mock operational conditions data
const conditionsData = [
  { condition: 1, name: 'Sea Level', altitude: 0, mach: 0, avgRUL: 95.2, engines: 178, color: '#3b82f6' },
  { condition: 2, name: 'Low Alt Cruise', altitude: 10, mach: 0.25, avgRUL: 87.3, engines: 145, color: '#10b981' },
  { condition: 3, name: 'High Speed Cruise', altitude: 20, mach: 0.7, avgRUL: 78.9, engines: 134, color: '#f59e0b' },
  { condition: 4, name: 'High Alt Reduced', altitude: 25, mach: 0.62, avgRUL: 82.1, engines: 98, color: '#ef4444' },
  { condition: 5, name: 'High Alt High Speed', altitude: 35, mach: 0.84, avgRUL: 73.6, engines: 89, color: '#8b5cf6' },
  { condition: 6, name: 'Maximum Alt', altitude: 42, mach: 0.84, avgRUL: 69.4, engines: 67, color: '#ec4899' }
];

// Generate scatter points for visualization
const scatterData = conditionsData.flatMap(condition => 
  Array.from({ length: Math.floor(condition.engines / 10) }, (_, i) => ({
    x: condition.altitude + (Math.random() - 0.5) * 3,
    y: condition.mach + (Math.random() - 0.5) * 0.05,
    rul: condition.avgRUL + (Math.random() - 0.5) * 20,
    condition: condition.name,
    conditionId: condition.condition,
    color: condition.color
  }))
);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{data.condition}</p>
        <p className="text-sm">Altitude: {data.x.toFixed(1)}k ft</p>
        <p className="text-sm">Mach: {data.y.toFixed(2)}</p>
        <p className="text-sm">RUL: <span className="font-medium text-blue-600">{data.rul.toFixed(0)}</span> cycles</p>
      </div>
    );
  }
  return null;
};

export function OperationalConditionsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Operational Conditions Impact</CardTitle>
        <p className="text-sm text-muted-foreground">
          Effect of flight conditions on engine degradation patterns
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Altitude" 
                unit="k ft"
                domain={[0, 45]}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Mach" 
                domain={[0, 1]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              {conditionsData.map((condition) => (
                <Scatter
                  key={condition.condition}
                  name={condition.name}
                  data={scatterData.filter(d => d.conditionId === condition.condition)}
                  fill={condition.color}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        {/* Conditions Summary */}
        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {conditionsData.map((condition) => (
              <div key={condition.condition} className="flex items-center gap-2 p-2 bg-muted rounded">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: condition.color }}
                ></div>
                <div className="flex-1">
                  <p className="font-medium">{condition.name}</p>
                  <p className="text-muted-foreground">Avg RUL: {condition.avgRUL} cycles</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}