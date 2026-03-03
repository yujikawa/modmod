import { useStore } from '../../store/useStore';
import { Database, ChevronDown, RefreshCcw } from 'lucide-react';
import { useState } from 'react';

const FileSelector = () => {
  const { availableFiles, currentModelSlug, setCurrentModel, isSidebarOpen, fetchAvailableFiles } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isSidebarOpen || availableFiles.length <= 0) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAvailableFiles();
    // Artificial delay to make the refresh animation visible
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const activeSlug = currentModelSlug || availableFiles[0]?.slug;

  return (
    <div className="px-4 mb-4">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Current Model
        </div>
        <button
          onClick={handleRefresh}
          className={`text-slate-500 hover:text-blue-400 transition-all p-0.5 rounded hover:bg-slate-800 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`}
          title="Refresh model list"
        >
          <RefreshCcw size={12} />
        </button>
      </div>
      <div className="relative group">
        <select
          value={activeSlug}
          onChange={(e) => setCurrentModel(e.target.value)}
          className="w-full pl-9 pr-8 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-100 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all shadow-sm cursor-pointer hover:bg-slate-750"
        >
          {availableFiles.map((file) => (
            <option key={file.slug} value={file.slug}>
              {file.name}
            </option>
          ))}
        </select>
        <Database size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-slate-300" />
      </div>
    </div>
  );
};

export default FileSelector;
