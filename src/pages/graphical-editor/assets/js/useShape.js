import {computed, ref} from 'vue';

export function useShape(emits, props) {
    const isDragging = ref(false);
    const isResizing = ref(false);
    const isRotating = ref(false);
    const offsetX = ref(0);
    const offsetY = ref(0);
    const startX = ref(0);
    const startY = ref(0);
    const startWidth = ref(0);
    const startHeight = ref(0);
    let resizingHandle = null;

    const isEditMode = computed(() => props.mode.value === props.mode._edit);

    let draggingFrame;
    let resizingFrame;

    // Функция для обновления свойств фигуры
    const updateShape = (updates) => {
        Object.entries(updates).forEach(([key, value]) => emits('updateShape', props.params.id, key, value));
    };

    // Начало перемещения
    const startDragging = (event) => {
        if (!isEditMode.value) return;

        isDragging.value = true;
        offsetX.value = event.clientX - props.params.x;
        offsetY.value = event.clientY - props.params.y;

        document.addEventListener('mousemove', onDragging);
        document.addEventListener('mouseup', stopDragging);
    };

    // Функция для перемещения
    const onDragging = (event) => {
        if (isDragging.value) {
            cancelAnimationFrame(draggingFrame);

            draggingFrame = requestAnimationFrame(() => {
                const newX = event.clientX - offsetX.value;
                const newY = event.clientY - offsetY.value;

                // Обновляем свойства фигуры
                updateShape({x: newX, y: newY});
            });
        }
    };

    // Завершение процесса перемещения
    const stopDragging = () => {
        isDragging.value = false;
        document.removeEventListener('mousemove', onDragging);
        document.removeEventListener('mouseup', stopDragging);
    };

    // Начало изменения размера
    const startResizing = (handle) => {
        if (handle.isRotateHandle) {
            startRotating(event);
        } else {
            resizingHandle = handle;
            isResizing.value = true;
            startX.value = props.params.x;
            startY.value = props.params.y;
            startWidth.value = props.params.width;
            startHeight.value = props.params.height;
            offsetX.value = event.clientX;
            offsetY.value = event.clientY;

            document.addEventListener('mousemove', onResizing);
            document.addEventListener('mouseup', stopResizing);
        }
    };

    // Функция для изменения размера
    const onResizing = (event) => {
        if (isResizing.value && resizingHandle) {
            cancelAnimationFrame(resizingFrame);

            resizingFrame = requestAnimationFrame(() => {
                let newWidth = startWidth.value;
                let newHeight = startHeight.value;
                let newX = startX.value;
                let newY = startY.value;

                // Обработка изменения размера по горизонтали
                if (resizingHandle.position.includes('left')) {
                    newWidth = startWidth.value - (event.clientX - offsetX.value);
                    newX = newWidth > 0 ? startX.value + (event.clientX - offsetX.value) : startX.value + startWidth.value;
                    newWidth = Math.abs(newWidth);
                } else if (resizingHandle.position.includes('right')) {
                    newWidth = startWidth.value + (event.clientX - offsetX.value);
                    if (newWidth < 0) {
                        newX = startX.value + newWidth;
                        newWidth = Math.abs(newWidth);
                    }
                }

                // Обработка изменения размера по вертикали
                if (resizingHandle.position.includes('top')) {
                    newHeight = startHeight.value - (event.clientY - offsetY.value);
                    newY = newHeight > 0 ? startY.value + (event.clientY - offsetY.value) : startY.value + startHeight.value;
                    newHeight = Math.abs(newHeight);
                } else if (resizingHandle.position.includes('bottom')) {
                    newHeight = startHeight.value + (event.clientY - offsetY.value);
                    if (newHeight < 0) {
                        newY = startY.value + newHeight;
                        newHeight = Math.abs(newHeight);
                    }
                }

                // Обновляем свойства фигуры
                updateShape({width: newWidth, height: newHeight, x: newX, y: newY});
            });
        }
    };

    // Завершение процесса изменения размера
    const stopResizing = () => {
        isResizing.value = false;
        resizingHandle = null;
        document.removeEventListener('mousemove', onResizing);
        document.removeEventListener('mouseup', stopResizing);
    };

    // Начало вращения
    const startRotating = (event) => {
        isRotating.value = true;
        startX.value = event.clientX;
        startY.value = event.clientY;

        document.addEventListener('mousemove', onRotating);
        document.addEventListener('mouseup', stopRotating);
    };

    // Функция для вращения
    const onRotating = (event) => {
        if (isRotating.value) {
            const centerX = props.params.x + props.params.width / 2;
            const centerY = props.params.y + props.params.height / 2;
            let angle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);

            // Привязка углов вращения, если зажата клавиша Shift
            if (event.shiftKey) {
                angle = Math.round(angle / 15) * 15;
            }

            // Обновляем свойства фигуры
            updateShape({rotation: angle});
        }
    };

    // Завершение процесса вращения объекта
    const stopRotating = () => {
        isRotating.value = false;
        document.removeEventListener('mousemove', onRotating);
        document.removeEventListener('mouseup', stopRotating);
    };

    return {
        startDragging,
        stopDragging,
        startResizing,
        stopResizing,
        startRotating,
        stopRotating,
        isDragging,
        isResizing,
        isRotating
    };
}