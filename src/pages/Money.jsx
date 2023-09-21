import { FormComponent } from "./FormComponent";

export const Money = () => {
    const formFields = [
        { label: "三井住友", name: "bank_mitsui", type: "number" },
        { label: "福岡銀行", name: "bank_fukuoka", type: "number" },
        { label: "財布", name: "wallet", type: "number" },
        { label: "立て替え", name: "family_finance", type: "number" }
    ];

    return <FormComponent formFields={formFields} collectionName="Money" />;
};
