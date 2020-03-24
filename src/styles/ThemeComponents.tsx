import React, { useState, useRef } from 'react';
import classnames from 'classnames';
import { PlusSquare, XSquare, CornerDownLeft } from 'react-feather';
import { useOnClickOutside } from 'hooks';
import { SelectOption } from 'types';

export const Button = props => {
  const { intent, className, isLoading, children } = props;

  const classes = classnames({
    'btn-primary': intent === 'primary',
  });

  return (
    <button className={`btn ${className} ${classes}`}>
      {children}
      <div className="spinner">
        <div className="spinner-inner" />
      </div>
    </button>
  );
};

export const Dialog = props => {
  const {
    className = '',
    children,
    open = false,
    closeOnOutsideClick = false,
    onClose,
    confirmButtonMessage = 'Yes',
    cancelButtonMessage = 'Cancel',
    intent = '',
    onConfirm,
  } = props;

  const ref = useRef();
  useOnClickOutside(ref, () => {
    if (closeOnOutsideClick) {
      onClose();
    }
  });

  const classes = classnames({
    'btn-danger': intent.toLowerCase() === 'danger',
    'btn-primary': intent.toLowerCase() === '',
  });

  return open ? (
    <div className="overlay" ref={ref}>
      <div className={`relative m-auto dialog ${className}`}>
        {children}{' '}
        <div className="mt-5 flex justify-end">
          <button className="btn btn-minimal mr-1" onClick={onClose}>
            {cancelButtonMessage}
          </button>
          <button className={`btn ${classes}`} onClick={onConfirm}>
            {confirmButtonMessage}
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export const SquareSpinner = ({ className }) => (
  <div className={className}>
    <span className="square-spinner">
      <span className="square-spinner-inner" />
    </span>
  </div>
);

export const ActionLine = ({ actionName, onClick, withHandle = true }) => {
  return (
    <div
      className="flex flex-row items-center actionline animation-fade-in animation-200ms"
      onClick={onClick}
    >
      {withHandle && (
        <div className="flex-grow-0 handle">
          <PlusSquare />
        </div>
      )}
      <div className="content">
        <div className="">{actionName}</div>
      </div>
    </div>
  );
};

export const ActionZone = ({
  actionName,
  children,
  withHandle = true,
  isActive,
  minimal = false,
}) => {
  const [isOpen, setIsOpen] = useState(!isActive);

  const ref = useRef();
  useOnClickOutside(ref, () => {
    if (withHandle) {
      setIsOpen(false);
    }
  });

  const classes = classnames({
    'border-dotted border-2 p-2': !minimal,
  });

  return (
    <div>
      {!isOpen ? (
        <ActionLine actionName={actionName} onClick={() => setIsOpen(true)} />
      ) : (
        <div
          className={`animation-fade-in 
        animation-200ms flex flex-row items-center ${classes}`}
          ref={ref}
        >
          {withHandle && (
            <div
              className="flex-grow-0 handle hover:text-teal-400 cursor-pointer mr-1"
              onClick={() => setIsOpen(false)}
            >
              <XSquare />
            </div>
          )}
          <div className="flex-grow ">{children}</div>
        </div>
      )}
    </div>
  );
};

export const Dropdown = ({
  name,
  options,
  onChange,
  required,
}: {
  name: string;
  options: SelectOption[];
  onChange: (name: string, value) => void;
  required?: boolean;
}) => {
  const handleChange = event => {
    onChange(name, event.target.value);
  };

  return (
    <div>
      <div className="relative">
        <select className="" name="board" onChange={handleChange} required={required}>
          {options &&
            options.map((option, i) => {
              const { value, label } = option;
              return (
                <option value={value} key={i}>
                  {label}
                </option>
              );
            })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export const ReturnIconWrap: React.FunctionComponent<{ className?: string }> = ({
  className,
  children,
}) => {
  return (
    <div className={`${className} relative icon-parent`}>
      {children}{' '}
      <div className="absolute icon-child top-0 right-0 rounded-lg bg-white border-b-2 border-l border-r  p-1">
        <CornerDownLeft size="12" />
      </div>
    </div>
  );
};
