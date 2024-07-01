<template>
    <button @click="$emit('click')" id="VKIDSDKAuthButton" class="auth__vk-login VkIdWebSdk__button VkIdWebSdk__button_reset">
        <div class="VkIdWebSdk__button_container">
            <div class="VkIdWebSdk__button_icon">
                 <img src="../assets/icons/VKIcon.svg"/>
            </div>
            <div class="VkIdWebSdk__button_text">
                Войти через VK ID
            </div>
        </div>
    </button>
</template>

<script setup>
</script>

<style scoped>
.VkIdWebSdk__button_reset {
    border: none;
    margin: 0;
    padding: 0;
    width: auto;
    overflow: visible;
    background: transparent;
    color: inherit;
    font: inherit;
    line-height: normal;
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;
    -webkit-appearance: none;
}

.VkIdWebSdk__button {
    background: var(--VKColor);
    cursor: pointer;
    transition: all .1s ease-out;
}

.VkIdWebSdk__button:hover {
    opacity: 0.8;
}

.VkIdWebSdk__button:active {
    opacity: .7;
    transform: scale(.97);
}

.VkIdWebSdk__button {
    border-radius: 8px;
    width: 100%;
    min-height: 44px;
}

.VkIdWebSdk__button_container {
    display: flex;
    align-items: center;
    padding: 8px 10px;
}

.VkIdWebSdk__button_icon {
    margin-top: 4px;
}

.VkIdWebSdk__button_text {
    display: flex;
    font-family: -apple-system, system-ui, "Helvetica Neue", Roboto, sans-serif;
    flex: 1;
    justify-content: center;
    color: var(--white);
}

.auth__vk-login {
    margin-top: 20px;
}
</style>