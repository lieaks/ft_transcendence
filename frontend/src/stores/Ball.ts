/**
 * Represents a ball in the game.
 */
export class Ball {
    x: number;
    y: number;
    radius: number;
    color: string;

	/**
	 * Creates a new ball object.
	 * @param x The coordinate of the ball on the x-axis.
	 * @param y The coordinate of the ball on the y-axis.
	 * @param radius The radius of the ball.
	 * @param color The color of the ball.
	 * @returns A new ball object.
	 */
    constructor(x: number, y: number, radius: number, color: string) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

	/**
	 * Draws the ball on the canvas.
	 * @param context The context of the canvas.
	 * @returns Nothing.
	 */
    draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }
}