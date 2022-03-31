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

/** Dinner Budget Master API for Search */
export const budget = () => new Budget();

/** Large Service Area Master API */
export const largeServiceArea = () => new LargeServiceArea();

/** Service Area Master API */
export const serviceArea = () => new ServiceArea();

/** Large Area Master API */
export const largeArea = () => new LargeArea();

/** Middle Area Master API */
export const middleArea = () => new MiddleArea();

/** Small Area Master API */
export const smallArea = () => new SmallArea();

/** Genre Master API */
export const genre = () => new Genre();

/** Credit Card Master API */
export const creditCard = () => new CreditCard();

/** Special Category Master API */
export const specialCategory = () => new SpecialCategory();

/** Special Master API */
export const special = () => new Special();

/** Gourmet Search API */
export const gourmet = () => new Gourmet();

/** Shop Search API */
export const shop = () => new Shop();
