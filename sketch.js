// GLOBALS
//const topDiv = document.querySelector('#topDiv')
let canvas
let unitsBar
let totalLength
const moduleLength = 280
let singleModule
const x = 0
const y = 230
const h = 55
let mod8Num
let restModule
let textBox
let shrink
let pan

let connectors
let suspensions
let clips

let module10Num
let shortBruto
let shortNet

const max3m = 2800
let unitsAmount
let shortMod

let a, b, result



//SETUP
function setup() {
  canvas = createCanvas(windowWidth, 350)
  output = createP(' ')
  // infos
  textBox = createInput('');
  textBox.attribute('placeholder', '15000')
	textBox.attribute('oninput', 'javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength)')
  textBox.attribute('type', 'number')
	textBox.attribute('step', '280')
	textBox.attribute('min', '0')
	textBox.attribute('maxlength', '5')
	textBox.attribute('id', 'focus')
	document.getElementById("focus").autofocus = true
  textBox.parent(topDiv)
  let insert = createElement('strong', 'insert distance')
  insert.parent(topDiv)

  // shrink
  createElement('strong', 'shrink')
  shrink = createSlider(22, 100, 22)

  // pan
  pan = createSlider(-1500, 0, 0)
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
  resizeCanvas(windowWidth, 350)
}

// Find total number of single modules
function modulesNum() {
  let unitNum = totalLength / moduleLength
  return int(unitNum)
}

