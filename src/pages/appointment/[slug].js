import { useRouter } from 'next/router'
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useAppointment } from '@/hooks/appointment'
import { useDiagnosis } from '@/hooks/diagnosis'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/auth'
import {
    Button,
    Textarea,
    IconButton,
    Typography,
    Spinner,
} from '@material-tailwind/react'
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import axios from '@/lib/axios'

import InputError from '@/components/InputError'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import moment from 'moment'

const Page = () => {
    const router = useRouter()
    const id = router.query.slug

    const { user } = useAuth({ middleware: 'auth' })

    const { newDiagnosis, editDiagnosis } = useDiagnosis()

    const [findings, setFindings] = useState('')
    const [notes, setNotes] = useState('')
    const [diagnosisId, setDiagnosisId] = useState('')
    const [appointmentId, setAppointmentId] = useState('')
    const [appointment, setAppointment] = useState()

    const [errors, setErrors] = useState([])

    const submitForm = async event => {
        event.preventDefault()

        if (diagnosisId != '') {
            editDiagnosis({
                findings,
                notes,
                diagnosis_id: diagnosisId,
                setErrors,
            })
        } else {
            newDiagnosis({
                findings,
                notes,
                appointment_id: appointmentId,
                setErrors,
            })
        }
    }

    const config = {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    }

    const csrf = () => axios.get('/sanctum/csrf-cookie', config)

    useEffect(() => {
        async function fetchData(id) {
            await csrf()

            if (typeof id != 'undefined') {
                axios.get(`/api/appointment/${id}`, config).then(res => {
                    const appointment = res.data.data
                    setAppointment(appointment)
                    setAppointmentId(appointment.id)

                    if (appointment.diagnosis != null) {
                        setFindings(appointment.diagnosis.findings)
                        setNotes(appointment.diagnosis.notes)
                        setDiagnosisId(appointment.diagnosis.id)
                    }
                })
            }
            // ...
        }
        fetchData(id)
    }, [id])

    return (
        <AppLayout
            header={
                <div className="inline-flex w-full gap-3">
                    <Link href="/appointments">
                        <IconButton variant="text">
                            <ArrowLongLeftIcon className="w-5"></ArrowLongLeftIcon>
                        </IconButton>
                    </Link>
                    Appointment {router.query.slug}
                </div>
            }>
            <Head>
                <title>Appointment {router.query.slug} - SRMC</title>
            </Head>

            <div className="md:px-0 px-2">
                {!appointment ? (
                    <Spinner className="mx-auto mt-10 h-12 w-12" color="cyan" />
                ) : (
                    <>
                        <Typography variant="h5" className="mb-5">
                            Details
                        </Typography>

                        <Typography variant="medium" color="blue-gray">
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
                            {moment(appointment.scheduled_at).format(
                                'MMM Do, YYYY',
                            )}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                            {appointment.doctor_name}
                        </Typography>
                        <Typography variant="large" color="blue-gray">
                            {appointment.start_time !== null ? (
                                moment(appointment.start_time, 'HH:mm').format(
                                    'h:mm a',
                                ) +
                                ' - ' +
                                moment(appointment.end_time, 'HH:mm').format(
                                    'h:mm a',
                                )
                            ) : (
                                <span>&nbsp;</span>
                            )}
                        </Typography>

                        <Typography variant="h5" className="my-5">
                            Diagnosis
                        </Typography>
                        {user && user.type === 'doctor' ? (
                            <>
                                <form>
                                    <div className="w-96 max-w-96 mb-5">
                                        <Textarea
                                            label="Findings"
                                            name="findings"
                                            value={findings}
                                            onChange={event =>
                                                setFindings(event.target.value)
                                            }></Textarea>
                                        <InputError
                                            messages={errors.findings}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="w-96 max-w-96 mb-5">
                                        <Textarea
                                            label="Notes"
                                            name="notes"
                                            value={notes}
                                            onChange={event =>
                                                setNotes(event.target.value)
                                            }></Textarea>

                                        <InputError
                                            messages={errors.notes}
                                            className="mt-2"
                                        />
                                    </div>
                                </form>

                                <Button
                                    color="cyan"
                                    className="rounded-full"
                                    onClick={submitForm}>
                                    Save
                                </Button>
                            </>
                        ) : (
                            <>
                                <Typography variant="h6">Findings</Typography>
                                <Typography
                                    variant="paragraph"
                                    className="mb-10">
                                    {findings}
                                </Typography>
                                <Typography variant="h6">Notes</Typography>
                                <Typography variant="paragraph">
                                    {notes}
                                </Typography>
                            </>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    )
}

export default Page
