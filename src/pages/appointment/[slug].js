import { useRouter } from 'next/router'
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useDiagnosis } from '@/hooks/diagnosis'
import { usePrescription } from '@/hooks/prescription'
import { useAppointment } from '@/hooks/appointment'
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
    Card,
    CardBody,
    Alert,
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
    const {
        newPrescription,
        deletePrescription,
        sendPrescription,
    } = usePrescription()
    const {
        checkInAppointment,
        checkOutAppointment,
        newVitals,
        cancelAppointment,
    } = useAppointment()

    const [findings, setFindings] = useState('')
    const [notes, setNotes] = useState('')
    const [diagnosisId, setDiagnosisId] = useState('')
    const [appointmentId, setAppointmentId] = useState('')
    const [appointment, setAppointment] = useState()
    const [prescribedAt, setPrescribedAt] = useState()
    const [prescriptions, setPrescriptions] = useState([])
    const [prescriptionId, setPrescriptionId] = useState([])
    const [bp, setbp] = useState()
    const [hr, sethr] = useState()
    const [rr, setrr] = useState()
    const [temperature, settemperature] = useState()
    const [O2_sat, setO2sat] = useState()
    const [GCS, setGCS] = useState()
    const [errors, setErrors] = useState([])
    const [alertz, setAlertz] = useState()

    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(!open)
    const [removeOpen, setRemoveOpen] = useState(false)
    const handleRemoveOpen = () => setRemoveOpen(!removeOpen)

    const [openCancelForm, setOpenCancelForm] = useState(false)
    const handleCancelForm = () => setOpenCancelForm(!openCancelForm)

    const [medicationName, setMedicationName] = useState()
    const [genericName, setGenericName] = useState()
    const [dosage, setDosage] = useState('')
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
            generic_name: genericName,
            dosage: dosage[0],
            unit,
            frequency,
            duration,
            administration_type: administrationType,
            appointment_id: appointmentId,
            prescribed_at: prescribedAt,
            prescriptions,
            handleOpen,
            setErrors,
        })
    }

    const submitCheckIn = async () => {
        checkInAppointment({
            id: appointmentId,
        })
    }

    const submitCheckOut = async () => {
        checkOutAppointment({
            id: appointmentId,
        })
    }

    const removePrescription = async event => {
        event.preventDefault()

        deletePrescription({
            id: prescriptionId,
            prescriptions,
            handleRemoveOpen,
            setPrescriptions,
            setErrors,
        })
    }

    const emailThis = async event => {
        event.preventDefault()

        sendPrescription({
            id: appointment.id,
        })

        setAlertz(
            <Alert color="green" className="mt-5" onClick={() => setAlertz()}>
                Email sent to patient.
            </Alert>,
        )
    }

    const submitVitals = async event => {
        event.preventDefault()

        newVitals({
            id: appointmentId,
            bp,
            hr,
            rr,
            temperature,
            O2_sat,
            GCS,
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

                    if (appointment.prescriptions != null) {
                        setPrescriptions(appointment.prescriptions)
                    }

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
                            <ArrowLongLeftIcon className="w-5" />
                        </IconButton>
                    </Link>
                    Appointment {router.query.slug}
                </div>
            }>
            <Head>
                <title>Appointment {router.query.slug} - SRMC</title>
            </Head>

            <div className="md:px-0 px-2 pb-10">
                {!appointment ? (
                    <Spinner className="mx-auto mt-10 h-12 w-12" color="cyan" />
                ) : (
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-10">
                        <div>
                            <Typography variant="h5" className="mb-2">
                                Details
                            </Typography>
                            <Card>
                                <CardBody>
                                    <div>
                                        <Typography
                                            variant="lead"
                                            color="blue-gray">
                                            {appointment.patient.name}
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
                                            variant="lead"
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
                                                {appointment.start_time !==
                                                null ? (
                                                    moment(
                                                        appointment.follow_up_start_time,
                                                        'HH:mm',
                                                    ).format('h:mm A') +
                                                    ' - ' +
                                                    moment(
                                                        appointment.follow_up_end_time,
                                                        'HH:mm',
                                                    ).format('h:mm A')
                                                ) : (
                                                    <span>&nbsp;</span>
                                                )}
                                            </Typography>
                                        </div>
                                    ) : (
                                        ''
                                    )}

                                    {appointment.check_in !== null ? (
                                        <Typography
                                            color="blue-gray"
                                            variant="lead"
                                            className="mt-5">
                                            Checked In:{' '}
                                            {moment(
                                                appointment.check_in,
                                                'HH:mm',
                                            ).format('h:mm A')}
                                        </Typography>
                                    ) : (
                                        ''
                                    )}

                                    {appointment.check_out !== null ? (
                                        <Typography
                                            color="blue-gray"
                                            variant="lead">
                                            Checked Out:{' '}
                                            {moment(
                                                appointment.check_out,
                                                'HH:mm',
                                            ).format('h:mm A')}
                                        </Typography>
                                    ) : (
                                        ''
                                    )}

                                    {appointment.check_in === null &&
                                    user &&
                                    user.type === 'doctor' ? (
                                        <Button
                                            className="rounded-full"
                                            onClick={submitCheckIn}>
                                            Check In
                                        </Button>
                                    ) : (
                                        ''
                                    )}

                                    {appointment.check_out === null &&
                                    appointment.check_in !== null &&
                                    user &&
                                    user.type === 'doctor' ? (
                                        <Button
                                            className="rounded-full"
                                            onClick={submitCheckOut}>
                                            Check Out
                                        </Button>
                                    ) : (
                                        ''
                                    )}

                                    {appointment.cancelled_at == null ? (
                                        <>
                                            {user && user.type === 'patient' ? (
                                                <Link
                                                    href={`/appointment/reschedule/${id}`}>
                                                    <Button className="my-5 rounded-full">
                                                        Reschedule
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={`/appointment/follow/${id}`}>
                                                    <Button className="block mt-5 rounded-full">
                                                        Follow Up
                                                    </Button>
                                                </Link>
                                            )}
                                        </>
                                    ) : (
                                        ''
                                    )}

                                    {user &&
                                    user.type === 'patient' &&
                                    appointment.cancelled_at == null &&
                                    appointment.passed == false ? (
                                        <Button
                                            variant="gradient"
                                            color="red"
                                            className="rounded-full block"
                                            onClick={() =>
                                                handleCancelForm(appointment.id)
                                            }>
                                            <span>Cancel</span>
                                        </Button>
                                    ) : (
                                        ''
                                    )}
                                </CardBody>
                            </Card>

                            <div className="my-2"></div>

                            <Typography variant="h5" className="my-5">
                                Diagnosis
                            </Typography>
                            <Card>
                                <CardBody>
                                    {user && user.type === 'doctor' ? (
                                        <>
                                            <form>
                                                <div className="w-full mb-5">
                                                    <Textarea
                                                        label="Findings"
                                                        name="findings"
                                                        value={findings}
                                                        onChange={event =>
                                                            setFindings(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                    />
                                                    <InputError
                                                        messages={
                                                            errors.findings
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>

                                                <div className="w-full mb-5">
                                                    <Textarea
                                                        label="Notes"
                                                        name="notes"
                                                        value={notes}
                                                        onChange={event =>
                                                            setNotes(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                    />

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
                                            <Typography variant="h6">
                                                Notes
                                            </Typography>
                                            <Typography variant="paragraph">
                                                {notes}
                                            </Typography>
                                        </>
                                    )}
                                </CardBody>
                            </Card>
                        </div>
                        <div>
                            <Typography variant="h5" className="mb-2">
                                Prescriptions
                            </Typography>

                            <Card className="my-2">
                                <CardBody key={'n'}>
                                    {prescriptions.map(prescription => (
                                        <>
                                            <div className="font-bold text-black uppercase">
                                                {prescription.generic_name}
                                            </div>
                                            <Typography
                                                color="blue-gray"
                                                variant="h6"
                                                className="mb-2 flex justify-between gap-2">
                                                <span className="flex gap-2">
                                                    {
                                                        prescription.medication_name
                                                    }{' '}
                                                    ({prescription.dosage}
                                                    {prescription.unit})
                                                    {user &&
                                                    user.type === 'doctor' ? (
                                                        <span
                                                            className="text-red-500 cursor-pointer"
                                                            onClick={() => {
                                                                handleRemoveOpen()
                                                                setPrescriptionId(
                                                                    prescription.id,
                                                                )
                                                            }}>
                                                            Delete
                                                        </span>
                                                    ) : (
                                                        ''
                                                    )}
                                                </span>

                                                <div className="text-cyan-600">
                                                    {
                                                        prescription.administration_type
                                                    }{' '}
                                                </div>
                                            </Typography>
                                            <Typography variant="small">
                                                {prescription.frequency} for{' '}
                                                {prescription.duration} days
                                            </Typography>
                                            <hr className="my-3" />
                                        </>
                                    ))}
                                    {user && user.type === 'doctor' ? (
                                        <>
                                            <Button
                                                color="black"
                                                onClick={handleOpen}
                                                className="mr-1 my-2 rounded-full">
                                                <span>Add Prescription</span>
                                            </Button>

                                            {prescriptions[0] != 'undefined' ? (
                                                <Button
                                                    className="block mt-5 rounded-full"
                                                    onClick={emailThis}>
                                                    Email to Patient
                                                </Button>
                                            ) : (
                                                ''
                                            )}

                                            {alertz}
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </CardBody>
                            </Card>

                            <Typography variant="h5" className="my-5">
                                Vital Signs
                            </Typography>
                            <Card>
                                <CardBody>
                                    <form>
                                        {user.type == 'doctor' ? (
                                            <>
                                                <div className="mb-6">
                                                    <Input
                                                        label="BP"
                                                        name="bp"
                                                        value={appointment.bp}
                                                        onChange={event => {
                                                            setbp(
                                                                event.target
                                                                    .value,
                                                            )
                                                            setErrors([])
                                                        }}
                                                    />
                                                    <InputError
                                                        messages={errors.bp}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className="mb-6">
                                                    <Input
                                                        label="HR (BPM)"
                                                        name="hr"
                                                        value={appointment.hr}
                                                        onChange={event => {
                                                            sethr(
                                                                event.target
                                                                    .value,
                                                            )
                                                            setErrors([])
                                                        }}
                                                    />
                                                    <InputError
                                                        messages={errors.hr}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className="mb-6">
                                                    <Input
                                                        label="RR"
                                                        name="rr"
                                                        value={appointment.rr}
                                                        onChange={event => {
                                                            setrr(
                                                                event.target
                                                                    .value,
                                                            )
                                                            setErrors([])
                                                        }}
                                                    />
                                                    <InputError
                                                        messages={errors.rr}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className="mb-6">
                                                    <Input
                                                        label="Temperature (C)"
                                                        name="temperature"
                                                        value={
                                                            appointment.temperature
                                                        }
                                                        type="number"
                                                        onChange={event => {
                                                            settemperature(
                                                                event.target
                                                                    .value,
                                                            )
                                                            setErrors([])
                                                        }}
                                                    />
                                                    <InputError
                                                        messages={
                                                            errors.temperature
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className="mb-6">
                                                    <Input
                                                        label="O2 Saturation (%)"
                                                        name="O2_sat"
                                                        value={
                                                            appointment.O2_sat
                                                        }
                                                        type="number"
                                                        onChange={event => {
                                                            setO2sat(
                                                                event.target
                                                                    .value,
                                                            )
                                                            setErrors([])
                                                        }}
                                                    />
                                                    <InputError
                                                        messages={errors.O2_sat}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className="mb-6">
                                                    <Input
                                                        label="GCS"
                                                        name="GCS"
                                                        value={appointment.GCS}
                                                        type="number"
                                                        onChange={event => {
                                                            setGCS(
                                                                event.target
                                                                    .value,
                                                            )
                                                            setErrors([])
                                                        }}
                                                    />
                                                    <InputError
                                                        messages={errors.GCS}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <Button
                                                    className="rounded-full"
                                                    variant="gradient"
                                                    color="cyan"
                                                    onClick={submitVitals}>
                                                    <span>Save</span>
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Typography variant="small">
                                                    <span className="text-bold">
                                                        BP:
                                                    </span>{' '}
                                                    {appointment.bp}
                                                </Typography>
                                                <hr className="my-3" />
                                                <Typography variant="small">
                                                    <span className="text-bold">
                                                        HR (BPM):
                                                    </span>{' '}
                                                    {appointment.hr}
                                                </Typography>
                                                <hr className="my-3" />
                                                <Typography variant="small">
                                                    <span className="text-bold">
                                                        RR:
                                                    </span>{' '}
                                                    {appointment.rr}
                                                </Typography>
                                                <hr className="my-3" />
                                                <Typography variant="small">
                                                    <span className="text-bold">
                                                        Temperature (C):
                                                    </span>{' '}
                                                    {appointment.temperature}
                                                </Typography>
                                                <hr className="my-3" />
                                                <Typography variant="small">
                                                    <span className="text-bold">
                                                        O2 Saturation (%):
                                                    </span>{' '}
                                                    {appointment.O2_sat}
                                                </Typography>
                                                <hr className="my-3" />
                                                <Typography variant="small">
                                                    <span className="text-bold">
                                                        GCS:
                                                    </span>{' '}
                                                    {appointment.GCS}
                                                </Typography>
                                                <hr className="my-3" />
                                            </>
                                        )}
                                    </form>
                                </CardBody>
                            </Card>
                        </div>

                        <Dialog
                            open={openCancelForm}
                            size="xs"
                            handler={handleCancelForm}>
                            <DialogHeader>Cancel Appointment</DialogHeader>
                            <DialogBody>
                                <Typography
                                    variant="h4"
                                    className="text-red-600">
                                    Are you sure you want to cancel this
                                    appointment?
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
                                                    cancelAppointment(
                                                        appointment.id,
                                                    )
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
                    </div>
                )}
            </div>

            <Dialog open={open} size="xs" handler={handleOpen}>
                <DialogHeader>Add Prescription</DialogHeader>
                <DialogBody>
                    <form>
                        <div className="mb-6">
                            <Input
                                label="Brand Name"
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
                                label="Generic Name"
                                name="generic_name"
                                value={genericName}
                                onChange={event => {
                                    setGenericName(event.target.value)
                                    setErrors([])
                                }}
                            />
                            <InputError
                                messages={errors.generic_name}
                                className="mt-2"
                            />
                        </div>
                        <div className="mb-6">
                            <Input
                                label="Dosage"
                                name="dosage"
                                value={dosage}
                                type="text"
                                onInput={event => {
                                    let text = event.target.value.match(
                                        /^[0-9]{0,11}/g,
                                    )

                                    text == ''
                                        ? setDosage(
                                              event.target.value == ''
                                                  ? ''
                                                  : dosage,
                                          )
                                        : setDosage(text)
                                }}
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
                                label="Duration (Days)"
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
                                type="date"
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

            <Dialog open={removeOpen} size="xs" handler={handleRemoveOpen}>
                <DialogHeader>Delete Prescription</DialogHeader>
                <DialogBody>
                    <Typography variant="h4" className="text-red-600">
                        Are you sure you want to delete this prescription?
                    </Typography>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        onClick={() => handleRemoveOpen()}
                        className="mr-1 rounded-full">
                        <span>Cancel</span>
                    </Button>
                    <Button
                        className="rounded-full"
                        variant="gradient"
                        color="red"
                        onClick={removePrescription}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </AppLayout>
    )
}

export default Page
