import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, limit } from "firebase/firestore";

export const FormComponent = ({ formFields, collectionName }) => {
    const { register, handleSubmit, reset } = useForm({
        shouldUnregister: false,
    });

    const onSubmit = async (data) => {
        console.log(data);
        const result = await addDoc(collection(db, collectionName), {
            ...data,
            timestamp: serverTimestamp(),
        });
        console.log(result);
        alert("Done");
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
            <table>
                <tbody>
                    {formFields.map((field) => (
                        <tr key={field.name}>
                            <td>{field.label}</td>
                            <td>
                                <input
                                    type={field.type || "text"}
                                    {...register(field.name, { required: true, pattern: /\d*/ })}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button>送信</button>
        </form>
    );
};
