<template>
  <input ref="file" type="file" @change="onchange"/>
</template>

<script>
// Selects a file from the local file system.
export default {
  name: "FilePicker",
  methods: {
    // Raises the change event with the selected file object.
    onchange() {
      this.$emit("change", this.$refs.file.files[0]);
    }
  }
};
</script>
