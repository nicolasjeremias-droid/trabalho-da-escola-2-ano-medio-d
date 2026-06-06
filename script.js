// Variáveis de estado do ecossistema do solo
let nivelBiodiversidade = 100;
let listaOrganismos = [];
let statusTexto = "";
let detalheTexto = "";

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '1');
  
  // Inicializa a população de organismos edáficos
  for (let i = 0; i < 80; i++) {
    listaOrganismos.push(new OrganismoEdafico());
  }

  // Vincula os botões de simulação usando p5.js select()
  select('#btn-queimada').mousePressed(aplicarManejoInadequado);
  select('#btn-direto').mousePressed(aplicarPlantioDireto);
  select('#btn-ilpf').mousePressed(aplicarILPF);
  
  // Vincula os botões para abrir o modal de informações completas
  select('#btn-info-queimada').mousePressed(() => mostrarInfoCompleta('queimada'));
  select('#btn-info-direto').mousePressed(() => mostrarInfoCompleta('direto'));
  select('#btn-info-ilpf').mousePressed(() => mostrarInfoCompleta('ilpf'));
  
  // Configuração de fechamento do Modal
  let modal = select('#modal-info');
  let fechar = select('.fechar-modal');
  fechar.mousePressed(() => modal.style('display', 'none'));
  
  // Fecha o modal ao clicar fora da área de conteúdo
  modal.mousePressed((event) => {
    if (event.target === modal.elt) {
      modal.style('display', 'none');
    }
  });
}

function draw() {
  background(43, 29, 12);
  
  // Renderização das linhas estéticas de camadas do solo
  stroke(65, 43, 21);
  strokeWeight(3);
  for (let y = 0; y < height; y += 50) {
    line(0, y, width, y + 8);
  }
  
  stroke(80, 55, 30);
  strokeWeight(1);
  for (let y = 20; y < height; y += 30) {
    line(0, y, width, y + 3);
  }

  // Atualiza física e desenha organismos na tela
  for (let i = 0; i < listaOrganismos.length; i++) {
    listaOrganismos[i].mover();
    listaOrganismos[i].exibir();
  }

  // Remove organismos que morreram na simulação
  listaOrganismos = listaOrganismos.filter(org => org.vivo === true);
  
  // Regeneração natural lenta se o ambiente estiver saudável
  if (nivelBiodiversidade > 70 && listaOrganismos.length < 120) {
    if (frameCount % 120 === 0) {
      listaOrganismos.push(new OrganismoEdafico());
    }
  }

  atualizarInterfaceGrafica();
}

