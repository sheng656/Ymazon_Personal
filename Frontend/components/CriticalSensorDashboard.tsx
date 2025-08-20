import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Minus, Thermometer, Gauge, Zap, BarChart3 } from "lucide-react";

// Mock sensor data
const sensorData = [
  {
    id: 'sensor3',
    name: 'HPC Outlet Temperature',
    value: 1589.2,
    unit: '°R',
    normalRange: [1400, 1650],
    trend: 'up',
    trendValue: '+2.3%',
    status: 'warning',
    icon: Thermometer,
    description: 'High Pressure Compressor Temperature'
  },
  {
    id: 'sensor7',
    name: 'HPC Outlet Pressure',
    value: 553.8,
    unit: 'psia',
    normalRange: [450, 650],
    trend: 'down',
    trendValue: '-1.2%',
    status: 'normal',
    icon: Gauge,
    description: 'Combustion Chamber Pressure'
  },
  {
    id: 'sensor9',
    name: 'Physical Core Speed',
    value: 9068.5,
    unit: 'rpm',
    normalRange: [8500, 9500],
    trend: 'stable',
    trendValue: '0.1%',
    status: 'normal',
    icon: Zap,
    description: 'Core Engine Speed'
  },
  {
    id: 'sensor10',
    name: 'Engine Pressure Ratio',
    value: 1.317,
    unit: '',
    normalRange: [1.2, 1.5],
    trend: 'up',
    trendValue: '+0.8%',
    status: 'critical',
    icon: BarChart3,
    description: 'P50/P2 Pressure Ratio'
  }
];

export function CriticalSensorDashboard() {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-red-500" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-green-500" />;
      case 'stable': return <Minus className="w-3 h-3 text-gray-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical': return <Badge variant="destructive" className="text-xs">Critical</Badge>;
      case 'warning': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">Warning</Badge>;
      case 'normal': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">Normal</Badge>;
      default: return null;
    }
  };

  const getProgressValue = (value: number, range: number[]) => {
    const [min, max] = range;
    return Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'normal': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Critical Sensor Dashboard</CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time monitoring of key engine performance indicators
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {sensorData.map((sensor) => {
            const IconComponent = sensor.icon;
            const progressValue = getProgressValue(sensor.value, sensor.normalRange);
            
            return (
              <div key={sensor.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{sensor.name}</span>
                  </div>
                  {getStatusBadge(sensor.status)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {sensor.value.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">{sensor.unit}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{sensor.normalRange[0]}</span>
                      <span>{sensor.normalRange[1]}</span>
                    </div>
                    <Progress 
                      value={progressValue} 
                      className="h-2"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{sensor.description}</span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(sensor.trend)}
                    <span className="text-xs font-medium">{sensor.trendValue}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">System Alert</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Engine Pressure Ratio (Sensor 10) exceeds normal operating range. 
            Consider scheduling maintenance inspection for engines showing similar patterns.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}