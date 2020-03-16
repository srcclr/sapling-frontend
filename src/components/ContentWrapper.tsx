import React from 'react';
import { Spinner, Overlay, Classes } from '@blueprintjs/core';

interface IContentWrapperProps {
  children?: React.ReactNode;
  loaderProps?: any;
  isLoading?: boolean;
  loaderClassName?: string;
  overlayLoader?: boolean;
  messages?: string[];
}

const ContentWrapper = (props: IContentWrapperProps) => {
  const {
    isLoading = false,
    loaderClassName = 'mt4 pt4',
    loaderProps = { size: 50 },
    overlayLoader = false,
    messages = [],
  } = props;

  return (
    <>
      {isLoading ? (
        overlayLoader ? (
          <>
            {props.children}
            <Overlay
              isOpen={isLoading}
              className={Classes.OVERLAY_SCROLL_CONTAINER}
              hasBackdrop={false}
              usePortal={false}
            >
              <Spinner
                intent={'primary'}
                {...loaderProps}
                className={`center-align-overlay ${loaderClassName}`}
              />
            </Overlay>
          </>
        ) : (
          <Spinner intent={'primary'} className={loaderClassName} {...loaderProps} />
        )
      ) : (
        props.children
      )}
    </>
  );
};

export default ContentWrapper;
