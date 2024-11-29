// Snake
let canvaW = 400;
let canvaH = 400;

// variáveis da snake
let xCobra = 50;
let yCobra = 40;
let wCobra = 10;
let hCobra = 10;

// velocidade da movimentação
let velocidadeMovimentacao = 2;

// variáveis da velocidade
let incrementoVelocidade = 0.5;  // valor pelo qual a velocidade vai aumentar
let velocidadeMaxima = 10;  // velocidade máxima permitida

let direcao = "right";

let partes = 1;
let rabo = [];

posicaoXcomida = randomIntFromInterval(11, canvaW - 8);
posicaoYcomida = randomIntFromInterval(11, canvaH - 8)

let colidiu = false;
let comeu = false;

// paredes
let wParED = 10;
let hParED = 400;
let posXParE = 0;
let posYParE = 0;
let posXParD = 390;
let posYParD = 0;

// cima / baixo
let wParCB = 400;
let hParCB = 10;
let posXParC = 0;
let posYParC = 0;
let posXParB = 0;
let posYParB = 390;

// Variável para a pontuação
let pontos = 0;

function setup() {
  createCanvas(canvaW, canvaH);
}

function draw() {
  background(200);
  desenhaCobra();
  controleMovimentacao();
  desenhaParedes();
  desenhaComida();
  comer();
  pegarPosicaoAtual();
  colisaoNasParedes();
  
  // Exibe a pontuação no canto superior esquerdo
  fill(0);  // Cor preta para o texto
  textSize(20);  // Tamanho da fonte
  text("Pontos: " + pontos, 10, 30);  // Texto com a pontuação
}

function desenhaCobra() {
  let c = color(255, 160, 122);
  fill(c);
  rect(xCobra, yCobra, wCobra, hCobra);

  if (rabo.length > 0) {
    for (var i = 0; i < rabo.length; i++) {
      rect(rabo[i][0], rabo[i][1], wCobra, hCobra);
    }
  }
}

function controleMovimentacao() {
  if (controleCobra()) {
    direcao = controleCobra();
  }

  if (direcao == "left") {
    xCobra -= velocidadeMovimentacao;
  }
  if (direcao == "right") {
    xCobra += velocidadeMovimentacao;
  }
  if (direcao == "down") {
    yCobra += velocidadeMovimentacao;
  }
  if (direcao == "up") {
    yCobra -= velocidadeMovimentacao;
  }
}

function controleCobra() {
  if (keyIsDown(LEFT_ARROW)) {
    return "left";
  }
  if (keyIsDown(RIGHT_ARROW)) {
    return "right";
  }
  if (keyIsDown(UP_ARROW)) {
    return "up";
  }
  if (keyIsDown(DOWN_ARROW)) {
    return "down";
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function desenhaParedes() {
  let Par = color(139, 69, 19);
  fill(Par);
  rect(posXParE, posYParE, wParED, hParED);
  rect(posXParD, posYParD, wParED, hParED);
  rect(posXParC, posYParC, wParCB, hParCB);
  rect(posXParB, posYParB, wParCB, hParCB);
}

function desenhaComida() {
  let Par = color(139, 0, 0);
  fill(Par);
  rect(posicaoXcomida, posicaoYcomida, 10, 10);
}

// Função que verifica se a comida está sobre a cobra ou sobre as paredes
function verificarPosicaoComida(x, y) {
  // Verificar se está sobre as paredes
  if (
    collideRectRect(x, y, 10, 10, posXParE, posYParE, wParED, hParED) ||
    collideRectRect(x, y, 10, 10, posXParD, posYParD, wParED, hParED) ||
    collideRectRect(x, y, 10, 10, posXParC, posYParC, wParCB, hParCB) ||
    collideRectRect(x, y, 10, 10, posXParB, posYParB, wParCB, hParCB)
  ) {
    return true;
  }

  // Verificar se está sobre o corpo da cobra
  for (let i = 0; i < rabo.length; i++) {
    if (rabo[i][0] === x && rabo[i][1] === y) {
      return true; // A comida está sobre o corpo da cobra
    }
  }

  // Verificar se está sobre a cabeça da cobra
  if (x === xCobra && y === yCobra) {
    return true; // A comida está sobre a cabeça da cobra
  }

  return false; // Não está sobre a cobra nem sobre as paredes
}

// Função para gerar uma nova posição para a comida, que não está sobre a cobra ou paredes
function gerarPosicaoComida() {
  let novaPosX, novaPosY;

  do {
    novaPosX = randomIntFromInterval(10, canvaW - 10);
    novaPosY = randomIntFromInterval(10, canvaH - 10);
  } while (verificarPosicaoComida(novaPosX, novaPosY)); // Regerar até encontrar uma posição válida

  return [novaPosX, novaPosY];
}

function comer() {
  if (colisaoComida()) {
    // Gera uma nova posição para a comida que não colida com a cobra ou as paredes
    [posicaoXcomida, posicaoYcomida] = gerarPosicaoComida();
    partes += 1;
    pontos += 1; // Aumenta a pontuação a cada comida comida

    // Aumenta a velocidade a cada vez que a cobra come, até o máximo definido
    if (velocidadeMovimentacao < velocidadeMaxima) {
      velocidadeMovimentacao += incrementoVelocidade;
    }
  }
}

function colisaoComida() {
  var colisaoComida = collideRectRect(posicaoXcomida, posicaoYcomida, 10, 10, xCobra, yCobra, wCobra, hCobra);
  return colisaoComida;
}

function pegarPosicaoAtual() {
  rabo.push([xCobra, yCobra]);
  if (rabo.length > partes) {
    rabo.shift();
  }
}

function colisaoNasParedes() {
  var colisaoDireita = collideRectRect(xCobra, yCobra, wCobra, hCobra, posXParD, posYParD, wParED, hParED);
  var colisaoEquerda = collideRectRect(xCobra, yCobra, wCobra, hCobra, posXParE, posYParE, wParED, hParED);
  var colisaoCima = collideRectRect(xCobra, yCobra, wCobra, hCobra, posXParC, posYParC, wParCB, hParCB);
  var colisaoBaixo = collideRectRect(xCobra, yCobra, wCobra, hCobra, posXParB, posYParB, wParCB, hParCB);

  if (colisaoCima == true || colisaoBaixo == true || colisaoDireita == true || colisaoEquerda == true) {
    xCobra = 200;
    yCobra = 200;
    rabo = [];
    partes = 0;
    pontos = 0; // Reseta a pontuação quando a cobra colide com a parede
    velocidadeMovimentacao = 2; // Reseta a velocidade quando a cobra colide com a parede
  }
}
