const canvas = document.getElementById("canvas");
canvas.width = 600;
canvas.height = 500;

let context = canvas.getContext("2d");
let start_background_color = "white"
context.fillStyle = start_background_color;
context.fillRect(0, 0 ,canvas.width,canvas.height);


let draw_color = "black";

let draw_width = "3";
let is_drawing = false;

let positionX = 0;
let positionY = 0;
//symbol
let is_symbol  = false;
let print_symbol = "";

//arrow
let is_arrow = false;
let fromX = 0;
let fromY = 0;
let toX = 0;
let toY = 0;
//history
let restore_array = [];
let index = -1;


function change_color(element){
    draw_color = element.style.background;
}
 
canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false); 

canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stopOut, false);


function start(event){
        is_drawing = true;

    if(is_arrow){
        drawArrow(context,positionX-50,positionY,positionX,positionY,10,draw_color)
    }
        
        context.beginPath();
        context.moveTo(event.clientX - canvas.offsetLeft,
            event.clientY - canvas.offsetTop )
    
    
    event.preventDefault();
}

function  draw(event){
     positionX = event.clientX - canvas.offsetLeft;
     positionY = event.clientY - canvas.offsetTop;
    
    if(is_drawing){
        if(!is_symbol && !is_arrow){
            context.lineTo(event.clientX - canvas.offsetLeft,
                event.clientY - canvas.offsetTop );
        }
        
        context.strokeStyle = draw_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
    }
    event.preventDefault();
}

function stop(event){
    if(is_symbol){
        context.font = `${Math.round(draw_width * 5)}px arial`
        context.fillStyle = draw_color;
        context.fillText(print_symbol, positionX,positionY);
    }
   
   
    if(is_drawing){
         context.stroke();
         context.closePath();
         is_drawing = false;
     }

     if(event.type != 'mouseout'){
         restore_array.push(context.getImageData(0,0 , canvas.width, canvas.height));
         index += 1;
     }
    event.preventDefault();
     console.log(restore_array);
}
function stopOut(event){
    
    if(is_drawing){
        context.stroke();
        context.closePath();
        is_drawing = false;
    }

    if(event.type != 'mouseout'){
        restore_array.push(context.getImageData(0,0 , canvas.width, canvas.height));
        index += 1;
    }
    event.preventDefault();
    console.log(restore_array);
}

function clear_canvas(){
    context.fillStyle = start_background_color;
    context.clearRect(0,0 , canvas.width, canvas.height);
    context.fillRect(0,0 , canvas.width, canvas.height);
    
    restore_array = []
    index = -1;
}
function undo_last(){
    if(index <= 0){
        clear_canvas();
    } else {
        index -= 1;
        restore_array.pop();
        context.putImageData(restore_array[index], 0, 0);
    }
}
function selectFile(input) {
    let img = new Image();
    let reader = new FileReader();
    let file = input.files[0];

    reader.onload = function(x){
        img.src = x.target.result;
    }

    img.onload = function(){
        let imgHeight = img.height;
        let imgWidth = img.width;
        let marginX = 0;
        let marginY = 0;
        if(imgHeight >= imgWidth){
            imgWidth = Math.round((img.width * canvas.height) / imgHeight);
            imgHeight = canvas.height;
            marginX = Math.round((canvas.width - imgWidth) / 2);
        }else {
            imgHeight = Math.round((img.height * canvas.width) / imgWidth);
            imgWidth = canvas.width;
            marginY = Math.round((canvas.height - imgHeight) / 2);
        }

        context.drawImage(img, marginX,marginY, imgWidth,imgHeight);
        debugger;
    }
    reader.readAsDataURL(file);
}
function print_mark(symbol){
     is_symbol = true;
     is_arrow = false;
     print_symbol = symbol.innerText;
     
}
function  on_pen(){
     is_symbol = false;
     is_arrow = false;
}
function on_arrow(){
    is_arrow = true;
    is_symbol = false;
}

function drawArrow(ctx, fromx, fromy, tox, toy, arrowWidth, color){
    var headlen = 10;
    var angle = Math.atan2(toy-fromy,tox-fromx);

    ctx.save();
    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineWidth = arrowWidth;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
        toy-headlen*Math.sin(angle-Math.PI/7));

    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
        toy-headlen*Math.sin(angle+Math.PI/7));

    ctx.lineTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
        toy-headlen*Math.sin(angle-Math.PI/7));

    //debugger;
    ctx.stroke();
    ctx.restore();
}
