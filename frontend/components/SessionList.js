export default function SessionList({ sessions, currentSession, onSelectSession }) {
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Sessions</h4>
        
        {sessions.length === 0 ? (
          <p className="text-sm text-gray-500">No sessions yet</p>
        ) : (
          sessions.map((session) => (
            <button
              key={session._id}
              onClick={() => onSelectSession(session._id)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                currentSession?._id === session._id
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-sm text-gray-900 truncate">
                {session.name}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(session.updatedAt).toLocaleDateString()}
              </div>
            </button>
          ))
        )}
      </div>
    );
  }