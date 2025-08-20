import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Clock, 
  AlertTriangle, 
  Wrench, 
  Brain, 
  TrendingDown, 
  Activity,
  Calendar,
  Target
} from "lucide-react";
import { useState } from "react";

// Mock prediction data
const rulPredictionData = [
  { engineId: 'E-001', currentRUL: 28, predictedRUL: 25, confidence: 92, trend: 'declining' },
  { engineId: 'E-045', currentRUL: 67, predictedRUL: 72, confidence: 89, trend: 'stable' },
  { engineId: 'E-123', currentRUL: 15, predictedRUL: 12, confidence: 95, trend: 'critical' },
  { engineId: 'E-089', currentRUL: 156, predictedRUL: 149, confidence: 87, trend: 'normal' }
];

const failureProbabilityData = [
  {
    engineId: 'E-001',
    cycles15: { probability: 23, risk: 'medium' },
    cycles30: { probability: 45, risk: 'high' },
    cycles60: { probability: 78, risk: 'high' }
  },
  {
    engineId: 'E-045', 
    cycles15: { probability: 8, risk: 'low' },
    cycles30: { probability: 15, risk: 'low' },
    cycles60: { probability: 32, risk: 'medium' }
  },
  {
    engineId: 'E-123',
    cycles15: { probability: 87, risk: 'critical' },
    cycles30: { probability: 95, risk: 'critical' },
    cycles60: { probability: 98, risk: 'critical' }
  },
  {
    engineId: 'E-089',
    cycles15: { probability: 2, risk: 'low' },
    cycles30: { probability: 5, risk: 'low' },
    cycles60: { probability: 12, risk: 'low' }
  }
];

const maintenanceRecommendations = [
  {
    engineId: 'E-001',
    priority: 'high',
    action: 'Schedule comprehensive inspection',
    timeframe: '5-10 cycles',
    reasoning: 'RUL approaching warning threshold, sensor degradation detected',
    estimatedCost: '$8,500',
    components: ['HPC Temperature Sensors', 'Pressure Transducers', 'Bearing Assembly']
  },
  {
    engineId: 'E-045',
    priority: 'medium', 
    action: 'Routine maintenance check',
    timeframe: '15-25 cycles',
    reasoning: 'Normal operation but approaching scheduled maintenance window',
    estimatedCost: '$3,200',
    components: ['Filter Elements', 'Oil Analysis', 'Vibration Sensors']
  },
  {
    engineId: 'E-123',
    priority: 'critical',
    action: 'Immediate maintenance required',
    timeframe: 'ASAP',
    reasoning: 'Critical RUL threshold reached, high failure probability',
    estimatedCost: '$15,600',
    components: ['Core Assembly', 'Control Systems', 'Safety Sensors']
  },
  {
    engineId: 'E-089',
    priority: 'low',
    action: 'Continue monitoring',
    timeframe: '60+ cycles',
    reasoning: 'Engine operating normally within expected parameters',
    estimatedCost: '$1,800',
    components: ['Routine Inspection', 'Data Collection']
  }
];

