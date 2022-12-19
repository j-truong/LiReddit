import { FormControl, FormLabel, Input, FormErrorMessage, propNames, Textarea } from "@chakra-ui/react";
import { InputHTMLAttributes } from "react";
import { useField } from "formik";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    //placeholder: string;
    name: string;    
    textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
    label,
    textarea,
    size: _,
    ...props
}) => {
    let InputOrTextarea = Input as any;
    if (textarea) {
        InputOrTextarea = Textarea
    }

    const [field, { error }] = useField(props);
    return (
        <FormControl isInvalid={!!error}>
            <>Textarea</>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <InputOrTextarea 
                {...field} 
                {...props}
                id={field.name}/>
            {error ?<FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
)
}