import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Process {
  id: number;
  pid: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  remainingTime: number;
  startTime?: number;
  endTime?: number;
  waitingTime: number;
  turnaroundTime: number;
  responseTime: number;
  isCompleted: boolean;
}

export interface GanttItem {
  processId: number;
  pid: string;
  startTime: number;
  endTime: number;
  color: string;
}

export interface Metrics {
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
  cpuUtilization: number;
  throughput: number;
}

export type Algorithm = 'fcfs' | 'sjf' | 'sjf-preemptive' | 'priority' | 'priority-preemptive' | 'round-robin' | 'multilevel';

export interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  currentTime: number;
  speed: number; // ms per time unit
  readyQueue: Process[];
  completedProcesses: Process[];
  ganttChart: GanttItem[];
  metrics: Metrics | null;
}

interface SchedulerState {
  processes: Process[];
  algorithm: Algorithm;
  quantum: number;
  simulation: SimulationState;
  
  // Process management
  addProcess: (process: Omit<Process, 'id' | 'remainingTime' | 'waitingTime' | 'turnaroundTime' | 'responseTime' | 'isCompleted'>) => void;
  updateProcess: (id: number, updates: Partial<Process>) => void;
  deleteProcess: (id: number) => void;
  clearProcesses: () => void;
  generateRandomProcesses: (count: number) => void;
  importProcesses: (processes: Process[]) => void;
  
  // Algorithm and settings
  setAlgorithm: (algorithm: Algorithm) => void;
  setQuantum: (quantum: number) => void;
  
  // Simulation control
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  stepSimulation: () => void;
  setSpeed: (speed: number) => void;
  
  // Scheduling algorithms
  scheduleProcesses: () => void;
}

const initialSimulationState: SimulationState = {
  isRunning: false,
  isPaused: false,
  currentTime: 0,
  speed: 1000,
  readyQueue: [],
  completedProcesses: [],
  ganttChart: [],
  metrics: null,
};

