// Função para gerar número aleatório entre min e max (incluindo ambos)
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Obtém a escolha do jogador via argumento
  const [, , jogadorEscolha] = process.argv;
  
  const opcoes = ["pedra", "papel", "tesoura"];
  const computadorEscolha = opcoes[getRndInteger(0, 2)];
  
  if (jogadorEscolha === computadorEscolha) {
    console.log(`Você escolheu ${jogadorEscolha} e o computador escolheu ${computadorEscolha}. Empate!`);
  } else if (
    (jogadorEscolha === "pedra" && computadorEscolha === "tesoura") ||
    (jogadorEscolha === "papel" && computadorEscolha === "pedra") ||
    (jogadorEscolha === "tesoura" && computadorEscolha === "papel")
  ) {
    console.log(`Você escolheu ${jogadorEscolha} e o computador escolheu ${computadorEscolha}. Você ganhou!`);
  } else if (
    (jogadorEscolha === "pedra" && computadorEscolha === "papel") ||
    (jogadorEscolha === "papel" && computadorEscolha === "tesoura") ||
    (jogadorEscolha === "tesoura" && computadorEscolha === "pedra")
  ) {
    console.log(`Você escolheu ${jogadorEscolha} e o computador escolheu ${computadorEscolha}. Você perdeu!`);
  }