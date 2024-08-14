<template>
    <div class="control-buttons">
        <ControlButton 
            class="control-buttons__button" 
            :disabled="disabled"
            :active="props.activeShape.editor?.isActive('bold')"
            @click="props.activeShape.editor?.chain().focus().toggleBold().run()"
        >
            <BoldIcon />
        </ControlButton>
        <ControlButton 
            class="control-buttons__button" 
            :disabled="disabled"
            :active="props.activeShape.editor?.isActive('italic')"
            @click="props.activeShape.editor?.chain().focus().toggleItalic().run()"
        >
            <ItalicIcon />
        </ControlButton>
        <ControlButton 
            class="control-buttons__button" 
            :disabled="disabled"
            :active="props.activeShape.editor?.isActive('underline')"
            @click="props.activeShape.editor?.chain().focus().toggleUnderline().run()"
        >
            <UnderlineIcon />
        </ControlButton>
        <ControlButton 
            class="control-buttons__button" 
            :disabled="disabled"
            :active="props.activeShape.editor?.isActive({'textAlign': 'left'})"
            @click="props.activeShape.editor?.chain().focus().setTextAlign('left').run()"
        >
            <AlignLeftIcon />
        </ControlButton>
        <ControlButton 
            class="control-buttons__button" 
            :disabled="disabled"
            :active="props.activeShape.editor?.isActive({'textAlign': 'center'})"
            @click="props.activeShape.editor?.chain().focus().setTextAlign('center').run()"
        >
            <AlignCenterIcon />
        </ControlButton>
        <ControlButton 
            class="control-buttons__button" 
            :disabled="disabled"
            :active="props.activeShape.editor?.isActive({'textAlign': 'right'})"
            @click="props.activeShape.editor?.chain().focus().setTextAlign('right').run()"
        >
            <AlignRightIcon />
        </ControlButton>
        <ControlButton 
            class="control-buttons__button" 
            :disabled="disabled"
            :active="props.activeShape.shape?.textVerticalAlignment == 'bottom'"
            @click="emits('updateShape', props.activeShape.id, 'textVerticalAlignment', 'bottom')"
        >
            <VerticalAlignBottom />
        </ControlButton>
        <ControlButton 
            class="control-buttons__button" 
            :disabled="disabled"
            :active="props.activeShape.shape?.textVerticalAlignment == 'center'"
            @click="emits('updateShape', props.activeShape.id, 'textVerticalAlignment', 'center')"
        >
            <VerticalAlignCenter />
        </ControlButton>
        <ControlButton 
            class="control-buttons__button" 
            :disabled="disabled"
            :active="props.activeShape.shape?.textVerticalAlignment == 'top'"
            @click="emits('updateShape', props.activeShape.id, 'textVerticalAlignment', 'top')"
        >
            <VerticalAlignTop />
        </ControlButton>
        <ColorPicker
            class="control-buttons__color-picker"
            :disabled="disabled"
            :color="props.activeShape.editor?.getAttributes('textStyle').color || '#000'"
            @update:color="props.activeShape.editor?.chain().focus().setColor($event).run()"
        />
        <FontSizePicker 
            class="control-buttons__font-size-picker"
            :disabled="disabled"
            :font-size="parseInt(props.activeShape.editor?.getAttributes('textStyle').fontSize) || 16"
            @update:font-size="props.activeShape.editor?.chain().focus().setFontSize($event + 'px').run()"            
        />
    </div>
</template>

<script setup>

import { defineProps, defineEmits, computed } from 'vue';

import ControlButton from './ControlButton.vue';
import ColorPicker from './ColorPicker.vue';
import FontSizePicker from './FontSizePicker.vue';

import BoldIcon from 'vue-material-design-icons/FormatBold.vue'
import ItalicIcon from 'vue-material-design-icons/FormatItalic.vue'
import UnderlineIcon from 'vue-material-design-icons/FormatUnderline.vue'
import AlignLeftIcon from 'vue-material-design-icons/FormatAlignLeft.vue'
import AlignCenterIcon from 'vue-material-design-icons/FormatAlignCenter.vue'
import AlignRightIcon from 'vue-material-design-icons/FormatAlignRight.vue'
import VerticalAlignBottom from 'vue-material-design-icons/FormatVerticalAlignBottom.vue'
import VerticalAlignCenter from 'vue-material-design-icons/FormatVerticalAlignCenter.vue'
import VerticalAlignTop from 'vue-material-design-icons/FormatVerticalAlignTop.vue'

/**
 * 
 * Объект с параметрами активной фигуры (id фигуры, экземпляр редактора (editor) , объект с параметрами фигуры)
 * 
 */
const props = defineProps({
    activeShape: {
        type: Object,
        required: true,
    }
});
/**
 * 
 * updateShape(ид-фигуры, обновляемый ключ , значение)
 * 
 */
const emits = defineEmits({
    updateShape: null
})

const disabled = computed(() => {
    return !props.activeShape.editor;
})

</script>

<style scoped>

.control-buttons__button span{
    display: block;
    width: 24px;
    height: 24px;
}

.control-buttons__button svg {
    width: 100%;
    height: 100%;
}

.control-buttons__color-picker {
    width: 40px;
    height: 40px;
}

.control-buttons__font-size-picker {
    width: 70px;
    font-size: 20px;
}

</style>