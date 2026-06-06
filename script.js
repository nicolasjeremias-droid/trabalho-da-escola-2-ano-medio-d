// Variáveis de estado do ecossistema do solo
let nivelBiodiversidade = 100;
let listaOrganismos = [];
let statusTexto = "";
let detalheTexto = "";

function setup() {
  // Cria um canvas que preenche a tela inteira
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '1');
  
  // Inicializa os organismos
  for (let i = 0; i < 80; i++) {
    listaOrganismos.push(new OrganismoEdafico());
  }

  // Vincula os botões usando p5.js select()
  select('#btn-queimada').mousePressed(aplicarManejoInadequado);
  select('#btn-direto').mousePressed(aplicarPlantioDireto);
  select('#btn-ilpf').mousePressed(aplicarILPF);
}

function draw() {
  // Cor de fundo simulando as camadas do solo profundo
  background(43, 29, 12);
  
  // Linhas que desenham os horizontes/camadas do solo
  stroke(65, 43, 21);
  strokeWeight(3);
  for (let y = 0; y < height; y += 50) {
    line(0, y, width, y + 8);
  }
  
  // Linhas mais finas simulando raízes/porosidade
  stroke(80, 55, 30);
  strokeWeight(1);
  for (let y = 20; y < height; y += 30) {
    line(0, y, width, y + 3);
  }

  // Atualiza e desenha cada criatura viva
  for (let i = 0; i < listaOrganismos.length; i++) {
    listaOrganismos[i].mover();
    listaOrganismos[i].exibir();
  }

  // Remove organismos mortos periodicamente para performance
  listaOrganismos = listaOrganismos.filter(org => org.vivo === true);
  
  // Adiciona novos organismos se a biodiversidade estiver alta
  if (nivelBiodiversidade > 70 && listaOrganismos.length < 120) {
    if (frameCount % 120 === 0) {
      listaOrganismos.push(new OrganismoEdafico());
    }
  }

  // Atualiza as caixas de texto
  atualizarInterfaceGrafica();
}

// Classe que cria e gerencia a fauna subterrânea
class OrganismoEdafico {
  constructor() {
    this.x = random(width);
    this.y = random(150, height);
    this.tamanho = random(4, 15);
    this.velocidadeX = random(-1.2, 1.2);
    this.velocidadeY = random(-0.8, 0.8);
    this.tipo = random(['minhoca', 'microbiota', 'detritivoro']);
    this.vivo = true;
    this.corViva = this.definirCor();
  }

  definirCor() {
    if (this.tipo === 'minhoca') return [212, 114, 114];
    if (this.tipo === 'microbiota') return [129, 199, 132];
    return [255, 183, 77];
  }

  mover() {
    if (this.vivo) {
      this.x += this.velocidadeX;
      this.y += this.velocidadeY;

      // Rebate nas bordas
      if (this.x < 0 || this.x > width) this.velocidadeX *= -1;
      if (this.y < 140 || this.y > height) this.velocidadeY *= -1;
      
      // Garante que fique dentro
      this.x = constrain(this.x, 0, width);
      this.y = constrain(this.y, 140, height);
    }
  }

  exibir() {
    noStroke();
    if (!this.vivo) {
      fill(80, 80, 80, 80);
      ellipse(this.x, this.y, this.tamanho * 0.8);
      return;
    }

    fill(this.corViva[0], this.corViva[1], this.corViva[2], 220);
    
    if (this.tipo === 'minhoca') {
      ellipse(this.x, this.y, this.tamanho * 2.2, this.tamanho * 0.7);
      // Detalhe do anel da minhoca
      fill(180, 90, 90, 180);
      ellipse(this.x, this.y - 2, this.tamanho * 1.2, this.tamanho * 0.3);
    } else if (this.tipo === 'microbiota') {
      ellipse(this.x, this.y, this.tamanho);
      // Brilho nos microrganismos
      fill(200, 230, 200, 100);
      ellipse(this.x - 1, this.y - 1, this.tamanho * 0.5);
    } else {
      rect(this.x, this.y, this.tamanho, this.tamanho, 3);
    }
  }
}

