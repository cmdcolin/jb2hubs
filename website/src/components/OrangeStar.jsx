import { Star } from 'lucide-react'
import Tooltip from './ui/react-wrappers/Tooltip.jsx'

import styles from './OrangeStar.module.css'

export default function OrangeStar() {
  return (
    <Tooltip text="designated reference">
      <Star
        fill="orange"
        strokeWidth={0}
        className={styles.orangeStar}
      />
    </Tooltip>
  )
}
