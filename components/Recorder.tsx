"use client";

import { useEffect, useState } from "react";
import Controls from "./Controlls";

export default function Recorder() {
  const [recording, setRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordBlob, setRecordBlob] = useState<Blob | null>(null);
  const [configs, setConfigs] = useState<{
    audio: boolean;
    video: boolean;
  }>({
    audio: true,
    video: true,
  });
  const [recordType, setRecordType] = useState<RecordType>("video");

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ video: configs.video, audio: configs.audio })
      .then((stream) => {
        setStream(stream);
        const mediaRecorder = new MediaRecorder(stream);
        console.log("recording started");
        mediaRecorder.start();
        setMediaRecorder(mediaRecorder);
        setRecording(true);
        const video = document.querySelector("video");
        if (!video) {
          console.log("video not found");
          return;
        }

        console.log("stream", stream);
        video.srcObject = stream;
        video.play();
      });
  };

  const stopRecording = () => {
    stream?.getTracks().forEach((track) => track.stop());
    mediaRecorder?.stop();
  };

  useEffect(() => {
    if (mediaRecorder) {
      console.log("mediaRecorder", mediaRecorder);
      let chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        console.log("data available", e);
        chunks.push(e.data);
      };
      mediaRecorder.onstop = (e) => {
        const video = document.querySelector("video");
        if (!video) {
          console.log("video not found");
          return;
        }
        console.log("recording stopped", e);
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordBlob(blob);
        const url = URL.createObjectURL(blob);

        video.srcObject = null;
        video.src = url;
        setRecording(false);
      };
    }
  }, [mediaRecorder]);

  const startDisplayMedia = async () => {
    console.log("req for screen rec");
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    console.log(stream, "stream=== screen");
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    setMediaRecorder(mediaRecorder);
    setRecording(true);
    const video = document.querySelector("video");
    if (!video) {
      console.log("video not found");
      return;
    }
    video.srcObject = stream;
    video.play();
  };

  return (
    <div>
      <select
        className="text-black"
        value={recordType}
        onChange={(e) => setRecordType(e.target.value as RecordType)}
      >
        <option value="video">Video</option>
        <option value="screen">Screen</option>
      </select>
      <Controls
        configs={configs}
        onConfigChange={setConfigs}
        isRecording={recording}
        recordType={recordType}
        recordBlob={recordBlob}
        startRecording={
          recordType === "screen" ? startDisplayMedia : startRecording
        }
        stopRecording={stopRecording}
      />
      <video
        style={{
          display: recording || recordBlob ? "block" : "none",
        }}
        controls
      ></video>
    </div>
  );
}
