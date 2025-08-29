
🖥️ OS Scheduling Algorithms Visualizer
A web-based interactive tool to understand and simulate Operating System Scheduling Algorithms such as FCFS, SJF, Priority, and Round Robin. It is built with React + TailwindCSS and features a theme toggle (Light, Dark, Matte) for better accessibility.

🚀 Features
🔄 Multiple Scheduling Algorithms:

First Come First Serve (FCFS)

Shortest Job First (SJF)

Priority Scheduling

Round Robin

🎨 Theme Toggle (Light / Dark / Matte)

📊 Gantt Chart Visualization

📈 Displays Waiting Time, Turnaround Time, and CPU Utilization

⚡ Fast & Responsive UI built with React + TailwindCSS

🧑‍💻 Easy to extend and add new algorithms

🛠️ Tech Stack
React.js – Frontend framework

TailwindCSS – Styling with utility classes

Shadcn/UI – Prebuilt components (note: currently implemented with custom CSS due to single-file build limitations)

Framer Motion – Smooth animations (note: currently implemented with CSS transitions due to single-file build limitations)

TypeScript (optional, if included in your project)

📂 Project Structure
.
├── src
│ ├── components # Navbar, Sidebar, GanttChart, ThemeToggle
│ ├── algorithms # Scheduling algorithms implementation
│ ├── hooks # Theme and custom hooks
│ ├── App.tsx # Main application entry
│ └── index.css # Tailwind + custom CSS
├── public # Static assets
├── tailwind.config.js
├── package.json
└── README.md

⚡ Installation & Setup
Clone the repository

git clone [https://github.com/itsabhay83/os-scheduler-visualizer.git](https://github.com/itsabhay83/os-scheduler-visualizer.git)
cd os-scheduler-visualizer

Install dependencies

npm install

Start development server

npm run dev

Open in browser

http://localhost:8080

🎮 Usage
Choose an Algorithm from the sidebar, enter processes with their properties, and click "Run Simulation" to view the Gantt chart and performance statistics.

FCFS (First Come First Serve)
This non-preemptive algorithm simply executes processes in the order they arrive.

Example Input Processes
| Process | Arrival Time | Burst Time |
|---------|--------------|------------|
| P1      | 0            | 10         |
| P2      | 2            | 5          |
| P3      | 4            | 8          |

Simulation Results
| Metric                   | Value |
|--------------------------|-------|
| Average Waiting Time     | 6.33  |
| Average Turnaround Time  | 14.00 |
| CPU Utilization          | 100%  |

SJF (Shortest Job First)
This non-preemptive algorithm selects the process with the smallest burst time from the queue of available processes.

Example Input Processes
| Process | Arrival Time | Burst Time |
|---------|--------------|------------|
| P1      | 0            | 7          |
| P2      | 2            | 4          |
| P3      | 4            | 1          |
| P4      | 5            | 4          |

Simulation Results
| Metric                   | Value |
|--------------------------|-------|
| Average Waiting Time     | 4.00  |
| Average Turnaround Time  | 8.00  |
| CPU Utilization          | 100%  |

Priority Scheduling
This non-preemptive algorithm executes processes based on their assigned priority number. A smaller number indicates a higher priority.

Example Input Processes
| Process | Arrival Time | Burst Time | Priority |
|---------|--------------|------------|----------|
| P1      | 0            | 7          | 2        |
| P2      | 2            | 4          | 1        |
| P3      | 4            | 1          | 3        |

Simulation Results
| Metric                   | Value |
|--------------------------|-------|
| Average Waiting Time     | 4.00  |
| Average Turnaround Time  | 8.00  |
| CPU Utilization          | 100%  |

Round Robin
This preemptive algorithm assigns a small unit of CPU time, called a quantum, to each process in a cyclic fashion.

Example Input Processes (with a Quantum of 2)
| Process | Arrival Time | Burst Time |
|---------|--------------|------------|
| P1      | 0            | 10         |
| P2      | 2            | 5          |
| P3      | 4            | 8          |

Simulation Results
| Metric                   | Value  |
|--------------------------|--------|
| Average Waiting Time     | 10.00  |
| Average Turnaround Time  | 17.67  |
| CPU Utilization          | 100%   |

🎨 Theme Support
🌞 Light Mode

🌙 Dark Mode

🖤 Matte Mode (minimal black & white aesthetic)

You can toggle themes using the theme button in the top navigation bar.

🤝 Contribution
Contributions are welcome!

Fork the repo

Create a feature branch

Submit a Pull Request 🚀


👨‍💻 Author
Developed by Abhay Porwal ✨