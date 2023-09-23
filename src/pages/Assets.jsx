import { useState, useEffect } from "react"
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, limit, doc, getDoc } from "firebase/firestore";

const SPREADSHEET_ID = '18fpXvXpFG04LCOpHuCFuVzLfHKi85KGteie5qxnIeQM';
const API_KEY = 'AIzaSyAJs3db0P0Bb57l8PVcdDxiaFGgTG - PO0k';
// const RANGE = '2023年!B3';
const RANGE = '2023年!N9:S9';


export const Assets = () => {
    const [total, setTotal] = useState(0);
    const [goalAsset, setGoalAsset] = useState(0);
    const [daysLeft, setDaysLeft] = useState(0);
    const [sheetSum, setSheetSum] = useState(0);
    const [consumption, setConsumption] = useState(0);
    const [dailyConsumption, setDailyConsumption] = useState(0);

    useEffect(() => {
        // GoalコレクションからgoalAssetを取得する関数を定義
        const fetchGoalAsset = async () => {
            const goalDoc = await getDoc(doc(db, "Goal", "Q9znpt1io6rlhxriyCIe"));
            if (goalDoc.exists()) {
                setGoalAsset(goalDoc.data().Asset);
                const goalDate = new Date(goalDoc.data().goalDate.toDate()); // goalDateをDate型に変換
                const currentDate = new Date();
                const timeDiff = goalDate - currentDate;
                const dayDifference = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // ミリ秒単位の差を日単位に変換
                setDaysLeft(dayDifference);
            }
        };

        fetchGoalAsset();

        // Query the latest Money document
        const q = query(collection(db, "Money"), orderBy("timestamp", "desc"), limit(1));
        const unsub = onSnapshot(q, (querySnapshot) => {
            const latestData = querySnapshot.docs[0]?.data();

            // Calculate the total from the latest data
            const sum = latestData.bank_mitsui + latestData.bank_fukuoka + latestData.wallet + latestData.family_finance;
            setTotal(sum);
        });

        const fetchSheetValue = async () => {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log(data.values[0]);

            if (data.values && data.values.length > 0) {

                const sum = data.values[0].reduce((acc, curr) => {
                    const value = Number(curr.replace(/,/g, '')); // カンマを取り除く
                    return isNaN(value) ? acc : acc + value;
                }, 0);
                setSheetSum(sum); // 合計をsheetSumにセット
            }
        };

        fetchSheetValue();

        console.log("sheetSum", sheetSum);
        const fetchConsumption = async () => {
            const consumptionDoc = await getDoc(doc(db, "consumption", "9aTbFTuLUwlQR0niBJYr"));
            if (consumptionDoc.exists()) {
                setConsumption(consumptionDoc.data().consumption);
            }
        };

        fetchConsumption();
        // Cleanup function
        return () => unsub();

    }, []);

    const goalDifference = goalAsset - total;
    const balance = sheetSum - 1900000;
    const difference = balance - goalDifference;
    const dailySaveAmount = Math.floor(daysLeft !== 0 ? (difference / daysLeft) : 0); // 残り日数が0の場合、0で除算しないようにします

    useEffect(() => {
        setDailyConsumption(dailySaveAmount - consumption);
    }, [dailySaveAmount, consumption]);

    const star = () => {
        if (dailyConsumption >= 0.8 * dailySaveAmount) return "★★★★★";
        if (dailyConsumption >= 0.6 * dailySaveAmount) return "★★★★☆";
        if (dailyConsumption >= 0.4 * dailySaveAmount) return "★★★☆☆";
        if (dailyConsumption >= 0.2 * dailySaveAmount) return "★★☆☆☆";
        return "★☆☆☆☆";
    };


    return (
        <>
            {/* <p>¥{total.toLocaleString()}</p> */}
            {/* <p>remaining: {daysLeft}days</p> */}
            <p>¥{dailySaveAmount.toLocaleString()}/day</p>
            <p>Rating: {star()}</p>
        </>
    );
};
