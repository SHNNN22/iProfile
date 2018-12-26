// GLOBALS
const topDiv = document.querySelector('#topDiv')
let canvas
let unitsBar
let totalLength
let moduleLength
let module
const x = 0
const y = 150
const h = 55
let mod8Num
let restModule
let textBox
let slider
const segment = 4480
let clips
let a, b, result


//SETUP
function setup() {
  canvas = createCanvas(windowWidth, 300)

  // infos
  textBox = createInput('');
  textBox.attribute('placeholder', '15000')
  textBox.attribute('type', 'number')
  textBox.attribute('min', '560')
  textBox.attribute('max', '100000')
  textBox.parent(topDiv)
  let insert = createElement('strong', 'insert distance')
  insert.parent(topDiv)

  // shrink
  createElement('strong', 'shrink')
  slider = createSlider(22, 100, 30)

  // pan
  camera = createSlider(-1000, 0, 0)
  createElement('strong', 'pan')

  // calculator
  plus = createButton('+').parent('#calculator')
  minus = createButton('-').parent('#calculator')
  times = createButton('*').parent('#calculator')
  divis = createButton('/').parent('#calculator')
  plus.mousePressed(sum)
  minus.mousePressed(sub)
  times.mousePressed(mul)
  divis.mousePressed(div)
  para = createP('0').parent('#calculator')
}

function setVal() {
  a = Number(document.getElementById('a').value)
  b = Number(document.getElementById('b').value)
}

function sum() {
  setVal()
  result = a + b
  para.html(result)
}

function sub() {
  setVal()
  result = a - b
  para.html(result)
}

function mul() {
  setVal()
  result = a * b
  para.html(result)
}

function div() {
  setVal()
  result = a / b
  para.html(result)
}

// WINDOW RESIZED
function windowResized() {
  resizeCanvas(windowWidth, 300)
}

// Find total number of single modules
function modulesNum() {
  let n = totalLength / moduleLength
  return int(n)
}

// DRAW
function draw() {
  background(51)

  moduleLength = 280
  sliderLength = moduleLength / slider.value()
  totalLength = textBox.value()

  //texts
  textSize(15)
  fill(222)
  noStroke()
  text('Total length: ' + totalLength + ' mm', x, y - 110)
  let profileLength = modulesNum() * 280
  text('Profile length: ' + profileLength + ' mm', x, y - 90)
  let leftover = totalLength - profileLength
  text('Leftover: ' + leftover + ' mm', x, y - 70)

  // CONNECTORS
  if (totalLength < 6160) {
    connectors = 0
  } else if (profileLength >= 6160 && profileLength < 11760) {
    connectors = 1
  } else if (profileLength >= 11760 && profileLength < 15120) {
    connectors = 2
  } else {
    connectors = Math.floor(profileLength / segment)
  }
  text('180Corner: ' + connectors, x, y - 50)

  // CLIPS
  clips = Math.floor(profileLength / 600) + 1
  if (clips < 2) {
    clips = 2
  }
  text('Clips: ' + clips, x, y - 30)

  // SUSPENSION
  suspensions = Math.floor(profileLength / 1000)
  if (suspensions < 3) {
    suspensions = 2
  }
  text('Suspensions: ' + suspensions, x, y - 10)

  textSize(12)
  stroke(0)

  // units
  noFill()
  unitsBar = rect(x + camera.value(), y, totalLength / slider.value(), h / 2)

  //single modules
  fill(100)
  for (let i = 0; i < modulesNum(); i++) {
    module = rect(i * sliderLength + camera.value(), y, sliderLength, h / 2)
  }

  mod8Num = Math.floor(modulesNum() / 8)
  for (let i = 0; i < mod8Num; i++) {
    fill(71, 115, 137)
    stroke(0)
    mod8Module = rect(i * sliderLength * 8 + camera.value(), y + h / 2, sliderLength * 8, h)
    fill(0, 0, 0)
    noStroke()
    text(`${i+ 1}
		224`, i * sliderLength * 8 + 4 + camera.value(), y + h - 10);
  }

  for (let i = 1; i <= connectors; i++) {
    stroke(0, 0, 255)
    connector = line(i * sliderLength * 16 + camera.value(), y + h, i * sliderLength * 16 + camera.value(), y + h * 2)
    stroke(0)
  }

  let rest = modulesNum() - (mod8Num * 8)
  let c

  switch (rest) {
    case 1:
      c = color('rgb(123,201,212)')
      translate(-(sliderLength * 8), 0)
      restModule = new Module(5, c, 140)
      restModule.show()
      c = color('rgb(162,227,193)')
      translate(sliderLength * 5, 0)
      restModule1 = new Module(4, c, 112)
      restModule1.show()
      break;

    case 2:
      c = color('rgb(237,255,171)')
      restModule = new Module(2, c, 56)
      restModule.show()
      break;

    case 3:
      c = color('rgb(211,249,175)')
      restModule = new Module(3, c, 84)
      restModule.show()
      break;

    case 4:
      c = color('rgb(162,227,193)')
      restModule = new Module(4, c, 112)
      restModule.show()
      break;

    case 5:
      c = color('rgb(123,201,212)')
      restModule = new Module(5, c, 140)
      restModule.show()
      break;

    case 6:
      c = color('rgb(106,154,178)')
      restModule = new Module(6, c, 168)
      restModule.show()
      break;

    case 7:
      c = color('rgb(162,227,193)')
      restModule = new Module(4, c, 112)
      restModule.show()
      c = color('rgb(211,249,175)')
      restModule1 = new Module(3, c, 84)
      translate(sliderLength * 4, 0)
      restModule1.show()
      break;
  }
}




class Module {
  constructor(n, c, type) {
    this.n = n
    this.c = c
    this.type = type
    this.newX = sliderLength * 8 * mod8Num + camera.value()
    let modNum = Math.floor(modulesNum() / this.n)
  }

  show() {
    fill(this.c)
    stroke(0)
    let lastMod = rect(this.newX, y + h / 2, sliderLength * this.n, h)
    fill(0, 0, 0)
    noStroke()
    text('1 \n' + this.type, this.newX + 4, y + h - 10);
  }
}
