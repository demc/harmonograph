class RotaryHarmonograph {
	
	constructor(scene, x, y, width, height, callback) {
		this.scene = scene;
		this.ctx = scene.ctx;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.dampingRatio = 0;

		this.callback = callback;

		this.path = new Path2D();

		scene.addObject(this);
	}	
	
	setDampingRatio(dampingRatio) {
		this.dampingRatio = dampingRatio;
		return this;
	}

	clear() {

	}

	reset() {
		this.path = new Path2D();
		this.ctx.clearRect(this.x, this.y, this.width, this.height);

	}

	tick() {
		const {x, y} = this.callback();
		this.path.lineTo(x, y);
	}

	draw() {
		this.ctx.save();
		this.ctx.strokeStyle = '#000';
		this.ctx.lineWidth = 0.1;
		this.ctx.stroke(this.path);
		this.ctx.restore();
	}
}

export default RotaryHarmonograph;
