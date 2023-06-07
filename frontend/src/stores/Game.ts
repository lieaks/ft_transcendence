import { Ball } from './Ball';
import { Paddle } from './Paddle';
import { Scoreboard } from './Scoreboard';

/**
 * Represents the game.
 */
const paddle = {
	width: 20,
	height: 175,
	speed: 17
}

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
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
        this.ball = new Ball(canvas.width / 2, canvas.height / 2, 10, 'white');
        this.leftPaddle = new Paddle(20,
			canvas.height / 2 - paddle.height / 2,
			paddle.width, paddle.height,
			paddle.speed,
			'red'
		);;
        this.rightPaddle = new Paddle(canvas.width - 20 - paddle.width,
			canvas.height / 2 - paddle.height / 2,
			paddle.width, paddle.height,
			paddle.speed,
			'blue'
		);;
		this.rightScore = new Scoreboard(0, canvas.width / 2 + 100 - 20, 75, 'white', "40px Arial");;
		this.leftScore = new Scoreboard(0, canvas.width / 2 - 100, 75, 'white', "40px Arial");;
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
}
