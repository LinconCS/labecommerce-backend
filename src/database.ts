import { TypeUsers, TypeProducts } from './types';

export const users: TypeUsers[] = [
  {
    id: "u001",
    name: "Fulano",
    email: "fulano@email.com",
    password: "fulano123",
    createdAt: new Date().toISOString()
  },
  {
    id: "u002",
    name: "Beltrana",
    email: "beltrana@email.com",
    password: "beltrana00",
    createdAt: new Date().toISOString()
  },
  {
    id: "u003",
    name: "Sicrano",
    email: "sicrano@email.com",
    password: "sicrano999",
    createdAt: new Date().toISOString()
  }
];

export const products: TypeProducts[] = [
  {
    id: "prod001",
    name: "Mouse gamer",
    price: 250,
    description: "Melhor mouse do mercado!",
    imageUrl: "https://picsum.photos/seed/Mouse%20gamer/400"
  },
  {
    id: "prod002",
    name: "Monitor",
    price: 900,
    description: "Monitor LED Full HD 24 polegadas",
    imageUrl: "https://picsum.photos/seed/Monitor/400"
  },
  {
    id: "prod003",
    name: "Gabinete gamer",
    price: 400,
    description: "Gabinete Gamer Com 3 Fans Argb, Lateral de Vidro Temperado",
    imageUrl: "https://picsum.photos/seed/Monitor/400"
  }
];

export const createUser = (id: string, name: string, email: string, password: string): string => {
    const createdAt = new Date().toISOString();
    const newUser: TypeUsers = { id, name, email, password, createdAt };
    users.push(newUser);
    return "Cadastro realizado com sucesso";
  };
  
  export const getAllUsers = (): TypeUsers[] => {
    return users;
  };

  export const createProduct = (id: string, name: string, price: number, description: string, imageUrl: string): string => {
    const newProduct: TypeProducts = { id, name, price, description, imageUrl };
    products.push(newProduct);
    return "Produto criado com sucesso";
  };
  
  export const getAllProducts = (): TypeProducts[] => {
    return products;
  };

  export const searchProductsByName = (name: string): TypeProducts[] => {
    const searchWord = name.toLowerCase(); 
  
    return products.filter(product => product.name.toLowerCase().includes(searchWord));
 };