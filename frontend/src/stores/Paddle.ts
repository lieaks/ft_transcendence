/**
 * Represents a paddle in the game.
 */
export class Paddle {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    color: string;

	/**
	 * Creates a new paddle object.
	 * @param x The coordinate of the paddle on the x-axis.
	 * @param y The coordinate of the paddle on the y-axis.
	 * @param width The width of the paddle.
	 * @param height The height of the paddle.
	 * @param speed The speed of the paddle.
	 * @param color The color of the paddle.
	 * @returns A new paddle object.
	 */
    constructor(x: number, y: number, width: number, height: number, speed: number, color: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;
    }

	/**
	 * Draws the paddle on the canvas.
	 * @param context The context of the canvas.
	 * @returns Nothing.
	 */
    draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }

	/**
	 * Updates the position of the paddle.
	 * @param key The key that was pressed.
	 * @param canvasHeight The height of the canvas.
	 * @returns Nothing.
	 */
    updatePosition(key: string, canvasHeight: number) {
        if (key === 'w' && this.y > 15) {
            this.y -= this.speed;
        } else if (key === 's' && this.y + this.height < canvasHeight - 15) {
            this.y += this.speed;
        }
    }
}