
import React from 'react';

export const UserManagement: React.FC = () => {
  // Static example for UI purposes as Supabase needs service role for user listing
  const mockUsers = [
    { email: 'admin@legislativo.gov.br', role: 'Administrador', status: 'Ativo' },
    { email: 'vereador1@legislativo.gov.br', role: 'Usuário', status: 'Ativo' },
    { email: 'secretaria@legislativo.gov.br', role: 'Usuário', status: 'Ativo' },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Usuários Cadastrados</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 font-medium text-sm text-gray-600">E-mail</th>
              <th className="p-3 font-medium text-sm text-gray-600">Função</th>
              <th className="p-3 font-medium text-sm text-gray-600">Status</th>
              <th className="p-3 font-medium text-sm text-gray-600 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((u, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm">{u.email}</td>
                <td className="p-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${u.role === 'Administrador' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-3 text-sm">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    {u.status}
                  </span>
                </td>
                <td className="p-3 text-sm text-right">
                  <button className="text-blue-600 hover:underline">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
