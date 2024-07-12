//---------------------------------------------------------------------------
// semua yang berkaitan dengan Documentation Object Model disini
//---------------------------------------------------------------------------
const right = document.getElementsByClassName('r')[0];
const left = document.getElementsByClassName('l')[0];
const up = document.getElementsByClassName('u')[0];
const down = document.getElementsByClassName('d')[0];
const upright = document.getElementsByClassName('ur')[0];
const upleft = document.getElementsByClassName('ul')[0];
const downright = document.getElementsByClassName('dr')[0];
const downleft = document.getElementsByClassName('dl')[0];
const triangle = document.getElementById('triangle');
const circle = document.getElementById('circle');
const square = document.getElementById('square'); 
const rotateRange = document.querySelector('#rotate-range')
const scaleRange = document.querySelector('#scale-range')
const rotateRight = document.getElementsByClassName('rr')[0]
const rotateLeft = document.getElementsByClassName('rl')[0]
const shapeColor = document.getElementById('shape-color')
const scaleUp = document.getElementsByClassName('su')[0]
const eraser = document.getElementById('eraser')
const scaleDown = document.getElementsByClassName('sd')[0]
const fill = document.getElementById('fill')
const resetCanvas = document.getElementsByClassName('reset-canvas')[0]
const brush = document.getElementById('brush');
const canvas = document.querySelector("canvas");



//---------------------------------------------------------------------------
// Deklarasi
//---------------------------------------------------------------------------
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const ctx = canvas.getContext("2d");
let clickedshapeid; 
let shapes = [];
let trans = 10;
let paintbrush = false;
let bentuk = "" 
let startX, startY, endX, endY;
let rectangles = [] //menyimpan semua objek rectangle
let circles = [] //menyimpan semua objek circles
let triangles = [] //menyimpan semua objek trinagle
let lines = [];
let editedshape = []
let isPainting = false;
ctx.lineWidth = 3;
ctx.lineCap = "round";
ctx.strokeStyle = shapeColor.value || "black";


//---------------------------------------------------------------------------
// Semua class ada di sini 
//---------------------------------------------------------------------------

class Rectangle {
  constructor(xpos, ypos, width, height, color, id) {
    this.ctx = canvas.getContext("2d");
    this.id = id;
    this.position_x = xpos;
    this.position_y = ypos;
    this.width = width;
    this.height = height;
    this.dx = 1 * 12;
    this.dy = 1 * 12;
    this.color = color;
    this.scaleX = 1;
    this.scaleY = 1;
    this.isFill = fill.checked;
    this.rotationAngle = Math.PI / 3;
    rectangles.push(this);
  }

  draw() {
    console.log("triangle")
    this.ctx.beginPath();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = this.color;
    this.ctx.rect(this.position_x, this.position_y, this.width, this.height);
    this.ctx.stroke();
    // Lakukan iterasi pada array persegi panjang dan gambar ulang setiap persegi panjang
    rectangles.forEach(rectangle => {
      rectangle.ctx.beginPath();
      rectangle.ctx.strokeStyle = rectangle.color;
      if(rectangle.isFill){
        rectangle.ctx.fillStyle = rectangle.color;
        rectangle.ctx.fillRect(rectangle.position_x, rectangle.position_y, rectangle.width, rectangle.height);
      }
    
      rectangle.ctx.rect(rectangle.position_x, rectangle.position_y, rectangle.width, rectangle.height);
      rectangle.ctx.stroke();
    });
    canvas.addEventListener("mousedown", (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      this.ctx.beginPath();
      this.ctx.rect(this.position_x, this.position_y, this.width, this.height);
      

      if (this.ctx.isPointInPath(mouseX, mouseY)) {
        clickedshapeid = this.id;
        console.log("Clicked on rectangle with ID:", this.id);
        console.log("Is this Filled?", this.isFill)
      }
    });


  }

