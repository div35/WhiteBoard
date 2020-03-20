let board = document.querySelector(".board");
var height = board.height = window.innerHeight - 58;
var width = board.width = window.innerWidth;
var ctx = board.getContext("2d");
var flag = 0;
var x_prev, y_prev;
var working = false;
var draw;
var active = "";
ctx.lineJoin = "round";
ctx.lineCap = "round";
const undostack = [];
const redostack = [];

var slider1 = document.getElementById("myRange1");
ctx.lineWidth = slider1.value; // Display the default slider value
edit_resume = slider1.value;
// Update the current slider value (each time you drag the slider handle)
slider1.oninput = function () {
    ctx.lineWidth = this.value;
    edit_resume = this.value;
}

var slider2 = document.getElementById("myRange2");
ctx.lineWidth = slider2.value; // Display the default slider value
eraser_resume = slider2.value;
// Update the current slider value (each time you drag the slider handle)
slider2.oninput = function () {
    ctx.lineWidth = this.value;
    eraser_resume = this.value;
}

document.querySelector(".dropdown-content").addEventListener("click", (e) => {
    // console.log(e.target.getAttribute("value"));
    ctx.strokeStyle = e.target.getAttribute("value");
    // document.querySelector(".fa-edit").classList.add("active");
    //     active = ".fa-edit";
})

document.querySelector(".fa-edit").addEventListener("click", () => {
    if (active != "" && active != ".fa-edit") {
        working = false;
        document.querySelector(active).classList.remove("active");
        ctx.strokeStyle = "black";
        active = "";
    }
    ctx.lineWidth = edit_resume;
    working = !working;
    color = 1; //for not white color
    if (working == true) {
        document.querySelector(".fa-edit").classList.add("active");
        active = ".fa-edit";
    }
    else {
        document.querySelector(".fa-edit").classList.remove("active");
        active = "";
    }
});

document.querySelector(".fa-eraser").addEventListener("click", () => {
    if (active != "" && active != ".fa-eraser") {
        working = false;
        document.querySelector(active).classList.remove("active");
        active = "";
    }
    ctx.lineWidth = eraser_resume;
    // ctx.globalCompositeOperation = destination-out;
    working = !working;
    color = 0; //for white color

    if (working == true) {
        document.querySelector(".fa-eraser").classList.add("active");
        active = ".fa-eraser";
    }
    else {
        document.querySelector(".fa-eraser").classList.remove("active");
        active = "";
        ctx.strokeStyle = "black";
    }
});

document.querySelector(".board").addEventListener("mousedown", () => {
    ctx.beginPath();
    let rect = board.getBoundingClientRect();
    x_prev = event.clientX - rect.left;
    y_prev = event.clientY - rect.top;
    x = x_prev;
    y = y_prev;
    flag = 1;
    const point = {
        x, y,
        effect: ctx.globalCompositeOperation,
        color: ctx.strokeStyle,
        width: ctx.lineWidth,
        type: "begin"
    }

    undostack.push(point);
})

document.querySelector(".board").addEventListener("mousemove", () => {
    if (flag == 1 && working == true) {
        if (color == 1) {
            // for another color
            ctx.globalCompositeOperation = "source-over";
        }
        else if (color == 0) {
            //white color
            // ctx.strokeStyle = "white";
            ctx.globalCompositeOperation = "destination-out";
        }
        let rect = board.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        ctx.moveTo(x_prev, y_prev);
        ctx.lineTo(x, y);
        x_prev = x;
        y_prev = y;
        ctx.stroke();
        const point = {
            x, y,
            effect: ctx.globalCompositeOperation,
            color: ctx.strokeStyle,
            width: ctx.lineWidth,
            type: "end"
        }

        undostack.push(point);
    }
})

document.querySelector(".board").addEventListener("mouseup", () => {
    flag = 0;
})

var sticky = document.getElementById("sticky");
var note = document.getElementById("note");
note.style.display = "block";
sticky.style.display = "none";

document.querySelector(".fa-sticky-note").addEventListener("click", () => {
    sticky.style.display = "block";
    note.style.display = "block";
    document.querySelector(".fa-sticky-note").classList.add("active");

})

