'use client';

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center text-white">
        <h1 className="text-3xl font-bold mb-4">Download Coming Soon</h1>
        <p className="text-gray-300 mb-6">The mobile app is currently in development.</p>
        <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors">
          Get Notified
        </button>
      </div>
    </div>
  );
}