"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
// console.log('Hello, TypeScript!');
console.log('Users:', database_1.users);
console.log('Products:', database_1.products);
console.table(database_1.users);
console.table(database_1.products);