export const useSchedulerStore = create<SchedulerState>()(
  persist(
    (set, get) => ({
      processes: [
        {
          id: 1,
          pid: 'P1',
          arrivalTime: 0,
          burstTime: 5,
          priority: 3,
          remainingTime: 5,
          waitingTime: 0,
          turnaroundTime: 0,
          responseTime: 0,
          isCompleted: false,
        },
        {
          id: 2,
          pid: 'P2',
          arrivalTime: 2,
          burstTime: 3,
          priority: 1,
          remainingTime: 3,
          waitingTime: 0,
          turnaroundTime: 0,
          responseTime: 0,
          isCompleted: false,
        },
        {
          id: 3,
          pid: 'P3',
          arrivalTime: 4,
          burstTime: 8,
          priority: 2,
          remainingTime: 8,
          waitingTime: 0,
          turnaroundTime: 0,
          responseTime: 0,
          isCompleted: false,
        },
      ],
      algorithm: 'fcfs',
      quantum: 2,
      simulation: initialSimulationState,

      addProcess: (processData) => {
        const processes = get().processes;
        const newId = Math.max(...processes.map(p => p.id), 0) + 1;
        const newProcess: Process = {
          ...processData,
          id: newId,
          remainingTime: processData.burstTime,
          waitingTime: 0,
          turnaroundTime: 0,
          responseTime: 0,
          isCompleted: false,
        };
        
        set((state) => ({
          processes: [...state.processes, newProcess]
        }));
      },

      updateProcess: (id, updates) => {
        set((state) => ({
          processes: state.processes.map(p => 
            p.id === id 
              ? { ...p, ...updates, remainingTime: updates.burstTime ?? p.remainingTime }
              : p
          )
        }));
      },

      deleteProcess: (id) => {
        set((state) => ({
          processes: state.processes.filter(p => p.id !== id)
        }));
      },

      clearProcesses: () => {
        set({ processes: [] });
      },

      generateRandomProcesses: (count) => {
        const newProcesses: Process[] = [];
        for (let i = 0; i < count; i++) {
          const id = i + 1;
          const arrivalTime = Math.floor(Math.random() * 10);
          const burstTime = Math.floor(Math.random() * 15) + 1;
          const priority = Math.floor(Math.random() * 5) + 1;
          
          newProcesses.push({
            id,
            pid: `P${id}`,
            arrivalTime,
            burstTime,
            priority,
            remainingTime: burstTime,
            waitingTime: 0,
            turnaroundTime: 0,
            responseTime: 0,
            isCompleted: false,
          });
        }
        
        set({ processes: newProcesses });
      },

      importProcesses: (processes) => {
        set({ processes });
      },

      setAlgorithm: (algorithm) => {
        set({ algorithm });
      },

      setQuantum: (quantum) => {
        set({ quantum });
      },

      startSimulation: () => {
        set((state) => ({
          simulation: {
            ...state.simulation,
            isRunning: true,
            isPaused: false,
          }
        }));
        get().scheduleProcesses();
      },

      pauseSimulation: () => {
        set((state) => ({
          simulation: {
            ...state.simulation,
            isRunning: false,
            isPaused: true,
          }
        }));
      },

      resetSimulation: () => {
        set((state) => ({
          simulation: {
            ...initialSimulationState,
          },
          processes: state.processes.map(p => ({
            ...p,
            remainingTime: p.burstTime,
            waitingTime: 0,
            turnaroundTime: 0,
            responseTime: 0,
            isCompleted: false,
            startTime: undefined,
            endTime: undefined,
          }))
        }));
      },

      stepSimulation: () => {
        // TODO: Implement step-by-step simulation
      },

      setSpeed: (speed) => {
        set((state) => ({
          simulation: {
            ...state.simulation,
            speed
          }
        }));
      },

      scheduleProcesses: () => {
        const { processes, algorithm, quantum } = get();
        
        // Reset processes
        const resetProcesses = processes.map(p => ({
          ...p,
          remainingTime: p.burstTime,
          waitingTime: 0,
          turnaroundTime: 0,
          responseTime: 0,
          isCompleted: false,
          startTime: undefined,
          endTime: undefined,
        }));

        let ganttChart: GanttItem[] = [];
        let currentTime = 0;
        let completedProcesses: Process[] = [];

        switch (algorithm) {
          case 'fcfs':
            ({ ganttChart, completedProcesses, currentTime } = fcfsScheduling(resetProcesses));
            break;
          case 'sjf':
            ({ ganttChart, completedProcesses, currentTime } = sjfScheduling(resetProcesses, false));
            break;
          case 'sjf-preemptive':
            ({ ganttChart, completedProcesses, currentTime } = sjfScheduling(resetProcesses, true));
            break;
          // TODO: Implement other algorithms
          default:
            ({ ganttChart, completedProcesses, currentTime } = fcfsScheduling(resetProcesses));
        }

        // Calculate metrics
        const metrics = calculateMetrics(completedProcesses, currentTime);

        set((state) => ({
          simulation: {
            ...state.simulation,
            ganttChart,
            completedProcesses,
            metrics,
            currentTime,
          }
        }));
      },
    }),
    {
      name: 'scheduler-storage',
      partialize: (state) => ({
        processes: state.processes,
        algorithm: state.algorithm,
        quantum: state.quantum,
      }),
    }
  )
);

// Scheduling Algorithms
function fcfsScheduling(processes: Process[]) {
  const ganttChart: GanttItem[] = [];
  const completedProcesses: Process[] = [];
  let currentTime = 0;
  
  // Sort by arrival time
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  for (const process of sortedProcesses) {
    // Wait for process to arrive
    if (currentTime < process.arrivalTime) {
      currentTime = process.arrivalTime;
    }
    
    const startTime = currentTime;
    const endTime = currentTime + process.burstTime;
    
    // Add to Gantt chart
    ganttChart.push({
      processId: process.id,
      pid: process.pid,
      startTime,
      endTime,
      color: getProcessColor(process.id),
    });
    
    // Calculate times
    const waitingTime = startTime - process.arrivalTime;
    const turnaroundTime = endTime - process.arrivalTime;
    const responseTime = startTime - process.arrivalTime;
    
    completedProcesses.push({
      ...process,
      startTime,
      endTime,
      waitingTime,
      turnaroundTime,
      responseTime,
      isCompleted: true,
    });
    
    currentTime = endTime;
  }
  
  return { ganttChart, completedProcesses, currentTime };
}

