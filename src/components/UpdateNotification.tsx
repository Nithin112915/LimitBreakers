'use client';

import { useAppUpdates } from '@/hooks/useAppUpdates';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function UpdateNotification() {
  const { updateAvailable, latestVersion, currentVersion, dismissUpdate } = useAppUpdates();

  if (!updateAvailable || !latestVersion) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ArrowDownTrayIcon className="h-6 w-6" />
          <div>
            <p className="font-semibold">
              New Version Available: v{latestVersion.version}
            </p>
            <p className="text-sm opacity-90">
              Current: v{currentVersion} → Update for latest features!
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <a
            href={latestVersion.downloadUrl}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Update
          </a>
          
          {!latestVersion.isRequired && (
            <button
              onClick={dismissUpdate}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Dismiss update notification"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      
      {latestVersion.isRequired && (
        <div className="mt-2 text-sm bg-red-500/20 p-2 rounded">
          ⚠️ This is a required update for security and compatibility.
        </div>
      )}
    </div>
  );
}
