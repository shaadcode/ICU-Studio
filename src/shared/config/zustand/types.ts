import type { StateCreator } from 'zustand';

export type ZustandSlice<TMergedSlices, TCurrentTargetSlice> = StateCreator<
  TMergedSlices,
  [],
  [],
  TCurrentTargetSlice
>;
