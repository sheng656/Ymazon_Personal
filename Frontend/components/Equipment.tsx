import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Search, Filter, Eye, Wrench, Calendar, Thermometer, Gauge, Zap, BarChart3, Brain, AlertTriangle, TrendingUp, Cpu, Activity } from "lucide-react";
import { useState } from "react";

// Mock engine data
const generateEngineData = () => {
  const engines = [];
  const datasets = ['FD001', 'FD002', 'FD003', 'FD004'];
  
  for (let i = 1; i <= 50; i++) {
    const rul = Math.floor(Math.random() * 150) + 5;
    const label1 = rul <= 60 ? 1 : 0;
    const label2 = rul <= 15 ? 2 : (label1 === 1 ? (Math.random() > 0.7 ? 1 : 0) : 0);
    const dataset = datasets[Math.floor(Math.random() * 4)];
    
    engines.push({
      id: i,
      rul,
      label1,
      label2,
      dataset,
      condition: Math.floor(Math.random() * 6) + 1,
      status: label2 === 2 ? 'critical' : label1 === 1 ? 'warning' : 'normal',
      currentCycle: Math.floor(Math.random() * 200) + 50,
      totalCycles: Math.floor(Math.random() * 300) + 150,
      lastUpdate: new Date(Date.now() - Math.random() * 86400000).toLocaleString(),
      sensors: {
        sensor3: 1580 + Math.random() * 100 - 50, // HPC Temperature
        sensor9: 9000 + Math.random() * 200 - 100, // Core Speed
        sensor10: 1.3 + Math.random() * 0.3 - 0.15, // Pressure Ratio
        sensor20: 38 + Math.random() * 10 - 5 // Cool Air Flow
      },
      faultMode: dataset.includes('1') || dataset.includes('2') ? 'HPC Degradation' : 'HPC + Fan Degradation',
      healthScore: Math.floor(Math.random() * 100),
      predictedFailureMode: Math.random() > 0.5 ? 'Bearing Wear' : 'Sensor Drift',
      confidenceLevel: 85 + Math.random() * 10
    });
  }
  
  return engines.sort((a, b) => a.rul - b.rul);
};

// Mock AI analysis data
const aiAnalysis = {
  fleetHealth: {
    overall: 78,
    trend: 'stable',
    criticalEngines: 8,
    recommendedActions: [
      'Schedule maintenance for 3 engines with RUL < 20 cycles',
      'Monitor sensor drift patterns in FD003 dataset engines',
      'Update prediction models with latest performance data'
    ]
  },
  predictionAccuracy: {
    last30Days: 87.3,
    trend: 'improving',
    modelConfidence: 92.1
  },
  anomalyDetection: [
    {
      engineId: 'E-045',
      anomaly: 'Unusual temperature pattern in sensor 3',
      severity: 'medium',
      recommendation: 'Schedule thermal inspection'
    },
    {
      engineId: 'E-123', 
      anomaly: 'Core speed fluctuation detected',
      severity: 'high',
      recommendation: 'Immediate diagnostic required'
    }
  ],
  maintenanceOptimization: {
    suggestedSchedule: 'Batch maintenance for engines E-001, E-007, E-012',
    costSavings: '$15,400',
    efficiency: '+12% maintenance efficiency'
  }
};

