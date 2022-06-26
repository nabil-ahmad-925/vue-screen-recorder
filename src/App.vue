<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <VueScreenRecorder
      :maxRecordingTime="10"
      startBtnContent="start"
      @recordedScreen="recordedScreen"
    />
    <video id="output" autoplay controls width="500px" height="500px"></video>
  </div>
</template>

<script>
import VueScreenRecorder from "./components/VueScreenRecorder.vue";

export default {
  name: "App",
  components: {
    VueScreenRecorder,
  },
  methods: {
    recordedScreen(blob) {
      var output = document.getElementById("output");
      // Convert the blob data to a url
      // let url = URL.createObjectURL(blob);
      // Assign the url to the output video tag and anchor
      output.src = blob;
      // anc.href = url;
      console.log("sssss", blob);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