// Função para calcular o nível de biodiversidade baseado nos organismos vivos
function calcularNivelPorOrganismos() {
  let vivos = listaOrganismos.filter(org => org.vivo === true).length;
  let percentual = (vivos / 80) * 100;
  nivelBiodiversidade = constrain(Math.floor(percentual), 0, 100);
  return nivelBiodiversidade;
}

// Funções de Interação e Simulação
function aplicarManejoInadequado() {
  nivelBiodiversidade = max(10, nivelBiodiversidade - 28);
  
  // Mata parte dos organismos
  listaOrganismos.forEach(org => {
    if (random(100) > nivelBiodiversidade + 20) {
      org.vivo = false;
    }
  });

  statusTexto = `🌱 Biodiversidade: ${nivelBiodiversidade}% (Crítico / Solo Degradado)`;
  detalheTexto = "⚠️ A monocultura e o uso excessivo de pesticidas alteraram o pH e erradicaram organismos benéficos [cite: 58, 60, 61]. Sem a biologia ativa, o solo torna-se compactado e dependente de insumos químicos [cite: 90].";
  
  // Feedback visual adicional
  select('#status-biodiversidade').style('color', '#f44336');
}

function aplicarPlantioDireto() {
  nivelBiodiversidade = min(80, nivelBiodiversidade + 22);
  
  // Revive organismos aleatoriamente
  listaOrganismos.forEach(org => {
    if (!org.vivo && random(100) < 35) {
      org.vivo = true;
    }
  });

  statusTexto = `🌿 Biodiversidade: ${nivelBiodiversidade}% (Em Recuperação)`;
  detalheTexto = "✅ Ótima escolha! O Sistema de Plantio Direto não revolve a terra, preservando os canais das minhocas e os filamentos de fungos fundamentais para a agregação do solo [cite: 68, 70].";
  
  select('#status-biodiversidade').style('color', '#ff9800');
}

function aplicarILPF() {
  nivelBiodiversidade = 100;
  
  // Restaura completamente a vida
  listaOrganismos.forEach(org => {
    org.vivo = true;
  });
  
  // Adiciona novos organismos se necessário
  if (listaOrganismos.length < 100) {
    let adicionar = 100 - listaOrganismos.length;
    for (let i = 0; i < adicionar; i++) {
      listaOrganismos.push(new OrganismoEdafico());
    }
  }

  statusTexto = "🌳 Biodiversidade: 100% (Equilíbrio Ecológico Máximo)";
  detalheTexto = "🌟 Excelente! A Integração Lavoura-Pecuária-Floresta (ILPF) traz diversidade extrema de raízes e recursos [cite: 62, 65]. Isso gera redundância funcional: alta resiliência e fertilidade natural [cite: 66, 83].";
  
  select('#status-biodiversidade').style('color', '#4caf50');
}

function atualizarInterfaceGrafica() {
  let statusDiv = select('#status-biodiversidade');
  let detalheP = select('#detalhe-cientifico');
  
  // Se os textos já foram definidos pelos botões, mantém
  if (statusTexto === "") {
    // Atualiza baseado nos organismos vivos
    let nivelAtual = calcularNivelPorOrganismos();
    statusDiv.html(`🌍 Biodiversidade: ${nivelAtual}%`);
    
    if (nivelAtual > 75) {
      detalheP.html("O solo está saudável. Os engenheiros do ecossistema (minhocas) e a microbiota estão reciclando os nutrientes perfeitamente [cite: 18, 32].");
      statusDiv.style('color', '#4caf50');
    } else if (nivelAtual > 40) {
      detalheP.html("A biodiversidade do solo está moderada. Práticas como rotação de culturas podem ajudar na recuperação [cite: 45].");
      statusDiv.style('color', '#ff9800');
    } else {
      detalheP.html("A vida no solo está severamente comprometida. É urgente adotar práticas regenerativas como plantio direto e integração lavoura-pecuária-floresta [cite: 90].");
      statusDiv.style('color', '#f44336');
    }
  } else {
    statusDiv.html(statusTexto);
    detalheP.html(detalheTexto);
  }
}

// Ajusta o canvas quando a janela redimensionar
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}