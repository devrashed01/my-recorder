import Settings from "./Settings";

interface Props {
  isRecording: boolean;
  recordType: RecordType;
  startRecording: () => void;
  stopRecording: () => void;
  recordBlob: Blob | null;
  configs: Configs;
  onConfigChange: (configs: Configs) => void;
}

export default function Controls({
  isRecording,
  configs,
  onConfigChange,
  recordType,
  recordBlob,
  startRecording,
  stopRecording,
}: Props) {
  const download = () => {
    if (!recordBlob) {
      console.log("no recordBlob");
      return;
    }
    const url = URL.createObjectURL(recordBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "video.webm";
    a.click();
  };

  return (
    <>
      <div className="flex items-center w-[768px] mx-auto max-w-full justify-between mb-3">
        <h2>{recordType === "screen" ? "Screen" : "Video"} Recorder:</h2>
        {isRecording ? (
          <button onClick={stopRecording}>stop recording</button>
        ) : (
          <button onClick={startRecording}>start recording</button>
        )}
        <br />
        {!isRecording && recordBlob && (
          <button onClick={download}>download</button>
        )}
      </div>
      <Settings configs={configs} onChange={onConfigChange} />
    </>
  );
}
