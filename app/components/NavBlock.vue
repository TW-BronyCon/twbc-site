<template>
  <NuxtLink :to="to" class="block">
    <div class="description">
      <slot />
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.block {
    width: 20em;
    height: 10em;
    background-color: #d145b3b1;
    border: .1em solid #b9d7fab1;
    border-radius: 5em;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px #34012984;
    transition: all 0.2s ease-out;
    text-decoration: none; /* remove default NuxtLink underline */
}
.block:hover {
    background-color: #e85ad0;
    border: .1em solid #b9d7fa;
    box-shadow: 0 0 20px #39013269;
    transform: scale(1.05);
}
.block:active {
    transform: scale(0.95);
    transition: all 0.1s ease-out;
}

.block .description {
    font-family: 'LXGW WenKai Mono TC', monospace;
    font-size: 3em;
    padding: .25em .5em;
    color: #ffffff;
    text-align: center;
    transition: all 0.25s ease-out;
}

@media screen and (max-width: 800px) {
    .block {
        width: 14em;
        height: 6em;
    }
    .block .description {
        font-size: 1.75em;
    }
}
</style>
