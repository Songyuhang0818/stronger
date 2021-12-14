<template>
  <div></div>
</template>

<script>
const cancel = {
  mounted() {
    const footer = document.querySelector('.footer-wrapper.footer');
    footer && footer.remove();
    setTimeout(() => {
      cancel.$el && cancel.$el.remove();
    }, 1000);
  }
};
export default cancel;
</script>