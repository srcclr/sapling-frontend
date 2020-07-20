import React from 'react';

function ClientBadge({ hexColor = '', client, hideInitial = false }) {
  const { email = '' } = client;
  const initial = email.charAt(0);
  return (
    <div>
      {!hideInitial ? (
        <div
          title={email}
          className="rounded-full ml-1 h-6 w-6 capitalize font-black text-xs p-2 flex items-center justify-center border-4"
          style={{ borderColor: hexColor }}
        >
          {initial}
        </div>
      ) : (
        <div
          title={email}
          className="rounded-full ml-1 capitalize font-black text-xs p-2 flex items-center justify-center"
          style={{ backgroundColor: hexColor }}
        />
      )}
    </div>
  );
}

export default ClientBadge;
