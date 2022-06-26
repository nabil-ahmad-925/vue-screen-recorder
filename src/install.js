import screenRecorder from "./components/VueScreenRecorder.vue";

const VueScreenRecorder = {
  install(Vue, options) {
    // Let's register our component globally
    Vue.component("vue-screen-recorder", screenRecorder);
  },
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(VueScreenRecorder);
}

export default VueScreenRecorder;
