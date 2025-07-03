// src/components/admin/ClientsList.tsx

import React from "react";

const ClientsList = () => {
interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
}

const clients: Client[] = []; // Tu peux remplacer ça par les données récupérées depuis une API

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Liste des clients</h2>
      {clients.length === 0 ? (
        <p className="text-gray-500">Aucun client trouvé.</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Nom</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Téléphone</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="border px-4 py-2">{client.name}</td>
                <td className="border px-4 py-2">{client.email}</td>
                <td className="border px-4 py-2">{client.phone}</td>
                <td className="border px-4 py-2">
                  <button className="text-blue-600 hover:underline">Voir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClientsList;
