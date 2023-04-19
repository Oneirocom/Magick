export const createUISlice = (set, get) => {
  return {
    createUISlice: false,
    setCreateUISlice: (newCreateUISlice) => set(() => ({createUISlice: newCreateUISlice})),
  }
}
