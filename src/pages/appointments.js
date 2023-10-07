import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useEffect, useState, createElement } from 'react'
import axios from '@/lib/axios'
import moment from 'moment'

import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button,
    Spinner,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Select,
    Option,
    Input,
} from '@material-tailwind/react'

import { PlusIcon } from '@heroicons/react/24/outline'

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

    const newAppointment = async ({ ...props }) => {
        await csrf()

        axios
            .post('/api/appointment', props, config)
            .then(() => {
                location.reload()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
            })
    }

    const fetch = async () => {
        await csrf()

        axios
            .get('/api/appointments')
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
                                    {appointment.verified_at ? (
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
                                    ) : (
                                        <Button
                                            variant="gradient"
                                            className="rounded-full"
                                            color="black"
                                            disabled>
                                            Paid
                                        </Button>
                                    )}
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
    }

    useEffect(fetch, [])

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(!open)

    const typeOptions = [
        { value: '', text: 'Choose an option' },
        { value: '1', text: 'In Person' },
        { value: '2', text: 'Teleconsultation' },
    ]

    const doctorIdOptions = [
        { value: '', text: 'Choose an option' },
        { value: '1', text: 'Meredith Grey' },
        { value: '2', text: 'Richard Burke' },
    ]

    const [type, setType] = useState(typeOptions[1].value)
    const [doctor_id, setDoctorId] = useState(doctorIdOptions[1].value)
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')

    const submitForm = async event => {
        event.preventDefault()

        newAppointment({
            type,
            doctor_id,
            date,
            time,
        })
    }

    return (
        <AppLayout
            header={
                <div className="inline-flex w-full">
                    My Appointments
                    <Button
                        color="cyan"
                        className="flex items-center gap-3 rounded-full ml-auto"
                        onClick={handleOpen}>
                        {createElement(PlusIcon, {
                            className: 'h-[18px] w-[18px]',
                        })}
                        New
                    </Button>
                </div>
            }>
            <Head>
                <title>Appointments - SRMC</title>
            </Head>

            <div className="px-2 overflow-hidden">
                <div className="pb-10">{appointments}</div>
            </div>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>New Appointment</DialogHeader>
                <DialogBody>
                    <form>
                        <div className="mb-6">
                            <Select
                                label="Type"
                                value={type}
                                name="type"
                                onChange={event => setType(event)}>
                                {typeOptions.map(option => (
                                    <Option
                                        value={option.value}
                                        key={option.value}>
                                        {option.text}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <div className="mb-6">
                            <Select
                                label="Doctor"
                                value={doctor_id}
                                name="doctor_id"
                                onChange={event => setDoctorId(event)}>
                                {doctorIdOptions.map(option => (
                                    <Option
                                        value={option.value}
                                        key={option.value}>
                                        {option.text}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <div className="mb-6">
                            <Input
                                label="Date"
                                type="date"
                                onChange={event => setDate(event.target.value)}
                            />
                        </div>

                        <div className="mb-6">
                            <Input
                                label="Time"
                                type="time"
                                onChange={event => setTime(event.target.value)}
                            />
                        </div>
                    </form>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="black"
                        onClick={handleOpen}
                        className="mr-1 rounded-full">
                        <span>Cancel</span>
                    </Button>
                    <Button
                        variant="gradient"
                        color="cyan"
                        className="rounded-full"
                        onClick={submitForm}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </AppLayout>
    )
}

export default Appointments
