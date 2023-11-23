import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './database/knex';
import { TypeUsers, TypeUsersPost } from './types';

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

// Endpoint de teste
app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


// Endpoints dos usuários
// Get all users
app.get("/users", async (req: Request, res: Response) => {
    try {
        const result = await db.raw(`
          SELECT * FROM users;
      `)

        res.status(200).send(result)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// Create User
app.post("/users", async (req: Request, res: Response) => {
    try {
        const { id, name, email, password } = req.body;

        if (typeof id !== "string" || typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
            res.status(400).send("Os campos 'id', 'name', 'email' e 'password' devem ser strings");
            return;
        }

        if (id.length < 1 || name.length < 1 || email.length < 1 || password.length < 1) {
            res.status(400).send("'id', 'name', 'email' e 'password' devem possuir no mínimo 1 caractere");
            return;
        }

        const [existingUser] = await db.raw(`
            SELECT * FROM users
            WHERE id = ?;
        `, [id]);

        if (existingUser) {
            res.status(400).send("'id' já existe");
            return;
        }

        const newUser = {
            id,
            name,
            email,
            password,
        };

        await db.raw(`
            INSERT INTO users (id, name, email, password)
            VALUES (?, ?, ?, ?);
        `, [newUser.id, newUser.name, newUser.email, newUser.password]);

        const [createdUser] = await db.raw(`
            SELECT * FROM users
            WHERE id = ?;
        `, [newUser.id]);

        res.status(201).send(createdUser);
    } catch (error) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send("Erro inesperado");
        }
    }
});


// Edit users by ID
app.put('/users/:id', async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

        const newId = req.body.id
        const newName = req.body.name
        const newEmail = req.body.email
        const newPassword = req.body.password

        if (newId !== undefined) {

            if (typeof newId !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string")
            }

            if (newId.length < 1) {
                res.status(400)
                throw new Error("'id' deve possuir no mínimo 1 caractere")
            }
        }

        if (newName !== undefined) {

            if (typeof newName !== "string") {
                res.status(400)
                throw new Error("'name' deve ser string")
            }

            if (newName.length < 1) {
                res.status(400)
                throw new Error("'name' deve possuir no mínimo 1 caractere")
            }
        }

        if (newEmail !== undefined) {

            if (typeof newEmail !== "string") {
                res.status(400)
                throw new Error("'email' deve ser string")
            }

            if (newEmail.length < 1) {
                res.status(400)
                throw new Error("'email' deve possuir no mínimo 1 caractere")
            }
        }

        if (newPassword !== undefined) {

            if (typeof newPassword !== "string") {
                res.status(400)
                throw new Error("'password' deve ser string")
            }

            if (newPassword.length < 1) {
                res.status(400)
                throw new Error("'password' deve possuir no mínimo 1 caractere")
            }
        }

        const [users] = await db.raw(`
            SELECT * FROM users
            WHERE id = "${idToEdit}";
        `) // desestruturamos para encontrar o primeiro item do array

        if (users) {
            await db.raw(`
                UPDATE users
                SET
                    id = "${newId || users.id}",
                    name = "${newName || users.name}",
                    email = "${newEmail || users.email}",
                    password = "${newPassword || users.password}"
                WHERE
                    id = "${idToEdit}";
            `)
        } else {
            res.status(404)
            throw new Error("'id' não encontrada")
        }

        res.status(200).send({ message: "Atualização realizada com sucesso" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// Delete Users by ID
app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id;

        const userResult = await db.raw(`
        SELECT * FROM users
        WHERE id = ?;
      `, [idToDelete]);

        const userRows = userResult[0];

        if (!userRows || userRows.length === 0) {
            return res.status(404).send("Usuário não encontrado");
        }

        await db.raw(`
        DELETE FROM users
        WHERE id = ?;
      `, [idToDelete]);

        res.status(200).send("Usuário apagado com sucesso");
    } catch (error) {
        res.status(500).send("Erro ao apagar usuário");
    }
});


// Endpoints dos produtos
// Get all products e Get products by name
app.get("/products", async (req: Request, res: Response) => {
    try {
        // Constrói a consulta SQL base
        let query = 'SELECT * FROM products';

        // Verifica se o parâmetro "name" está presente nos query parameters
        if (req.query.name) {
            const productName = req.query.name as string;
            query += ` WHERE name LIKE '%${productName}%'`;
        }

        // Executa a consulta no banco de dados
        const result = await db.raw(query);

        res.status(200).send(result)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// Get Product by ID
app.get('/products/:id', async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;

        const [product] = await db.raw(`
            SELECT * FROM products
            WHERE id = ?;
        `, [productId]);

        if (product) {
            res.status(200).send(product);
        } else {
            res.status(404).send("Produto não encontrado");
        }
    } catch (error) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send("Erro inesperado");
        }
    }
});

