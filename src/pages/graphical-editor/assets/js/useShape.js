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
    let initialAngle = 0;
    let initialMouseAngle = 0;

    // Получение трансформаций translate и scale
    const updateCanvasScale = () => {
        const canvasElement = document.querySelector('.canvas');
        const canvasTransform = getComputedStyle(canvasElement).transform;
        let canvasScale = 1;

        if (canvasTransform !== 'none') {
            const matrix = canvasTransform.match(/^matrix\((.+)\)$/)[1].split(', ').map(parseFloat);
            canvasScale = matrix[0];
        }

        return canvasScale;
    };

    // Функция для обновления свойств фигуры
    const updateShape = (updates) => {
        Object.entries(updates).forEach(([key, value]) => emits('updateShape', props.params.id, key, value));
    };

    // Начало перемещения
    const startDragging = (event) => {
        if (!isEditMode.value) return;
        event.preventDefault();
        const canvasScale = updateCanvasScale();

        isDragging.value = true;
        const clientX = event.clientX || event.touches[0].clientX;
        const clientY = event.clientY || event.touches[0].clientY;
        offsetX.value = (clientX / canvasScale) - props.params.x;
        offsetY.value = (clientY / canvasScale) - props.params.y;

        document.addEventListener('mousemove', onDragging);
        document.addEventListener('touchmove', onDragging);
        document.addEventListener('mouseup', stopDragging);
        document.addEventListener('touchend', stopDragging);
    };

    // Функция для перемещения
    const onDragging = (event) => {
        if (isDragging.value) {
            cancelAnimationFrame(draggingFrame);

            draggingFrame = requestAnimationFrame(() => {
                const canvasScale = updateCanvasScale();

                const clientX = event.clientX || event.touches[0].clientX;
                const clientY = event.clientY || event.touches[0].clientY;
                const newX = (clientX / canvasScale) - offsetX.value;
                const newY = (clientY / canvasScale) - offsetY.value;

                // Обновляем свойства фигуры
                updateShape({x: newX, y: newY});
            });
        }
    };

    // Завершение процесса перемещения
    const stopDragging = () => {
        isDragging.value = false;
        document.removeEventListener('mousemove', onDragging);
        document.removeEventListener('touchmove', onDragging);
        document.removeEventListener('mouseup', stopDragging);
        document.removeEventListener('touchend', stopDragging);
    };

    // Начало изменения размера
    const startResizing = (handle, event) => {
        if (handle.isRotateHandle) {
            startRotating(event);
        } else {
            event.preventDefault();
            resizingHandle = handle;

            const canvasScale = updateCanvasScale();

            isResizing.value = true;
            startX.value = props.params.x;
            startY.value = props.params.y;
            startWidth.value = props.params.width;
            startHeight.value = props.params.height;
            const clientX = event.clientX || event.touches[0].clientX;
            const clientY = event.clientY || event.touches[0].clientY;
            offsetX.value = clientX / canvasScale;
            offsetY.value = clientY / canvasScale;

            document.addEventListener('mousemove', onResizing);
            document.addEventListener('touchmove', onResizing);
            document.addEventListener('mouseup', stopResizing);
            document.addEventListener('touchend', stopResizing);
        }
    };

    // Функция для изменения размера
    const onResizing = (event) => {
        if (isResizing.value && resizingHandle) {
            cancelAnimationFrame(resizingFrame);

            resizingFrame = requestAnimationFrame(() => {
                const canvasScale = updateCanvasScale();

                const clientX = event.clientX || event.touches[0].clientX;
                const clientY = event.clientY || event.touches[0].clientY;
                let newWidth = startWidth.value;
                let newHeight = startHeight.value;
                let newX = startX.value;
                let newY = startY.value;

                const adjustedClientX = clientX / canvasScale;
                const adjustedClientY = clientY / canvasScale;

                // Обработка изменения размера по горизонтали
                if (resizingHandle.position.includes('left')) {
                    newWidth = startWidth.value - (adjustedClientX - offsetX.value);
                    newX = newWidth > 0 ? startX.value + (adjustedClientX - offsetX.value) : startX.value + startWidth.value;
                    newWidth = Math.abs(newWidth);
                } else if (resizingHandle.position.includes('right')) {
                    newWidth = startWidth.value + (adjustedClientX - offsetX.value);
                    if (newWidth < 0) {
                        newX = startX.value + newWidth;
                        newWidth = Math.abs(newWidth);
                    }
                }

                // Обработка изменения размера по вертикали
                if (resizingHandle.position.includes('top')) {
                    newHeight = startHeight.value - (adjustedClientY - offsetY.value);
                    newY = newHeight > 0 ? startY.value + (adjustedClientY - offsetY.value) : startY.value + startHeight.value;
                    newHeight = Math.abs(newHeight);
                } else if (resizingHandle.position.includes('bottom')) {
                    newHeight = startHeight.value + (adjustedClientY - offsetY.value);
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
        document.removeEventListener('touchmove', onResizing);
        document.removeEventListener('mouseup', stopResizing);
        document.removeEventListener('touchend', stopResizing);
    };

    // Начало вращения
    const startRotating = (event) => {
        event.preventDefault();
        isRotating.value = true;

        const clientX = event.clientX || event.touches[0].clientX;
        const clientY = event.clientY || event.touches[0].clientY;
        const centerX = (props.params.x + props.params.width / 2);
        const centerY = (props.params.y + props.params.height / 2);

        initialAngle = props.params.rotation || 0;
        initialMouseAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);

        document.addEventListener('mousemove', onRotating);
        document.addEventListener('touchmove', onRotating);
        document.addEventListener('mouseup', stopRotating);
        document.addEventListener('touchend', stopRotating);
    };

    // Функция для вращения
    const onRotating = (event) => {
        if (isRotating.value) {
            const clientX = event.clientX || event.touches[0].clientX;
            const clientY = event.clientY || event.touches[0].clientY;

            const centerX = (props.params.x + props.params.width / 2);
            const centerY = (props.params.y + props.params.height / 2);

            let currentMouseAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
            let angle = initialAngle + (currentMouseAngle - initialMouseAngle);

            if (event.shiftKey) {
                angle = Math.round(angle / 15) * 15;
            }
            angle = (angle % 360 + 360) % 360;

            // Обновляем свойства фигуры
            updateShape({rotation: angle});
        }
    };

    // Завершение процесса вращения объекта
    const stopRotating = () => {
        isRotating.value = false;
        document.removeEventListener('mousemove', onRotating);
        document.removeEventListener('touchmove', onRotating);
        document.removeEventListener('mouseup', stopRotating);
        document.removeEventListener('touchend', stopRotating);
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