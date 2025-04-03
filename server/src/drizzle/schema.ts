import { pgTable, unique, serial, text, foreignKey, doublePrecision, integer, boolean, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const categories = pgTable("categories", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	description: text(),
	imageUrl: text("image_url"),
}, (table) => [
	unique("categories_slug_unique").on(table.slug),
]);

export const products = pgTable("products", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	description: text(),
	price: doublePrecision().notNull(),
	discountPrice: doublePrecision("discount_price"),
	stock: integer().default(0).notNull(),
	imageUrl: text("image_url"),
	categoryId: integer("category_id").notNull(),
	featured: boolean().default(false).notNull(),
	isNew: boolean("is_new").default(false).notNull(),
	rating: doublePrecision().default(0),
	numReviews: integer("num_reviews").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "products_category_id_categories_id_fk"
		}).onDelete("cascade"),
	unique("products_slug_unique").on(table.slug),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: text().notNull(),
	password: text().notNull(),
	email: text().notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	address: text(),
	city: text(),
	postalCode: text("postal_code"),
	phone: text(),
	isAdmin: boolean("is_admin").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_username_unique").on(table.username),
	unique("users_email_unique").on(table.email),
]);

export const orders = pgTable("orders", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	totalAmount: doublePrecision("total_amount").notNull(),
	status: text().default('pending').notNull(),
	shippingAddress: text("shipping_address").notNull(),
	city: text().notNull(),
	postalCode: text("postal_code").notNull(),
	phone: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "orders_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const cartItems = pgTable("cart_items", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	productId: integer("product_id").notNull(),
	quantity: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "cart_items_user_id_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "cart_items_product_id_products_id_fk"
		}).onDelete("cascade"),
]);

export const orderItems = pgTable("order_items", {
	id: serial().primaryKey().notNull(),
	orderId: integer("order_id").notNull(),
	productId: integer("product_id").notNull(),
	quantity: integer().notNull(),
	unitPrice: doublePrecision("unit_price").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "order_items_order_id_orders_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "order_items_product_id_products_id_fk"
		}).onDelete("restrict"),
]);
