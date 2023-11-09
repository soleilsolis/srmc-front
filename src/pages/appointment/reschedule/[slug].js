import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { useAppointment } from '@/hooks/appointment'
import Link from 'next/link'
import moment from 'moment'
import { Button, Select, Option, IconButton } from '@material-tailwind/react'
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'

import InputError from '@/components/InputError'

import { useRouter } from 'next/router'

const NewAppointment = () => {
    const router = useRouter()
    const { rescheduleAppointment } = useAppointment()

    const doctorIdOptions = [
        { value: '', text: 'Choose an option' },
        { value: '1', text: 'Meredith Grey' },
        { value: '2', text: 'Richard Burke' },
    ]

    const id = router.query.slug

    const [doctor_id, setDoctorId] = useState(doctorIdOptions[1].value)
    const [dateList, setDateList] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [timeList, setTimeList] = useState('')

    const [errors, setErrors] = useState([])

    const submitForm = async event => {
        event.preventDefault()

        rescheduleAppointment({
            appointment_id: id,
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
                    <Option
                        value={`${time.start_time} - ${time.end_time}`}
                        key={time.id}>
                        {}
                        {`${moment(time.start_time, 'HH:mm:ss').format(
                            'hh:mm A',
                        )} - ${moment(time.end_time, 'HH:mm:ss').format(
                            'hh:mm A',
                        )}`}
                    </Option>
                )),
            )
        })
    }

    const config = {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    }

    useEffect(() => {
        async function fetchData(id) {
            if (typeof id != 'undefined') {
                axios.get(`/api/appointment/${id}`, config).then(res => {
                    populateDateList(res.data.data.doctor_id)
                    setDoctorId(res.data.data.doctor_id)
                })
            }
        }
        fetchData(id)
    }, [id])

    return (
        <AppLayout
            header={
                <div className="inline-flex w-full">
                    <Link href={`/appointment/${router.query.slug}`}>
                        <IconButton variant="text">
                            <ArrowLongLeftIcon className="w-5" />
                        </IconButton>
                    </Link>
                    Reschedule Appointment #{router.query.slug}
                </div>
            }>
            <Head>
                <title>Reschedule Appointment - SRMC</title>
            </Head>

            <form>
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

                    <InputError messages={errors.time} className="mt-2" />
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
