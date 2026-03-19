const TaskList = ({ tasks }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="p-3 border rounded hover:bg-gray-50">
              {task.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
