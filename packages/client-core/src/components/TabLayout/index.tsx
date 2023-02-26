import css from './TabLayout.module.css'

export const TabLayout = ({ children }) => {
  return (
    <>
      <div className={css['view-container']}>
        <div style={{ position: 'relative', height: '100%' }}>{children}</div>
      </div>
    </>
  )
}