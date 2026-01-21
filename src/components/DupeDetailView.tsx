import { useEffect, useMemo, useState } from "react";
import { Text, View } from "@tarojs/components";
import { Button, Collapse, InputNumber, Radio, RadioGroup, Range, Switch } from "@nutui/nutui-react-taro";

import "./DupeDetailView.scss";
import { DupeDetail, Link, LinkDetail } from "./data";
import ResourceGrid, { ResourceItem } from "./ResourceGrid";
import { useUnit } from "./UnitContext";
import Icon from "./icons";
import FilteredImage from "./FilteredImage";
import { useSelectionsActions } from "./SelectionsContext";
import {
  ModeSelections,
  buildDefaultModeSelection,
  buildDefaultModeSelections,
  inferModeSelectionType,
  normalizeModeSelections,
  optionFactor,
  setModeSelectionRadio,
  setModeSelectionSliderValue,
  toggleModeSelectionCheckbox,
} from "./selection/modeSelection";

export type DupeDetailViewProps = {
  link: Link;
  categoryPath?: string[];
  onConfirmed?: () => void;
};

function isDupeDetail(detail: LinkDetail | undefined): detail is DupeDetail {
  return (
    typeof detail === "object" &&
    detail !== null &&
    "resources" in detail &&
    "modes" in detail &&
    !("heat" in detail) &&
    !("life" in detail)
  );
}

function parseNumber(raw: string | undefined): number {
  if (!raw) return 0;
  const match = raw.match(/-?\d+(?:\.\d+)?/);
  if (!match) return 0;
  const value = Number(match[0]);
  return Number.isFinite(value) ? value : 0;
}

