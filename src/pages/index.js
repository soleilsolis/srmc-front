import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import ApplicationLogo from '@/components/ApplicationLogo'

export default function Home() {
    const { user } = useAuth({ middleware: 'guest' })

    return (
        <>
            <Head>
                <title>Sto. Rosario Multispecialty Center</title>
            </Head>

            <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-center pt-8 sm:justify-start sm:pt-0">
                        <ApplicationLogo></ApplicationLogo>
                    </div>

                    <div className="py-4 text-center">
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="text-xl text-cyan-700">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-xl text-cyan-700">
                                    Login
                                </Link>

                                <Link
                                    href="/register"
                                    className="ml-4 text-xl text-cyan-700">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
