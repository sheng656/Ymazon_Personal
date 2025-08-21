import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Search, Filter, AlertTriangle, Activity, Thermometer, Gauge, Zap, BarChart3 } from "lucide-react";

// Generate mock engine data
const generateEngineData = () => {
  const engines = [];
  const datasets = ['FD001', 'FD002', 'FD003', 'FD004'];
  const faultModes = {
    'FD001': 'HPC Degradation',
    'FD002': 'HPC Degradation',
    'FD003': 'HPC+Fan Degradation',
    'FD004': 'HPC+Fan Degradation'
  };

  for (let i = 1; i <= 100; i++) {
    const dataset = datasets[Math.floor(Math.random() * 4)];
    const rul = Math.floor(Math.random() * 180) + 5;
    const currentCycle = Math.floor(Math.random() * 200) + 50;

    engines.push({
      id: i,
      dataset: dataset,
      rul: rul,
      currentCycle: currentCycle,
      totalCycles: currentCycle + rul,
      status: rul > 60 ? 'healthy' : rul >= 15 ? 'warning' : 'critical',
      faultMode: faultModes[dataset as keyof typeof faultModes],
      confidence: 85 + Math.random() * 10,
      rmse: 8 + Math.random() * 5,
      mae: 6 + Math.random() * 4,
      // Failure probabilities
      failureProbability15: rul <= 15 ? 80 + Math.random() * 15 : rul <= 30 ? 20 + Math.random() * 30 : Math.random() * 15,
      failureProbability30: rul <= 30 ? 70 + Math.random() * 20 : rul <= 60 ? 30 + Math.random() * 30 : 5 + Math.random() * 20,
      failureProbability60: rul <= 60 ? 60 + Math.random() * 30 : 20 + Math.random() * 30,
      // Critical sensor data
      sensors: {
        sensor3: { value: 1580 + Math.random() * 100 - 50, normal: [1520, 1620], name: 'HPC Outlet Temperature', unit: '°R', icon: 'thermometer' },
        sensor7: { value: 390 + Math.random() * 50 - 25, normal: [360, 420], name: 'HPC Outlet Pressure', unit: 'psia', icon: 'gauge' },
        sensor9: { value: 9000 + Math.random() * 200 - 100, normal: [8800, 9200], name: 'Core Speed', unit: 'rpm', icon: 'zap' },
        sensor10: { value: 1.3 + Math.random() * 0.3 - 0.15, normal: [1.2, 1.4], name: 'Engine Pressure Ratio', unit: '', icon: 'bar-chart-3' }
      },
      // Historical RUL trend data
      rulHistory: Array.from({ length: 20 }, (_, idx) => ({
        cycle: currentCycle - 19 + idx,
        actualRUL: rul + 19 - idx + Math.random() * 10 - 5,
        predictedRUL: rul + 19 - idx + Math.random() * 8 - 4
      }))
    });
  }

  return engines.sort((a, b) => a.rul - b.rul);
};

