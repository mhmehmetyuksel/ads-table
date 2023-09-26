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
        ads: [] as Ad[],
        adFilters: [] as string[],
        adSets: [] as AdSet[],
        adSetFilters: [] as string[],
        campaigns: [] as Campaign[]
}

export const ads = createSlice({
    name: 'adStore',
    initialState: initialState,
    reducers: {
        setCampaigns: (state, { payload }) => {
            state.campaigns = payload
        },
        setAdSets: (state, { payload }) => {
            state.adSets = payload
        },
        setAds: (state, { payload }) => {
            state.ads = payload
        },
        setAdSetFilter: (state, { payload }) => {
            if(payload.checked) {
                state.adSetFilters.push(payload.id)
            } else {
                state.adSetFilters = state.adSetFilters.filter((filter: string) => filter !== payload.id)
            }
        },
        setAdFilter: (state, { payload }) => {
            if(payload.checked) {
                state.adFilters.push(payload.id)
            } else {
                state.adFilters = state.adFilters.filter((filter: string) => filter !== payload.id)
            }
        }
    }
})

export const { setCampaigns, setAdSets, setAds, setAdSetFilter, setAdFilter } = ads.actions

export default ads.reducer