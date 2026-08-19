<template>
    <!-- This kinda makes a new div element in index.html -->
    <Teleport to="body">
        <Transition name="fade">
            <div
                v-if="isOpen"
                class="modal-overlay"
                @click.self="$emit('close')"
            >
                <div
                    ref="modalRef"
                    class="modal-content"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                    tabindex="-1"
                >

                    <header class="modal-header">
                        <h3 id="modal-title">
                            <!-- Slots value is provided by the parent -->
                            <slot name="header">Default Title</slot>
                        </h3>
                    </header>
                    <main class="modal-body">
                        <slot>Default body</slot>
                    </main>
                    <button
                        class="confirm-btn"
                        aria-label="Selete modal"
                        @click="$emit('select')"
                    >
                        yes
                    </button>
                    <button
                        class="close-btn"
                        aria-label="close modal"
                        @click="$emit('close')"
                    >
                        no
                    </button>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
 defineProps({
     isOpen: { type: Boolean, required: true }
 })

 defineEmits(['select', 'close'])

</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.65);
}

 .modal-content {
     width: min(90vw, 30rem);
     padding: 1.5rem;
     color: #fff;
     background: #10233d;
     border: 1px solid #4a90c2;
     border-radius: 0.5rem;
     box-shadow: 0 0 2rem rgba(0, 0, 0, 0.6);
 }

 .modal-header {
     margin-bottom: 1rem;
 }

 .confirm-btn,
 .close-btn {
     margin-right: 0.75rem;
     padding: 0.5rem 1rem;
     cursor: pointer;
 }

 .fade-enter-active,
 .fade-leave-active {
     transition: opacity 0.2s ease;
 }

 .fade-enter-from,
 .fade-leave-to {
     opacity: 0;
 }
</style>
