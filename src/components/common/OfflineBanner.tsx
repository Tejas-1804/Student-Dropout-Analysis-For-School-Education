import React, { useState } from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { storageService } from '../../services/storage';

interface OfflineBannerProps {
  isOffline: boolean;
  onToggleOffline: () => void;
  lastSyncTime: string;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOffline,
  onToggleOffline,
  lastSyncTime
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    await storageService.syncCloudData();
    setIsSyncing(false);
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 2500);
  };

  const formattedDate = new Date(lastSyncTime).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const formattedTime = new Date(lastSyncTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      className={`w-full py-2 px-4 transition-colors duration-300 text-xs flex flex-wrap items-center justify-between border-b ${
        isOffline
          ? 'bg-amber-50 border-amber-200 text-amber-900'
          : 'bg-slate-900 border-slate-800 text-slate-300'
      }`}
    >
      <div className="flex items-center gap-3">
        {isOffline ? (
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-700 animate-pulse" />
            <span className="font-semibold text-amber-900">OFFLINE MODE ACTIVATED</span>
            <span className="hidden sm:inline text-amber-700">·</span>
            <span className="text-amber-800">
              Viewing synchronized local dataset. Changes will automatically queue for cloud push.
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300 font-medium">Cloud Synchronized</span>
            <span className="hidden sm:inline">·</span>
            <span>Last sync: {formattedDate} at {formattedTime}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mt-1 sm:mt-0">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
            isOffline
              ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
          title="Force refresh & sync with cloud backend"
        >
          {syncSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Synced</span>
            </>
          ) : (
            <>
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
            </>
          )}
        </button>

        <button
          onClick={onToggleOffline}
          className={`font-semibold underline underline-offset-2 ${
            isOffline ? 'text-amber-900 hover:text-amber-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          {isOffline ? 'Reconnect Online' : 'Simulate Offline'}
        </button>
      </div>
    </div>
  );
};
