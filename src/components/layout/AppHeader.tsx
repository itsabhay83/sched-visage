import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, SkipForward, Settings } from 'lucide-react';
import { useSchedulerStore } from '@/stores/schedulerStore';

export function AppHeader() {
  const { 
    simulation, 
    startSimulation, 
    pauseSimulation, 
    resetSimulation, 
    stepSimulation 
  } = useSchedulerStore();

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-8 w-8" />
          
          <div className="flex items-center gap-1">
            <Button
              variant={simulation.isRunning ? "secondary" : "default"}
              size="sm"
              onClick={simulation.isRunning ? pauseSimulation : startSimulation}
              className="h-8"
            >
              {simulation.isRunning ? (
                <Pause className="h-3 w-3 mr-1" />
              ) : (
                <Play className="h-3 w-3 mr-1" />
              )}
              {simulation.isRunning ? 'Pause' : 'Play'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={stepSimulation}
              disabled={simulation.isRunning}
              className="h-8"
            >
              <SkipForward className="h-3 w-3" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetSimulation}
              className="h-8"
            >
              <Square className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground hidden sm:block">
            CPU Scheduling Visualizer
          </div>
          
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}