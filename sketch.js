let vida = 100
let energia = 100
let iniciado = false
let telaIniciada = false

let botaoIniciar
let botaoRecarga

let playerX = 388
let playerY = 260
const VELOCIDADE = 6
const MAX_LIXOS = 10
let lixosIniciais = []
let lixosLaranjas = []

let portalDisponivel = false
let entrouPortalVerde = false
let jogoFinalizado = false

let imgJogador
let imgFundo
let imgFundoDIR
let imglixo

let contIniciais = 0
let contLaranjas = 0

function preload() {
  imgJogador = loadImage('agri.PNG')
  imgFundo    = loadImage('backdrop1.png')
  imgFundoDIR = loadImage('1.png')
  imglixo     = loadImage('MINE.png')
}

function setup() {
  createCanvas(905, 650)
  background('rgb(148,148,233)')
  textAlign(LEFT, TOP)
  textFont('Comic Sans MS')

  botaoIniciar = createButton('START')
  botaoIniciar.position(width / 2 - 50, height / 2 - 25)
  botaoIniciar.style('font-size', '60px')
  botaoIniciar.mousePressed(iniciarJogo)

  console.log('Bem Vindo')
}

function draw() {
  if (!telaIniciada) return

  if (jogoFinalizado) {
    background(0)
    textSize(30)
    fill(255, 255, 0)
    textAlign(CENTER, CENTER)
    text(
      'As áreas rurais e as áreas urbanas são importantes,\nOBRIGADO POR JOGAR!',
      width / 2,
      height / 2
    )
    textAlign(LEFT, TOP)
    noLoop()
    return
  }

  desenharFundo()
  desenharHUD()
  desenharJogador()
  moverJogador()
  atualizarVidaEnergia()

  playerX = constrain(playerX, 0, width - 65)
  playerY = constrain(playerY, 0, height - 110)

  if (!portalDisponivel) {
    desenharLixosIniciais()
  }

  if (portalDisponivel && !entrouPortalVerde) {
    desenharPortais()
  }

  if (entrouPortalVerde) {
    desenharLixosLaranjas()
    if (lixosLaranjas.length === 0) {
      jogoFinalizado = true
    }
  }
}

function iniciarJogo() {
  console.log('Use as setas para andar')
  botaoIniciar.hide()
  telaIniciada = true
  setTimeout(() => iniciado = true, 5000)
  gerarLixosIniciais()
  criarBotaoRecarga()
}

function desenharFundo() {
  if (entrouPortalVerde) {
    if (imgFundoDIR) {
      image(imgFundoDIR, 0, 0, width, height)
    } else {
      background(0)
    }
  } else {
    if (imgFundo) {
      image(imgFundo, 0, 0, width, height)
    } else {
      background(100)
    }
  }
}

function desenharHUD() {
  noStroke()
  fill(255)
  rect(5, 5, 200, 80)
  textSize(40)
  fill(0)
  text('Vida: ' + vida, 10, 10)
  text('TP: ' + energia, 10, 50)
}

function desenharJogador() {
  const movendo =
    keyIsDown(RIGHT_ARROW) ||
    keyIsDown(LEFT_ARROW) ||
    keyIsDown(UP_ARROW) ||
    keyIsDown(DOWN_ARROW)
  if (!movendo) {
    push()
    translate(playerX + 65, playerY)
    scale(-1, 1)
    if (imgJogador) image(imgJogador, 0, 0, 65, 110)
    pop()
  } else {
    if (imgJogador) image(imgJogador, playerX, playerY, 65, 110)
  }
}

function moverJogador() {
  if (energia <= 0) return
  if (keyIsDown(RIGHT_ARROW)) playerX += VELOCIDADE
  if (keyIsDown(LEFT_ARROW))  playerX -= VELOCIDADE
  if (keyIsDown(UP_ARROW))    playerY -= VELOCIDADE
  if (keyIsDown(DOWN_ARROW))  playerY += VELOCIDADE
}

function atualizarVidaEnergia() {
  if (!iniciado) return
  if (frameCount % 30 === 0) vida = max(0, vida - 1)
  if (frameCount % 100 === 0) energia = max(0, energia - 10)
}

