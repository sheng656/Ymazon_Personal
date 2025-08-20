import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AlertTriangle, Clock, Wrench, Eye, Calendar, DollarSign, Users, Package } from "lucide-react";

// Generate maintenance data
const generateMaintenanceData = () => {
  const engines = [];
  
  // Emergency maintenance (RUL < 15)
  for (let i = 1; i <= 15; i++) {
    const rul = Math.floor(Math.random() * 14) + 1;
    engines.push({
      id: `E-${String(i).padStart(3, '0')}`,
      rul: rul,
      priority: 'critical',
      failureType: Math.random() > 0.5 ? 'HPC Degradation' : 'Fan Fault',
      failureProbability15: 80 + Math.random() * 15,
      failureProbability30: 85 + Math.random() * 10,
      failureProbability60: 90 + Math.random() * 8,
      recommendedAction: 'HPC blade inspection and replacement',
      suggestedCycle: Math.max(1, rul - 2),
      estimatedCost: 15000 + Math.random() * 10000,
      estimatedHours: 18 + Math.random() * 12
    });
  }

  // Planned maintenance (15 ≤ RUL ≤ 60)
  for (let i = 16; i <= 45; i++) {
    const rul = Math.floor(Math.random() * 45) + 15;
    engines.push({
      id: `E-${String(i).padStart(3, '0')}`,
      rul: rul,
      priority: 'planned',
      failureType: Math.random() > 0.5 ? 'HPC Degradation' : 'HPC+Fan Degradation',
      failureProbability15: Math.random() * 20,
      failureProbability30: 20 + Math.random() * 40,
      failureProbability60: 40 + Math.random() * 30,
      recommendedAction: 'Preventive maintenance inspection',
      suggestedCycle: Math.max(5, rul - 10),
      estimatedCost: 8000 + Math.random() * 7000,
      estimatedHours: 8 + Math.random() * 8
    });
  }

  // Monitoring (RUL > 60, but requiring special attention)
  for (let i = 46; i <= 55; i++) {
    const rul = Math.floor(Math.random() * 80) + 61;
    engines.push({
      id: `E-${String(i).padStart(3, '0')}`,
      rul: rul,
      priority: 'monitor',
      failureType: 'HPC Degradation',
      failureProbability15: Math.random() * 10,
      failureProbability30: Math.random() * 15,
      failureProbability60: 10 + Math.random() * 20,
      recommendedAction: 'Continue monitoring sensor data',
      suggestedCycle: rul - 20,
      estimatedCost: 2000 + Math.random() * 3000,
      estimatedHours: 2 + Math.random() * 4
    });
  }

  return engines;
};

// Maintenance workload prediction data
const maintenanceWorkloadData = [
  { period: '1-15 cycles', critical: 15, planned: 8, preventive: 3, total: 26 },
  { period: '16-30 cycles', critical: 8, planned: 22, preventive: 12, total: 42 },
  { period: '31-60 cycles', critical: 3, planned: 15, preventive: 28, total: 46 }
];

