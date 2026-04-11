import { useNavigate } from 'react-router-dom'
import { Button }      from '@/components/atoms/Button/Button'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className={styles.root}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Página não encontrada</h1>
      <p className={styles.desc}>O endereço que você acessou não existe ou foi movido.</p>
      <Button variant="primary" onClick={() => navigate('/')}>Voltar ao Dashboard</Button>
    </div>
  )
}
