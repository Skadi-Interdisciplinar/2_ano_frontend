import add from '../../assets/admin/add.svg'
import './AddButton.css'

type AddButtonProps = {
  onClick?: () => void
  label?: string
}

export function AddButton({ onClick, label = 'Adicionar administrador' }: AddButtonProps) {
  return (
    <button type="button" className="add-button" aria-label={label} onClick={onClick}>
      <img src={add} alt="" width={46} height={48} />
    </button>
  )
}
