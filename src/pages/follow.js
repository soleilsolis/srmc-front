import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import moment from 'moment'
import Link from 'next/link'
import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button,
    Spinner,
} from '@material-tailwind/react'

import { CalendarDaysIcon } from '@heroicons/react/24/outline'

const Appointments = () => {
    const [appointments, getAppointments] = useState(
        <Spinner className="mx-auto mt-10 h-12 w-12" color="cyan" />,
    )

    const config = {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    }

    const csrf = () => axios.get('/sanctum/csrf-cookie', config)

    const fetch = async () => {
        await csrf()

        axios
            .get('/api/appointments/followUp')
            .then(res => {
                getAppointments(
                    <div className="grid lg:grid-cols-3 gap-2 md:gap-4 md:grid-cols-2 grid-cols-1">
                        {res.data.data.map(appointment => (
                            <Card
                                key={appointment.id}
                                className="transition ease-in-out mt-6 w-full">
                                <CardBody>
                                    <Typography
                                        variant="medium"
                                        color="blue-gray">
                                        #{appointment.id}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        color="blue-gray"
                                        className="inline-flex items-center gap-2">
                                        <CalendarDaysIcon
                                            strokeWidth={1}
                                            className="h-8 w-8"
                                        />
                                        {moment(
                                            appointment.followed_up_at,
                                        ).format('MMM Do, YYYY')}
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        color="blue-gray">
                                        {appointment.doctor_name}
                                    </Typography>
                                    <Typography
                                        variant="large"
                                        color="blue-gray">
                                        {appointment.start_time !== null ? (
                                            moment(
                                                appointment.follow_up_start_time,
                                                'HH:mm',
                                            ).format('h:mm A')
                                        ) : (
                                            <span>&nbsp;</span>
                                        )}
                                    </Typography>
                                </CardBody>
                                <CardFooter className="pt-0 inline-flex gap-2 flex-row-reverse md:flex-row">
                                    <Link
                                        href={'/appointment/' + appointment.id}>
                                        <Button
                                            variant="text"
                                            className="rounded-full"
                                            color="cyan">
                                            Details
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>,
                )
            })
            .catch(error => {
                if (error.response.status !== 409) throw error
            })
    }

    useEffect(() => {
        fetch()
    }, [])

    return (
        <AppLayout
            header={
                <div className="inline-flex w-full">Follow-Up Appointments</div>
            }>
            <Head>
                <title>Follow-Up Appointments - SRMC</title>
            </Head>

            <div className="px-2 overflow-hidden">
                <div className="pb-10">{appointments}</div>
            </div>
        </AppLayout>
    )
}

export default Appointments
