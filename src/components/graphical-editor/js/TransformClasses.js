/**
 * Класс для трансформаций
 */
export class TransformerEditor {
  /**
   * Преобразование конфига с бэка в корректный конфиг vue-konva
   * @param {Object} config Конфиг с бэка
   * @returns {Object} Конфиг для vue-konva
   */
  static transformConfigToKonvaCorrect(correctConfig) {
    // Собираем корректный конфиг
    // const correctConfig = { ...config, id: String(config.id), draggable: false };
    correctConfig.id = String(correctConfig.id);

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
  static transformTextConfigToConvaCorrect(correctConfigText) {
    // const correctConfigText = { ...config };

    if (correctConfigText.fontColor) {
      correctConfigText.fill = correctConfigText.fontColor;
      delete correctConfigText.fontColor;
    }

    if (correctConfigText.type) {
      switch (correctConfigText.type) {
        case 'black': {
          correctConfigText.fontStyle = '900';
          break;
        }
        case 'extrabold': {
          correctConfigText.fontStyle = '800';
          break;
        }
        case 'bold': {
          correctConfigText.fontStyle = '700';
          break;
        }
        case 'semibold': {
          correctConfigText.fontStyle = '600';
          break;
        }
        case 'medium': {
          correctConfigText.fontStyle = '500';
          break;
        }
        case 'normal': {
          correctConfigText.fontStyle = '400';
          break;
        }
        case 'light': {
          correctConfigText.fontStyle = '300';
          break;
        }
        case 'extralight': {
          correctConfigText.fontStyle = '200';
          break;
        }
        case 'thin': {
          correctConfigText.fontStyle = '100';
          break;
        }
        default: {
          correctConfigText.fontStyle = '400';
          delete correctConfigText.type;
        }
      }
    }
  
    return correctConfigText;
  }

  /**
   * Редьюсер для выдачи корректного имени компонента vue-konva
   * @param {Object | string} shape Объект или строка с обозначением фигуры
   */
  static shapeReducer(shape) {
    let shapeType = shape;
    if (typeof shape === 'object') shapeType = shape.type;

    switch (shapeType) {
      case 'rect':
      case 'rectangle': return 'v-rect';
      case 'circle': return 'v-circle';
      case 'image': return 'v-image';
      case 'text': return 'v-text';
      case 'arrow': return 'v-arrow';
      default: {
        return 'text';
      }
    }
  }
}