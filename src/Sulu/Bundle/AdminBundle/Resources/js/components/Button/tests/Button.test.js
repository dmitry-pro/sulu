/* eslint-disable flowtype/require-valid-file-annotation */
import React from 'react';
import {render, shallow} from 'enzyme';
import Button from '../Button';

test('Should render with skin primary', () => {
    expect(render(<Button skin="primary" />)).toMatchSnapshot();
});

test('Should render with skin secondary', () => {
    expect(render(<Button skin="secondary" />)).toMatchSnapshot();
});

test('should render disabled with skin secondary', () => {
    expect(render(<Button disabled={true} skin="secondary" />)).toMatchSnapshot();
});

test('Should render with skin link', () => {
    expect(render(<Button skin="link" />)).toMatchSnapshot();
});

test('Should call the callback on click', () => {
    const preventDefaultSpy = jest.fn();
    const onClick = jest.fn();
    const button = shallow(<Button skin="primary" onClick={onClick} />);
    button.find('button').simulate('click', {preventDefault: preventDefaultSpy});
    expect(preventDefaultSpy).toBeCalled();
    expect(onClick).toBeCalled();
});
