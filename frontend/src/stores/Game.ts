import { Ball } from './Ball';
import { Paddle } from './Paddle';
import type { Scoreboard } from './Scoreboard';

/**
 * Represents the game.
 */
export class Game {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    ball: Ball;
    rightPaddle: Paddle;
    leftPaddle: Paddle;
	rightScore: Scoreboard;
	leftScore: Scoreboard;

	/**
	 * Creates a new game object.
	 * @param canvas The canvas element.
	 * @param ball The ball object.
	 * @param rightPaddle The right paddle object.
	 * @param leftPaddle The left paddle object.
	 * @returns A new game object.
	 */
    constructor(canvas: HTMLCanvasElement, ball: Ball, rightPaddle: Paddle, leftPaddle: Paddle, rightScore: Scoreboard, leftScore: Scoreboard) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
        this.ball = ball;
        this.rightPaddle = rightPaddle;
        this.leftPaddle = leftPaddle;
		this.rightScore = rightScore;
		this.leftScore = leftScore;
    }

	/**
	 * Draws the game on the canvas.
	 * @returns Nothing.
	 */
    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawNet();
        this.ball.draw(this.context);
        this.rightPaddle.draw(this.context);
        this.leftPaddle.draw(this.context);
		this.rightScore.draw(this.context);
		this.leftScore.draw(this.context);
    }

	// Draw the line in the middle of the canvas 
	/**
	 * Draws the net on the canvas.
	 */
	drawNet() {
		this.context.beginPath();
		this.context.setLineDash([15, 15]);
		this.context.moveTo(this.canvas.width / 2, 0);
		this.context.lineTo(this.canvas.width / 2, this.canvas.height);
		this.context.strokeStyle = '#FFF';
		this.context.stroke();
	}

	/**
	 * Updates the position of the paddles.
	 * @param key The key that was pressed.
	 * @returns Nothing.
	 */
    updateRightPaddlePosition(key: string) {
        this.rightPaddle.updateRightPaddlePosition(key, this.canvas.height);
    }

    updateLeftPaddlePosition(key: string) {
        this.leftPaddle.updateLeftPaddlePosition(key, this.canvas.height);
    }

	updateBallPosition() {
		this.ball.move(this.context, this.rightPaddle, this.leftPaddle, this.rightScore, this.leftScore);
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