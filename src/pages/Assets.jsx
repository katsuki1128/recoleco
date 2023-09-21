import { useState, useEffect } from "react"
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";

export const Assets = () => {
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // timestamp の降順に並べ、最新の1件のみ取得
        const q = query(collection(db, "Money"), orderBy("timestamp", "desc"), limit(1));
        const unsub = onSnapshot(q, (querySnapshot) => {
            const latestData = querySnapshot.docs[0]?.data();

            // 最新のデータの各プロパティの合計を計算
            const sum = latestData.bank_mitsui + latestData.bank_fukuoka + latestData.wallet + latestData.family_finance;
            setTotal(sum);

        });

        // Cleanup function
        return () => unsub();
    }, []);

    return (
        <>
            <p>¥{total.toLocaleString()}</p>
        </>
    );
};