export function Prediction() {
  const [engines] = useState(generateEngineData());
  const [selectedEngine, setSelectedEngine] = useState(engines[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>(['FD001', 'FD002', 'FD003', 'FD004']);
  const [statusFilter, setStatusFilter] = useState('all');
  const [rulRange, setRulRange] = useState([0, 200]);

  const filteredEngines = engines.filter(engine => {
    const matchesSearch = engine.id.toString().includes(searchTerm) ||
      engine.dataset.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDataset = selectedDatasets.includes(engine.dataset);
    const matchesStatus = statusFilter === 'all' || engine.status === statusFilter;
    const matchesRUL = engine.rul >= rulRange[0] && engine.rul <= rulRange[1];

    return matchesSearch && matchesDataset && matchesStatus && matchesRUL;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical': return <Badge className="bg-white text-red-600 border-red-600 border-2">Critical</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Warning</Badge>;
      case 'healthy': return <Badge className="bg-green-100 text-green-800 border-green-200">Healthy</Badge>;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'healthy': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-300';
    }
  };

  const getSensorIcon = (iconType: string) => {
    switch (iconType) {
      case 'thermometer': return <Thermometer className="w-4 h-4" />;
      case 'gauge': return <Gauge className="w-4 h-4" />;
      case 'zap': return <Zap className="w-4 h-4" />;
      case 'bar-chart-3': return <BarChart3 className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getSensorStatus = (value: number, normal: number[]) => {
    if (value < normal[0] || value > normal[1]) return 'abnormal';
    return 'normal';
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDatasets(['FD001', 'FD002', 'FD003', 'FD004']);
    setStatusFilter('all');
    setRulRange([0, 200]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Filter Toolbar */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* First row: Search and status filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Enter Engine ID to search..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Health Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Second row: Dataset selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Dataset Filter:</label>
            <div className="flex gap-4">
              {['FD001', 'FD002', 'FD003', 'FD004'].map((dataset) => (
                <div key={dataset} className="flex items-center space-x-2">
                  <Checkbox
                    id={dataset}
                    checked={selectedDatasets.includes(dataset)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedDatasets([...selectedDatasets, dataset]);
                      } else {
                        setSelectedDatasets(selectedDatasets.filter(d => d !== dataset));
                      }
                    }}
                  />
                  <label htmlFor={dataset} className="text-sm">{dataset}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Third row: RUL range slider */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              RUL Range: {rulRange[0]} - {rulRange[1]} cycles
            </label>
            <Slider
              value={rulRange}
              onValueChange={setRulRange}
              max={200}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Found {filteredEngines.length} engines
            </span>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              <Filter className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left - Engine List (30%) */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Engine List</CardTitle>
              <p className="text-sm text-muted-foreground">Sorted by RUL ascending (most urgent first)</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredEngines.map((engine) => (
                  <div
                    key={engine.id}
                    className={`p-3 rounded-lg border-l-4 cursor-pointer transition-colors ${getStatusColor(engine.status)} ${selectedEngine.id === engine.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                      }`}
                    onClick={() => setSelectedEngine(engine)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Engine {engine.id}</span>
                      <Badge variant="outline" className="text-xs">{engine.dataset}</Badge>
                    </div>
                    <div className="text-2xl font-bold mb-1">{engine.rul} <span className="text-sm font-normal">cycles</span></div>
                    <div className="flex items-center justify-between mb-2">
                      {getStatusBadge(engine.status)}
                      <span className="text-xs text-muted-foreground">
                        {engine.currentCycle} / {engine.totalCycles}
                      </span>
                    </div>
                    {/* RUL Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${engine.status === 'critical' ? 'bg-red-500' :
                          engine.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                        style={{ width: `${(engine.rul / engine.totalCycles) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right - Detailed Prediction Analysis (70%) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top - Engine Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Engine {selectedEngine.id} Basic Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Dataset:</span>
                  <Badge variant="outline" className="ml-2">{selectedEngine.dataset}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Fault Mode:</span>
                  <p className="font-medium">{selectedEngine.faultMode}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Current Cycle:</span>
                  <p className="font-medium">{selectedEngine.currentCycle}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Predicted RUL:</span>
                  <p className="text-xl font-bold">{selectedEngine.rul} cycles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Failure Probability Prediction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Failure Probability Prediction
              </CardTitle>
              <p className="text-sm text-muted-foreground">Failure probability across three time windows</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { period: 'Next 15 cycles', probability: selectedEngine.failureProbability15, color: 'red' },
                  { period: 'Next 30 cycles', probability: selectedEngine.failureProbability30, color: 'orange' },
                  { period: 'Next 60 cycles', probability: selectedEngine.failureProbability60, color: 'yellow' }
                ].map((item) => (
                  <div key={item.period} className="text-center">
                    <h4 className="text-sm font-medium mb-2">{item.period}</h4>
                    <div className="text-3xl font-bold mb-2" style={{
                      color: item.probability > 70 ? '#ef4444' : item.probability > 40 ? '#f97316' : '#eab308'
                    }}>
                      {item.probability.toFixed(1)}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                      <div
                        className="h-3 rounded-full transition-all duration-300 ease-in-out"
                        style={{
                          width: `${item.probability}%`,
                          backgroundColor: item.probability > 70 ? '#ef4444' : item.probability > 40 ? '#f97316' : '#eab308'
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Failure Probability</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bottom - Critical Sensor Monitoring (25%) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Critical Sensor Monitoring
              </CardTitle>
              <p className="text-sm text-muted-foreground">4 critical sensors current status</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedEngine.sensors).map(([sensorId, sensor]) => {
                  const status = getSensorStatus(sensor.value, sensor.normal);
                  const isAbnormal = status === 'abnormal';

                  return (
                    <div key={sensorId} className={`p-3 rounded-lg border-2 ${isAbnormal ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
                      }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getSensorIcon(sensor.icon)}
                          <span className="text-sm font-medium">{sensor.name}</span>
                        </div>
                        {isAbnormal && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="text-lg font-bold">
                        {sensor.value.toFixed(sensor.unit === '' ? 2 : 0)} {sensor.unit}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Normal range: {sensor.normal[0]} - {sensor.normal[1]} {sensor.unit}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}