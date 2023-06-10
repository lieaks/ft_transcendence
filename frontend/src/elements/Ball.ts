import type { Paddle } from './Paddle'
import type { Scoreboard } from './Scoreboard'

/**
 * Represents a ball in the game.
 */
export class Ball {
  x: number
  y: number
  velocityX: number
  velocityY: number
  radius: number
  color: string

  /**
   * Creates a new ball object.
   * @param x The coordinate of the ball on the x-axis.
   * @param y The coordinate of the ball on the y-axis.
   * @param radius The radius of the ball.
   * @param color The color of the ball.
   * @returns A new ball object.
   */
  constructor(x: number, y: number, radius: number, color: string) {
    this.x = x
    this.y = y
    this.velocityX = 10
    this.velocityY = 10
    this.radius = radius
    this.color = color
  }

  /**
   * Draws the ball on the canvas.
   * @param context The context of the canvas.
   * @returns Nothing.
   */
  draw(context: CanvasRenderingContext2D) {
    context.beginPath()
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    context.fillStyle = this.color
    context.fill()
    context.closePath()
  }

  // function to move the ball, and check for collision
  move(
    context: CanvasRenderingContext2D,
    leftPaddle: Paddle,
    rightPaddle: Paddle,
    leftScore: Scoreboard,
    rightScore: Scoreboard
  ) {
    // move the ball
    this.x += this.velocityX
    this.y += this.velocityY

    // check if ball hits top or bottom wall
    if (this.y + this.radius > context.canvas.height || this.y - this.radius < 0) {
      this.velocityY = -this.velocityY
    }

    // check if ball hits left or right wall
    if (this.x + this.radius > context.canvas.width - 10) {
      leftScore.score++
      this.reset(context)
    } else if (this.x - this.radius < 10) {
      rightScore.score++
      this.reset(context)
    }
  }

  reset(context: CanvasRenderingContext2D) {
    this.x = context.canvas.width / 2
    this.y = context.canvas.height / 2
    this.velocityX = -this.velocityX
    this.velocityY = -this.velocityY
  }
}
