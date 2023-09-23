import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, limit } from "firebase/firestore";


export const FormComponent = ({ formFields, collectionName }) => {
    const { register, handleSubmit, reset, setValue } = useForm({
        shouldUnregister: false,
    });


    // const handleFocus = (e) => {
    //     const plainNumber = e.target.value.replace(/,/g, '');
    //     e.target.value = plainNumber;
    //     // console.log(e.target.value);
    // };

    // const handleBlur = (e) => {
    //     console.log("感知しました");
    //     const formattedValue = parseFloat(e.target.value).toLocaleString();
    //     setValue(field.name, formattedValue);
    //     console.log(formattedValue);
    // };


    const onSubmit = async (data) => {
        // 数値に変換するフィールドをループして変換
        formFields.forEach(field => {
            if (field.type === 'number') {
                data[field.name] = Number(data[field.name]);
            }
        });

        const result = await addDoc(collection(db, collectionName), {
            ...data,
            timestamp: serverTimestamp(),
        });
        // console.log(result);
        // alert("登録できました！");
    };

    useEffect(() => {
        const q = query(collection(db, collectionName), orderBy("timestamp", "desc"), limit(1));
        const unsub = onSnapshot(q, (QuerySnapshot) => {
            const latestData = QuerySnapshot.docs.map((x) => x.data())[0];
            reset(latestData);
        });
        return () => unsub();
    }, [reset, collectionName]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-center text-lg font-bold m-3 bg-gray-200 rounded p-4">
                <div className="flex flex-row flex-wrap">
                    {formFields.map((field) => (
                        <div key={field.name} className="field-container flex justify-between w-full mb-3">
                            <div className="field-label">{field.label}</div>
                            <div className="field-input">
                                <input
                                    type={field.type || "number"}
                                    // onFocus={handleFocus}
                                    // onBlur={handleBlur}
                                    className="text-right bg-gray-200 "
                                    {...register(field.name, { required: true, pattern: /^\d+(\.\d{0,1})?$/ })}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button></button>
        </form >
    );
};
