import React from 'react'
import styles from './styles.module.css'

export default function MagickDemo() {
  return (
    <section style={{ margin: 'auto', marginTop: '4%', marginBottom: '4%' }}>
      <div className="container">
        <div className="row" style={{ justifyContent: 'center' }}>
          <img src={'/img/magick-screen.png'} />
        </div>
      </div>
    </section>
  )
}
