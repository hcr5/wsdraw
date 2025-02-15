const canvas = document.getElementById("board")
const ctx = canvas.getContext("2d")
const socket = new WebSocket("wss://clouddata.turbowarp.org/")

socket.addEventListener("open", function () {
    socket.send(JSON.stringify({"method":"handshake","user":"player","project_id":"1133733472"}))
})

ctx.strokeStyle = "black"
ctx.lineWidth = 3
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let drawing = false

canvas.addEventListener("mousedown", function() {drawing = true})
canvas.addEventListener("mouseup", function() {drawing = false})
canvas.addEventListener("mousemove", draw)

function draw(event) {
    if (!drawing) return

    ctx.lineTo(event.offsetX, event.offsetY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(event.offsetX, event.offsetY)


    socket.send(JSON.stringify({method: "set", user: "player", project_id: "1133733472", name: "☁ pos", value:`${event.clientX}.${event.clientY}`}))
}

socket.addEventListener("message", function(event){
    const x = JSON.parse(event.data).value.split(".")[0]
    const y = JSON.parse(event.data).value.split(".")[1]

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
})
