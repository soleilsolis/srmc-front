import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useAppointment } from '@/hooks/appointment'
import { useRouter } from 'next/router'
import {
    Button,
    Select,
    Option,
    Card,
    IconButton,
    CardBody,
} from '@material-tailwind/react'
import Link from 'next/link'
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'
import InputError from '@/components/InputError'
import { useAuth } from '@/hooks/auth'

const NewAppointment = () => {
    useAuth({
        middleware: 'auth',
        type: ['admin', 'staff'],
    })
    const router = useRouter()
    const { newAppointment } = useAppointment()

    const typeOptions = [{ value: '3', text: 'Walk In' }]

    const doctorIdOptions = [
        { value: '', text: 'Choose an option' },
        { value: '1', text: 'Meredith Grey' },
        { value: '2', text: 'Richard Burke' },
    ]

    const [type, setType] = useState(typeOptions[0].value)
    const [doctor_id, setDoctorId] = useState(doctorIdOptions[1].value)
    const [doctorList, setDoctorList] = useState('')
    const [dateList, setDateList] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [timeList, setTimeList] = useState('')

    const [errors, setErrors] = useState([])

    const submitForm = async event => {
        event.preventDefault()

        newAppointment({
            id: router.query.slug,
            type,
            doctor_id,
            date,
            time,
            setErrors,
        })
    }

    const populateDateList = async id => {
        axios.get(`/api/users/doctor/${id}/dates`).then(res => {
            setDateList(
                res.data.data.map(date =>
                    typeof date.date !== 'undefined' ? (
                        <Option value={date.date} key={date.id}>
                            {date.date_label} (
                            <strong>{date.slots} Slots left</strong>)
                        </Option>
                    ) : (
                        []
                    ),
                ),
            )
        })
    }

    const populateTimeList = async (date, id) => {
        axios.get(`/api/users/doctor/${id}/${date}/times`).then(res => {
            setTimeList(
                res.data.data.map(time => (
                    <Option value={`${time.start_time}`} key={time.id}>
                        {`${time.start_time}`}
                    </Option>
                )),
            )
        })
    }

    useEffect(() => {
        axios.get('/api/users/doctors').then(res => {
            setDoctorList(
                res.data.data.map(doctor => (
                    <Option value={doctor.id} key={doctor.id}>
                        {doctor.name} - {doctor.service.name}
                    </Option>
                )),
            )
        })
    }, [])

    return (
        <AppLayout
            header={
                <div className="inline-flex w-full">
                    <Link href={`/admin/appointments`}>
                        <IconButton variant="text">
                            <ArrowLongLeftIcon className="w-5" />
                        </IconButton>
                    </Link>
                    New Appointment for User #{router.query.slug}
                </div>
            }>
            <Head>
                <title>Appointments - SRMC</title>
            </Head>

            <Card>
                <CardBody>
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
                                name="doctor_id"
                                onChange={event => {
                                    setDoctorId(event)
                                    populateDateList(event)
                                    setTimeList([])
                                    setDate('')
                                    setTime('')
                                }}>
                                {doctorList}
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
                                onChange={event => {
                                    setDate(event)
                                    populateTimeList(event, doctor_id)
                                    setTime('')
                                }}>
                                {dateList}
                            </Select>

                            <InputError
                                messages={errors.date}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-6">
                            <Select
                                label="Time"
                                name="time"
                                onChange={event => setTime(event)}>
                                {timeList}
                            </Select>

                            <InputError
                                messages={errors.time}
                                className="mt-2"
                            />
                        </div>
                    </form>

                    <Button
                        variant="gradient"
                        color="cyan"
                        className="rounded-full"
                        onClick={submitForm}>
                        <span>Confirm</span>
                    </Button>
                </CardBody>
            </Card>
        </AppLayout>
    )
}

export default NewAppointment
