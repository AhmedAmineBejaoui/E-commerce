import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Order } from "shared/src/schema.ts";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye, Search, Filter, RefreshCcw } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import { Badge } from "../../components/ui/badge";

interface OrderDetailsDialogProps {
  order?: Order & { 
    items: Array<{ 
      id: number; 
      productId: number; 
      quantity: number; 
      unitPrice: number;
      product: {
        id: number;
        name: string;
        imageUrl?: string;
      }
    }>,
    user?: {
      id: number;
      username: string;
      email: string;
      firstName?: string;
      lastName?: string;
    }
  };
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: number, status: string) => void;
}

function OrderDetailsDialog({ order, isOpen, onClose, onUpdateStatus }: OrderDetailsDialogProps) {
  const [newStatus, setNewStatus] = useState(order?.status || "pending");

  const statusOptions = [
    { value: "pending", label: "En attente" },
    { value: "processing", label: "En préparation" },
    { value: "shipped", label: "Expédiée" },
    { value: "delivered", label: "Livrée" },
    { value: "cancelled", label: "Annulée" },
  ];

  const handleUpdateStatus = () => {
    if (order) {
      onUpdateStatus(order.id, newStatus);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la commande #{order.id}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Informations client</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p><span className="font-medium">Nom:</span> {order.user?.firstName} {order.user?.lastName}</p>
              <p><span className="font-medium">Email:</span> {order.user?.email}</p>
              <p><span className="font-medium">Identifiant:</span> {order.user?.username}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Informations livraison</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p><span className="font-medium">Adresse:</span> {order.shippingAddress}</p>
              <p><span className="font-medium">Ville:</span> {order.city}</p>
              <p><span className="font-medium">Code postal:</span> {order.postalCode}</p>
              <p><span className="font-medium">Téléphone:</span> {order.phone}</p>
            </div>
          </div>
        </div>

        <div className="my-4">
          <h3 className="text-lg font-semibold mb-2">Produits commandés</h3>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead className="text-right">Prix</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {item.product.imageUrl && (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-10 h-10 object-cover rounded-md mr-3"
                          />
                        )}
                        {item.product.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{item.unitPrice.toFixed(2)} €</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{(item.unitPrice * item.quantity).toFixed(2)} €</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {order.totalAmount.toFixed(2)} €
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Informations commande</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p><span className="font-medium">Date:</span> {format(new Date(order.createdAt), 'PPP', { locale: fr })}</p>
              <p><span className="font-medium">Méthode de paiement:</span> Paiement à la livraison</p>
              <p>
                <span className="font-medium">Statut:</span> 
                <Badge className="ml-2" variant={
                  order.status === "delivered" ? "secondary" :
                  order.status === "shipped" ? "default" :
                  order.status === "processing" ? "default" :
                  order.status === "cancelled" ? "destructive" :
                  "outline"
                }>
                  {
                    order.status === "pending" ? "En attente" :
                    order.status === "processing" ? "En préparation" :
                    order.status === "shipped" ? "Expédiée" :
                    order.status === "delivered" ? "Livrée" :
                    order.status === "cancelled" ? "Annulée" :
                    order.status
                  }
                </Badge>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Mettre à jour le statut</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="w-full mt-4" onClick={handleUpdateStatus}>
                Mettre à jour le statut
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function OrdersList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<(Order & { items: any[] }) | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery<
    Array<Order & { 
      items: Array<any>; 
      user?: {
        id: number;
        username: string;
        email: string;
        firstName?: string;
        lastName?: string;
      }
    }>
  >({
    queryKey: ["/api/admin/orders"],
    staleTime: 30000,
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/orders/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été mis à jour avec succès.",
        variant: "default",
      });
      setIsOrderDetailsOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: `Une erreur est survenue: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleOrderClick = (order: Order & { items: any[] }) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const handleUpdateStatus = (id: number, status: string) => {
    updateOrderStatusMutation.mutate({ id, status });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
  };

  // Filter orders based on search query and status filter
  const filteredOrders = orders?.filter((order) => {
    const matchesSearch = 
      searchQuery === "" || 
      order.id.toString().includes(searchQuery) ||
      (order.user?.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: "all", label: "Tous les statuts" },
    { value: "pending", label: "En attente" },
    { value: "processing", label: "En préparation" },
    { value: "shipped", label: "Expédiée" },
    { value: "delivered", label: "Livrée" },
    { value: "cancelled", label: "Annulée" },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commandes</CardTitle>
          <CardDescription>Gérer les commandes des clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commandes</CardTitle>
        <CardDescription>Gérer les commandes des clients</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher une commande..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" size="icon" onClick={handleRefresh} title="Rafraîchir">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {filteredOrders && filteredOrders.length > 0 ? (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p>{order.user?.username || "Utilisateur inconnu"}</p>
                        <p className="text-sm text-gray-500">{order.user?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), 'dd MMM yyyy', { locale: fr })}
                    </TableCell>
                    <TableCell>{order.totalAmount.toFixed(2)} €</TableCell>
                    <TableCell>
                      <Badge variant={
                        order.status === "delivered" ? "secondary" :
                        order.status === "shipped" ? "default" :
                        order.status === "processing" ? "default" :
                        order.status === "cancelled" ? "destructive" :
                        "outline"
                      }>
                        {
                          order.status === "pending" ? "En attente" :
                          order.status === "processing" ? "En préparation" :
                          order.status === "shipped" ? "Expédiée" :
                          order.status === "delivered" ? "Livrée" :
                          order.status === "cancelled" ? "Annulée" :
                          order.status
                        }
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOrderClick(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-md">
            <p className="text-gray-500">Aucune commande trouvée</p>
          </div>
        )}

        {selectedOrder && (
          <OrderDetailsDialog
            order={selectedOrder}
            isOpen={isOrderDetailsOpen}
            onClose={() => setIsOrderDetailsOpen(false)}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </CardContent>
    </Card>
  );
}
