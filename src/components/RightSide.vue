<template>
  <div class="bg-primary relative rounded-e-[50px] text-center h-[100%]">
    <img class="image-centered-absolute" :src="imageSrc" alt="">
    <img v-if="additionalImageSrc" class="image-centered-absolute w-[50%]" :src="additionalImageSrc" alt="">
    <div
        class="absolute top-[calc(50%+303px+50px)] left-1/2 -translate-x-1/2 w-[100%]"
    >
      <p class="text-fontPrimary font-bold text-[20px]">{{ header }}</p>
      <p class="text-fontPrimarySubtle text-[16px]">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  imageSrc: {
    type: String,
    required: true
  },
  header: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  additionalImageSrc: {
    type: String,
    default: null
  }
})

</script>