import fetch from 'node-fetch';

import { KeyManager } from '../keyManager';
import {
    BooleanNum, ENDPOINT, formatParams, HotPepperResponse, isSuccessfulResponse, MasterResponse,
    ResponseField
} from './apiBase';

interface GourmetSearchQuery {
    address?: string;
    band?: BooleanNum;
    barrier_free?: BooleanNum;
    budget?: string[]; //TODO
    card?: BooleanNum;
    charter?: BooleanNum;
    child?: BooleanNum;
    cocktail?: BooleanNum;
    count?: number;
    course?: BooleanNum;
    credit_card?: string[]; //TODO
    datum?: 'world' | 'tokyo';
    english?: BooleanNum;
    equipment?: BooleanNum;
    free_drink?: BooleanNum;
    free_food?: BooleanNum;
    genre?: string[]; //TODO
    horigotatsu?: BooleanNum;
    id?: string[];
    karaoke?: BooleanNum;
    keyword?: string[];
    ktai?: BooleanNum;
    ktai_coupon?: BooleanNum;
    large_area?: string[]; //TODO
    large_service_area?: string; //TODO
    lat?: number;
    lng?: number;
    lunch?: BooleanNum;
    middle_area?: string[]; //TODO
    midnight?: BooleanNum;
    midnight_meal?: BooleanNum;
    name?: string[];
    name_any?: string[];
    name_kana?: string[];
    night_view?: BooleanNum;
    non_smoking?: BooleanNum;
    open_air?: BooleanNum;
    order?: 1 | 2 | 3 | 4;
    parking?: BooleanNum;
    party_capacity?: number;
    pet?: BooleanNum;
    private_room?: BooleanNum;
    range?: 1 | 2 | 3 | 4 | 5;
    sake?: BooleanNum;
    service_area?: string[]; //TODO
    shochu?: BooleanNum;
    show?: BooleanNum;
    small_area?: string[]; //TODO
    sommelier?: BooleanNum;
    special?: string[]; //TODO
    special_category?: string[]; //TODO
    special_category_or?: string[]; //TODO
    special_or?: string[]; //TODO
    start?: number;
    tatami?: BooleanNum;
    tel?: string;
    tv?: BooleanNum;
    type?: 'lite' | 'creditCard' | 'special' | 'special+credit_card';
    wedding?: BooleanNum;
    wifi?: BooleanNum;
    wine?: BooleanNum;
}

export interface GourmetResponseLite {
    shop: {
        access: string;
        address: string;
        catch: string;
        genre: { name: string; catch: string };
        id: string;
        lat: string;
        lng: string;
        name: string;
        photo: {
            pc: { l: string; m: string; s: string };
        };
        type: 'lite';
        urls: { pc: string };
    }[];
}

export interface GourmetResponseNormal {
    shop: (Omit<GourmetResponseLite['shop'][number], 'type'> & {
        band: string;
        barrier_free: string;
        budget: MasterResponse & { average: string };
        budget_memo: string;
        capacity: number;
        card: string;
        charter: string;
        child: string;
        close: string;
        coupon_urls: { pc: string; sp: string };
        course: string;
        english: string;
        equipment?: string;
        free_drink: string;
        free_food: string;
        genre: MasterResponse & { catch: string };
        horigotatsu: string;
        karaoke: string;
        ktai?: string;
        ktai_coupon: number;
        large_area: MasterResponse;
        large_service_area: MasterResponse;
        logo_image: string;
        lunch: string;
        middle_area: MasterResponse;
        midnight: string;
        mobile_access: string;
        name_kana: string;
        non_smoking: string;
        open: string;
        open_air?: string;
        other_memo: string;
        parking: string;
        party_capacity: number;
        pet: string;
        photo: {
            pc: { l: string; m: string; s: string };
            mobile: { l: string; s: string };
        };
        private_room: string;
        service_area: MasterResponse;
        shop_detail_memo: string;
        show: string;
        small_area: MasterResponse;
        sommelier?: string;
        station_name: string;
        sub_genre: MasterResponse;
        tatami: string;
        tv: string;
        type: 'normal';
        wedding: string;
        wifi: string;
    })[];
}

export interface GourmetResponseSpecial {
    shop: (Omit<GourmetResponseNormal['shop'][number], 'type'> & {
        special: MasterResponse & {
            special_category: MasterResponse;
            title: string;
        };
        type: 'special';
    })[];
}

export interface GourmetResponseCreditCard {
    shop: (Omit<GourmetResponseNormal['shop'][number], 'type'> & {
        credit_card: MasterResponse;
        type: 'creditCard';
    })[];
}

