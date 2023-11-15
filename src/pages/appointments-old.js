import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useEffect, useState, createElement } from 'react'
import axios from '@/lib/axios'
import moment from 'moment'
import { useAuth } from '@/hooks/auth'
import { useAppointment } from '@/hooks/appointment'
import Link from 'next/link'
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
} from '@material-tailwind/react'

import { CalendarDaysIcon } from '@heroicons/react/24/outline'

import InputError from '@/components/InputError'

import { PlusIcon } from '@heroicons/react/24/outline'

const Appointments = () => {
    const { user } = useAuth({ middleware: 'auth' })
    const {
        doctors,
        newAppointment,
        cancelAppointment,
        acceptAppointment,
    } = useAppointment()

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
    const [date, setDate] = useState(1)
    const [errors, setErrors] = useState([])

    const [currentAppointment, setCurrentAppointment] = useState([])
    const [xid, setXid] = useState(0)

    const [openAppointmentForm, setOpenAppointmentForm] = useState(false)
    const handleOpenAppointmentForm = () =>
        setOpenAppointmentForm(!openAppointmentForm)

    const [openDetailForm, setOpenDetailForm] = useState(false)
    const handleOpenDetailForm = appointment => {
        setCurrentAppointment(appointment)
        setOpenDetailForm(!openDetailForm)
    }

    const [openCancelForm, setOpenCancelForm] = useState(false)
    const handleCancelForm = id => {
        setXid(id)
        setOpenCancelForm(!openCancelForm)
    }

    const [openAcceptForm, setOpenAcceptForm] = useState(false)
    const handleAcceptForm = id => {
        setXid(id)
        setOpenAcceptForm(!openAcceptForm)
    }

    const submitForm = async event => {
        event.preventDefault()

        newAppointment({
            type,
            doctor_id,
            date,
            setErrors,
        })
    }

    const submitAcceptForm = async event => {
        event.preventDefault()

        acceptAppointment({
            id: xid,
            setErrors,
        })
    }

    const [appointments, getAppointments] = useState(
        <Spinner className="mx-auto mt-10 h-12 w-12" color="cyan" />,
    )

    const config = {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    }

    const csrf = () => axios.get('/sanctum/csrf-cookie', config)

    const cardControl = appointment => {
        if (
            appointment.verified_at === null &&
            appointment.accepted_at !== null &&
            appointment.cancelled_at === null
        ) {
            return (
                <a
                    href={appointment.payment_link}
                    target="_blank"
                    rel="noreferrer">
                    <Button
                        variant="gradient"
                        className="rounded-full mr-2"
                        color="cyan">
                        Pay Now
                    </Button>
                </a>
            )
        } else if (appointment.cancelled_at !== null) {
            return (
                <Button
                    variant="gradient"
                    className="rounded-full"
                    color="red"
                    disabled>
                    Cancelled
                </Button>
            )
        } else if (appointment.verified_at !== null) {
            return (
                <Button
                    variant="gradient"
                    className="rounded-full"
                    color="black"
                    disabled>
                    Paid
                </Button>
            )
        } else {
            return (
                <Button
                    variant="gradient"
                    className="rounded-full"
                    color="yellow">
                    Pending
                </Button>
            )
        }
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
                                        color="blue-gray"
                                        className="flex justify-between items-center">
                                        {appointment.user_name}
                                        <Link
                                            href={
                                                '/appointment/' + appointment.id
                                            }
                                            className="block">
                                            <Button
                                                variant="text"
                                                className="rounded-full block"
                                                color="cyan">
                                                Details
                                            </Button>
                                        </Link>
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
                                            appointment.scheduled_at,
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
                                                appointment.start_time,
                                                'HH:mm',
                                            ).format('h:mm A') +
                                            ' - ' +
                                            moment(
                                                appointment.end_time,
                                                'HH:mm',
                                            ).format('h:mm A')
                                        ) : (
                                            <span>&nbsp;</span>
                                        )}
                                    </Typography>
                                </CardBody>
                                <CardFooter className="pt-0 flex-row-reverse md:flex-row">
                                    {appointment.user_type === 'patient' ? (
                                        <>
                                            {cardControl(appointment)}

                                            {appointment.cancelled_at &&
                                            !appointment.passed === null ? (
                                                <Button
                                                    variant="gradient"
                                                    color="red"
                                                    className="rounded-full"
                                                    onClick={() =>
                                                        handleCancelForm(
                                                            appointment.id,
                                                        )
                                                    }>
                                                    <span>Cancel</span>
                                                </Button>
                                            ) : (
                                                ''
                                            )}
                                        </>
                                    ) : appointment.cancelled_at === null ? (
                                        <div className="inline-flex gap-1">
                                            {appointment.accepted_at ===
                                            null ? (
                                                <Button
                                                    variant="gradient"
                                                    color="cyan"
                                                    className="rounded-full"
                                                    onClick={() =>
                                                        handleAcceptForm(
                                                            appointment.id,
                                                        )
                                                    }>
                                                    <span>Accept</span>
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="gradient"
                                                    color="cyan"
                                                    className="rounded-full"
                                                    disabled>
                                                    <span>Accepted</span>
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <Button
                                            variant="gradient"
                                            className="rounded-full"
                                            color="red"
                                            disabled>
                                            Cancelled
                                        </Button>
                                    )}
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
                <div className="inline-flex w-full">
                    My Appointments
                    {user && user.type === 'patient' ? (
                        <Link href="/new-appointment" className=" ml-auto">
                            <Button
                                color="cyan"
                                className="flex items-center gap-3 rounded-full">
                                {createElement(PlusIcon, {
                                    className: 'h-[18px] w-[18px]',
                                })}
                                New
                            </Button>
                        </Link>
                    ) : (
                        ''
                    )}
                </div>
            }>
            <Head>
                <title>Appointments - SRMC</title>
            </Head>

            <div className="px-2 overflow-hidden">
                <div className="pb-10">{appointments}</div>
            </div>

            <Dialog
                open={openAppointmentForm}
                handler={handleOpenAppointmentForm}>
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
                                {doctors
                                    ? doctors.map(doctor => (
                                          <Option
                                              value={doctor.id}
                                              key={doctor.id}>
                                              {doctor.name}
                                          </Option>
                                      ))
                                    : ''}
                            </Select>

                            <InputError
                                messages={errors.doctor_id}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-6">
                            <Select
                                label="Date"
                                name="date"
                                value={date}
                                onChange={event => setDate(event)}>
                                <Option value="1" key="2">
                                    asdfasd
                                </Option>
                                <Option value="2" key="2">
                                    asdfasd
                                </Option>
                            </Select>

                            <InputError
                                messages={errors.date}
                                className="mt-2"
                            />
                        </div>
                    </form>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="black"
                        onClick={handleOpenAppointmentForm}
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

            <Dialog open={openDetailForm} handler={handleOpenDetailForm}>
                <DialogHeader>#{currentAppointment.id}</DialogHeader>
                <DialogBody>
                    <Typography variant="h2" className="text-gray-800">
                        {moment(currentAppointment.scheduled_at).format(
                            'MMM Do, YYYY',
                        )}
                    </Typography>
                    {user ? user.id : 0}
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="black"
                        onClick={handleOpenDetailForm}
                        className="mr-1 rounded-full">
                        <span>Close</span>
                    </Button>
                </DialogFooter>
            </Dialog>

            <Dialog open={openCancelForm} size="xs" handler={handleCancelForm}>
                <DialogHeader>
                    Cancel Appointment #{currentAppointment.id}
                </DialogHeader>
                <DialogBody>
                    <Typography variant="h4" className="text-red-600">
                        Are you sure you want to cancel this appointment?
                    </Typography>
                </DialogBody>
                <DialogFooter>
                    <div className="inline-flex gap-1">
                        {user && user.type === 'patient' ? (
                            <div className="inline-flex gap-1">
                                <Button
                                    variant="gradient"
                                    color="red"
                                    className="rounded-full"
                                    onClick={() => {
                                        cancelAppointment(xid)
                                    }}>
                                    <span>Yes, Cancel</span>
                                </Button>
                            </div>
                        ) : (
                            ''
                        )}

                        <Button
                            variant="text"
                            color="black"
                            onClick={handleCancelForm}
                            className="mr-1 rounded-full">
                            <span>Close</span>
                        </Button>
                    </div>
                </DialogFooter>
            </Dialog>

            <Dialog open={openAcceptForm} size="xs" handler={handleAcceptForm}>
                <DialogHeader>Accept Appointment?</DialogHeader>
                <DialogBody> </DialogBody>
                <DialogFooter>
                    <div className="inline-flex gap-1">
                        {user && user.type === 'doctor' ? (
                            <div className="inline-flex gap-1">
                                <Button
                                    variant="gradient"
                                    color="cyan"
                                    className="rounded-full"
                                    onClick={submitAcceptForm}>
                                    <span>Yes, Accept</span>
                                </Button>
                            </div>
                        ) : (
                            ''
                        )}

                        <Button
                            variant="text"
                            color="black"
                            onClick={handleAcceptForm}
                            className="mr-1 rounded-full">
                            <span>Close</span>
                        </Button>
                    </div>
                </DialogFooter>
            </Dialog>
        </AppLayout>
    )
}

export default Appointments