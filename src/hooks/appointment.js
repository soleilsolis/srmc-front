import axios from '@/lib/axios'
import { useState } from 'react'
import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from '@material-tailwind/react'

export const useAppointment = () => {
    const newAppointment = ({ ...props }) => {
        axios
            .post('/api/appointment', props)
            .then(() => {
                location.reload()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
            })
    }

    const indexAppointments = () => {
        const [appointments, getAppointments] = useState()
        axios
            .get('/api/appointments')
            .then(res => {
                getAppointments(
                    <div className="grid lg:grid-cols-3 gap-2 md:gap-4 md:grid-cols-2 grid-cols-1">
                        {res.data.data.map(appointment => (
                            <Card className="transition ease-in-out mt-6 w-full ">
                                <CardBody>
                                    <Typography
                                        variant="medium"
                                        color="blue-gray">
                                        #{appointment.id}
                                    </Typography>
                                    <Typography variant="h5" color="blue-gray">
                                        {moment(
                                            appointment.scheduled_at,
                                        ).format('MMMM Do, YYYY')}
                                    </Typography>
                                    <Typography
                                        variant="medium"
                                        color="blue-gray">
                                        Dr. Meredith Grey
                                    </Typography>
                                </CardBody>
                                <CardFooter className="pt-0 inline-flex gap-2 flex-row-reverse md:flex-row">
                                    <a
                                        href={appointment.payment_link}
                                        target="_blank"
                                        rel="noreferrer">
                                        <Button
                                            variant="gradient"
                                            className="rounded-full"
                                            color="cyan">
                                            Pay Now
                                        </Button>
                                    </a>
                                    <Button
                                        variant="text"
                                        className="rounded-full"
                                        color="cyan">
                                        Details
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>,
                )
            })
            .catch(error => {
                if (error.response.status !== 409) throw error
            })

        return appointments
    }

    return {
        newAppointment,
        indexAppointments,
    }
}