  drawRectangle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rectangles.forEach(rectangle => {
      // Melakukan scaling pada konteks 2D
     
      this.ctx.scale(this.scaleX, this.scaleY);
      
      // Menggambar persegi panjang
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.position_x, this.position_y, this.width, this.height);
      rectangle.ctx.beginPath();
      rectangle.ctx.strokeStyle = rectangle.color;
      if(rectangle.isFill){
        rectangle.ctx.fillStyle = rectangle.color;
        rectangle.ctx.fillRect(rectangle.position_x, rectangle.position_y, rectangle.width, rectangle.height);
      }
    
      rectangle.ctx.rect(rectangle.position_x, rectangle.position_y, rectangle.width, rectangle.height);
      rectangle.ctx.stroke();
    });
  }
    // Metode untuk mengubah skala persegi panjang
    scaleIt(newScaleX, newScaleY) {
      this.scaleX = newScaleX;
      this.scaleY = newScaleY;
      this.drawRectangle();
    }

    setRotate(rt){
      console.log(`rt rect : ${rt}`);
      this.rotationAngle = rt;
      console.log(`rotation angle : ${this.rotationAngle}`);
      this.drawRotate();
    }

    drawRotate(){
      this.ctx.clearRect(0, 0, canvas.width, canvas.height); // Menghapus konten sebelum menggambar objek yang diputar
      this.ctx.save(); // Menyimpan konfigurasi konteks saat ini

      this.ctx.translate(this.position_x + this.width / 2, this.position_y + this.height / 2); // Mengatur titik rotasi di tengah objek
      this.ctx.rotate(this.rotationAngle); // Memutar objek sesuai dengan sudut rotasi
      if(this.isFill){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height); // Menggambar objek yang diputar dengan pusat rotasi di (0, 0)
      }else{
        this.ctx.strokeStyle = this.color;
        this.ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
      }
      this.ctx.restore(); 
      rectangles.forEach(rectangle => {
        if(rectangle.id != clickedshapeid){
          rectangle.ctx.beginPath();
          rectangle.ctx.strokeStyle = rectangle.color;
          if(rectangle.isFill){
            rectangle.ctx.fillStyle = rectangle.color;
            rectangle.ctx.fillRect(rectangle.position_x, rectangle.position_y, rectangle.width, rectangle.height);
          }
          
          rectangle.ctx.rect(rectangle.position_x, rectangle.position_y, rectangle.width, rectangle.height);
          rectangle.ctx.stroke();
        }
        });
    }

  update(valuex, valuey) {
    this.position_x += valuex;
    this.position_y += valuey;
  }
}

class Triangle {
  constructor(x1, y1, x2, y2, x3, y3, color, id) {
    this.ctx = canvas.getContext("2d");
    this.id = id;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
    this.scaleX = 1;
    this.scaleY = 1;
    this.color = color;
    this.isFill = fill.checked;
    this.rotationAngle = Math.PI;
    triangles.push(this)
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = this.color;
    this.ctx.moveTo(this.x1, this.y1);
    this.ctx.lineTo(this.x2, this.y2);
    this.ctx.lineTo(this.x3, this.y3);
    this.ctx.closePath();
    this.ctx.stroke();

    triangles.forEach(triangle => {
      triangle.ctx.beginPath();
      triangle.ctx.strokeStyle = triangle.color;
      console.log(triangle.color);
      if(triangle.isFill){
        triangle.ctx.fillStyle = triangle.color;
        triangle.ctx.moveTo(triangle.x1, triangle.y1);
        triangle.ctx.lineTo(triangle.x2, triangle.y2);
        triangle.ctx.lineTo(triangle.x3, triangle.y3);
        triangle.ctx.closePath();
        triangle.ctx.fill();
      }
      
      triangle.ctx.moveTo(triangle.x1, triangle.y1);
      triangle.ctx.lineTo(triangle.x2, triangle.y2);
      triangle.ctx.lineTo(triangle.x3, triangle.y3);
      triangle.ctx.closePath();
      triangle.ctx.stroke();
    });

    canvas.addEventListener("mousedown", (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      this.ctx.beginPath();
      this.ctx.moveTo(this.x1, this.y1);
      this.ctx.lineTo(this.x2, this.y2);
      this.ctx.lineTo(this.x3, this.y3);
      this.ctx.closePath();

      if (this.ctx.isPointInPath(mouseX, mouseY)) {
        clickedshapeid = this.id;
        console.log("Clicked on triangle with ID:", this.id);
      }
    });
  }

