const canvas = document.getElementById("board")
const ctx = canvas.getContext("2d")
const socket = new WebSocket("wss://clouddata.turbowarp.org/")

socket.addEventListener("open", () => { socket.send(JSON.stringify({method:"handshake",user:"player",project_id:"1133733472"})) })

canvas.width = window.innerWidth
canvas.height = window.innerHeight
ctx.lineWidth = 5
ctx.strokeStyle = "red"
ctx.lineCap = 'round'

let drawing = false
let last = null

canvas.addEventListener("mousedown", e => {
  drawing = true
  ctx.beginPath()
  ctx.moveTo(e.offsetX, e.offsetY)
  socket.send(JSON.stringify({method:"set",user:"player",project_id:"1133733472",name:"☁ pos",value:`${e.offsetX}.${e.offsetY}`}))
})

canvas.addEventListener("mouseup", () => {
  drawing = false
  last = null
  socket.send(JSON.stringify({method:"set",user:"player",project_id:"1133733472",name:"☁ pos",value:"-1"}))
})

canvas.addEventListener("mousemove", e => {
  if (drawing) {
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke()
    socket.send(JSON.stringify({method:"set",user:"player",project_id:"1133733472",name:"☁ pos",value:`${e.offsetX}.${e.offsetY}`}))
  }
})

socket.addEventListener("message", e => {
  const d = JSON.parse(e.data)
  const value = d.value
  if (value === "-1") {
    last = null
    return
  }
  const [x, y] = value.split(".").map(Number)
  if (!last) {
    last = { x, y }
    return
  }
  ctx.beginPath()
  ctx.moveTo(last.x, last.y)
  ctx.lineTo(x, y)
  ctx.stroke()
  last = { x, y }
})
