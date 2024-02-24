export const getLayoutFromLocalStorage = (spellId: string) => {
  const layout = localStorage.getItem(`composer_layout_${spellId}`)
  return layout ? JSON.parse(layout) : null
}

export const saveLayoutToLocalStorage = (spellId: string, layout: any) => {
  localStorage.setItem(`composer_layout_${spellId}`, JSON.stringify(layout))
}

export const removeLayoutFromLocalStorage = (spellId: string) => {
  localStorage.removeItem(`composer_layout_${spellId}`)
}
