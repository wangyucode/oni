import { Collapse, Radio, RadioGroup } from "@nutui/nutui-react-taro";
import { ArrowDown } from "@nutui/icons-react-taro";
import { LinkDetail, Mode } from "@/types/data";
import { ModeSelections, normalizeModeSelections, setModeSelection } from "@/components/selection/modeSelection";

export type ModeSelectionEditorProps = {
  detail: LinkDetail;
  modes: Mode[];
  modeSelections: ModeSelections;
  onModeSelectionsChange: (next: ModeSelections) => void;
};

export default function ModeSelectionEditor({
  detail,
  modes,
  modeSelections,
  onModeSelectionsChange,
}: ModeSelectionEditorProps) {
  const normalized = normalizeModeSelections(detail, modeSelections);

  return (
    <Collapse defaultActiveName={modes.map((_, i) => String(i))} expandIcon={<ArrowDown className='text-white' />}>
      {modes.map((mode, modeIndex) => (
        <Collapse.Item title={mode.name} name={String(modeIndex)} key={`${mode.name}-${modeIndex}`}>
            <RadioGroup
              className='flex-wrap'
              direction='horizontal'
              value={normalized[mode.name] || mode.options[0]?.name || ""}
              onChange={(value) => {
                const selected = String(value);
                const next = { ...modeSelections };
                next[mode.name] = setModeSelection(mode, selected);
                onModeSelectionsChange(next);
              }}
            >
              {mode.options.map((option, optionIndex) => (
                <Radio value={option.name} key={`${option.name}-${optionIndex}`}>
                  {option.name}
                </Radio>
              ))}
            </RadioGroup>
        </Collapse.Item>
      ))}
    </Collapse>
  );
}
