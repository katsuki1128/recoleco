import { useState, useEffect } from "react"
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
    Title
} from "chart.js";

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
    Title
);

export const PersonalIndex = () => {

    const [personal, setPersonal] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "Health"), orderBy("timestamp", "asc"));
        const unsub = onSnapshot(q, (documentSnapshot) => {
            // console.log(documentSnapshot.docs);
            setPersonal(documentSnapshot.docs.map((x) => ({ ...x.data(), id: x.id })))
        });
        return unsub;
    }, []);

    const labels = personal.map(data =>
        new Date(data.timestamp.seconds * 1000).toLocaleDateString()
    );

    // const dataset = {
    //     label: '体脂肪率',
    //     data: personal.map(data => data.fatPercentage),
    //     fill: false,
    //     borderColor: 'rgb(75, 192, 192)',
    //     tension: 0.1
    // };

    // console.log(dataset.data);

    // const chartData = {
    //     labels: labels,
    //     datasets: [dataset]
    // };
    const fatPercentageDataset = {
        label: '体脂肪率',
        data: personal.map(data => data.fatPercentage),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    };

    // weight データセットを追加
    const weightDataset = {
        label: '体重',
        data: personal.map(data => data.weight), // ここで weight データをマッピング
        fill: false,
        borderColor: 'rgb(255, 99, 132)', // 色はお好みで変更してください
        tension: 0.1,
        yAxisID: 'y-weight' // 体重用のY軸を指定
    };

    const chartData = {
        labels: labels,
        datasets: [fatPercentageDataset, weightDataset] // 2つのデータセットを使用
    };

    // データから最小値と最大値を計算
    const minWeight = Math.min(...personal.map(item => parseFloat(item.weight)));
    const maxWeight = Math.max(...personal.map(item => parseFloat(item.weight)));
    const minFatPercentage = Math.min(...personal.map(item => parseFloat(item.fatPercentage)));
    const maxFatPercentage = Math.max(...personal.map(item => parseFloat(item.fatPercentage)));

    // 体重のためのオプションを追加。体脂肪率とスケールが異なる場合に役立ちます。
    const chartOptions = {
        scales: {
            // x: {
            //     type: 'time',
            //     time: {
            //         unit: 'day', // 日を単位として表示
            //         displayFormats: {
            //             day: 'MM/DD' // 月/日 のフォーマットで表示
            //         }
            //     }
            // },
            y: {
                type: 'linear',
                position: 'left',
                min: minFatPercentage - 1,
                max: maxFatPercentage + 1,
                title: {
                    display: true,
                    text: '体脂肪率'
                }
            },
            'y-weight': {
                type: 'linear',
                position: 'right',
                min: minWeight - 1,
                max: maxWeight + 1,
                title: {
                    display: true,
                    text: '体重'
                }
            }
        }
    };

    return (
        <>
            {/* {JSON.stringify(personal)} */}
            <Line data={chartData} options={chartOptions} />
        </>
    );
};
