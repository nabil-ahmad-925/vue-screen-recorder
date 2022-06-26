<template>
  <div>
    <button
      v-if="!isRecordingStart"
      class="record-button"
      @click="recordScreen"
    >
      {{ startBtnContent || "Start Recording" }}
    </button>
    <button
      v-else
      class="record-button"
      :class="{ 'stop-record-btn': isRecordingStart }"
      @click="stopScreenRecording"
    >
      {{ stopBtnContent || "Stop Recording" }}
    </button>
    <SnackBar :message="message" />
  </div>
</template>

<script>
import SnackBar from "./SnackBar.vue";
export default {
  name: "HelloWorld",
  props: {
    maxRecordingTime: {
      type: Number,
      default: 0,
    },
    startBtnContent: {
      type: String,
      default: "",
    },
    stopBtnContent: {
      type: String,
      default: "",
    },
    isRecordAudio: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    SnackBar,
  },
  data() {
    return {
      screenStream: null,
      voiceStream: null,
      combineStream: null,
      mediaRecorder: null,
      timer: 0,
      isRecordingStart: false,
      message: null,
      recordingInterval: null,
    };
  },
  methods: {
    async recordScreen() {
      try {
        this.resetDataProp();

        this.takeAudioPermission();
        this.screenStream = await navigator.mediaDevices.getDisplayMedia({
          // audio: true,
          video: { mediaSource: "screen" },
        });
        // Combine both video/audio stream with MediaStream object
        if (this.voiceStream) {
          this.combineStream = new MediaStream([
            ...this.screenStream.getVideoTracks(),
            ...this.voiceStream.getAudioTracks(),
          ]);
        } else {
          this.combineStream = new MediaStream([
            ...this.screenStream.getVideoTracks(),
          ]);
        }
        this.createRecorder();
      } catch (error) {
        this.message = error.message;
        this.hideSnackBar();
      }
    },
    async takeAudioPermission() {
      try {
        console.log("dsfsdfdsf", this.isRecordAudio);
        if (this.isRecordAudio) {
          // voiceStream for recording voice with screen recording
          this.voiceStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
          });
        }
      } catch (error) {
        this.message = `Microphone ${error.message}`;
        this.hideSnackBar();
        console.log("errorororo", error.message, error.error?.message);
      }
    },
    createRecorder() {
      console.log("in create recorder", this.combineStream);
      this.isRecordingStart = true;
      // the stream data is stored in this array
      let recordedChunks = [];

      this.mediaRecorder = new MediaRecorder(this.combineStream);

      this.mediaRecorder.ondataavailable = function (e) {
        recordedChunks.push(e.data);
      };
      this.mediaRecorder.onstop = () => {
        //stop screen recording stream
        this.screenStream.getTracks().forEach((track) => track.stop());
        //stop voice recording stream
        this.voiceStream &&
          this.voiceStream.getTracks().forEach((track) => track.stop());
        this.saveFile(recordedChunks);
        console.log("called", this.mediaRecorder);
      };
      this.screenStream.onstop = () => {
        console.log("innnnnnnnnnnnnn");
      };
      this.mediaRecorder.start(); // For every 200ms the stream data will be stored in a separate chunk.
      this.startTimer();
      this.screenStream.getVideoTracks()[0].onended = () => {
        this.stopScreenRecording();
      };
    },
    stopScreenRecording() {
      console.log("cxcccsdcas", this.recordingInterval);
      clearInterval(this.recordingInterval);
      this.mediaRecorder.stop();
    },
    saveFile(recordedChunks) {
      let blobData = new Blob(recordedChunks, { type: "video/mp4" });
      this.isRecordingStart = false;
      this.blobToBase64(blobData);
    },
    blobToBase64(blob) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.$emit("recordedScreen", reader.result);
          this.resetDataProp();
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);
      });
    },
    startTimer() {
      if (this.maxRecordingTime > 0) {
        this.recordingInterval = setInterval(() => {
          if (this.timer === this.maxRecordingTime) {
            clearInterval(this.recordingInterval);
            this.stopScreenRecording();
          }
          ++this.timer;
          console.log("timer", this.timer);
        }, 1 * 1000);
      }
    },
    hideSnackBar() {
      setTimeout(() => {
        this.message = null;
      }, 3000);
    },
    resetDataProp() {
      this.screenStream = null;
      this.voiceStream = null;
      this.combineStream = null;
      this.mediaRecorder = null;
      this.timer = 0;
      this.isRecordingStart = false;
      this.message = null;
      this.recordingInterval = null;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.record-button {
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
  border-radius: 5px;
}
.stop-record-btn {
  background-color: red; /* red */
}
</style>
>
