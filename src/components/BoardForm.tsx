import React from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray, Fields, reduxForm, InjectedFormProps } from 'redux-form';
import IStoreState from 'store/IStoreState';
import { Button, EditableText, Text, ButtonGroup, Divider, Icon, Colors } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

import { IBoard, ISprint, ITicket, IEpic } from 'types';
import SplitPane from 'react-split-pane';
// import validate from './validate';

const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  if (!values.sprints || !values.sprints.length) {
    errors.sprints = { _error: 'At least one sprint must be entered' };
  } else {
    const sprintsArrayErrors = [];
    values.sprints.forEach((sprint, sprintIndex) => {
      const sprintErrors = {};
      if (!sprint || !sprint.name) {
        sprintErrors.name = 'Required';
        sprintsArrayErrors[sprintIndex] = sprintErrors;
      }
      if (!sprint || !sprint.capacity) {
        sprintErrors.capacity = 'Required';
        sprintsArrayErrors[sprintIndex] = sprintErrors;
      }
      if (sprint && sprint.tickets && sprint.tickets.length) {
        const hobbyArrayErrors = [];
        sprint.tickets.forEach((hobby, hobbyIndex) => {
          if (!hobby || !hobby.length) {
            hobbyArrayErrors[hobbyIndex] = 'Required';
          }
        });
        if (hobbyArrayErrors.length) {
          sprintErrors.tickets = hobbyArrayErrors;
          sprintsArrayErrors[sprintIndex] = sprintErrors;
        }
        if (sprint.tickets.length > 5) {
          if (!sprintErrors.tickets) {
            sprintErrors.tickets = [];
          }
          // sprintErrors.tickets._error = 'No more than five tickets allowed';
          sprintsArrayErrors[sprintIndex] = sprintErrors;
        }
      }
    });
    if (sprintsArrayErrors.length) {
      errors.sprints = sprintsArrayErrors;
    }
  }
  return errors;
};

const renderField = ({ input, label, type, placeholder, className, meta: { touched, error } }) => (
  <div>
    {label && <label>{label}</label>}
    <div>
      <input
        {...input}
        type={type}
        placeholder={placeholder}
        className={`bp3-input ${className}`}
      />
      {touched && error && <span>{error}</span>}
    </div>
  </div>
);

const renderEditableTextField = ({
  input,
  label,
  type,
  placeholder,
  className,
  onChange,
  meta: { touched, error },
}) => (
  <div>
    {label && <label>{label}</label>}
    <div className="flex row items-center">
      <Text className={`${className}`}>{input.value}</Text>
      {touched && error && <span>{error}</span>}
    </div>
  </div>
);

const renderFields = fields => {
  const { names, sprints = [], index, id, onUpdateSprint } = fields;
  const { name, capacity } = sprints[index];
  const { meta: metaName, input: inputName } = name;
  const { meta: metaCapacity, input: inputCapacity } = capacity;
  const pristine = metaName.pristine && metaCapacity.pristine;

  const sprint: ISprint = {
    name: inputName.value,
    capacity: inputCapacity.value,
    id,
  };

  return (
    <div className="col-12 flex items-center row">
      <Field
        name={names[0]}
        type="text"
        component={renderField}
        placeholder="Sprint Name"
        className="mr1"
      />
      <Field
        name={names[1]}
        type="text"
        component={renderField}
        placeholder="Capacity"
        className="mr1"
      />
      {!pristine && (
        <Button type="button" title="Update Sprint" onClick={() => onUpdateSprint(sprint)}>
          Update
        </Button>
      )}
    </div>
  );
};

