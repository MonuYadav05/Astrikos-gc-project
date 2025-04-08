import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
    { time: '00:00', temperature: 20, pressure: 1013 },
    { time: '01:00', temperature: 21, pressure: 1014 },
    { time: '02:00', temperature: 22, pressure: 1015 },
    { time: '03:00', temperature: 21, pressure: 1013 },
];

export default function Dashboard() {
    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Sensor Data</h2>
            <LineChart width={600} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#8884d8" />
                <Line yAxisId="right" type="monotone" dataKey="pressure" stroke="#82ca9d" />
            </LineChart>
        </div>
    );
}