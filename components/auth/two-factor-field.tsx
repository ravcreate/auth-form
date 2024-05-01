import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"

interface TwoFactorFieldProps {
    control: any
    disabled: boolean
}

export const TwoFactorField: React.FC<TwoFactorFieldProps> = ({
    control,
    disabled,
}) => {
    return (
        <FormField
            control={control}
            name="code"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            disabled={disabled}
                            placeholder="123456"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
