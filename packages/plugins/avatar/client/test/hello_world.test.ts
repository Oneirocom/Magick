import { digitalBeingMachine } from '../src/states/digital_being';

test('this always passes', () => {
  expect(1).toBe(1);
});


it('should reach "TypeText" "TypeText" event occurs', () => {
  const expectedValue = 'TypeText'
  const actualState = digitalBeingMachine.transition('InitialLoad', 'TypeText');
  expect(actualState.matches(expectedValue)).toBeTruthy();
});


it('should reach "AnimateAgent" from InitialLoad', () => {
  let actualState = digitalBeingMachine.transition('InitialLoad', 'TypeText');
  expect(actualState.matches('TypeText')).toBeTruthy();
  actualState = digitalBeingMachine.transition(actualState, 'AnimateAgent');
  expect(actualState.matches('AgentAnimation')).toBeTruthy();
});
