import { Ball } from './Ball';
import { Paddle } from './Paddle';

/**
 * Represents the game.
 */
export class Game {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    ball: Ball;
    rightPaddle: Paddle;
    leftPaddle: Paddle;

	/**
	 * Creates a new game object.
	 * @param canvas The canvas element.
	 * @param ball The ball object.
	 * @param rightPaddle The right paddle object.
	 * @param leftPaddle The left paddle object.
	 * @returns A new game object.
	 */
    constructor(canvas: HTMLCanvasElement, ball: Ball, rightPaddle: Paddle, leftPaddle: Paddle) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
        this.ball = ball;
        this.rightPaddle = rightPaddle;
        this.leftPaddle = leftPaddle;
    }

	/**
	 * Draws the game on the canvas.
	 * @returns Nothing.
	 */
    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ball.draw(this.context);
        this.rightPaddle.draw(this.context);
        this.leftPaddle.draw(this.context);
    }

	/**
	 * Updates the position of the paddles.
	 * @param key The key that was pressed.
	 * @returns Nothing.
	 */
    updateRightPaddlePosition(key: string) {
        this.rightPaddle.updatePosition(key, this.canvas.height);
    }

    updateLeftPaddlePosition(key: string) {
        this.leftPaddle.updatePosition(key, this.canvas.height);
    }

	/**
	 * Updates the position of the ball.
	 * @returns Nothing.
	 */
    render() {
        this.draw();
        requestAnimationFrame(() => this.render());
    }
}