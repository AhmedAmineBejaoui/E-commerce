import { relations } from "drizzle-orm/relations";
import { categories, products, users, orders, cartItems, orderItems } from "./schema";

export const productsRelations = relations(products, ({one, many}) => ({
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id]
	}),
	cartItems: many(cartItems),
	orderItems: many(orderItems),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	products: many(products),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	user: one(users, {
		fields: [orders.userId],
		references: [users.id]
	}),
	orderItems: many(orderItems),
}));

export const usersRelations = relations(users, ({many}) => ({
	orders: many(orders),
	cartItems: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({one}) => ({
	user: one(users, {
		fields: [cartItems.userId],
		references: [users.id]
	}),
	product: one(products, {
		fields: [cartItems.productId],
		references: [products.id]
	}),
}));

export const orderItemsRelations = relations(orderItems, ({one}) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id]
	}),
}));