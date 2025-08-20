import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// Mock fault mode data
const datasetDistribution = [
  { name: 'FD001', value: 100, description: 'HPC Degradation Only', color: '#3b82f6' },
  { name: 'FD002', value: 259, description: 'HPC Degradation', color: '#10b981' },
  { name: 'FD003', value: 100, description: 'HPC + Fan Degradation', color: '#f59e0b' },
  { name: 'FD004', value: 249, description: 'HPC + Fan Degradation', color: '#ef4444' }
];

const faultModeDistribution = [
  { name: 'HPC Only', value: 359, color: '#6366f1', datasets: ['FD001', 'FD002'] },
  { name: 'HPC + Fan', value: 349, color: '#ec4899', datasets: ['FD003', 'FD004'] }
];

const conditionDistribution = [
  { name: 'Single Condition', value: 200, color: '#14b8a6', datasets: ['FD001', 'FD003'] },
  { name: 'Multiple Conditions', value: 508, color: '#f97316', datasets: ['FD002', 'FD004'] }
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm">Engines: <span className="font-medium text-blue-600">{data.value}</span></p>
        {data.description && <p className="text-xs text-muted-foreground">{data.description}</p>}
        {data.datasets && (
          <p className="text-xs text-muted-foreground">
            Datasets: {data.datasets.join(', ')}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function FaultModeAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fault Mode & Dataset Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribution of fault types and operational conditions across datasets
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Dataset Distribution */}
          <div>
            <h4 className="text-sm font-medium mb-3">Dataset Distribution</h4>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datasetDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {datasetDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {datasetDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">({item.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fault Mode Comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <h5 className="text-sm font-medium mb-2">Fault Modes</h5>
              <div className="space-y-2">
                {faultModeDistribution.map((mode) => (
                  <div key={mode.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: mode.color }}
                      ></div>
                      <span className="text-xs">{mode.name}</span>
                    </div>
                    <span className="text-xs font-medium">{mode.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 border rounded-lg">
              <h5 className="text-sm font-medium mb-2">Conditions</h5>
              <div className="space-y-2">
                {conditionDistribution.map((condition) => (
                  <div key={condition.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: condition.color }}
                      ></div>
                      <span className="text-xs">{condition.name}</span>
                    </div>
                    <span className="text-xs font-medium">{condition.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <h5 className="text-sm font-medium text-blue-900 mb-1">Key Insights</h5>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• 50.7% of engines experience HPC degradation only</li>
              <li>• 49.3% have combined HPC and Fan degradation</li>
              <li>• 71.8% operate under multiple flight conditions</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}