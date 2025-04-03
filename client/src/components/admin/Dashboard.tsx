import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import SalesChart from "./SalesChart";
import { 
  ChevronUp, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Package 
} from "lucide-react";
import { Order, Product, User } from "shared/src/schema.ts";

export default function Dashboard() {
  // Fetch latest orders
  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
    staleTime: 60000,
  });

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
    staleTime: 60000,
  });

  // Fetch users
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    staleTime: 60000,
    queryFn: async () => {
      // This is a placeholder since we don't have an admin/users endpoint
      // In a real application, you would fetch from the appropriate endpoint
      return [];
    },
  });

  // Calculate dashboard statistics
  const totalSales = orders?.reduce((total, order) => total + order.totalAmount, 0) || 0;
  const totalOrders = orders?.length || 0;
  const totalProducts = products?.length || 0;
  const totalCustomers = users?.length || 0;

  // Calculate percentage change (placeholder for real data)
  const salesChange = 14.5;
  const ordersChange = 7.2;
  const productsChange = -2.8;
  const customersChange = 5.3;

  if (ordersLoading || productsLoading || usersLoading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Loading State */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart Loading State */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>

        {/* Recent Orders Loading State */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-12 w-2/3" />
                  <Skeleton className="h-12 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sales Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ventes totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className={`flex items-center ${salesChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {salesChange >= 0 ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronUp className="h-3 w-3 mr-1 transform rotate-180" />}
                {Math.abs(salesChange)}%
              </span>
              <span className="ml-1">vs semaine dernière</span>
            </p>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className={`flex items-center ${ordersChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {ordersChange >= 0 ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronUp className="h-3 w-3 mr-1 transform rotate-180" />}
                {Math.abs(ordersChange)}%
              </span>
              <span className="ml-1">vs semaine dernière</span>
            </p>
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className={`flex items-center ${customersChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {customersChange >= 0 ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronUp className="h-3 w-3 mr-1 transform rotate-180" />}
                {Math.abs(customersChange)}%
              </span>
              <span className="ml-1">vs semaine dernière</span>
            </p>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className={`flex items-center ${productsChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {productsChange >= 0 ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronUp className="h-3 w-3 mr-1 transform rotate-180" />}
                {Math.abs(productsChange)}%
              </span>
              <span className="ml-1">vs semaine dernière</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse des ventes</CardTitle>
          <CardDescription>Visualisez vos performances de vente au cours des derniers mois.</CardDescription>
        </CardHeader>
        <CardContent>
          <SalesChart />
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Commandes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders && orders.length > 0 ? (
              orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Commande #{order.id}</p>
                    <div className="text-sm text-muted-foreground">
                      <span>Client: {order.userId}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-4">{order.totalAmount.toFixed(2)} €</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status === 'completed' ? 'Livré' :
                       order.status === 'processing' ? 'En cours' :
                       order.status === 'pending' ? 'En attente' :
                       order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">Aucune commande récente</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Popular Products */}
      <Card>
        <CardHeader>
          <CardTitle>Produits populaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products && products.length > 0 ? (
              products.slice(0, 4).map((product) => (
                <div key={product.id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                  <div className="w-16 h-16 relative rounded overflow-hidden">
                    <img
                      src={product.imageUrl ?? ''}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <div className="flex items-center text-yellow-400 text-xs mt-1">
                      {Array(Math.floor(product.rating ?? 0)).fill(0).map((_, i) => (
                        <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                      <span className="text-gray-500 ml-1">({product.numReviews})</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm font-medium">{product.price.toFixed(2)} €</span>
                      <span className="text-xs text-green-600">En stock: {product.stock}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground col-span-2">Aucun produit disponible</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
