import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './database/knex';
import {
  users,
  products,
  createUser,
  getAllUsers,
  createProduct,
  getAllProducts,
  searchProductsByName,
  getUserById,
  getUserByEmail,
  getProductById
} from './database';

const app = express();

app.use(express.json());
app.use(cors());


// Endpoint de teste
app.get('/ping', (req: Request, res: Response) => {
  res.send('Pong!');
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});



// Endpoints dos usuários
// Get all users
app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await db('users').select('*');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar usuários');
  }
});

// Create User
app.post('/users', async (req: Request, res: Response) => {
  try {
    const { id, name, email, password } = req.body;

    console.log('Dados recebidos:', { id, name, email, password });

    if (!id || !name || !email || !password) {
      throw new Error("Todos os campos são obrigatórios");
    }

    const existingUserById = await db('users').where('id', id).first();
    if (existingUserById) {
      throw new Error("Já existe um usuário com esse ID");
    }

    const existingUserByEmail = await db('users').where('email', email).first();
    if (existingUserByEmail) {
      throw new Error("Já existe um usuário com esse e-mail");
    }

    await db('users').insert({ id, name, email, password });

    res.status(201).json({ message: "Cadastro realizado com sucesso" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error);
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Ocorreu um erro inesperado");
    }
  }
});


// Delete Users by ID
app.delete('/users/:id', (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id;

    // Verificar se o usuário existe
    const userIndex = users.findIndex((user) => user.id === idToDelete);

    if (userIndex >= 0) {
      // Remover o usuário
      users.splice(userIndex, 1);
      res.status(200).send("Usuário apagado com sucesso");
    } else {
      res.status(404).send("Usuário não encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao apagar usuário");
  }
});

// Edit users by ID
app.put('/users/:id', (req: Request, res: Response) => {
  try {
    const idToEdit = req.params.id;

    // Verificar se o usuário existe
    const user = users.find((user) => user.id === idToEdit);

    if (user) {
      // Atualizar os dados do usuário
      user.id = req.body.id || user.id;
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;

      res.status(200).send("Usuário atualizado com sucesso");
    } else {
      res.status(404).send("Usuário não encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao atualizar usuário");
  }
});



// Endpoints dos produtos
// Get all products e Search products by name
app.get('/products', async (req: Request, res: Response) => {
  try {
    const { name } = req.query;

    if (name) {
      const products = await db('products').where('name', 'like', `%${name}%`).select('*');
      res.status(200).json(products);
    } else {
      const products = await db('products').select('*');
      res.status(200).json(products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar produtos');
  }
});

// Create Product
app.post('/products', async (req: Request, res: Response) => {
  try {
    const { id, name, price, description, imageUrl } = req.body;

    if (!id || !name || !price || !description || !imageUrl) {
      throw new Error("Todos os campos são obrigatórios");
    }

    // Validar se já existe um produto com o mesmo ID
    const existingProduct = await db('products').where('id', id).first();
    if (existingProduct) {
      throw new Error("Já existe um produto com esse ID");
    }

    await db('products').insert({ id, name, price, description, image_url: imageUrl });

    res.status(201).json({ message: "Produto cadastrado com sucesso" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error);
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Ocorreu um erro inesperado");
    }
  }
});

// Delete Products by ID
app.delete('/products/:id', (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id;

    // Verificar se o produto existe
    const productIndex = products.findIndex((product) => product.id === idToDelete);

    if (productIndex >= 0) {
      // Remover o produto
      products.splice(productIndex, 1);
      res.status(200).send("Produto apagado com sucesso");
    } else {
      res.status(404).send("Produto não encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao apagar produto");
  }
});

// Get Products by ID
app.get('/products/:id', (req: Request, res: Response) => {
  const idToFind = req.params.id;

  const result = products.find((product) => product.id === idToFind);

  if (result) {
    res.status(200).send(result);
  } else {
    res.status(404).send("Produto não encontrado");
  }
});

// Edit products by ID
app.put('/products/:id', async (req: Request, res: Response) => {
  try {
    const idToEdit = req.params.id;
    const { id, name, price, description, imageUrl } = req.body;

    // Verificar se o produto existe no banco de dados
    const product = await db('products').where('id', idToEdit).first();

    if (product) {
      // Atualizar os dados do produto
      await db('products').where('id', idToEdit).update({
        id: id || product.id,
        name: name || product.name,
        price: price || product.price,
        description: description || product.description,
        image_url: imageUrl || product.image_url
      });

      res.status(200).send("Produto atualizado com sucesso");
    } else {
      res.status(404).send("Produto não encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao atualizar produto");
  }
});



// Get All Purchases
app.get('/purchases', async (req: Request, res: Response) => {
  try {
    const purchases = await db('purchases').select('*');
    res.status(200).json(purchases);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error);
      res.status(500).send(error.message);
    } else {
      res.status(500).send("Ocorreu um erro inesperado");
    }
  }
});

// Create Purchases
app.post('/purchases', async (req: Request, res: Response) => {
  try {
    const { id, buyer, products } = req.body;

    if (!id || !buyer || !products || !Array.isArray(products) || products.length === 0) {
      throw new Error("Dados inválidos");
    }

    const buyerExists = await db('users').where('id', buyer).first();

    if (!buyerExists) {
      throw new Error("Usuário comprador não encontrado");
    }

    let total_price = 0; // Inicializa o total_price como zero

    const productsInfo = await Promise.all(products.map(async (item) => {
      const product = await db('products').where('id', item.id).first();

      if (!product) {
        throw new Error(`Produto com ID ${item.id} não encontrado`);
      }

      total_price += product.price * item.quantity; // Adiciona o preço do produto ao total_price

      return { product_id: item.id, quantity: item.quantity };
    }));

    await db.transaction(async (trx) => {
      const purchase = await trx('purchases').insert({ id, buyer, total_price });
      const purchaseProducts = productsInfo.map(info => ({ purchase_id: purchase[0], ...info }));
      await trx('purchases_products').insert(purchaseProducts);
    });

    res.status(201).json({ message: "Pedido realizado com sucesso" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error);
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Ocorreu um erro inesperado");
    }
  }
});


// DELETE Purchase by ID
app.delete('/purchases/:id', async (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id;
    const purchase = await db('purchases').where('id', idToDelete).first();

    if (purchase) {
      await db('purchases').where('id', idToDelete).del();
      res.status(200).json({ message: "Pedido cancelado com sucesso" });
    } else {
      res.status(404).send("Pedido não encontrado");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error);
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Ocorreu um erro inesperado");
    }
  }
});

