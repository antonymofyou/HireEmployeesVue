export default function CustomCell(instance) {
    return instance.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            backgroundColor: {
              default: null,
              parseHTML: (element) => element.getAttribute('background-color'),
              renderHTML: (attributes) => {
                return {
                  'background-color': attributes.backgroundColor,
                  style: `background-color: ${attributes.backgroundColor}`,
                }
              }
            },
            borderColor: {
              default: null,
              parseHTML: (element) => element.getAttribute('border-color'),
              renderHTML: (attributes) => {
                return {
                  'border-color': attributes.borderColor,
                  style: `border-color: ${attributes.borderColor}`,
                }
              }
            },
          };
        },
    });
}