import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Plus, Edit2, Trash } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

type Discount = {
  id: number;
  title: string;
  percent: number;
  active: boolean; // Added the 'active' property
};

const discountSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  percentage: z.number().min(1).max(100),
});

export default function DiscountsPage() {
  const [localDiscounts, setLocalDiscounts] = useState<Discount[]>([]);
  const [name, setName] = useState<string>("");
  const [percentage, setPercentage] = useState<string | number>("");

  useEffect(() => {
    fetch("/api/discounts")
      .then((res) => res.json())
      .then(setLocalDiscounts)
      .catch((err) => console.error("Erreur lors du chargement des réductions :", err));
  }, []);

  const {
    data: discounts = [],
    isLoading,
    error,
  } = useQuery<Discount[]>({
    queryKey: ["discounts"],
    queryFn: async () => {
      const res = await fetch("/api/discounts");
      if (!res.ok) throw new Error("Erreur lors du chargement");
      return res.json();
    },
  });

  const queryClient = useQueryClient();

  const addDiscount = useMutation({
    mutationFn: async () => {
      const validated = discountSchema.parse({
        name,
        percentage: Number(percentage),
      });
      const res = await fetch("/api/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      setName("");
      setPercentage("");
    },
  });

  const deleteDiscount = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/discounts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Réductions</h1>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Nom de la réduction"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-3 py-2 rounded-md"
        />
        <input
          type="number"
          placeholder="%"
          value={percentage}
          onChange={(e) => setPercentage(e.target.value === "" ? "" : +e.target.value)}
          className="border px-3 py-2 rounded-md w-20"
        />
        <Button
          onClick={() => addDiscount.mutate()}
          disabled={!name || !percentage}
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
              <th className="px-4 py-2">Pourcentage</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr key={discount.id} className="border-b">
                <td className="px-4 py-2">{discount.title}</td>
                <td className="px-4 py-2">{discount.percent}%</td>
                <td className="px-4 py-2 flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteDiscount.mutate(discount.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Réductions Actives</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une réduction
        </Button>
      </div>
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Titre</th>
            <th className="px-4 py-2">Pourcentage</th>
            <th className="px-4 py-2">Statut</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount) => (
            <tr key={discount.id} className="border-b">
              <td className="px-4 py-2">{discount.title}</td>
              <td className="px-4 py-2">{discount.percent}%</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    discount.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {discount.active ? "Actif" : "Inactif"}
                </span>
              </td>
              <td className="px-4 py-2 flex gap-2">
                <Button size="sm" variant="outline">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function setName(arg0: string) {
  throw new Error("Function not implemented.");
}