// INSERÇÃO DINÂMICA DE DADOS DO SEU DOCUMENTO NO MODAL
function mostrarInfoCompleta(tipo) {
  let modal = select('#modal-info');
  let modalConteudo = select('#modal-conteudo');
  let conteudoHTML = "";
  
  if (tipo === 'queimada') {
    conteudoHTML = `
      <h2>⚠️ Monocultura e Práticas Inadequadas</h2>
      <p>As práticas agrícolas inadequadas representam uma das principais ameaças à biodiversidade do solo e à sustentabilidade da produção agrícola.</p>
      
      <h3>📉 Impactos Negativos:</h3>
      <ul>
        <li><strong>Perda da Biodiversidade:</strong> A monocultura contínua reduz drasticamente a diversidade de macro e microrganismos do solo, transformando um ecossistema biologicamente ativo em um ambiente puramente mineral e severamente compactado.</li>
        <li><strong>Compactação e Degradação Física:</strong> O tráfego intenso de máquinas sem cobertura vegetal destrói os poros do solo, bloqueando a infiltração de água e impedindo o desenvolvimento de bioindicadores.</li>
        <li><strong>Dependência Química:</strong> O solo torna-se dependente de insumos químicos sintéticos devido à quebra dos ciclos naturais de nutrientes realizados pela biologia nativa.</li>
      </ul>
      
      <h3>📊 Evidência Científica do Projeto:</h3>
      <div class="citacao">
        <strong>Relatório da FAO (2020):</strong> No relatório global <em>State of Knowledge of Soil Biodiversity</em>, aponta-se que a atividade biológica do solo é responsável por regular cerca de <strong>90% das funções ecossistêmicas</strong> que sustentam a produção agrícola global. A degradação biológica coloca em risco a segurança alimentar futura.
      </div>
      
      <h3>🔄 Diretrizes de Recuperação:</h3>
      <ul>
        <li>Substituição imediata dos arranjos de cultivo único por sistemas de rotação diversificada.</li>
        <li>Interrupção de arações agressivas para possibilitar o restabelecimento das populações microbianas.</li>
      </ul>
    `;
  } 
  else if (tipo === 'direto') {
    conteudoHTML = `
      <h2>🌾 Sistema de Plantio Direto (SPD)</h2>
      <p>O Sistema de Plantio Direto é uma das tecnologias conservacionistas mais eficazes do mundo, fundamentada no não revolvimento do solo e na manutenção de uma cobertura viva ou morta permanente.</p>
      
      <h3>🌱 Pilares de Sustentabilidade:</h3>
      <ul>
        <li><strong>Revolvimento Zero:</strong> Preserva canais e galerias construídos por minhocas (engenheiras do solo) e mantém micélios fúngicos intactos.</li>
        <li><strong>Cobertura por Palhada:</strong> Regula a temperatura térmica do subsolo e protege a macro e microbiota contra radiação solar e erosão por chuvas impactantes.</li>
      </ul>
      
      <h3>📊 Evidência Científica do Projeto:</h3>
      <div class="citacao">
        <strong>Estudo Global PNAS (Anthony et al., 2023):</strong> Uma revisão abrangente quantificou que o solo é o lar de <strong>até 59% de todas as espécies vivas da Terra</strong>, consolidando-o como o bioma estruturalmente mais biodiverso do planeta. O Plantio Direto atua salvaguardando esse reservatório genético oculto.
      </div>
      
      <h3>🐛 Ganhos Práticos:</h3>
      <ul>
        <li>Aumento substancial no teor de matéria orgânica e fixação estável de carbono biológico no perfil do solo.</li>
      </ul>
    `;
  } 
  else if (tipo === 'ilpf') {
    conteudoHTML = `
      <h2>🌳 Integração Lavoura-Pecuária-Floresta (ILPF) e Rotação</h2>
      <p>A ILPF une as produções de grãos, carne/leite e madeira em consórcio espacial ou temporal na mesma propriedade, elevando os patamares de sustentabilidade agropecuária.</p>
      
      <h3>✨ Benefícios à Saúde do Solo:</h3>
      <ul>
        <li><strong>Diversidade de Sistemas Radiculares:</strong> Diferentes perfis de raízes quebram camadas compactadas e secretam compostos variados que alimentam bactérias benéficas variadas.</li>
        <li><strong>Redundância Funcional e Resiliência:</strong> Múltiplas espécies executam tarefas biológicas similares. Se uma população falha sob estresse, outra assume a regulação da fertilidade natural.</li>
      </ul>
      
      <h3>📊 Evidência Científica do Projeto:</h3>
      <div class="citacao">
        <strong>Inovação Tecnológica EMBRAPA (BioAS):</strong> A tecnologia pioneira de <strong>Bioanálise de Solo (BioAS)</strong> da Embrapa avalia a atividade das enzimas <em>beta-glicosidase</em> e <em>arilsulfatase</em>. Dados científicos comprovam que solos sob sistemas integrados (ILPF e rotações complexas) têm alta atividade enzimática, o que confere ao solo <strong>maior estabilidade produtiva em safras atingidas por veranicos (estresse hídrico moderado)</strong>, amortecendo perdas econômicas no campo.
      </div>
    `;
  }
  
  modalConteudo.html(conteudoHTML);
  modal.style('display', 'block');
}

