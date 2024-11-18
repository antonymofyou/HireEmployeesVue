<template>
  <div class="toolbar">
    <p v-show="isCode">
      Исполняемый html нужно обернуть в тег &lt;code&gt;
    </p>
    <TableMenu v-show="!isCode" />
    <ColorPicker v-show="!isCode" />
    <FontPicker v-show="!isCode" />
    <ToolbarButton
      v-for="(button, index) in toolbarButtons"
      :key="index"
      :icon="button.icon"
      :action="button.action"
      :isActive="button.isActive"
      :disabled="button.disabled"
      :isShow="button.isShow"
      :class="button.class"
    />
  </div>
</template>

<script setup>
import { inject, computed } from 'vue';
import ToolbarButton from './ToolbarButton.vue';
import TableMenu from './TableMenu.vue';
import ColorPicker from './ColorPicker.vue';
import FontPicker from './FontPicker.vue';

import BoldIcon from 'vue-material-design-icons/FormatBold.vue';
import ItalicIcon from 'vue-material-design-icons/FormatItalic.vue';
import UnderlineIcon from 'vue-material-design-icons/FormatUnderline.vue';
import LinkIcon from 'vue-material-design-icons/LinkVariant.vue';
import ListIcon from 'vue-material-design-icons/FormatListBulleted.vue';
import OrderedListIcon from 'vue-material-design-icons/FormatListNumbered.vue';
import HorizontalRuleIcon from 'vue-material-design-icons/Minus.vue';
import HtmlIcon from 'vue-material-design-icons/CodeTags.vue';

const props = defineProps({
  isCode: {
    type: Boolean,
    default: false,
  }
});

// Объект редактора
const editor = inject('editor')

// Событие открытия попапа для ссылки , обновления флага isCode
const emit = defineEmits(['openLinkPopup', 'updateCode'])

// Объект с кнопками панели управления, состоящий из: иконки, действия по кнопке и статус кнопки
const toolbarButtons = computed(() => {
  // Проверяем, что editor.value не равен null
  if (!editor.value) {
    return [];
  }
  return [
    {
      icon: BoldIcon,
      action: () => editor.value.chain().focus().toggleBold().run(),
      isActive: () => editor.value.isActive('bold'),
      isShow: () => !props.isCode,
    },
    {
      icon: ItalicIcon,
      action: () => editor.value.chain().focus().toggleItalic().run(),
      isActive: () => editor.value.isActive('italic'),
      isShow: () => !props.isCode,
    },
    {
      icon: UnderlineIcon,
      action: () => editor.value.chain().focus().toggleUnderline().run(),
      isActive: () => editor.value.isActive('underline'),
      isShow: () => !props.isCode,
    },
    {
      icon: LinkIcon,
      action: () => emit('openLinkPopup'),
      isActive: () => editor.value.isActive('link'),
      isShow: () => !props.isCode,
    },
    {
      icon: ListIcon,
      action: () => editor.value.chain().focus().toggleBulletList().run(),
      isActive: () => editor.value.isActive('bulletList'),
      isShow: () => !props.isCode,
    },
    {
      icon: OrderedListIcon,
      action: () => editor.value.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.value.isActive('orderedList'),
      isShow: () => !props.isCode,
    },
    {
      icon: HorizontalRuleIcon,
      action: () => editor.value.chain().focus().setHorizontalRule().run(),
      isShow: () => !props.isCode,
    },
    {
      icon: HtmlIcon,
      action: () => emit('updateCode', !props.isCode),
      isActive: () => props.isCode,
      class: 'toolbar-button-html'
    },
  ]
})
</script>

<style>
.toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
  padding: 0 8px;
}
.toolbar-button-html {
  margin: 0 0 0 auto !important;
}
</style>