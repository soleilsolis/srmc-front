import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useEffect, useState, createElement } from 'react'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import { useAppointment } from '@/hooks/appointment'

import {
    Button,
    Select,
    Option,
} from '@material-tailwind/react'

import { CalendarDaysIcon } from '@heroicons/react/24/outline'

import InputError from '@/components/InputError'

import { PlusIcon } from '@heroicons/react/24/outline'

const NewAppointment = () => {
    const { user } = useAuth({ middleware: 'auth' })
    const { newAppointment } = useAppointment()

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
    const [doctorList, setDoctorList] = useState('')
    const [dateList, setDateList] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [timeList, setTimeList] = useState('')

    const [errors, setErrors] = useState([])

    const [openAppointmentForm, setOpenAppointmentForm] = useState(false)
    const handleOpenAppointmentForm = () =>
        setOpenAppointmentForm(!openAppointmentForm)

    const submitForm = async event => {
        event.preventDefault()

        newAppointment({
            type,
            doctor_id,
            date,
            time,
            setErrors,
        })
    }

    const populateDateList = async id => {
        axios.get(`/api/users/doctor/${id}/dates`).then(res => {
            console.log(res.data.data)
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
                    <Option
                        value={`${time.start_time} - ${time.end_time}`}
                        key={time.id}>
                        {`${time.start_time} - ${time.end_time}`}
                    </Option>
                )),
            )
        })
    }

    useEffect(async () => {
        axios.get('/api/users/doctors').then(res => {
            setDoctorList(
                res.data.data.map(doctor => (
                    <Option value={doctor.id} key={doctor.id}>
                        {doctor.name}
                    </Option>
                )),
            )
        })
    }, [])

    return (
        <AppLayout
            header={
                <div className="inline-flex w-full">
                    My Appointments
                    {user && user.type === 'patient' ? (
                        <Button
                            color="cyan"
                            className="flex items-center gap-3 rounded-full ml-auto"
                            onClick={handleOpenAppointmentForm}>
                            {createElement(PlusIcon, {
                                className: 'h-[18px] w-[18px]',
                            })}
                            New
                        </Button>
                    ) : (
                        ''
                    )}
                </div>
            }>
            <Head>
                <title>Appointments - SRMC</title>
            </Head>

            <form>
                <div className="mb-6">
                    <Select
                        label="Type"
                        value={type}
                        name="type"
                        onChange={event => setType(event)}>
                        {typeOptions.map(option => (
                            <Option value={option.value} key={option.value}>
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

                    <InputError messages={errors.doctor_id} className="mt-2" />
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

                    <InputError messages={errors.date} className="mt-2" />
                </div>

                <div className="mb-6">
                    <Select
                        label="Time"
                        name="time"
                        onChange={event => setTime(event)}>
                        {timeList}
                    </Select>

                    <InputError messages={errors.date} className="mt-2" />
                </div>
            </form>

            <Button
                variant="gradient"
                color="cyan"
                className="rounded-full"
                onClick={submitForm}>
                <span>Confirm</span>
            </Button>
        </AppLayout>
    )
}

export default NewAppointment
