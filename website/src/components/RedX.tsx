import { X } from 'lucide-react'

import styles from './RedX.module.css'
import Tooltip from './ui/react-wrappers/Tooltip.tsx'


export default function RedX() {
  return (
    <Tooltip text="RefSeq suppressed">
      <X stroke="red" className={styles.redX} />
    </Tooltip>
  )
}