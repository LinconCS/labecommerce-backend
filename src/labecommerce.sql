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

-- Inserindo itens na tabela users
INSERT INTO users (id, name, email, password, created_at)
VALUES
  ('u001', 'Fulano', 'fulano@email.com', 'fulano123', '2023-08-30T12:00:00Z'),
  ('u002', 'Beltrana', 'beltrana@email.com', 'beltrana00', '2023-08-30T12:01:00Z'),
  ('u003', 'Sicrano', 'sicrano@email.com', 'sicrano999', '2023-08-30T12:02:00Z');

-- Retornar todos os usuários cadastrados na tabela users
  SELECT * FROM users

-- Criar uma novo usuário na tabela users
  INSERT INTO users (id, name, email, password, created_at)
VALUES ('u004', 'labenuser', 'labenuser@email.com', 'lebenusersenha', '2023-08-30T12:00:00.000Z')

-- Deletar user pelo ID
DELETE FROM users
WHERE id = 'u001'; -- infomar o id do usuário que deseja deletar

-- Deletar a tabela users
DROP TABLE users;



-- Criação da tabela products
CREATE TABLE products (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL
);

-- Inserindo itens na tabela products
INSERT INTO products (id, name, price, description, image_url)
VALUES
  ('prod001', 'Mouse gamer', 250, 'Melhor mouse do mercado!', 'https://picsum.photos/seed/Mouse%20gamer/400'),
  ('prod002', 'Monitor', 900, 'Monitor LED Full HD 24 polegadas', 'https://picsum.photos/seed/Monitor/400'),
  ('prod003', 'Gabinete gamer', 400, 'Gabinete Gamer Com 3 Fans Argb, Lateral de Vidro Temperado', 'https://picsum.photos/seed/Gabinete%20gamer/400'),
  ('prod004', 'Teclado mecânico', 150, 'Teclado Mecânico RGB', 'https://picsum.photos/seed/Teclado%20mecanico/400'),
  ('prod005', 'Headset gamer', 120, 'Headset com som surround 7.1, microfone retrátil', 'https://picsum.photos/seed/Headset%20gamer/400');

-- Retornar todas os produtos cadastrados na tabela products
SELECT * FROM products;

-- Retornar somente os produtos que possuem em seu nome o termo "gamer"da tabela products
SELECT * FROM products WHERE name LIKE '%gamer%'

-- Criar um novo produto na tabela products
INSERT INTO products (id, name, price, description, image_url)
VALUES ('prod006', 'Notebook', 3000, 'Notebook ultrafino, tela de 17 polegadas', 'https://picsum.photos/seed/Notebook/400')

-- Deletar product pelo ID
DELETE FROM products
WHERE id = 'prod006'; -- infomar o id do produto que deseja deletar

-- Editar product pelo ID
UPDATE products
SET
  name = 'Monitor gamer',
  price = 2500,
  description = 'Monitor gamer 4k 32 polegadas'
WHERE id = 'prod002'; -- informar o id do produto que deseja editar

-- Deletar a tabela product
DROP TABLE products;

