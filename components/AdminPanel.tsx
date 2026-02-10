
import React from 'react';
import { UserManagement } from './auth/UserManagement.tsx';

export const AdminPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Painel Administrativo</h2>
        <p className="text-gray-600">Gestão de usuários e permissões do sistema legislativo local.</p>
      </div>
      <UserManagement />
    </div>
  );
};
