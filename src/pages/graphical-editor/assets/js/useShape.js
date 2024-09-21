import {computed, ref} from 'vue';

export function useShape(emits, props) {
    const isDragging = ref(false);
    const isResizing = ref(false);
    const isRotating = ref(false);
    const isResizingArrow = ref(false);
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
    let centerX, centerY;
    let activeHandle = null;

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

    // Начало трансформации стрелки
    const startResizingArrow = (handle, event) => {
        event.preventDefault();
        isResizingArrow.value = true;
        activeHandle = handle;

        const canvasScale = updateCanvasScale();
        const clientX = event.clientX || event.touches[0].clientX;
        const clientY = event.clientY || event.touches[0].clientY;

        const rect = document.getElementById(props.params.id).getBoundingClientRect();
        const startX = rect.left + props.params.x1;
        const startY = rect.top + props.params.y1;
        const endX = rect.left + props.params.x2;
        const endY = rect.top + props.params.y2;

        if (handle === 'start') {
            centerX = endX;
            centerY = endY;
        } else {
            centerX = startX;
            centerY = startY;
        }

        console.log(`Fixed rotation center: (${centerX}, ${centerY})`);

        offsetX.value = (clientX / canvasScale) - centerX;
        offsetY.value = (clientY / canvasScale) - centerY;

        document.addEventListener('mousemove', onResizingArrow);
        document.addEventListener('touchmove', onResizingArrow);
        document.addEventListener('mouseup', stopResizingArrow);
        document.addEventListener('touchend', stopResizingArrow);
    };

    // Функция трансформации стрелки
    const onResizingArrow = (event) => {
        if (isResizingArrow.value && activeHandle) {
            cancelAnimationFrame(resizingFrame);

            resizingFrame = requestAnimationFrame(() => {
                const canvasScale = updateCanvasScale();
                const clientX = event.clientX || event.touches[0].clientX;
                const clientY = event.clientY || event.touches[0].clientY;

                const adjustedClientX = clientX / canvasScale;
                const adjustedClientY = clientY / canvasScale;

                const deltaX = adjustedClientX - centerX;
                const deltaY = adjustedClientY - centerY;

                console.log(`Delta relative to center: (${deltaX}, ${deltaY})`);

                let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                if (event.shiftKey) {
                    angle = Math.round(angle / 15) * 15;
                }
                angle = (angle % 360 + 360) % 360;

                updateShape({
                    rotation: angle,
                });

                console.log(`New rotation angle: ${angle}`);
            });
        }
    };

    // Завершение трансформации стрелки
    const stopResizingArrow = () => {
        isResizingArrow.value = false;
        document.removeEventListener('mousemove', onResizingArrow);
        document.removeEventListener('touchmove', onResizingArrow);
        document.removeEventListener('mouseup', stopResizingArrow);
        document.removeEventListener('touchend', stopResizingArrow);
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
        const boundingBox = event.target.getBoundingClientRect();
        centerX = boundingBox.left + boundingBox.width / 2;
        centerY = boundingBox.top + boundingBox.height / 2;

        const clientX = event.clientX || event.touches[0].clientX;
        const clientY = event.clientY || event.touches[0].clientY;
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
        startResizingArrow,
        stopResizingArrow,
        isDragging,
        isResizing,
        isRotating
    };
}