// DRAW
function draw() {
  background(51)

  sliderLength = moduleLength / shrink.value()
  totalLength = textBox.value()

  //texts
  textSize(12)
  fill(222)
  noStroke()
  text(`Total length: ${totalLength} mm`, x, 20)
  let profileLength = modulesNum() * 280
  text(`Profile length: ${profileLength} mm`, x, 40)

  let leftover = totalLength - profileLength
  text(`Leftover: ${leftover} mm`, x, 60)

  // Connectors 3m - less cuts
  if (totalLength < 3080) {
    connectors = 0
  } else if (profileLength >= 3080 && profileLength < 5880) {
    connectors = 1
  } else if (profileLength % max3m == 0) {
    connectors = Math.floor(profileLength / max3m) - 1
  } else {
    connectors = Math.floor(profileLength / max3m)
  }

  // Suspension 3m - less cuts
  if (modulesNum() < 7) {
    suspensions = 2
  } else if (profileLength % max3m == 0) {
    suspensions = module10Num * 3
  } else {
    suspensions = module10Num * 3 + 2
  }

  text(`180Corner: ${connectors}    •    Suspensions: ${suspensions}`, x, y - h - 10)

  // Connectors 3m - less price
  if (profileLength < 3080) {
    connectors2 = 0
  } else if (profileLength % 2240 == 0 || profileLength % 2240 == 280) {
    connectors2 = mod8Num - 1
  } else {
    connectors2 = mod8Num
  }

  // Clips
  if (profileLength % 2240 == 0) {
    clips = mod8Num * 3
  } else {
    clips = mod8Num * 3 + 2
  }

  if (profileLength > 2240 && profileLength < 3080) {
    text(`180Corner: ${connectors2}    •    SRL TR clips: ${clips}    •    SRL 85 / MIC 60 clips: ${clips-2}`, x, y + h * 1.8)
  } else if ((modulesNum() - (mod8Num * 8)) == 1) {
    text(`180Corner: ${connectors2}    •    Clips: ${clips - 3}`, x, y + h * 1.8)
  } else {
    text(`180Corner: ${connectors2}    •    Clips: ${clips}`, x, y + h * 1.8)
  }

  // Long modules 3m - less cuts
  module10Num = Math.floor(profileLength / max3m)
  shortBruto = (profileLength - max3m * module10Num)
  unitsAmount = Math.floor(shortBruto / moduleLength)

  for (let i = 0; i < module10Num; i++) {
    textSize(1 * sliderLength)

		push()
    stroke(0)
    fill(71, 115, 137)
    let modL = rect(i * (sliderLength * 10) + pan.value(), y - h, sliderLength * 8, h)
		pop()

    noStroke()
    fill(0, 0, 0)
    text(`${i+1}
		224`, i * (sliderLength * 10) + pan.value() + 4, y - h + 20);

		push()
    stroke(0)
    fill(237, 255, 171)
    let modc = rect((i * (sliderLength * 10) + pan.value()) + (sliderLength * 8), y - h, sliderLength * 2, h)
		pop()

    text(`${i+1}
56`, (i * (sliderLength * 10) + pan.value()) + (sliderLength * 8) + 4, y - h + 20)
  }

  // Rest modules 3m - less cuts
  stroke(0)
  let xx = (sliderLength * 10 * module10Num) + pan.value()
  switch (unitsAmount) {
    case 9:
      fill(106, 154, 178)
      shortMod = rect(xx, y - h, 6 * sliderLength, h)

      noStroke()
      fill(0, 0, 0)
      text(`1
	168`, xx + 4, y - h + 20)

			if(profileLength>=2800){
				push()
				strokeWeight(4)
	      stroke(255, 255, 255)
	      connector = line(xx, y - h * .666, xx, y - h / 3.5)
				pop()
			}

      stroke(0)
      fill(211, 249, 175)
      shortMod = rect(xx + 6 * sliderLength, y - h, 3 * sliderLength, h)

      noStroke()
      fill(0, 0, 0)
      text(`1
	84`, xx + 6 * sliderLength + 4, y - h + 20)
      break

    case 8:
      fill(71, 115, 137)
      shortMod = rect(xx, y - h, 8 * sliderLength, h)

      noStroke()
      fill(0, 0, 0)
      text(`1
	224`, xx + 4, y - h + 20)

	if(profileLength>=2800){
			push()
      strokeWeight(4)
      stroke(255, 255, 255)
      connector = line(xx, y - h * .666, xx, y - h / 3.5)
      pop()
		}
      break

    case 7:
      fill(162, 227, 193)
      shortMod = rect(xx, y - h, 4 * sliderLength, h)

			push()
      noStroke()
      fill(0, 0, 0)
      text(`1
	112`, xx + 4, y - h + 20)
			pop()

			if(profileLength>=2800){
			push()
      strokeWeight(4)
      stroke(255, 255, 255)
      connector = line(xx, y - h * .666, xx, y - h / 3.5)
      pop()
}

      fill(211, 249, 175)
      shortMod = rect(xx + 4 * sliderLength, y - h, 3 * sliderLength, h)

			push()
      noStroke()
      fill(0, 0, 0)
      text(`1
	84`, xx + 4 * sliderLength + 4, y - h + 20)
			pop()
      break

    case 6:
      fill(106, 154, 178)
      shortMod = rect(xx, y - h, 6 * sliderLength, h)

      noStroke()
      fill(0, 0, 0)
      text(`1
	168`, xx + 4, y - h + 20)

	if(profileLength>=2800){
			push()
      strokeWeight(4)
      stroke(255, 255, 255)
      connector = line(xx, y - h * .666, xx, y - h / 3.5)
      pop()
		}
      break

    case 5:
      fill(123, 201, 212)
      shortMod = rect(xx, y - h, 5 * sliderLength, h)

      noStroke()
      fill(0, 0, 0)
      text(`1
	140`, xx + 4, y - h + 20)

	if(profileLength>=2800){
			push()
      strokeWeight(4)
      stroke(255, 255, 255)
      connector = line(xx, y - h * .666, xx, y - h / 3.5)
      pop()
		}
      break

    case 4:
      fill(162, 227, 193)
      shortMod = rect(xx, y - h, 4 * sliderLength, h)

      noStroke()
      fill(0, 0, 0)
      text(`1
	112`, xx + 4, y - h + 20)

	if(profileLength>=2800){
			push()
      strokeWeight(4)
      stroke(255, 255, 255)
      connector = line(xx, y - h * .666, xx, y - h / 3.5)
      pop()
		}
      break

    case 3:
      fill(211, 249, 175)
      shortMod = rect(xx, y - h, 3 * sliderLength, h)

      noStroke()
      fill(0, 0, 0)
      text(`1
	84`, xx + 4, y - h + 20)

	if(profileLength>=2800){
			push()
      strokeWeight(4)
      stroke(255, 255, 255)
      connector = line(xx, y - h * .666, xx, y - h / 3.5)
      pop()
		}
      break

    case 2:
      fill(237, 255, 171)
      shortMod = rect(xx, y - h, 2 * sliderLength, h)

      noStroke()
      fill(0, 0, 0)
      text(`1
56`, xx + 4, y - h + 20)

if(profileLength>=2800){
			push()
      strokeWeight(4)
      stroke(255, 255, 255)
      connector = line(xx, y - h * .666, xx, y - h / 3.5)
			pop()
		}
      break

    case 1:
      push()
      stroke(0)
      fill(211, 249, 175)
      translate(-(sliderLength * 2), 0)
      shortMod = rect(xx, y - h, 3 * sliderLength, h)

      noStroke()
      fill(0, 0, 0)
      text(`1
	84`, xx + 4, y - h + 20)

	if(profileLength>=2800){
      strokeWeight(4)
      stroke(255, 255, 255)
      connector = line(xx, y - h * .666, xx, y - h / 3.5)
      pop()
		}
      break
  }

  // units
  noFill()
  stroke(0)
  unitsBar = rect(x + pan.value(), y, totalLength / shrink.value(), h / 2)

  //single modules
  fill(100)
  for (let i = 0; i < modulesNum(); i++) {
    singleModule = rect(i * sliderLength + pan.value(), y, sliderLength, h / 2)
  }

  // Long modules 3m - less price
  mod8Num = Math.floor(modulesNum() / 8)
  for (let i = 0; i < mod8Num; i++) {
    push()
    fill(71, 115, 137)
    stroke(0)
    let mod8M = rect(i * sliderLength * 8 + pan.value(), y + h / 2, sliderLength * 8, h)
    pop()

		noStroke()
		fill(0)
    textSize(1 * sliderLength)
    text(`${i+ 1}
		224`, i * sliderLength * 8 + 4 + pan.value(), y + h - 10)
  }

  // Rest modules 3m - less price
  let rest = modulesNum() - (mod8Num * 8)
  let c

  switch (rest) {
    case 1:
      push()
      c = color('rgb(123,201,212)')
      translate(-(sliderLength * 8), 0)
      restModule = new Module(5, c, 140)
      restModule.show()
      c = color('rgb(162,227,193)')
      translate(sliderLength * 5, 0)
      restModule1 = new Module(4, c, 112)
      restModule1.show()
      pop()
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
      push()
      c = color('rgb(211,249,175)')
      restModule1 = new Module(3, c, 84)
      translate(sliderLength * 4, 0)
      restModule1.show()
      pop()
      break;
  }
  // connectors lines 3m - less cuts
  if (profileLength % max3m == 0) {
    for (let i = 1; i <= connectors; i++) {
      push()
      strokeWeight(4)
      stroke(255, 255, 255)
      connector = line(i * sliderLength * 10 + pan.value(), y - h * .666, i * sliderLength * 10 + pan.value(), y - h / 3.5)
      pop()
    }
  } else {
    for (let i = 1; i < connectors; i++) {
      push()
      strokeWeight(4)
      stroke(255, 255, 255)
      connector = line(i * sliderLength * 10 + pan.value(), y - h * .666, i * sliderLength * 10 + pan.value(), y - h / 3.5)
      pop()
    }
  }

	// connectors lines 3m - less price
		for (let i = 1; i <= connectors2; i++) {

			push()
			strokeWeight(4)
			stroke(255, 255, 255)
			connector = line(i * sliderLength * 8 + pan.value(), y + h * .8, i * sliderLength * 8 + pan.value(), y + h / .8)
			pop()
		}


}



class Module {
  constructor(n, c, type) {
    this.n = n
    this.c = c
    this.type = type
    this.newX = sliderLength * 8 * mod8Num + pan.value()
    let modNum = Math.floor(modulesNum() / this.n)
  }

  show() {
    fill(this.c)
    stroke(0)
    let lastMod = rect(this.newX, y + h / 2, sliderLength * this.n, h)
    fill(0, 0, 0)
    noStroke()
    if (this.type == 56) {
      text(`1
56`, this.newX + 4, y + h - 10)
    } else {
      text(`1
	${this.type}`, this.newX + 4, y + h - 10);
    }
  }
}
