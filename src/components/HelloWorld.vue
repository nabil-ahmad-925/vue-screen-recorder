<template>
  <div>
    <button class="button button1" @click="recordScreen">
      Start Recording
    </button>
    <button class="button button1" @click="stopScreenRecording">
      Stop Recording
    </button>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      screenStream: null,
      mediaRecorder: null,
    };
  },
  methods: {
    async recordScreen() {
      try {
        // voiceStream for recording voice with screen recording
        this.voiceStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        this.screenStream = await navigator.mediaDevices.getDisplayMedia({
          audio: true,
          video: { mediaSource: "screen" },
        });
        this.createRecorder();
      } catch (error) {
        console.log("error", error);
      }
    },
    createRecorder() {
      // the stream data is stored in this array
      let recordedChunks = [];

      this.mediaRecorder = new MediaRecorder(this.screenStream);

      this.mediaRecorder.ondataavailable = function (e) {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };
      this.mediaRecorder.onstop = () => {
        this.saveFile(recordedChunks);
        console.log("called", this.mediaRecorder);
        this.mediaRecorder.getTracks().forEach((track) => track.stop());
        recordedChunks = [];
      };
      this.mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
    },
    stopScreenRecording() {
      this.mediaRecorder.stop();
    },
    saveFile(recordedChunks) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      // this.mediaRecorder = null;
      console.log("blob:::", blob);
      // let filename = window.prompt("Enter file name"),
      //   downloadLink = document.createElement("a");
      // downloadLink.href = URL.createObjectURL(blob);
      // downloadLink.download = `${filename}.webm`;

      // document.body.appendChild(downloadLink);
      // downloadLink.click();
      // URL.revokeObjectURL(blob); // clear from memory
      // document.body.removeChild(downloadLink);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button {
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
</style>
>
