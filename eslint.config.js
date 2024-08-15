import pluginVue from 'eslint-plugin-vue';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';

export default [
  // add more generic rulesets here, such as:
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  prettierConfig,
  {
    rules: {
      'value-keyword-case': null,
      // override/add rules settings here, such as:
      // 'vue/no-unused-vars': 'error'
    },
  },
];