function sjfScheduling(processes: Process[], isPreemptive: boolean) {
  const ganttChart: GanttItem[] = [];
  const completedProcesses: Process[] = [];
  let currentTime = 0;
  let remainingProcesses = [...processes];
  
  while (remainingProcesses.some(p => !p.isCompleted)) {
    // Get available processes at current time
    const availableProcesses = remainingProcesses.filter(
      p => p.arrivalTime <= currentTime && !p.isCompleted
    );
    
    if (availableProcesses.length === 0) {
      // No process available, jump to next arrival
      const nextArrival = Math.min(...remainingProcesses.filter(p => !p.isCompleted).map(p => p.arrivalTime));
      currentTime = nextArrival;
      continue;
    }
    
    // Find process with shortest remaining time
    const shortestProcess = availableProcesses.reduce((shortest, current) => 
      current.remainingTime < shortest.remainingTime ? current : shortest
    );
    
    const startTime = currentTime;
    let executionTime = 1;
    
    if (!isPreemptive) {
      // Execute until completion
      executionTime = shortestProcess.remainingTime;
    }
    
    const endTime = currentTime + executionTime;
    
    // Record start time for response time calculation
    if (shortestProcess.startTime === undefined) {
      shortestProcess.startTime = startTime;
      shortestProcess.responseTime = startTime - shortestProcess.arrivalTime;
    }
    
    // Add to Gantt chart (merge consecutive same processes)
    const lastItem = ganttChart[ganttChart.length - 1];
    if (lastItem && lastItem.processId === shortestProcess.id && lastItem.endTime === startTime) {
      lastItem.endTime = endTime;
    } else {
      ganttChart.push({
        processId: shortestProcess.id,
        pid: shortestProcess.pid,
        startTime,
        endTime,
        color: getProcessColor(shortestProcess.id),
      });
    }
    
    // Update remaining time
    shortestProcess.remainingTime -= executionTime;
    currentTime = endTime;
    
    // If process is completed
    if (shortestProcess.remainingTime === 0) {
      shortestProcess.endTime = currentTime;
      shortestProcess.turnaroundTime = currentTime - shortestProcess.arrivalTime;
      shortestProcess.waitingTime = shortestProcess.turnaroundTime - shortestProcess.burstTime;
      shortestProcess.isCompleted = true;
      
      completedProcesses.push({ ...shortestProcess });
    }
  }
  
  return { ganttChart, completedProcesses, currentTime };
}

function calculateMetrics(processes: Process[], totalTime: number): Metrics {
  const n = processes.length;
  if (n === 0) return {
    averageWaitingTime: 0,
    averageTurnaroundTime: 0,
    averageResponseTime: 0,
    cpuUtilization: 0,
    throughput: 0,
  };
  
  const totalWaitingTime = processes.reduce((sum, p) => sum + p.waitingTime, 0);
  const totalTurnaroundTime = processes.reduce((sum, p) => sum + p.turnaroundTime, 0);
  const totalResponseTime = processes.reduce((sum, p) => sum + p.responseTime, 0);
  const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
  
  return {
    averageWaitingTime: Number((totalWaitingTime / n).toFixed(2)),
    averageTurnaroundTime: Number((totalTurnaroundTime / n).toFixed(2)),
    averageResponseTime: Number((totalResponseTime / n).toFixed(2)),
    cpuUtilization: Number(((totalBurstTime / totalTime) * 100).toFixed(2)),
    throughput: Number((n / totalTime).toFixed(2)),
  };
}

function getProcessColor(processId: number): string {
  const colors = [
    'hsl(var(--process-0))',
    'hsl(var(--process-1))',
    'hsl(var(--process-2))',
    'hsl(var(--process-3))',
    'hsl(var(--process-4))',
    'hsl(var(--process-5))',
    'hsl(var(--process-6))',
    'hsl(var(--process-7))',
  ];
  
  return colors[(processId - 1) % colors.length];
}