import { 
    users, type User, type InsertUser, 
    categories, type Category, type InsertCategory,
    products, type Product, type InsertProduct,
    orders, type Order, type InsertOrder,
    orderItems, type OrderItem, type InsertOrderItem,
    cartItems, type CartItem, type InsertCartItem
  } from "@shared/schema";
  import session from "express-session";
  import createMemoryStore from "memorystore";
  import connectPg from "connect-pg-simple";
  import { db } from "./db";
  import { eq, and, desc } from "drizzle-orm";
  import { Pool } from "@neondatabase/serverless";
  
  const MemoryStore = createMemoryStore(session);
  const PostgresSessionStore = connectPg(session);
  
  export interface IStorage {
    // User management
    getUser(id: number): Promise<User | undefined>;
    getUserByUsername(username: string): Promise<User | undefined>;
    getUserByEmail(email: string): Promise<User | undefined>;
    createUser(user: InsertUser): Promise<User>;
    updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
    
    // Category management
    getCategories(): Promise<Category[]>;
    getCategory(id: number): Promise<Category | undefined>;
    getCategoryBySlug(slug: string): Promise<Category | undefined>;
    createCategory(category: InsertCategory): Promise<Category>;
    updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
    deleteCategory(id: number): Promise<boolean>;
    
    // Product management
    getProducts(): Promise<Product[]>;
    getProduct(id: number): Promise<Product | undefined>;
    getProductBySlug(slug: string): Promise<Product | undefined>;
    getProductsByCategory(categoryId: number): Promise<Product[]>;
    getFeaturedProducts(): Promise<Product[]>;
    getNewProducts(): Promise<Product[]>;
    createProduct(product: InsertProduct): Promise<Product>;
    updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
    deleteProduct(id: number): Promise<boolean>;
    
    // Order management
    getOrders(): Promise<Order[]>;
    getOrder(id: number): Promise<Order | undefined>;
    getUserOrders(userId: number): Promise<Order[]>;
    createOrder(order: InsertOrder): Promise<Order>;
    updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
    
    // Order Item management
    getOrderItems(orderId: number): Promise<OrderItem[]>;
    createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
    
    // Cart management
    getCartItems(userId: number): Promise<(CartItem & { product: Product })[]>;
    getCartItem(userId: number, productId: number): Promise<CartItem | undefined>;
    addToCart(cartItem: InsertCartItem): Promise<CartItem>;
    updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
    removeFromCart(id: number): Promise<boolean>;
    clearCart(userId: number): Promise<boolean>;
    
    // Session store
    sessionStore: session.Store;
  }
  
  export class MemStorage implements IStorage {
    private users: Map<number, User>;
    private categories: Map<number, Category>;
    private products: Map<number, Product>;
    private orders: Map<number, Order>;
    private orderItems: Map<number, OrderItem>;
    private cartItems: Map<number, CartItem>;
    sessionStore: session.Store;
    
    private userIdCounter: number;
    private categoryIdCounter: number;
    private productIdCounter: number;
    private orderIdCounter: number;
    private orderItemIdCounter: number;
    private cartItemIdCounter: number;
    
    constructor() {
      this.users = new Map();
      this.categories = new Map();
      this.products = new Map();
      this.orders = new Map();
      this.orderItems = new Map();
      this.cartItems = new Map();
      
      this.userIdCounter = 1;
      this.categoryIdCounter = 1;
      this.productIdCounter = 1;
      this.orderIdCounter = 1;
      this.orderItemIdCounter = 1;
      this.cartItemIdCounter = 1;
      
      this.sessionStore = new MemoryStore({
        checkPeriod: 86400000 // 24 hours
      });
      
      // Seed data for development
      this.seedData();
    }
    
    // User management
    async getUser(id: number): Promise<User | undefined> {
      return this.users.get(id);
    }
    
    async getUserByUsername(username: string): Promise<User | undefined> {
      return Array.from(this.users.values()).find(
        (user) => user.username.toLowerCase() === username.toLowerCase()
      );
    }
    
    async getUserByEmail(email: string): Promise<User | undefined> {
      return Array.from(this.users.values()).find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );
    }
    
    async createUser(insertUser: InsertUser): Promise<User> {
      const id = this.userIdCounter++;
      const user: User = { 
        ...insertUser, 
        id,
        createdAt: new Date(),
        firstName: insertUser.firstName ?? null,
        lastName: insertUser.lastName ?? null,
        address: insertUser.address ?? null,
        city: insertUser.city ?? null,
        postalCode: insertUser.postalCode ?? null,
        phone: insertUser.phone ?? null,
        isAdmin: insertUser.isAdmin ?? false
      };
      this.users.set(id, user);
      return user;
    }
    
    async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
      const user = this.users.get(id);
      if (!user) return undefined;
      
      const updatedUser = { ...user, ...userData };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    
    // Category management
    async getCategories(): Promise<Category[]> {
      return Array.from(this.categories.values());
    }
    
    async getCategory(id: number): Promise<Category | undefined> {
      return this.categories.get(id);
    }
    
    async getCategoryBySlug(slug: string): Promise<Category | undefined> {
      return Array.from(this.categories.values()).find(
        (category) => category.slug === slug
      );
    }
    
    async createCategory(insertCategory: InsertCategory): Promise<Category> {
      const id = this.categoryIdCounter++;
      const category: Category = { 
        ...insertCategory, 
        id, 
        description: insertCategory.description ?? null, 
        imageUrl: insertCategory.imageUrl ?? null 
      };
      this.categories.set(id, category);
      return category;
    }
    
    async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
      const category = this.categories.get(id);
      if (!category) return undefined;
      
      const updatedCategory = { ...category, ...categoryData };
      this.categories.set(id, updatedCategory);
      return updatedCategory;
    }
    
    async deleteCategory(id: number): Promise<boolean> {
      return this.categories.delete(id);
    }
    
    // Product management
    async getProducts(): Promise<Product[]> {
      return Array.from(this.products.values());
    }
    
    async getProduct(id: number): Promise<Product | undefined> {
      return this.products.get(id);
    }
    
    async getProductBySlug(slug: string): Promise<Product | undefined> {
      return Array.from(this.products.values()).find(
        (product) => product.slug === slug
      );
    }
    
    async getProductsByCategory(categoryId: number): Promise<Product[]> {
      return Array.from(this.products.values()).filter(
        (product) => product.categoryId === categoryId
      );
    }
    
    async getFeaturedProducts(): Promise<Product[]> {
      return Array.from(this.products.values()).filter(
        (product) => product.featured
      );
    }
    
    async getNewProducts(): Promise<Product[]> {
      return Array.from(this.products.values()).filter(
        (product) => product.isNew
      );
    }
    
    async createProduct(insertProduct: InsertProduct): Promise<Product> {
      const id = this.productIdCounter++;
      const product: Product = { 
        ...insertProduct, 
        id,
        createdAt: new Date(),
        description: insertProduct.description ?? null,
        imageUrl: insertProduct.imageUrl ?? null,
        discountPrice: insertProduct.discountPrice ?? null,
        rating: insertProduct.rating ?? null,
        numReviews: insertProduct.numReviews ?? null,
        stock: insertProduct.stock ?? 0,
        featured: insertProduct.featured ?? false,
        isNew: insertProduct.isNew ?? false
      };
      this.products.set(id, product);
      return product;
    }
    
    async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
      const product = this.products.get(id);
      if (!product) return undefined;
      
      const updatedProduct = { ...product, ...productData };
      this.products.set(id, updatedProduct);
      return updatedProduct;
    }
    
    async deleteProduct(id: number): Promise<boolean> {
      return this.products.delete(id);
    }
    
    // Order management
    async getOrders(): Promise<Order[]> {
      return Array.from(this.orders.values());
    }
    
    async getOrder(id: number): Promise<Order | undefined> {
      return this.orders.get(id);
    }
    
    async getUserOrders(userId: number): Promise<Order[]> {
      return Array.from(this.orders.values()).filter(
        (order) => order.userId === userId
      );
    }
    
    async createOrder(insertOrder: InsertOrder): Promise<Order> {
      const id = this.orderIdCounter++;
      const order: Order = { 
        ...insertOrder, 
        id,
        createdAt: new Date(),
        status: insertOrder.status ?? "pending" 
      };
      this.orders.set(id, order);
      return order;
    }
    
    async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
      const order = this.orders.get(id);
      if (!order) return undefined;
      
      const updatedOrder = { ...order, status };
      this.orders.set(id, updatedOrder);
      return updatedOrder;
    }
    
    // Order Item management
    async getOrderItems(orderId: number): Promise<OrderItem[]> {
      return Array.from(this.orderItems.values()).filter(
        (item) => item.orderId === orderId
      );
    }
    
    async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
      const id = this.orderItemIdCounter++;
      const orderItem: OrderItem = { ...insertOrderItem, id };
      this.orderItems.set(id, orderItem);
      return orderItem;
    }
    
    // Cart management
    async getCartItems(userId: number): Promise<(CartItem & { product: Product })[]> {
      const items = Array.from(this.cartItems.values()).filter(
        (item) => item.userId === userId
      );
      
      return items.map(item => {
        const product = this.products.get(item.productId);
        if (!product) throw new Error(`Product not found for cart item: ${item.id}`);
        return { ...item, product };
      });
    }
    
    async getCartItem(userId: number, productId: number): Promise<CartItem | undefined> {
      return Array.from(this.cartItems.values()).find(
        (item) => item.userId === userId && item.productId === productId
      );
    }
    
    async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
      // Check if the item already exists in the cart
      const existingItem = await this.getCartItem(insertCartItem.userId, insertCartItem.productId);
      
      if (existingItem) {
        // Update quantity if item exists
        const updatedItem = await this.updateCartItemQuantity(
          existingItem.id, 
          existingItem.quantity + insertCartItem.quantity
        );
        if (!updatedItem) throw new Error("Failed to update cart item");
        return updatedItem;
      }
      
      // Create new cart item if it doesn't exist
      const id = this.cartItemIdCounter++;
      const cartItem: CartItem = { ...insertCartItem, id };
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
    
    async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
      const cartItem = this.cartItems.get(id);
      if (!cartItem) return undefined;
      
      const updatedCartItem = { ...cartItem, quantity };
      this.cartItems.set(id, updatedCartItem);
      return updatedCartItem;
    }
    
    async removeFromCart(id: number): Promise<boolean> {
      return this.cartItems.delete(id);
    }
    
    async clearCart(userId: number): Promise<boolean> {
      const userCartItems = Array.from(this.cartItems.values()).filter(
        (item) => item.userId === userId
      );
      
      for (const item of userCartItems) {
        this.cartItems.delete(item.id);
      }
      
      return true;
    }
    
    // Seed data for development
    private async seedData() {
      // Create admin user
      const adminUser: InsertUser = {
        username: "admin",
        password: "$2b$10$3AqWBL7NIB2cyVKPTi8ohuGpOamNdsg/z76VTQyMVCFtB/xa/tHMW", // hashed "admin123"
        email: "admin@phonegear.com",
        firstName: "Admin",
        lastName: "User",
        isAdmin: true,
        address: "123 Admin Street",
        city: "Admin City",
        postalCode: "12345",
        phone: "123-456-7890"
      };
      await this.createUser(adminUser);
      
      // Create regular user
      const regularUser: InsertUser = {
        username: "user",
        password: "$2b$10$gNXrg8dJw1o/8CrJcBQGmuMiVRUUoHMJf/nWySn0BM3C3GCQ0/B4C", // hashed "user123"
        email: "user@example.com",
        firstName: "Regular",
        lastName: "User",
        isAdmin: false,
        address: "456 User Street",
        city: "User City",
        postalCode: "54321",
        phone: "987-654-3210"
      };
      await this.createUser(regularUser);
      
      // Create categories
      const categories: InsertCategory[] = [
        {
          name: "Coques et protections",
          slug: "coques-protections",
          description: "Protégez votre téléphone avec nos coques et protections de qualité",
          imageUrl: "https://images.unsplash.com/photo-1600086427699-bfffb4793d29?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
        },
        {
          name: "Chargeurs et câbles",
          slug: "chargeurs-cables",
          description: "Rechargez votre téléphone rapidement avec nos chargeurs et câbles",
          imageUrl: "https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
        },
        {
          name: "Écouteurs et audio",
          slug: "ecouteurs-audio",
          description: "Profitez d'une qualité audio exceptionnelle avec nos écouteurs",
          imageUrl: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
        },
        {
          name: "Powerbanks",
          slug: "powerbanks",
          description: "Gardez votre téléphone chargé partout avec nos powerbanks",
          imageUrl: "https://images.unsplash.com/photo-1581954548122-53a79dff3773?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
        }
      ];
      
      const categoryIds: Record<string, number> = {};
      for (const category of categories) {
        const savedCategory = await this.createCategory(category);
        categoryIds[savedCategory.slug] = savedCategory.id;
      }
      
      // Create products
      const products: InsertProduct[] = [
        {
          name: "Coque Protection Pro",
          slug: "coque-protection-pro",
          description: "Coque de protection robuste et élégante pour iPhone 13/13 Pro",
          price: 24.99,
          stock: 50,
          imageUrl: "https://images.unsplash.com/photo-1600086427699-bfffb4793d29?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          categoryId: categoryIds["coques-protections"],
          featured: true,
          isNew: false,
          rating: 5.0,
          numReviews: 108
        },
        {
          name: "Chargeur Rapide USB-C 25W",
          slug: "chargeur-rapide-usb-c-25w",
          description: "Chargeur rapide 25W compatible avec tous les téléphones USB-C",
          price: 19.99,
          discountPrice: 24.99,
          stock: 45,
          imageUrl: "https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          categoryId: categoryIds["chargeurs-cables"],
          featured: true,
          isNew: false,
          rating: 4.5,
          numReviews: 42
        },
        {
          name: "Écouteurs Bluetooth Premium",
          slug: "ecouteurs-bluetooth-premium",
          description: "Écouteurs sans fil avec son HD et 8 heures d'autonomie",
          price: 39.99,
          discountPrice: 46.99,
          stock: 32,
          imageUrl: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          categoryId: categoryIds["ecouteurs-audio"],
          featured: true,
          isNew: false,
          rating: 4.0,
          numReviews: 67
        },
        {
          name: "Powerbank 20000mAh",
          slug: "powerbank-20000mah",
          description: "Batterie externe 20000mAh avec charge rapide et 2 ports USB",
          price: 49.99,
          stock: 20,
          imageUrl: "https://images.unsplash.com/photo-1581954548122-53a79dff3773?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          categoryId: categoryIds["powerbanks"],
          featured: true,
          isNew: true,
          rating: 4.5,
          numReviews: 34
        },
        {
          name: "Support Téléphone Voiture",
          slug: "support-telephone-voiture",
          description: "Support magnétique pour tableau de bord de voiture",
          price: 15.99,
          stock: 40,
          imageUrl: "https://images.unsplash.com/photo-1662219708541-c9a4218a6cea?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
          categoryId: categoryIds["coques-protections"],
          featured: false,
          isNew: true,
          rating: 4.0,
          numReviews: 8
        },
        {
          name: "Verre Trempé 3D",
          slug: "verre-trempe-3d",
          description: "Protection d'écran en verre trempé 3D avec bords incurvés",
          price: 12.99,
          stock: 60,
          imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
          categoryId: categoryIds["coques-protections"],
          featured: false,
          isNew: true,
          rating: 4.5,
          numReviews: 12
        },
        {
          name: "Anneau Porte-Téléphone",
          slug: "anneau-porte-telephone",
          description: "Support rotatif 360° adhésif pour smartphone",
          price: 8.99,
          stock: 70,
          imageUrl: "https://images.unsplash.com/photo-1612815452835-2160b8207a33?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
          categoryId: categoryIds["coques-protections"],
          featured: false,
          isNew: true,
          rating: 5.0,
          numReviews: 23
        }
      ];
      
      for (const product of products) {
        await this.createProduct(product);
      }
    }
  }
  
  // Database Storage implementation
  export class DatabaseStorage implements IStorage {
    sessionStore: session.Store;
    
    constructor() {
      // Create PostgreSQL session store
      this.sessionStore = new PostgresSessionStore({
        pool: new Pool({ connectionString: process.env.DATABASE_URL }),
        createTableIfMissing: true,
      });
    }
    
    // User management
    async getUser(id: number): Promise<User | undefined> {
      const result = await db.select().from(users).where(eq(users.id, id));
      return result[0];
    }
    
    async getUserByUsername(username: string): Promise<User | undefined> {
      const result = await db.select().from(users).where(eq(users.username, username));
      return result[0];
    }
    
    async getUserByEmail(email: string): Promise<User | undefined> {
      const result = await db.select().from(users).where(eq(users.email, email));
      return result[0];
    }
    
    async createUser(insertUser: InsertUser): Promise<User> {
      const result = await db.insert(users).values(insertUser).returning();
      return result[0];
    }
    
    async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
      const result = await db.update(users).set(userData).where(eq(users.id, id)).returning();
      return result[0];
    }
    
    // Category management
    async getCategories(): Promise<Category[]> {
      return await db.select().from(categories);
    }
    
    async getCategory(id: number): Promise<Category | undefined> {
      const result = await db.select().from(categories).where(eq(categories.id, id));
      return result[0];
    }
    
    async getCategoryBySlug(slug: string): Promise<Category | undefined> {
      const result = await db.select().from(categories).where(eq(categories.slug, slug));
      return result[0];
    }
    
    async createCategory(insertCategory: InsertCategory): Promise<Category> {
      const result = await db.insert(categories).values(insertCategory).returning();
      return result[0];
    }
    
    async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
      const result = await db.update(categories).set(categoryData).where(eq(categories.id, id)).returning();
      return result[0];
    }
    
    async deleteCategory(id: number): Promise<boolean> {
      await db.delete(categories).where(eq(categories.id, id));
      return true;
    }
    
    // Product management
    async getProducts(): Promise<Product[]> {
      return await db.select().from(products);
    }
    
    async getProduct(id: number): Promise<Product | undefined> {
      const result = await db.select().from(products).where(eq(products.id, id));
      return result[0];
    }
    
    async getProductBySlug(slug: string): Promise<Product | undefined> {
      const result = await db.select().from(products).where(eq(products.slug, slug));
      return result[0];
    }
    
    async getProductsByCategory(categoryId: number): Promise<Product[]> {
      return await db.select().from(products).where(eq(products.categoryId, categoryId));
    }
    
    async getFeaturedProducts(): Promise<Product[]> {
      return await db.select().from(products).where(eq(products.featured, true));
    }
    
    async getNewProducts(): Promise<Product[]> {
      return await db.select().from(products).where(eq(products.isNew, true));
    }
    
    async createProduct(insertProduct: InsertProduct): Promise<Product> {
      const result = await db.insert(products).values(insertProduct).returning();
      return result[0];
    }
    
    async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
      const result = await db.update(products).set(productData).where(eq(products.id, id)).returning();
      return result[0];
    }
    
    async deleteProduct(id: number): Promise<boolean> {
      await db.delete(products).where(eq(products.id, id));
      return true;
    }
    
    // Order management
    async getOrders(): Promise<Order[]> {
      return await db.select().from(orders);
    }
    
    async getOrder(id: number): Promise<Order | undefined> {
      const result = await db.select().from(orders).where(eq(orders.id, id));
      return result[0];
    }
    
    async getUserOrders(userId: number): Promise<Order[]> {
      return await db.select().from(orders).where(eq(orders.userId, userId));
    }
    
    async createOrder(insertOrder: InsertOrder): Promise<Order> {
      const result = await db.insert(orders).values(insertOrder).returning();
      return result[0];
    }
    
    async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
      const result = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
      return result[0];
    }
    
    // Order Item management
    async getOrderItems(orderId: number): Promise<OrderItem[]> {
      return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
    }
    
    async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
      const result = await db.insert(orderItems).values(insertOrderItem).returning();
      return result[0];
    }
    
    // Cart management
    async getCartItems(userId: number): Promise<(CartItem & { product: Product })[]> {
      const items = await db.select().from(cartItems).where(eq(cartItems.userId, userId));
      
      // For each cart item, fetch the associated product
      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          const productResult = await db.select().from(products).where(eq(products.id, item.productId));
          if (!productResult[0]) throw new Error(`Product not found for cart item: ${item.id}`);
          return { ...item, product: productResult[0] };
        })
      );
      
      return itemsWithProducts;
    }
    
    async getCartItem(userId: number, productId: number): Promise<CartItem | undefined> {
      const result = await db.select()
        .from(cartItems)
        .where(and(
          eq(cartItems.userId, userId),
          eq(cartItems.productId, productId)
        ));
      return result[0];
    }
    
    async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
      // Check if the item already exists in the cart
      const existingItem = await this.getCartItem(insertCartItem.userId, insertCartItem.productId);
      
      if (existingItem) {
        // Update quantity if item exists
        const updatedItem = await this.updateCartItemQuantity(
          existingItem.id, 
          existingItem.quantity + insertCartItem.quantity
        );
        if (!updatedItem) throw new Error("Failed to update cart item");
        return updatedItem;
      }
      
      // Create new cart item if it doesn't exist
      const result = await db.insert(cartItems).values(insertCartItem).returning();
      return result[0];
    }
    
    async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
      const result = await db.update(cartItems)
        .set({ quantity })
        .where(eq(cartItems.id, id))
        .returning();
      return result[0];
    }
    
    async removeFromCart(id: number): Promise<boolean> {
      await db.delete(cartItems).where(eq(cartItems.id, id));
      return true;
    }
    
    async clearCart(userId: number): Promise<boolean> {
      await db.delete(cartItems).where(eq(cartItems.userId, userId));
      return true;
    }
    
    // Initialize database with seed data
    async seedDatabase() {
      try {
        // Check if we already have users
        const existingUsers = await db.select().from(users);
        if (existingUsers.length > 0) {
          console.log("Database already seeded, skipping...");
          return;
        }
        
        console.log("Seeding database...");
        
        // Create admin user
        const adminUser: InsertUser = {
          username: "admin",
          password: "$2b$10$3AqWBL7NIB2cyVKPTi8ohuGpOamNdsg/z76VTQyMVCFtB/xa/tHMW", // hashed "admin123"
          email: "admin@phonegear.com",
          firstName: "Admin",
          lastName: "User",
          isAdmin: true,
          address: "123 Admin Street",
          city: "Admin City",
          postalCode: "12345",
          phone: "123-456-7890"
        };
        await this.createUser(adminUser);
        
        // Create regular user
        const regularUser: InsertUser = {
          username: "user",
          password: "$2b$10$gNXrg8dJw1o/8CrJcBQGmuMiVRUUoHMJf/nWySn0BM3C3GCQ0/B4C", // hashed "user123"
          email: "user@example.com",
          firstName: "Regular",
          lastName: "User",
          isAdmin: false,
          address: "456 User Street",
          city: "User City",
          postalCode: "54321",
          phone: "987-654-3210"
        };
        await this.createUser(regularUser);
        
        // Create categories
        const categoriesData: InsertCategory[] = [
          {
            name: "Coques et protections",
            slug: "coques-protections",
            description: "Protégez votre téléphone avec nos coques et protections de qualité",
            imageUrl: "https://images.unsplash.com/photo-1600086427699-bfffb4793d29?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          },
          {
            name: "Chargeurs et câbles",
            slug: "chargeurs-cables",
            description: "Rechargez votre téléphone rapidement avec nos chargeurs et câbles",
            imageUrl: "https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          },
          {
            name: "Écouteurs et audio",
            slug: "ecouteurs-audio",
            description: "Profitez d'une qualité audio exceptionnelle avec nos écouteurs",
            imageUrl: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          },
          {
            name: "Powerbanks",
            slug: "powerbanks",
            description: "Gardez votre téléphone chargé partout avec nos powerbanks",
            imageUrl: "https://images.unsplash.com/photo-1581954548122-53a79dff3773?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
          }
        ];
        
        const categoryIds: Record<string, number> = {};
        for (const category of categoriesData) {
          const savedCategory = await this.createCategory(category);
          categoryIds[savedCategory.slug] = savedCategory.id;
        }
        
        // Create products
        const productsData: InsertProduct[] = [
          {
            name: "Coque Protection Pro",
            slug: "coque-protection-pro",
            description: "Coque de protection robuste et élégante pour iPhone 13/13 Pro",
            price: 24.99,
            stock: 50,
            imageUrl: "https://images.unsplash.com/photo-1600086427699-bfffb4793d29?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            categoryId: categoryIds["coques-protections"],
            featured: true,
            isNew: false,
            rating: 5.0,
            numReviews: 108
          },
          {
            name: "Chargeur Rapide USB-C 25W",
            slug: "chargeur-rapide-usb-c-25w",
            description: "Chargeur rapide 25W compatible avec tous les téléphones USB-C",
            price: 19.99,
            discountPrice: 24.99,
            stock: 45,
            imageUrl: "https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            categoryId: categoryIds["chargeurs-cables"],
            featured: true,
            isNew: false,
            rating: 4.5,
            numReviews: 42
          },
          {
            name: "Écouteurs Bluetooth Premium",
            slug: "ecouteurs-bluetooth-premium",
            description: "Écouteurs sans fil avec son HD et 8 heures d'autonomie",
            price: 39.99,
            discountPrice: 46.99,
            stock: 32,
            imageUrl: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            categoryId: categoryIds["ecouteurs-audio"],
            featured: true,
            isNew: false,
            rating: 4.0,
            numReviews: 67
          },
          {
            name: "Powerbank 20000mAh",
            slug: "powerbank-20000mah",
            description: "Batterie externe 20000mAh avec charge rapide et 2 ports USB",
            price: 49.99,
            stock: 20,
            imageUrl: "https://images.unsplash.com/photo-1581954548122-53a79dff3773?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
            categoryId: categoryIds["powerbanks"],
            featured: true,
            isNew: true,
            rating: 4.5,
            numReviews: 34
          }
        ];
        
        for (const product of productsData) {
          await this.createProduct(product);
        }
        
        console.log("Database seeded successfully!");
      } catch (error) {
        console.error("Error seeding database:", error);
      }
    }
  }
  
  // Export storage instance
  export const storage = new DatabaseStorage();
  
  // Initialize the database
  storage.seedDatabase().catch(console.error);
  