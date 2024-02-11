const math = require('mathjs');
const Jimp = require('jimp');

const width = 3000;
const height = 3000;

//-3 , 1

function calculateMandelbrotPoint(x, y) {
    let c = math.complex(x/750 -3 , y/750 -2);
    let z = math.complex(0,0);

    let maxIterations = 50;

    for(i = 0; i < maxIterations; i++) {
        z = math.square(z).add(c);
        if(math.abs(z) > 2) {
            return i;
        }

    }

    return maxIterations;

}

function interpolateColor(color1, color2, fraction) {   
    fraction = fraction;

    const clampedFraction = Math.max(0, Math.min(fraction, 1));

    const r1 = (color1 & 0xff0000) >> 24; 
    const g1 = (color1 & 0x00ff00) >> 16; 
    const b1 = (color1 & 0x0000ff) >> 8; 
    
   // console.log(r1,g1,b1);

    const r2 = (color2 & 0xff0000) >> 16; 
    const g2 = (color2 & 0x00ff00) >> 8; 
    const b2 = (color2 & 0x0000ff); 

    //console.log("color1:", color1.toString(16));
    //console.log("color2:", color2.toString(16));
    //console.log("r1:", r1, "g1:", g1, "b1:", b1);
    //console.log("r2:", r2, "g2:", g2, "b2:", b2);

    const r = Math.round(r1 + (r2 - r1) * clampedFraction);
    const g = Math.round(g1 + (g2 - g1) * clampedFraction);
    const b = Math.round(b1 + (b2 - b1) * clampedFraction);

    //console.log(clampedFraction)

    //console.log("Before Clamping: r:", r, "g:", g, "b:", b); 

    const clampedR = Math.max(0, Math.min(r, 255));
    const clampedG = Math.max(0, Math.min(g, 255));
    const clampedB = Math.max(0, Math.min(b, 255));


    const finalColor = Jimp.rgbaToInt(clampedR,clampedG,clampedB, 255);
    //console.log(finalColor.toString(16));

    return finalColor;
}

new Jimp(width, height, (err, image) => {
    if (err) throw err;


    for(let i = 0; i < width; i++) {
        for(let j = 0; j < height; j++) {

            let real = i / 750 - 3;
            let imag = j / 750 - 2;
            
            if( real >= -2.5 && real <= .5 && imag >= -1.5 && imag <= 1.5) { 
                let iterations = calculateMandelbrotPoint(i, j);

                if(iterations == 50) {
                    image.setPixelColor(0x000000FF, i, j);
                } else {
                    const fraction = iterations / 50.0;

                    //console.log(fraction);

                    
                    const color1 = 0xFFFFFFFF; // Start color (blue)
                    const color2 = 0xFF0000FF; // End color (purple) 
                    interpolatedColor = interpolateColor(color1, color2, fraction);

                    interpolatedColor = math.max(0,interpolatedColor);


                    image.setPixelColor(interpolatedColor, i, j);
                    
                }
            }

        }
    }

    image.write('mandelbrot.png');
});

