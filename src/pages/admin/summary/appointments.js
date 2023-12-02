import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { Card, CardBody, Input, Button } from '@material-tailwind/react'
import { useAppointment } from '@/hooks/appointment'
import { useState } from 'react'
import InputError from '@/components/InputError'
import { useAuth } from '@/hooks/auth'

const Summary = () => {
    useAuth({
        middleware: 'auth',
        type: ['admin', 'staff'],
    })
    const { getSummary } = useAppointment()
    const [start_date, setStartDate] = useState()
    const [end_date, setEndDate] = useState()
    const [errors, setErrors] = useState([])

    const submitForm = async e => {
        e.preventDefault()
        getSummary({
            start_date,
            end_date,
            setErrors,
        })
    }

    return (
        <AppLayout header="Export Appointment Summary to Excel File">
            <Head>
                <title>Export Appointment Summary - SRMC</title>
            </Head>
            <div className="md:px-0 px-2 pb-10">
                <Card>
                    <CardBody>
                        <form>
                            <div className="mb-6">
                                <Input
                                    name="start_date"
                                    label="From"
                                    type="date"
                                    value={start_date}
                                    onChange={event =>
                                        setStartDate(event.target.value)
                                    }
                                />

                                <InputError
                                    messages={errors.start_date}
                                    className="mt-2"
                                />
                            </div>
                            <div className="mb-6">
                                <Input
                                    name="end_date"
                                    label="To"
                                    type="date"
                                    value={end_date}
                                    onChange={event =>
                                        setEndDate(event.target.value)
                                    }
                                />
                            </div>
                            <Button
                                color="cyan"
                                onClick={submitForm}
                                className="rounded-full">
                                Download
                            </Button>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </AppLayout>
    )
}

export default Summary
