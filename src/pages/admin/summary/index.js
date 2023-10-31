import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { Card, CardBody, Input, Button } from '@material-tailwind/react'
import { useAppointment } from '@/hooks/appointment'
import { useState } from 'react'

const Summary = () => {
    const { getSummary } = useAppointment()
    const [start_date, setStartDate] = useState()
    const [end_date, setEndDate] = useState()

    const submitForm = () =>
        getSummary({
            start_date,
            end_date,
            setErrors,
        })

    return (
        <AppLayout
            header={<div className="inline-flex w-full">Export Summary</div>}>
            <Head>
                <title>Export Summary - SRMC</title>
            </Head>
            <div className="md:px-0 px-2">
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
                        </form>

                        <Button
                            color="cyan"
                            onClick={submitForm}
                            className="rounded-full">
                            Download
                        </Button>
                    </CardBody>
                </Card>
            </div>
        </AppLayout>
    )
}

export default Summary
