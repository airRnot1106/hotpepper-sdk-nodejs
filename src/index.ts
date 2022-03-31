import { Budget } from './api/budget';

export { setApiKey } from './setApiKey';

export const budget = () => {
    return new Budget();
};
