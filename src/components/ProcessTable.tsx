import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Shuffle, Download, Upload } from 'lucide-react';
import { useSchedulerStore, type Process } from '@/stores/schedulerStore';

export function ProcessTable() {
  const { 
    processes, 
    addProcess, 
    updateProcess, 
    deleteProcess, 
    clearProcesses,
    generateRandomProcesses 
  } = useSchedulerStore();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);
  const [newProcess, setNewProcess] = useState({
    pid: '',
    arrivalTime: 0,
    burstTime: 1,
    priority: 1,
  });

  const handleAddProcess = () => {
    if (!newProcess.pid.trim()) return;
    
    addProcess(newProcess);
    setNewProcess({ pid: '', arrivalTime: 0, burstTime: 1, priority: 1 });
    setIsAddDialogOpen(false);
  };

  const handleEditProcess = (process: Process) => {
    setEditingProcess(process);
    setNewProcess({
      pid: process.pid,
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      priority: process.priority,
    });
  };

  const handleUpdateProcess = () => {
    if (!editingProcess || !newProcess.pid.trim()) return;
    
    updateProcess(editingProcess.id, newProcess);
    setEditingProcess(null);
    setNewProcess({ pid: '', arrivalTime: 0, burstTime: 1, priority: 1 });
  };

  const handleRandomGenerate = () => {
    generateRandomProcesses(5);
  };

  const getProcessColorClass = (id: number) => {
    return `process-color-${(id - 1) % 8}`;
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Process Table</CardTitle>
            <CardDescription>
              Manage processes for scheduling simulation
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRandomGenerate}>
              <Shuffle className="h-4 w-4 mr-1" />
              Random
            </Button>
            
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" />
              Import
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Process
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Process</DialogTitle>
                </DialogHeader>
                <ProcessForm
                  process={newProcess}
                  onChange={setNewProcess}
                  onSubmit={handleAddProcess}
                  onCancel={() => setIsAddDialogOpen(false)}
                  submitLabel="Add Process"
                />
              </DialogContent>
            </Dialog>

            <Dialog open={!!editingProcess} onOpenChange={(open) => !open && setEditingProcess(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Process</DialogTitle>
                </DialogHeader>
                <ProcessForm
                  process={newProcess}
                  onChange={setNewProcess}
                  onSubmit={handleUpdateProcess}
                  onCancel={() => setEditingProcess(null)}
                  submitLabel="Update Process"
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {processes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-muted-foreground mb-4">No processes added yet</div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Process
            </Button>
          </motion.div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Process ID</TableHead>
                  <TableHead>Arrival Time</TableHead>
                  <TableHead>Burst Time</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {processes.map((process, index) => (
                    <motion.tr
                      key={process.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell>
                        <div
                          className={`w-3 h-3 rounded-full ${getProcessColorClass(process.id)}`}
                        />
                      </TableCell>
                      <TableCell className="font-mono font-medium">
                        {process.pid}
                      </TableCell>
                      <TableCell>{process.arrivalTime}</TableCell>
                      <TableCell>{process.burstTime}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {process.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={process.isCompleted ? "default" : "outline"}
                          className={process.isCompleted ? "bg-success text-white" : ""}
                        >
                          {process.isCompleted ? 'Completed' : 'Ready'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProcess(process)}
                            className="h-7 w-7 p-0"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteProcess(process.id)}
                            className="h-7 w-7 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ProcessFormProps {
  process: { pid: string; arrivalTime: number; burstTime: number; priority: number };
  onChange: (process: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}

function ProcessForm({ process, onChange, onSubmit, onCancel, submitLabel }: ProcessFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="pid">Process ID</Label>
        <Input
          id="pid"
          value={process.pid}
          onChange={(e) => onChange({ ...process, pid: e.target.value })}
          placeholder="e.g., P1"
          className="font-mono"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="arrival">Arrival Time</Label>
          <Input
            id="arrival"
            type="number"
            min="0"
            value={process.arrivalTime}
            onChange={(e) => onChange({ ...process, arrivalTime: parseInt(e.target.value) || 0 })}
          />
        </div>
        
        <div>
          <Label htmlFor="burst">Burst Time</Label>
          <Input
            id="burst"
            type="number"
            min="1"
            value={process.burstTime}
            onChange={(e) => onChange({ ...process, burstTime: parseInt(e.target.value) || 1 })}
          />
        </div>
        
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Input
            id="priority"
            type="number"
            min="1"
            max="10"
            value={process.priority}
            onChange={(e) => onChange({ ...process, priority: parseInt(e.target.value) || 1 })}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} className="bg-gradient-primary">
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}