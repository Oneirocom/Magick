// DOCUMENTED
// Import the necessary hooks and types from the required libraries.
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

/**
 * Custom hook that wraps useDispatch with AppDispatch type.
 * Provides typed dispatch for redux actions.
 * Use this instead of the plain useDispatch from react-redux.
 *
 * @returns The typed dispatch function
 */
export const useAppDispatch = () => useDispatch<AppDispatch>()

/**
 * Custom typed useSelector hook.
 * Provides type checking for redux state selections.
 * Use this instead of the plain useSelector from react-redux.
 *
 * @type TypedUseSelectorHook<RootState>
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
