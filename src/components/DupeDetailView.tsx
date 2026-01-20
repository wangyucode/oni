import { useEffect, useMemo, useState } from "react";
import { Image, Text, View } from "@tarojs/components";
import { Collapse, Grid, InputNumber, Radio, RadioGroup, Range } from "@nutui/nutui-react-taro";

import "./DupeDetailView.scss";
import { Detail, DupeDetail } from "./data";
import ResourceGrid, { ResourceItem } from "./ResourceGrid";
import { useUnit } from "./UnitContext";
import Icon from "./icons";
import FilteredImage from "./FilteredImage";

export type DupeDetailViewProps = {
  detail: Detail;
};

function isDupeDetail(detail: Detail["detail"]): detail is DupeDetail {
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

function buildDefaultModeSelections(dupe: DupeDetail): Array<Map<string, number>> {
  return dupe.modes.map((mode) => {
    const initial = new Map<string, number>();
    mode.options.forEach((option, index) => {
      initial.set(option.name, index === 0 ? 100 : 0);
    });
    return initial;
  });
}

export default function DupeDetailView({ detail }: DupeDetailViewProps) {
  if (!isDupeDetail(detail.detail)) return null;
  const dupe = detail.detail;
  const { timeUnit } = useUnit();

  const [count, setCount] = useState<number>(1);
  const [modeSelections, setModeSelections] = useState<Array<Map<string, number>>>(() =>
    buildDefaultModeSelections(dupe)
  );

  useEffect(() => {
    setCount(1);
    setModeSelections(buildDefaultModeSelections(dupe));
  }, [detail.name]);

  const convertCalories = (calories: number): { convertedValue: number; unit: string } => {
    if (timeUnit === '秒') {
      return { convertedValue: calories / 600 * 1000, unit: "卡路里/秒" };
    }
    return { convertedValue: calories, unit: "千卡/周期" };
  };

  const { resources, totalFactor, totalPower, totalCalories } = useMemo(() => {
    const nextResources: Record<string, number> = {};
    let nextTotalFactor = 0;

    dupe.modes.forEach((mode, modeIndex) => {
      const optionSelectionMap = modeSelections[modeIndex] || new Map<string, number>();

      mode.options.forEach((option) => {
        const percentage = optionSelectionMap.get(option.name) || 0;
        const factor = percentage / 100;
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
  }, [count, dupe.calorie, dupe.modes, dupe.power, dupe.resources, modeSelections]);

  const resourceItems = useMemo<ResourceItem[]>(() => {
    return Object.entries(resources).map(([name, value]) => ({
      name,
      value,
      count: 1
    }));
  }, [resources]);

  const isDupe = detail.name.includes("复制人");
  const isBionic = detail.name.includes("仿生人");
  const { convertedValue: convertedCalories, unit: caloriesUnit } = convertCalories(totalCalories);

  return (
    <View className="dupe-detail-view">
      <View className="dupe-detail-view__header">
        {detail.icon ? (
          <FilteredImage src={detail.icon} iconFilter={detail.iconFilter} className="dupe-detail-view__icon" mode="aspectFit" />
        ) : null}
        <Text className="dupe-detail-view__name">{detail.name}</Text>
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
                  {mode.options.every((o) => o.type === "switch") ? (
                    <RadioGroup
                      direction="horizontal"
                      value={
                        mode.options.find((option) => (modeSelections[modeIndex]?.get(option.name) || 0) > 0)?.name ||
                        mode.options[0]?.name
                      }
                      onChange={(value) => {
                        const selected = String(value);
                        setModeSelections((prev) => {
                          const next = prev.slice();
                          const nextMap = new Map<string, number>();
                          mode.options.forEach((option) => {
                            nextMap.set(option.name, option.name === selected ? 100 : 0);
                          });
                          next[modeIndex] = nextMap;
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
                  ) : (
                    mode.options.map((option, optionIndex) => (
                      <View className="dupe-detail-view__option" key={`${option.name}-${optionIndex}`}>
                        <Text className="dupe-detail-view__optionName">{option.name}</Text>
                        <View className="dupe-detail-view__sliderRow">
                          <Range
                            className="dupe-detail-view__slider"
                            value={[modeSelections[modeIndex]?.get(option.name) || 0]}
                            minDescription={null}
                            maxDescription={null}
                            max={100}
                            min={0}
                            step={1}
                            onChange={(val) => {
                              const nextValue = Array.isArray(val) ? val[0] : val;
                              setModeSelections((prev) => {
                                const next = prev.slice();
                                const nextMap = new Map(next[modeIndex] || []);
                                nextMap.set(option.name, Number(nextValue) || 0);
                                next[modeIndex] = nextMap;
                                return next;
                              });
                            }}
                            currentDescription={(val) => `${val}%`}
                          />
                          <InputNumber
                            className="dupe-detail-view__inputNumber"
                            value={modeSelections[modeIndex]?.get(option.name) || 0}
                            min={0}
                            max={100}
                            onChange={(value) => {
                              const nextValue = Math.max(0, Math.min(100, Number(value) || 0));
                              setModeSelections((prev) => {
                                const next = prev.slice();
                                const nextMap = new Map(next[modeIndex] || []);
                                nextMap.set(option.name, nextValue);
                                next[modeIndex] = nextMap;
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
