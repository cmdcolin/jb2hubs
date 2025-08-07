import { Star } from 'lucide-react'

import styles from './OrangeStar.module.css'

export default function OrangeStar() {
  return (
    <Star
      fill="orange"
      strokeWidth={0}
      className={styles.orangeStar}
      title="designated reference"
    />
  )
}
