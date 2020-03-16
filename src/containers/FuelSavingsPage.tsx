import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'actions/fuelSavingsActions';
import FuelSavingsForm from 'components/FuelSavingsForm';
import { IFuelSavings } from 'types';
import IStoreState from 'store/IStoreState';

interface IFuelSavingsPageProps {
  fuelSavings: IFuelSavings;
  calculateFuelSavings: (settings: IFuelSavings, fieldName: string, value: number) => void;
  saveFuelSavings: (settings: IFuelSavings) => void;
}

export class FuelSavingsPage extends React.Component<IFuelSavingsPageProps> {
  public saveFuelSavings = () => {
    this.props.saveFuelSavings(this.props.fuelSavings);
  };

  public calculateFuelSavings = e => {
    this.props.calculateFuelSavings(this.props.fuelSavings, e.target.name, e.target.value);
  };

  public render() {
    return (
      <FuelSavingsForm
        onSaveClick={this.saveFuelSavings}
        onChange={this.calculateFuelSavings}
        fuelSavings={this.props.fuelSavings}
      />
    );
  }
}

function mapStateToProps(state: IStoreState) {
  return {
    fuelSavings: state.fuelSavings,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    calculateFuelSavings: bindActionCreators(actions.calculateFuelSavings, dispatch),
    saveFuelSavings: bindActionCreators(actions.saveFuelSavings, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FuelSavingsPage);
