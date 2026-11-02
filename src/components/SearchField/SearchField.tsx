import search from '../../assets/admin/search.svg'
import './SearchField.css'

type SearchFieldProps = {
  value: string
  onChange: (value: string) => void
  label?: string
}

export function SearchField({ value, onChange, label = 'Buscar administrador' }: SearchFieldProps) {
  return (
    <label className="search-field">
      <img src={search} alt="" width={18} height={18} />
      <input
        type="search"
        value={value}
        placeholder="Buscar"
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
