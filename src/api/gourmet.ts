import fetch from 'node-fetch';

import { KeyManager } from '../keyManager';
import {
    ENDPOINT, formatParams, HotPepperResponse, isSuccessfulResponse, MasterResponse, ResponseField
} from './apiBase';

type BooleanNum = 0 | 1;

interface GourmetSearchQuery {
    address?: string;
    band?: BooleanNum;
    barrier_free?: BooleanNum;
    budget?: string; //TODO
    card?: BooleanNum;
    charter?: BooleanNum;
    child?: BooleanNum;
    cocktail?: BooleanNum;
    count?: number;
    course?: BooleanNum;
    credit_card?: string; //TODO
    datum?: 'world' | 'tokyo';
    english?: BooleanNum;
    equipment?: BooleanNum;
    free_drink?: BooleanNum;
    free_food?: BooleanNum;
    genre?: string; //TODO
    horigotatsu?: BooleanNum;
    id?: string[];
    karaoke?: BooleanNum;
    keyword?: string[];
    ktai?: BooleanNum;
    ktai_coupon?: BooleanNum;
    large_area?: string; //TODO
    large_service_area?: string; //TODO
    lat?: number;
    lng?: number;
    lunch?: BooleanNum;
    middle_area?: string; //TODO
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
    service_area?: string; //TODO
    shochu?: BooleanNum;
    show?: BooleanNum;
    small_area?: string; //TODO
    sommelier?: BooleanNum;
    special?: string; //TODO
    special_category?: string; //TODO
    special_category_or?: string; //TODO
    special_or?: string; //TODO
    start?: number;
    tatami?: BooleanNum;
    tel?: string;
    tv?: BooleanNum;
    type?: 'lite' | 'special';
    wedding?: BooleanNum;
    wifi?: BooleanNum;
    wine?: BooleanNum;
}

interface GourmetResponseLite {
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

interface GourmetResponseNormal {
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

interface GourmetResponseSpecial {
    shop: (Omit<GourmetResponseNormal['shop'][number], 'type'> & {
        special: MasterResponse & {
            special_category: MasterResponse;
            title: string;
        };
        type: 'special';
    })[];
}

type GourmetResponse =
    | GourmetResponseLite
    | GourmetResponseNormal
    | GourmetResponseSpecial;

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

    address(address: string): this {
        this._params.address = address;
        return this;
    }

    band(band: BooleanNum): this {
        this._params.band = band;
        return this;
    }
    barrierFree(barrierFree: BooleanNum): this {
        this._params.barrier_free = barrierFree;
        return this;
    }

    budget(budget: string): this {
        this._params.budget = budget;
        return this;
    }

    card(card: BooleanNum): this {
        this._params.card = card;
        return this;
    }
    charter(charter: BooleanNum): this {
        this._params.charter = charter;
        return this;
    }
    child(child: BooleanNum): this {
        this._params.child = child;
        return this;
    }
    cocktail(cocktail: BooleanNum): this {
        this._params.cocktail = cocktail;
        return this;
    }
    count(count: number): this {
        this._params.count = count;
        return this;
    }

    course(course: BooleanNum): this {
        this._params.course = course;
        return this;
    }

    creditCard(creditCard: string): this {
        this._params.credit_card = creditCard;
        return this;
    }

    datum(datum: 'world' | 'tokyo'): this {
        this._params.datum = datum;
        return this;
    }

    english(english: BooleanNum): this {
        this._params.english = english;
        return this;
    }

    equipment(equipment: BooleanNum): this {
        this._params.equipment = equipment;
        return this;
    }

    freeDrink(freeDrink: BooleanNum): this {
        this._params.free_drink = freeDrink;
        return this;
    }

    freeFood(freeFood: BooleanNum): this {
        this._params.free_food = freeFood;
        return this;
    }

    genre(genre: string): this {
        this._params.genre = genre;
        return this;
    }

    horigotatsu(horigotatsu: BooleanNum): this {
        this._params.horigotatsu = horigotatsu;
        return this;
    }

    id(id: string[]): this {
        this._params.id = id;
        return this;
    }

    karaoke(karaoke: BooleanNum): this {
        this._params.karaoke = karaoke;
        return this;
    }

