<template>
    <div class="dropzone-container" @dragover.prevent="dragover" @dragleave.prevent="dragleave" @drop.prevent="drop"
        :class="{ 'dragover': isDragging }" :style="{ borderColor: isDragging ? 'blue' : 'lightgray' }">
        <div class="dropzone-container__text" :style="{ color: isDragging ? 'gray' : '#4e4b4b' }">
            Перетащите файлы сюда
            <div>
                <span>или</span>
            </div>
            <label class="dropzone-container__label" for="input-file">Выберите файлы</label>
        </div>

        <input type="file" id="input-file" class="dropzone-container__input" multiple
            @change="handleFiles($event.target.files)">

        <div v-for="(file, index) in files" class="dropzone-container__files" :key="index">
            <img v-if="file.type === 'image'" class="dropzone-container__image" :src="file.url"
                style="max-width: 100px; max-height: 100px;">
            <div class="dropzone-container__file-text-container">
                <article class="dropzone-container__file-info">
                    <span class="dropzone-container__file-name">{{ file.name }}</span>
                    <span class="dropzone-container__file-size">{{ Math.round(file.size / 1000) + "kb" }}</span>
                </article>
                <div class="dropzone-container__file-remove" @click="removeFile(index)">x</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const files = ref([]);
const isDragging = ref(false);

const dragover = (e) => {
    e.preventDefault();
    isDragging.value = true;
};

const dragleave = () => {
    isDragging.value = false;
};

const addFileToFileList = (file) => {
    if (file.type.startsWith('image/')) {
        addImageToFileList(file);
    } else {
        files.value.push({ type: 'other', name: file.name, size: file.size });
    }
};

const addImageToFileList = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        const imageUrl = event.target.result;
        files.value.push({ type: 'image', name: file.name, url: imageUrl, size: file.size });
    };
    reader.readAsDataURL(file);
};

const drop = (e) => {
    e.preventDefault();
    isDragging.value = false;

    const fileList = e.dataTransfer.files;

    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        addFileToFileList(file);
    }
};

const handleFiles = (fileList) => {
    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        addFileToFileList(file);
    }
};

const removeFile = (index) => {
    files.value.splice(index, 1);
};

</script>

<style>
.dropzone-container {
    border: 2px dashed rgb(132, 132, 132);
    width: 400px;
    padding: 16px;
    transition: .3s ease;
}

.dropzone-container__text {
    text-align: center;
    color: var(--tundora);
    user-select: none;
}

.dropzone-container__label {
    cursor: pointer;
}

.dropzone-container__input {
    display: none;
}

.dropzone-container__files {
    display: flex;
    flex-direction: row;
    margin-top: 16px;
}

.dropzone-container__image {
    border-radius: 12px;
    box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.3);
}

.dropzone-container__file-text-container {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    justify-content: space-between;

}

.dropzone-container__file-info {
    display: flex;
    flex-direction: column;
}

.dropzone-container__file-name,
.dropzone-container__file-size {
    font-size: 12px;
    margin-left: 24px;
}

.dropzone-container__file-remove {
    cursor: pointer;
    color: var(--cinnabar);
    user-select: none;
}
</style>