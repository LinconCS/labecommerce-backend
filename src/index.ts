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