export interface GourmetResponseAll {
    shop: (Omit<GourmetResponseSpecial['shop'][number], 'type'> &
        Omit<GourmetResponseCreditCard, 'type'> & {
            type: 'special+credit_card';
        })[];
}

export type GourmetResponse =
    | GourmetResponseLite
    | GourmetResponseNormal
    | GourmetResponseSpecial
    | GourmetResponseCreditCard
    | GourmetResponseAll;

/**
 * Gourmet Search API.
 *
 * @class Gourmet
 * @export
 * @see https://webservice.recruit.co.jp/doc/hotpepper/reference.html
 */
export class Gourmet {
    private _URL = `${ENDPOINT}/gourmet/v1`;
    private _keyManager = KeyManager.instance;

    private _params: GourmetSearchQuery = {
        id: [],
        keyword: [],
        name: [],
        name_any: [],
        name_kana: [],
    };

    constructor() {}

    /**
     * Sets store address (partial match).
     *
     * @memberof Gourmet
     * @param {string} address Store address.
     * @returns {any} {this}
     */
    address(address: string): this {
        this._params.address = address;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "bands are allowed".
     *
     * @memberof Gourmet
     * @param {BooleanNum} band 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    band(band: BooleanNum): this {
        this._params.band = band;
        return this;
    }
    /**
     * Specify whether to filter by the condition "barrier-free".
     *
     * @memberof Gourmet
     * @param {BooleanNum} barrierFree 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    barrierFree(barrierFree: BooleanNum): this {
        this._params.barrier_free = barrierFree;
        return this;
    }

    /**
     * Filter by budget codes. Refer to the Budget Master API for search for
     * budget codes. Up to 2 pieces can be specified.
     *
     * @memberof Gourmet
     * @param {...string[]} budget Budget codes.
     * @returns {any} {this}
     */
    budget(...budget: string[]): this {
        this._params.budget?.push(...budget);
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "cards are allowed".
     *
     * @memberof Gourmet
     * @param {BooleanNum} card 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    card(card: BooleanNum): this {
        this._params.card = card;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "available for private parties".
     *
     * @memberof Gourmet
     * @param {BooleanNum} charter 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    charter(charter: BooleanNum): this {
        this._params.charter = charter;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "children are allowed".
     *
     * @memberof Gourmet
     * @param {BooleanNum} child 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    child(child: BooleanNum): this {
        this._params.child = child;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "has a good selection
     * of cocktail?"
     *
     * @memberof Gourmet
     * @param {BooleanNum} cocktail 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    cocktail(cocktail: BooleanNum): this {
        this._params.cocktail = cocktail;
        return this;
    }

    /**
     * Specifies the number of search results to be output from.
     *
     * @memberof Gourmet
     * @param {number} count The number of search results to be output from.
     * @returns {any} {this}
     */
    count(count: number): this {
        this._params.count = count;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "with courses".
     *
     * @memberof Gourmet
     * @param {BooleanNum} course 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    course(course: BooleanNum): this {
        this._params.course = course;
        return this;
    }

    /**
     * Filter by credit card codes. Refer to the Credit Card Master API for
     * credit card codes. Multiple ones can be specified.
     *
     * @memberof Gourmet
     * @param {...string[]} creditCard Credit card codes.
     * @returns {any} {this}
     */
    creditCard(...creditCard: string[]): this {
        this._params.credit_card?.push(...creditCard);
        return this;
    }

    /**
     * Specify the geodetic system of latitude and longitude.
     *
     * @memberof Gourmet
     * @param {'world' | 'tokyo'} datum World: World Geodetic System (Default),
     *   tokyo: Old Japan Geodetic System.
     * @returns {any} {this}
     */
    datum(datum: 'world' | 'tokyo'): this {
        this._params.datum = datum;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "English menu available".
     *
     * @memberof Gourmet
     * @param {BooleanNum} english 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    english(english: BooleanNum): this {
        this._params.english = english;
        return this;
    }

    /**
     * Specify whether to filter by the condition "entertainment facilities
     * available". Note: This filter may not work.
     *
     * @memberof Gourmet
     * @param {BooleanNum} equipment 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    equipment(equipment: BooleanNum): this {
        this._params.equipment = equipment;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "all you can drink".
     *
     * @memberof Gourmet
     * @param {BooleanNum} freeDrink 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    freeDrink(freeDrink: BooleanNum): this {
        this._params.free_drink = freeDrink;
        return this;
    }

    /**
     * Specify whether to filter by the condition "all-you-can-eat".
     *
     * @memberof Gourmet
     * @param {BooleanNum} freeFood 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    freeFood(freeFood: BooleanNum): this {
        this._params.free_food = freeFood;
        return this;
    }

    /**
     * Filter by genre codes. Refer to the Genre Master API for genre codes.
     * Multiple ones can be specified.
     *
     * @memberof Gourmet
     * @param {...string[]} genre Genre codes.
     * @returns {any} {this}
     */
    genre(...genre: string[]): this {
        this._params.genre?.push(...genre);
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "with a horigotatsu".
     *
     * @memberof Gourmet
     * @param {BooleanNum} horigotatsu 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    horigotatsu(horigotatsu: BooleanNum): this {
        this._params.horigotatsu = horigotatsu;
        return this;
    }

    /**
     * Specify the key assigned to stores.
     *
     * @memberof Gourmet
     * @param {...string[]} id Id of stores. Up to 20 pieces can be specified.
     * @returns {any} {this}
     */
    id(...id: string[]): this {
        this._params.id?.push(...id);
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "karaoke available".
     *
     * @memberof Gourmet
     * @param {BooleanNum} karaoke 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    karaoke(karaoke: BooleanNum): this {
        this._params.karaoke = karaoke;
        return this;
    }

    /**
     * Specify free words (partial match) such as store name, store name,
     * address, station name, store genre catch, catch. The character code is
     * UTF8. AND search is performed by passing a space-delimited string.
     * Multiple ones can be specified.
     *
     * @memberof Gourmet
     * @param {...string[]} keyword Free words.
     * @returns {any} {this}
     */
    keyword(...keyword: string[]): this {
        this._params.keyword?.push(...keyword);
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "cell phone available".
     * Note: This filter may not work.
     *
     * @memberof Gourmet
     * @param {BooleanNum} ktai 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    ktai(ktai: BooleanNum): this {
        this._params.ktai = ktai;
        return this;
    }

    /**
     * Specify whether or not to filter by the criteria "mobile coupons".
     *
     * @memberof Gourmet
     * @param {BooleanNum} ktaiCoupon 0: false(Default), 1: true, Not specified:
     *   no refinement.
     * @returns {any} {this}
     */
    ktaiCoupon(ktaiCoupon: BooleanNum): this {
        this._params.ktai_coupon = ktaiCoupon;
        return this;
    }

    /**
     * Filter by large area codes. Refer to the Large Area Master API for large
     * area codes. Up to 3 pieces can be specified.
     *
     * @memberof Gourmet
     * @param {...string[]} largeArea Large area codes.
     * @returns {any} {this}
     */
    largeArea(...largeArea: string[]): this {
        this._params.large_area?.push(...largeArea);
        return this;
    }

    /**
     * Filter by large service area codes. Refer to the Large Service Area
     * Master API for large service area codes.
     *
     * @memberof Gourmet
     * @param {string} largeServiceArea Large service area codes.
     * @returns {any} {this}
     */
    largeServiceArea(largeServiceArea: string): this {
        this._params.large_service_area = largeServiceArea;
        return this;
    }

    /**
     * Specify the latitude of the range search.
     *
     * @memberof Gourmet
     * @param {number} lat Latitude.
     * @returns {any} {this}
     */
    lat(lat: number): this {
        this._params.lat = lat;
        return this;
    }

    /**
     * Specify the longitude of the range search.
     *
     * @memberof Gourmet
     * @param {number} lng Longitude.
     * @returns {any} {this}
     */
    lng(lng: number): this {
        this._params.lng = lng;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "with lunch".
     *
     * @memberof Gourmet
     * @param {BooleanNum} lunch 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    lunch(lunch: BooleanNum): this {
        this._params.lunch = lunch;
        return this;
    }

    /**
     * Filter by middle area codes. Refer to the Middle Area Master API for
     * middle area codes. Up to 5 pieces can be specified.
     *
     * @memberof Gourmet
     * @param {...string[]} middleArea Middle area codes.
     * @returns {any} {this}
     */
    middleArea(...middleArea: string[]): this {
        this._params.middle_area?.push(...middleArea);
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "open after 11:00 p.m.".
     *
     * @memberof Gourmet
     * @param {BooleanNum} midnight 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    midnight(midnight: BooleanNum): this {
        this._params.midnight = midnight;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition that "meals are
     * available after 11:00 p.m.".
     *
     * @memberof Gourmet
     * @param {BooleanNum} midnightMeal 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    midnightMeal(midnightMeal: BooleanNum): this {
        this._params.midnight_meal = midnightMeal;
        return this;
    }

    /**
     * Specify names of stores (partial match).
     *
     * @memberof Gourmet
     * @param {...string[]} name Store names.
     * @returns {any} {this}
     */
    name(...name: string[]): this {
        this._params.name?.push(...name);
        return this;
    }

    /**
     * Specify names or name-kanas of stores (partial match).
     *
     * @memberof Gourmet
     * @param {...string[]} nameAny Store names or name-kanas.
     * @returns {any} {this}
     */
    nameAny(...nameAny: string[]): this {
        this._params.name_any?.push(...nameAny);
        return this;
    }

    /**
     * Specify name-kanas of stores (partial match).
     *
     * @memberof Gourmet
     * @param {...string[]} nameKana Store name-kanas.
     * @returns {any} {this}
     */
    nameKana(...nameKana: string[]): this {
        this._params.name_kana?.push(...nameKana);
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "beautiful night view".
     *
     * @memberof Gourmet
     * @param {BooleanNum} nightView 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    nightView(nightView: BooleanNum): this {
        this._params.night_view = nightView;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "non-smoking seats".
     *
     * @memberof Gourmet
     * @param {BooleanNum} nonSmoking 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    nonSmoking(nonSmoking: BooleanNum): this {
        this._params.non_smoking = nonSmoking;
        return this;
    }

    /**
     * Specify whether to filter by the condition "open air". Note: This filter
     * may not work.
     *
     * @memberof Gourmet
     * @param {BooleanNum} openAir 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    openAir(openAir: BooleanNum): this {
        this._params.open_air = openAir;
        return this;
    }

    /**
     * Specify the order of search results. The recommended order will be
     * updated periodically.
     *
     * @memberof Gourmet
     * @param {1 | 2 | 3 | 4} order 1:In order of store name, 2:In order of
     *   genre code, 3:In order of small area code, 4:In order of recommendation
     *   (Default).
     * @returns {any} {this}
     */
    order(order: 1 | 2 | 3 | 4): this {
        this._params.order = order;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "parking available".
     *
     * @memberof Gourmet
     * @param {BooleanNum} parking 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    parking(parking: BooleanNum): this {
        this._params.parking = parking;
        return this;
    }

    /**
     * Specify the minimum banquet capacity.
     *
     * @memberof Gourmet
     * @param {number} partyCapacity Minimum banquet capacity.
     * @returns {any} {this}
     */
    partyCapacity(partyCapacity: number): this {
        this._params.party_capacity = partyCapacity;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "pets are allowed".
     *
     * @memberof Gourmet
     * @param {BooleanNum} pet 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    pet(pet: BooleanNum): this {
        this._params.pet = pet;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "private room available".
     *
     * @memberof Gourmet
     * @param {BooleanNum} privateRoom 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    privateRoom(privateRoom: BooleanNum): this {
        this._params.private_room = privateRoom;
        return this;
    }

    /**
     * Specify the range of the range search in five levels.
     *
     * @memberof Gourmet
     * @param {1 | 2 | 3 | 4 | 5} range 1: 300m, 2: 500m, 3: 1000m (Default), 4:
     *   2000m, 5: 3000m.
     * @returns {any} {this}
     */
    range(range: 1 | 2 | 3 | 4 | 5): this {
        this._params.range = range;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "has a good selection
     * of sake (Japanese rice wine)?"
     *
     * @memberof Gourmet
     * @param {BooleanNum} sake 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    sake(sake: BooleanNum): this {
        this._params.sake = sake;
        return this;
    }

    /**
     * Filter by service area codes. Refer to the Service Area Master API for
     * service area codes. Up to 3 pieces can be specified.
     *
     * @memberof Gourmet
     * @param {...string[]} serviceArea Service area codes.
     * @returns {any} {this}
     */
    serviceArea(...serviceArea: string[]): this {
        this._params.service_area?.push(...serviceArea);
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "has a good selection of shochu?"
     *
     * @memberof Gourmet
     * @param {BooleanNum} shochu 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    shochu(shochu: BooleanNum): this {
        this._params.shochu = shochu;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "live shows available.
     *
     * @memberof Gourmet
     * @param {BooleanNum} show 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    show(show: BooleanNum): this {
        this._params.show = show;
        return this;
    }

    /**
     * Filter by small area codes. Refer to the Small Area Master API for small
     * area codes. Up to 5 pieces can be specified.
     *
     * @memberof Gourmet
     * @param {...string[]} smallArea Small area codes.
     * @returns {any} {this}
     */
    smallArea(...smallArea: string[]): this {
        this._params.small_area?.push(...smallArea);
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "with sommelier". Note:
     * This filter may not work.
     *
     * @memberof Gourmet
     * @param {BooleanNum} sommelier 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    sommelier(sommelier: BooleanNum): this {
        this._params.sommelier = sommelier;
        return this;
    }

    /**
     * Filter by special codes. The search condition is AND. Refer to the
     * Special Master API for special codes. Multiple ones can be specified.
     *
     * @memberof Gourmet
     * @param {...string[]} special Special codes.
     * @returns {any} {this}
     */
    special(...special: string[]): this {
        this._params.special?.push(...special);
        return this;
    }

    /**
     * Filter by special category codes. The search condition is AND. Refer to
     * the Special Category Master API for special category codes. Multiple ones
     * can be specified.
     *
     * @memberof Gourmet
     * @param {...string[]} specialCategory Special category codes.
     * @returns {any} {this}
     */
    specialCategory(...specialCategory: string[]): this {
        this._params.special_category?.push(...specialCategory);
        return this;
    }

    /**
     * Filter by special category codes. The search condition is OR. Refer to
     * the Special Category Master API for special category codes. Multiple ones
     * can be specified.
     *
     * @memberof Gourmet
     * @param {...string[]} specialCategoryOr Special category codes.
     * @returns {any} {this}
     */
    specialCategoryOr(...specialCategoryOr: string[]): this {
        this._params.special_category_or?.push(...specialCategoryOr);
        return this;
    }

    /**
     * Filter by special codes. The search condition is OR. Refer to the Special
     * Master API for special codes. Multiple ones can be specified.
     *
     * @memberof Gourmet
     * @param {...string[]} specialOr Special codes.
     * @returns {any} {this}
     */
    specialOr(...specialOr: string[]): this {
        this._params.special_or?.push(...specialOr);
        return this;
    }

    /**
     * Specify the number of search results to start outputting.
     *
     * @memberof Gourmet
     * @param {number} start The number of search results to start outputting.
     * @returns {any} {this}
     */
    start(start: number): this {
        this._params.start = start;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "with seating".
     *
     * @memberof Gourmet
     * @param {BooleanNum} tatami 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    tatami(tatami: BooleanNum): this {
        this._params.tatami = tatami;
        return this;
    }

    /**
     * Sets store phone number (exact match). Single-byte numbers (no hyphen)
     *
     * @memberof Gourmet
     * @param {string} tel Store phone number.
     * @returns {any} {this}
     */
    tel(tel: string): this {
        this._params.tel = tel;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "with TV / projector".
     *
     * @memberof Gourmet
     * @param {BooleanNum} tv 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    tv(tv: BooleanNum): this {
        this._params.tv = tv;
        return this;
    }

    /**
     * Specifies the type of response item. If lite is specified, only the main
     * items will be output. Refer to the official reference. By specifying
     * credit_card and special, credit cards and specials can be added to the
     * response. Both can be specified by connecting them with +.
     *
     * @memberof Gourmet
     * @param {'lite' | 'creditCard' | 'special' | 'special+credit_card'} type
     *   Type of response item.
     * @returns {any} {this}
     * @see https://webservice.recruit.co.jp/doc/hotpepper/reference.html#a16to
     */
    type(
        type: 'lite' | 'creditCard' | 'special' | 'special+credit_card'
    ): this {
        this._params.type = type;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition, "Inquiries about
     * weddings, after-parties, etc. are possible".
     *
     * @memberof Gourmet
     * @param {BooleanNum} wedding 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    wedding(wedding: BooleanNum): this {
        this._params.wedding = wedding;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "with wedding reception".
     *
     * @memberof Gourmet
     * @param {BooleanNum} wifi 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    wifi(wifi: BooleanNum): this {
        this._params.wifi = wifi;
        return this;
    }

    /**
     * Specify whether or not to filter by the condition "has a good selection of wine?"
     *
     * @memberof Gourmet
     * @param {BooleanNum} wine 0: false(Default), 1: true.
     * @returns {any} {this}
     */
    wine(wine: BooleanNum): this {
        this._params.wine = wine;
        return this;
    }

    async search(): Promise<HotPepperResponse<ResponseField<GourmetResponse>>> {
        const params = new URLSearchParams({
            key: this._keyManager.apiKey,
            format: 'json',
            ...formatParams({ ...this._params }),
        });
        const res = await fetch(`${this._URL}?${params}`);
        const json = <ResponseField<GourmetResponse>>await res.json();
        if (isSuccessfulResponse(json)) {
            json.results.shop.forEach(
                (shop) => (shop.type = this._params.type ?? 'normal')
            );
            return {
                status: 200,
                result: json.results.shop,
                rawJson: json,
            };
        }
        return {
            status: json.results.error[0].code,
            error: json.results.error[0].message,
            rawJson: json,
        };
    }
}
