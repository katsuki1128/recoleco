import { cloneElement, useEffect } from "react";


import { useForm } from "react-hook-form";

import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, limit } from "firebase/firestore";


export const Money = () => {

    //------------------------------------------------
    // useFormを利用して、registerとhandleSubmitを分割代入で取得
    // registerはフォームの入力項目を管理するためのもの、
    // handleSubmitはフォームが送信されたときの処理を行うためのもの
    // shouldUnregisterオプションは、フォームの入力項目が削除されたときの挙動を制御します。
    // ここではfalseに設定しているので、入力項目が削除・非表示になっても、その項目のデータはフォームのデータ内に保持され続けます。
    //------------------------------------------------

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            bank_mitsui: 1000,
        },  // 初期値を設定
        shouldUnregister: false,
    });

    const onSubmit = async (data) => {
        // console.log(data);
        const result = await addDoc(collection(db, "Money"), {
            ...data,
            bank_mitsui: Number(data.bank_mitsui),
            bank_fukuoka: Number(data.bank_fukuoka),
            wallet: Number(data.wallet),
            family_finance: Number(data.family_finance),
            timestamp: serverTimestamp(),
        });
        console.log(result);
        alert("Done");
    };

    useEffect(() => {
        const q = query(collection(db, "Money"), orderBy("timestamp", "desc"), limit(1));
        const unsub = onSnapshot(q, (QuerySnapshot) => {
            const data = QuerySnapshot.docs.map((x) => x.data());
            reset({
                bank_mitsui: data[0].bank_mitsui,
                bank_fukuoka: data[0].bank_fukuoka,
                wallet: data[0].wallet,
                family_finance: data[0].family_finance,
            });
        });
        return () => unsub();
    }, [reset]);


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <table>
                    <tbody>
                        <tr>
                            <td>三井住友</td>
                            <td>
                                <input
                                    type="number"
                                    {...register("bank_mitsui", { required: true, pattern: /\d*/ })}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>福岡銀行</td>
                            <td>
                                <input
                                    type="number"
                                    {...register("bank_fukuoka", { required: true, pattern: /\d*/ })}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>財布</td>
                            <td>
                                <input
                                    type="number"
                                    {...register("wallet", { required: true, pattern: /\d*/ })}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>立て替え</td>
                            <td>
                                <input
                                    type="number"
                                    {...register("family_finance", { required: true, pattern: /\d*/ })}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button type="submit">送信</button>
            </form >
        </>
    );
};
