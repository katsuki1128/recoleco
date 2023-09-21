import { FormComponent } from "./FormComponent";

export const Health = () => {
    const formFields = [
        { label: "体重", name: "weight", type: "number" },
        { label: "体脂肪率", name: "fatPercentage", type: "number" }
    ];

    return <FormComponent formFields={formFields} collectionName="Health" />;
};
