import { X } from 'lucide-react'

import styles from './RedX.module.css'

export default function RedX() {
  return (
    <span className={styles.tooltip} data-tooltip="RefSeq suppressed">
      <X stroke="red" className={styles.redX} />
    </span>
  )
}
