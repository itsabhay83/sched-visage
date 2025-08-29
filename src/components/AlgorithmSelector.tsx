import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Clock, Layers, Zap, RotateCcw } from 'lucide-react';
import { useSchedulerStore, type Algorithm } from '@/stores/schedulerStore';

const algorithms = [
  {
    value: 'fcfs' as Algorithm,
    label: 'First Come First Served (FCFS)',
    description: 'Non-preemptive scheduling based on arrival time',
    icon: Clock,
    complexity: 'O(n)',
    pros: ['Simple to understand', 'No starvation'],
    cons: ['Poor average waiting time', 'Convoy effect'],
  },
  {
    value: 'sjf' as Algorithm,
    label: 'Shortest Job First (SJF)',
    description: 'Non-preemptive scheduling by burst time',
    icon: Zap,
    complexity: 'O(n log n)',
    pros: ['Optimal average waiting time', 'Minimal turnaround time'],
    cons: ['Starvation possible', 'Requires burst time prediction'],
  },
  {
    value: 'sjf-preemptive' as Algorithm,
    label: 'Shortest Remaining Time First (SRTF)',
    description: 'Preemptive version of SJF',
    icon: Zap,
    complexity: 'O(n²)',
    pros: ['Better response time', 'Optimal for preemptive'],
    cons: ['More context switches', 'Complex implementation'],
  },
  {
    value: 'priority' as Algorithm,
    label: 'Priority Scheduling',
    description: 'Non-preemptive priority-based scheduling',
    icon: Layers,
    complexity: 'O(n log n)',
    pros: ['Important processes first', 'Flexible priority assignment'],
    cons: ['Starvation of low priority', 'Priority inversion'],
  },
  {
    value: 'priority-preemptive' as Algorithm,
    label: 'Preemptive Priority',
    description: 'Preemptive priority-based scheduling',
    icon: Layers,
    complexity: 'O(n²)',
    pros: ['Real-time responsiveness', 'Dynamic priority handling'],
    cons: ['High context switching', 'Complex priority management'],
  },
  {
    value: 'round-robin' as Algorithm,
    label: 'Round Robin (RR)',
    description: 'Time-sliced preemptive scheduling',
    icon: RotateCcw,
    complexity: 'O(n)',
    pros: ['Fair time sharing', 'Good response time', 'No starvation'],
    cons: ['Performance depends on quantum', 'Higher turnaround time'],
  },
  {
    value: 'multilevel' as Algorithm,
    label: 'Multilevel Queue',
    description: 'Multiple queues with different algorithms',
    icon: Layers,
    complexity: 'O(n log n)',
    pros: ['Flexible design', 'Different process types'],
    cons: ['Complex configuration', 'Potential unfairness'],
  },
];

export function AlgorithmSelector() {
  const { algorithm, quantum, setAlgorithm, setQuantum, scheduleProcesses } = useSchedulerStore();
  
  const selectedAlgorithm = algorithms.find(alg => alg.value === algorithm);
  const needsQuantum = algorithm === 'round-robin' || algorithm === 'multilevel';

  const handleAlgorithmChange = (newAlgorithm: Algorithm) => {
    setAlgorithm(newAlgorithm);
  };

  const handleRunSimulation = () => {
    scheduleProcesses();
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Scheduling Algorithm</CardTitle>
        <CardDescription>
          Select and configure the CPU scheduling algorithm
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Algorithm Selection */}
        <div className="space-y-3">
          <Label htmlFor="algorithm">Algorithm</Label>
          <Select value={algorithm} onValueChange={handleAlgorithmChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {algorithms.map((alg) => (
                <SelectItem key={alg.value} value={alg.value}>
                  <div className="flex items-center gap-2">
                    <alg.icon className="h-4 w-4" />
                    <span>{alg.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Quantum for Round Robin */}
        {needsQuantum && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <Label htmlFor="quantum">Time Quantum</Label>
            <div className="flex items-center gap-2">
              <Input
                id="quantum"
                type="number"
                min="1"
                max="10"
                value={quantum}
                onChange={(e) => setQuantum(parseInt(e.target.value) || 1)}
                className="w-24 font-mono"
              />
              <span className="text-sm text-muted-foreground">time units</span>
            </div>
          </motion.div>
        )}

        {/* Algorithm Details */}
        {selectedAlgorithm && (
          <motion.div
            key={selectedAlgorithm.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-muted/50 rounded-lg space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <selectedAlgorithm.icon className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">{selectedAlgorithm.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedAlgorithm.description}
                </p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {selectedAlgorithm.complexity}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-success mb-2">Advantages</h4>
                <ul className="space-y-1">
                  {selectedAlgorithm.pros.map((pro, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-success rounded-full" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-warning mb-2">Disadvantages</h4>
                <ul className="space-y-1">
                  {selectedAlgorithm.cons.map((con, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-warning rounded-full" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Run Simulation Button */}
        <Button 
          onClick={handleRunSimulation}
          className="w-full bg-gradient-primary shadow-glow"
          size="lg"
        >
          <Clock className="h-4 w-4 mr-2" />
          Run Simulation
        </Button>
      </CardContent>
    </Card>
  );
}