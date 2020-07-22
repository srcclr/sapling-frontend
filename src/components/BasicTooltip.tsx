import React, { ReactElement } from 'react';
import TooltipTrigger from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';

function Trigger({ getTriggerProps, triggerRef }) {
  return (
    <span
      {...getTriggerProps({
        ref: triggerRef,
        className: 'trigger',
      })}
    >
      Click Me!
    </span>
  );
}

function Tooltip({ children }) {
  return ({ getTooltipProps, getArrowProps, tooltipRef, arrowRef, placement }) => {
    return (
      <div
        {...getTooltipProps({
          ref: tooltipRef,
          className: 'tooltip-container',
        })}
      >
        <div
          {...getArrowProps({
            ref: arrowRef,
            'data-placement': placement,
            className: 'tooltip-arrow',
          })}
        />
        <div className="tooltip-body">Hello, World!</div>
      </div>
    );
  };
}

function BasicTooltip({
  placement,
  trigger,
  children,
  tooltip,
}: {
  placement?: any;
  trigger?: any;
  children?: ReactElement | string;
  tooltip: ReactElement | string;
}) {
  return (
    <TooltipTrigger
      placement={placement || 'right'}
      trigger={trigger || 'click'}
      tooltip={({ getTooltipProps, getArrowProps, tooltipRef, arrowRef, placement }) => {
        return (
          <div
            {...getTooltipProps({
              ref: tooltipRef,
              className: 'tooltip-container',
            })}
          >
            <div
              {...getArrowProps({
                ref: arrowRef,
                'data-placement': placement,
                className: 'tooltip-arrow',
              })}
            />
            <div className=" text-xs">{tooltip}</div>
          </div>
        );
      }}
    >
      {({ getTriggerProps, triggerRef }) => {
        return (
          <span
            {...getTriggerProps({
              ref: triggerRef,
              className: 'trigger',
            })}
          >
            {children}
          </span>
        );
      }}
    </TooltipTrigger>
  );
}

export default BasicTooltip;
