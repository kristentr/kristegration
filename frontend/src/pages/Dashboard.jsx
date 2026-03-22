import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import StatsCard from '../components/StatsCard';
import toast from 'react-hot-toast';

const Dashboard = ({ socket }) => {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      const res = await fetch('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      return res.json();
    }
  });

  // Create task mutation
  const createMutation = useMutation({
    mutationFn: (taskData) => 
      fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task created!');
    }
  });

  // Update task mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) =>
      fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task updated!');
    }
  });

  // Real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on('taskUpdated', (task) => {
      queryClient.setQueryData(['tasks', user?.id], (old) =>
        old.map(t => t.id === task.id ? task : t)
      );
    });

    return () => {
      socket.off('taskUpdated');
    };
  }, [socket, queryClient, user?.id]);

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Tasks" value={tasks?.length || 0} />
        <StatsCard 
          title="Completed" 
          value={tasks?.filter(t => t.status === 'DONE').length || 0}
          color="green"
        />
        <StatsCard 
          title="Overdue" 
          value={tasks?.filter(t => 
            t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE'
          ).length || 0}
          color="red"
        />
        <StatsCard 
          title="High Priority" 
          value={tasks?.filter(t => t.priority === 'HIGH' || t.priority === 'URGENT').length || 0}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TaskForm onSubmit={(data) => createMutation.mutate(data)} />
          <TaskList 
            tasks={tasks || []}
          />
        </div>
        <div className="space-y-4">
          {/* Quick actions, filters, etc */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
