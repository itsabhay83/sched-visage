import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  BarChart3, 
  Table2, 
  Settings2, 
  FileText, 
  Activity,
  Cpu,
  Clock,
  Layers
} from 'lucide-react';

const navigationItems = [
  { title: 'Dashboard', url: '/', icon: BarChart3 },
  { title: 'Process Table', url: '/processes', icon: Table2 },
  { title: 'Gantt Chart', url: '/gantt', icon: Activity },
  { title: 'Algorithms', url: '/algorithms', icon: Cpu },
  { title: 'Statistics', url: '/stats', icon: FileText },
];

const algorithmItems = [
  { title: 'FCFS', url: '/algorithms/fcfs', icon: Clock },
  { title: 'SJF', url: '/algorithms/sjf', icon: Clock },
  { title: 'Priority', url: '/algorithms/priority', icon: Layers },
  { title: 'Round Robin', url: '/algorithms/rr', icon: Clock },
  { title: 'Multilevel', url: '/algorithms/multilevel', icon: Layers },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === 'collapsed';
  
  const isActive = (path: string) => currentPath === path;
  const isAlgorithmGroupExpanded = algorithmItems.some(item => isActive(item.url));
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-accent text-accent-foreground font-medium' : 'hover:bg-accent/50';

  return (
    <Sidebar className={isCollapsed ? 'w-14' : 'w-64'}>
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Cpu className="h-4 w-4 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-semibold text-sm">CPU Scheduler</h1>
                <p className="text-xs text-muted-foreground">Visualizer</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Algorithms</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {algorithmItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/settings" className={getNavCls}>
                    <Settings2 className="mr-2 h-4 w-4 shrink-0" />
                    {!isCollapsed && <span>Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}