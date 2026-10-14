import './BrandTitle.css'

type BrandTitleProps = {
  section?: string
}

export function BrandTitle({ section = 'Administradores' }: BrandTitleProps) {
  return (
    <h1 className="brand-title">
      <span className="brand-title__logo">SKADI</span>
      <span className="brand-title__divider"> | </span>
      <span className="brand-title__section">{section}</span>
    </h1>
  )
}
