import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Loader2, ArrowLeft, Plus, Clock, MoreVertical,
    Calendar, User, CheckCircle2, CircleDashed, Activity as ActivityIcon
} from 'lucide-react';
import api from '../services/api.js';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext.jsx';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [activities, setActivities] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [showTaskModal, setShowTaskModal] = useState(false);

    const [taskForm, setTaskForm] = useState({
        title: '',
        priority: 'medium',
        dueDate: '',
        assignedTo: ''
    });

    useEffect(() => {
        fetchProjectData();
    }, [id]);

    const fetchProjectData = async () => {
        try {
            setIsLoading(true);
            const res = await api.get(`/projects/${id}`);
            const { project: proj, tasks: tsk, activities: acts } = res.data.data;
            setProject(proj);
            setTasks(tsk);
            setActivities(acts);
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
            await api.post('/tasks', {
                ...taskForm,
                project: id,
                status: "todo"
            });
            setShowTaskModal(false);
            setTaskForm({ title: '', priority: 'medium', dueDate: '', assignedTo: '' });
            toast.success("Task added to workspace");
            fetchProjectData();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            await api.patch(`/tasks/${taskId}`, { status: newStatus });
            fetchProjectData();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (isLoading || !project) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <Loader2 className="animate-spin text-purple-600" size={48} />
            </div>
        );
    }

    const todoTasks = tasks.filter(t => t.status === "todo");
    const inProgressTasks = tasks.filter(t => t.status === "in-progress");
    const doneTasks = tasks.filter(t => t.status === "done");

    const PRIORITY_COLORS = {
        high: 'bg-red-100 text-red-700',
        medium: 'bg-yellow-100 text-yellow-700',
        low: 'bg-blue-100 text-blue-700',
    };

    // Kanban column renderer
    const TaskColumn = ({ title, statusKey, taskList }) => (
        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200 flex flex-col h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">{title}</h3>
                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{taskList.length}</span>
            </div>

            <div className="flex-1 space-y-3 flex flex-col">
                {taskList.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                        <p className="text-sm font-medium">No tasks</p>
                    </div>
                ) : taskList.map(task => (
                    <div key={task._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-sm text-slate-800 line-clamp-2">{task.title}</h4>
                            <div className="relative group/dropdown">
                                <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                                    <MoreVertical size={14} />
                                </button>
                                {/* Quick status dropdown inline */}
                                <div className="absolute right-0 top-6 w-32 bg-white rounded-lg shadow-xl border border-slate-100 hidden group-hover/dropdown:block z-10 p-1">
                                    <button onClick={() => updateTaskStatus(task._id, 'todo')} className="block w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 font-medium text-slate-700 rounded">Move to To Do</button>
                                    <button onClick={() => updateTaskStatus(task._id, 'in-progress')} className="block w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 font-medium text-slate-700 rounded">In Progress</button>
                                    <button onClick={() => updateTaskStatus(task._id, 'done')} className="block w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 font-medium text-slate-700 rounded">Complete</button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-50">
                            <div className="flex gap-2 items-center">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${PRIORITY_COLORS[task.priority]}`}>{task.priority.toUpperCase()}</span>
                                {task.dueDate && (
                                    <span className="flex items-center gap-1 text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                                        <Calendar size={10} /> {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                            {task.assignedTo && (
                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]" title={task.assignedTo.name}>
                                    {task.assignedTo.name?.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="pb-12 h-full flex flex-col max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <button
                    onClick={() => navigate('/projects')}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-purple-600 transition-colors mb-4"
                >
                    <ArrowLeft size={16} /> Back to Projects
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-extrabold text-slate-900">{project.name}</h1>
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-700 border border-purple-200 uppercase">
                                {project.status}
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
                            Client Workspace: <span className="text-slate-800 font-bold">{project.client?.name || 'Unknown Client'}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-2xl w-full md:w-80">
                        <div className="w-full">
                            <div className="flex justify-between items-center text-xs font-bold mb-2">
                                <span className="text-slate-700">Project Health</span>
                                <span className={project.progress === 100 ? 'text-emerald-600' : 'text-purple-600'}>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                                <div
                                    className={`h-2.5 rounded-full transition-all duration-1000 ${project.progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'}`}
                                    style={{ width: `${project.progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
                {/* Main Kanban Section */}
                <div className="flex-1 flex flex-col bg-white rounded-3xl p-6 shadow-sm border border-slate-200 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-extrabold text-slate-800">Task Board</h2>
                        <button
                            onClick={() => setShowTaskModal(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all"
                        >
                            <Plus size={16} /> New Task
                        </button>
                    </div>

                    <div className="flex-1 overflow-x-auto hide-scrollbar">
                        <div className="min-w-[900px] grid grid-cols-3 gap-6 h-full items-start">
                            <TaskColumn title="To Do" statusKey="todo" taskList={todoTasks} />
                            <TaskColumn title="In Progress" statusKey="in-progress" taskList={inProgressTasks} />
                            <TaskColumn title="Completed" statusKey="done" taskList={doneTasks} />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Section */}
                <div className="w-full xl:w-96 flex flex-col gap-6">
                    {/* Team Members */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-extrabold text-slate-800 flex items-center gap-2"><User size={18} /> Project Team</h2>
                            <button className="text-purple-600 hover:bg-purple-50 p-1.5 rounded-lg transition-colors"><Plus size={16} /></button>
                        </div>

                        <div className="space-y-4">
                            {/* Project Owner */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center">
                                    {project.owner?.name?.charAt(0) || 'O'}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{project.owner?.name || 'Owner'}</p>
                                    <p className="text-xs font-medium text-slate-500">Project Owner</p>
                                </div>
                            </div>

                            {/* Other Team Members */}
                            {project.team?.filter(m => m._id !== project.owner?._id).map((member) => (
                                <div key={member._id} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center border border-indigo-100">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{member.name}</p>
                                        <p className="text-xs font-medium text-slate-500">Member</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Meta Data */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                        <h2 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2"><CheckCircle2 size={18} /> Details</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium">Due Date</span>
                                <span className="font-bold text-slate-800">{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Not set'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium">Created</span>
                                <span className="font-bold text-slate-800">{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Activity Timeline */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex-1 min-h-[300px] overflow-hidden flex flex-col">
                        <h2 className="font-extrabold text-slate-800 mb-6 flex items-center gap-2"><ActivityIcon size={18} /> Recent Activity</h2>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                            {activities.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center mt-4">No activity logged yet.</p>
                            ) : activities.map((act, idx) => (
                                <div key={act._id} className="relative flex gap-4">
                                    {idx !== activities.length - 1 && <div className="absolute top-8 bottom-[-24px] left-[15px] w-px bg-slate-200"></div>}
                                    <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 shrink-0 border border-slate-200 flex items-center justify-center shadow-sm z-10">
                                        {act.action.includes('task') ? <CheckCircle2 size={12} /> : <CircleDashed size={12} />}
                                    </div>
                                    <div className="pt-1.5 flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800">{act.description}</p>
                                        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                                            {new Date(act.createdAt).toLocaleString()} • {act.createdBy?.name || 'System'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Task Creation Modal */}
            {showTaskModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-lg font-extrabold text-slate-800">Add New Task</h2>
                            <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
                        </div>
                        <form onSubmit={handleCreateTask} className="p-6">
                            <div className="mb-5">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Task Title</label>
                                <input
                                    type="text"
                                    value={taskForm.title}
                                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                                    placeholder="e.g. Gather technical specs"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium text-slate-800 box-shadow"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
                                    <select
                                        value={taskForm.priority}
                                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-bold text-slate-700 text-sm"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Due Date</label>
                                    <input
                                        type="date"
                                        value={taskForm.dueDate}
                                        onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-bold text-slate-700 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Assign To (Optional)</label>
                                <select
                                    value={taskForm.assignedTo}
                                    onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-bold text-slate-700 text-sm"
                                >
                                    <option value="">Unassigned</option>
                                    <option value={user?.id}>Me ({user?.name})</option>
                                    {project.team?.filter(m => m._id !== user?.id).map(m => (
                                        <option key={m._id} value={m._id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowTaskModal(false)} className="px-5 py-2.5 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 hover:bg-purple-700 transition">Create Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;
