class Label {

  constructor(scene, x, y, text, textSize, fontFamily) {
    this.scene = scene;
    this.ctx = scene.ctx;
    this.x = x;
    this.y = y;
    this.text = text;
    this.textAlign = 'center';
    this.textSize = textSize;
    this.font = textSize + 'px ' + fontFamily;
    this.fontFamily = fontFamily;

    scene.addObject(this);
  }

  clear() { }

  tick() { }

  reset() { }

  draw() {
    this.ctx.save();
    this.ctx.font = this.font;
    this.ctx.fillStyle = '#222';
    this.ctx.textAlign = this.textAlign;  
    this.ctx.fillText(this.text, this.x, this.y);
    this.ctx.restore();
  }
}

export default Label;
