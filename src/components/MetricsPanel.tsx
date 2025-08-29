import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, Activity, Cpu, Target } from 'lucide-react';
import { useSchedulerStore } from '@/stores/schedulerStore';

export function MetricsPanel() {
  const { simulation } = useSchedulerStore();
  const { metrics } = simulation;

  const metricItems = [
    {
      title: 'Avg Waiting Time',
      value: metrics?.averageWaitingTime ?? 0,
      unit: 'ms',
      icon: Clock,
      color: 'text-info',
      description: 'Average time processes wait in ready queue',
    },
    {
      title: 'Avg Turnaround Time',
      value: metrics?.averageTurnaroundTime ?? 0,
      unit: 'ms',
      icon: TrendingUp,
      color: 'text-warning',
      description: 'Average total time from arrival to completion',
    },
    {
      title: 'Avg Response Time',
      value: metrics?.averageResponseTime ?? 0,
      unit: 'ms',
      icon: Target,
      color: 'text-success',
      description: 'Average time from arrival to first execution',
    },
    {
      title: 'CPU Utilization',
      value: metrics?.cpuUtilization ?? 0,
      unit: '%',
      icon: Cpu,
      color: 'text-primary',
      description: 'Percentage of time CPU was executing processes',
    },
    {
      title: 'Throughput',
      value: metrics?.throughput ?? 0,
      unit: 'proc/ms',
      icon: Activity,
      color: 'text-accent',
      description: 'Number of processes completed per time unit',
    },
  ];

  return (
    <Card className="bg-gradient-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Performance Metrics</CardTitle>
        <CardDescription>
          System performance analysis and statistics
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!metrics ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            Run a simulation to see performance metrics
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metricItems.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`p-2 rounded-lg bg-muted ${metric.color}`}>
                        <metric.icon className="h-4 w-4" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {metric.unit}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm text-muted-foreground">
                        {metric.title}
                      </h3>
                      
                      <div className="text-2xl font-bold font-mono">
                        {typeof metric.value === 'number' 
                          ? metric.value.toFixed(2)
                          : metric.value
                        }
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {metric.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-muted/50 rounded-lg"
          >
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Performance Summary
            </h4>
            
            <div className="text-sm text-muted-foreground space-y-1">
              <div>
                Total execution time: <span className="font-mono font-medium">{simulation.currentTime}ms</span>
              </div>
              <div>
                Processes completed: <span className="font-mono font-medium">{simulation.completedProcesses.length}</span>
              </div>
              <div className="flex items-center gap-2">
                Efficiency rating:
                <Badge 
                  variant={metrics.cpuUtilization > 80 ? "default" : metrics.cpuUtilization > 60 ? "secondary" : "outline"}
                  className="font-mono"
                >
                  {metrics.cpuUtilization > 80 ? 'Excellent' : 
                   metrics.cpuUtilization > 60 ? 'Good' : 'Fair'}
                </Badge>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}