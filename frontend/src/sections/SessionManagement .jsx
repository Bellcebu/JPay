import { useState } from 'react';
import SessionCard from '../components/sessionCard';
import SessionCounterCard from '../components/sessionCounterCard';
import Button from '../components/LogoutButton';

const SessionManagement = () => {
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Laptop - Chrome', lastActive: '2024-06-20 14:35', location: 'Madrid, España', daysActive: '2 días' },
    { id: 2, device: 'Móvil - Safari', lastActive: '2024-06-20 09:12', location: 'Barcelona, España', daysActive: '5 días' },
    { id: 3, device: 'Tablet - Firefox', lastActive: '2024-06-19 18:45', location: 'Valencia, España', daysActive: '1 día' },
  ]);

  const handleRemoveSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  return (
    <div className="w-full min-h-screen overflow-y-auto p-4">
      <section className="bg-white rounded-2xl p-8 space-y-7 max-w-3xl mx-auto shadow-md">

        <SessionCounterCard countActived={sessions.length} />

        {/* Lista de sesiones activas */}
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm border"
            >
              <SessionCard
                device={session.device}
                lastActive={session.lastActive}
                location={session.location}
                daysActive={session.daysActive}
              />

              <Button
                onClick={() => handleRemoveSession(session.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium ml-4"
              >
                X
              </Button>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
};

export default SessionManagement;
