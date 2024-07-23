/**
 * Класс для трансформаций
 */
export class TransformerEditor {
  /**
   * Преобразование конфига с бэка в корректный конфиг vue-konva
   * @param {Object} config Конфиг с бэка
   * @returns {Object} Конфиг для vue-konva
   */
  static transformConfigToKonvaCorrect(config) {
    // Собираем корректный конфиг
    const correctConfig = { ...config, id: String(config.id), draggable: false };

    if (correctConfig.color) {
      correctConfig.fill = correctConfig.color;
      delete correctConfig.color;
    }

    if (correctConfig.borderColor) {
      correctConfig.stroke = correctConfig.borderColor;
      delete correctConfig.borderColor;
    }

    if (correctConfig.borderWidth) {
      correctConfig.strokeWidth = correctConfig.borderWidth;
      delete correctConfig.borderWidth;
    }

    return correctConfig;
  }

  /**
   * Преобразование конфига текста в корректный конфиг vue-conva
   * @param {Object} config Конфиг с бэка
   * @returns {Object} Конфиг для vue-konva
   */
  static transformTextConfigToConvaCorrect(config) {
    const correctConfigText = { ...config };

    if (correctConfigText.fontColor) {
      correctConfigText.fill = correctConfigText.fontColor;
      delete correctConfigText.fontColor;
    }
  
    return correctConfigText;
  }

  /**
   * Редьюсер для выдачи корректного имени компонента vue-konva
   * @param {Object} shape Объект фигуры
   */
  static shapeReducer(shape) {
    switch (shape.type) {
      case 'rectangle': return 'v-rect';
      case 'circle': return 'v-circle';
      case 'image': return 'v-image';
      case 'text': return 'v-text';
      case 'arrow': return 'v-arrow';
      default: {
        console.log('@@@ Reducer default:', shape);
        return 'text';
      }
    }
  }
}