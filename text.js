const calculatedWidth = Math.abs(currentShapeConfig.value.x - x);
const calculatedHeight = Math.abs(currentShapeConfig.value.y - y);
const radius = Math.ceil(Math.max(calculatedWidth, calculatedHeight) / 2);