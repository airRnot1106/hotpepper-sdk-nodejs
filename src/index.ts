import { Budget } from './api/budget';
import { Gourmet } from './api/gourmet';
import { LargeArea } from './api/largeArea';
import { LargeServiceArea } from './api/largeServiceArea';
import { MiddleArea } from './api/middleArea';
import { ServiceArea } from './api/serviceArea';
import { SmallArea } from './api/smallArea';
import { Special } from './api/special';
import { SpecialCategory } from './api/specialCategory';

export { setApiKey } from './setApiKey';

export const budget = () => new Budget();

export const largeServiceArea = () => new LargeServiceArea();

export const serviceArea = () => new ServiceArea();

export const largeArea = () => new LargeArea();

export const middleArea = () => new MiddleArea();

export const smallArea = () => new SmallArea();

export const specialCategory = () => new SpecialCategory();

export const special = () => new Special();

export const gourmet = () => new Gourmet();
