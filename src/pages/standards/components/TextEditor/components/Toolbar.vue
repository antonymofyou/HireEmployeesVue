<template>
  <div v-if="editor" class="toolbar">
    <p v-show="isCode">
      Исполняемый html нужно обернуть в тег &lt;code&gt;
    </p>
    <ToolbarButton 
        v-show="button.tableAdd.show"
        @click="button.tableAdd.handler"
        title="Добавить таблицу"
      >
        <TablePlusIcon />
    </ToolbarButton>
    <ToolbarButton 
      v-show="button.tableRemove.show"
      @click="button.tableRemove.handler"
      title="Удалить таблицу"
    >
      <TableRemoveIcon/>
    </ToolbarButton>
    <DropdownContent 
      v-show="!props.isCode && editor.isActive('table')"
      title="Управление строками"
    >
      <template #trigger>
        <TableRowIcon />
      </template>
      <template #content>
        <ToolbarButton 
          @click="button.rowPlusAfter.handler"
          title="Добавить строку после"
        >
          <TableRowPlusAfterIcon />
        </ToolbarButton>
        <ToolbarButton 
          @click="button.rowPlusBefore.handler"
          title="Добавить строку до"
        >
          <TableRowPlusBeforeIcon />
        </ToolbarButton>
        <ToolbarButton 
          @click="button.rowRemove.handler"
          title="Удалить строку"
        >
          <TableRowRemoveIcon />
        </ToolbarButton>
      </template>
    </DropdownContent>
    <DropdownContent 
      v-show="!props.isCode && editor.isActive('table')"
      title="Управление колонками"
    >
      <template #trigger>
        <TableColumnIcon />
      </template>
      <template #content>
        <ToolbarButton 
          @click="button.columnPlusAfter.handler"
          title="Добавить колонку после"
        >
          <TableColumnPlusAfterIcon />
        </ToolbarButton>
        <ToolbarButton 
          @click="button.columnPlusBefore.handler"
          title="Добавить колонку до"
        >
          <TableColumnPlusBeforeIcon />
        </ToolbarButton>
        <ToolbarButton 
          @click="button.columnRemove.handler"
          title="Удалить колонку"
        >
          <TableColumnRemoveIcon />
        </ToolbarButton>
      </template>
    </DropdownContent>
    <ToolbarButton
      v-show="button.mergeOrSplit.show"
      @click="button.mergeOrSplit.handler"
      title="Объединить / разъединить ячейки"
    >
        <CodeBracketsIcon />
    </ToolbarButton>
    <ColorPicker
      v-show="button.borderColor.show"
      :color="button.borderColor.active.value"
      @reset-color="button.borderColor.handler(defaultColor)"
      @update:color="button.borderColor.handler"
      title="Цвет границ"
    >
      <template #icon>
        <BorderColorIcon />
      </template>
    </ColorPicker>
    <ColorPicker
      v-show="button.backgroundTable.show"
      :color="button.backgroundTable.active.value"
      @reset-color="button.backgroundTable.handler"
      @update:color="button.backgroundTable.handler"
      title="Заливка таблицы"
    >
      <template #icon>
        <FormatPaintIcon />
      </template>
    </ColorPicker>
    <ColorPicker
      v-show="button.color.show"
      :color="button.color.active.value"
      @reset-color="button.color.handler(defaultColor)"
      @update:color="button.color.handler"
      title="Цвет текста"
    >
      <template #icon>
        <FormatTextIcon />
      </template>
    </ColorPicker>
    <DropdownContent 
      v-show="!props.isCode"
      title="Форматирование текста"
    >
      <template #trigger>
        <FormatFontIcon />
      </template>
      <template #content>
        <ToolbarButton
          @click="button.bold.handler"
          :active="button.bold.active"
          title="Выделение"
        >
          <BoldIcon />
        </ToolbarButton>
        <ToolbarButton
          @click="button.italic.handler"
          :active="button.italic.active"
          title="Курсив"
        >
          <ItalicIcon />
        </ToolbarButton>
        <ToolbarButton
          @click="button.underline.handler"
          :active="button.underline.active"
          title="Подчеркивание"
        >
          <UnderlineIcon />
        </ToolbarButton>
      </template>
    </DropdownContent>
    <SelectSimple
      v-show="!props.isCode"
      :options="button.textAlign.options"
      :model-value="button.textAlign.active.value"
      @update:model-value="button.textAlign.handler"
      title="Выравнивание текста"
      class="toolbar__text-align"
    >
      <template #selected="{ item }">
        <ToolbarButton>
          <component :is="item.icon" />
        </ToolbarButton>
      </template>
      <template #item="{ item }">
        <component :is="item.icon" :title="item.title" />
      </template>
    </SelectSimple>
    <div 
      v-show="button.fontPicker.show" 
      class="toolbar__font-picker"
      title="Размер текста"
    >
      <SelectSimple
          :options="button.fontPicker.options" 
          :model-value="button.fontPicker.active.value" 
          @update:model-value="button.fontPicker.handler"
        />
      <FormatTextIcon />
    </div>
    <ToolbarButton
      v-show="button.bulletList.show"
      @click="button.bulletList.handler"
      :active="button.bulletList.active"
      title="Маркерованный список"
    >
      <BulletListIcon/>
    </ToolbarButton>
    <ToolbarButton
      v-show="button.orderedList.show"
      @click="button.orderedList.handler"
      :active="button.orderedList.active"
      title="Нумерованный список"
    >
      <OrderedListIcon/>
    </ToolbarButton>
    <ToolbarButton
      v-show="button.link.show"
      @click="button.link.handler"
      :active="button.link.active"
      title="Ссылка"
    >
      <LinkIcon />
    </ToolbarButton>
    <ToolbarButton
      v-show="button.horizontalRule.show"
      @click="button.horizontalRule.handler"
      title="Горизонтальная линия"
    >
      <HorizontalRuleIcon/>
    </ToolbarButton>
    <ToolbarButton
      @click="button.code.handler"
      :active="button.code.active"
      class="toolbar-button-html"
      :title="props.isCode ? 'Результат выполнения кода' : 'Исходный код'"
    >
      <HtmlIcon/>
    </ToolbarButton>
  </div>
