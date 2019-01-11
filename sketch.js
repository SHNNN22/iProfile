var sketch1 = function(p) {
  // GLOBALS
  p.canvas
  p.unitsBar
  p.totalLength
  p.moduleLength = 280
  p.singleModule
  p.x = 0
  p.y = 230
  p.h = 55
  p.mod8Num
  p.restModule
  p.textBox
  p.shrink
  p.pan

  p.connectors
  p.suspensions
  p.clips

  p.module10Num
  p.shortBruto
  p.shortNet

  p.max3m = 2800
  p.unitsAmount
  p.shortMod

  p.a
  p.b
  p.result



  //SETUP
  p.setup = function() {
    textBox = p.createInput('')
    calculator = p.createDiv('').attribute('id', 'calculator')
    inputA = p.createInput('').parent('#calculator').attribute('id', 'a')
    inputB = p.createInput('').parent('#calculator').attribute('id', 'b')

    canvas = p.createCanvas(p.windowWidth, 350)
    canvas.parent('#sketch1')

    output = p.createP(' ')
    // infos
    textBox.attribute('placeholder', '15000')
    textBox.attribute('oninput', 'javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength)')
    textBox.attribute('type', 'number')
    textBox.attribute('step', '280')
    textBox.attribute('min', '0')
    textBox.attribute('maxlength', '5')
    textBox.attribute('id', 'focus')
    document.getElementById("focus").autofocus = true
    textBox.parent(topDiv)


    // shrink
    p.createElement('strong', 'shrink').parent('#p3m')
    p.shrink = p.createSlider(22, 100, 22).parent('#p3m')

    // pan
    p.pan = p.createSlider(-1500, 0, 0).parent('#p3m')
    p.createElement('strong', 'pan').parent('#p3m')

    // calculator
    p.plus = p.createButton('+').parent('#calculator')
    p.minus = p.createButton('-').parent('#calculator')
    p.times = p.createButton('*').parent('#calculator')
    p.divis = p.createButton('/').parent('#calculator')
    p.plus.mousePressed(sum)
    p.minus.mousePressed(sub)
    p.times.mousePressed(mul)
    p.divis.mousePressed(div)
    p.para = p.createP('0').parent('#calculator')

    // Note
    noteInput = p.createInput('').parent('#footer').attribute('placeholder', 'Take a note')
    note = p.createElement('ul').parent('#footer')
    noteInput.changed(changeNote);
  }

  function changeNote() {
    li = p.createElement('li', noteInput.value()).parent(note)
  }

  p.setVal = function() {
    p.a = Number(inputA.value())
    p.b = Number(inputB.value())
  }

  function sum() {
    p.setVal()
    p.result = p.a + p.b
    p.para.html(p.result)
  }

  function sub() {
    p.setVal()
    p.result = p.a - p.b
    p.para.html(p.result)
  }

  function mul() {
    p.setVal()
    p.result = p.a * p.b
    p.para.html(p.result)
  }

  function div() {
    p.setVal()
    p.result = p.a / p.b
    p.para.html(p.result)
  }

  // WINDOW RESIZED
  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, 350)
  }

  // Find total number of single modules
  p.modulesNum = function() {
    p.unitNum = p.totalLength / p.moduleLength
    return p.int(p.unitNum)
  }

  // DRAW
  p.draw = function() {
    p.background(51)

    p.sliderLength = p.moduleLength / p.shrink.value()
    p.totalLength = textBox.value()

    //texts
    p.textSize(12)
    p.fill(222)
    p.noStroke()
    p.text(`Total length: ${p.totalLength} mm`, p.x, 20)
    p.profileLength = p.modulesNum() * 280
    p.text(`Profile length: ${p.profileLength} mm`, p.x, 40)

    p.text(`Profile length with end caps: ${p.profileLength + 10} mm`, p.x, 60)
    p.leftover = p.totalLength - p.profileLength
    p.text(`Leftover: ${p.leftover} mm`, p.x, 80)

    // p.connectors 3m - less cuts
    if (p.totalLength < 3080) {
      p.connectors = 0
    } else if (p.profileLength >= 3080 && p.profileLength < 5880) {
      p.connectors = 1
    } else if (p.profileLength % p.max3m == 0) {
      p.connectors = Math.floor(p.profileLength / p.max3m) - 1
    } else {
      p.connectors = Math.floor(p.profileLength / p.max3m)
    }

    // Suspension 3m - less cuts
    if (p.modulesNum() >= 8) {
      if (p.profileLength % p.max3m == 0) {
        p.suspensions = p.module10Num * 3
      } else if (p.profileLength % p.max3m >= 280 && p.profileLength % p.max3m <= 1960) {
        p.suspensions = p.module10Num * 3 + 2
      } else if (p.profileLength % p.max3m > 1960) {
        p.suspensions = p.module10Num * 3 + 3
      }
    } else {
      p.suspensions = 2
    }

    p.text(`180Corner: ${p.connectors}    •    suspensions: ${p.suspensions}`, p.x, p.y - p.h - 10)

    // p.connectors 3m - less price
    if (p.profileLength < 3080) {
      p.connectors2 = 0
    } else if (p.profileLength % 2240 == 0 || p.profileLength % 2240 == 280) {
      p.connectors2 = p.mod8Num - 1
    } else {
      p.connectors2 = p.mod8Num
    }

    // ClipsTR
    if (p.profileLength % 2240 == 0) {
      p.clipsTR = p.mod8Num * 4
    } else if (p.profileLength % 2240 == 280) {
      p.clipsTR = p.mod8Num * 4 + 1
    } else if (p.profileLength % 2240 >= 560 && p.profileLength % 2240 <= 1120) {
      p.clipsTR = p.mod8Num * 4 + 2
    } else if (p.profileLength % 2240 > 1120 && p.profileLength % 2240 < 1960) {
      p.clipsTR = p.mod8Num * 4 + 3
    } else if (p.profileLength % 2240 >= 1960) {
      p.clipsTR = p.mod8Num * 4 + 4
    }

    // Clips
    if (p.profileLength % 2240 == 0 && p.profileLength % 2240 <= 560) {
      p.clips = p.mod8Num * 3
    } else if (p.profileLength % 2240 > 560) {
      p.clips = p.mod8Num * 3 + 2
    }

    p.text(`180Corner: ${p.connectors2}    •    SRL TR clips: ${p.clipsTR}    •    SRL 85 / MIC 60 clips: ${p.clips}`, p.x, p.y + p.h * 1.8)

    // Long modules 3m - less cuts
    p.module10Num = Math.floor(p.profileLength / p.max3m)
    p.shortBruto = (p.profileLength - p.max3m * p.module10Num)
    p.unitsAmount = Math.floor(p.shortBruto / p.moduleLength)

    for (i = 0; i < p.module10Num; i++) {
      p.textSize(1 * p.sliderLength)

      p.push()
      p.stroke(0)
      p.fill(71, 115, 137)
      p.modL = p.rect(i * (p.sliderLength * 10) + p.pan.value(), p.y - p.h, p.sliderLength * 8, p.h)
      p.pop()

      p.noStroke()
      p.fill(0, 0, 0)
      p.text(`${i+1}
  224`, i * (p.sliderLength * 10) + p.pan.value() + 4, p.y - p.h + 20);

      p.push()
      p.stroke(0)
      p.fill(237, 255, 171)
      p.modc = p.rect((i * (p.sliderLength * 10) + p.pan.value()) + (p.sliderLength * 8), p.y - p.h, p.sliderLength * 2, p.h)
      p.pop()

      p.text(`${i+1}
56`, (i * (p.sliderLength * 10) + p.pan.value()) + (p.sliderLength * 8) + 4, p.y - p.h + 20)
    }

    // Rest modules 3m - less cuts
    p.stroke(0)
    p.xx = (p.sliderLength * 10 * p.module10Num) + p.pan.value()
    switch (p.unitsAmount) {
      case 9:
        p.fill(106, 154, 178)
        p.shortMod = p.rect(p.xx, p.y - p.h, 6 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  168`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }

        p.stroke(0)
        p.fill(211, 249, 175)
        p.shortMod = p.rect(p.xx + 6 * p.sliderLength, p.y - p.h, 3 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  84`, p.xx + 6 * p.sliderLength + 4, p.y - p.h + 20)
        break

      case 8:
        p.fill(71, 115, 137)
        p.shortMod = p.rect(p.xx, p.y - p.h, 8 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
	224`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }
        break

      case 7:
        p.fill(162, 227, 193)
        p.shortMod = p.rect(p.xx, p.y - p.h, 4 * p.sliderLength, p.h)

        p.push()
        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
	112`, p.xx + 4, p.y - p.h + 20)
        p.pop()

        if (p.profileLength >= 2800) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }

        p.fill(211, 249, 175)
        p.shortMod = p.rect(p.xx + 4 * p.sliderLength, p.y - p.h, 3 * p.sliderLength, p.h)

        p.push()
        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
	84`, p.xx + 4 * p.sliderLength + 4, p.y - p.h + 20)
        p.pop()
        break

      case 6:
        p.fill(106, 154, 178)
        p.shortMod = p.rect(p.xx, p.y - p.h, 6 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
	168`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }
        break

      case 5:
        p.fill(123, 201, 212)
        p.shortMod = p.rect(p.xx, p.y - p.h, 5 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
	140`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }
        break

      case 4:
        p.fill(162, 227, 193)
        p.shortMod = p.rect(p.xx, p.y - p.h, 4 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
	112`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }
        break

      case 3:
        p.fill(211, 249, 175)
        p.shortMod = p.rect(p.xx, p.y - p.h, 3 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
	84`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }
        break

      case 2:
        p.fill(237, 255, 171)
        p.shortMod = p.rect(p.xx, p.y - p.h, 2 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
56`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }
        break

      case 1:
        p.push()
        p.stroke(0)
        p.fill(211, 249, 175)
        p.translate(-(p.sliderLength * 2), 0)
        p.shortMod = p.rect(p.xx, p.y - p.h, 3 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
	84`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800) {
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }
        break
    }

    // units
    p.noFill()
    p.stroke(0)
    p.unitsBar = p.rect(p.x + p.pan.value(), p.y, p.totalLength / p.shrink.value(), p.h / 2)

    // single modules
    p.fill(100)
    for (i = 0; i < p.modulesNum(); i++) {
      p.singleModule = p.rect(i * p.sliderLength + p.pan.value(), p.y, p.sliderLength, p.h / 2)
    }

    // Long modules 3m - less price
    p.mod8Num = Math.floor(p.modulesNum() / 8)
    for (i = 0; i < p.mod8Num; i++) {
      p.push()
      p.fill(71, 115, 137)
      p.stroke(0)
      mod8M = p.rect(i * p.sliderLength * 8 + p.pan.value(), p.y + p.h / 2, p.sliderLength * 8, p.h)
      p.pop()

      p.noStroke()
      p.fill(0)
      p.textSize(1 * p.sliderLength)
      p.text(`${i+ 1}
	224`, i * p.sliderLength * 8 + 4 + p.pan.value(), p.y + p.h - 10)
    }

    // Rest modules 3m - less price
    p.rest = p.modulesNum() - (p.mod8Num * 8)
    p.c

    switch (p.rest) {
      case 1:
        p.push()
        p.c = p.color('rgb(123,201,212)')
        p.translate(-(p.sliderLength * 8), 0)
        p.restModule = new Module(5, p.c, 140)
        p.restModule.show()
        p.c = p.color('rgb(162,227,193)')
        p.translate(p.sliderLength * 5, 0)
        p.restModule1 = new Module(4, p.c, 112)
        p.restModule1.show()
        p.pop()
        break;

      case 2:
        p.c = p.color('rgb(237,255,171)')
        p.restModule = new Module(2, p.c, 56)
        p.restModule.show()
        break;

      case 3:
        p.c = p.color('rgb(211,249,175)')
        p.restModule = new Module(3, p.c, 84)
        p.restModule.show()
        break;

      case 4:
        p.c = p.color('rgb(162,227,193)')
        p.restModule = new Module(4, p.c, 112)
        p.restModule.show()
        break;

      case 5:
        p.c = p.color('rgb(123,201,212)')
        p.restModule = new Module(5, p.c, 140)
        p.restModule.show()
        break;

      case 6:
        p.c = p.color('rgb(106,154,178)')
        p.restModule = new Module(6, p.c, 168)
        p.restModule.show()
        break;

      case 7:
        p.c = p.color('rgb(162,227,193)')
        p.restModule = new Module(4, p.c, 112)
        p.restModule.show()
        p.push()
        p.c = p.color('rgb(211,249,175)')
        p.restModule1 = new Module(3, p.c, 84)
        p.translate(p.sliderLength * 4, 0)
        p.restModule1.show()
        p.pop()
        break;
    }
    // p.connectors lines 3m - less cuts
    if (p.profileLength % p.max3m == 0) {
      for (i = 1; i <= p.connectors; i++) {
        p.push()
        p.strokeWeight(4)
        p.stroke(255, 255, 255)
        p.connector = p.line(i * p.sliderLength * 10 + p.pan.value(), p.y - p.h * .666, i * p.sliderLength * 10 + p.pan.value(), p.y - p.h / 3.5)
        p.pop()
      }
    } else {
      for (i = 1; i < p.connectors; i++) {
        p.push()
        p.strokeWeight(4)
        p.stroke(255, 255, 255)
        p.connector = p.line(i * p.sliderLength * 10 + p.pan.value(), p.y - p.h * .666, i * p.sliderLength * 10 + p.pan.value(), p.y - p.h / 3.5)
        p.pop()
      }
    }

    // p.connectors lines 3m - less price
    for (i = 1; i <= p.connectors2; i++) {

      p.push()
      p.strokeWeight(4)
      p.stroke(255, 255, 255)
      p.connector = p.line(i * p.sliderLength * 8 + p.pan.value(), p.y + p.h * .8, i * p.sliderLength * 8 + p.pan.value(), p.y + p.h / .8)
      p.pop()
    }
  }



  class Module {
    constructor(n, c, type) {
      this.n = n
      this.c = c
      this.type = type
      this.newX = p.sliderLength * 8 * p.mod8Num + p.pan.value()
      p.modNum = Math.floor(p.modulesNum() / this.n)
    }

    show() {
      p.fill(this.c)
      p.stroke(0)
      p.lastMod = p.rect(this.newX, p.y + p.h / 2, p.sliderLength * this.n, p.h)
      p.fill(0, 0, 0)
      p.noStroke()
      if (this.type == 56) {
        p.text(`1
56`, this.newX + 4, p.y + p.h - 10)
      } else {
        p.text(`1
  ${this.type}`, this.newX + 4, p.y + p.h - 10);
      }
    }
  }
}









// ================================================================================================================

var sketch2 = function(p) {
  // GLOBALS
  p.canvas
  p.unitsBar
  p.totalLength
  p.moduleLength = 280
  p.singleModule
  p.x = 0
  p.y = 230
  p.h = 55
  p.mod8Num
  p.restModule
  p.textBox
  p.shrink
  p.pan

  p.connectors
  p.suspensions
  p.clips

  p.mod21Num
  p.shortBruto
  p.shortNet

  p.max6m = 5880
  p.unitsAmount
  p.shortMod

  p.a
  p.b
  p.result



  //SETUP
  p.setup = function() {
    canvas = p.createCanvas(p.windowWidth, 350)
    canvas.parent('#sketch2')
    output = p.createP(' ')
    // infos
    textBox.attribute('placeholder', '15000')
    textBox.attribute('oninput', 'javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength)')
    textBox.attribute('type', 'number')
    textBox.attribute('step', '280')
    textBox.attribute('min', '0')
    textBox.attribute('maxlength', '5')
    textBox.attribute('id', 'focus')
    document.getElementById("focus").autofocus = true
    textBox.parent(topDiv)
    p.insert = p.createElement('strong', 'insert distance')
    p.insert.parent(topDiv)

    // shrink
    p.createElement('strong', 'shrink').parent('p6m')
    p.shrink = p.createSlider(22, 100, 22).parent('p6m')

    // pan
    p.pan = p.createSlider(-1500, 0, 0).parent('p6m')
    p.createElement('strong', 'pan').parent('p6m')
  }



  // WINDOW RESIZED
  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, 350)
  }

  // Find total number of single modules
  p.modulesNum = function() {
    p.unitNum = p.totalLength / p.moduleLength
    return p.int(p.unitNum)
  }

  // DRAW
  p.draw = function() {
    p.background(51)

    p.sliderLength = p.moduleLength / p.shrink.value()
    p.totalLength = textBox.value()

    //texts
    p.textSize(12)
    p.fill(222)
    p.noStroke()
    p.text(`Total length: ${p.totalLength} mm`, p.x, 20)
    p.profileLength = p.modulesNum() * 280
    p.text(`Profile length: ${p.profileLength} mm`, p.x, 40)

    p.text(`Profile length with end caps: ${p.profileLength + 10} mm`, p.x, 60)
    p.leftover = p.totalLength - p.profileLength
    p.text(`Leftover: ${p.leftover} mm`, p.x, 80)

    // p.connectors 6m - less cuts
    if (p.totalLength > p.max6m) {
      if (p.profileLength % p.max6m == 0) {
        p.connectors = Math.floor(p.profileLength / p.max6m) - 1
      } else {
        p.connectors = Math.floor(p.profileLength / p.max6m)
      }
    } else {
      p.connectors = 0
    }

    // Suspension 6m - less cuts
    if (p.modulesNum() >= 8) {
      if (p.profileLength % p.max6m == 0) {
        p.suspensions = p.mod21Num * 4
      } else if (p.profileLength % p.max6m >= 280 && p.profileLength % p.max6m <= 1960) {
        p.suspensions = p.mod21Num * 4 + 2
      } else if (p.profileLength % p.max6m > 1960 && p.profileLength % p.max6m < 4200) {
        p.suspensions = p.mod21Num * 4 + 3
      } else {
        p.suspensions = p.mod21Num * 4 + 4
      }
    } else {
      p.suspensions = 2
    }

    p.text(`180Corner: ${p.connectors}    •    suspensions: ${p.suspensions}`, p.x, p.y - p.h - 10)

    // p.connectors 6m - less price
    if (p.profileLength < 6160) {
      p.connectors2 = 0
    } else if (p.profileLength % 4480 == 0 || p.profileLength % 4480 == 280) {
      p.connectors2 = p.mod8Num / 2 - 1
    } else {
      p.connectors2 = Math.floor(p.mod8Num / 2)
    }

    // ClipsTR
    if (p.profileLength % 2240 == 0) {
      p.clipsTR = p.mod8Num * 4
    } else if (p.profileLength % 2240 == 280) {
      p.clipsTR = p.mod8Num * 4 + 1
    } else if (p.profileLength % 2240 >= 560 && p.profileLength % 2240 <= 1120) {
      p.clipsTR = p.mod8Num * 4 + 2
    } else if (p.profileLength % 2240 > 1120 && p.profileLength % 2240 < 1960) {
      p.clipsTR = p.mod8Num * 4 + 3
    } else if (p.profileLength % 2240 >= 1960) {
      p.clipsTR = p.mod8Num * 4 + 4
    }

    // Clips
    p.mod16Num = Math.floor(p.profileLength / (p.moduleLength * 16))
    if (p.profileLength > 5880) {
      if (p.profileLength % 4480 == 0 || p.profileLength % 4480 == 280) {
        p.clips = p.mod16Num * 4
      } else if (p.profileLength % 4480 > 280 && p.profileLength % 4480 < 2240) {
        p.clips = p.mod16Num * 4 + 2
      } else if (p.profileLength % 2240 == 1960) {
        p.clips = p.mod16Num * 4 + 4
      } else {
        p.clips = p.mod16Num * 4 + 3
      }
    } else {
      p.clips = 4
    }

    p.text(`180Corner: ${p.connectors2}    •    SRL TR clips: ${p.clipsTR}    •    SRL 85 / MIC 60 clips: ${p.clips}`, p.x, p.y + p.h * 1.8)

    // Long modules 6m - less cuts
    p.mod21Num = Math.floor(p.profileLength / p.max6m)
    p.shortBruto = (p.profileLength - p.max6m * p.mod21Num)
    p.unitsAmount = Math.floor(p.shortBruto / p.moduleLength)

    for (i = 0; i < p.mod21Num; i++) {
      p.textSize(1 * p.sliderLength)

      p.push()
      p.stroke(0)
      p.fill(71, 115, 137)
      p.modL = p.rect(i * (p.sliderLength * 21) + p.pan.value(), p.y - p.h, p.sliderLength * 8, p.h)
      p.pop()

      p.noStroke()
      p.fill(0, 0, 0)
      p.text(`${i+1}
	224`, i * (p.sliderLength * 21) + p.pan.value() + 4, p.y - p.h + 20);

      p.push()
      p.stroke(0)
      p.fill(71, 115, 137)
      p.modc = p.rect((i * (p.sliderLength * 21) + p.pan.value()) + (p.sliderLength * 8), p.y - p.h, p.sliderLength * 8, p.h)
      p.pop()

      p.text(`${i+1}
  224`, (i * (p.sliderLength * 21) + p.pan.value()) + (p.sliderLength * 8) + 4, p.y - p.h + 20)

      p.push()
      p.stroke(0)
      p.fill(123, 201, 212)
      p.modc = p.rect((i * (p.sliderLength * 21) + p.pan.value()) + (p.sliderLength * 16), p.y - p.h, p.sliderLength * 5, p.h)
      p.pop()

      p.text(`${i+1}
  140`, (i * (p.sliderLength * 21) + p.pan.value()) + (p.sliderLength * 16) + 4, p.y - p.h + 20)
    }

    // Rest modules 6m - less cuts
    p.stroke(0)
    p.xx = (p.sliderLength * 21 * p.mod21Num) + p.pan.value()
    switch (p.unitsAmount) {

      case 20:
        p.fill(71, 115, 137)
        p.shortMod = p.rect(p.xx, p.y - p.h, 8 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  224`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }

        p.stroke(0)
        p.fill(71, 115, 137)
        p.shortMod = p.rect(p.xx + 8 * p.sliderLength, p.y - p.h, 8 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  224`, p.xx + 8 * p.sliderLength + 4, p.y - p.h + 20)

        p.stroke(0)
        p.fill(162, 227, 193)
        p.shortMod = p.rect(p.xx + 16 * p.sliderLength, p.y - p.h, 4 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  112`, p.xx + 16 * p.sliderLength + 4, p.y - p.h + 20)
        break

      case 19:
        p.fill(71, 115, 137)
        p.shortMod = p.rect(p.xx, p.y - p.h, 8 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  224`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }

        p.stroke(0)
        p.fill(71, 115, 137)
        p.shortMod = p.rect(p.xx + 8 * p.sliderLength, p.y - p.h, 8 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  224`, p.xx + 8 * p.sliderLength + 4, p.y - p.h + 20)

        p.stroke(0)
        p.fill(211, 249, 175)
        p.shortMod = p.rect(p.xx + 16 * p.sliderLength, p.y - p.h, 3 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  84`, p.xx + 16 * p.sliderLength + 4, p.y - p.h + 20)
        break

      case 18:
        p.fill(71, 115, 137)
        p.shortMod = p.rect(p.xx, p.y - p.h, 8 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  224`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }

        p.stroke(0)
        p.fill(71, 115, 137)
        p.shortMod = p.rect(p.xx + 8 * p.sliderLength, p.y - p.h, 8 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  224`, p.xx + 8 * p.sliderLength + 4, p.y - p.h + 20)

        p.stroke(0)
        p.fill(237, 255, 171)
        p.shortMod = p.rect(p.xx + 16 * p.sliderLength, p.y - p.h, 2 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
56`, p.xx + 16 * p.sliderLength + 4, p.y - p.h + 20)
        break

      case 17:
        p.fill(71, 115, 137)
        p.shortMod = p.rect(p.xx, p.y - p.h, 8 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  224`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }

        p.stroke(0)
        p.fill(123, 201, 212)
        p.shortMod = p.rect(p.xx + 8 * p.sliderLength, p.y - p.h, 5 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  140`, p.xx + 8 * p.sliderLength + 4, p.y - p.h + 20)

        p.stroke(0)
        p.fill(162, 227, 193)
        p.shortMod = p.rect(p.xx + 13 * p.sliderLength, p.y - p.h, 4 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  112`, p.xx + 13 * p.sliderLength + 4, p.y - p.h + 20)

        break

      case 16:
        p.fill(71, 115, 137)
        p.shortMod = p.rect(p.xx, p.y - p.h, 8 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  224`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }

        p.stroke(0)
        p.fill(71, 115, 137)
        p.shortMod = p.rect(p.xx + 8 * p.sliderLength, p.y - p.h, 8 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  224`, p.xx + 8 * p.sliderLength + 4, p.y - p.h + 20)
        break

      case 15:
        p.fill(71, 115, 137)
        p.shortMod = p.rect(p.xx, p.y - p.h, 8 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  224`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }

        p.stroke(0)
        p.fill(162, 227, 193)
        p.shortMod = p.rect(p.xx + 8 * p.sliderLength, p.y - p.h, 4 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  112`, p.xx + 8 * p.sliderLength + 4, p.y - p.h + 20)

        p.stroke(0)
        p.fill(211, 249, 175)
        p.shortMod = p.rect(p.xx + 12 * p.sliderLength, p.y - p.h, 3 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  84`, p.xx + 12 * p.sliderLength + 4, p.y - p.h + 20)
        break

      case 14:
        p.fill(71, 115, 137)
        p.shortMod = p.rect(p.xx, p.y - p.h, 8 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  224`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }

        p.stroke(0)
        p.fill(106, 154, 178)
        p.shortMod = p.rect(p.xx + 8 * p.sliderLength, p.y - p.h, 6 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  168`, p.xx + 8 * p.sliderLength + 4, p.y - p.h + 20)
        break

      case 13:
        p.fill(71, 115, 137)
        p.shortMod = p.rect(p.xx, p.y - p.h, 8 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  224`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }

        p.stroke(0)
        p.fill(123, 201, 212)
        p.shortMod = p.rect(p.xx + 8 * p.sliderLength, p.y - p.h, 5 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  140`, p.xx + 8 * p.sliderLength + 4, p.y - p.h + 20)
        break

      case 12:
        p.fill(71, 115, 137)
        p.shortMod = p.rect(p.xx, p.y - p.h, 8 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  224`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }

        p.stroke(0)
        p.fill(162, 227, 193)
        p.shortMod = p.rect(p.xx + 8 * p.sliderLength, p.y - p.h, 4 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  112`, p.xx + 8 * p.sliderLength + 4, p.y - p.h + 20)
        break



      case 11:
        p.fill(71, 115, 137)
        p.shortMod = p.rect(p.xx, p.y - p.h, 8 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
	224`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }

        p.stroke(0)
        p.fill(211, 249, 175)
        p.shortMod = p.rect(p.xx + 8 * p.sliderLength, p.y - p.h, 3 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
	84`, p.xx + 8 * p.sliderLength + 4, p.y - p.h + 20)
        break

      case 10:
        p.fill(71, 115, 137)
        p.shortMod = p.rect(p.xx, p.y - p.h, 8 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  224`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }

        p.push()
        p.translate(8 * p.sliderLength, 0)
        p.stroke(0)
        p.fill(237, 255, 171)
        p.shortMod = p.rect(p.xx, p.y - p.h, 2 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
56`, p.xx + 4, p.y - p.h + 20)
        p.pop()
        break

      case 9:
        p.fill(106, 154, 178)
        p.shortMod = p.rect(p.xx, p.y - p.h, 6 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  168`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }

        p.stroke(0)
        p.fill(211, 249, 175)
        p.shortMod = p.rect(p.xx + 6 * p.sliderLength, p.y - p.h, 3 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  84`, p.xx + 6 * p.sliderLength + 4, p.y - p.h + 20)
        break

      case 8:
        p.fill(71, 115, 137)
        p.shortMod = p.rect(p.xx, p.y - p.h, 8 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  224`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }
        break

      case 7:
        p.fill(162, 227, 193)
        p.shortMod = p.rect(p.xx, p.y - p.h, 4 * p.sliderLength, p.h)

        p.push()
        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  112`, p.xx + 4, p.y - p.h + 20)
        p.pop()

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }

        p.fill(211, 249, 175)
        p.shortMod = p.rect(p.xx + 4 * p.sliderLength, p.y - p.h, 3 * p.sliderLength, p.h)

        p.push()
        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
	84`, p.xx + 4 * p.sliderLength + 4, p.y - p.h + 20)
        p.pop()
        break

      case 6:
        p.fill(106, 154, 178)
        p.shortMod = p.rect(p.xx, p.y - p.h, 6 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
	168`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }
        break

      case 5:
        p.fill(123, 201, 212)
        p.shortMod = p.rect(p.xx, p.y - p.h, 5 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
	140`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }
        break

      case 4:
        p.fill(162, 227, 193)
        p.shortMod = p.rect(p.xx, p.y - p.h, 4 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
	112`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }
        break

      case 3:
        p.fill(211, 249, 175)
        p.shortMod = p.rect(p.xx, p.y - p.h, 3 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
	84`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }
        break

      case 2:
        p.fill(237, 255, 171)
        p.shortMod = p.rect(p.xx, p.y - p.h, 2 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
56`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.push()
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }
        break

      case 1:
        p.push()
        p.stroke(0)
        p.fill(162, 227, 193)
        p.translate(-(p.sliderLength * 5), 0)
        p.shortMod = p.rect(p.xx, p.y - p.h, 4 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
  112`, p.xx + 4, p.y - p.h + 20)

        p.stroke(0)
        p.fill(211, 249, 175)
        p.translate(p.sliderLength * 4, 0)
        p.shortMod = p.rect(p.xx, p.y - p.h, 2 * p.sliderLength, p.h)

        p.noStroke()
        p.fill(0, 0, 0)
        p.text(`1
56`, p.xx + 4, p.y - p.h + 20)

        if (p.profileLength >= 2800 && p.connectors > 0) {
          p.strokeWeight(4)
          p.stroke(255, 255, 255)
          p.connector = p.line(p.xx, p.y - p.h * .666, p.xx, p.y - p.h / 3.5)
          p.pop()
        }
        break
    }

    // units
    p.noFill()
    p.stroke(0)
    p.unitsBar = p.rect(p.x + p.pan.value(), p.y, p.totalLength / p.shrink.value(), p.h / 2)

    // single modules
    p.fill(100)
    for (i = 0; i < p.modulesNum(); i++) {
      p.singleModule = p.rect(i * p.sliderLength + p.pan.value(), p.y, p.sliderLength, p.h / 2)
    }

    // Long modules 6m - less price
    p.mod8Num = Math.floor(p.modulesNum() / 8)
    for (i = 0; i < p.mod8Num; i++) {
      p.push()
      p.fill(71, 115, 137)
      p.stroke(0)
      mod8M = p.rect(i * p.sliderLength * 8 + p.pan.value(), p.y + p.h / 2, p.sliderLength * 8, p.h)
      p.pop()

      p.noStroke()
      p.fill(0)
      p.textSize(1 * p.sliderLength)
      p.text(`${i+ 1}
  224`, i * p.sliderLength * 8 + 4 + p.pan.value(), p.y + p.h - 10)
    }

    // Rest modules 6m - less price
    p.rest = p.modulesNum() - (p.mod8Num * 8)
    p.c

    switch (p.rest) {
      case 1:
        p.push()
        p.c = p.color('rgb(123,201,212)')
        p.translate(-(p.sliderLength * 8), 0)
        p.restModule = new Module(5, p.c, 140)
        p.restModule.show()
        p.c = p.color('rgb(162,227,193)')
        p.translate(p.sliderLength * 5, 0)
        p.restModule1 = new Module(4, p.c, 112)
        p.restModule1.show()
        p.pop()
        break;

      case 2:
        p.c = p.color('rgb(237,255,171)')
        p.restModule = new Module(2, p.c, 56)
        p.restModule.show()
        break;

      case 3:
        p.c = p.color('rgb(211,249,175)')
        p.restModule = new Module(3, p.c, 84)
        p.restModule.show()
        break;

      case 4:
        p.c = p.color('rgb(162,227,193)')
        p.restModule = new Module(4, p.c, 112)
        p.restModule.show()
        break;

      case 5:
        p.c = p.color('rgb(123,201,212)')
        p.restModule = new Module(5, p.c, 140)
        p.restModule.show()
        break;

      case 6:
        p.c = p.color('rgb(106,154,178)')
        p.restModule = new Module(6, p.c, 168)
        p.restModule.show()
        break;

      case 7:
        p.c = p.color('rgb(162,227,193)')
        p.restModule = new Module(4, p.c, 112)
        p.restModule.show()
        p.push()
        p.c = p.color('rgb(211,249,175)')
        p.restModule1 = new Module(3, p.c, 84)
        p.translate(p.sliderLength * 4, 0)
        p.restModule1.show()
        p.pop()
        break;
    }
    // p.connectors lines 6m - less cuts
    if (p.profileLength % p.max6m == 0) {
      for (i = 1; i <= p.connectors; i++) {
        p.push()
        p.strokeWeight(4)
        p.stroke(255, 255, 255)
        p.connector = p.line(i * p.sliderLength * 21 + p.pan.value(), p.y - p.h * .666, i * p.sliderLength * 21 + p.pan.value(), p.y - p.h / 3.5)
        p.pop()
      }
    } else {
      for (i = 1; i < p.connectors; i++) {
        p.push()
        p.strokeWeight(4)
        p.stroke(255, 255, 255)
        p.connector = p.line(i * p.sliderLength * 21 + p.pan.value(), p.y - p.h * .666, i * p.sliderLength * 21 + p.pan.value(), p.y - p.h / 3.5)
        p.pop()
      }
    }

    // p.connectors lines 6m - less price
    for (i = 1; i <= p.connectors2; i++) {

      p.push()
      p.strokeWeight(4)
      p.stroke(255, 255, 255)
      p.connector = p.line(i * p.sliderLength * 16 + p.pan.value(), p.y + p.h * .8, i * p.sliderLength * 16 + p.pan.value(), p.y + p.h / .8)
      p.pop()
    }


  }



  class Module {
    constructor(n, c, type) {
      this.n = n
      this.c = c
      this.type = type
      this.newX = p.sliderLength * 8 * p.mod8Num + p.pan.value()
      p.modNum = Math.floor(p.modulesNum() / this.n)
    }

    show() {
      p.fill(this.c)
      p.stroke(0)
      p.lastMod = p.rect(this.newX, p.y + p.h / 2, p.sliderLength * this.n, p.h)
      p.fill(0, 0, 0)
      p.noStroke()
      if (this.type == 56) {
        p.text(`1
56`, this.newX + 4, p.y + p.h - 10)
      } else {
        p.text(`1
	${this.type}`, this.newX + 4, p.y + p.h - 10);
      }
    }
  }
}

var myFirstSketch1 = new p5(sketch1);
var myFirstSketch2 = new p5(sketch2);
