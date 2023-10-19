import express, { Request, Response } from 'express';
import cors from 'cors';
import { 
  users, 
  products, 
  createUser, 
  getAllUsers, 
  createProduct, 
  getAllProducts, 
  searchProductsByName 
} from './database';

const app = express();

app.use(express.json());
app.use(cors());

// Endpoints dos usuários
app.post('/users', (req: Request, res: Response) => {
  const { id, name, email, password } = req.body;
  const result = createUser(id, name, email, password);
  res.send(result);
});

app.get('/users', (req: Request, res: Response) => {
  const allUsers = getAllUsers();
  res.json(allUsers);
});

// Endpoints dos produtos
app.post('/products', (req: Request, res: Response) => {
  const { id, name, price, description, imageUrl } = req.body;
  const result = createProduct(id, name, price, description, imageUrl);
  res.send(result);
});

app.get('/products', (req: Request, res: Response) => {
  const allProducts = getAllProducts();
  res.json(allProducts);
});

app.get('/products/search', (req: Request, res: Response) => {
  const name = req.query.name as string;
  const searchResults = searchProductsByName(name);
  res.json(searchResults);
});

// Endpoint de teste
app.get('/ping', (req: Request, res: Response) => {
  res.send('Pong!');
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Get All Users
app.get('/users', (req: Request, res: Response) => {
  const allUsers = getAllUsers();
  res.status(200).json(allUsers);
});

// Get All Products
app.get('/products', (req: Request, res: Response) => {
  const allProducts = getAllProducts();
  res.status(200).json(allProducts);
});

// Refatorar o GET /products
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

// Create User
app.post('/users', (req: Request, res: Response) => {
  const { id, name, email, password } = req.body;
  const result = createUser(id, name, email, password);
  res.status(201).send("Cadastro realizado com sucesso");
});

// Create Product
app.post('/products', (req: Request, res: Response) => {
  const { id, name, price, description, imageUrl } = req.body;
  const result = createProduct(id, name, price, description, imageUrl);
  res.status(201).send("Produto cadastrado com sucesso");
});

app.delete('/users/:id', (req: Request, res: Response) => {
  const idToDelete = req.params.id;

  const userIndex = users.findIndex((user) => user.id === idToDelete);

  if (userIndex >= 0) {
    users.splice(userIndex, 1);
    res.status(200).send("User apagado com sucesso");
  } else {
    res.status(404).send("User não encontrado");
  }
});

app.delete('/products/:id', (req: Request, res: Response) => {
  const idToDelete = req.params.id;

  const productIndex = products.findIndex((product) => product.id === idToDelete);

  if (productIndex >= 0) {
    products.splice(productIndex, 1);
    res.status(200).send("Produto apagado com sucesso");
  } else {
    res.status(404).send("Produto não encontrado");
  }
});

app.get('/products/:id', (req: Request, res: Response) => {
  const idToFind = req.params.id;

  const result = products.find((product) => product.id === idToFind);

  if (result) {
    res.status(200).send(result);
  } else {
    res.status(404).send("Produto não encontrado");
  }
});

app.put('/products/:id', (req: Request, res: Response) => {
  const idToEdit = req.params.id;

  const newId = req.body.id as string | undefined;
  const newName = req.body.name as string | undefined;
  const newPrice = req.body.price as number | undefined;
  const newDescription = req.body.description as string | undefined;
  const newImageUrl = req.body.imageUrl as string | undefined;

  const product = products.find((product) => product.id === idToEdit);

  if (product) {
    product.id = newId || product.id;
    product.name = newName || product.name;
    product.price = newPrice || product.price;
    product.description = newDescription || product.description;
    product.imageUrl = newImageUrl || product.imageUrl;
  }

  res.status(200).send("Produto atualizado com sucesso");
});