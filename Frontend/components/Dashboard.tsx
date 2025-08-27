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

// Operational conditions distribution
const operationalConditions = [
  {
    name: 'Standard Training',
    description: 'Sea-level single environment operation',
    count: 178,
    color: '#3b82f6',
    emoji: '🌊',
    riskLevel: 'Low'
  },
  {
    name: 'Full Flight Envelope',
    description: 'Multi-altitude multi-speed environment',
    count: 177,
    color: '#10b981',
    emoji: '✈️',
    riskLevel: 'Medium'
  },
  {
    name: 'Complex Training',
    description: 'Sea-level multi-fault mode',
    count: 176,
    color: '#f59e0b',
    emoji: '⚠️',
    riskLevel: 'High'
  },
  {
    name: 'Severe Flight Conditions',
    description: 'Full envelope multi-fault risk',
    count: 177,
    color: '#ef4444',
    emoji: '🚨',
    riskLevel: 'Critical'
  }
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

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-blue-600 bg-blue-50';
      case 'High': return 'text-yellow-600 bg-yellow-50';
      case 'Critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
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

      {/* Main Dashboard Row: Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Anomaly Detection */}
        <AnomalyDetection />

        {/* Center - Failure Risk Timeline */}
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
        {/* Right - Operational Conditions Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle>Operational Conditions Monitoring</CardTitle>
            <p className="text-sm text-muted-foreground">
              Fleet distribution under different operational conditions
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Pie chart with SVG */}
              <div className="flex justify-center mb-4">
                <svg width="128" height="128" viewBox="0 0 128 128" className="transform -rotate-90">
                  {operationalConditions.map((condition, index) => {
                    const total = operationalConditions.reduce((sum, d) => sum + d.count, 0);
                    const percentage = condition.count / total;
                    const startAngle = operationalConditions.slice(0, index).reduce((sum, d) => sum + (d.count / total) * 360, 0);
                    const endAngle = startAngle + (percentage * 360);

                    // Calculate path for pie slice
                    const centerX = 64;
                    const centerY = 64;
                    const radius = 56;

                    const startAngleRad = (startAngle * Math.PI) / 180;
                    const endAngleRad = (endAngle * Math.PI) / 180;

                    const x1 = centerX + radius * Math.cos(startAngleRad);
                    const y1 = centerY + radius * Math.sin(startAngleRad);
                    const x2 = centerX + radius * Math.cos(endAngleRad);
                    const y2 = centerY + radius * Math.sin(endAngleRad);

                    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

                    const pathData = [
                      `M ${centerX} ${centerY}`,
                      `L ${x1} ${y1}`,
                      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                      'Z'
                    ].join(' ');

                    return (
                      <path
                        key={condition.name}
                        d={pathData}
                        fill={condition.color}
                        stroke="white"
                        strokeWidth="1"
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                {operationalConditions.map((condition) => (
                  <div key={condition.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: condition.color }}
                      />
                      <span className="font-medium">{condition.emoji} {condition.name}</span>
                    </div>
                    <span>{condition.count} engines</span>
                  </div>
                ))}
              </div>

              {/* Detailed description */}
              <div className="mt-4 space-y-2 text-xs">
                {operationalConditions.map((condition) => (
                  <div key={condition.name} className="p-2 rounded border">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="flex items-center gap-1">
                        {condition.emoji} {condition.name}
                      </strong>
                      <Badge
                        variant="outline"
                        className={getRiskColor(condition.riskLevel)}
                      >
                        {condition.riskLevel} Risk
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{condition.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> Different operational conditions present varying levels of degradation risk.
                  Engines operating under severe flight conditions require more frequent monitoring and maintenance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}