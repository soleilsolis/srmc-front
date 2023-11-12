import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useAuth } from '@/hooks/auth'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
const Dashboard = () => {
    const router = useRouter
    const { user } = useAuth({ middleware: 'auth' })

    useEffect(() => {
        user ? router.push('/appointments') : (location.href = '/landing.html')
    }, [])

    return (
        <AppLayout>
            <Head>
                <title>SRMC - Dashboard</title>
            </Head>
        </AppLayout>
    )
}

export default Dashboard
