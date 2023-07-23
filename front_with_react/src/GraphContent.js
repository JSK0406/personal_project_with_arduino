import React, { PureComponent } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
} from "recharts";

// 온도, 카운트, 조도를 측정된 시간을 기준으로 3개의 꺾은선 그래프가 나오도록 함
const GraphContent = ({ temp_q, count_q, pr_q, time_q }) => {
    const data = [];

    for (let i = 0; i < 5; i++) {
        data.push({name: time_q[i], temp: temp_q[i], count: count_q[i], pr: pr_q[i] / 1000})
    };

    const renderCustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`Time: ${label}`}</p>
                    {payload.map((entry, index) => (
                        <p className="intro" key={`intro-${index}`}>
                            {`${entry.dataKey}: ${entry.value}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height="950%">
            <LineChart
                width={20}
                height={20}
                data={data}
                margin={{
                    top: 5,
                    right: 55,
                    left: 5,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={renderCustomTooltip} />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                >
                <Label content={renderCustomLabel} position="top" />
                </Line>
                <Line type="monotone" dataKey="count" stroke="#82ca9d">
                    <Label content={renderCustomLabel} position="top" />
                </Line>
                <Line type="monotone" dataKey="pr" stroke="#4287f5">
                    <Label content={renderCustomLabel} position="top" />
                </Line>
            </LineChart>
        </ResponsiveContainer>
    );
};

// Label 컴포넌트를 커스터마이즈하여 원하는 형식으로 값을 표시
const renderCustomLabel = ({ viewBox, value }) => {
    const { x, y } = viewBox;
    return (
        <text x={x} y={y} dy={-10} textAnchor="middle" fill="#666">{value}</text>
    );
};

export default GraphContent;
