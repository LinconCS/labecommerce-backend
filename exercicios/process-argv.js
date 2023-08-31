// console.log(process.argv[2], process.argv[3]);

// Obtém os argumentos passados via process.argv
const argumentos = process.argv.slice(2);

// Exibe cada argumento no console
argumentos.forEach((arg, index) => {
    console.log(`"${arg}"`);
  });

// const formattedArgs = argumentos.map(arg => `"${arg}"`).join(' e ');
// console.log(formattedArgs);