  drawTriangle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    triangles.forEach(triangle => {
      triangle.ctx.scale(this.scaleX, this.scaleY);
      this.ctx.fillStyle = this.color;

      this.ctx.beginPath();
      this.ctx.moveTo(this.x1, this.y1);
      this.ctx.lineTo(this.x2, this.y2);
      this.ctx.lineTo(this.x3, this.y3);
      this.ctx.closePath();
  
      if (triangle.isFill) {
        triangle.ctx.fillStyle = triangle.color;
        triangle.ctx.moveTo(triangle.x1, triangle.y1);
        triangle.ctx.lineTo(triangle.x2, triangle.y2);
        triangle.ctx.lineTo(triangle.x3, triangle.y3);
        triangle.ctx.closePath();
        triangle.ctx.fill();
      } 

      triangle.ctx.moveTo(triangle.x1, triangle.y1);
      triangle.ctx.lineTo(triangle.x2, triangle.y2);
      triangle.ctx.lineTo(triangle.x3, triangle.y3);
      triangle.ctx.closePath();
      triangle.ctx.stroke();
    });
  }
  

  scaleIt(newScaleX, newScaleY) {
    this.scaleX = newScaleX;
    this.scaleY = newScaleY;
    this.drawTriangle();
  }

  drawRotate() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.save();
  
    const centerX = (this.x1 + this.x2 + this.x3) / 3;
    const centerY = (this.y1 + this.y2 + this.y3) / 3;
  
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(this.rotationAngle);
  
    this.ctx.beginPath();
    this.ctx.lineWidth = 3;
    this.ctx.moveTo(this.x1 - centerX, -this.y1 + centerY);
    this.ctx.lineTo(this.x2 - centerX, -this.y2 + centerY);
    this.ctx.lineTo(this.x3 - centerX, -this.y3 + centerY);
    this.ctx.closePath();
    this.ctx.stroke();
  
    this.ctx.restore();
  }
  

  setRotate(rotationAngle) {
    this.rotationAngle = rotationAngle;
    this.drawRotate();
  }

  update(valueX, valueY) {
    this.x1 += valueX;
    this.y1 += valueY;
    this.x2 += valueX;
    this.y2 += valueY;
    this.x3 += valueX;
    this.y3 += valueY;
  }
}

class Circle {
  constructor(xpos, ypos, radius, color, id) {
    this.ctx = canvas.getContext("2d");
    this.id = id;
    this.position_x = xpos;
    this.position_y = ypos;
    this.radius = radius;
    this.dx = 1 * 12;
    this.dy = 1 * 12;
    this.color = color;
    this.scaleX = 1;
    this.scaleY = 1;
    this.isFill = fill.checked;
    circles.push(this);
  }
// prevmouse = 1
// xpos = 1
  draw() {
    this.ctx.beginPath();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = this.color;
    this.ctx.arc(this.position_x, this.position_y, this.radius, 0, 2 * Math.PI);
    this.ctx.stroke();

    circles.forEach(circle => {
      circle.ctx.beginPath();
      circle.ctx.strokeStyle = circle.color;
      if(circle.isFill){  
        circle.ctx.fillStyle = circle.color;
        circle.ctx.arc(circle.position_x, circle.position_y, circle.radius, 0, 2 * Math.PI);
        circle.ctx.fill();
      }
    
      circle.ctx.arc(circle.position_x, circle.position_y, circle.radius, 0, 2 * Math.PI);
      circle.ctx.stroke();
    });

    canvas.addEventListener("mousedown", (event) => {
      const circ = canvas.getBoundingClientRect();
      const mouseX = event.offsetX
      const mouseY = event.offsetY
      
      ctx.beginPath();
      ctx.arc(this.position_x, this.position_y, this.radius, 0, Math.PI * 2);
      
      if (ctx.isPointInPath(mouseX, mouseY)) {
        clickedshapeid = this.id;
        console.log("Clicked on circle with ID:", this.id);
      }
    });
  }

