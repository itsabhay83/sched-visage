import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useSchedulerStore } from '@/stores/schedulerStore';

export function GanttChart() {
  const { simulation } = useSchedulerStore();
  const chartRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = React.useState(1);

  const { ganttChart, currentTime } = simulation;
  
  const maxTime = Math.max(currentTime, ...ganttChart.map(item => item.endTime));
  const timeUnit = 40 * zoom; // pixels per time unit
  
  const handleExportChart = async () => {
    if (!chartRef.current) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(chartRef.current);
      
      const link = document.createElement('a');
      link.download = 'gantt-chart.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Failed to export chart:', error);
    }
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Gantt Chart</CardTitle>
            <CardDescription>
              Visual timeline of process execution
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <Badge variant="outline" className="font-mono px-3">
              {Math.round(zoom * 100)}%
            </Badge>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setZoom(Math.min(3, zoom + 0.25))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleExportChart}>
              <Download className="h-4 w-4 mr-1" />
              Export PNG
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {ganttChart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            Run a simulation to see the Gantt chart
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Time axis */}
            <div className="relative">
              <div className="flex items-center mb-2">
                <div className="w-16 text-sm font-medium">Time</div>
                <div className="flex-1 relative">
                  <svg 
                    width={maxTime * timeUnit + 20} 
                    height="30"
                    className="overflow-visible"
                  >
                    {/* Time markers */}
                    {Array.from({ length: maxTime + 1 }, (_, i) => (
                      <g key={i}>
                        <line
                          x1={i * timeUnit}
                          y1="0"
                          x2={i * timeUnit}
                          y2="20"
                          stroke="hsl(var(--gantt-grid))"
                          strokeWidth="1"
                        />
                        <text
                          x={i * timeUnit}
                          y="35"
                          textAnchor="middle"
                          className="text-xs fill-gantt-text font-mono"
                        >
                          {i}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            </div>

            {/* Gantt chart */}
            <div 
              ref={chartRef}
              className="bg-gantt-bg rounded-lg p-4 overflow-x-auto"
              style={{ minWidth: maxTime * timeUnit + 100 }}
            >
              <div className="space-y-3">
                {ganttChart.length > 0 && (
                  <div className="relative">
                    {ganttChart.map((item, index) => (
                      <motion.div
                        key={`${item.processId}-${item.startTime}-${index}`}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ 
                          delay: index * 0.1,
                          duration: 0.3,
                          ease: "easeOut"
                        }}
                        className="absolute top-0 h-12 rounded border-2 border-background shadow-sm flex items-center justify-center text-sm font-medium text-primary-foreground"
                        style={{
                          left: item.startTime * timeUnit,
                          width: (item.endTime - item.startTime) * timeUnit,
                          backgroundColor: item.color,
                          transformOrigin: 'left center',
                        }}
                      >
                        <span className="truncate px-2 font-mono">
                          {item.pid}
                        </span>
                        
                        {/* Process execution indicator */}
                        <motion.div
                          className="absolute inset-0 bg-white/20 rounded-sm"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ 
                            delay: index * 0.1 + 0.3,
                            duration: (item.endTime - item.startTime) * 0.5,
                            ease: "linear"
                          }}
                        />
                      </motion.div>
                    ))}
                    
                    {/* Spacer for absolute positioning */}
                    <div style={{ height: '48px' }} />
                  </div>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3">
              {Array.from(new Set(ganttChart.map(item => item.processId)))
                .map(processId => {
                  const item = ganttChart.find(g => g.processId === processId);
                  return (
                    <motion.div
                      key={processId}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: processId * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="w-4 h-4 rounded border-2 border-background"
                        style={{ backgroundColor: item?.color }}
                      />
                      <span className="text-sm font-mono">{item?.pid}</span>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}