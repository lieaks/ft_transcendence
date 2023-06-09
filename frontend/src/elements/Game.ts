import { Ball } from './Ball'
import { Paddle } from './Paddle'
import { Scoreboard } from './Scoreboard'

const paddle = {
  width: 20,
  height: 175,
  speed: 17
}

export class Game {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  ball: Ball
  rightPaddle: Paddle
  leftPaddle: Paddle
  rightScore: Scoreboard
  leftScore: Scoreboard
  bg_color: string

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')!
    this.ball = new Ball(canvas.width / 2, canvas.height / 2, 10, 'white')
    this.leftPaddle = new Paddle(
      20,
      canvas.height / 2 - paddle.height / 2,
      paddle.width,
      paddle.height,
      paddle.speed,
      'red'
    )
    this.rightPaddle = new Paddle(
      canvas.width - 20 - paddle.width,
      canvas.height / 2 - paddle.height / 2,
      paddle.width,
      paddle.height,
      paddle.speed,
      'blue'
    )
    this.rightScore = new Scoreboard(0, canvas.width / 2 + 100 - 20, 75, 'white', '40px Arial')
    this.leftScore = new Scoreboard(0, canvas.width / 2 - 100, 75, 'white', '40px Arial')
    this.bg_color = 'black'
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.beginPath()
    this.context.fillStyle = this.bg_color
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawNet()
    this.ball.draw(this.context)
    this.rightPaddle.draw(this.context)
    this.leftPaddle.draw(this.context)
    this.rightScore.draw(this.context)
    this.leftScore.draw(this.context)
    this.context.closePath()
  }

  drawNet() {
    this.context.setLineDash([15, 15])
    this.context.moveTo(this.canvas.width / 2, 0)
    this.context.lineTo(this.canvas.width / 2, this.canvas.height)
    this.context.strokeStyle = '#FFF'
    this.context.stroke()
  }

  updateScore(data: any) {
    this.rightScore.score = data.right
    this.leftScore.score = data.left
  }

  updateBallPosition(data: any) {
    this.ball.move(data)
  }

  updatePaddlePosition(data: any) {
    if (data.player === 'right') {
      this.rightPaddle.movePaddle(data.y)
    } else {
      this.leftPaddle.movePaddle(data.y)
    }
  }
}
