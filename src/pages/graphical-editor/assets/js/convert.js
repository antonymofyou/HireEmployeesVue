// Tiptap (text) -> Наш (text)

export function convertTo(text) {
    const { content = [] } = text;

    return content.map((paragraph) => {
        const { attrs , content = [] } = paragraph;

        const text = content.map(({ text, marks = [] }) => {
            const finalText = {
                text: text,
            };
            const primitiveHandler = function({ type }) {
                finalText.type = finalText.type || [];

                finalText.type.push(type);
            }
            const typeHandlers = {
                'bold': primitiveHandler,
                'italic': primitiveHandler,
                'underline': primitiveHandler,
                'textStyle': function({ attrs }) {
                    let { color: fontColor, fontSize } = attrs;

                    fontColor && (finalText.fontColor = fontColor);

                    fontSize && (finalText.fontSize = parseInt(fontSize));
                },
                'highlight': function({ attrs }) {
                    let { color } = attrs;

                    color && (finalText.backgroundColor = color);
                }
            };

            marks.forEach((mark) => {
                const { type } = mark;
                const handler = typeHandlers[type];

                handler(mark);
            });
    
            return finalText;
        });
        
        return {
            'alignment': attrs.textAlign,
            'text': text,
        };
    });
}

// Наш (text) -> Tiptap (text)

export function convertFrom(array = []) {
    const content = array.map(({ alignment , text = [] }) => {
        const textContent = text.map((item) => {
            const { text , type = [] , fontColor = null, fontSize = null, backgroundColor = null } = item;
            const finalText = {
                "type": "text",
                "marks": [],
                "text": text,
            };

            finalText.marks.push(...type.map((item) => {
                return {
                    "type": item,
                }
            }));

            if (fontColor || fontSize) {
                finalText.marks.push({
                    "type": "textStyle",
                    "attrs": {
                        color: fontColor,
                        fontSize: fontSize && (fontSize + "px"),
                    }
                });
            }

            if (backgroundColor) {
                finalText.marks.push({
                    "type": "highlight",
                    "attrs": {
                        color: backgroundColor,
                    }
                })
            }

            return finalText;
        });

        return {
            "type" : "paragraph",
            "attrs": {
                "textAlign": alignment
            },
            "content": textContent,
        };
    });

    return {
        "type": "doc",
        "content": content,
    }
}