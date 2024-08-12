// Tiptap (text) -> Наш (text)

export function convertTo(array) {
    return array.map((paragraph) => {
        const alignment = paragraph.attrs.textAlign;
        const text = paragraph.content?.map(({ text, marks = [] }) => {
            const finalText = {
                text,
            };

            // todo : ref

            marks.forEach(({ type, attrs }) => {
                const types = ['bold', 'italic', 'underline'];

                if (types.some(item => item == type)) {
                    finalText.type = finalText.type || [];

                    finalText.type.push(type);

                    return;
                }

                if (type == 'textStyle' && attrs) {
                    attrs.color && (finalText.fontColor = attrs.color);

                    attrs.fontSize && (finalText.fontSize = parseInt(attrs.fontSize));

                    return;
                }
            });
    
            return finalText;
        }) || [];
        
        return {
            alignment,
            text
        };
    });
}