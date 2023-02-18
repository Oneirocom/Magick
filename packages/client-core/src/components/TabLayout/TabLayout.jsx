import css from './TabLayout.module.css'

const TabLayout = ({ children }) => {
  return (
    <>
      <div className={css['view-container']}>
        <div style={{ position: 'relative', height: '100%' }}>{children}</div>
      </div>
    </>
  )
}

export default TabLayout
