import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Zap, 
  Route, 
  Clock, 
  TrendingUp,
  MapPin,
  Truck,
  Target,
  Brain,
  Settings,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

interface OptimizationSuggestion {
  id: string;
  type: 'route' | 'schedule' | 'provider' | 'cost';
  title: string;
  description: string;
  impact: {
    efficiency: number;
    cost: number;
    time: number;
  };
  complexity: 'low' | 'medium' | 'high';
  estimatedSavings: number;
  implementationTime: string;
}

interface OptimizationSettings {
  autoOptimization: boolean;
  routeOptimization: boolean;
  scheduleOptimization: boolean;
  providerBalance: boolean;
  costMinimization: boolean;
  realTimeAdjustments: boolean;
}

interface AutomatedOptimizationEngineProps {
  userId?: string;
  userRole?: string;
}

const AutomatedOptimizationEngine: React.FC<AutomatedOptimizationEngineProps> = ({
  userId,
  userRole
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [settings, setSettings] = useState<OptimizationSettings>({
    autoOptimization: true,
    routeOptimization: true,
    scheduleOptimization: true,
    providerBalance: true,
    costMinimization: false,
    realTimeAdjustments: true
  });
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [lastOptimized, setLastOptimized] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadOptimizationData();
    // Simulate real-time optimization updates
    const interval = setInterval(() => {
      if (settings.autoOptimization && settings.realTimeAdjustments) {
        generateOptimizationSuggestions();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [settings]);

  const loadOptimizationData = () => {
    // Load existing optimization data
    const savedSettings = localStorage.getItem(`optimization_settings_${userId}`);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    generateOptimizationSuggestions();
  };

  const generateOptimizationSuggestions = () => {
    // Simulate AI-generated optimization suggestions
    const mockSuggestions: OptimizationSuggestion[] = [
      {
        id: '1',
        type: 'route',
        title: 'Optimize Westlands Route Cluster',
        description: 'Consolidate 6 deliveries in Westlands area into a single optimized route',
        impact: { efficiency: 25, cost: 15, time: 30 },
        complexity: 'low',
        estimatedSavings: 2500,
        implementationTime: '2 minutes'
      },
      {
        id: '2',
        type: 'provider',
        title: 'Redistribute Provider Workload',
        description: 'Balance workload between Express Logistics and Swift Transport for better efficiency',
        impact: { efficiency: 18, cost: 8, time: 12 },
        complexity: 'medium',
        estimatedSavings: 1800,
        implementationTime: '5 minutes'
      },
      {
        id: '3',
        type: 'schedule',
        title: 'Shift Peak Hour Deliveries',
        description: 'Move 4 deliveries from 2-4 PM to 10-12 AM to avoid traffic congestion',
        impact: { efficiency: 22, cost: 12, time: 45 },
        complexity: 'low',
        estimatedSavings: 3200,
        implementationTime: '1 minute'
      },
      {
        id: '4',
        type: 'cost',
        title: 'Negotiate Better Rates',
        description: 'Switch to more cost-effective provider for 3 medium-distance deliveries',
        impact: { efficiency: 5, cost: 35, time: -5 },
        complexity: 'high',
        estimatedSavings: 4500,
        implementationTime: '15 minutes'
      }
    ];

    setSuggestions(mockSuggestions);
  };

  const runOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    // Simulate optimization process
    const steps = [
      'Analyzing current delivery routes...',
      'Evaluating provider performance...',
      'Calculating time optimizations...',
      'Assessing cost reductions...',
      'Generating recommendations...',
      'Finalizing optimization plan...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOptimizationProgress((i + 1) * (100 / steps.length));
      
      toast({
        title: "Optimization in Progress",
        description: steps[i],
      });
    }

    setLastOptimized(new Date());
    generateOptimizationSuggestions();
    setIsOptimizing(false);

    toast({
      title: "Optimization Complete",
      description: `Generated ${suggestions.length} optimization suggestions with potential savings of KSh ${suggestions.reduce((sum, s) => sum + s.estimatedSavings, 0).toLocaleString()}`,
    });
  };

  const implementSuggestion = async (suggestion: OptimizationSuggestion) => {
    toast({
      title: "Implementing Optimization",
      description: `Applying: ${suggestion.title}`,
    });

    // Simulate implementation
    await new Promise(resolve => setTimeout(resolve, 2000));

    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));

    toast({
      title: "Optimization Applied",
      description: `Successfully implemented ${suggestion.title}. Estimated savings: KSh ${suggestion.estimatedSavings.toLocaleString()}`,
    });
  };

  const updateSettings = (key: keyof OptimizationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    if (userId) {
      localStorage.setItem(`optimization_settings_${userId}`, JSON.stringify(newSettings));
    }

    toast({
      title: "Settings Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been ${value ? 'enabled' : 'disabled'}`,
    });
  };

  const getSeverityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'route': return Route;
      case 'schedule': return Clock;
      case 'provider': return Truck;
      case 'cost': return Target;
      default: return Brain;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            AI Optimization Engine
          </h2>
          <p className="text-muted-foreground">Automated delivery optimization and smart recommendations</p>
        </div>
        <div className="flex items-center gap-3">
          {lastOptimized && (
            <Badge variant="outline" className="text-xs">
              Last optimized: {lastOptimized.toLocaleTimeString()}
            </Badge>
          )}
          <Button
            onClick={runOptimization}
            disabled={isOptimizing}
            className="flex items-center gap-2"
          >
            {isOptimizing ? (
              <>
                <RotateCcw className="h-4 w-4 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Run Optimization
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Optimization Progress */}
      {isOptimizing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Optimization Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(optimizationProgress)}%</span>
              </div>
              <Progress value={optimizationProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">Analyzing delivery patterns and generating optimizations...</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Optimization Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Optimization Settings
            </CardTitle>
            <CardDescription>Configure automated optimization parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label 
                  htmlFor={key} 
                  className="text-sm font-medium cursor-pointer"
                >
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Label>
                <Switch
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) => updateSettings(key as keyof OptimizationSettings, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Real-time Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Real-time optimization monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto Optimization</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${settings.autoOptimization ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm">{settings.autoOptimization ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Route Analysis</span>
              <Badge variant={settings.routeOptimization ? "default" : "secondary"}>
                {settings.routeOptimization ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Real-time Adjustments</span>
              <Badge variant={settings.realTimeAdjustments ? "default" : "secondary"}>
                {settings.realTimeAdjustments ? 'Live' : 'Manual'}
              </Badge>
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm font-medium mb-2">Today's Optimizations</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Routes Optimized</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Time Saved</span>
                  <span className="font-medium text-green-600">2.4 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cost Reduced</span>
                  <span className="font-medium text-green-600">KSh 8,400</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Optimization Impact</CardTitle>
            <CardDescription>Performance improvements this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">23.5%</div>
              <div className="text-sm text-green-700 dark:text-green-300">Efficiency Increase</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">KSh 45,200</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Cost Savings</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">18.7h</div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Time Saved</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            AI Optimization Suggestions
          </CardTitle>
          <CardDescription>
            Smart recommendations to improve delivery efficiency and reduce costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {suggestions.length === 0 ? (
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                No optimization suggestions available. Run optimization analysis to generate recommendations.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {suggestions.map((suggestion) => {
                const Icon = getTypeIcon(suggestion.type);
                return (
                  <div key={suggestion.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <div>
                          <h4 className="font-medium">{suggestion.title}</h4>
                          <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(suggestion.complexity)}>
                        {suggestion.complexity} complexity
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-green-600">+{suggestion.impact.efficiency}%</div>
                        <div className="text-muted-foreground">Efficiency</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-blue-600">-{suggestion.impact.cost}%</div>
                        <div className="text-muted-foreground">Cost</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-purple-600">-{suggestion.impact.time}min</div>
                        <div className="text-muted-foreground">Time</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm">
                        <span className="font-medium text-green-600">KSh {suggestion.estimatedSavings.toLocaleString()}</span>
                        <span className="text-muted-foreground"> estimated savings</span>
                        <span className="mx-2">•</span>
                        <span className="text-muted-foreground">{suggestion.implementationTime} to implement</span>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => implementSuggestion(suggestion)}
                        className="flex items-center gap-2"
                      >
                        <Play className="h-3 w-3" />
                        Apply
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomatedOptimizationEngine;