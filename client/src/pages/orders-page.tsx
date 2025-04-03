import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Order, OrderItem, Product } from "shared/src/schema.ts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Loader2, 
  ShoppingBag, 
  Package, 
  Truck, 
  CheckCircle, 
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "../components/ui/accordion";
import { Button } from "../components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../hooks/use-auth";
import MainLayout from "../components/layout/MainLayout";

// Type pour les commandes avec les produits associés
// Type pour les commandes avec les produits associés
type OrderWithItems = Order & { 
  items: (OrderItem & { product: Product })[] 
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Récupération des commandes de l'utilisateur
  const { data: orders, isLoading, error } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/orders/user"],
    enabled: !!user,
  });

  // Fonction pour obtenir le statut de la commande avec l'icône appropriée
  const getOrderStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case "en attente":
        return { 
          icon: <AlertCircle className="h-5 w-5" />, 
          color: "bg-yellow-100 text-yellow-800",
          label: "En attente"
        };
      case "confirmée":
        return { 
          icon: <ShoppingBag className="h-5 w-5" />, 
          color: "bg-blue-100 text-blue-800",
          label: "Confirmée"
        };
      case "préparée":
        return { 
          icon: <Package className="h-5 w-5" />, 
          color: "bg-indigo-100 text-indigo-800",
          label: "Préparée"
        };
      case "expédiée":
        return { 
          icon: <Truck className="h-5 w-5" />, 
          color: "bg-purple-100 text-purple-800",
          label: "Expédiée"
        };
      case "livrée":
        return { 
          icon: <CheckCircle className="h-5 w-5" />, 
          color: "bg-green-100 text-green-800",
          label: "Livrée"
        };
      default:
        return { 
          icon: <AlertCircle className="h-5 w-5" />, 
          color: "bg-gray-100 text-gray-800",
          label: status
        };
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString: Date) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
  };

  // Fonction pour ouvrir le modal de détails de commande
  const handleOrderClick = (order: OrderWithItems) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  // Si l'utilisateur n'est pas connecté ou en cours de chargement
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </MainLayout>
    );
  }

  // En cas d'erreur
  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 p-6 rounded-lg max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-red-700 mb-2">Erreur</h1>
            <p className="text-red-600">
              Nous n'avons pas pu récupérer vos commandes. Veuillez réessayer plus tard.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mes Commandes</h1>
        
        {/* Liste des commandes */}
        {orders && orders.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="hidden md:flex bg-gray-50 px-6 py-3 border-b">
              <div className="w-1/6 font-semibold text-gray-800">N° Commande</div>
              <div className="w-1/6 font-semibold text-gray-800">Date</div>
              <div className="w-1/6 font-semibold text-gray-800">Montant</div>
              <div className="w-1/6 font-semibold text-gray-800">Articles</div>
              <div className="w-1/6 font-semibold text-gray-800">Statut</div>
              <div className="w-1/6 font-semibold text-gray-800">Actions</div>
            </div>
            
            {/* Version desktop */}
            <div className="hidden md:block">
              {orders.map((order) => {
                const statusInfo = getOrderStatusInfo(order.status);
                return (
                  <div key={order.id} className="flex items-center px-6 py-4 border-b hover:bg-gray-50 transition-colors">
                    <div className="w-1/6 font-medium">{order.id}</div>
                    <div className="w-1/6 text-gray-600">{formatDate(order.createdAt)}</div>
                    <div className="w-1/6 font-medium">{order.totalAmount.toFixed(2)} €</div>
                    <div className="w-1/6 text-gray-600">{order.items.length} article(s)</div>
                    <div className="w-1/6">
                      <Badge variant="outline" className={`${statusInfo.color} font-medium flex items-center gap-1 whitespace-nowrap`}>
                        {statusInfo.icon} {statusInfo.label}
                      </Badge>
                    </div>
                    <div className="w-1/6">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOrderClick(order)}
                      >
                        Détails
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Version mobile */}
            <div className="md:hidden">
              <Accordion type="single" collapsible className="w-full">
                {orders.map((order) => {
                  const statusInfo = getOrderStatusInfo(order.status);
                  return (
                    <AccordionItem key={order.id} value={order.id.toString()}>
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex flex-col items-start text-left w-full">
                          <div className="flex justify-between items-center w-full">
                            <span className="font-semibold">Commande #{order.id}</span>
                            <Badge variant="outline" className={`${statusInfo.color} font-medium flex items-center gap-1 whitespace-nowrap`}>
                              {statusInfo.icon} {statusInfo.label}
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="px-4 pb-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total:</span>
                            <span className="font-medium">{order.totalAmount.toFixed(2)} €</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Articles:</span>
                            <span>{order.items.length} article(s)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Adresse:</span>
                            <span className="text-right">{order.shippingAddress}, {order.postalCode} {order.city}</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => handleOrderClick(order)}
                          >
                            Voir les détails
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Vous n'avez pas encore de commande</h2>
            <p className="text-gray-500 mb-6">
              Parcourez notre catalogue et faites votre première commande dès maintenant.
            </p>
            <Button asChild>
              <a href="/">Découvrir nos produits</a>
            </Button>
          </div>
        )}
        
        {/* Modal de détails de commande */}
        {selectedOrder && (
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>Commande #{selectedOrder.id}</DialogTitle>
                <DialogDescription>
                  Passée le {formatDate(selectedOrder.createdAt)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-6">
                {/* Statut de la commande */}
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">Statut de la commande</h3>
                    <Badge variant="outline" className={`${getOrderStatusInfo(selectedOrder.status).color} font-medium flex items-center gap-1 mt-1 whitespace-nowrap`}>
                      {getOrderStatusInfo(selectedOrder.status).icon} {getOrderStatusInfo(selectedOrder.status).label}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <h3 className="font-medium text-gray-800">Total</h3>
                    <p className="text-lg font-bold text-primary">{selectedOrder.totalAmount.toFixed(2)} €</p>
                  </div>
                </div>
                
                {/* Adresse de livraison */}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Adresse de livraison</h3>
                  <p className="text-gray-600">{selectedOrder.shippingAddress}</p>
                  <p className="text-gray-600">{selectedOrder.postalCode} {selectedOrder.city}</p>
                  <p className="text-gray-600">Téléphone: {selectedOrder.phone}</p>
                </div>
                
                {/* Liste des articles */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Articles ({selectedOrder.items.length})</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6 font-medium text-gray-700">Produit</div>
                        <div className="col-span-2 font-medium text-gray-700 text-center">Prix</div>
                        <div className="col-span-2 font-medium text-gray-700 text-center">Quantité</div>
                        <div className="col-span-2 font-medium text-gray-700 text-right">Total</div>
                      </div>
                    </div>
                    
                    <div className="divide-y">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="px-4 py-3">
                          <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-6 flex items-center">
                              <div className="w-12 h-12 mr-3 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                <img 
                                  src={item.product.imageUrl || "/placeholder-product.jpg"} 
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-800 line-clamp-1">{item.product.name}</h4>
                                <p className="text-sm text-gray-500 line-clamp-1">{item.product.description?.substring(0, 30)}</p>
                              </div>
                            </div>
                            <div className="col-span-2 text-center">{item.unitPrice.toFixed(2)} €</div>
                            <div className="col-span-2 text-center">{item.quantity}</div>
                            <div className="col-span-2 font-medium text-right">{(item.unitPrice * item.quantity).toFixed(2)} €</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-3 border-t">
                      <div className="flex justify-end">
                        <div className="w-1/3">
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">Sous-total:</span>
                            <span>{selectedOrder.totalAmount.toFixed(2)} €</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">Livraison:</span>
                            <span>Gratuite</span>
                          </div>
                          <div className="flex justify-between py-1 font-bold">
                            <span>Total:</span>
                            <span className="text-primary">{selectedOrder.totalAmount.toFixed(2)} €</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
}