import { createContext } from 'react'
import { observable, action, decorate, computed, runInAction } from "mobx";
import * as mobx from 'mobx';

import * as ovBike from '../communicator/getOvBikeData';
import * as geoUtils from '../utils/utilsLocations';

function autoSave(store, save) {
    mobx.autorun(() => {
        const json = JSON.stringify(mobx.toJS(store));
        save(json);
    });
  }

class StoreOvBike {
    identifiersList = []

    app_locations = {
        device: {
            lat: 52.088595,
            lon: 5.248707
        }
    }

    constructor() {
        // this.loadLocations();
        // autoSave(this, this.save.bind(this));
        this.fetchLocations();

        computed(() => this.app_locations.device).observe(changes => {
            this.identifiersList && this.identifiersList.length > 0 && this.identifiersList.map((loc) => (
                loc.details.distance = geoUtils.calcDistance(this.app_locations.device.lat, this.app_locations.device.lon, loc.details.lat, loc.details.lon)
            ))
        })
    }

    loadLocations() {
        let data;
        if (localStorage.getItem('STORE_OVBIKE')) {
            data = JSON.parse(localStorage.getItem('STORE_OVBIKE'));
            if (data.length !== 0) {
                this.identifiersList = data.identifiersList;
            }
        } else {
            
        }
    }

    save(json) {
        this.saveToLS(json);
    }

    saveToLS(json) {
        localStorage.setItem('STORE_OVBIKE', json)
    }

    clearList() {
        this.identifiersList = []
    }

    async fetchLocations() {
        this.state = "pending";
        try {
            const identifiersList = await ovBike.getOvBikeData();

            runInAction(() => {
                this.state = "done"
                this.identifiersList = identifiersList;
            })
        } catch (error) {
            runInAction(() => {
                this.state = "error"
            })
        } finally {
            runInAction(() => {
                this.identifiersList.length > 0 && this.identifiersList.map((loc) => (
                    loc.details.distance = geoUtils.calcDistance(this.app_locations.device.lat, this.app_locations.device.lon, loc.details.lat, loc.details.lon)
                ))
             });
        }
    }

    addIdentifier(module_sku, identifier_sku, identifier_type, title, details) {
        let id = {
            module_sku: module_sku.toUpperCase(),
            sku: identifier_sku.toUpperCase(), 
            type: identifier_type,
            title: title,
            actions: ['delete', 'edit', 'move'],
            isFav: false,
            details: details
        }

        let idx = this.checkIdentifierExists(module_sku, identifier_sku);
        if ( idx == -1) {
            this.identifiersList.push(id);
        } else {
            this.replaceIdentifier(idx, id)
        }
    }

    changeIdentifierTitle(module_sku, identifier_sku, valueNew) {
        let idx =  this.identifiersList.findIndex(x => x.module_sku == module_sku.toUpperCase() && x.sku == identifier_sku.toUpperCase());
        this.identifiersList[idx].title = valueNew;
    }

    checkIdentifierExists(module_sku, identifier_sku) {
        let idx = this.identifiersList.findIndex(x => x.module_sku == module_sku.toUpperCase() && x.sku == identifier_sku.toUpperCase());
        return idx;
    }

    removeIdentifier(module_sku, identifier_sku) {
        let idx =  this.identifiersList.findIndex(x => x.module_sku == module_sku && x.sku == identifier_sku);
        if (idx >= 0) {
            this.identifiersList.splice(idx, 1);
        }
    }

    replaceIdentifier(idx, id) {
        this.identifiersList.splice(idx, 1, id)
    }

    removeIdentifiersBySku(module_sku) {
        this.identifiersList = this.identifiersList
            .filter((identifier) => identifier.module_sku !== module_sku.toUpperCase())
    }

    setLocation(key, loc) {
        this.app_locations[key] = loc;
    }

    setFavourite(module_sku, identifier_sku) {
        let idx =  this.identifiersList.findIndex(x => x.module_sku == module_sku.toUpperCase() && x.identifier_sku == identifier_sku.toUpperCase());
        console.log('SbC ov::', module_sku, identifier_sku,idx, this.identifiersList)
        this.identifiersList[idx].isFav = !this.identifiersList[idx].isFav;
    }

    setAvailability(module_sku, identifier_sku, availability) {
        let idx =  this.identifiersList.findIndex(x => x.module_sku == module_sku.toUpperCase() && x.sku == identifier_sku.toUpperCase());
        if (idx !== -1) {
            this.identifiersList[idx].details.availability = availability.open;
        }
    }
}

decorate(StoreOvBike, {
    identifiersList: observable,
    app_locations: observable,
    clearList: action,
    addIdentifier: action,
    removeIdentifier: action,
    changeIdentifierTitle: action,
    checkIdentifierExist: action,
    setFavourite: action,
    setAvailability: action
  })

export default StoreOvBike;
