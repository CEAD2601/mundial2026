import { use } from 'react'
import { redirect } from 'next/navigation'

export default function LlenarRedirect({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  redirect(`/eliminatorias/mi-quiniela/${code}`)
}
