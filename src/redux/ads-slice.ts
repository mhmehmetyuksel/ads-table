import { createSlice } from '@reduxjs/toolkit'

export interface Ad {
    id:             number;
    status:         boolean;
    name:           string;
    budget:         number;
    spend:          number;
    ctr:            number;
    addtoCart:      number;
    addtoCartValue: number;
    impressions:    number;
    reach:          number;
    campaignId:     number;
    adsetId:        number;
}

export interface AdSet {
    id:             number;
    status:         boolean;
    name:           string;
    budget:         number;
    spend:          number;
    ctr:            number;
    addtoCart:      number;
    addtoCartValue: number;
    impressions:    number;
    reach:          number;
    campaignId:     number;
}

export interface Campaign {
    id:             number;
    status:         boolean;
    name:           string;
    budget:         number;
    spend:          number;
    ctr:            number;
    addtoCart:      number;
    addtoCartValue: number;
    impressions:    number;
    reach:          number;
}

const initialState = {
        ad: [] as Ad[],
        adSet: [] as AdSet[],
        campaign: [] as Campaign[]
}

export const ads = createSlice({
    name: 'ads',
    initialState: initialState,
    reducers: {
    }
})

export const { } = ads.actions

export default ads.reducer