  drawCircle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => {
      this.ctx.scale(this.scaleX, this.scaleY);
      this.ctx.strokeStyle = this.color;
      this.ctx.fillStyle = this.color;
      
      this.ctx.beginPath();
      this.ctx.arc(this.position_x, this.position_y, this.radius, 0, 2 * Math.PI);
      this.ctx.stroke();

      if(circle.isFill){
        circle.ctx.fillStyle = circle.color;
        circle.ctx.arc(circle.position_x, circle.position_y, circle.radius, 0, 2 * Math.PI);
        circle.ctx.fill();
      }
    
      circle.ctx.arc(circle.position_x, circle.position_y, circle.radius, 0, 2 * Math.PI);
      circle.ctx.stroke();
    });
    
  }

  // Metode untuk mengubah lingkaran
  scaleIt(newScaleX, newScaleY) {
    this.scaleX = newScaleX;
    this.scaleY = newScaleY;
    this.drawCircle();
  }

  drawRotate() {}

  setRotate(rotationAngle) {
    this.rotationAngle = rotationAngle;
    this.drawRotate();
  }

  update(valuex, valuey) {
    this.position_x += valuex;
    this.position_y += valuey;
  }
}

//---------------------------------------------------------------------------
// Semua Fungsi ada di sini
//---------------------------------------------------------------------------

// Fungsi untuk brush ----------------------------------

class Brush {
  constructor(xpos, ypos, color, id) {
    this.ctx = canvas.getContext("2d");
    this.id = id;
    this.xpos = xpos;
    this.ypos = ypos;
    this.color = color;
    lines.push(this);
    this.startx = 0
    this.starty = 0
    this.finishx = 0
    this.finishy = 0
    this.loopline = []
  }

  inputlineloop(data){
    this.loopline = data
  }

  draw(){
    console.log("brush")
    this.startPainting(this.startx, this.starty);
    this.drawBrush();
    this.stopPainting();
  }

  startPainting(x,y) {
    isPainting = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
  
  stopPainting() {
    isPainting = false;
    ctx.closePath();
  }
  
  drawBrush() {
    if (!isPainting) return;
    this.loopline.forEach(data=>{
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
    })
  }

  update(valuex, valuey) {
    this.xpos += valuex;
    this.ypos += valuey;
  }
}
//------------------------------------------------------

//fungsi tambahan untuk draw shape
function drawShapes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes.forEach(shape => {
    shape.draw();
    shape.update(0,0);
  });
}

//fungsi buat reset canvas
function resetFun(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes = []
  rectangles = []
}

function startPainting(event) {
  isPainting = true;
  let x = event.offsetX;
  let y = event.offsetY;
  ctx.beginPath();
  ctx.moveTo(x, y);
  console.log("start",event.offsetX, event.offsetY)
}

function stopPainting(event) {
  isPainting = false;
  ctx.closePath();
  console.log("sfinish",event.offsetX, event.offsetY)
}

function draw(event) {
  if (!isPainting) return;
  
  const { offsetX, offsetY } = event;
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();
  
}

//---------------------------------------------------------------------------
// Shape Event Handlers
//---------------------------------------------------------------------------
circle.addEventListener('click', function(){
  bentuk = "circle"
  paintbrush = false
})

square.addEventListener('click', function(){
  bentuk = "rectangle"
  paintbrush = false
})

triangle.addEventListener('click', function(){
  bentuk = "triangle"
  paintbrush = false
})

brush.addEventListener('click', function(){
  paintbrush = !paintbrush
  if(paintbrush == true){
    brush.color = "blue"
  }else{
    brush.color = "black"
  }
})

eraser.addEventListener('click', function(){
  paintbrush = !paintbrush
  if(paintbrush == true){
    brush.color = "white";
    console.log(brush.color)
  }else{
    brush.color = "black"
  }
})


//---------------------------------------------------------------------------
// Canvas Event Handlers
//---------------------------------------------------------------------------

