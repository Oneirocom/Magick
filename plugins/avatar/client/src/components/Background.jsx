import React from "react"

import styles from "./Background.module.css"

export default function Background() {
  return (
    <div className={styles["backgroundImg"]}>
      <div className={styles["backgroundBlur"]}></div>
      <div className={styles["Background"]}>
      </div>
    </div>
  )
}
