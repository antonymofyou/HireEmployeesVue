<!--
    <long-input @inputText='меняем значение переменной, отвечающей value инпута, например, 
    setInput(value) - вызываем функцию, в которую передаём value инпута переданное через событие'></long-input>
-->
<template>
    <textarea @input="sendInput" v-model="input" placeholder="Ответ..." class="input"></textarea>
</template>

<script>
export default {
    name: 'long-input',
    props: ['text'],
    data() {
        return {
            input: '',
        }
    },
    methods: {
        sendInput() {
            this.$emit('inputText', this.input);
        }
    },
    mounted() {
        this.input = this.text;
    }
}
</script>

<style scoped>
.input {
    padding: 20px;
    border-radius: 16px;
    border: 1px solid var(--transparent-blue);
    background-color: var(--white);
    font-size: 16px;
    font-weight: 400;
    min-height: 107px;
    resize: vertical;
    width: 100%;
}
.input::placeholder {
    font-size: 16px;
    font-weight: 400;
}

.input:focus {
    outline: 2px solid var(--transparent-blue);
}
</style>