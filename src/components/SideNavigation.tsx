import React from 'react';
import { NAVIGATION_LINKS } from 'types';
import classnames from 'classnames';
import { Bell, Zap, Users } from 'react-feather';

const SideNavigation: React.FunctionComponent<{
  active: NAVIGATION_LINKS;
  data: {
    notificationsCount: number;
  };
  onChange: (link: NAVIGATION_LINKS) => void;
}> = ({ active, data, onChange }) => {
  const epicsClassName = classnames({
    'bg-teal-700': active === NAVIGATION_LINKS.EPICS,
  });
  const notificationsClassName = classnames({
    'bg-teal-700': active === NAVIGATION_LINKS.NOTIFICATIONS,
  });
  const usersClassName = classnames({
    'bg-teal-700': active === NAVIGATION_LINKS.USERS,
  });

  const commonClassName = 'p-4 cursor-pointer hover:bg-teal-700 hover:text-teal-700';
  const iconSize = 20;

  const { notificationsCount } = data;
  return (
    <div className="bg-teal-800 text-white">
      <div
        className={`${commonClassName} ${epicsClassName}`}
        onClick={() => onChange(NAVIGATION_LINKS.EPICS)}
      >
        <Zap size={iconSize} className="mx-auto text-teal-400" />
      </div>

      <div
        className={`${commonClassName} ${notificationsClassName}`}
        onClick={() => onChange(NAVIGATION_LINKS.NOTIFICATIONS)}
      >
        <div className="p-2 relative">
          <Bell size={iconSize} className="mx-auto text-teal-400" />

          {notificationsCount > 0 && (
            <div className="badge-sm absolute bottom-0 right-0 px-1 bg-red-600 text-white center rounded-full">
              {notificationsCount}
            </div>
          )}
        </div>
      </div>

      <div
        className={`${commonClassName} ${usersClassName}`}
        onClick={() => onChange(NAVIGATION_LINKS.USERS)}
      >
        <Users size={iconSize} className="mx-auto text-teal-400" />
      </div>
    </div>
  );
};

export default SideNavigation;
