import { Icon } from '../Landing/icons'

interface Props {
  onBack: () => void
}

export default function BackButton({ onBack }: Props) {
  return (
    <button className="back-btn" onClick={onBack}>
      <Icon name="arrow-left" size={17} />
      <span>Back</span>
    </button>
  )
}
