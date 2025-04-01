-- Migration complète et corrigée pour PostgreSQL

-- Suppression des tables existantes (optionnel - seulement si besoin de réinitialiser)
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Création des tables dans le bon ordre (sans dépendances d'abord)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    phone TEXT,
    is_admin BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT
);

-- Tables avec dépendances simples
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price DOUBLE PRECISION NOT NULL,
    discount_price DOUBLE PRECISION,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    category_id INTEGER NOT NULL,
    featured BOOLEAN NOT NULL DEFAULT false,
    is_new BOOLEAN NOT NULL DEFAULT false,
    rating DOUBLE PRECISION DEFAULT 0,
    num_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    total_amount DOUBLE PRECISION NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Tables de jointure
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DOUBLE PRECISION NOT NULL
);

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL
);

-- Ajout des contraintes de clés étrangères
ALTER TABLE products
ADD CONSTRAINT products_category_id_fk
FOREIGN KEY (category_id) REFERENCES categories(id)
ON DELETE CASCADE;

ALTER TABLE orders
ADD CONSTRAINT orders_user_id_fk
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE order_items
ADD CONSTRAINT order_items_order_id_fk
FOREIGN KEY (order_id) REFERENCES orders(id)
ON DELETE CASCADE;

ALTER TABLE order_items
ADD CONSTRAINT order_items_product_id_fk
FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE cart_items
ADD CONSTRAINT cart_items_user_id_fk
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE cart_items
ADD CONSTRAINT cart_items_product_id_fk
FOREIGN KEY (product_id) REFERENCES products(id)
ON DELETE CASCADE;