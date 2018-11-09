<template>
  <div id="app">
    <FilePicker @change="onchange"/>
  </div>
</template>

<script>
import FilePicker from "@/components/FilePicker.vue";
import FileReader from "@/ogg/file-reader";
import OggReader from '@/ogg/ogg-reader';

export default {
  components: { FilePicker },
  methods: {
    onchange(file) {
      FileReader.readFile(file).then(buffer => {
        window.buffer = buffer;
        window.reader = new OggReader(buffer);
      })
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
