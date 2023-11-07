import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { Card, CardBody, Typography, Spinner } from '@material-tailwind/react'
import { useAppointment } from '@/hooks/appointment'

const Dashboard = () => {
    const { stats } = useAppointment()
    const TABLE_HEAD = ['#', 'Patient', 'Doctor', 'Date']

    return (
        <AppLayout header={<div className="inline-flex w-full">Dashboard</div>}>
            <Head>
                <title>Dashboard - SRMC</title>
            </Head>
            <div className="md:px-0 px-2 pb-10">
                {stats ? (
                    <>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            <Card>
                                <CardBody>
                                    <Typography variant="h2" color="blue-gray">
                                        {stats.pending}
                                    </Typography>
                                    <Typography variant="h6" color="blue-gray">
                                        Pending
                                    </Typography>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>
                                    <Typography variant="h2" color="blue-gray">
                                        {stats.completed}
                                    </Typography>
                                    <Typography variant="h6" color="blue-gray">
                                        Completed
                                    </Typography>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <Typography variant="h2" color="blue-gray">
                                        {stats.canceled}
                                    </Typography>
                                    <Typography variant="h6" color="blue-gray">
                                        Canceled
                                    </Typography>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mt-4">
                            <Card className="h-full w-full lg:col-span-2 col-span-4">
                                <CardBody className="w-full">
                                    <Typography variant="h5" color="blue-gray">
                                        Latest Appointments
                                    </Typography>
                                </CardBody>
                                <table className="w-full min-w-max table-auto text-left">
                                    <thead>
                                        <tr>
                                            {TABLE_HEAD.map(head => (
                                                <th
                                                    key={head}
                                                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal leading-none opacity-70">
                                                        {head}
                                                    </Typography>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.appointments.map(
                                            (
                                                {
                                                    patient,
                                                    doctor,
                                                    scheduled_at,
                                                    id,
                                                },
                                                index,
                                            ) => {
                                                const isLast =
                                                    index ===
                                                    stats.appointments.length -
                                                        1
                                                const classes = isLast
                                                    ? 'p-4'
                                                    : 'p-4 border-b border-blue-gray-50'

                                                return (
                                                    <tr key={patient.name}>
                                                        <td className={classes}>
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal">
                                                                {id}
                                                            </Typography>
                                                        </td>
                                                        <td className={classes}>
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal">
                                                                {patient.name}
                                                            </Typography>
                                                        </td>
                                                        <td className={classes}>
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal">
                                                                {doctor.name}
                                                            </Typography>
                                                        </td>
                                                        <td className={classes}>
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal">
                                                                {scheduled_at}
                                                            </Typography>
                                                        </td>
                                                    </tr>
                                                )
                                            },
                                        )}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                    </>
                ) : (
                    <Spinner className="mx-auto mt-10 h-12 w-12" color="cyan" />
                )}
            </div>
        </AppLayout>
    )
}

export default Dashboard
