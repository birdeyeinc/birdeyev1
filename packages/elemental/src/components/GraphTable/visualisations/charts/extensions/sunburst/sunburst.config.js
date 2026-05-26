export const sunBurstChartConfig = {
    title: "Sunburst Chart",
    parserConfig: {
        title: "Sunburst Chart",
        dataFormat: "arrayWithKeyValue",
        primaryChartStyle: "sunburst",
        defaultChartStyle: "sunburst",
        dataPoints: true,
        plotDataConfig: [],
        seriesDetails: [],
        isCatView: true,
    },
    updateDrillType: (data) => {
        console.log("🚀 ~ updateDrillType ~ data:", data);
    },
    getActiveEntity: (data) => {
        console.log("🚀 ~ getActiveEntity ~ data:", data);
    },
    handleOnOtherClick: (data) => {
        console.log("🚀 ~ handleOnOtherClick ~ data:", data);
    },
    drillTo: {
        currentNode: {
            id: "2702",
            name: "Emotions",
            sentiment: {
                score: 99.2,
                spread: {
                    pos: 20,
                    neg: 1,
                    neu: 0,
                },
            },
            mentions: 21,
            logicalId: "2702",
            type: "CATEGORY",
            parent: "0",
            value: 21,
            color: "#4cae3d",
            maxKey: "pos",
            nameActual: "Emotions",
        },
    },
    apiData: {
        totalCount: 13,
        dataPoints: [
            {
                id: "2702",
                name: "Emotions",
                sentiment: {
                    score: 99.2,
                    spread: {
                        pos: 20,
                        neg: 1,
                        neu: 0,
                    },
                },
                mentions: 21,
                logicalId: "2702",
                type: "CATEGORY",
                parent: "0",
                value: 21,
            },
            {
                id: "2702evening",
                name: "evening",
                sentiment: {
                    score: 100,
                    spread: {
                        pos: 20,
                        neg: 0,
                        neu: 0,
                    },
                },
                mentions: 20,
                logicalId: "2702evening",
                type: "KEYWORD",
                parent: "2702",
                value: 20,
            },
            {
                id: "2702eveninggreat",
                name: "great",
                sentiment: {
                    score: 100,
                    spread: {
                        pos: 5,
                        neg: 0,
                        neu: 0,
                    },
                },
                mentions: 5,
                logicalId: "2702eveninggreat",
                type: "ADJECTIVE",
                parent: "2702evening",
                value: 5,
            },
            {
                id: "2702eveninglovely",
                name: "lovely",
                sentiment: {
                    score: 100,
                    spread: {
                        pos: 4,
                        neg: 0,
                        neu: 0,
                    },
                },
                mentions: 4,
                logicalId: "2702eveninglovely",
                type: "ADJECTIVE",
                parent: "2702evening",
                value: 4,
            },
            {
                id: "2702eveningnice",
                name: "nice",
                sentiment: {
                    score: 100,
                    spread: {
                        pos: 2,
                        neg: 0,
                        neu: 0,
                    },
                },
                mentions: 2,
                logicalId: "2702eveningnice",
                type: "ADJECTIVE",
                parent: "2702evening",
                value: 2,
            },
            {
                id: "2702eveningfun",
                name: "fun",
                sentiment: {
                    score: 100,
                    spread: {
                        pos: 2,
                        neg: 0,
                        neu: 0,
                    },
                },
                mentions: 2,
                logicalId: "2702eveningfun",
                type: "ADJECTIVE",
                parent: "2702evening",
                value: 2,
            },
            {
                id: "2702eveningwonderful",
                name: "wonderful",
                sentiment: {
                    score: 100,
                    spread: {
                        pos: 1,
                        neg: 0,
                        neu: 0,
                    },
                },
                mentions: 1,
                logicalId: "2702eveningwonderful",
                type: "ADJECTIVE",
                parent: "2702evening",
                value: 1,
            },
            {
                id: "2702eveningspecial",
                name: "special",
                sentiment: {
                    score: 100,
                    spread: {
                        pos: 1,
                        neg: 0,
                        neu: 0,
                    },
                },
                mentions: 1,
                logicalId: "2702eveningspecial",
                type: "ADJECTIVE",
                parent: "2702evening",
                value: 1,
            },
            {
                id: "2702eveningslow",
                name: "slow",
                sentiment: {
                    score: 100,
                    spread: {
                        pos: 1,
                        neg: 0,
                        neu: 0,
                    },
                },
                mentions: 1,
                logicalId: "2702eveningslow",
                type: "ADJECTIVE",
                parent: "2702evening",
                value: 1,
            },
            {
                id: "2702eveninghappening",
                name: "happening",
                sentiment: {
                    score: 100,
                    spread: {
                        pos: 1,
                        neg: 0,
                        neu: 0,
                    },
                },
                mentions: 1,
                logicalId: "2702eveninghappening",
                type: "ADJECTIVE",
                parent: "2702evening",
                value: 1,
            },
            {
                id: "2702eveningdelightful",
                name: "delightful",
                sentiment: {
                    score: 100,
                    spread: {
                        pos: 1,
                        neg: 0,
                        neu: 0,
                    },
                },
                mentions: 1,
                logicalId: "2702eveningdelightful",
                type: "ADJECTIVE",
                parent: "2702evening",
                value: 1,
            },
            {
                id: "2702eveningamazing",
                name: "amazing",
                sentiment: {
                    score: 100,
                    spread: {
                        pos: 1,
                        neg: 0,
                        neu: 0,
                    },
                },
                mentions: 1,
                logicalId: "2702eveningamazing",
                type: "ADJECTIVE",
                parent: "2702evening",
                value: 1,
            },
            {
                id: "2702crap",
                name: "crap",
                sentiment: {
                    score: 0,
                    spread: {
                        pos: 0,
                        neg: 1,
                        neu: 0,
                    },
                },
                mentions: 1,
                logicalId: "2702crap",
                type: "KEYWORD",
                parent: "2702",
                value: 1,
            },
        ],
    },
};
