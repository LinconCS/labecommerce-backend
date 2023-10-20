import express, { Request, Response } from 'express';
import cors from 'cors';
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
app.get('/users', (req: Request, res: Response) => {
  try {
    const allUsers = getAllUsers();
    res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao obter usuários");
  }
});

// Create User
app.post('/users', (req: Request, res: Response) => {
  try {
    const { id, name, email, password } = req.body;

    if (!id || !name || !email || !password) {
      throw new Error("Todos os campos são obrigatórios");
    }

    // Validar se já existe um usuário com o mesmo ID
    const existingUserById = getUserById(id);
    if (existingUserById) {
      throw new Error("Já existe um usuário com esse ID");
    }

    // Validar se já existe um usuário com o mesmo e-mail
    const existingUserByEmail = getUserByEmail(email);
    if (existingUserByEmail) {
      throw new Error("Já existe um usuário com esse e-mail");
    }

    const result = createUser(id, name, email, password);
    res.status(201).send("Cadastro realizado com sucesso");
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
// Get all products
app.get('/products', (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.name as string;

    if (searchTerm && searchTerm.length < 1) {
      throw new Error("O termo de busca deve ter pelo menos um caractere");
    }

    const allProducts = getAllProducts();
    res.status(200).json(allProducts);
  } catch (error: unknown) { // Usando unknown
    if (error instanceof Error) { // Verificando se é uma instância de Error
      console.log(error);
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Ocorreu um erro inesperado");
    }
  }
});

// Search products by name
app.get('/product', (req: Request, res: Response) => {
  const name = req.query.name as string;

  if (name) {
    const searchResults = searchProductsByName(name);
    res.status(200).json(searchResults);
  } else {
    const allProducts = getAllProducts();
    res.status(200).json(allProducts);
  }
});

// Create Product
app.post('/products', (req: Request, res: Response) => {
  try {
    const { id, name, price, description, imageUrl } = req.body;

    if (!id || !name || !price || !description || !imageUrl) {
      throw new Error("Todos os campos são obrigatórios");
    }

    // Validar se já existe um produto com o mesmo ID
    const existingProduct = getProductById(id);
    if (existingProduct) {
      throw new Error("Já existe um produto com esse ID");
    }

    const result = createProduct(id, name, price, description, imageUrl);
    res.status(201).send("Produto cadastrado com sucesso");
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
app.put('/products/:id', (req: Request, res: Response) => {
  try {
    const idToEdit = req.params.id;

    // Verificar se o produto existe
    const product = products.find((product) => product.id === idToEdit);

    if (product) {
      // Atualizar os dados do produto
      product.id = req.body.id || product.id;
      product.name = req.body.name || product.name;
      product.price = req.body.price || product.price;
      product.description = req.body.description || product.description;
      product.imageUrl = req.body.imageUrl || product.imageUrl;

      res.status(200).send("Produto atualizado com sucesso");
    } else {
      res.status(404).send("Produto não encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao atualizar produto");
  }
});