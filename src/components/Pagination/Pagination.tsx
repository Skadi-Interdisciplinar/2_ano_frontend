import next from '../../assets/admin/page-next.svg'
import previous from '../../assets/admin/page-prev.svg'
import './Pagination.css'

type PaginationProps = {
  label: string
  onPrevious?: () => void
  onNext?: () => void
}

export function Pagination({ label, onPrevious, onNext }: PaginationProps) {
  return (
    <div className="pagination">
      <p>{label}</p>
      <button type="button" aria-label="Página anterior" onClick={onPrevious}>
        <img className="pagination__previous" src={previous} alt="" width={12} height={8} />
      </button>
      <button type="button" aria-label="Próxima página" onClick={onNext}>
        <img className="pagination__next" src={next} alt="" width={12} height={8} />
      </button>
    </div>
  )
}
