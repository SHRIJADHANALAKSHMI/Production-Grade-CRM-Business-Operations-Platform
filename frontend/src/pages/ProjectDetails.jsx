import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Loader2, ArrowLeft, Plus, MoreVertical,
    Calendar, User, CheckCircle2, CircleDashed, Activity as ActivityIcon, Trash2
} from 'lucide-react';
import api from '../services/api.js';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext.jsx';
import {
    DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, useDroppable
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const PRIORITY_COLORS = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-emerald-100 text-emerald-700 border-emerald-200', // changed from blue to green as requested
};

const SortableTaskItem = ({ task, updateTaskStatus, deleteTask }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task._id,
        data: { type: "Task", task }
    });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group relative">
            <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-sm text-slate-800 line-clamp-2 pr-4">{task.title}</h4>
                <div className="relative group/dropdown z-10" onPointerDown={(e) => e.stopPropagation()}>
                    <button className="p-1 text-slate-400 hover:text-slate-600 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical size={14} />
                    </button>
                    <div className="absolute right-0 top-6 w-36 bg-white rounded-lg shadow-xl border border-slate-100 hidden group-hover/dropdown:block z-50 p-1">
                        <button onClick={() => updateTaskStatus(task._id, 'todo')} className="block w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 font-medium text-slate-700 rounded">Move to To Do</button>
                        <button onClick={() => updateTaskStatus(task._id, 'in-progress')} className="block w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 font-medium text-slate-700 rounded">In Progress</button>
                        <button onClick={() => updateTaskStatus(task._id, 'done')} className="block w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 font-medium text-slate-700 rounded">Complete</button>
                        <div className="h-px bg-slate-100 my-1"></div>
                        <button onClick={() => deleteTask(task._id)} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-xs hover:bg-red-50 font-bold text-red-600 rounded">
                            <Trash2 size={12} /> Delete
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-50">
                <div className="flex gap-2 items-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${PRIORITY_COLORS[task.priority]}`}>{task.priority.toUpperCase()}</span>
                    {task.dueDate && (
                        <span className="flex items-center gap-1 text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                            <Calendar size={10} /> {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                    )}
                </div>
                {task.assignedTo && (
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px] shadow-sm" title={task.assignedTo.name}>
                        {task.assignedTo.name?.charAt(0)}
                    </div>
                )}
            </div>
        </div>
    );
};

