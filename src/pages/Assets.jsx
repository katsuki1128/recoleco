import { useState, useEffect } from "react"
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export const Assets = () => {

    const [asset, setAsset] = useState([]);
    const [total, setTotal] = useState({
        bank_mitsui: 0,
        bank_fukuoka: 0,
        wallet: 0,
        family_finance: 0
    });


    useEffect(() => {
        const q = query(collection(db, "Money"), orderBy("timestamp", "asc"));
        const unsub = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((x) => x.data());
            setAsset(data);

            // 各フィールドの合計を計算
            const sum = data.reduce((accumulator, currentValue) => {
                return {
                    bank_mitsui: accumulator.bank_mitsui + currentValue.bank_mitsui,
                    bank_fukuoka: accumulator.bank_fukuoka + currentValue.bank_fukuoka,
                    wallet: accumulator.wallet + currentValue.wallet,
                    family_finance: accumulator.family_finance + currentValue.family_finance
                };
            }, {
                bank_mitsui: 0,
                bank_fukuoka: 0,
                wallet: 0,
                family_finance: 0
            });
            setTotal(sum);
        });
        return () => unsub();
    }, []);

    return (
        <>
            <>
                <p>総計 : ¥{`${(total.bank_mitsui + total.bank_fukuoka + total.wallet + total.family_finance).toLocaleString()}`}</p>
            </>
        </>
    );

};