app.post('/products', async (req: Request, res: Response) => {
    try {
        const { id, name, price, description, imageUrl } = req.body;

        if (!id || !name || !description || !imageUrl || typeof price !== "number" || id.length < 1 || name.length < 1 || description.length < 1 || imageUrl.length < 1) {
            res.status(400).send("Campos inválidos");
            return;
        }

        const [existingProduct] = await db.raw(`
            SELECT * FROM products
            WHERE id = ?;
        `, [id]);

        if (existingProduct) {
            res.status(400).send("'id' já existe");
            return;
        }

        await db.raw(`
            INSERT INTO products (id, name, price, description, image_url)
            VALUES (?, ?, ?, ?, ?);
        `, [id, name, price, description, imageUrl]);

        res.status(201).send("Produto cadastrado com sucesso");
    } catch (error) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send("Erro inesperado");
        }
    }
});

// Edit products by ID
app.put('/products/:id', async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id;

        const newId = req.body.id;
        const newName = req.body.name;
        const newPrice = req.body.price;
        const newDescription = req.body.description;
        const newImageUrl = req.body.imageUrl;

        const product = await db.raw(`
          SELECT * FROM products
          WHERE id = "${idToEdit}";
      `);

        if (!product || product.length === 0) {
            res.status(404).send("'id' não encontrado");
            return;
        }

        await db.raw(`
          UPDATE products
          SET
              id = "${newId || product[0].id}",
              name = "${newName || product[0].name}",
              price = "${newPrice || product[0].price}",
              description = "${newDescription || product[0].description}",
              image_url = "${newImageUrl || product[0].image_url}"
          WHERE
              id = "${idToEdit}";
      `);

        res.status(200).send({ message: "Atualização realizada com sucesso" });
    } catch (error) {
        console.log(error);

        if (req.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send("Erro inesperado");
        }
    }
});

// Delete Products by ID
app.delete('/products/:id', async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id;

        // Excluir os registros associados na tabela purchases_products
        await db.raw(`
            DELETE FROM purchases_products
            WHERE product_id = ?;
        `, [idToDelete]);

        // Excluir o produto
        await db.raw(`
            DELETE FROM products
            WHERE id = ?;
        `, [idToDelete]);

        res.status(200).send("Produto apagado com sucesso");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao apagar produto");
    }
});

// // Get All Purchases
app.get('/purchases', async (req: Request, res: Response) => {
    try {
        const result = await db.raw(`
          SELECT * FROM purchases;
      `)

        res.status(200).send(result)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// Create Purchases
app.post('/purchases', async (req: Request, res: Response) => {
    try {
        const { id, buyer, total_price, created_at } = req.body;

        // Validando os campos recebidos
        if (!id || !buyer || !total_price || !created_at) {
            res.status(400).send("Campos inválidos");
            return;
        }

        // Verificando se o comprador (buyer) existe na tabela de usuários (users)
        const [buyerExist] = await db.raw(`
            SELECT * FROM users
            WHERE id = ?;
        `, [buyer]);

        if (!buyerExist) {
            res.status(400).send("O comprador não existe");
            return;
        }

        // Inserindo a nova compra na tabela de compras (purchases)
        await db.raw(`
            INSERT INTO purchases (id, buyer, total_price, created_at)
            VALUES (?, ?, ?, ?);
        `, [id, buyer, total_price, created_at]);

        res.status(201).send("Compra cadastrada com sucesso");
    } catch (error) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send("Erro inesperado");
        }
    }
});

// DELETE Purchase by ID
app.delete('/purchases/:id', async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id;

        // Excluir os registros associados na tabela purchases_products
        await db.raw(`
            DELETE FROM purchases_products
            WHERE purchase_id = ?;
        `, [idToDelete]);

        // Excluir a compra
        await db.raw(`
            DELETE FROM purchases
            WHERE id = ?;
        `, [idToDelete]);

        res.status(200).send("Pedido apagado com sucesso");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao apagar pedido");
    }
});
