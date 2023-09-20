import { useForm } from "react-hook-form";

import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const Health = () => {

    //------------------------------------------------
    // useFormを利用して、registerとhandleSubmitを分割代入で取得
    // registerはフォームの入力項目を管理するためのもの、
    // handleSubmitはフォームが送信されたときの処理を行うためのもの
    // shouldUnregisterオプションは、フォームの入力項目が削除されたときの挙動を制御します。
    // ここではfalseに設定しているので、入力項目が削除・非表示になっても、その項目のデータはフォームのデータ内に保持され続けます。
    //------------------------------------------------

    const { register, handleSubmit } = useForm({
        shouldUnregister: false,
    });

    const onSubmit = async (data) => {
        console.log(data);
        const result = await addDoc(collection(db, "Health"), {
            ...data,
            timestamp: serverTimestamp(),
        });
        console.log(result);
        alert("Done");
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <table>
                    <tbody>
                        <tr>
                            <td>体重</td>
                            <td>
                                <input
                                    type="text"
                                    {...register("weight", { required: true })}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>体脂肪率</td>
                            <td>
                                <input
                                    type="text"
                                    {...register("fatPercentage", { required: true })}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button>送信</button>
            </form >
        </>
    );
};