export function PredictionAnalysis() {
  const [selectedEngine, setSelectedEngine] = useState('E-001');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'; 
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-red-400';
      case 'medium': return 'bg-yellow-400';
      case 'low': return 'bg-green-400';
      default: return 'bg-gray-400';
    }
  };

  const selectedFailureData = failureProbabilityData.find(d => d.engineId === selectedEngine);
  const selectedMaintenanceData = maintenanceRecommendations.find(d => d.engineId === selectedEngine);
  const selectedRULData = rulPredictionData.find(d => d.engineId === selectedEngine);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <CardTitle>AI Prediction Analysis</CardTitle>
          </div>
          <Select value={selectedEngine} onValueChange={setSelectedEngine}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {rulPredictionData.map((engine) => (
                <SelectItem key={engine.engineId} value={engine.engineId}>
                  {engine.engineId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">
          Comprehensive AI-powered predictions for engine health and maintenance planning
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rul" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rul" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              RUL Prediction
            </TabsTrigger>
            <TabsTrigger value="failure" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Failure Probability
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Maintenance Advice
            </TabsTrigger>
          </TabsList>

          {/* RUL Prediction Tab */}
          <TabsContent value="rul" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Current RUL Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current RUL</span>
                      <span className="text-2xl font-bold">{selectedRULData?.currentRUL}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Predicted RUL</span>
                      <div className="text-right">
                        <span className="text-xl font-semibold">{selectedRULData?.predictedRUL}</span>
                        <p className="text-xs text-muted-foreground">cycles remaining</p>
                      </div>
                    </div>
                    <Progress 
                      value={selectedRULData ? (selectedRULData.predictedRUL / 200) * 100 : 0} 
                      className="h-3"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Confidence</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {selectedRULData?.confidence}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <TrendingDown className={`w-4 h-4 ${
                        selectedRULData?.trend === 'critical' ? 'text-red-500' :
                        selectedRULData?.trend === 'declining' ? 'text-yellow-500' :
                        'text-green-500'
                      }`} />
                      <span className="text-sm">Engine Health Trend</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        selectedRULData?.trend === 'critical' ? 'bg-red-50 text-red-700 border-red-200' :
                        selectedRULData?.trend === 'declining' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        selectedRULData?.trend === 'stable' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-green-50 text-green-700 border-green-200'
                      }
                    >
                      {selectedRULData?.trend}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Based on sensor data trends and historical patterns
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Failure Probability Tab */}
          <TabsContent value="failure" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { cycles: '15', data: selectedFailureData?.cycles15, label: 'Next 15 Cycles' },
                { cycles: '30', data: selectedFailureData?.cycles30, label: 'Next 30 Cycles' },
                { cycles: '60', data: selectedFailureData?.cycles60, label: 'Next 60 Cycles' }
              ].map((period) => (
                <Card key={period.cycles}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      {period.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{period.data?.probability}%</div>
                        <p className="text-xs text-muted-foreground">Failure Probability</p>
                      </div>
                      <Progress 
                        value={period.data?.probability || 0} 
                        className="h-3"
                      />
                      <div className="flex items-center justify-center">
                        <Badge 
                          variant="outline" 
                          className={
                            period.data?.risk === 'critical' ? 'bg-red-50 text-red-700 border-red-200' :
                            period.data?.risk === 'high' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            period.data?.risk === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-green-50 text-green-700 border-green-200'
                          }
                        >
                          {period.data?.risk} risk
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Risk Assessment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>AI Analysis:</strong> Engine {selectedEngine} shows{' '}
                    {selectedFailureData?.cycles15.probability && selectedFailureData.cycles15.probability > 50
                      ? 'elevated failure risk in the short term'
                      : selectedFailureData?.cycles30.probability && selectedFailureData.cycles30.probability > 50
                      ? 'moderate failure risk developing over time'
                      : 'low failure risk with stable operation expected'
                    }. Monitor sensor data closely for any anomalous patterns.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Recommendations Tab */}
          <TabsContent value="maintenance" className="space-y-4">
            {selectedMaintenanceData && (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Maintenance Recommendation</CardTitle>
                      <Badge 
                        variant="outline"
                        className={getPriorityColor(selectedMaintenanceData.priority)}
                      >
                        {selectedMaintenanceData.priority} priority
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Recommended Action
                          </h4>
                          <p className="text-sm">{selectedMaintenanceData.action}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Timeframe
                          </h4>
                          <Badge variant="outline">{selectedMaintenanceData.timeframe}</Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">AI Reasoning</h4>
                        <p className="text-sm text-muted-foreground">{selectedMaintenanceData.reasoning}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Components to Check</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedMaintenanceData.components.map((component) => (
                            <Badge key={component} variant="secondary" className="text-xs">
                              {component}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-green-800">Estimated Cost</span>
                        <span className="text-lg font-bold text-green-900">
                          {selectedMaintenanceData.estimatedCost}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Maintenance
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Wrench className="w-4 h-4 mr-2" />
                    Create Work Order
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}