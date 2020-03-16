import React from 'react';
import { Field, reduxForm, reset } from 'redux-form';
import { ControlGroup, Button } from '@blueprintjs/core';

const EpicsListForm = props => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit} className="flex row items-center col-12">
      <ControlGroup fill={true} vertical={false}>
        <Field
          name="name"
          component="input"
          type="text"
          className="bp3-input col-10 mr1"
          placeholder="An Epic Name :D"
        />

        <Field
          name="priority"
          component="input"
          type="text"
          className="bp3-input col-2 mr1"
          placeholder=""
        />

        <Button type="submit" icon="plus" />
      </ControlGroup>
    </form>
  );
};

const FORM = 'ADD_NEW_EPIC_FORM';

export default reduxForm({
  form: FORM,
  onSubmitSuccess: (_result, dispatch) => dispatch(reset(FORM)),
})(EpicsListForm);
