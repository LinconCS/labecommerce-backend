// Função para gerar número aleatório entre min e max (incluindo ambos)
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Obtém a escolha do jogador via argumentos
  const [, , jogadorEscolha, jogadorNumero] = process.argv;
  
  const jogadorNumeroInt = parseInt(jogadorNumero);
  const jogadorPar = jogadorEscolha === "par";
  
  // O computador escolhe o oposto da escolha do jogador
  const computadorPar = !jogadorPar;
  const computadorNumero = getRndInteger(0, 5);
  
  const resultado = jogadorNumeroInt + computadorNumero;
  
  console.log(`Você escolheu ${jogadorEscolha} e o computador escolheu ${computadorPar ? "par" : "ímpar"}. O resultado foi ${resultado}. Você ${resultado % 2 === 0 ? (jogadorPar ? "ganhou" : "perdeu") : (jogadorPar ? "perdeu" : "ganhou")}!`);
  