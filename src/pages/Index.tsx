import React from 'react';
import { motion } from 'framer-motion';
import { ProcessTable } from '@/components/ProcessTable';
import { GanttChart } from '@/components/GanttChart';
import { MetricsPanel } from '@/components/MetricsPanel';
import { AlgorithmSelector } from '@/components/AlgorithmSelector';

const Index = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">
          CPU Scheduling Visualizer
        </h1>
        <p className="text-xl text-muted-foreground">
          Interactive simulation of operating system scheduling algorithms
        </p>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Algorithm Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AlgorithmSelector />
        </motion.div>

        {/* Center Column - Process Table and Gantt Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2 space-y-6"
        >
          <ProcessTable />
          <GanttChart />
        </motion.div>
      </div>

      {/* Metrics Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <MetricsPanel />
      </motion.div>
    </div>
  );
};

export default Index;
