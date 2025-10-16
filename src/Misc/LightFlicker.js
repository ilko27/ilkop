
let isFlickered = false;

export const LightFlicker = (light) => {
    if (isFlickered && Math.random() < 0.4) {
        light.intensity = 20;
        isFlickered = false;
        console.log("skibidi");
    }

    let prob = Math.random();
    if (prob < 0.05) {
        if (Math.random() > 0.5) {
            light.intensity += 15;
        } else {
            light.intensity -= 15;
        }
        isFlickered = true;
    }
    console.log(light.intensity, isFlickered);
}