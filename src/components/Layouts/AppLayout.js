import Navigation from '@/components/Layouts/Navigation'
import { useAuth } from '@/hooks/auth'
import { Typography } from '@material-tailwind/react'

const AppLayout = ({ header, children }) => {
    const { user } = useAuth({ middleware: 'auth' })

    return (
        <div className="min-h-screen bg-gray-50 pt-2">
            <div className="px-2">
                <Navigation user={user} />
            </div>

            {/* Page Heading */}
            <header>
                <div className="max-w-screen-xl  mx-auto pt-6 pb-4 px-4 sm:px-6 lg:px-8">
                    <Typography variant="h4" className="text-gray-800 ">
                        {header}
                    </Typography>
                </div>
            </header>

            {/* Page Content */}
            <main className="max-w-screen-xl mx-auto ">
                <div className="px-2">{children}</div>
            </main>
        </div>
    )
}

export default AppLayout
