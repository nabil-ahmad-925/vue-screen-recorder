<template>
  <div>
    <button class="button button1" @click="recordScreen">
      Start Recording
    </button>
    <button class="button button1" @click="stopScreenRecording">
      Stop Recording
    </button>
    <video id="output" autoplay controls width="500px" height="500px"></video>
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
      voiceStream: null,
      combineStream: null,
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
        // Combine both video/audio stream with MediaStream object
        this.combineStream = new MediaStream([
          ...this.screenStream.getVideoTracks(),
          ...this.voiceStream.getAudioTracks(),
        ]);
        this.createRecorder();
      } catch (error) {
        console.log("error", error);
      }
    },
    createRecorder() {
      console.log("in create recorder", this.combineStream);
      // the stream data is stored in this array
      let recordedChunks = [];

      this.mediaRecorder = new MediaRecorder(this.combineStream);

      this.mediaRecorder.ondataavailable = function (e) {
        recordedChunks.push(e.data);
      };
      this.mediaRecorder.onstop = () => {
        this.combineStream.forEach((s) =>
          s.getTracks().forEach((t) => t.stop())
        );

        this.saveFile(recordedChunks);
        console.log("called", this.mediaRecorder);
      };
      this.screenStream.onstop = () => {
        console.log("innnnnnnnnnnnnn");
      };
      this.mediaRecorder.start(); // For every 200ms the stream data will be stored in a separate chunk.
    },
    stopScreenRecording() {
      this.mediaRecorder.stop();
    },
    saveFile(recordedChunks) {
      // const blob = new Blob(recordedChunks, { type: "video/mp4" });
      this.mediaRecorder = null;
      // console.log("blob:::", blob);
      // let filename = window.prompt("Enter file name"),
      //   downloadLink = document.createElement("a");
      // downloadLink.href = URL.createObjectURL(blob);
      // downloadLink.download = `${filename}.webm`;

      // document.body.appendChild(downloadLink);
      // downloadLink.click();
      // URL.revokeObjectURL(blob); // clear from memory
      // document.body.removeChild(downloadLink);
      /* Convert the recorded audio to 
               blob type mp4 media */
      var output = document.getElementById("output");
      let blobData = new Blob(recordedChunks, { type: "video/mp4" });

      // Convert the blob data to a url
      let url = URL.createObjectURL(blobData);

      // Assign the url to the output video tag and anchor
      output.src = url;
      // anc.href = url;
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
