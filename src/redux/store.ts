import { configureStore } from '@reduxjs/toolkit'
import {useSelector, TypedUseSelectorHook, useDispatch} from "react-redux"
import adsReducer from './ads-slice'
export const store = configureStore({
    reducer: {
        adsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector 
export const useAppDispatch = () => useDispatch<AppDispatch>()