    keyword(...keyword: string[]): this {
        this._params.keyword?.push(...keyword);
        return this;
    }

    ktai(ktai: BooleanNum): this {
        this._params.ktai = ktai;
        return this;
    }

    ktaiCoupon(ktaiCoupon: BooleanNum): this {
        this._params.ktai_coupon = ktaiCoupon;
        return this;
    }

    largeArea(largeArea: string): this {
        this._params.large_area = largeArea;
        return this;
    }

    largeServiceArea(largeServiceArea: string): this {
        this._params.large_service_area = largeServiceArea;
        return this;
    }

    lat(lat: number): this {
        this._params.lat = lat;
        return this;
    }

    lng(lng: number): this {
        this._params.lng = lng;
        return this;
    }

    lunch(lunch: BooleanNum): this {
        this._params.lunch = lunch;
        return this;
    }

    middleArea(middleArea: string): this {
        this._params.middle_area = middleArea;
        return this;
    }

    midnight(midnight: BooleanNum): this {
        this._params.midnight = midnight;
        return this;
    }

    midnightMeal(midnightMeal: BooleanNum): this {
        this._params.midnight_meal = midnightMeal;
        return this;
    }

    name(...name: string[]): this {
        this._params.name?.push(...name);
        return this;
    }

    nameAny(...nameAny: string[]): this {
        this._params.name_any?.push(...nameAny);
        return this;
    }

    nameKana(...nameKana: string[]): this {
        this._params.name_kana?.push(...nameKana);
        return this;
    }

    nightView(nightView: BooleanNum): this {
        this._params.night_view = nightView;
        return this;
    }

    nonSmoking(nonSmoking: BooleanNum): this {
        this._params.non_smoking = nonSmoking;
        return this;
    }

    openAir(openAir: BooleanNum): this {
        this._params.open_air = openAir;
        return this;
    }

    order(order: 1 | 2 | 3 | 4): this {
        this._params.order = order;
        return this;
    }

    parking(parking: BooleanNum): this {
        this._params.parking = parking;
        return this;
    }

    partyCapacity(partyCapacity: BooleanNum): this {
        this._params.party_capacity = partyCapacity;
        return this;
    }

    pet(pet: BooleanNum): this {
        this._params.pet = pet;
        return this;
    }

    privateRoom(privateRoom: BooleanNum): this {
        this._params.private_room = privateRoom;
        return this;
    }

    range(range: 1 | 2 | 3 | 4 | 5): this {
        this._params.range = range;
        return this;
    }

    sake(sake: BooleanNum): this {
        this._params.sake = sake;
        return this;
    }

    serviceArea(serviceArea: string): this {
        this._params.service_area = serviceArea;
        return this;
    }

    shochu(shochu: BooleanNum): this {
        this._params.shochu = shochu;
        return this;
    }

    show(show: BooleanNum): this {
        this._params.show = show;
        return this;
    }

    smallArea(smallArea: string): this {
        this._params.small_area = smallArea;
        return this;
    }

    sommelier(sommelier: BooleanNum): this {
        this._params.sommelier = sommelier;
        return this;
    }

    special(special: string): this {
        this._params.special = special;
        return this;
    }

    specialCategory(specialCategory: string): this {
        this._params.special_category = specialCategory;
        return this;
    }

    specialCategoryOr(specialCategoryOr: string): this {
        this._params.special_category_or = specialCategoryOr;
        return this;
    }

    specialOr(specialOr: string): this {
        this._params.special_or = specialOr;
        return this;
    }

    start(start: number): this {
        this._params.start = start;
        return this;
    }

    tatami(tatami: BooleanNum): this {
        this._params.tatami = tatami;
        return this;
    }

    tel(tel: string): this {
        this._params.tel = tel;
        return this;
    }

    tv(tv: BooleanNum): this {
        this._params.tv = tv;
        return this;
    }

    type(type: 'lite' | 'special'): this {
        this._params.type = type;
        return this;
    }

    wedding(wedding: BooleanNum): this {
        this._params.wedding = wedding;
        return this;
    }

    wifi(wifi: BooleanNum): this {
        this._params.wifi = wifi;
        return this;
    }

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