export default function DupeDetailView({ link, categoryPath = [], onConfirmed }: DupeDetailViewProps) {
  if (!isDupeDetail(link.detail)) return null;
  const dupe = link.detail;
  const { timeUnit } = useUnit();
  const { upsert } = useSelectionsActions();

  const [count, setCount] = useState<number>(1);
  const [modeSelections, setModeSelections] = useState<ModeSelections>(() => buildDefaultModeSelections(dupe));

  useEffect(() => {
    setCount(1);
    setModeSelections(buildDefaultModeSelections(dupe));
  }, [link.name]);

  const normalizedModeSelections = useMemo(() => normalizeModeSelections(dupe, modeSelections), [dupe, modeSelections]);

  const convertCalories = (calories: number): { convertedValue: number; unit: string } => {
    if (timeUnit === '秒') {
      return { convertedValue: calories / 600 * 1000, unit: "卡路里/秒" };
    }
    return { convertedValue: calories, unit: "千卡/周期" };
  };

  const { resources, totalPower, totalCalories } = useMemo(() => {
    const nextResources: Record<string, number> = {};
    let nextTotalFactor = 0;

    dupe.modes.forEach((mode, modeIndex) => {
      const modeSelection = normalizedModeSelections[modeIndex] || buildDefaultModeSelection(mode);

      mode.options.forEach((option) => {
        const factor = optionFactor(option, modeSelection);
        nextTotalFactor += factor;

        Object.entries(option.resources || {}).forEach(([name, rawValue]) => {
          const value = parseNumber(rawValue);
          const resourceValue = count * value * factor;
          if (!resourceValue) return;
          nextResources[name] = (nextResources[name] || 0) + resourceValue;
        });
      });
    });

    Object.entries(dupe.resources || {}).forEach(([name, rawValue]) => {
      const value = parseNumber(rawValue);
      const resourceValue = count * value * nextTotalFactor;
      if (!resourceValue) return;
      nextResources[name] = (nextResources[name] || 0) + resourceValue;
    });

    const nextTotalPower = parseNumber(dupe.power) * count * nextTotalFactor;
    const nextTotalCalories = parseNumber(dupe.calorie) * count * nextTotalFactor;

    return {
      resources: nextResources,
      totalFactor: nextTotalFactor,
      totalPower: nextTotalPower,
      totalCalories: nextTotalCalories,
    };
  }, [count, dupe.calorie, dupe.modes, dupe.power, dupe.resources, normalizedModeSelections]);

  const resourceItems = useMemo<ResourceItem[]>(() => {
    return Object.entries(resources).map(([name, value]) => ({
      name,
      value,
      count: 1
    }));
  }, [resources]);

  const isDupe = link.name.includes("复制人");
  const isBionic = link.name.includes("仿生人");
  const { convertedValue: convertedCalories, unit: caloriesUnit } = convertCalories(totalCalories);

  function handleAdd(): void {
    upsert({
      item: { name: link.name, icon: link.icon, iconFilter: link.iconFilter },
      detail: dupe,
      count,
      modeSelections,
      categoryPath,
    });
    onConfirmed?.();
  }

  return (
    <View className="dupe-detail-view">
      <View className="dupe-detail-view__header">
        {link.icon ? (
          <FilteredImage src={link.icon} iconFilter={link.iconFilter} className="dupe-detail-view__icon" mode="aspectFit" />
        ) : null}
        <Text className="dupe-detail-view__name">{link.name}</Text>
        <View style={{ flex: 1 }} />
        <View className="dupe-detail-view__count">
          <InputNumber
            value={count}
            min={0}
            onChange={(value) => {
              const next = Number(value);
              setCount(Number.isFinite(next) ? next : 0);
            }}
          />
          <Button onClick={handleAdd} type="primary">添加</Button>
        </View>
      </View>

      {isBionic && dupe.power ? (
        <View className="dupe-detail-view__section">
          <Text className="dupe-detail-view__sectionTitle">电力</Text>
          <View className="dupe-detail-view__kvList">
            <View className="dupe-detail-view__kv">
              <Text className="dupe-detail-view__k">功率</Text>
              <Text className="dupe-detail-view__v">{`${totalPower < 0 ? Math.floor(totalPower) : "+" + Math.floor(totalPower)} W`}</Text>
            </View>
          </View>
        </View>
      ) : null}

      {isDupe && dupe.calorie ? (
        <View className="dupe-detail-view__section">
          <Text className="dupe-detail-view__sectionTitle">卡路里</Text>
          <View className="dupe-detail-view__kvList">
            <View className="dupe-detail-view__kv">
              <Text className="dupe-detail-view__k">合计</Text>
              <Text className="dupe-detail-view__v">{`${convertedCalories < 0 ? Math.floor(convertedCalories) : "+" + Math.floor(convertedCalories)} ${caloriesUnit}`}</Text>
            </View>
          </View>
        </View>
      ) : null}

      <View className="dupe-detail-view__section">
        <Text className="dupe-detail-view__sectionTitle">模式</Text>
        {dupe.modes?.length ? (
          <Collapse 
          defaultActiveName={dupe.modes.map((_, i) => String(i))}
          expandIcon={<Icon width={12} height={16} name='rightArrow' />}
                    rotate={90}>
            {dupe.modes.map((mode, modeIndex) => (
              <Collapse.Item title={mode.name} name={String(modeIndex)} key={`${mode.name}-${modeIndex}`}>
                <View className="dupe-detail-view__mode">
                  {inferModeSelectionType(mode) === "radio" ? (
                    <RadioGroup
                      direction="horizontal"
                      value={
                        (normalizedModeSelections[modeIndex]?.type === "radio"
                          ? normalizedModeSelections[modeIndex].selected
                          : mode.options[0]?.name) || ""
                      }
                      onChange={(value) => {
                        const selected = String(value);
                        setModeSelections((prev) => {
                          const next = prev.slice();
                          next[modeIndex] = setModeSelectionRadio(mode, selected);
                          return next;
                        });
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
                      <View className="dupe-detail-view__option" key={`${option.name}-${optionIndex}`}>
                        <Text className="dupe-detail-view__optionName">{option.name}</Text>
                        <Switch
                          checked={
                            normalizedModeSelections[modeIndex]?.type === "checkbox"
                              ? Boolean(normalizedModeSelections[modeIndex].checked[option.name])
                              : false
                          }
                          onChange={(checked) => {
                            setModeSelections((prev) => {
                              const next = prev.slice();
                              next[modeIndex] = toggleModeSelectionCheckbox(mode, option.name, Boolean(checked), prev[modeIndex]);
                              return next;
                            });
                          }}
                        />
                      </View>
                    ))
                  ) : (
                    mode.options.map((option, optionIndex) => (
                      <View className="dupe-detail-view__option" key={`${option.name}-${optionIndex}`}>
                        <Text className="dupe-detail-view__optionName">{option.name}</Text>
                        <View className="dupe-detail-view__sliderRow">
                          <Range
                            className="dupe-detail-view__slider"
                            value={[
                              normalizedModeSelections[modeIndex]?.type === "slider"
                                ? normalizedModeSelections[modeIndex].values[option.name] || 0
                                : 0,
                            ]}
                            minDescription={null}
                            maxDescription={null}
                            max={100}
                            min={0}
                            step={1}
                            onChange={(val) => {
                              const nextValue = Array.isArray(val) ? val[0] : val;
                              setModeSelections((prev) => {
                                const next = prev.slice();
                                next[modeIndex] = setModeSelectionSliderValue(mode, option.name, Number(nextValue) || 0, prev[modeIndex]);
                                return next;
                              });
                            }}
                            currentDescription={(val) => `${val}%`}
                          />
                          <InputNumber
                            className="dupe-detail-view__inputNumber"
                            value={
                              normalizedModeSelections[modeIndex]?.type === "slider"
                                ? normalizedModeSelections[modeIndex].values[option.name] || 0
                                : 0
                            }
                            min={0}
                            max={100}
                            onChange={(value) => {
                              const nextValue = Math.max(0, Math.min(100, Number(value) || 0));
                              setModeSelections((prev) => {
                                const next = prev.slice();
                                next[modeIndex] = setModeSelectionSliderValue(mode, option.name, nextValue, prev[modeIndex]);
                                return next;
                              });
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
        ) : (
          <View className="dupe-detail-view__empty">
            <Text>无</Text>
          </View>
        )}
      </View>

      <View className="dupe-detail-view__section">
        <Text className="dupe-detail-view__sectionTitle">资源</Text>
        <ResourceGrid items={resourceItems} />
      </View>
    </View>
  );
}
