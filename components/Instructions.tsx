
import React from 'react';

export const Instructions: React.FC = () => {
  return (
    <div className="card mb-8 bg-blue-50 border border-blue-100">
      <h3 className="text-lg font-bold text-blue-800 mb-2">Como usar o Gerador</h3>
      <ul className="list-disc list-inside text-sm text-blue-700 space-y-2">
        <li>Preencha as informações básicas da sessão legislativa.</li>
        <li>No campo "Relato", insira os tópicos principais discutidos.</li>
        <li>Clique em <strong>Gerar Ata</strong> para que a IA estruture o texto formalmente.</li>
        <li>Revise o resultado e copie para o seu editor de documentos oficial.</li>
      </ul>
    </div>
  );
};
