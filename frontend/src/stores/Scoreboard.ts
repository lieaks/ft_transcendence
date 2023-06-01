/**
 * Represents a scoreboard in the game.
 */
export class Scoreboard {
	score: number;
	x: number;
	y: number;
	color: string;
	font: string;

	/**
	 * Creates a new scoreboard object.
	 * @param score The score of the scoreboard.
	 * @param x The coordinate of the scoreboard on the x-axis.
	 * @param y The coordinate of the scoreboard on the y-axis.
	 * @param color The color of the scoreboard.
	 * @param font The font of the scoreboard.
	 * @returns A new scoreboard object.
	 */
	constructor(score: number, x: number, y: number, color: string, font: string) {
		this.score = score;
		this.x = x;
		this.y = y;
		this.color = color;
		this.font = font;
	}

	/**
	 * Draws the scoreboard on the canvas.
	 * @param context The context of the canvas.
	 * @returns Nothing.
	 */
	draw(context: CanvasRenderingContext2D) {
		context.font = this.font;
		context.fillStyle = this.color;
		context.fillText(this.score.toString(), this.x, this.y);
	}
}