canvas.addEventListener("mousedown", function(event) {
  let alllines = []
  if(paintbrush == true){
    const line = new Brush(event.offsetX, event.offsetY, shapeColor.value, shapes.length + 1)
    canvas.addEventListener('click',  startPainting(event))
    console.log("start",event.offsetX, event.offsetY)
    line.startx = event.offsetX
    line.starty = event.offsetY
    function drawmove(event){
      draw(event)
      alllines.push({x:event.offsetX, y:event.offsetY})
    }

    canvas.addEventListener("mousemove", drawmove);
    canvas.addEventListener("mouseup", function(event){
      stopPainting(event)
      line.loopline =  alllines;
      canvas.removeEventListener("mousemove", drawmove);
    });
    shapes.push(line);
    console.log(shapes)
  }else{
    const x1 = event.offsetX;
    const y1 = event.offsetY;

    function mouseUpHandler(event) {
      const x2 = event.offsetX;
      const y2 = event.offsetY;
      const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      if(x2-x1 < 3){
        return;
      }else{
        if(bentuk == "rectangle"){
          const cer = new Rectangle(x1,y1, (x2-x1), (y2-y1), shapeColor.value, shapes.length + 1)
          // const cer = new Triangle()
          shapes.push(cer);
          drawShapes();
        }else if(bentuk == "circle"){
          const cer = new Circle(x1, y1, radius, shapeColor.value, shapes.length + 1)
          // const cer = new Triangle()
          shapes.push(cer);
          drawShapes();
        }else if(bentuk == "triangle"){
          let triangle = new Triangle(x1, y1, x2, y2, (x1 * 2 - x2), y2, shapeColor.value, shapes.length + 1);
          shapes.push(triangle);
          drawShapes();
        }else{
          return;
        }
      }
      canvas.removeEventListener("mouseup", mouseUpHandler);
    }
    canvas.addEventListener("mouseup", mouseUpHandler);
  }

});


//---------------------------------------------------------------------------
// Translations Event Handlers
//---------------------------------------------------------------------------

right.addEventListener("click", function(){
  let obj = shapes.filter((data) => data.id == clickedshapeid)
    obj[0]?.update(trans,0)
    drawShapes()
})

left.addEventListener("click", function(){
  let obj = shapes.filter((data) => data.id == clickedshapeid)
  obj[0]?.update(-trans,0)
  drawShapes()
})

up.addEventListener("click", function(){
  let obj = shapes.filter((data) => data.id == clickedshapeid)
  obj[0]?.update(0,-trans)
  drawShapes()
})

down.addEventListener("click", function(){
  let obj = shapes.filter((data) => data.id == clickedshapeid)
  obj[0]?.update(0,trans)
  drawShapes()
})

upright.addEventListener("click", function(){
  let obj = shapes.filter((data) => data.id == clickedshapeid)
  obj[0]?.update(trans, -trans)
  drawShapes()
})

upleft.addEventListener("click", function(){
  let obj = shapes.filter((data) => data.id == clickedshapeid)
  obj[0]?.update(-trans,-trans)
  drawShapes()
})

downleft.addEventListener("click", function(){
  let obj = shapes.filter((data) => data.id == clickedshapeid)
  obj[0]?.update(-trans,trans)
  drawShapes()
})

downright.addEventListener("click", function(){
  let obj = shapes.filter((data) => data.id == clickedshapeid)
  obj[0]?.update(trans,trans)
  drawShapes()
})


//---------------------------------------------------------------------------
// Rotate Event Handlers
//---------------------------------------------------------------------------

rotateLeft.addEventListener('click', function(){
  let obj = shapes.filter((data) => data.id == clickedshapeid);
  console.log((rotateRange.value * 2 * Math.PI) / 360);
  obj[0]?.setRotate((rotateRange.value * 2 * Math.PI) / 360);
})

rotateRight.addEventListener('click', function(){
  let obj = shapes.filter((data) => data.id == clickedshapeid);
  console.log(rotateRange.value);
  console.log(2*Math.PI / (rotateRange.value / 15));
  obj[0]?.setRotate((-(rotateRange.value) * 2 * Math.PI) / 360);
})

//---------------------------------------------------------------------------
// Scale Up and Down Event Handlers
//---------------------------------------------------------------------------
scaleUp.addEventListener('click', function() {
  let obj = shapes.filter((data) => data.id == clickedshapeid);
  if (obj.length > 0) {
    obj[0]?.scaleIt(scaleRange.value, scaleRange.value);
    obj[0]?.update(0, 0);
  }
});

scaleDown.addEventListener('click', function() {
  let obj = shapes.filter((data) => data.id == clickedshapeid);
  if (obj.length > 0) {
    obj[0]?.scaleIt(scaleRange.value * -1, scaleRange.value * -1);
    obj[0]?.update(0, 0);
  }
});