function desenharLixosIniciais() {
  for (let i = lixosIniciais.length - 1; i >= 0; i--) {
    const lixo = lixosIniciais[i]
    if (imglixo) {
      image(imglixo, lixo.x, lixo.y, lixo.tamanho + 10, lixo.tamanho + 10)
    } else {
      fill(145)
      rect(lixo.x, lixo.y, lixo.tamanho, lixo.tamanho)
    }
    const raioJog   = 65 / 2
    const raioLixo  = lixo.tamanho / 2
    const centroX   = playerX + raioJog
    const centroY   = playerY + 110 / 2
    const distancia = dist(centroX, centroY, lixo.x + raioLixo, lixo.y + raioLixo)

    if (distancia < raioJog + raioLixo) {
      textSize(16)
      fill(0)
      stroke('black')
      textAlign(CENTER, CENTER)
      text('Segure W', lixo.x + raioLixo, lixo.y - raioLixo - 10)
      textAlign(LEFT, TOP)

      if (keyIsDown(87)) {
        if (!lixo.coletando) {
          lixo.coletando = millis()
        } else if (millis() - lixo.coletando >= 2000) {
          vida = min(100, vida + lixo.valorVida)
          contIniciais++
          console.log('SEMENTES iniciais coletadas:', contIniciais)
          lixosIniciais.splice(i, 1)
          checarAparecerPortal()
          continue
        }
      } else {
        lixo.coletando = null
      }
    }
  }
}

function checarAparecerPortal() {
  if (lixosIniciais.length === 0) portalDisponivel = true
}

function desenharLixosLaranjas() {
  for (let i = lixosLaranjas.length - 1; i >= 0; i--) {
    const bola = lixosLaranjas[i]
    fill(255, 165, 0)
    text('⚡', bola.x, bola.y, bola.tamanho)
    const raioJog   = 65 / 2
    const raioBola  = bola.tamanho / 2
    const distancia = dist(playerX + raioJog, playerY + 110 / 2, bola.x, bola.y)

    if (distancia < raioJog + raioBola) {
      textSize(16)
      fill(0)
      textAlign(CENTER, CENTER)
      text('Segure W', bola.x, bola.y - raioBola - 10)
      textAlign(LEFT, TOP)

      if (keyIsDown(87)) {
        if (!bola.coletando) {
          bola.coletando = millis()
        } else if (millis() - bola.coletando >= 3500) {
          vida = min(100, vida + bola.valorVida)
          contLaranjas++
          console.log('RAIOS coletados:', contLaranjas)
          lixosLaranjas.splice(i, 1)
        }
      } else {
        bola.coletando = null
      }
    }
  }
}

function gerarLixosIniciais() {
  lixosIniciais = []
  for (let i = 0; i < MAX_LIXOS; i++) {
    const tamanhoAleatorio = random(20, 50)
    lixosIniciais.push({
      x: random(100, width - 100),
      y: random(100, height - 100),
      tamanho: tamanhoAleatorio,
      valorVida: floor(random(5, 10)),
      coletando: null
    })
  }
}

function gerarLixosLaranjas() {
  lixosLaranjas = []
  for (let i = 0; i < MAX_LIXOS; i++) {
    const tamanhoAleatorio = random(20, 50)
    lixosLaranjas.push({
      x: random(100, width - 100),
      y: random(100, height - 100),
      tamanho: tamanhoAleatorio,
      valorVida: floor(random(1, 11)),
      coletando: null
    })
  }
}

function desenharPortais() {
  const larguraVerde = 100
  const alturaVerde  = 60
  const portalVerdeX = width / 2 - larguraVerde / 2
  const portalVerdeY = height - alturaVerde
  fill('black')
  rect(portalVerdeX, portalVerdeY, larguraVerde, alturaVerde)

  const centroX   = portalVerdeX + larguraVerde / 2
  const centroY   = portalVerdeY + alturaVerde / 2
  const raioJog   = 65 / 2
  const raioTotal = raioJog + max(larguraVerde, alturaVerde) / 2

  if (dist(playerX + raioJog, playerY + 110 / 2, centroX, centroY) < raioTotal) {
    textSize(16)
    fill(255)
    textAlign(CENTER, CENTER)
    text('Aperte E', centroX, centroY - alturaVerde / 2 - 10)
    textAlign(LEFT, TOP)

    if (keyIsDown(69)) {
      entrouPortalVerde = true
      portalDisponivel   = false
      playerX            = 388
      playerY            = 260
      gerarLixosLaranjas()
    }
  }
}

function criarBotaoRecarga() {
  botaoRecarga = createButton('+10 TP')
  botaoRecarga.position(20, height - 40)
  botaoRecarga.mousePressed(() => {
    energia = min(100, energia + 10)
  })
}