</template>

<script setup>
import { inject, computed, markRaw, ref } from 'vue';
// Components
import DropdownContent from './DropdownContent.vue';
import ToolbarButton from './ToolbarButton.vue';
import SelectSimple from '../../UI/SelectSimple.vue';
import ColorPicker from './ColorPicker.vue';
// Icons
import FormatFontIcon from 'vue-material-design-icons/FormatFont.vue';
import BoldIcon from 'vue-material-design-icons/FormatBold.vue';
import ItalicIcon from 'vue-material-design-icons/FormatItalic.vue';
import UnderlineIcon from 'vue-material-design-icons/FormatUnderline.vue';
import LinkIcon from 'vue-material-design-icons/LinkVariant.vue';
import BulletListIcon from 'vue-material-design-icons/FormatListBulleted.vue';
import OrderedListIcon from 'vue-material-design-icons/FormatListNumbered.vue';
import HorizontalRuleIcon from 'vue-material-design-icons/Minus.vue';
import AlignLeftIcon from 'vue-material-design-icons/FormatAlignLeft.vue';
import AlignCenterIcon from 'vue-material-design-icons/FormatAlignCenter.vue';
import AlignRightIcon from 'vue-material-design-icons/FormatAlignRight.vue';
import HtmlIcon from 'vue-material-design-icons/CodeTags.vue';
import FormatTextIcon from 'vue-material-design-icons/FormatText.vue';
import TablePlusIcon from 'vue-material-design-icons/TablePlus.vue';
import TableRemoveIcon from 'vue-material-design-icons/TableRemove.vue';
import CodeBracketsIcon from 'vue-material-design-icons/CodeBrackets.vue';
import TableColumnPlusBeforeIcon from 'vue-material-design-icons/TableColumnPlusBefore.vue';
import TableColumnPlusAfterIcon from 'vue-material-design-icons/TableColumnPlusAfter.vue';
import TableColumnRemoveIcon from 'vue-material-design-icons/TableColumnRemove.vue';
import TableColumnIcon from 'vue-material-design-icons/TableColumn.vue';
import TableRowIcon from 'vue-material-design-icons/TableRow.vue';
import TableRowRemoveIcon from 'vue-material-design-icons/TableRowRemove.vue';
import TableRowPlusBeforeIcon from 'vue-material-design-icons/TableRowPlusBefore.vue';
import TableRowPlusAfterIcon from 'vue-material-design-icons/TableRowPlusAfter.vue';
import FormatPaintIcon from 'vue-material-design-icons/FormatPaint.vue'
import BorderColorIcon from 'vue-material-design-icons/BorderColor.vue';

