import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertTriangle, Thermometer, Gauge, Zap, BarChart3 } from 'lucide-react';

interface SensorAnomaly {
  engineId: string;
  currentCycle: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  anomalies: {
    sensorType: 'HPC Outlet Temperature' | 'HPC Outlet Pressure' | 'Core Speed' | 'Engine Pressure Ratio';
    value: number;
    normalRange: [number, number];
    deviation: number;
  }[];
}

// Generate mock engine anomaly data
const generateEngineAnomalies = (): SensorAnomaly[] => {
  const anomalies: SensorAnomaly[] = [];

  // Generate anomalies for various engines
  const anomalyEngines = [
    { id: 'ENG-001', cycle: 245, severity: 'critical' as const },
    { id: 'ENG-045', cycle: 189, severity: 'critical' as const },
    { id: 'ENG-123', cycle: 156, severity: 'high' as const },
    { id: 'ENG-089', cycle: 203, severity: 'high' as const },
    { id: 'ENG-267', cycle: 178, severity: 'medium' as const },
    { id: 'ENG-155', cycle: 234, severity: 'medium' as const },
    { id: 'ENG-203', cycle: 167, severity: 'medium' as const },
    { id: 'ENG-078', cycle: 198, severity: 'low' as const },
    { id: 'ENG-145', cycle: 221, severity: 'low' as const },
  ];

  anomalyEngines.forEach(engine => {
    const engineAnomalies: SensorAnomaly['anomalies'] = [];

    // Randomly assign 1-3 sensor anomalies per engine
    const sensorTypes = [
      { type: 'HPC Outlet Temperature' as const, normalRange: [1520, 1620] as [number, number], baseValue: 1580 },
      { type: 'HPC Outlet Pressure' as const, normalRange: [360, 420] as [number, number], baseValue: 390 },
      { type: 'Core Speed' as const, normalRange: [8800, 9200] as [number, number], baseValue: 9000 },
      { type: 'Engine Pressure Ratio' as const, normalRange: [1.2, 1.4] as [number, number], baseValue: 1.3 }
    ];

    const numAnomalies = Math.floor(Math.random() * 3) + 1; // 1-3 anomalies
    const selectedSensors = sensorTypes.sort(() => Math.random() - 0.5).slice(0, numAnomalies);

    selectedSensors.forEach(sensor => {
      const deviationMultiplier = engine.severity === 'critical' ? 2.5 :
        engine.severity === 'high' ? 2.0 :
          engine.severity === 'medium' ? 1.5 : 1.2;

      const isAboveRange = Math.random() > 0.5;
      const value = isAboveRange ?
        sensor.normalRange[1] + (sensor.normalRange[1] - sensor.normalRange[0]) * 0.1 * deviationMultiplier :
        sensor.normalRange[0] - (sensor.normalRange[1] - sensor.normalRange[0]) * 0.1 * deviationMultiplier;

      const deviation = Math.abs(value - sensor.baseValue) / sensor.baseValue * 100;

      engineAnomalies.push({
        sensorType: sensor.type,
        value: Math.round(value * 100) / 100,
        normalRange: sensor.normalRange,
        deviation: Math.round(deviation * 10) / 10
      });
    });

    anomalies.push({
      engineId: engine.id,
      currentCycle: engine.cycle,
      severity: engine.severity,
      anomalies: engineAnomalies
    });
  });

  return anomalies.sort((a, b) => {
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
};

export function AnomalyDetection() {
  const engineAnomalies = generateEngineAnomalies();

  // Calculate sensor statistics across all engines
  const sensorStats = {
    'HPC Outlet Temperature': 0,
    'HPC Outlet Pressure': 0,
    'Core Speed': 0,
    'Engine Pressure Ratio': 0
  };

  engineAnomalies.forEach(engine => {
    engine.anomalies.forEach(anomaly => {
      sensorStats[anomaly.sensorType]++;
    });
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSensorIcon = (sensorType: string) => {
    switch (sensorType) {
      case 'HPC Outlet Temperature': return <Thermometer className="w-4 h-4" />;
      case 'HPC Outlet Pressure': return <Gauge className="w-4 h-4" />;
      case 'Core Speed': return <Zap className="w-4 h-4" />;
      case 'Engine Pressure Ratio': return <BarChart3 className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Real-time Anomaly Detection
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Sensor anomaly statistics across fleet engines
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Sensor Anomaly Statistics */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Thermometer className="w-3 h-3 text-red-600" />
              <div className="text-lg font-bold text-red-600">{sensorStats['HPC Outlet Temperature']}</div>
            </div>
            <div className="text-xs text-red-700">HPC Outlet Temp</div>
          </div>
          <div className="text-center p-2 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Gauge className="w-3 h-3 text-orange-600" />
              <div className="text-lg font-bold text-orange-600">{sensorStats['HPC Outlet Pressure']}</div>
            </div>
            <div className="text-xs text-orange-700">HPC Outlet Press</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="w-3 h-3 text-yellow-600" />
              <div className="text-lg font-bold text-yellow-600">{sensorStats['Core Speed']}</div>
            </div>
            <div className="text-xs text-yellow-700">Core Speed</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BarChart3 className="w-3 h-3 text-blue-600" />
              <div className="text-lg font-bold text-blue-600">{sensorStats['Engine Pressure Ratio']}</div>
            </div>
            <div className="text-xs text-blue-700">Engine Press Ratio</div>
          </div>
        </div>

        {/* Active Anomalies List */}
        <div className="flex-1 flex flex-col min-h-0">
          <h4 className="font-medium text-gray-700 mb-2 sticky top-0 bg-white z-10 py-2 border-b border-gray-100">Active Anomalies</h4>
          <div className="flex-1 space-y-2 overflow-y-auto" style={{ maxHeight: '36rem' }}>
            {engineAnomalies.map((engine, index) => (
              <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm">{engine.engineId}</span>
                    <Badge className={`text-xs ${getSeverityColor(engine.severity)}`}>
                      {engine.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    Cycle: {engine.currentCycle}
                  </div>
                </div>

                <div className="space-y-1">
                  {engine.anomalies.map((anomaly, anomalyIndex) => (
                    <div key={anomalyIndex} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        {getSensorIcon(anomaly.sensorType)}
                        <span className="text-gray-700">{anomaly.sensorType}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-red-600 font-medium">{anomaly.value}</span>
                        <div className="text-gray-500">
                          Normal: {anomaly.normalRange[0]}-{anomaly.normalRange[1]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detection Algorithm Info */}
        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-3 h-3 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Fleet Anomaly Overview</span>
          </div>
          <div className="text-xs text-blue-700">
            Total Engines with Anomalies: {engineAnomalies.length} |
            Last Update: 2 min ago |
            Detection Model: Sensor Threshold v3.2
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnomalyDetection;