import { Text, View } from "@tarojs/components";
import { Collapse, InputNumber, Radio, RadioGroup, Range, Switch } from "@nutui/nutui-react-taro";

import Icon from "../icons";
import { LinkDetail, Mode } from "../data";
import {
  ModeSelections,
  inferModeSelectionType,
  normalizeModeSelections,
  setModeSelectionRadio,
  setModeSelectionSliderValue,
  toggleModeSelectionCheckbox,
} from "../selection/modeSelection";

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

  if (!modes?.length) {
    return (
      <View className="selection-detail-view__empty">
        <Text>无</Text>
      </View>
    );
  }

  return (
    <Collapse defaultActiveName={modes.map((_, i) => String(i))} expandIcon={<Icon width={12} height={16} name="rightArrow" />} rotate={90}>
      {modes.map((mode, modeIndex) => (
        <Collapse.Item title={mode.name} name={String(modeIndex)} key={`${mode.name}-${modeIndex}`}>
          <View className="selection-detail-view__mode">
            {inferModeSelectionType(mode) === "radio" ? (
              <RadioGroup
                direction="horizontal"
                value={(normalized[modeIndex]?.type === "radio" ? normalized[modeIndex].selected : mode.options[0]?.name) || ""}
                onChange={(value) => {
                  const selected = String(value);
                  const next = modeSelections.slice();
                  next[modeIndex] = setModeSelectionRadio(mode, selected);
                  onModeSelectionsChange(next);
                }}
              >
                {mode.options.map((option, optionIndex) => (
                  <Radio value={option.name} key={`${option.name}-${optionIndex}`}>
                    {option.name}
                  </Radio>
                ))}
              </RadioGroup>
            ) : inferModeSelectionType(mode) === "checkbox" ? (
              mode.options.map((option, optionIndex) => (
                <View className="selection-detail-view__option" key={`${option.name}-${optionIndex}`}>
                  <Text className="selection-detail-view__optionName">{option.name}</Text>
                  <Switch
                    checked={normalized[modeIndex]?.type === "checkbox" ? Boolean(normalized[modeIndex].checked[option.name]) : false}
                    onChange={(checked) => {
                      const next = modeSelections.slice();
                      next[modeIndex] = toggleModeSelectionCheckbox(mode, option.name, Boolean(checked), next[modeIndex]);
                      onModeSelectionsChange(next);
                    }}
                  />
                </View>
              ))
            ) : (
              mode.options.map((option, optionIndex) => (
                <View className="selection-detail-view__option" key={`${option.name}-${optionIndex}`}>
                  <Text className="selection-detail-view__optionName">{option.name}</Text>
                  <View className="selection-detail-view__sliderRow">
                    <Range
                      className="selection-detail-view__slider"
                      value={[normalized[modeIndex]?.type === "slider" ? normalized[modeIndex].values[option.name] || 0 : 0]}
                      minDescription={null}
                      maxDescription={null}
                      max={100}
                      min={0}
                      step={1}
                      onChange={(val) => {
                        const nextValue = Array.isArray(val) ? val[0] : val;
                        const next = modeSelections.slice();
                        next[modeIndex] = setModeSelectionSliderValue(mode, option.name, Number(nextValue) || 0, next[modeIndex]);
                        onModeSelectionsChange(next);
                      }}
                      currentDescription={(val) => `${val}%`}
                    />
                    <InputNumber
                      className="selection-detail-view__inputNumber"
                      value={normalized[modeIndex]?.type === "slider" ? normalized[modeIndex].values[option.name] || 0 : 0}
                      min={0}
                      max={100}
                      onChange={(value) => {
                        const nextValue = Math.max(0, Math.min(100, Number(value) || 0));
                        const next = modeSelections.slice();
                        next[modeIndex] = setModeSelectionSliderValue(mode, option.name, nextValue, next[modeIndex]);
                        onModeSelectionsChange(next);
                      }}
                    />
                  </View>
                </View>
              ))
            )}
          </View>
        </Collapse.Item>
      ))}
    </Collapse>
  );
}
