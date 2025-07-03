import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Plus, Edit2, Trash } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
});

type Category = {
  id: number;
  name: string;
};

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [newCategoryName, setNewCategoryName] = useState("");

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Erreur lors du chargement des catégories");
      return res.json();
    },
  });

  const addCategory = useMutation({
    mutationFn: async (name: string) => {
      const validated = categorySchema.parse({ name });
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setNewCategoryName("");
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Catégories</h1>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Nouvelle catégorie"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="border px-3 py-2 rounded-md"
        />
        <Button
          onClick={() => addCategory.mutate(newCategoryName)}
          disabled={addCategory.status === "pending"}
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter
        </Button>
      </div>

      {isLoading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="text-red-500">Erreur : {error.message}</p>
      ) : (
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b">
                <td className="px-4 py-2">{category.name}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteCategory.mutate(category.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
