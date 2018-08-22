<template>
  <div id="app">
    <FilePicker @change="onchange"/>
  </div>
</template>

<script>
import FilePicker from "@/components/FilePicker.vue";

export default {
  components: { FilePicker },
  methods: {
    onchange(file) {
      this.$store.dispatch("loadFile", { file });
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
