class ColorPatch {
    constructor(x, y, hexValue) {
        this.x = x;
        this.y = y;
        this.hexValue = hexValue;
        this.size = 40;
    }

    isClicked(x, y) {
        return x >= this.x 
            && y >= this.y 
            && x <= this.x + this.size 
            && y <= this.y + this.size 
    }

    draw() {
        fill(this.hexValue);
        square(this.x, this.y, this.size);
    }

    getHexValue() {
        return this.hexValue
    }
}