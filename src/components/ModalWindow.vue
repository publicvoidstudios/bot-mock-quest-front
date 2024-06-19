<template>
  <div class="modal" v-if="visible">
    <div class="modal__container">
      <div class="modal__header">
        <slot name="header"></slot>
        <span class="btn btn-close" @click="toggleModal">&times;</span>
      </div>
      <div class="modal__body">
        <slot name="body"></slot>
      </div>
      <div class="modal__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: true
  }
})

const emit = defineEmits<{
  toggleModal: []
}>()

const toggleModal = () => {
  emit('toggleModal')
}
</script>

<style scoped>

</style>