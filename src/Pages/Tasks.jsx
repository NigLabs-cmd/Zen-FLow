import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';


const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // 1. Fetch tasks from Supabase when the page opens
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.log('Error fetching tasks:', error);
    else setTasks(data);
  };

const addTask = async (e) => {
  e.preventDefault();
  if (!newTask.trim()) return;

  try {
    // 1. Get the current logged-in user from Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Session expired. Please log in again.");
      return;
    }

    // 2. Insert the task and EXPLICITLY include the user.id
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        { 
          title: newTask, 
          is_completed: false, 
          user_id: user.id  // This MUST be exactly user.id
        }
      ])
      .select();

    if (error) {
      // If RLS fails here, the error message in the console 
      // will tell us if it's a permission issue or a data issue.
      console.error("Supabase Error:", error);
      alert(error.message);
    } else if (data) {
      setTasks([data[0], ...tasks]);
      setNewTask('');
    }
  } catch (err) {
    console.error("Unexpected Error:", err);
  }
};
  // 3. Toggle completion
  const toggleComplete = async (id, currentStatus) => {
    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: !currentStatus })
      .eq('id', id);

    if (!error) {
      setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));
    }
  };

  // 4. Delete task
 const deleteTask = async (id) => {
    // 1. Attempt the delete in Supabase
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      // 2. If there's an error, we need to know what it is!
      console.error("Supabase Delete Error:", error.message);
      alert("Could not delete: " + error.message);
    } else {
      // 3. Only remove from UI if the database confirmed success
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const completedCount = tasks.filter(t => t.is_completed).length;
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <header className="mb-10">
        <h1 className="text-4xl font-black mb-2">Daily Tasks</h1>
        <p className="text-gray-500 font-medium">
          {completedCount} of {tasks.length} tasks completed
        </p>
        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 mt-4 rounded-full overflow-hidden">
          <motion.div 
            className="bg-indigo-600 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / tasks.length) * 100}%` }}
          />
        </div>
      </header>

      <form onSubmit={addTask} className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 outline-none focus:border-indigo-500 transition"
        />
        <button className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 transition">
          <Plus />
        </button>
      </form>

      <div className="space-y-3">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-4 bg-[#121212] p-4 rounded-2xl border border-white/10 mb-3 shadow-lg"
            >
              <button onClick={() => toggleComplete(task.id, task.is_completed)}>
                {task.is_completed ? (
                  <CheckCircle2 className="text-green-500" />
                ) : (
                  <Circle className="text-white/20 group-hover:text-indigo-400 transition-colors" />
                )}
              </button>
              <span className={`flex-1 font-medium ${task.is_completed ? 'line-through text-gray-400' : ''}`}>
                {task.title}
              </span>
              <button onClick={() => deleteTask(task.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
               aria-label="Delete task">
                <Trash2 size={18} className="stroke-current" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tasks;