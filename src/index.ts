import { Budget } from './api/budget';
import { LargeArea } from './api/largeArea';
import { LargeServiceArea } from './api/largeServiceArea';
import { ServiceArea } from './api/serviceArea';

export { setApiKey } from './setApiKey';

export const budget = () => {
    return new Budget();
};

export const largeServiceArea = () => {
    return new LargeServiceArea();
};

export const serviceArea = () => {
    return new ServiceArea();
};

export const largeArea = () => {
    return new LargeArea();
};
