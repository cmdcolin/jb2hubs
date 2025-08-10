import { Star } from 'lucide-react'

import styles from './OrangeStar.module.css'
import Tooltip from './ui/react-wrappers/Tooltip.tsx'


export default function OrangeStar() {
  return (
    <Tooltip text="designated reference">
      <Star fill="orange" strokeWidth={0} className={styles.orangeStar} />
    </Tooltip>
  )
}