// Classe que modela graficamente as espécies biológicas do solo
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
      if (this.x < 0 || this.x > width) this.velocidadeX *= -1;
      if (this.y < 140 || this.y > height) this.velocidadeY *= -1;
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
      fill(180, 90, 90, 180);
      ellipse(this.x, this.y - 2, this.tamanho * 1.2, this.tamanho * 0.3);
    } else if (this.tipo === 'microbiota') {
      ellipse(this.x, this.y, this.tamanho);
      fill(200, 230, 200, 100);
      ellipse(this.x - 1, this.y - 1, this.tamanho * 0.5);
    } else {
      rect(this.x, this.y, this.tamanho, this.tamanho, 3);
    }
  }
}

// Funções lógicas da simulação gráfica interativa
function calcularNivelPorOrganismos() {
  let vivos = listaOrganismos.filter(org => org.vivo === true).length;
  let percentual = (vivos / 80) * 100;
  nivelBiodiversidade = constrain(Math.floor(percentual), 0, 100);
  return nivelBiodiversidade;
}

function aplicarManejoInadequado() {
  nivelBiodiversidade = max(10, nivelBiodiversidade - 28);
  listaOrganismos.forEach(org => {
    if (random(100) > nivelBiodiversidade + 20) org.vivo = false;
  });
  statusTexto = `🌱 Biodiversidade: ${nivelBiodiversidade}% (Crítico / Solo Degradado)`;
  detalheTexto = "⚠️ A monocultura alterou a biologia ativa. O solo torna-se compactado, degradado e puramente mineral.";
  select('#status-biodiversidade').style('color', '#f44336');
}

function aplicarPlantioDireto() {
  nivelBiodiversidade = min(80, nivelBiodiversidade + 22);
  listaOrganismos.forEach(org => {
    if (!org.vivo && random(100) < 35) org.vivo = true;
  });
  statusTexto = `🌿 Biodiversidade: ${nivelBiodiversidade}% (Em Recuperação)`;
  detalheTexto = "✅ Ótima escolha! O Sistema de Plantio Direto não revolve a terra, preservando canais biológicos estruturais.";
  select('#status-biodiversidade').style('color', '#ff9800');
}

function aplicarILPF() {
  nivelBiodiversidade = 100;
  listaOrganismos.forEach(org => { org.vivo = true; });
  if (listaOrganismos.length < 100) {
    let adicionar = 100 - listaOrganismos.length;
    for (let i = 0; i < adicionar; i++) listaOrganismos.push(new OrganismoEdafico());
  }
  statusTexto = "🌳 Biodiversidade: 100% (Equilíbrio Ecológico Máximo)";
  detalheTexto = "🌟 Excelente! A rotação extrema e consorciação geram alta resiliência e estabilidade enzimática contra veranicos.";
  select('#status-biodiversidade').style('color', '#4caf50');
}

function atualizarInterfaceGrafica() {
  let statusDiv = select('#status-biodiversidade');
  let detalheP = select('#detalhe-cientifico');
  if (statusTexto === "") {
    let nivelAtual = calcularNivelPorOrganismos();
    statusDiv.html(`🌍 Biodiversidade: ${nivelAtual}%`);
    if (nivelAtual > 75) {
      detalheP.html("O solo está saudável. Os microrganismos e a fauna edáfica estão ciclando nutrientes perfeitamente.");
      statusDiv.style('color', '#4caf50');
    } else if (nivelAtual > 40) {
      detalheP.html("A biodiversidade está moderada. Práticas integradas e palhada contínua reverterão as perdas.");
      statusDiv.style('color', '#ff9800');
    } else {
      detalheP.html("A vida está seriamente comprometida. Recomenda-se adotar imediatamente tecnologias conservacionistas estruturadas.");
      statusDiv.style('color', '#f44336');
    }
  } else {
    statusDiv.html(statusTexto);
    detalheP.html(detalheTexto);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}