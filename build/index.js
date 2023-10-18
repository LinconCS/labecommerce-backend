"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
// console.log('Hello, TypeScript!');
// console.log(users);
// console.log(products);
// console.table(users);
// console.table(products);
// Exemplo de uso do createUser
const createUserResult = (0, database_1.createUser)("u004", "Astrodev", "astrodev@email.com", "astrodev33");
console.log(createUserResult);
// Exemplo de uso do getAllUsers
const allUsers = (0, database_1.getAllUsers)();
console.log('Todos os usuários:', allUsers);
// Exemplo de uso do createProduct
const createProductResult = (0, database_1.createProduct)("prod004", "SSD 2TB", 600, "Acelere seu sistema para poder desfrutar dos seus jogos com mais velocidade.", "https://picsum.photos/seed/Monitor/400");
console.log(createProductResult);
// Exemplo de uso do getAllProducts
const allProducts = (0, database_1.getAllProducts)();
console.log('Todos os produtos:', allProducts);
// Exemplo de uso do searchProductsByName
const searchResults = (0, database_1.searchProductsByName)('gamer');
console.log('Resultados da busca:', searchResults);