export function Maintenance() {
  const [engines] = useState(generateMaintenanceData());
  const [timeRange, setTimeRange] = useState('60');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [maintenanceType, setMaintenanceType] = useState('all');

  const filteredEngines = engines.filter(engine => {
    const matchesPriority = priorityFilter === 'all' || engine.priority === priorityFilter;
    const matchesType = maintenanceType === 'all' || 
      (maintenanceType === 'preventive' && engine.priority === 'monitor') ||
      (maintenanceType === 'predictive' && engine.priority === 'planned') ||
      (maintenanceType === 'emergency' && engine.priority === 'critical');
    
    return matchesPriority && matchesType;
  });

  const criticalEngines = filteredEngines.filter(e => e.priority === 'critical');
  const plannedEngines = filteredEngines.filter(e => e.priority === 'planned');
  const monitorEngines = filteredEngines.filter(e => e.priority === 'monitor');

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical': return <Badge variant="destructive">🚨 Emergency</Badge>;
      case 'planned': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⚠️ Planned</Badge>;
      case 'monitor': return <Badge className="bg-green-100 text-green-800 border-green-200">👁️ Monitor</Badge>;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-50 border-red-200';
      case 'planned': return 'bg-yellow-50 border-yellow-200';
      case 'monitor': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  // Statistics
  const stats = {
    immediate: criticalEngines.length,
    next15: engines.filter(e => e.priority === 'critical').length,
    next30: engines.filter(e => e.priority === 'critical' || e.priority === 'planned').length,
    next60: engines.length,
    totalCost: engines.reduce((sum, e) => sum + e.estimatedCost, 0),
    totalHours: engines.reduce((sum, e) => sum + e.estimatedHours, 0),
    preventedFailures: criticalEngines.length + Math.floor(plannedEngines.length * 0.3)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Operations Section */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Plan Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">Next 15 cycles</SelectItem>
                <SelectItem value="30">Next 30 cycles</SelectItem>
                <SelectItem value="60">Next 60 cycles</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="critical">Emergency</SelectItem>
                <SelectItem value="planned">Warning</SelectItem>
                <SelectItem value="monitor">Normal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={maintenanceType} onValueChange={setMaintenanceType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Maintenance Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="predictive">Predictive</SelectItem>
                <SelectItem value="preventive">Preventive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Upper Section - Maintenance Priority Queue (60%) */}
        <div className="xl:col-span-3 space-y-6">
          {/* Emergency Maintenance Section */}
          {criticalEngines.length > 0 && (
            <Card className="border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-red-800 flex items-center gap-2">
                  🚨 Emergency Maintenance (RUL &lt; 15 cycles)
                </CardTitle>
                <p className="text-sm text-red-700">Engines requiring immediate maintenance</p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {criticalEngines.slice(0, 5).map((engine) => (
                    <Card key={engine.id} className="border-red-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-lg">{engine.id}</h4>
                            <div className="text-2xl font-bold text-red-600 flex items-center gap-2">
                              <Clock className="w-5 h-5" />
                              RUL: {engine.rul} cycles
                            </div>
                          </div>
                          {getPriorityBadge(engine.priority)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">Predicted Failure Type:</span>
                            <p className="font-medium">{engine.failureType}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Recommended Maintenance Time:</span>
                            <p className="font-medium text-red-600">Complete by cycle {engine.suggestedCycle}</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <span className="text-sm text-muted-foreground">Failure Probability:</span>
                          <div className="flex gap-4 text-sm mt-1">
                            <span>15 cycles: <strong className="text-red-600">{engine.failureProbability15.toFixed(1)}%</strong></span>
                            <span>30 cycles: <strong className="text-red-600">{engine.failureProbability30.toFixed(1)}%</strong></span>
                            <span>60 cycles: <strong className="text-red-600">{engine.failureProbability60.toFixed(1)}%</strong></span>
                          </div>
                        </div>

                        <div className="bg-red-50 p-3 rounded-lg mb-3">
                          <p className="text-sm">
                            <strong>Maintenance Recommendation:</strong> {engine.recommendedAction}
                          </p>
                          <p className="text-sm mt-1">
                            <strong>Estimated Cost:</strong> {formatCurrency(engine.estimatedCost)} | 
                            <strong> Estimated Hours:</strong> {engine.estimatedHours.toFixed(1)} hours
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="destructive" className="flex-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            Schedule Immediate Maintenance
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Planned Maintenance Section */}
          {plannedEngines.length > 0 && (
            <Card className="border-yellow-200">
              <CardHeader className="bg-yellow-50">
                <CardTitle className="text-yellow-800 flex items-center gap-2">
                  ⚠️ Planned Maintenance (15 ≤ RUL ≤ 60 cycles)
                </CardTitle>
                <p className="text-sm text-yellow-700">Engines recommended for preventive maintenance</p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {plannedEngines.slice(0, 3).map((engine) => (
                    <Card key={engine.id} className="border-yellow-200">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{engine.id} - RUL: {engine.rul} cycles</h4>
                          {getPriorityBadge(engine.priority)}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {engine.recommendedAction} | Est: {formatCurrency(engine.estimatedCost)}
                        </p>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            Schedule Maintenance
                          </Button>
                          <Button size="sm" variant="outline">
                            Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Monitoring Section */}
          {monitorEngines.length > 0 && (
            <Card className="border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-800 flex items-center gap-2">
                  👁️ Continuous Monitoring (RUL &gt; 60 cycles)
                </CardTitle>
                <p className="text-sm text-green-700">Engines requiring attention but no immediate maintenance</p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {monitorEngines.slice(0, 4).map((engine) => (
                    <div key={engine.id} className="p-3 border border-green-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{engine.id}</span>
                        <span className="text-sm text-green-600">RUL: {engine.rul}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{engine.recommendedAction}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Lower Section - Maintenance Statistics and Summary (40%) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Maintenance Workload Prediction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Maintenance Workload Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceWorkloadData.map((period) => {
                  const maxTotal = Math.max(...maintenanceWorkloadData.map(p => p.total));
                  const barHeight = (period.total / maxTotal) * 120;
                  
                  return (
                    <div key={period.period} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{period.period}</span>
                        <span className="text-sm text-muted-foreground">Total: {period.total} engines</span>
                      </div>
                      
                      <div className="relative">
                        <div 
                          className="bg-red-500 rounded-t"
                          style={{ height: `${(period.critical / period.total) * barHeight}px`, minHeight: '8px' }}
                        />
                        <div 
                          className="bg-yellow-500"
                          style={{ height: `${(period.planned / period.total) * barHeight}px`, minHeight: '8px' }}
                        />
                        <div 
                          className="bg-green-500 rounded-b"
                          style={{ height: `${(period.preventive / period.total) * barHeight}px`, minHeight: '8px' }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-red-600">Emergency: {period.critical}</span>
                        <span className="text-yellow-600">Planned: {period.planned}</span>
                        <span className="text-green-600">Preventive: {period.preventive}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Emergency</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>Planned</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Preventive</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Recommendations Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Maintenance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Overall Statistics */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Overall Statistics:</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span>Immediate maintenance needed:</span>
                      <strong className="text-red-600">{stats.immediate} engines</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>15-cycle maintenance needed:</span>
                      <strong>{stats.next15} engines</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>30-cycle maintenance needed:</span>
                      <strong>{stats.next30} engines</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>60-cycle maintenance needed:</span>
                      <strong>{stats.next60} engines</strong>
                    </div>
                  </div>
                </div>

                {/* Cost-Benefit Analysis */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Cost-Benefit Analysis:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Preventive maintenance can avoid:</span>
                      <strong className="text-green-600">{stats.preventedFailures} emergency failures</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated downtime cost savings:</span>
                      <strong className="text-green-600">{formatCurrency(stats.preventedFailures * 50000)}</strong>
                    </div>
                  </div>
                </div>

                {/* Resource Requirements */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Resource Requirements:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Estimated maintenance hours:</span>
                      <strong>{Math.round(stats.totalHours)} hours</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated total cost:</span>
                      <strong>{formatCurrency(stats.totalCost)}</strong>
                    </div>
                  </div>
                </div>

                {/* Major Parts List */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Parts Required:</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>HPC blade assemblies:</span>
                      <span>{criticalEngines.length} sets</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bearing assemblies:</span>
                      <span>{Math.ceil(plannedEngines.length * 0.6)} sets</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sensor kits:</span>
                      <span>{criticalEngines.length + plannedEngines.length} sets</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}