const renderSprints = ({
  fields,
  onDeleteSprint,
  onDeleteTicket,
  onUpdateSprint,
  onUpdateTicket,
  onSelectDependency,
  onDeleteDependency,
  isAddingDependency,
  onShowDependencies,
  shownDependencies,
  dependant,
  epics,
  sprints,
}) => {
  if (!fields.length) {
    return <div className="italic pt4 h4 flex row justify-center">No sprints found O_o</div>;
  }
  return (
    <div className="flex flex-column items-start ">
      {fields.map((sprint, index) => {
        const { id }: ISprint = fields.get(index);

        return (
          <div key={index} className="col-12">
            <div className="bp3-dark flex row items-center justify-between bp3-card position--sticky sprint-header col-12 mb2 z3">
              <div className="flex items-center">
                <div className="bold pr1">{id}</div>
                <div className="flex items-center row border-left pl1 border-navy">
                  <Fields
                    id={id}
                    index={index}
                    names={[`${sprint}.name`, `${sprint}.capacity`]}
                    component={renderFields}
                    placeholder="Sprint Name"
                    className="mr1"
                    onUpdateSprint={onUpdateSprint}
                  />
                </div>
              </div>

              <Button
                type="button"
                title="Remove Sprint"
                onClick={() => onDeleteSprint(id)}
                icon="trash"
              />
            </div>
            <FieldArray
              name={`${sprint}.tickets`}
              component={renderTickets}
              onDeleteTicket={onDeleteTicket}
              onUpdateTicket={onUpdateTicket}
              onSelectDependency={onSelectDependency}
              onShowDependencies={onShowDependencies}
              shownDependencies={shownDependencies}
              onDeleteDependency={onDeleteDependency}
              isAddingDependency={isAddingDependency}
              dependant={dependant}
              epics={epics}
              sprints={sprints}
            />
          </div>
        );
      })}
    </div>
  );
};

const renderUnassigned = ({
  onUpdateTicket,
  onDeleteTicket,
  onSelectDependency,
  isAddingDependency,
  dependant,
  onShowDependencies,
  shownDependencies,
  epics,
  sprints,
}) => {
  return (
    <div className="flex flex-column items-start">
      <div className="col-12">
        <div className="h3 bold mb2">Unassigned Stories</div>
        <FieldArray
          name={`unassigned`}
          component={renderTickets}
          onShowDependencies={onShowDependencies}
          shownDependencies={shownDependencies}
          onDeleteTicket={onDeleteTicket}
          onUpdateTicket={onUpdateTicket}
          onSelectDependency={onSelectDependency}
          isAddingDependency={isAddingDependency}
          dependant={dependant}
          epics={epics}
          sprints={sprints}
        />
      </div>
    </div>
  );
};

