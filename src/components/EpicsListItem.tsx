import React from 'react';
import { IEpic } from 'types';
import { Button } from '@blueprintjs/core';

const EpicsListItem = ({ id, name, priority, onDelete }: IEpic & { onDelete: () => void }) => {
  return (
    <div className="bp3-card p2 flex row items-center justify-between mb1">
      <div className="bold col-10">{name}</div>
      <div className="col-2">{priority}</div>
      <Button icon="cross" minimal={true} onClick={() => onDelete(id)} />
    </div>
  );
};

export default EpicsListItem;