export function Equipment() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [datasetFilter, setDatasetFilter] = useState('all');
  const [selectedEngine, setSelectedEngine] = useState<any>(null);
  const [engines] = useState(generateEngineData());

  const filteredEngines = engines.filter(engine => {
    const matchesSearch = engine.id.toString().includes(searchTerm) || 
                         engine.dataset.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || engine.status === statusFilter;
    const matchesDataset = datasetFilter === 'all' || engine.dataset === datasetFilter;
    
    return matchesSearch && matchesStatus && matchesDataset;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'warning': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Warning</Badge>;
      case 'normal': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Normal</Badge>;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'normal': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Top Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search engines by ID or dataset..." 
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Health Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>

          <Select value={datasetFilter} onValueChange={setDatasetFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Dataset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Datasets</SelectItem>
              <SelectItem value="FD001">FD001</SelectItem>
              <SelectItem value="FD002">FD002</SelectItem>
              <SelectItem value="FD003">FD003</SelectItem>
              <SelectItem value="FD004">FD004</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
          <Badge variant="secondary">{filteredEngines.length} engines found</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left: Engine Cards Grid - Limited Height */}
        <div className="xl:col-span-2 space-y-4">
          <h3 className="font-medium">Engine Fleet Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px] overflow-y-auto border rounded-lg p-4">
            {filteredEngines.slice(0, 20).map((engine) => (
              <Card 
                key={engine.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(engine.status)} ${selectedEngine?.id === engine.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedEngine(engine)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Engine {engine.id.toString().padStart(3, '0')}</CardTitle>
                    {getStatusBadge(engine.status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">{engine.dataset}</Badge>
                    <span>•</span>
                    <span>{engine.faultMode}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* RUL Display */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Remaining Useful Life</span>
                      <span className="text-2xl font-bold">{engine.rul}</span>
                    </div>
                    <Progress 
                      value={Math.max(0, (engine.rul / 150) * 100)} 
                      className="h-3"
                    />
                    <p className="text-xs text-muted-foreground mt-1">cycles remaining</p>
                  </div>

                  {/* Key Sensors */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-3 h-3 text-orange-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">HPC Temp</p>
                        <p className="text-sm font-medium">{engine.sensors.sensor3.toFixed(0)}°R</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-blue-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Core Speed</p>
                        <p className="text-sm font-medium">{engine.sensors.sensor9.toFixed(0)} rpm</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-3 h-3 text-green-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Press. Ratio</p>
                        <p className="text-sm font-medium">{engine.sensors.sensor10.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="w-3 h-3 text-purple-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Cool Air</p>
                        <p className="text-sm font-medium">{engine.sensors.sensor20.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Operation Info */}
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Cycle: {engine.currentCycle} / {engine.totalCycles}</p>
                    <p>Condition: {engine.condition} • Updated: {engine.lastUpdate}</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Wrench className="w-3 h-3 mr-1" />
                      Maintain
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredEngines.length > 20 && (
            <p className="text-sm text-muted-foreground text-center">
              Showing 20 of {filteredEngines.length} engines. Use filters to narrow results.
            </p>
          )}
        </div>

        {/* Middle: Detailed Engine View */}
        <div className="xl:col-span-1 space-y-4">
          {selectedEngine ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Engine {selectedEngine.id.toString().padStart(3, '0')} Analysis</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedEngine.status)}
                    <Badge variant="outline">{selectedEngine.dataset}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="health" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="health">Health</TabsTrigger>
                      <TabsTrigger value="sensors">Sensors</TabsTrigger>
                      <TabsTrigger value="trends">Trends</TabsTrigger>
                      <TabsTrigger value="ai">AI Insights</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="health" className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Engine ID</p>
                          <p className="font-medium">{selectedEngine.id}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Dataset</p>
                          <p className="font-medium">{selectedEngine.dataset}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">RUL</p>
                          <p className="font-medium">{selectedEngine.rul} cycles</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current Cycle</p>
                          <p className="font-medium">{selectedEngine.currentCycle}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Condition</p>
                          <p className="font-medium">{selectedEngine.condition}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Health Labels</p>
                          <p className="font-medium">L1: {selectedEngine.label1}, L2: {selectedEngine.label2}</p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="sensors" className="space-y-3">
                      {Object.entries(selectedEngine.sensors).map(([sensor, value]) => (
                        <div key={sensor} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{sensor}</span>
                          <span className="font-medium">{(value as number).toFixed(2)}</span>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="trends">
                      <p className="text-sm text-muted-foreground">
                        Trend analysis for Engine {selectedEngine.id} showing {selectedEngine.status} status 
                        with {selectedEngine.rul} cycles remaining.
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="ai">
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h5 className="text-sm font-medium text-blue-900">AI Recommendation</h5>
                          <p className="text-xs text-blue-800 mt-1">
                            {selectedEngine.status === 'critical' 
                              ? 'Schedule immediate maintenance inspection. Engine shows signs of advanced degradation.'
                              : selectedEngine.status === 'warning'
                              ? 'Plan maintenance within next 10-15 cycles. Monitor sensor readings closely.'
                              : 'Engine operating normally. Continue routine monitoring.'}
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h5 className="text-sm font-medium">Fault Prediction</h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            Primary fault mode: {selectedEngine.faultMode}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Select an engine to view detailed analysis</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Engine Intelligence Panel */}
        <div className="xl:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <CardTitle>Engine Intelligence Panel</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered fleet insights and predictions
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Fleet Health Overview */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Fleet Health Overview
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Health Score</span>
                    <div className="flex items-center gap-2">
                      <Progress value={aiAnalysis.fleetHealth.overall} className="w-16 h-2" />
                      <span className="text-sm font-medium">{aiAnalysis.fleetHealth.overall}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fleet Trend</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {aiAnalysis.fleetHealth.trend}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Critical Engines</span>
                    <Badge variant="destructive">
                      {aiAnalysis.fleetHealth.criticalEngines}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* AI Recommendations */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  AI Recommendations
                </h4>
                <div className="space-y-2">
                  {aiAnalysis.fleetHealth.recommendedActions.map((action, index) => (
                    <div key={index} className="p-2 bg-blue-50 rounded text-xs text-blue-800">
                      {action}
                    </div>
                  ))}
                </div>
              </div>

              {/* Prediction Accuracy */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Prediction Performance
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Last 30 Days</span>
                    <span className="text-sm font-medium">{aiAnalysis.predictionAccuracy.last30Days}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Model Confidence</span>
                    <span className="text-sm font-medium">{aiAnalysis.predictionAccuracy.modelConfidence}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Trend</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                      {aiAnalysis.predictionAccuracy.trend}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Anomaly Detection */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Anomaly Alerts
                </h4>
                <div className="space-y-2">
                  {aiAnalysis.anomalyDetection.map((anomaly, index) => (
                    <div key={index} className="p-2 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{anomaly.engineId}</span>
                        <Badge 
                          variant="outline" 
                          className={
                            anomaly.severity === 'high' 
                              ? "bg-red-50 text-red-700 border-red-200" 
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }
                        >
                          {anomaly.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{anomaly.anomaly}</p>
                      <p className="text-xs text-blue-600">{anomaly.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance Optimization */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Maintenance Optimization
                </h4>
                <div className="p-3 bg-green-50 rounded-lg space-y-2">
                  <p className="text-xs text-green-800 font-medium">
                    {aiAnalysis.maintenanceOptimization.suggestedSchedule}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-700">Potential Savings:</span>
                    <span className="font-medium text-green-800">{aiAnalysis.maintenanceOptimization.costSavings}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-700">Efficiency Gain:</span>
                    <span className="font-medium text-green-800">{aiAnalysis.maintenanceOptimization.efficiency}</span>
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