import { users, products, createUser, getAllUsers, createProduct, getAllProducts, searchProductsByName } from './database';

// console.log('Hello, TypeScript!');

// console.log(users);
// console.log(products);

// console.table(users);
// console.table(products);

// Exemplo de uso do createUser
const createUserResult = createUser("u004", "Astrodev", "astrodev@email.com", "astrodev33");
console.log(createUserResult);

// Exemplo de uso do getAllUsers
const allUsers = getAllUsers();
console.log('Todos os usuários:', allUsers);

// Exemplo de uso do createProduct
const createProductResult = createProduct("prod004", "SSD 2TB", 600, "Acelere seu sistema para poder desfrutar dos seus jogos com mais velocidade.", "https://picsum.photos/seed/Monitor/400");
console.log(createProductResult);

// Exemplo de uso do getAllProducts
const allProducts = getAllProducts();
console.log('Todos os produtos:', allProducts);

// Exemplo de uso do searchProductsByName
const searchResults = searchProductsByName('gamer');
console.log('Resultados da busca:', searchResults);