const TaskColumn = ({ title, statusKey, taskList, updateTaskStatus, deleteTask }) => {
    const { setNodeRef } = useDroppable({
        id: statusKey,
        data: { type: "Column", status: statusKey }
    });

    return (
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 flex flex-col h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">{title}</h3>
                <span className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">{taskList.length}</span>
            </div>
            <div ref={setNodeRef} className="flex-1 space-y-3 flex flex-col pb-6">
                <SortableContext id={statusKey} items={taskList.map(t => t._id)} strategy={verticalListSortingStrategy}>
                    {taskList.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-white/50 h-32 flex items-center justify-center">
                            <p className="text-sm font-medium">Drop tasks here</p>
                        </div>
                    ) : taskList.map(task => (
                        <SortableTaskItem key={task._id} task={task} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [activeDragTask, setActiveDragTask] = useState(null);

    const [taskForm, setTaskForm] = useState({ title: '', priority: 'medium', dueDate: '', assignedTo: '' });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => { fetchProjectData(); }, [id]);

    const fetchProjectData = async () => {
        try {
            const res = await api.get(`/projects/${id}`);
            setProject(res.data.data.project);
            setTasks(res.data.data.tasks);
            setActivities(res.data.data.activities);
        } catch (error) {
            toast.error('Failed to load workspace');
            navigate('/projects');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', { ...taskForm, project: id, status: "todo" });
            setShowTaskModal(false);
            setTaskForm({ title: '', priority: 'medium', dueDate: '', assignedTo: '' });
            toast.success("Task created");
            fetchProjectData();
        } catch (error) { toast.error(error.message); }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
        try {
            await api.patch(`/tasks/${taskId}`, { status: newStatus });
            fetchProjectData();
        } catch (error) { toast.error("Failed to sync status"); fetchProjectData(); }
    };

    const deleteTask = async (taskId) => {
        setTasks(prev => prev.filter(t => t._id !== taskId));
        try {
            await api.delete(`/tasks/${taskId}`);
            toast.success("Task deleted");
            fetchProjectData();
        } catch (error) { toast.error("Failed to delete task"); fetchProjectData(); }
    };

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveDragTask(active.data.current?.task);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveDragTask(null);
        if (!over) return;

        const taskId = active.id;
        const newStatus = over.id; // Usually mapped implicitly, or from Sortable context

        // Find which column dropped into based on container vs item over
        let targetStatus = newStatus;
        if (['todo', 'in-progress', 'done'].includes(newStatus)) {
            // Dropped on empty column context
        } else {
            // Dropped over another item
            const overTask = tasks.find(t => t._id === over.id);
            if (overTask) targetStatus = overTask.status;
        }

        const activeTask = tasks.find(t => t._id === taskId);
        if (!activeTask || activeTask.status === targetStatus) return;

        // Optimistic UI
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: targetStatus } : t));

        try {
            await api.patch(`/tasks/${taskId}`, { status: targetStatus });
            fetchProjectData();
        } catch (error) {
            toast.error("Failed to sync task move");
            fetchProjectData();
        }
    };

    if (isLoading || !project) return <div className="flex justify-center items-center h-[70vh]"><Loader2 className="animate-spin text-purple-600" size={48} /></div>;

    const columns = {
        'todo': tasks.filter(t => t.status === "todo"),
        'in-progress': tasks.filter(t => t.status === "in-progress"),
        'done': tasks.filter(t => t.status === "done")
    };

    return (
        <div className="pb-12 h-full flex flex-col max-w-7xl mx-auto">
            <div className="mb-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <button onClick={() => navigate('/projects')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-purple-600 transition-colors mb-4"><ArrowLeft size={16} /> Back to Projects</button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-extrabold text-slate-900">{project.name}</h1>
                            <span className="px-3 py-1 text-[10px] tracking-wider font-extrabold rounded-full bg-purple-100 text-purple-700 border border-purple-200 uppercase">{project.status}</span>
                        </div>
                        <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">Client Workspace: <span className="text-slate-800 font-bold">{project.client?.name || 'Unknown'}</span></p>
                    </div>
                    <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-2xl w-full md:w-80 border border-slate-100">
                        <div className="w-full">
                            <div className="flex justify-between items-center text-xs font-bold mb-2">
                                <span className="text-slate-700 uppercase tracking-wider">Project Health</span>
                                <span className={project.progress === 100 ? 'text-emerald-600' : 'text-purple-600'}>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div className={`h-2 rounded-full transition-all duration-1000 shadow-sm ${project.progress === 100 ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-purple-500/20'}`} style={{ width: `${project.progress}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
                <div className="flex-1 flex flex-col bg-white rounded-3xl p-6 shadow-sm border border-slate-200 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-extrabold text-slate-800">Task Board</h2>
                        <button onClick={() => setShowTaskModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all"><Plus size={16} /> New Task</button>
                    </div>

                    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                        <div className="flex-1 overflow-x-auto hide-scrollbar">
                            <div className="min-w-[900px] grid grid-cols-3 gap-6 h-full items-start">
                                <TaskColumn id="todo" title="To Do" statusKey="todo" taskList={columns['todo']} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} />
                                <TaskColumn id="in-progress" title="In Progress" statusKey="in-progress" taskList={columns['in-progress']} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} />
                                <TaskColumn id="done" title="Completed" statusKey="done" taskList={columns['done']} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} />
                            </div>
                        </div>
                        <DragOverlay>
                            {activeDragTask ? (
                                <div className="bg-white p-4 rounded-xl shadow-2xl border border-purple-500 rotate-2 opacity-90 cursor-grabbing">
                                    <h4 className="font-bold text-sm text-slate-800 line-clamp-2 pr-4">{activeDragTask.title}</h4>
                                    <div className="mt-3 flex gap-2"><span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${PRIORITY_COLORS[activeDragTask.priority]}`}>{activeDragTask.priority.toUpperCase()}</span></div>
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </div>

                <div className="w-full xl:w-96 flex flex-col gap-6">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-extrabold text-slate-800 flex items-center gap-2"><ActivityIcon size={18} /> Timeline</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-6 max-h-[500px]">
                            {activities.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center mt-4 border-2 border-dashed border-slate-100 p-4 rounded-xl">No activity logged.</p>
                            ) : activities.map((act, idx) => (
                                <div key={act._id} className="relative flex gap-4">
                                    {idx !== activities.length - 1 && <div className="absolute top-8 bottom-[-24px] left-[15px] w-px bg-slate-200"></div>}
                                    <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 shrink-0 border border-slate-200 flex items-center justify-center shadow-sm z-10">
                                        {act.action.includes('task') ? <CheckCircle2 size={12} className={act.action.includes('deleted') ? 'text-red-500' : ''} /> : <CircleDashed size={12} />}
                                    </div>
                                    <div className="pt-1.5 flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800">{act.description}</p>
                                        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">{new Date(act.createdAt).toLocaleString()} • {act.createdBy?.name || 'System'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showTaskModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"><h2 className="text-lg font-extrabold text-slate-800">Add New Task</h2><button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">&times;</button></div>
                        <form onSubmit={handleCreateTask} className="p-6">
                            <div className="mb-5"><label className="block text-sm font-bold text-slate-700 mb-2">Title</label><input type="text" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-medium text-slate-800" required autoFocus /></div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div><label className="block text-sm font-bold text-slate-700 mb-2">Priority</label><select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold text-slate-700 text-sm"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
                                <div><label className="block text-sm font-bold text-slate-700 mb-2">Due Date</label><input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold text-slate-700 text-sm" /></div>
                            </div>
                            <div className="mb-8"><label className="block text-sm font-bold text-slate-700 mb-2">Assignee</label><select value={taskForm.assignedTo} onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold text-slate-700 text-sm"><option value="">Unassigned</option><option value={user?.id}>Me ({user?.name})</option>{project.team?.filter(m => m._id !== user?.id).map(m => (<option key={m._id} value={m._id}>{m.name}</option>))}</select></div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100"><button type="button" onClick={() => setShowTaskModal(false)} className="px-5 py-2.5 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">Cancel</button><button type="submit" className="px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 hover:bg-purple-700 transition">Create Task</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ProjectDetails;
