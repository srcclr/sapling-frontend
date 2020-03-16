import React from 'react';

interface IFuelSavingsTextInputProps {
  name: number | string;
  onChange: (e: any) => void;
  placeholder?: string;
  value: number | string;
}

const FuelSavingsTextInput: React.SFC<IFuelSavingsTextInputProps> = ({
  name,
  value,
  placeholder,
  onChange,
}) => {
  const inputName: string = name as string;
  return (
    <input
      className="small"
      name={inputName}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default FuelSavingsTextInput;
