import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Activity, AlertTriangle, CheckCircle, Gauge } from "lucide-react";
import AnomalyDetection from './AnomalyDetection';

// Mock data - 708 engines
const generateEngineData = () => {
  const engines = [];
  for (let i = 1; i <= 708; i++) {
    const rul = Math.floor(Math.random() * 200) + 5;
    engines.push({
      id: i,
      rul: rul,
      status: rul > 60 ? 'healthy' : rul >= 15 ? 'warning' : 'critical'
    });
  }
  return engines;
};

const engines = generateEngineData();

// Fleet statistics
const fleetStats = {
  total: engines.length,
  healthy: engines.filter(e => e.status === 'healthy').length,
  warning: engines.filter(e => e.status === 'warning').length,
  critical: engines.filter(e => e.status === 'critical').length
};

// RUL distribution data
const rulDistribution = [
  { range: '0-15', count: engines.filter(e => e.rul >= 0 && e.rul <= 15).length, color: 'bg-red-500' },
  { range: '16-30', count: engines.filter(e => e.rul >= 16 && e.rul <= 30).length, color: 'bg-orange-500' },
  { range: '31-50', count: engines.filter(e => e.rul >= 31 && e.rul <= 50).length, color: 'bg-yellow-500' },
  { range: '51-100', count: engines.filter(e => e.rul >= 51 && e.rul <= 100).length, color: 'bg-blue-500' },
  { range: '>100', count: engines.filter(e => e.rul > 100).length, color: 'bg-green-500' }
];

// Future failure risk prediction data
const failureRiskData = [
  { period: '0-15 cycles', critical: 63, warning: 25, health: 45, total: 133 },
  { period: '16-30 cycles', critical: 45, warning: 67, health: 78, total: 190 },
  { period: '31-60 cycles', critical: 23, warning: 89, health: 123, total: 235 }
];

export function Dashboard() {
  const [selectedEngine, setSelectedEngine] = useState<number | null>(null);

  const getEngineColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const handleEngineClick = (engineId: number) => {
    setSelectedEngine(engineId);
    // Here you could navigate to a detailed engine view or open a modal
    console.log(`Clicked on Engine ${engineId}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Engines</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetStats.total}</div>
            <p className="text-xs text-muted-foreground">
              Currently monitored engines
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy Engines</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{fleetStats.healthy}</div>
            <p className="text-xs text-muted-foreground">
              RUL &gt; 60 cycles
            </p>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                {((fleetStats.healthy / fleetStats.total) * 100).toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning Engines</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{fleetStats.warning}</div>
            <p className="text-xs text-muted-foreground">
              15 ≤ RUL ≤ 60 cycles
            </p>
            <div className="mt-2">
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                {((fleetStats.warning / fleetStats.total) * 100).toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Engines</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{fleetStats.critical}</div>
            <p className="text-xs text-muted-foreground">
              RUL &lt; 15 cycles
            </p>
            <div className="mt-2">
              <Badge variant="destructive">
                {((fleetStats.critical / fleetStats.total) * 100).toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Row: Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Anomaly Detection */}
        <AnomalyDetection />

        {/* Right - Failure Risk Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Failure Risk Timeline</CardTitle>
            <p className="text-sm text-muted-foreground">
              Predicted failure engine count in next 60 cycles
            </p>
          </CardHeader>
          <CardContent>
            {/* Failure Risk Timeline */}
            <div>
              <div className="space-y-3">
                {failureRiskData.map((period) => {
                  const criticalPct = (period.critical / period.total) * 100;
                  const warningPct = (period.warning / period.total) * 100;
                  const healthPct = (period.health / period.total) * 100;

                  return (
                    <div key={period.period} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">{period.period}</span>
                        <span className="text-xs text-muted-foreground">{period.total} engines</span>
                      </div>
                      <div className="relative h-4 bg-gray-100 rounded overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full bg-red-500"
                          style={{ width: `${criticalPct}%` }}
                        />
                        <div
                          className="absolute left-0 top-0 h-full bg-yellow-500"
                          style={{ left: `${criticalPct}%`, width: `${warningPct}%` }}
                        />
                        <div
                          className="absolute left-0 top-0 h-full bg-green-500"
                          style={{ left: `${criticalPct + warningPct}%`, width: `${healthPct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-red-600">Critical: {period.critical}</span>
                        <span className="text-yellow-600">Warning: {period.warning}</span>
                        <span className="text-green-600">Health: {period.health}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}