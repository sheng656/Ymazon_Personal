import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { TrendingUp, Target, AlertCircle, CheckCircle } from "lucide-react";

const predictionMetrics = [
  {
    name: 'RUL Prediction Accuracy',
    value: 87.3,
    unit: '%',
    target: 90,
    trend: 'up',
    description: 'RMSE-based accuracy score',
    status: 'good',
    icon: Target
  },
  {
    name: 'Early Fault Detection',
    value: 92.6,
    unit: '%',  
    target: 95,
    trend: 'up',
    description: 'Label1 prediction accuracy',
    status: 'excellent',
    icon: CheckCircle
  },
  {
    name: 'Critical Warning Accuracy',
    value: 84.1,
    unit: '%',
    target: 85,
    trend: 'stable',
    description: 'Label2 prediction accuracy',
    status: 'warning',
    icon: AlertCircle
  },
  {
    name: 'Average Prediction Error',
    value: 8.7,
    unit: 'cycles',
    target: 10,
    trend: 'down',
    description: 'Mean absolute error',
    status: 'good',
    icon: TrendingUp
  }
];

const recentPredictions = [
  { engine: 'Engine 001', predicted: 28, actual: 25, error: 3, status: 'critical' },
  { engine: 'Engine 045', predicted: 67, actual: 72, error: -5, status: 'normal' },
  { engine: 'Engine 123', predicted: 15, actual: 12, error: 3, status: 'critical' },
  { engine: 'Engine 089', predicted: 156, actual: 149, error: 7, status: 'normal' }
];

export function PredictionMetrics() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction Accuracy Metrics</CardTitle>
        <p className="text-sm text-muted-foreground">
          AI model performance and prediction quality indicators
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* KPI Metrics */}
          <div className="space-y-4">
            {predictionMetrics.map((metric) => {
              const IconComponent = metric.icon;
              const progress = metric.name === 'Average Prediction Error' 
                ? ((metric.target - metric.value) / metric.target) * 100
                : (metric.value / metric.target) * 100;
              
              return (
                <div key={metric.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`w-4 h-4 ${getStatusColor(metric.status)}`} />
                      <span className="text-sm font-medium">{metric.name}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-bold ${getStatusColor(metric.status)}`}>
                        {metric.value}{metric.unit}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Target: {metric.target}{metric.unit}
                      </p>
                    </div>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              );
            })}
          </div>

          {/* Recent Predictions */}
          <div>
            <h4 className="text-sm font-medium mb-3">Recent Prediction Accuracy</h4>
            <div className="space-y-2">
              {recentPredictions.map((pred) => (
                <div key={pred.engine} className="flex items-center justify-between p-2 text-xs border rounded">
                  <span className="font-medium">{pred.engine}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Pred: {pred.predicted}</span>
                    <span className="text-muted-foreground">Actual: {pred.actual}</span>
                    <Badge 
                      variant={Math.abs(pred.error) <= 5 ? "outline" : "destructive"}
                      className="text-xs"
                    >
                      {pred.error > 0 ? '+' : ''}{pred.error}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overall System Health */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">System Health: Excellent</span>
            </div>
            <p className="text-xs text-green-800">
              Prediction models are performing within acceptable parameters. 
              Continue monitoring for optimal maintenance scheduling.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}