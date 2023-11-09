import { useEffect } from 'react'

import { useAuth } from '@/hooks/auth'

import { useRouter } from 'next/router'

export default function Home() {
    const router = useRouter

    const { user } = useAuth({ middleware: 'guest' })

    useEffect(() => {
        user ? router.push('/appointments') : (location.href = '/index.html')
    }, [])
}
