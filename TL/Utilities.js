import { Microsoft } from "../TL/ModImports.js";

export class Utility {
	static Vector2(x, y) {
		return Microsoft.Xna.Framework.Vector2.new()["void .ctor(float x, float y)"](x, y);
	}

	static Vector3(x, y, z) {
		return Microsoft.Xna.Framework.Vector3.new()["void .ctor(float x, float y, float z)"](x, y, z);
	}

	static Vector4(x, y, z, w) {
		return Microsoft.Xna.Framework.Vector4.new()["void .ctor(float x, float y, float z, float w)"](x, y, z, w);
	}

	static Rectangle(x, y, width, height) {
		return Microsoft.Xna.Framework.Rectangle.new()["void .ctor(int x, int y, int width, int height)"](x, y, width, height);
	}

	static Point(x, y) {
		return Microsoft.Xna.Framework.Point.new()["void .ctor(int x, int y)"](x, y);
	}

	static Color(isFloat, r, g, b, a) {
		const color = Microsoft.Xna.Framework.Graphics.Color.new();

		if (isFloat) {
			return color["void .ctor(float r, float g, float b, float a)"](r, g, b, a);
		} else {
			return color["void .ctor(int r, int g, int b, int a)"](r, g, b, a);
		}
	}

    static getMagnitude10(num) {
    	const numDecimal = (num.toString().split('.')[1] || '').length;
    	return Math.pow(10, numDecimal + 1);
	}

	static randNum() {
    	if (arguments.length === 2) {
    	    return Math.floor(Math.random() * (arguments[1] - arguments[0] + 1)) + arguments[0];
    	} else if (arguments.length === 1) {
    	    return Math.floor(Math.random() * (arguments[0] + 1));
    	} else {
    	    return Math.floor(Math.random() * (Math.pow(2, 31) - 1) * (Math.random() < 0.5 ? 1 : -1));
    	}
	}

	static randFloat() {
    	if (arguments.length === 2) {
        	const mag0 = Utility.getMagnitude10(arguments[0]);
        	const mag1 = Utility.getMagnitude10(arguments[1]);
        	const mag = mag0 < mag1 ? mag1 : mag0;
        	return Utility.randNum(arguments[0] * mag, arguments[1] * mag) / mag;
    	} else {
    		const mag = Utility.getMagnitude10(arguments[0]);
    		return Utility.randNum(arguments[0] * mag) / mag;
    	}
    }

	static randBool(percentage) {
		return Math.random() * 100 < percentage; 
	}
}