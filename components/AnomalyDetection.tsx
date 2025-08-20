import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertTriangle, AlertCircle, Activity, TrendingUp } from 'lucide-react';

interface AnomalyData {
  engineId: string;
  anomalyType: 'vibration' | 'temperature' | 'pressure' | 'performance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  confidence: number;
  description: string;
}

export function AnomalyDetection() {
  // Simulated anomaly data
  const anomalies: AnomalyData[] = [
    {
      engineId: 'ENG-001',
      anomalyType: 'vibration',
      severity: 'critical',
      detectedAt: '2025-08-20 14:23',
      confidence: 0.95,
      description: 'Abnormal vibration pattern detected in fan assembly'
    },
    {
      engineId: 'ENG-045',
      anomalyType: 'temperature',
      severity: 'high',
      detectedAt: '2025-08-20 13:15',
      confidence: 0.87,
      description: 'Exhaust gas temperature exceeding normal range'
    },
    {
      engineId: 'ENG-123',
      anomalyType: 'performance',
      severity: 'medium',
      detectedAt: '2025-08-20 12:45',
      confidence: 0.76,
      description: 'Thrust output declining below expected baseline'
    },
    {
      engineId: 'ENG-089',
      anomalyType: 'pressure',
      severity: 'low',
      detectedAt: '2025-08-20 11:30',
      confidence: 0.68,
      description: 'Minor pressure fluctuation in combustion chamber'
    },
  ];

  const anomalyStats = {
    total: 4,
    critical: 1,
    high: 1,
    medium: 1,
    low: 1,
    resolved: 12,
    avgConfidence: 0.82
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'vibration': return <Activity className="w-4 h-4" />;
      case 'temperature': return <TrendingUp className="w-4 h-4" />;
      case 'pressure': return <AlertCircle className="w-4 h-4" />;
      case 'performance': return <AlertTriangle className="w-4 h-4" />;
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
          AI-powered detection of engine abnormalities
        </p>
      </CardHeader>
      <CardContent>
        {/* Summary Statistics */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <div className="text-xl font-bold text-red-600">{anomalyStats.critical}</div>
            <div className="text-xs text-red-700">Critical</div>
          </div>
          <div className="text-center p-2 bg-orange-50 rounded-lg">
            <div className="text-xl font-bold text-orange-600">{anomalyStats.high}</div>
            <div className="text-xs text-orange-700">High</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded-lg">
            <div className="text-xl font-bold text-yellow-600">{anomalyStats.medium}</div>
            <div className="text-xs text-yellow-700">Medium</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">{anomalyStats.resolved}</div>
            <div className="text-xs text-green-700">Resolved</div>
          </div>
        </div>

        {/* Active Anomalies List */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          <h4 className="font-medium text-gray-700 mb-2">Active Anomalies</h4>
          {anomalies.map((anomaly, index) => (
            <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  {getAnomalyIcon(anomaly.anomalyType)}
                  <span className="font-medium text-gray-900 text-sm">{anomaly.engineId}</span>
                  <Badge className={`text-xs ${getSeverityColor(anomaly.severity)}`}>
                    {anomaly.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500">
                  {(anomaly.confidence * 100).toFixed(0)}%
                </div>
              </div>

              <p className="text-xs text-gray-700 mb-2">{anomaly.description}</p>

              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{anomaly.anomalyType.toUpperCase()}</span>
                <span>{anomaly.detectedAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detection Algorithm Info */}
        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-3 h-3 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">AI Detection Status</span>
          </div>
          <div className="text-xs text-blue-700">
            Avg Confidence: {(anomalyStats.avgConfidence * 100).toFixed(0)}% |
            Last Update: 2 min ago |
            Model: LSTM-AutoEncoder v2.1
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnomalyDetection;