<template>
    <div :class="{ 'active': isOpen }" class="dropdown">
        <button 
            @pointerup="toggle"
            @keydown.enter.space="toggle"
            :aria-expanded="isOpen"
            class="dropdown__trigger"
        >
            <slot name="trigger"></slot>
        </button>
        <div class="dropdown__content">
            <slot name="content"></slot>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
      return {
        isOpen: false,
      };
    },
    methods: {
      toggle() {
        this.isOpen = !this.isOpen;
      },
    }
};
</script>
  
<style scoped>
.dropdown {
    position: relative;
}

.dropdown__content {
    position: absolute;
    transition-property: opacity, visibility;
    transition-duration: 0.2s;
    visibility: hidden;
    opacity: 0;
}

.dropdown.active .dropdown__content {
    visibility: visible;
    opacity: 1;
}

.dropdown__trigger {
    background-color: transparent;
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    cursor: pointer;
}
</style>