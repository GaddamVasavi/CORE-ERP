import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Plus } from 'lucide-react';

export const ProjectKanbanPage: React.FC = () => {
  const columns = [
    { title: 'To Do', tasks: [{ id: 'TSK-101', title: 'Architect Kafka partition schema', assignee: 'Alex M.', priority: 'HIGH' }] },
    { title: 'In Progress', tasks: [{ id: 'TSK-102', title: 'Implement Redis sliding window rate limiter', assignee: 'Elena R.', priority: 'URGENT' }] },
    { title: 'Review', tasks: [{ id: 'TSK-103', title: 'Review Flyway V3 migration scripts', assignee: 'David K.', priority: 'MEDIUM' }] },
    { title: 'Done', tasks: [{ id: 'TSK-104', title: 'Design double-entry GL ledger engine', assignee: 'Sarah C.', priority: 'HIGH' }] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Project Tasks — Kanban Board</h2>
          <p className="text-xs text-slate-500 mt-0.5">Sprint backlog and workflow execution.</p>
        </div>
        <Button size="sm" icon={<Plus className="w-4 h-4" />}>New Task</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col, idx) => (
          <div key={idx} className="bg-slate-100 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">{col.title}</h3>
              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">{col.tasks.length}</span>
            </div>
            <div className="space-y-2">
              {col.tasks.map((task) => (
                <div key={task.id} className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold text-blue-600">{task.id}</span>
                    <Badge variant={task.priority === 'URGENT' ? 'rose' : 'blue'}>{task.priority}</Badge>
                  </div>
                  <p className="text-xs font-semibold text-slate-900">{task.title}</p>
                  <div className="text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-100">
                    Assignee: {task.assignee}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
