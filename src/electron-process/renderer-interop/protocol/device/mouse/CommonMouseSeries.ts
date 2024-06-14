import { env } from "../../../others/env";
import { Mouse } from "./Mouse";

export class CommonMouseSeries extends Mouse 
{
    static #instance?: CommonMouseSeries;

    constructor(hid) {
        env.log('CommonMouseSeries','CommonMouseSeries class','begin');
        super();
        this.hid = hid;
    }

    static getInstance(hid) {
        if (this.#instance) {
            env.log('CommonMouseSeries', 'getInstance', `Get exist CommonMouseSeries() INSTANCE`);
            return this.#instance;
        }
        else {
            env.log('CommonMouseSeries', 'getInstance', `New CommonMouseSeries() INSTANCE`);
            this.#instance = new CommonMouseSeries(hid);

            return this.#instance;
        }
    }
}