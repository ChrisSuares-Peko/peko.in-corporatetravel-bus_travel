import { Input, InputProps } from 'antd';

interface TrnInputProps extends Omit<InputProps, 'onChange' | 'value'> {
    value?: string;
    onChange?: (value: string) => void;
}

const TrnInput = ({ value = '', onChange, ...rest }: TrnInputProps) => {
    const formatted = (value ?? '').replace(/\D/g, '').slice(0, 15);
    const display = formatted.replace(/(\d{3})(?=\d)/g, '$1 ').trim();

    return (
        <Input
            value={display}
            onChange={e => onChange?.(e.target.value.replace(/\D/g, '').slice(0, 15))}
            placeholder="100 123 456 700 003"
            maxLength={19}
            {...rest}
        />
    );
};

export default TrnInput;