const renderTickets = ({
  fields,
  meta: { error, pristine },
  onDeleteTicket,
  onUpdateTicket,
  onSelectDependency,
  isAddingDependency,
  onShowDependencies,
  shownDependencies,
  dependant,
  epics,
  sprints,
  onDeleteDependency,
}) => (
  <div className="col-12">
    <div id="tickets" className="flex justify-start flex-wrap tickets">
      {fields.map((ticket, index) => {
        const { id, description, weight, epic, pin, dependencies }: ITicket = fields.get(index);
        const ticketData = {
          id,
          description,
          weight,
          epic,
          pin,
        };

        let canBePicked = isAddingDependency && dependant !== id;
        let extra = '';
        if (!pristine) {
          extra = ' bp3-intent-warning';
        }
        if (canBePicked) {
          // this overrides
          extra = ' bp3-intent-primary';
        }
        // oops i mean this does
        if (shownDependencies.indexOf(id) !== -1) {
          extra = ' bp3-intent-danger';
        }
        return (
          <div
            key={index}
            className={
              'mr2 mb2 ticket p3 bp3-card bp3-interactive relative' +
              (canBePicked ? ' bp3-interactive' : '')
            }
            onClick={() => onSelectDependency(id, isAddingDependency, dependant)}
            onMouseOver={() => onShowDependencies(true, dependencies)}
            onMouseOut={() => onShowDependencies(false, [])}
          >
            <div className={'font-smaller bold bp3-dark bp3-tag mb1' + extra}>ID: {id}</div>
            <Field
              name={`${ticket}.description`}
              type="text"
              component={'textarea'}
              placeholder={'description'}
              className="mb2 bp3-input bp3-fill"
            />
            <div className="">
              <Field
                name={`${ticket}.weight`}
                type="text"
                component={renderField}
                placeholder={'weight'}
                className="mr1"
              />
              <div className="bp3-select">
                <Field name={`${ticket}.epic`} component={'select'} placeholder={'epic'}>
                  {epics.map((e: IEpic) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="bp3-select">
                <Field name={`${ticket}.pin`} component={'select'} placeholder={'pin'}>
                  <option />
                  {sprints.map((s: ISprint) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Field>
              </div>
              {!pristine && (
                <Button
                  type="button"
                  title="Update"
                  onClick={() => onUpdateTicket(ticketData)}
                  icon="floppy-disk"
                />
              )}
              <div className="absolute top-5 right-5">
                <Button
                  type="button"
                  title="Remove Ticket"
                  onClick={() => onDeleteTicket(id)}
                  icon="cross"
                  minimal={true}
                  small={true}
                  className={Colors.LIME1}
                />
              </div>

              <div>
                {dependencies.map((dep, index) => {
                  return (
                    <span key={index} className="bp3-tag mr1 bp3-minimal">
                      {dep}
                      <Icon
                        icon="cross"
                        intent={'danger'}
                        onClick={() => onDeleteDependency(id, dep)}
                        className="cursor--pointer"
                      />
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
    {error && (
      <li className="error" s>
        {error}
      </li>
    )}
  </div>
);

interface IBoardFormProps {
  isAddingDependency: boolean;
  dependant?: number;
  onCreateTicket: (e: any) => void;
  onCreateSprint: (e: any) => void;
  onAddDependency: (e: any) => void;
  onDeleteDependency: (e: any, f: any) => void;
  onShowDependencies: (e: boolean, f: number[]) => void;
  shownDependencies: number[];
  onSelectDependency: (e: any, e1: any, e2: any) => void;
  onUpdateSprint: (sprint: ISprint) => void;
  onUpdateTicket: (ticket: ITicket) => void;
  onDeleteSprint: (sprintId: number) => void;
  onBoardDetailsChange?: (e: any) => void; // Not implemented yet
  onDeleteTicket: (e: any) => void;
  onExportCsv: () => void;
  isExportingCsv: boolean;
  epics: IEpic[];
  sprints: ISprint[];
}

const BoardForm = (props: InjectedFormProps & IBoardFormProps) => {
  const {
    handleSubmit,
    onCreateTicket,
    onCreateSprint,
    onAddDependency,
    onExportCsv,
    onSelectDependency,
    isAddingDependency,
    onDeleteDependency,
    onShowDependencies,
    shownDependencies,
    dependant,
    onUpdateTicket,
    onUpdateSprint,
    onDeleteSprint,
    onDeleteTicket,
    isExportingCsv,
    pristine,
    reset,
    submitting,
    epics,
    sprints,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <SplitPane
        split="horizontal"
        minSize={260}
        primary="second"
        pane1Style={{ overflow: 'auto' }}
      >
        <div className="col-12">
          <div id="board-header" className="flex row justify-between position--sticky top--0 z4 p2">
            <Link to="/boards">Back</Link>
            <Field name="name" component={renderEditableTextField} className={'h2 bold'} />
            <ButtonGroup vertical={false}>
              <Button type="button" onClick={onExportCsv} loading={isExportingCsv}>
                Export CSV
              </Button>
              <Divider />
              <Button type="button" onClick={_ => onAddDependency(isAddingDependency)}>
                {isAddingDependency ? 'Cancel' : 'Add Dependency'}
              </Button>
              <Button type="button" onClick={onCreateSprint}>
                Add Sprint
              </Button>
              {epics.length > 0 && (
                <Button type="button" onClick={onCreateTicket}>
                  Add Story
                </Button>
              )}
              <Divider />
              <Button type="submit" disabled={submitting}>
                Solve
              </Button>
            </ButtonGroup>
          </div>
          <div className="col-12 mt2 p2">
            <FieldArray
              name="sprints"
              component={renderSprints}
              onUpdateSprint={onUpdateSprint}
              onDeleteSprint={onDeleteSprint}
              onDeleteTicket={onDeleteTicket}
              onUpdateTicket={onUpdateTicket}
              onSelectDependency={onSelectDependency}
              onShowDependencies={onShowDependencies}
              shownDependencies={shownDependencies}
              isAddingDependency={isAddingDependency}
              onDeleteDependency={onDeleteDependency}
              dependant={dependant}
              epics={epics}
              sprints={sprints}
            />
          </div>
        </div>
        <div id="bottom-pane" className="p2 overflow-scroll col-12">
          <Field
            name={'unassigned'}
            component={renderUnassigned}
            onDeleteTicket={onDeleteTicket}
            onUpdateTicket={onUpdateTicket}
            onSelectDependency={onSelectDependency}
            isAddingDependency={isAddingDependency}
            shownDependencies={shownDependencies}
            onShowDependencies={onShowDependencies}
            dependant={dependant}
            epics={epics}
            sprints={sprints}
          />
        </div>
      </SplitPane>
    </form>
  );
};

const WrappedBoardForm = reduxForm<{}, IBoardFormProps>({
  form: 'BOARD_FORM', // a unique identifier for this form
  enableReinitialize: true,
  destroyOnUnmount: false,
  validate,
})(BoardForm);

export default connect((state: IStoreState) => {
  return {
    initialValues: state.boardState.data,
  };
})(WrappedBoardForm);
