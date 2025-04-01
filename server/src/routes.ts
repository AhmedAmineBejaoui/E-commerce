import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertProductSchema, insertCategorySchema, insertOrderSchema, insertCartItemSchema } from "server/src/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des catégories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Catégorie non trouvée" });
      }
      res.json(category);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération de la catégorie" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      let products;
      if (req.query.category) {
        const category = await storage.getCategoryBySlug(req.query.category as string);
        if (!category) {
          return res.status(404).json({ message: "Catégorie non trouvée" });
        }
        products = await storage.getProductsByCategory(category.id);
      } else if (req.query.featured === "true") {
        products = await storage.getFeaturedProducts();
      } else if (req.query.new === "true") {
        products = await storage.getNewProducts();
      } else {
        products = await storage.getProducts();
      }
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des produits" });
    }
  });
  
  // Route spécifique pour nouveautés
  app.get("/api/products/new", async (req, res) => {
    try {
      const newProducts = await storage.getNewProducts();
      res.json(newProducts);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des nouveaux produits" });
    }
  });
  
  // Route spécifique pour produits en promotion
  app.get("/api/products/promo", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const promoProducts = products.filter(product => product.discountPrice !== null);
      res.json(promoProducts);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des produits en promotion" });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération du produit" });
    }
  });

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    
    try {
      const cartItems = await storage.getCartItems(req.user.id);
      res.json(cartItems);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération du panier" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    
    try {
      const validatedData = insertCartItemSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: err.errors });
      }
      res.status(500).json({ message: "Erreur lors de l'ajout au panier" });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const quantity = req.body.quantity;
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
      
      if (typeof quantity !== "number" || quantity < 1) {
        return res.status(400).json({ message: "Quantité invalide" });
      }
      
      const updatedCartItem = await storage.updateCartItemQuantity(id, quantity);
      if (!updatedCartItem) {
        return res.status(404).json({ message: "Élément du panier non trouvé" });
      }
      
      res.json(updatedCartItem);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la mise à jour du panier" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
      
      const result = await storage.removeFromCart(id);
      if (!result) {
        return res.status(404).json({ message: "Élément du panier non trouvé" });
      }
      
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la suppression de l'élément du panier" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    
    try {
      await storage.clearCart(req.user.id);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la suppression du panier" });
    }
  });

  // Order routes
  app.get("/api/orders/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    
    try {
      const orders = await storage.getUserOrders(req.user.id);
      
      // Enhance orders with items
      const ordersWithItems = await Promise.all(orders.map(async (order) => {
        const items = await storage.getOrderItems(order.id);
        
        // Add product details to each item
        const itemsWithProducts = await Promise.all(items.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return { ...item, product };
        }));
        
        return { ...order, items: itemsWithProducts };
      }));
      
      res.json(ordersWithItems);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des commandes" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    
    try {
      // Get cart items
      const cartItems = await storage.getCartItems(req.user.id);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Le panier est vide" });
      }
      
      // Calculate total amount
      const totalAmount = cartItems.reduce((total, item) => {
        const price = item.product.discountPrice || item.product.price;
        return total + (price * item.quantity);
      }, 0);
      
      // Validate order data
      const validatedData = insertOrderSchema.parse({
        ...req.body,
        userId: req.user.id,
        totalAmount,
        status: "pending"
      });
      
      // Create order
      const order = await storage.createOrder(validatedData);
      
      // Create order items
      for (const item of cartItems) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.product.discountPrice || item.product.price
        });
        
        // Update product stock
        const product = await storage.getProduct(item.productId);
        if (product) {
          await storage.updateProduct(product.id, {
            stock: product.stock - item.quantity
          });
        }
      }
      
      // Clear the cart
      await storage.clearCart(req.user.id);
      
      // Return the order with items
      const items = await storage.getOrderItems(order.id);
      const itemsWithProducts = await Promise.all(items.map(async (item) => {
        const product = await storage.getProduct(item.productId);
        return { ...item, product };
      }));
      
      res.status(201).json({ ...order, items: itemsWithProducts });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: err.errors });
      }
      res.status(500).json({ message: "Erreur lors de la création de la commande" });
    }
  });

  // Admin routes
  app.get("/api/admin/products", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Accès interdit" });
    }
    
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des produits" });
    }
  });

  app.post("/api/admin/products", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Accès interdit" });
    }
    
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: err.errors });
      }
      res.status(500).json({ message: "Erreur lors de la création du produit" });
    }
  });

  app.patch("/api/admin/products/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Accès interdit" });
    }
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
      
      const updatedProduct = await storage.updateProduct(id, req.body);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      
      res.json(updatedProduct);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: err.errors });
      }
      res.status(500).json({ message: "Erreur lors de la mise à jour du produit" });
    }
  });

  app.delete("/api/admin/products/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Accès interdit" });
    }
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
      
      const result = await storage.deleteProduct(id);
      if (!result) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la suppression du produit" });
    }
  });

  app.get("/api/admin/categories", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Accès interdit" });
    }
    
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des catégories" });
    }
  });

  app.post("/api/admin/categories", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Accès interdit" });
    }
    
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: err.errors });
      }
      res.status(500).json({ message: "Erreur lors de la création de la catégorie" });
    }
  });

  app.get("/api/admin/orders", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Accès interdit" });
    }
    
    try {
      const orders = await storage.getOrders();
      
      // Enhance orders with items and user info
      const ordersWithDetails = await Promise.all(orders.map(async (order) => {
        const items = await storage.getOrderItems(order.id);
        const user = await storage.getUser(order.userId);
        
        // Add product details to each item
        const itemsWithProducts = await Promise.all(items.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return { ...item, product };
        }));
        
        return { 
          ...order, 
          items: itemsWithProducts,
          user: user ? {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          } : null
        };
      }));
      
      res.json(ordersWithDetails);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des commandes" });
    }
  });

  app.patch("/api/admin/orders/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Accès interdit" });
    }
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }
      
      if (!req.body.status || typeof req.body.status !== "string") {
        return res.status(400).json({ message: "Statut invalide" });
      }
      
      const updatedOrder = await storage.updateOrderStatus(id, req.body.status);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Commande non trouvée" });
      }
      
      res.json(updatedOrder);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la mise à jour de la commande" });
    }
  });

  // Route pour mettre à jour le profil utilisateur
  app.patch("/api/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    
    try {
      const updatedUser = await storage.updateUser(req.user.id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la mise à jour du profil" });
    }
  });
  
  // Route pour changer le mot de passe
  app.post("/api/user/change-password", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Mot de passe actuel et nouveau mot de passe requis" });
    }
    
    try {
      // Récupérer l'utilisateur
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      // Vérifier le mot de passe actuel
      const { comparePasswords, hashPassword } = require('./auth');
      const isMatch = await comparePasswords(currentPassword, user.password);
      
      if (!isMatch) {
        return res.status(400).json({ message: "Mot de passe actuel incorrect" });
      }
      
      // Hasher le nouveau mot de passe
      const hashedPassword = await hashPassword(newPassword);
      
      // Mettre à jour le mot de passe
      const updatedUser = await storage.updateUser(req.user.id, { password: hashedPassword });
      if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la mise à jour du mot de passe" });
    }
  });

  // Create an HTTP server instance
  const httpServer = createServer(app);

  return httpServer;
}
