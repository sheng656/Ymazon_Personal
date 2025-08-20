import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";

// Mock engine degradation data over time
const generateEngineData = (engineId: number, maxCycles: number) => {
  const data = [];
  for (let cycle = 1; cycle <= maxCycles; cycle++) {
    // Simulate sensor degradation over time
    const baseTemp = 1580 + Math.sin(cycle * 0.1) * 20 + (cycle / maxCycles) * 50;
    const basePressure = 550 + Math.sin(cycle * 0.15) * 30 + (cycle / maxCycles) * 30;
    const baseSpeed = 9100 - (cycle / maxCycles) * 200 + Math.sin(cycle * 0.08) * 100;
    const baseRatio = 1.3 + (cycle / maxCycles) * 0.1 + Math.sin(cycle * 0.12) * 0.05;
    
    data.push({
      cycle,
      [`engine${engineId}_temp`]: Math.max(1400, baseTemp + (Math.random() - 0.5) * 40),
      [`engine${engineId}_pressure`]: Math.max(400, basePressure + (Math.random() - 0.5) * 50),
      [`engine${engineId}_speed`]: Math.max(8000, baseSpeed + (Math.random() - 0.5) * 200),
      [`engine${engineId}_ratio`]: Math.max(1.1, baseRatio + (Math.random() - 0.5) * 0.1)
    });
  }
  return data;
};

const engines = [
  { id: 1, name: 'Engine 001', rul: 25, status: 'critical', maxCycles: 150, color: '#ef4444' },
  { id: 2, name: 'Engine 015', rul: 45, status: 'warning', maxCycles: 180, color: '#f59e0b' },
  { id: 3, name: 'Engine 032', rul: 78, status: 'normal', maxCycles: 200, color: '#22c55e' },
  { id: 4, name: 'Engine 067', rul: 12, status: 'critical', maxCycles: 120, color: '#dc2626' },
];

export function EngineTrendsChart() {
  const [selectedSensor, setSelectedSensor] = useState('temp');
  const [selectedEngines, setSelectedEngines] = useState([1, 2, 3]);

  // Combine data from all selected engines
  const maxCycles = Math.max(...engines.filter(e => selectedEngines.includes(e.id)).map(e => e.maxCycles));
  const combinedData = [];
  
  for (let cycle = 1; cycle <= maxCycles; cycle++) {
    const cycleData: any = { cycle };
    engines.filter(e => selectedEngines.includes(e.id)).forEach(engine => {
      const engineData = generateEngineData(engine.id, engine.maxCycles);
      if (cycle <= engine.maxCycles) {
        cycleData[`engine${engine.id}`] = engineData[cycle - 1]?.[`engine${engine.id}_${selectedSensor}`];
      }
    });
    combinedData.push(cycleData);
  }

  const sensorConfig = {
    temp: { name: 'HPC Temperature', unit: '°R', key: 'temp' },
    pressure: { name: 'HPC Pressure', unit: 'psia', key: 'pressure' },
    speed: { name: 'Core Speed', unit: 'rpm', key: 'speed' },
    ratio: { name: 'Pressure Ratio', unit: '', key: 'ratio' }
  };

  const toggleEngine = (engineId: number) => {
    setSelectedEngines(prev => 
      prev.includes(engineId) 
        ? prev.filter(id => id !== engineId)
        : [...prev, engineId]
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Engine Performance Degradation Trends</CardTitle>
            <p className="text-sm text-muted-foreground">
              Multi-engine comparison of sensor degradation over operational cycles
            </p>
          </div>
          <div className="flex gap-2">
            {Object.entries(sensorConfig).map(([key, config]) => (
              <Button
                key={key}
                variant={selectedSensor === key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSensor(key)}
              >
                {config.name}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Engine Selection */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Compare Engines:</span>
            {engines.map((engine) => (
              <Badge
                key={engine.id}
                variant={selectedEngines.includes(engine.id) ? "default" : "outline"}
                className={`cursor-pointer ${selectedEngines.includes(engine.id) ? '' : 'opacity-50'}`}
                onClick={() => toggleEngine(engine.id)}
              >
                {engine.name} (RUL: {engine.rul})
              </Badge>
            ))}
          </div>

          {/* Chart */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="cycle" 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Operational Cycles', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ value: sensorConfig[selectedSensor as keyof typeof sensorConfig].unit, angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    typeof value === 'number' ? value.toFixed(1) : value,
                    engines.find(e => name.includes(e.id.toString()))?.name || name
                  ]}
                  labelFormatter={(label) => `Cycle: ${label}`}
                />
                <Legend />
                {engines.filter(e => selectedEngines.includes(e.id)).map((engine) => (
                  <Line
                    key={engine.id}
                    type="monotone"
                    dataKey={`engine${engine.id}`}
                    stroke={engine.color}
                    strokeWidth={2}
                    dot={false}
                    name={engine.name}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Analysis Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <h5 className="text-sm font-medium text-red-900">Critical Trend</h5>
              <p className="text-xs text-red-800 mt-1">
                Engine 001 & 067 show rapid degradation in the last 30 cycles
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <h5 className="text-sm font-medium text-yellow-900">Warning Pattern</h5>
              <p className="text-xs text-yellow-800 mt-1">
                Engine 015 exhibits consistent decline but within manageable range
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h5 className="text-sm font-medium text-green-900">Normal Operation</h5>
              <p className="text-xs text-green-800 mt-1">
                Engine 032 maintains stable performance with minor variations
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}