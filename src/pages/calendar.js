import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth'
import { Typography } from '@material-tailwind/react'
import Head from 'next/head'
import Iframe from 'react-iframe'
import Link from 'next/link'

const Calendar = () => {
    const { user } = useAuth({
        middleware: 'auth',
    })

    return (
        <AppLayout header="Google Calendar Integration">
            <Head>
                <title>Google Calendar Integration</title>
            </Head>

            {user && user.calendar_link !== null ? (
                <div>
                    <Iframe
                        src={`https://calendar.google.com/calendar/embed?src=${user.email}&ctz=Asia%2FManila`}
                        style="border: 0"
                        frameborder="0"
                        className="w-full max-h-[1000px] h-[1000px] mb-10"
                    />
                </div>
            ) : (
                <Typography variant="sm">
                    Your Google Calendar is not yet linked. Go to{' '}
                    <Link
                        target="_blank"
                        referrerPolicy="no-referrer"
                        href="https://support.google.com/calendar/answer/37083?hl=en"
                        className="text-cyan-500">
                        this Google article
                    </Link>{' '}
                    to make your Google Calendar public, then go to{' '}
                    <Link href="/profile" className="text-cyan-500">
                        Edit Profile
                    </Link>{' '}
                    to add you calendar's public link.
                </Typography>
            )}
        </AppLayout>
    )
}

export default Calendar
