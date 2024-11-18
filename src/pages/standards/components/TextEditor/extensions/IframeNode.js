import { Node, mergeAttributes } from '@tiptap/core';

const Iframe = Node.create({
  name: 'iframe',

  inline: true,

  group: 'inline',

  selectable: true,

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: '100%',
      },
      height: {
        default: '300px',
      },
      sandbox: {
        default: 'allow-popups allow-scripts'
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { src, width, height } = node.attrs;
    return ['iframe', mergeAttributes(HTMLAttributes, { src, width, height })];
  },

  addCommands() {
    return {
      setIframe: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});

export default Iframe;