import { request } from '@umijs/max';
import type { AnalysisData } from './data';

const fakedata = {
    "data": {
        "visitData": [
            {
                "x": "2025-11-03",
                "y": 7
            },
            {
                "x": "2025-11-04",
                "y": 5
            },
            {
                "x": "2025-11-05",
                "y": 4
            },
            {
                "x": "2025-11-06",
                "y": 2
            },
            {
                "x": "2025-11-07",
                "y": 4
            },
            {
                "x": "2025-11-08",
                "y": 7
            },
            {
                "x": "2025-11-09",
                "y": 5
            },
            {
                "x": "2025-11-10",
                "y": 6
            },
            {
                "x": "2025-11-11",
                "y": 5
            },
            {
                "x": "2025-11-12",
                "y": 9
            },
            {
                "x": "2025-11-13",
                "y": 6
            },
            {
                "x": "2025-11-14",
                "y": 3
            },
            {
                "x": "2025-11-15",
                "y": 1
            },
            {
                "x": "2025-11-16",
                "y": 5
            },
            {
                "x": "2025-11-17",
                "y": 3
            },
            {
                "x": "2025-11-18",
                "y": 6
            },
            {
                "x": "2025-11-19",
                "y": 5
            }
        ],
        "visitData2": [
            {
                "x": "2025-11-03",
                "y": 1
            },
            {
                "x": "2025-11-04",
                "y": 6
            },
            {
                "x": "2025-11-05",
                "y": 4
            },
            {
                "x": "2025-11-06",
                "y": 8
            },
            {
                "x": "2025-11-07",
                "y": 3
            },
            {
                "x": "2025-11-08",
                "y": 7
            },
            {
                "x": "2025-11-09",
                "y": 2
            }
        ],
        "salesData": [
            {
                "x": "1月",
                "y": 557
            },
            {
                "x": "2月",
                "y": 1173
            },
            {
                "x": "3月",
                "y": 217
            },
            {
                "x": "4月",
                "y": 983
            },
            {
                "x": "5月",
                "y": 732
            },
            {
                "x": "6月",
                "y": 1053
            },
            {
                "x": "7月",
                "y": 347
            },
            {
                "x": "8月",
                "y": 972
            },
            {
                "x": "9月",
                "y": 476
            },
            {
                "x": "10月",
                "y": 1177
            },
            {
                "x": "11月",
                "y": 1079
            },
            {
                "x": "12月",
                "y": 1167
            }
        ],
        "searchData": [
            {
                "index": 1,
                "keyword": "搜索关键词-0",
                "count": 957,
                "range": 24,
                "status": 0
            },
            {
                "index": 2,
                "keyword": "搜索关键词-1",
                "count": 679,
                "range": 25,
                "status": 0
            },
            {
                "index": 3,
                "keyword": "搜索关键词-2",
                "count": 94,
                "range": 47,
                "status": 0
            },
            {
                "index": 4,
                "keyword": "搜索关键词-3",
                "count": 731,
                "range": 48,
                "status": 0
            },
            {
                "index": 5,
                "keyword": "搜索关键词-4",
                "count": 333,
                "range": 51,
                "status": 0
            },
            {
                "index": 6,
                "keyword": "搜索关键词-5",
                "count": 354,
                "range": 71,
                "status": 0
            },
            {
                "index": 7,
                "keyword": "搜索关键词-6",
                "count": 133,
                "range": 24,
                "status": 1
            },
            {
                "index": 8,
                "keyword": "搜索关键词-7",
                "count": 640,
                "range": 18,
                "status": 1
            },
            {
                "index": 9,
                "keyword": "搜索关键词-8",
                "count": 65,
                "range": 4,
                "status": 1
            },
            {
                "index": 10,
                "keyword": "搜索关键词-9",
                "count": 93,
                "range": 43,
                "status": 1
            },
            {
                "index": 11,
                "keyword": "搜索关键词-10",
                "count": 168,
                "range": 77,
                "status": 0
            },
            {
                "index": 12,
                "keyword": "搜索关键词-11",
                "count": 211,
                "range": 4,
                "status": 1
            },
            {
                "index": 13,
                "keyword": "搜索关键词-12",
                "count": 116,
                "range": 54,
                "status": 0
            },
            {
                "index": 14,
                "keyword": "搜索关键词-13",
                "count": 498,
                "range": 24,
                "status": 0
            },
            {
                "index": 15,
                "keyword": "搜索关键词-14",
                "count": 705,
                "range": 66,
                "status": 1
            },
            {
                "index": 16,
                "keyword": "搜索关键词-15",
                "count": 220,
                "range": 99,
                "status": 1
            },
            {
                "index": 17,
                "keyword": "搜索关键词-16",
                "count": 494,
                "range": 40,
                "status": 0
            },
            {
                "index": 18,
                "keyword": "搜索关键词-17",
                "count": 938,
                "range": 37,
                "status": 0
            },
            {
                "index": 19,
                "keyword": "搜索关键词-18",
                "count": 445,
                "range": 43,
                "status": 0
            },
            {
                "index": 20,
                "keyword": "搜索关键词-19",
                "count": 601,
                "range": 3,
                "status": 0
            },
            {
                "index": 21,
                "keyword": "搜索关键词-20",
                "count": 235,
                "range": 63,
                "status": 0
            },
            {
                "index": 22,
                "keyword": "搜索关键词-21",
                "count": 80,
                "range": 5,
                "status": 0
            },
            {
                "index": 23,
                "keyword": "搜索关键词-22",
                "count": 332,
                "range": 21,
                "status": 1
            },
            {
                "index": 24,
                "keyword": "搜索关键词-23",
                "count": 748,
                "range": 47,
                "status": 0
            },
            {
                "index": 25,
                "keyword": "搜索关键词-24",
                "count": 541,
                "range": 32,
                "status": 1
            },
            {
                "index": 26,
                "keyword": "搜索关键词-25",
                "count": 172,
                "range": 71,
                "status": 1
            },
            {
                "index": 27,
                "keyword": "搜索关键词-26",
                "count": 432,
                "range": 85,
                "status": 0
            },
            {
                "index": 28,
                "keyword": "搜索关键词-27",
                "count": 439,
                "range": 63,
                "status": 1
            },
            {
                "index": 29,
                "keyword": "搜索关键词-28",
                "count": 833,
                "range": 17,
                "status": 0
            },
            {
                "index": 30,
                "keyword": "搜索关键词-29",
                "count": 500,
                "range": 1,
                "status": 0
            },
            {
                "index": 31,
                "keyword": "搜索关键词-30",
                "count": 696,
                "range": 50,
                "status": 0
            },
            {
                "index": 32,
                "keyword": "搜索关键词-31",
                "count": 629,
                "range": 79,
                "status": 1
            },
            {
                "index": 33,
                "keyword": "搜索关键词-32",
                "count": 495,
                "range": 71,
                "status": 0
            },
            {
                "index": 34,
                "keyword": "搜索关键词-33",
                "count": 83,
                "range": 28,
                "status": 0
            },
            {
                "index": 35,
                "keyword": "搜索关键词-34",
                "count": 687,
                "range": 74,
                "status": 1
            },
            {
                "index": 36,
                "keyword": "搜索关键词-35",
                "count": 880,
                "range": 61,
                "status": 1
            },
            {
                "index": 37,
                "keyword": "搜索关键词-36",
                "count": 510,
                "range": 86,
                "status": 0
            },
            {
                "index": 38,
                "keyword": "搜索关键词-37",
                "count": 492,
                "range": 1,
                "status": 1
            },
            {
                "index": 39,
                "keyword": "搜索关键词-38",
                "count": 148,
                "range": 8,
                "status": 1
            },
            {
                "index": 40,
                "keyword": "搜索关键词-39",
                "count": 698,
                "range": 27,
                "status": 1
            },
            {
                "index": 41,
                "keyword": "搜索关键词-40",
                "count": 222,
                "range": 49,
                "status": 1
            },
            {
                "index": 42,
                "keyword": "搜索关键词-41",
                "count": 135,
                "range": 13,
                "status": 1
            },
            {
                "index": 43,
                "keyword": "搜索关键词-42",
                "count": 993,
                "range": 81,
                "status": 0
            },
            {
                "index": 44,
                "keyword": "搜索关键词-43",
                "count": 494,
                "range": 16,
                "status": 0
            },
            {
                "index": 45,
                "keyword": "搜索关键词-44",
                "count": 1,
                "range": 86,
                "status": 0
            },
            {
                "index": 46,
                "keyword": "搜索关键词-45",
                "count": 684,
                "range": 82,
                "status": 0
            },
            {
                "index": 47,
                "keyword": "搜索关键词-46",
                "count": 107,
                "range": 14,
                "status": 0
            },
            {
                "index": 48,
                "keyword": "搜索关键词-47",
                "count": 192,
                "range": 80,
                "status": 1
            },
            {
                "index": 49,
                "keyword": "搜索关键词-48",
                "count": 908,
                "range": 26,
                "status": 0
            },
            {
                "index": 50,
                "keyword": "搜索关键词-49",
                "count": 670,
                "range": 29,
                "status": 0
            }
        ],
        "offlineData": [
            {
                "name": "Stores 0",
                "cvr": 0.3
            },
            {
                "name": "Stores 1",
                "cvr": 0.4
            },
            {
                "name": "Stores 2",
                "cvr": 0.2
            },
            {
                "name": "Stores 3",
                "cvr": 0.7
            },
            {
                "name": "Stores 4",
                "cvr": 0.6
            },
            {
                "name": "Stores 5",
                "cvr": 0.8
            },
            {
                "name": "Stores 6",
                "cvr": 0.8
            },
            {
                "name": "Stores 7",
                "cvr": 0.8
            },
            {
                "name": "Stores 8",
                "cvr": 0.6
            },
            {
                "name": "Stores 9",
                "cvr": 0.9
            }
        ],
        "offlineChartData": [
            {
                "date": "03:04",
                "type": "客流量",
                "value": 81
            },
            {
                "date": "03:04",
                "type": "支付笔数",
                "value": 14
            },
            {
                "date": "03:34",
                "type": "客流量",
                "value": 80
            },
            {
                "date": "03:34",
                "type": "支付笔数",
                "value": 83
            },
            {
                "date": "04:04",
                "type": "客流量",
                "value": 59
            },
            {
                "date": "04:04",
                "type": "支付笔数",
                "value": 82
            },
            {
                "date": "04:34",
                "type": "客流量",
                "value": 53
            },
            {
                "date": "04:34",
                "type": "支付笔数",
                "value": 33
            },
            {
                "date": "05:04",
                "type": "客流量",
                "value": 93
            },
            {
                "date": "05:04",
                "type": "支付笔数",
                "value": 37
            },
            {
                "date": "05:34",
                "type": "客流量",
                "value": 65
            },
            {
                "date": "05:34",
                "type": "支付笔数",
                "value": 15
            },
            {
                "date": "06:04",
                "type": "客流量",
                "value": 72
            },
            {
                "date": "06:04",
                "type": "支付笔数",
                "value": 97
            },
            {
                "date": "06:34",
                "type": "客流量",
                "value": 61
            },
            {
                "date": "06:34",
                "type": "支付笔数",
                "value": 43
            },
            {
                "date": "07:04",
                "type": "客流量",
                "value": 51
            },
            {
                "date": "07:04",
                "type": "支付笔数",
                "value": 61
            },
            {
                "date": "07:34",
                "type": "客流量",
                "value": 44
            },
            {
                "date": "07:34",
                "type": "支付笔数",
                "value": 24
            },
            {
                "date": "08:04",
                "type": "客流量",
                "value": 13
            },
            {
                "date": "08:04",
                "type": "支付笔数",
                "value": 101
            },
            {
                "date": "08:34",
                "type": "客流量",
                "value": 71
            },
            {
                "date": "08:34",
                "type": "支付笔数",
                "value": 55
            },
            {
                "date": "09:04",
                "type": "客流量",
                "value": 49
            },
            {
                "date": "09:04",
                "type": "支付笔数",
                "value": 98
            },
            {
                "date": "09:34",
                "type": "客流量",
                "value": 65
            },
            {
                "date": "09:34",
                "type": "支付笔数",
                "value": 22
            },
            {
                "date": "10:04",
                "type": "客流量",
                "value": 31
            },
            {
                "date": "10:04",
                "type": "支付笔数",
                "value": 19
            },
            {
                "date": "10:34",
                "type": "客流量",
                "value": 36
            },
            {
                "date": "10:34",
                "type": "支付笔数",
                "value": 67
            },
            {
                "date": "11:04",
                "type": "客流量",
                "value": 36
            },
            {
                "date": "11:04",
                "type": "支付笔数",
                "value": 101
            },
            {
                "date": "11:34",
                "type": "客流量",
                "value": 23
            },
            {
                "date": "11:34",
                "type": "支付笔数",
                "value": 98
            },
            {
                "date": "12:04",
                "type": "客流量",
                "value": 30
            },
            {
                "date": "12:04",
                "type": "支付笔数",
                "value": 54
            },
            {
                "date": "12:34",
                "type": "客流量",
                "value": 54
            },
            {
                "date": "12:34",
                "type": "支付笔数",
                "value": 62
            }
        ],
        "salesTypeData": [
            {
                "x": "家用电器",
                "y": 4544
            },
            {
                "x": "食用酒水",
                "y": 3321
            },
            {
                "x": "个护健康",
                "y": 3113
            },
            {
                "x": "服饰箱包",
                "y": 2341
            },
            {
                "x": "母婴产品",
                "y": 1231
            },
            {
                "x": "其他",
                "y": 1231
            }
        ],
        "salesTypeDataOnline": [
            {
                "x": "家用电器",
                "y": 244
            },
            {
                "x": "食用酒水",
                "y": 321
            },
            {
                "x": "个护健康",
                "y": 311
            },
            {
                "x": "服饰箱包",
                "y": 41
            },
            {
                "x": "母婴产品",
                "y": 121
            },
            {
                "x": "其他",
                "y": 111
            }
        ],
        "salesTypeDataOffline": [
            {
                "x": "家用电器",
                "y": 99
            },
            {
                "x": "食用酒水",
                "y": 188
            },
            {
                "x": "个护健康",
                "y": 344
            },
            {
                "x": "服饰箱包",
                "y": 255
            },
            {
                "x": "其他",
                "y": 65
            }
        ],
        "radarData": [
            {
                "name": "个人",
                "label": "引用",
                "value": 10
            },
            {
                "name": "个人",
                "label": "口碑",
                "value": 8
            },
            {
                "name": "个人",
                "label": "产量",
                "value": 4
            },
            {
                "name": "个人",
                "label": "贡献",
                "value": 5
            },
            {
                "name": "个人",
                "label": "热度",
                "value": 7
            },
            {
                "name": "团队",
                "label": "引用",
                "value": 3
            },
            {
                "name": "团队",
                "label": "口碑",
                "value": 9
            },
            {
                "name": "团队",
                "label": "产量",
                "value": 6
            },
            {
                "name": "团队",
                "label": "贡献",
                "value": 3
            },
            {
                "name": "团队",
                "label": "热度",
                "value": 1
            },
            {
                "name": "部门",
                "label": "引用",
                "value": 4
            },
            {
                "name": "部门",
                "label": "口碑",
                "value": 1
            },
            {
                "name": "部门",
                "label": "产量",
                "value": 6
            },
            {
                "name": "部门",
                "label": "贡献",
                "value": 5
            },
            {
                "name": "部门",
                "label": "热度",
                "value": 7
            }
        ]
    }
}
export async function fakeChartData(): Promise<{ data: AnalysisData }> {
  // return request('/api/fake_analysis_chart_data');
  return fakedata
}

