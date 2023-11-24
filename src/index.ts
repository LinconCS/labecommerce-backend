import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './database/knex';
import { TypeUsers, TypeUsersPost } from './types';

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`);
});

// Endpoint de teste
app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" });
    } catch (error) {
        handleErrorResponse(res, error);
    }
});

// Endpoints dos usuários
// Get all users
app.get("/users", async (req: Request, res: Response) => {
    try {
        const result = await db.select().from('users');
        res.status(200).send(result);
    } catch (error) {
        handleErrorResponse(res, error);
    }
});

// Create User
app.post("/users", async (req: Request, res: Response) => {
    try {
        const { id, name, email, password } = req.body;

        validateUserFields(id, name, email, password);

        const existingUser = await db.select().from('users').where('id', id).first();

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

        await db('users').insert(newUser);

        const createdUser = await db.select().from('users').where('id', id).first();

        res.status(201).send(createdUser);
    } catch (error) {
        handleErrorResponse(res, error);
    }
});

// Edit users by ID
app.put('/users/:id', async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id;

        const { id: newId, name: newName, email: newEmail, password: newPassword } = req.body;

        validateUserFields(newId, newName, newEmail, newPassword);

        const users = await db.select().from('users').where('id', idToEdit).first();

        if (!users) {
            res.status(404).send("'id' não encontrada");
            return;
        }

        await db('users').where('id', idToEdit).update({
            id: newId || users.id,
            name: newName || users.name,
            email: newEmail || users.email,
            password: newPassword || users.password,
        });

        res.status(200).send({ message: "Atualização realizada com sucesso" });
    } catch (error) {
        handleErrorResponse(res, error);
    }
});

// Delete Users by ID
app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id;

        const user = await db.select().from('users').where('id', idToDelete).first();

        if (!user) {
            return res.status(404).send("Usuário não encontrado");
        }

        await db('users').where('id', idToDelete).del();

        res.status(200).send("Usuário apagado com sucesso");
    } catch (error) {
        handleErrorResponse(res, error);
    }
});

// Endpoints dos produtos
// Get all products e Get products by name
app.get("/products", async (req: Request, res: Response) => {
    try {
        let query = db.select().from('products');

        if (req.query.name) {
            const productName = req.query.name as string;
            query = query.where('name', 'like', `%${productName}%`);
        }

        const result = await query;

        res.status(200).send(result);
    } catch (error) {
        handleErrorResponse(res, error);
    }
});

// Get Product by ID
app.get('/products/:id', async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;

        const product = await db.select().from('products').where('id', productId).first();

        if (product) {
            res.status(200).send(product);
        } else {
            res.status(404).send("Produto não encontrado");
        }
    } catch (error) {
        handleErrorResponse(res, error);
    }
});

app.post('/products', async (req: Request, res: Response) => {
    try {
        const { id, name, price, description, imageUrl } = req.body;

        if (!id || !name || !description || !imageUrl || typeof price !== "number" || id.length < 1 || name.length < 1 || description.length < 1 || imageUrl.length < 1) {
            res.status(400).send("Campos inválidos");
            return;
        }

        const existingProduct = await db.select().from('products').where('id', id).first();

        if (existingProduct) {
            res.status(400).send("'id' já existe");
            return;
        }

        await db('products').insert({
            id,
            name,
            price,
            description,
            image_url: imageUrl,
        });

        res.status(201).send("Produto cadastrado com sucesso");
    } catch (error) {
        handleErrorResponse(res, error);
    }
});

// Edit products by ID
app.put('/products/:id', async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id;

        const { id: newId, name: newName, price: newPrice, description: newDescription, imageUrl: newImageUrl } = req.body;

        const product = await db.select().from('products').where('id', idToEdit).first();

        if (!product) {
            res.status(404).send("'id' não encontrado");
            return;
        }

        await db('products').where('id', idToEdit).update({
            id: newId || product.id,
            name: newName || product.name,
            price: newPrice || product.price,
            description: newDescription || product.description,
            image_url: newImageUrl || product.image_url,
        });

        res.status(200).send({ message: "Atualização realizada com sucesso" });
    } catch (error) {
        handleErrorResponse(res, error);
    }
});

// Delete Products by ID
app.delete('/products/:id', async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id;

        await db('purchases_products').where('product_id', idToDelete).del();
        await db('products').where('id', idToDelete).del();

        res.status(200).send("Produto apagado com sucesso");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao apagar produto");
    }
});

// Get All Purchases
app.get('/purchases', async (req: Request, res: Response) => {
    try {
        const result = await db.select().from('purchases');
        res.status(200).send(result);
    } catch (error) {
        handleErrorResponse(res, error);
    }
});

// Get Purchase by id showing products
app.get('/purchases/:id', async (req: Request, res: Response) => {
    try {
        const purchaseId = req.params.id;

        // Consulta para obter informações da compra
        const purchaseInfo = await db
            .select(
                'purchases.id as purchaseId',
                'purchases.buyer as buyerId',
                'users.name as buyerName',
                'users.email as buyerEmail',
                'purchases.total_price as totalPrice',
                'purchases.created_at as createdAt'
            )
            .from('purchases')
            .innerJoin('users', 'purchases.buyer', 'users.id')
            .where('purchases.id', purchaseId)
            .first();

        if (!purchaseInfo) {
            res.status(404).send("Compra não encontrada");
            return;
        }

        // Consulta para obter a lista de produtos relacionados à compra
        const productsList = await db
            .select(
                'products.id',
                'products.name',
                'products.price',
                'products.description',
                'products.image_url as imageUrl',
                'purchases_products.quantity'
            )
            .from('purchases_products')
            .innerJoin('products', 'purchases_products.product_id', 'products.id')
            .where('purchases_products.purchase_id', purchaseId);

        // Adiciona a lista de produtos à resposta
        purchaseInfo.products = productsList;

        res.status(200).send(purchaseInfo);
    } catch (error) {
        handleErrorResponse(res, error);
    }
});

// Create Purchases
app.post('/purchases', async (req: Request, res: Response) => {
    try {
        const { id, buyer, products } = req.body;

        if (!id || !buyer || !products || products.length === 0) {
            res.status(400).send("Campos inválidos");
            return;
        }

        // Verifique se o comprador (buyer) existe na tabela de usuários (users)
        const [buyerExist] = await db.select().from('users').where('id', buyer).first();

        if (!buyerExist) {
            res.status(400).send("O comprador não existe");
            return;
        }

        // Calcule o total_price com base nos produtos incluídos na compra
        const totalPrice = await calculateTotalPrice(products);

        // Inserindo a nova compra na tabela de compras (purchases)
        await db('purchases').insert({
            id,
            buyer,
            total_price: totalPrice,
            created_at: new Date().toISOString(),
        });

        // Adicione os produtos à tabela purchases_products
        await addProductsToPurchase(id, products);

        res.status(201).send("Compra cadastrada com sucesso");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao criar compra");
    }
});

// Função para calcular o preço total com base nos produtos
async function calculateTotalPrice(products: { id: string; quantity: number }[]) {
    let totalPrice = 0;

    for (const product of products) {
        const [productInfo] = await db.select('price').from('products').where('id', product.id).limit(1);

        if (productInfo) {
            totalPrice += productInfo.price * product.quantity;
        }
    }

    return totalPrice;
}

// Função para adicionar produtos à tabela purchases_products
async function addProductsToPurchase(purchaseId: string, products: { id: string; quantity: number }[]) {
    for (const product of products) {
        await db('purchases_products').insert({
            purchase_id: purchaseId,
            product_id: product.id,
            quantity: product.quantity,
        });
    }
}

// DELETE Purchase by ID
app.delete('/purchases/:id', async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id;

        await db('purchases_products').where('purchase_id', idToDelete).del();
        await db('purchases').where('id', idToDelete).del();

        res.status(200).send("Pedido apagado com sucesso");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao apagar pedido");
    }
});

function validateUserFields(id: string, name: string, email: string, password: string) {
    if (typeof id !== "string" || typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
        throw new Error("Os campos 'id', 'name', 'email' e 'password' devem ser strings");
    }

    if (id.length < 1 || name.length < 1 || email.length < 1 || password.length < 1) {
        throw new Error("'id', 'name', 'email' e 'password' devem possuir no mínimo 1 caractere");
    }
}

function handleErrorResponse(res: Response, error: any) {
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
