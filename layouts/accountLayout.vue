<script setup lang="ts">

</script>

<template>
  <div class="mb-10">
    <app-top-nav/>
    <div class="mt-20 px-4 sm:p-0">
      <slot></slot>
    </div>
  </div>
</template>

<style>
.sentence-case::first-letter {
  text-transform: uppercase;
}

.bot-chat-interface {
  min-height: calc(100vh - 13rem);
}

.chat-interface {
  min-height: calc(100vh - 8rem);
}


@media screen and (max-width: 768px) {
  .grecaptcha-badge {
    visibility: hidden;
  }
}
</style>
