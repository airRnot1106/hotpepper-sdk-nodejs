import { Budget } from './api/budget';
import { LargeServiceArea } from './api/largeServiceArea';

export { setApiKey } from './setApiKey';

export const budget = () => {
    return new Budget();
};

export const largeServiceArea = () => {
    return new LargeServiceArea();
};
