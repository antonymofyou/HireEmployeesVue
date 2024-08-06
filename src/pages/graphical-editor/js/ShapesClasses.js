/**
 * Базовый класс фигуры
 */
class Shape {
  constructor(id = crypto.randomUUID()) {
    this.id = id;
    this.x = 10;
    this.y = 10;
    this.fill = '#47e5d8';
    this.stroke = '#000';
    this.cornerRadius = 0;
    this.borderWidth = 5;
  }
}

/**
 * Класс прямоугольника
 */
export class Rectangle extends Shape {
  constructor(id, width = 200, height = 100) {
    super(id);
    this.type = 'rectangle';
    this.width = width;
    this.height = height;
  }
}

/**
 * Класс круга
 */
export class Circle extends Shape {
  constructor(id, radius = 20) {
    super(id);
    this.type = 'circle';
    this.radius = radius;
    this.x = 50;
    this.y = 50;
  }
}

/**
 * Класс стрелки
 */
export class Arrow extends Shape {
  constructor(id) {
    super(id);
    this.type = 'arrow';
    this.x = window.innerWidth / 2;
    this.y = 50;
    this.points = [0, 0, 100, 100];
    this.pointerLength = 20;
    this.pointerWidth = 30;
    this.fill = 'black';
  }
}