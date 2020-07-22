import React from 'react';
import BasicTooltip from './BasicTooltip';

function ClientBadge({ hexColor = '', client, hideInitial = false, tooltip }) {
  const { email = '' } = client;
  const initial = email.charAt(0);
  return (
    <div>
      <BasicTooltip
        trigger="hover"
        placement={'top'}
        tooltip={<div>{tooltip ? tooltip : email}</div>}
      >
        {!hideInitial ? (
          <div
            title={email}
            className="rounded-sm ml-1 h-6 w-6 capitalize font-black text-xs p-2 flex items-center justify-center border-4 cursor-default"
            style={{ borderColor: hexColor }}
          >
            {initial}
          </div>
        ) : (
          <div
            title={email}
            className="rounded-sm ml-1 capitalize font-black text-xs p-2  cursor-default"
            style={{ backgroundColor: hexColor }}
          />
        )}
      </BasicTooltip>
    </div>
  );
}

export default ClientBadge;
