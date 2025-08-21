import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useState } from "react";

// Mock engine data
const generateEngineData = () => {
  const engines = [];
  for (let i = 1; i <= 100; i++) {
    const rul = Math.floor(Math.random() * 150) + 5;
    const label1 = rul <= 60 ? 1 : 0;
    const label2 = rul <= 15 ? 2 : (label1 === 1 ? (Math.random() > 0.7 ? 1 : 0) : 0);
    
    engines.push({
      id: i,
      rul,
      label1,
      label2,
      dataset: `FD00${Math.floor(Math.random() * 4) + 1}`,
      condition: Math.floor(Math.random() * 6) + 1,
      status: label2 === 2 ? 'critical' : label1 === 1 ? 'warning' : 'normal'
    });
  }
  return engines;
};

export function FleetStatusMap() {
  const [selectedEngine, setSelectedEngine] = useState<any>(null);
  const engines = generateEngineData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500 hover:bg-red-600';
      case 'warning': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'normal': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-gray-400';
    }
  };

  const getStatusBadge = (status: string, rul: number) => {
    switch (status) {
      case 'critical': return <Badge variant="destructive" className="text-xs">Critical</Badge>;
      case 'warning': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">Warning</Badge>;
      case 'normal': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">Normal</Badge>;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Health Status Map</CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time overview of all engines with color-coded health indicators
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Normal (RUL &gt; 60)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Warning (RUL 15-60)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Critical (RUL &le; 15)</span>
            </div>
          </div>

          {/* Engine Grid */}
          <TooltipProvider>
            <div className="grid grid-cols-10 gap-1 max-h-64 overflow-y-auto">
              {engines.map((engine) => (
                <Tooltip key={engine.id}>
                  <TooltipTrigger asChild>
                    <button
                      className={`w-6 h-6 rounded ${getStatusColor(engine.status)} transition-colors cursor-pointer flex items-center justify-center`}
                      onClick={() => setSelectedEngine(engine)}
                    >
                      <span className="text-white text-xs font-medium">
                        {engine.id}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center">
                      <p className="font-medium">Engine {engine.id}</p>
                      <p className="text-sm">RUL: {engine.rul} cycles</p>
                      <p className="text-sm">Dataset: {engine.dataset}</p>
                      <p className="text-sm">Condition: {engine.condition}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>

          {/* Selected Engine Details */}
          {selectedEngine && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Engine {selectedEngine.id} Details</h4>
                {getStatusBadge(selectedEngine.status, selectedEngine.rul)}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Remaining Useful Life</p>
                  <p className="font-medium">{selectedEngine.rul} cycles</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dataset</p>
                  <p className="font-medium">{selectedEngine.dataset}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Operating Condition</p>
                  <p className="font-medium">Condition {selectedEngine.condition}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Health Labels</p>
                  <p className="font-medium">L1: {selectedEngine.label1}, L2: {selectedEngine.label2}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}