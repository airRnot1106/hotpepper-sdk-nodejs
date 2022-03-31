import { Budget } from './api/budget';
import { CreditCard } from './api/creditCard';
import { Genre } from './api/genre';
import { Gourmet } from './api/gourmet';
import { LargeArea } from './api/largeArea';
import { LargeServiceArea } from './api/largeServiceArea';
import { MiddleArea } from './api/middleArea';
import { ServiceArea } from './api/serviceArea';
import { Shop } from './api/shop';
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

export const genre = () => new Genre();

export const creditCard = () => new CreditCard();

export const specialCategory = () => new SpecialCategory();

export const special = () => new Special();

export const gourmet = () => new Gourmet();

export const shop = () => new Shop();
