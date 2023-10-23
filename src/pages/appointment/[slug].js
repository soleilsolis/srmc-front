import { useRouter } from 'next/router'
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useDiagnosis } from '@/hooks/diagnosis'
import { usePrescription } from '@/hooks/prescription'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/auth'
import {
    Button,
    Textarea,
    IconButton,
    Input,
    Typography,
    Spinner,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
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
    const { newPrescription } = usePrescription()

    const [findings, setFindings] = useState('')
    const [notes, setNotes] = useState('')
    const [diagnosisId, setDiagnosisId] = useState('')
    const [appointmentId, setAppointmentId] = useState('')
    const [appointment, setAppointment] = useState()
    const [prescribedAt, setPrescribedAt] = useState()

    const [errors, setErrors] = useState([])

    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(!open)

    const [medicationName, setMedicationName] = useState()
    const [dosage, setDosage] = useState()
    const [unit, setUnit] = useState()
    const [frequency, setFrequency] = useState()
    const [duration, setDuration] = useState()
    const [administrationType, setAdministrationType] = useState()

    const submitForm = async event => {
        event.preventDefault()

        diagnosisId != ''
            ? editDiagnosis({
                  findings,
                  notes,
                  diagnosis_id: diagnosisId,
                  setErrors,
              })
            : newDiagnosis({
                  findings,
                  notes,
                  appointment_id: appointmentId,
                  setErrors,
              })
    }

    const submitPrescription = async event => {
        event.preventDefault()

        newPrescription({
            medication_name: medicationName,
            dosage,
            unit,
            frequency,
            duration,
            administration_type: administrationType,
            appointment_id: appointmentId,
            prescribed_at: prescribedAt,
            setErrors,
        })
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
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-10">
                        <div>
                            <div>
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
                                        moment(
                                            appointment.start_time,
                                            'HH:mm',
                                        ).format('h:mm a') +
                                        ' - ' +
                                        moment(
                                            appointment.end_time,
                                            'HH:mm',
                                        ).format('h:mm a')
                                    ) : (
                                        <span>&nbsp;</span>
                                    )}
                                </Typography>
                            </div>

                            {appointment.followed_up_at != null ? (
                                <div className="my-5">
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
                                        variant="large"
                                        color="blue-gray">
                                        {appointment.start_time !== null ? (
                                            moment(
                                                appointment.follow_up_start_time,
                                                'HH:mm',
                                            ).format('h:mm a') +
                                            ' - ' +
                                            moment(
                                                appointment.follow_up_end_time,
                                                'HH:mm',
                                            ).format('h:mm a')
                                        ) : (
                                            <span>&nbsp;</span>
                                        )}
                                    </Typography>
                                </div>
                            ) : (
                                ''
                            )}

                            {user && user.type === 'patient' ? (
                                <Link
                                    className="my-5"
                                    href={`/appointment/reschedule/${id}`}>
                                    <Button
                                        color="black"
                                        className="my-5 rounded-full">
                                        Reschedule
                                    </Button>
                                </Link>
                            ) : (
                                <Link
                                    className="my-5"
                                    href={`/appointment/follow/${id}`}>
                                    <Button
                                        color="black"
                                        className="my-5 rounded-full">
                                        Follow Up
                                    </Button>
                                </Link>
                            )}

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
                                                    setFindings(
                                                        event.target.value,
                                                    )
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
                                    <Typography variant="h6">
                                        Findings
                                    </Typography>
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
                        </div>
                        <div>
                            <Typography variant="h5" className="mb-2">
                                Prescription
                            </Typography>
                            <Button
                                color="cyan"
                                onClick={handleOpen}
                                className="mr-1 my-2 rounded-full">
                                <span>Add Prescription</span>
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={open} size="xs" handler={handleOpen}>
                <DialogHeader>Add Prescription</DialogHeader>
                <DialogBody>
                    <form>
                        <div className="mb-6">
                            <Input
                                label="Medication Name"
                                name="medication_name"
                                value={medicationName}
                                onChange={event => {
                                    setMedicationName(event.target.value)
                                    setErrors([])
                                }}
                            />
                            <InputError
                                messages={errors.medication_name}
                                className="mt-2"
                            />
                        </div>
                        <div className="mb-6">
                            <Input
                                label="Dosage"
                                name="dosage"
                                value={dosage}
                                onChange={event =>
                                    setDosage(event.target.value)
                                }
                            />
                            <InputError
                                messages={errors.dosage}
                                className="mt-2"
                            />
                        </div>
                        <div className="mb-6">
                            <Input
                                label="Unit"
                                name="unit"
                                value={unit}
                                onChange={event => setUnit(event.target.value)}
                            />
                            <InputError
                                messages={errors.unit}
                                className="mt-2"
                            />
                        </div>
                        <div className="mb-6">
                            <Input
                                label="Frequency"
                                name="frequency"
                                value={frequency}
                                onChange={event =>
                                    setFrequency(event.target.value)
                                }
                            />
                            <InputError
                                messages={errors.frequency}
                                className="mt-2"
                            />
                        </div>
                        <div className="mb-6">
                            <Input
                                label="Duration"
                                name="duration"
                                value={duration}
                                onChange={event =>
                                    setDuration(event.target.value)
                                }
                            />
                            <InputError
                                messages={errors.duration}
                                className="mt-2"
                            />
                        </div>
                        <div className="mb-6">
                            <Input
                                label="Administration Type"
                                name="administration_type"
                                value={administrationType}
                                onChange={event =>
                                    setAdministrationType(event.target.value)
                                }
                            />
                            <InputError
                                messages={errors.administration_type}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-6">
                            <Input
                                label="Prescribed At"
                                name="prescribed_at"
                                value={prescribedAt}
                                type='date'
                                onChange={event =>
                                    setPrescribedAt(event.target.value)
                                }
                            />
                            <InputError
                                messages={errors.prescribed_at}
                                className="mt-2"
                            />
                        </div>
                    </form>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        onClick={() => handleOpen()}
                        className="mr-1 rounded-full">
                        <span>Cancel</span>
                    </Button>
                    <Button
                        className="rounded-full"
                        variant="gradient"
                        color="cyan"
                        onClick={submitPrescription}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </AppLayout>
    )
}

export default Page
