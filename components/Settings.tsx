interface Props {
  configs: Configs;
  onChange: (configs: Configs) => void;
}

export default function Settings({ configs, onChange }: Props) {
  return (
    <div className="flex gap-5">
      <label>
        <input
          type="checkbox"
          checked={configs.audio}
          onChange={(e) =>
            onChange({
              ...configs,
              audio: e.target.checked,
            })
          }
        />
        Audio
      </label>
      <label>
        <input
          type="checkbox"
          checked={configs.video}
          onChange={(e) =>
            onChange({
              ...configs,
              video: e.target.checked,
            })
          }
        />
        Video
      </label>
    </div>
  );
}
