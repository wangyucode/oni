- 尽量采用最简单，最直观，扩展性高，可读性好的方式实现功能
- 先思考用户要求，如果用户要求不合理，或者有更好的方案。总结出文档询问用户是否执行。
- 项目采用Taro框架，实现多端（微信小程序、H5）的跨端开发
- UI框架采用NutUI组件库
- 项目用于《缺氧》Oxygen Not Include 游戏的资源汇总计算
- 数据主要有两个接口，/api/v1/yml/calculator/index.yml 和 /api/v1/yml/calculator/images.yml

以下是images.yml数据返回结果的部分数据示例：

```
{
    "success": true,
    "message": "success",
    "payload": {
        "复制人-menu": {
            "file": "codexIconDupes.png"
        },
        "复制人": {
            "file": "dupe.png"
        },
        "建筑": {
            "file": "codexIconBuildings.png"
        },
        "氧气-menu": {
            "file": "icon_category_oxygen.png"
        },
        "发光虫": {
            "file": "lightbug_build_0__ui.png"
        },
        "乙醇": {
            "file": "element_liquid.png",
            "filter": "url(#colorMultiply-00FF6AFF)"
        },
        "水": {
            "file": "element_liquid.png",
            "filter": "url(#colorMultiply-0063FFFF)"
        },
        "花蜜": {
            "file": "element_liquid.png"
        },
        "氧气": {
            "file": "element_gas.png",
            "filter": "url(#colorMultiply-B7FFFFFF)
        },
        "气态盐": {
            "file": "element_gas.png"
        }
    }
}
```

以下是index.yml数据返回结果的部分数据示例：

```
{
    "success": true,
    "message": "success",
    "payload": {
        "title": "分类",
        "items": [
            {
                "name": "复制人",
                "icon": "复制人-menu",
                "menu": {
                    "title": "复制人",
                    "items": [
                        {
                            "name": "复制人",
                            "detail": {
                                "resources": {
                                    "氧气": "-100克/秒",
                                    "二氧化碳": "2克/秒"
                                },
                                "calorie": "-1000千卡",
                                "modes": [
                                    {
                                        "name": "厕所",
                                        "options": [
                                            {
                                                "name": "抽水马桶",
                                                "type": "radio",
                                                "resources": {
                                                    "水": "-5千克/周期",
                                                    "污染水": "11.7千克/周期"
                                                }
                                            },
                                            {
                                                "name": "户外厕所",
                                                "type": "radio",
                                                "resources": {
                                                    "泥土": "-13千克/周期",
                                                    "污染土": "19.7千克/周期"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "name": "建筑",
                "menu": {
                    "title": "建筑",
                    "items": [
                        {
                            "name": "医疗",
                            "menu": {
                                "title": "医疗",
                                "items": [
                                    {
                                        "name": "配药桌",
                                        "detail": {
                                            "heat": "+625复制热/秒",
                                            "modes": [
                                                {
                                                    "name": "所有配方",
                                                    "options": [
                                                        {
                                                            "name": "煤炭➡️维生素咀嚼胶囊",
                                                            "type": "slider",
                                                            "resources": {
                                                                "煤炭": "-1000克/50秒",
                                                                "维生素咀嚼胶囊": "1单位/50秒"
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "name": "实用",
                            "menu": {
                                "title": "实用",
                                "items": [
                                    {
                                        "name": "柴火炉",
                                        "detail": {
                                            "resources": {
                                                "木材": "-25克/秒",
                                                "二氧化碳": "4000毫克/秒"
                                            },
                                            "heat": "+20千复制热/秒"
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "name": "氧气",
                            "icon": "氧气-menu",
                            "menu": {
                                "title": "氧气",
                                "items": [
                                    {
                                        "name": "空气净化器",
                                        "detail": {
                                            "resources": {
                                                "过滤介质": "-133.33克/秒",
                                                "污染氧": "-100克/秒",
                                                "粘土": "143.33克/秒",
                                                "氧气": "90克/秒"
                                            },
                                            "power": "-5瓦",
                                            "heat": "+625复制热/秒"
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    }
}
```
