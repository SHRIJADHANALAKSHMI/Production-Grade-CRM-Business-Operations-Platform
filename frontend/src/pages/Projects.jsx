import { useState, useEffect } from 'react';
import { Briefcase, Loader2, ArrowRight, Clock, CheckCircle2, CircleDashed } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import toast from 'react-hot-toast';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects');
                setProjects(res.data.data);
            } catch (error) {
                toast.error('Failed to load projects');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const STATUS_BADGE = {
        planning: 'bg-slate-100 text-slate-700',
        active: 'bg-blue-100 text-blue-700 border-blue-200',
        completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        cancelled: 'bg-red-100 text-red-700',
    };

    const getStatusIcon = (status) => {
        if (status === 'completed') return <CheckCircle2 size={16} />;
        if (status === 'active') return <CircleDashed size={16} className="animate-[spin_4s_linear_infinite]" />;
        return <Clock size={16} />;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <Loader2 className="animate-spin text-purple-600" size={48} />
            </div>
        );
    }

    return (
        <div className="pb-12 h-full flex flex-col">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Projects</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage implementation and handovers.</p>
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                        <Briefcase size={32} className="text-slate-300" />
                    </div>
                    <p className="text-xl font-bold text-slate-600 mb-2">No active projects</p>
                    <p className="text-sm font-medium">Projects are automatically created when leads convert.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <Link
                            to={`/projects/${project._id}`}
                            key={project._id}
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300 transition-all duration-300 group flex flex-col"
                        >
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${STATUS_BADGE[project.status] || 'bg-slate-100'}`}>
                                        {getStatusIcon(project.status)}
                                        <span className="uppercase tracking-wider">{project.status}</span>
                                    </span>

                                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-sm border-2 border-white shadow-sm" title={`Assigned to ${project.owner?.name}`}>
                                        {project.owner?.name?.charAt(0) || '?'}
                                    </div>
                                </div>

                                <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1">{project.name}</h3>
                                <p className="text-sm font-medium text-slate-500 mb-6">
                                    Client: {project.client?.name || <span className="text-red-400 italic">Unknown Client</span>}
                                </p>

                                {/* Progress Bar */}
                                <div>
                                    <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-2">
                                        <span>Progress</span>
                                        <span className={project.progress === 100 ? 'text-emerald-600' : 'text-purple-600'}>{project.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-1000 ${project.progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'}`}
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                    <p className="text-xs font-medium text-slate-400 text-right">
                                        {project.tasks?.filter(t => t.completed).length || 0} of {project.tasks?.length || 0} tasks
                                    </p>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex items-center justify-between text-sm font-medium text-slate-500 group-hover:text-purple-700 group-hover:bg-purple-50 transition-colors">
                                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1 font-bold">Open <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Projects;
