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
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.beginPath()
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

  updateRightPaddlePosition(key: string) {
    this.rightPaddle.updateRightPaddlePosition(key, this.canvas.height)
  }

  updateLeftPaddlePosition(key: string) {
    this.leftPaddle.updateLeftPaddlePosition(key, this.canvas.height)
  }

  updateBallPosition(data: any) {
    this.ball.move(data, this.context)
  }
}
