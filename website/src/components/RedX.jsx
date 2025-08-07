import { X } from 'lucide-react'
import Tooltip from './ui/react-wrappers/Tooltip.jsx'

import styles from './RedX.module.css'

export default function RedX() {
  return (
    <Tooltip text="RefSeq suppressed">
      <X stroke="red" className={styles.redX} />
    </Tooltip>
  )
}