const props = defineProps({
  isCode: {
    type: Boolean,
    default: false,
  }
});

// Объект редактора
const editor = inject('editor')

// Событие открытия попапа для ссылки , обновления флага isCode
const emit = defineEmits(['openLinkPopup', 'updateCode']);

// Вычисляемый цвет по умолчанию в зависимости от темы
const defaultColor = ref('#000000');

// Преобразования rgb(...) в шестнадцатеричный код
const rgbToHex = (rgb) => {
    const result = rgb.match(/\d+/g);
    if (!result || result.length < 3) {
        return defaultColor.value;
    }
    const r = parseInt(result[0], 10).toString(16).padStart(2, '0');
    const g = parseInt(result[1], 10).toString(16).padStart(2, '0');
    const b = parseInt(result[2], 10).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
}

// Объект с кнопками панели управления, состоящий из: обработчика , флагов активности и видимости
const button = computed(() => {
  return {
    bold: {
      handler: () => editor.value.chain().focus().toggleBold().run(),
      active: editor.value.isActive('bold'),
    },
    italic: {
      handler: () => editor.value.chain().focus().toggleItalic().run(),
      active: editor.value.isActive('italic'),
    },
    underline: {
      handler: () => editor.value.chain().focus().toggleUnderline().run(),
      active: editor.value.isActive('underline'),
    },
    link: {
      handler: () => emit('openLinkPopup'),
      active: editor.value.isActive('link'),
      show: !props.isCode,
    },
    bulletList: {
      handler: () => editor.value.chain().focus().toggleBulletList().run(),
      active: editor.value.isActive('bulletList'),
      show: !props.isCode,
    },
    orderedList: {
      handler: () => editor.value.chain().focus().toggleOrderedList().run(),
      active: editor.value.isActive('orderedList'),
      show: !props.isCode,
    },
    horizontalRule: {
      handler: () => editor.value.chain().focus().setHorizontalRule().run(),
      show: !props.isCode,
    },
    code: {
      handler: () => emit('updateCode', !props.isCode),
      active: props.isCode,
    },
    fontPicker: {
      options: [
        {
            id: 1,
            name: "12px",
        },
        {
            id: 2,
            name: "16px",
        },
        {
            id: 3,
            name: "20px",
        },
        {
            id: 4,
            name: "24px",
        },
        {
            id: 5,
            name: "28px",
        },
      ],
      handler: (idFontSize) => {
          const options = button.value.fontPicker.options;
          const { name } = options.filter(( { id } ) => id == idFontSize)[0] || {};

          editor.value.chain().focus().setFontSize(name || '16px').run();
      },
      active: computed(() => {
          const options = button.value.fontPicker.options;
          const editorFontSize = editor.value.getAttributes('textStyle').fontSize;
          const { id } = options.filter(( { name } ) => name == editorFontSize)[0] || {};

          return id || 2;
      }),
      show: !props.isCode,
    },
    textAlign: {
      options: [
        {
          id: 1,
          name: 'left',
          icon: markRaw(AlignLeftIcon),
          title: 'По левому краю',
        },
        {
          id: 2,
          name: 'center',
          icon: markRaw(AlignCenterIcon),
          title: 'По центру',
        },
        {
          id: 3,
          name: 'right',
          icon: markRaw(AlignRightIcon),
          title: 'По правому краю',
        },
      ],
      handler: (idAlign) => {
        const options = button.value.textAlign.options;
        const { name } = options.filter(({ id }) => id == idAlign)[0] || {};

        editor.value.chain().focus().setTextAlign(name || 'left').run();
      },
      active: computed(() => {
        const options = button.value.textAlign.options;
        const editorTextAlign = editor.value.getAttributes('paragraph').textAlign;
        const { id } = options.filter(({ name }) => name == editorTextAlign)[0] || {};

        return id || 1;
      })
    },
    color: {
      handler: (color) => {
        editor.value.chain().focus().setColor(color).run();
      },
      active: computed(() => {
        const attributes = editor.value.getAttributes('textStyle') || {};

        if (attributes.hasOwnProperty('color') && attributes.color) {
            let color = attributes.color;

            return color.startsWith('rgb(') ? rgbToHex(color) : color;
        }

        return defaultColor.value;
      }),
      show: !props.isCode,
    },
    backgroundTable: {
      handler: (color = 'transparent') => {
        editor.value.chain().focus().setCellAttribute('backgroundColor', color).run();
      },
      active: computed(() => {
        const backgroundColor = 
          editor.value.getAttributes('tableCell').backgroundColor || 
          editor.value.getAttributes('tableHeader').backgroundColor;

        if (backgroundColor && backgroundColor !== 'transparent') {
          return backgroundColor.startsWith('rgb(') ? rgbToHex(backgroundColor) : backgroundColor;
        }

        return defaultColor.value;
      }),
      show: !props.isCode && editor.value.isActive('table'),
    },
    borderColor: {
      handler: (color = 'transparent') => {
        editor.value.chain().focus().setCellAttribute('borderColor', color).run();
      },
      active: computed(() => {
        const borderColor = 
          editor.value.getAttributes('tableCell').borderColor || 
          editor.value.getAttributes('tableHeader').borderColor;

        if (borderColor && borderColor !== 'transparent') {
          return borderColor.startsWith('rgb(') ? rgbToHex(borderColor) : borderColor;
        }

        return defaultColor.value;
      }),
      show: !props.isCode && editor.value.isActive('table'),
    },
    tableAdd: {
      handler: () => editor.value.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run(),
      show: !props.isCode,
    },
    tableRemove: {
      handler: () => editor.value.chain().focus().deleteTable().run(),
      show: !props.isCode && editor.value.isActive('table'),
    },
    mergeOrSplit: {
      handler: () => editor.value.chain().focus().mergeOrSplit().run(),
      show: !props.isCode && editor.value.isActive('table'),
    },
    rowPlusBefore: {
      handler: () => editor.value.chain().focus().addRowBefore().run(),
    },
    rowPlusAfter: {
      handler: () => editor.value.chain().focus().addRowAfter().run(),
    },
    rowRemove: {
      handler: () => editor.value.chain().focus().deleteRow().run(),
    },
    columnPlusBefore: {
      handler: () => editor.value.chain().focus().addColumnBefore().run(),
    },
    columnPlusAfter: {
      handler: () => editor.value.chain().focus().addColumnAfter().run(),
    },
    columnRemove: {
      handler: () => editor.value.chain().focus().deleteColumn().run(),
    }
  };
});
</script>

<style>
.toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
  padding: 0 8px;
}

.toolbar .dropdown__content {
  background-color: var(--white);
}

.toolbar .selected-main::after {
  display: none;
}

.toolbar__text-align .select-box-main {
  min-width: 0;
}

.toolbar__text-align .selected-main {
  border-radius: 0;
  padding: 0;
  min-width: 0;
  height: auto;
}

.toolbar__text-align .arrow {
  display: none;
}

.toolbar__font-picker {
  display: flex;
  align-items: center;
  gap: 4px;
  user-select: none;
}

.toolbar__font-picker .material-design-icon {
  display: block;
  width: 24px;
  height: 24px;
}

.toolbar-button-html {
  margin: 0 0 0 auto !important;
}

</style>