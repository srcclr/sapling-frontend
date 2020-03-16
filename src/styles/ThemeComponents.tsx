import React, { useState, useRef } from 'react';
import classnames from 'classnames';
import { Trash, Edit2, PlusSquare, XSquare } from 'react-feather';
import { useOnClickOutside } from 'hooks';

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

  const classes = classnames({
    'btn-danger': intent.toLowerCase() === 'danger',
    'btn-primary': intent.toLowerCase() === '',
  });

  const handleCloseOnOutsideClick = () => {
    onClose();
  };
  return open ? (
    <div className="overlay" onClick={closeOnOutsideClick ? handleCloseOnOutsideClick : null}>
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
