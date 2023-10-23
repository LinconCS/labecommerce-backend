-- Active: 1697865929097@@127.0.0.1@3306

-- Criação da tabela users
CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
    );

-- Visualizando estrutura de uma tabela
PRAGMA table_info('users');

-- Inserindo itens na tabela users
INSERT INTO
    users (
        id,
        name,
        email,
        password,
        created_at
    )
VALUES (
        'u001',
        'Fulano',
        'fulano@email.com',
        'fulano123',
        '2023-08-30T12:00:00Z'
    ), (
        'u002',
        'Beltrana',
        'beltrana@email.com',
        'beltrana00',
        '2023-08-30T12:01:00Z'
    ), (
        'u003',
        'Sicrano',
        'sicrano@email.com',
        'sicrano999',
        '2023-08-30T12:02:00Z'
    );

-- Retornar todos os usuários cadastrados na tabela users
SELECT * FROM users 

-- Criar uma novo usuário na tabela users
INSERT INTO
    users (
        id,
        name,
        email,
        password,
        created_at
    )
VALUES (
        'u004',
        'Labenuser',
        'labenuser@email.com',
        'labenusersenha',
        '2023-08-30T12:00:00.000Z'
    )

-- Deletar user pelo ID
DELETE FROM users WHERE id = 'u001'; -- infomar o id do usuário que deseja deletar

-- Deletar a tabela users
DROP TABLE users;



-- Criação da tabela products
CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL
    );

-- Inserindo itens na tabela products
INSERT INTO
    products (
        id,
        name,
        price,
        description,
        image_url
    )
VALUES (
        'prod001',
        'Mouse gamer',
        250,
        'Melhor mouse do mercado!',
        'https://picsum.photos/seed/Mouse%20gamer/400'
    ), (
        'prod002',
        'Monitor',
        900,
        'Monitor LED Full HD 24 polegadas',
        'https://picsum.photos/seed/Monitor/400'
    ), (
        'prod003',
        'Gabinete gamer',
        400,
        'Gabinete Gamer Com 3 Fans Argb, Lateral de Vidro Temperado',
        'https://picsum.photos/seed/Gabinete%20gamer/400'
    ), (
        'prod004',
        'Teclado mecânico',
        150,
        'Teclado Mecânico RGB',
        'https://picsum.photos/seed/Teclado%20mecanico/400'
    ), (
        'prod005',
        'Headset gamer',
        120,
        'Headset com som surround 7.1, microfone retrátil',
        'https://picsum.photos/seed/Headset%20gamer/400'
    );

-- Retornar todos os produtos cadastrados na tabela products
SELECT * FROM products;

-- Retornar somente os produtos que possuem em seu nome o termo "gamer"da tabela products
SELECT * FROM products WHERE name LIKE '%gamer%' 

-- Criar um novo produto na tabela products
INSERT INTO
    products (
        id,
        name,
        price,
        description,
        image_url
    )
VALUES (
        'prod006',
        'Notebook',
        3000,
        'Notebook ultrafino, tela de 17 polegadas',
        'https://picsum.photos/seed/Notebook/400'
    )

-- Deletar product pelo ID
DELETE FROM products WHERE id = 'prod006';-- infomar o id do produto que deseja deletar

-- Editar product pelo ID
UPDATE products
SET
    name = 'Monitor gamer',
    price = 2500,
    description = 'Monitor gamer 4k 32 polegadas'
WHERE id = 'prod002'; -- informar o id do produto que deseja editar

-- Deletar a tabela products
DROP TABLE products;



-- Criação da tabela de purchases
CREATE TABLE
    purchases (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        buyer TEXT NOT NULL,
        total_price REAL NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (buyer) REFERENCES users(id)
    );

-- Criação de pedidos para cada pessoa
INSERT INTO
    purchases (
        id,
        buyer,
        total_price,
        created_at
    )
VALUES (
        'p001',
        'u001',
        900,
        '2023-08-30T14:00:00Z'
    ), (
        'p002',
        'u002',
        520,
        '2023-08-30T14:30:00Z'
    ), (
        'p003',
        'u003',
        300,
        '2023-08-30T15:00:00Z'
    ), (
        'p004',
        'u004',
        270,
        '2023-08-30T15:30:00Z'
    );

-- Retornar todos os pedidos cadastrados na tabela purchases
SELECT * FROM purchases;

-- Edição do preço total do pedido
UPDATE purchases SET total_price = 2500.00 WHERE id = 'p001';

-- Deletar a tabela purchases
DROP TABLE purchases;



-- Juntando a tabela users(buyers) com as compras(purchases)
SELECT
    purchases.id AS 'purchase_id',
    buyer AS 'buyer_id',
    users.name AS 'buyer_name',
    email,
    total_price,
    purchases.created_at
FROM purchases
INNER JOIN users
ON purchases.buyer = users.id;



-- Criação da tabela de relações entre produtos e pedidos
CREATE TABLE purchases_products (
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    PRIMARY KEY (purchase_id, product_id)
);

-- Retornar todos os produtos cadastrados na tabela purchases_products
SELECT * FROM purchases_products;

-- Deletar a tabela purchases_products
DROP TABLE purchases_products;

-- Compra 1
INSERT INTO purchases_products (purchase_id, product_id, quantity)
VALUES
    ('p001', 'prod001', 1),
    ('p001', 'prod003', 1),
    ('p001', 'prod004', 1);

-- Compra 2
INSERT INTO purchases_products (purchase_id, product_id, quantity)
VALUES
    ('p002', 'prod006', 1);

-- Compra 3
INSERT INTO purchases_products (purchase_id, product_id, quantity)
VALUES
    ('p003', 'prod002', 6),
    ('p003', 'prod005', 10);

-- Compra 4
INSERT INTO purchases_products (purchase_id, product_id, quantity)
VALUES
    ('p004', 'prod001', 15),
    ('p004', 'prod002', 5),
    ('p004', 'prod003', 20),
    ('p004', 'prod004', 12),
    ('p004', 'prod005', 8),
    ('p004', 'prod006', 3);

-- Retornar as compras realizadas por cada usuário com os produtos e quantidades
    SELECT
    purchases.id AS purchase_id,
    purchases.buyer AS buyer_id,
    users.name AS buyer_name,
    users.email AS buyer_email,
    products.id AS product_id,
    products.name AS product_name,
    products.price AS product_price,
    products.description AS product_description,
    products.image_url AS product_image,
    purchases_products.quantity AS quantity
FROM purchases
INNER JOIN users 
ON purchases.buyer = users.id
INNER JOIN purchases_products 
ON purchases.id = purchases_products.purchase_id
INNER JOIN products 
ON purchases_products.product_id = products.id;

--Refatorando as tabelas que possuem FOREIGN KEY

CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    buyer TEXT NOT NULL,
    total_price REAL NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (buyer) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE purchases_products (
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    PRIMARY KEY (purchase_id, product_id)
);