document.querySelector(".closet").addEventListener("click", () => {
    sticky.style.display = "none";
    document.getElementById("note").value = "";
    document.querySelector(".fa-sticky-note").classList.remove("active");
})

document.querySelector(".mint").addEventListener("click", () => {
    if (note.style.display == "block")
        note.style.display = "none";
    else if (note.style.display == "none")
        note.style.display = "block";
})

document.querySelector(".fa-download").addEventListener("click", () => {
    var address = board.toDataURL();
    // console.log(address)
    var newWindow = window.open();
    newWindow.document.write('<img src="' + address + '" />');
})

var initialX = null;
var initialY = null;
let isdown = false;
document.querySelector("#sticky").addEventListener("mousedown", (event) => {
    // console.log(event.currentTarget);
    initialX = event.clientX;
    initialY = event.clientY;
    isdown = true;

})

document.querySelector("#sticky").addEventListener("mousemove", (event) => {
    if (!isdown) return;
    var sticky = event.currentTarget;
    let finalX = event.clientX;
    let finalY = event.clientY;
    let distX = finalX - initialX;
    let distY = finalY - initialY;
    // console.log(sticky.getBoundingClientRect())
    let { top, left } = sticky.getBoundingClientRect()
    sticky.style.top = top + distY + "px";
    sticky.style.left = left + distX + "px";
    initialX = finalX;
    initialY = finalY;
})

document.querySelector("#sticky").addEventListener("mouseup", (event) => {
    isdown = false;
})

const fileselector = document.getElementById("fileselector");
const fileinput = document.getElementById("fileinput");
fileselector.addEventListener("click", (event) => {
    event.preventDefault();
    fileinput.click();
})

fileinput.addEventListener("change", (event) => {
    const body = document.querySelector("body");
    // console.log(event.currentTarget.files[0]);
    const file = event.currentTarget.files[0];
    const img = document.createElement("img");
    img.classList.add("img");
    // console.log(window.URL.createObjectURL(file));
    img.src = window.URL.createObjectURL(file);
    img.height = 400;
    img.width = 400;
    body.appendChild(img);
})

const download = document.querySelector(".download");
download.addEventListener("click", function (event) {
    event.preventDefault();
    const body = document.querySelector("body");
    const anchor = document.createElement("a");
    anchor.href = board.toDataURL();
    anchor.download = "image.png";
    anchor.click();
    body.appendChild(anchor);
    body.removeChild(anchor);
});

let interval = null;
document.querySelector(".undo").addEventListener("mousedown", function () {
    // console.log(undostack)
    if (undostack.length > 0) {
        interval = setInterval(function () {
            if(undostack.length <= 0) return;
            redostack.push(undostack.pop());
            // console.log("redo"+redostack);
            // console.log(redostack[redostack.length-1]);
            redrawall();
        }, 100);
    }
    else
        return;
})

document.querySelector(".undo").addEventListener("mouseup", function () {
    clearInterval(interval);
    interval = null;
})

function redrawall() {
    if (undostack.length <= 0) return;
    ctx.clearRect(0, 0, board.width, board.height);
    for (let i = 0; i < undostack.length; i++) {
        if (!undostack[i]) return;
        let { x, y, effect, width, color, type } = undostack[i];
        if (type === "begin") {
            ctx.lineWidth = width;
            ctx.strokeStyle = color;
            ctx.globalCompositeOperation = effect;
            ctx.beginPath();
            ctx.moveTo(x, y);

        } else if (type === "end") {
            ctx.lineWidth = width;
            ctx.strokeStyle = color;
            ctx.globalCompositeOperation = effect;
            ctx.lineTo(x, y);
            ctx.stroke();

        }
    }
}

document.querySelector(".redo").addEventListener("mousedown", function () {
    // console.log(redostack);
    if (redostack.length > 0) {
        interval = setInterval(function () {
            if(redostack.length <= 0) return;
            undostack.push(redostack.pop());
            // console.log("undo"+undostack); 
            // console.log(undostack[undostack.length-1]);
            redrawall();
        }, 100);
    }
    else
        return;
});

document.querySelector(".redo").addEventListener("mouseup", function () {
    clearInterval(interval);
    interval = null;
});