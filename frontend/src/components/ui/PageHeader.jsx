const PageHeader = ({ title, description, children }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
                {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
            </div>
            {children && <div className="flex items-center gap-3">{children}</div>}
        </div>
    );
};

export default PageHeader;
