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

/**
 * Dinner Budget Master API for Search
 *
 * @returns {any} {Budget}
 */
export const budget = (): Budget => new Budget();

/**
 * Large Service Area Master API
 *
 * @returns {any} {LargeServiceArea}
 */
export const largeServiceArea = (): LargeServiceArea => new LargeServiceArea();

/**
 * Service Area Master API
 *
 * @returns {any} {ServiceArea}
 */
export const serviceArea = (): ServiceArea => new ServiceArea();

/**
 * Large Area Master API
 *
 * @returns {any} {LargeArea}
 */
export const largeArea = (): LargeArea => new LargeArea();

/**
 * Middle Area Master API
 *
 * @returns {any} {MiddleArea}
 */
export const middleArea = (): MiddleArea => new MiddleArea();

/**
 * Small Area Master API
 *
 * @returns {any} {SmallArea}
 */
export const smallArea = (): SmallArea => new SmallArea();

/**
 * Genre Master API
 *
 * @returns {any} {Genre}
 */
export const genre = (): Genre => new Genre();

/**
 * Credit Card Master API
 *
 * @returns {any} {CreditCard}
 */
export const creditCard = (): CreditCard => new CreditCard();

/**
 * Special Category Master API
 *
 * @returns {any} {SpecialCategory}
 */
export const specialCategory = (): SpecialCategory => new SpecialCategory();

/**
 * Special Master API
 *
 * @returns {any} {Special}
 */
export const special = (): Special => new Special();

/**
 * Gourmet Search API
 *
 * @returns {any} {Gourmet}
 */
export const gourmet = (): Gourmet => new Gourmet();

/**
 * Shop Search API
 *
 * @returns {any} {Shop}
 */
export const shop = (): Shop => new Shop();
