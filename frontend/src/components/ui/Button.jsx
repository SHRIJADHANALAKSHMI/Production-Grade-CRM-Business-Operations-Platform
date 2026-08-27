import { Loader2 } from 'lucide-react';

const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
    danger: 'text-red-500 hover:bg-red-50',
    ghost: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
};

const Button = ({ children, onClick, type = 'button', variant = 'primary', isLoading = false, disabled = false, className = '', icon: Icon, ...props }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`flex items-center justify-center gap-2 font-medium px-4 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
            ) : (
                <>
                    {Icon && <Icon size={18} />}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
