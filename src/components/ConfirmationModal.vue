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
