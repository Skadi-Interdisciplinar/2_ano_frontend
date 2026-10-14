import add from '../../assets/admin/add.svg'
import './AddButton.css'

type AddButtonProps = {
  onClick?: () => void
}

export function AddButton({ onClick }: AddButtonProps) {
  return (
    <button type="button" className="add-button" aria-label="Adicionar administrador" onClick={onClick}>
      <img src={add} alt="" width={46} height={48} />
    </button>
  )
}
