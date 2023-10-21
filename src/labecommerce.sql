-- Active: 1697865929097@@127.0.0.1@3306

-- Criação da tabela users
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL
);

-- Visualizando estrutura de uma tabela
PRAGMA table_info('users');

-- Visualizando dados da tabela users
SELECT * FROM users;

-- Inserindo itens na tabela users
INSERT INTO users (id, name, email, password, created_at)
VALUES
  ('u001', 'Fulano', 'fulano@email.com', 'fulano123', '2023-08-30T12:00:00Z'),
  ('u002', 'Beltrana', 'beltrana@email.com', 'beltrana00', '2023-08-30T12:01:00Z'),
  ('u003', 'Sicrano', 'sicrano@email.com', 'sicrano999', '2023-08-30T12:02:00Z');


-- Criação da tabela products
CREATE TABLE products (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL
);

-- Visualizando dados da tabela products
SELECT * FROM products;

-- Inserindo itens na tabela products
INSERT INTO products (id, name, price, description, image_url)
VALUES
  ('prod001', 'Mouse gamer', 250, 'Melhor mouse do mercado!', 'https://picsum.photos/seed/Mouse%20gamer/400'),
  ('prod002', 'Monitor', 900, 'Monitor LED Full HD 24 polegadas', 'https://picsum.photos/seed/Monitor/400'),
  ('prod003', 'Gabinete gamer', 400, 'Gabinete Gamer Com 3 Fans Argb, Lateral de Vidro Temperado', 'https://picsum.photos/seed/Gabinete%20gamer/400'),
  ('prod004', 'Teclado mecânico', 150, 'Teclado Mecânico RGB', 'https://picsum.photos/seed/Teclado%20mecanico/400'),
  ('prod005', 'Headset gamer', 120, 'Headset com som surround 7.1, microfone retrátil', 'https://picsum.photos/seed/Headset%20gamer/400');

