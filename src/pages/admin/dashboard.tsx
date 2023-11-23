import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { Card, CardBody, Typography, Spinner } from '@material-tailwind/react'
import { useAppointment } from '@/hooks/appointment'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import faker from 'faker'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
)

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
}

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

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
                        <Typography
                            variant="h5"
                            color="blue-gray"
                            className="my-4">
                            Appointments (All Time)
                        </Typography>
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

                            <Card>
                                <CardBody>
                                    <Typography variant="h2" color="blue-gray">
                                        {stats.shown}
                                    </Typography>
                                    <Typography variant="h6" color="blue-gray">
                                        Show Up
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

                        <Typography
                            variant="h5"
                            color="blue-gray"
                            className="mb-4 mt-8">
                            Patient Demographics
                        </Typography>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            <Card>
                                <CardBody>
                                    <Typography variant="h2" color="blue-gray">
                                        {stats.canceled}
                                    </Typography>
                                    <Typography variant="h6" color="blue-gray">
                                        Regular
                                    </Typography>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <Typography variant="h2" color="blue-gray">
                                        {stats.pwd}
                                    </Typography>
                                    <Typography variant="h6" color="blue-gray">
                                        PWD
                                    </Typography>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>
                                    <Typography variant="h2" color="blue-gray">
                                        {stats.completed}
                                    </Typography>
                                    <Typography variant="h6" color="blue-gray">
                                        Senior
                                    </Typography>
                                </CardBody>
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
