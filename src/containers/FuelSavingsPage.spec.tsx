import React from 'react';
import { mount, shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { create } from 'react-test-renderer';
import { FuelSavingsPage } from 'containers/FuelSavingsPage';
import FuelSavingsForm from 'components/FuelSavingsForm';
import initialState from 'reducers/initialState';

describe('<FuelSavingsPage />', () => {
  const saveFuelSavings = jest.fn();
  const calculateFuelSavings = jest.fn();

  it('should contain <FuelSavingsForm />', () => {
    const wrapper = shallow(
      <FuelSavingsPage
        saveFuelSavings={saveFuelSavings}
        calculateFuelSavings={calculateFuelSavings}
        fuelSavings={initialState.fuelSavings}
      />
    );

    expect(wrapper.find(FuelSavingsForm).length).toEqual(1);
  });

  it('calls saveFuelSavings upon clicking save', () => {
    const wrapper = mount(
      <FuelSavingsPage
        saveFuelSavings={saveFuelSavings}
        calculateFuelSavings={calculateFuelSavings}
        fuelSavings={initialState.fuelSavings}
      />
    );

    const save = wrapper.find('input[type="submit"]');
    save.simulate('click');

    expect(saveFuelSavings).toHaveBeenCalledWith(initialState.fuelSavings);
  });

  it('calls calculateFuelSavings upon changing a field', () => {
    const wrapper = mount(
      <FuelSavingsPage
        saveFuelSavings={saveFuelSavings}
        calculateFuelSavings={calculateFuelSavings}
        fuelSavings={initialState.fuelSavings}
      />
    );
    const name = 'newMpg';
    const value = 10;

    const input = wrapper.find('input[name="newMpg"]');
    input.simulate('change', { target: { name, value } });

    expect(calculateFuelSavings).toHaveBeenCalledWith(initialState.fuelSavings, name, value);
  });

  it('should match snapshot', () => {
    const store = configureMockStore()(initialState);
    const component = create(
      <Provider store={store}>
        <FuelSavingsPage
          saveFuelSavings={saveFuelSavings}
          calculateFuelSavings={calculateFuelSavings}
          fuelSavings={initialState.fuelSavings}
        />
      </Provider>
    );
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
