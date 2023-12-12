import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useAuth } from '@/hooks/auth'
import { Card, CardBody, Typography, Spinner } from '@material-tailwind/react'
import { useAppointment } from '@/hooks/appointment'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
)

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Appointments From 6 Months',
        },
    },
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                    callback: function (value) {
                        if (value % 1 === 0) {
                            return value
                        }
                    },
                },
            },
        ],
    },
}

const sexOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Male to Female Patient Ratio',
        },
    },
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                    callback: function (value) {
                        if (value % 1 === 0) {
                            return value
                        }
                    },
                },
            },
        ],
    },
}

const Dashboard = () => {
    const { stats } = useAppointment()
    useAuth({
        middleware: 'auth',
        type: ['admin', 'staff'],
    })

    const labels = stats?.appointment_labels ?? []
    const totalAppointmentValues = stats?.total_appointment_values ?? []
    const completedAppointmentValues = stats?.completed_appointment_values ?? []
    const canceledAppointmentValues = stats?.canceled_appointment_values ?? []

    const data = {
        labels,
        datasets: [
            {
                label: 'Total',
                data: totalAppointmentValues.map(value => value),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Completed',
                data: completedAppointmentValues.map(value => value),
                borderColor: 'rgb(27 94 32)',
                backgroundColor: 'rgb(76 175 80)',
            },
            {
                label: 'Canceled',
                data: canceledAppointmentValues.map(value => value),
                backgroundColor: 'rgb(244 67 54 / 0.2)',
                borderColor: 'rgb(183 28 28)',
            },
        ],
    }

    const userPieData = {
        labels: ['Admin', 'Staff', 'Doctor', 'Patient'],
        datasets: [
            {
                label: 'Users',
                data: stats
                    ? [stats.admin, stats.staff, stats.doctor, stats.patient]
                    : [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    }

    const patientPieData = {
        labels: ['Regular', 'PWD', 'Senior'],
        datasets: [
            {
                label: 'Patient Demographics',
                data: stats ? [stats.regular, stats.pwd, stats.senior] : [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    }

    const supplyPieData = {
        labels: ['Vaccine', 'Medical Supply'],
        datasets: [
            {
                label: 'Supply Summary',
                data: stats ? [stats.vaccine, stats.medical_supply] : [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1,
            },
        ],
    }

    const sexData = {
        labels: ['Male', 'Female'],
        datasets: [
            {
                label: 'Male',
                data: stats ? [stats.vaccine, stats.medical_supply] : [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1,
            },
        ],
    }

    const userPieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'User Demographics',
            },
        },
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                        callback: function (value) {
                            if (value % 1 === 0) {
                                return value
                            }
                        },
                    },
                },
            ],
        },
    }

    const patientPieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Patient Demographics',
            },
        },
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                        callback: function (value) {
                            if (value % 1 === 0) {
                                return value
                            }
                        },
                    },
                },
            ],
        },
    }

    const supplyPieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Supply Summary',
            },
        },
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                        callback: function (value) {
                            if (value % 1 === 0) {
                                return value
                            }
                        },
                    },
                },
            ],
        },
    }

    const prognosis_head = ['Most Common findings ', '']

    const prognosis_rows = [
        {
            name: 'Cold',
            job: 'Manager',
            date: '23/04/18',
            count: 123,
        },
        {
            name: 'Conjunctivitis',
            job: 'Developer',
            date: '23/04/18',
            count: 77,
        },
        {
            name: 'Diarrhea',
            job: 'Executive',
            date: '19/09/17',
            count: 50,
        },
        {
            name: 'Headaches',
            job: 'Developer',
            date: '24/12/08',
            count: 23,
        },
        {
            name: 'Sinusitis',
            job: 'Manager',
            date: '04/10/21',
            count: 11,
        },

        {
            name: 'Allergy (Shrimp)',
            job: 'Manager',
            date: '04/10/21',
            count: 3,
        },
    ]

    const supply_head = ['Latest Supply Change ', 'Quantity', 'Price']

    const supply_body = [
        {
            name: 'AstraZeneca',
            count: 5,
            price: 'PHP 2000',
        },
        {
            name: 'Pfizer-BioNTech',
            count: 9,
            price: 'PHP 3000',
        },
        {
            name: 'Sinovac',
            count: 50,
            price: 'PHP 2567',
        },
        {
            name: 'Sputnik V',
            count: 23,
            price: 'PHP 4040',
        },
        {
            name: 'Moderna',
            count: 11,
            price: 'PHP 9783',
        },

        {
            name: 'Moderna',
            count: 3,
            price: 'PHP 3000',
        },
    ]

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
                            Appointments
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

                            <Typography
                                variant="h5"
                                color="blue-gray"
                                className="mb-4 mt-8 col-span-4">
                                Patient Demographics
                            </Typography>
                            <Card>
                                <CardBody>
                                    <Typography variant="h2" color="blue-gray">
                                        {stats.regular}
                                    </Typography>
                                    <Typography variant="h6" color="blue-gray">
                                        Regular Patient
                                    </Typography>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody>
                                    <Typography variant="h2" color="blue-gray">
                                        {stats.pwd}
                                    </Typography>
                                    <Typography variant="h6" color="blue-gray">
                                        PWD Patient
                                    </Typography>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>
                                    <Typography variant="h2" color="blue-gray">
                                        {stats.senior}
                                    </Typography>
                                    <Typography variant="h6" color="blue-gray">
                                        Senior Patient
                                    </Typography>
                                </CardBody>
                            </Card>

                            <Typography
                                variant="h5"
                                color="blue-gray"
                                className="mb-4 mt-8 col-span-4">
                                User Demographics
                            </Typography>

                            <Card className="h-max">
                                <CardBody>
                                    <Typography variant="h2" color="blue-gray">
                                        {stats.admin}
                                    </Typography>
                                    <Typography variant="h6" color="blue-gray">
                                        Admins
                                    </Typography>
                                </CardBody>
                            </Card>
                            <Card className="h-max">
                                <CardBody>
                                    <Typography variant="h2" color="blue-gray">
                                        {stats.staff}
                                    </Typography>
                                    <Typography variant="h6" color="blue-gray">
                                        Staff
                                    </Typography>
                                </CardBody>
                            </Card>
                            <Card className="h-max">
                                <CardBody>
                                    <Typography variant="h2" color="blue-gray">
                                        {stats.doctor}
                                    </Typography>
                                    <Typography variant="h6" color="blue-gray">
                                        Doctors
                                    </Typography>
                                </CardBody>
                            </Card>
                        </div>

                        <Card className="my-6">
                            <CardBody>
                                <Line options={options} data={data} />
                            </CardBody>
                        </Card>

                        <Card className="my-6">
                            <CardBody>
                                <Bar options={sexOptions} data={sexData} />
                            </CardBody>
                        </Card>

                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mt-4">
                            <Card className="h-full w-full overflow-scroll">
                                <table className="w-full min-w-max table-auto text-left">
                                    <thead>
                                        <tr>
                                            {prognosis_head.map(head => (
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
                                        {prognosis_rows.map(
                                            ({ name, count }, index) => {
                                                const isLast =
                                                    index ===
                                                    prognosis_rows.length - 1
                                                const classes = isLast
                                                    ? 'p-4'
                                                    : 'p-4 border-b border-blue-gray-50'

                                                return (
                                                    <tr key={name}>
                                                        <td className={classes}>
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal">
                                                                {name}
                                                            </Typography>
                                                        </td>

                                                        <td className={classes}>
                                                            <Typography
                                                                as="a"
                                                                href="#"
                                                                variant="h5"
                                                                color="blue-gray"
                                                                className="font-medium">
                                                                {count}
                                                            </Typography>
                                                        </td>
                                                    </tr>
                                                )
                                            },
                                        )}
                                    </tbody>
                                </table>
                            </Card>
                            <Card className="h-full w-full overflow-scroll">
                                <table className="w-full min-w-max table-auto text-left">
                                    <thead>
                                        <tr>
                                            {supply_head.map(head => (
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
                                        {supply_body.map(
                                            ({ name, count, price }, index) => {
                                                const isLast =
                                                    index ===
                                                    supply_body.length - 1
                                                const classes = isLast
                                                    ? 'p-4'
                                                    : 'p-4 border-b border-blue-gray-50'

                                                return (
                                                    <tr key={name}>
                                                        <td className={classes}>
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal">
                                                                {name}
                                                            </Typography>
                                                        </td>

                                                        <td className={classes}>
                                                            <Typography
                                                                as="a"
                                                                href="#"
                                                                variant="h5"
                                                                color="blue-gray"
                                                                className="font-medium">
                                                                {count}
                                                            </Typography>
                                                        </td>
                                                        <td className={classes}>
                                                            <Typography
                                                                as="a"
                                                                href="#"
                                                                variant="h5"
                                                                color="blue-gray"
                                                                className="font-medium">
                                                                {price}
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
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mt-4">
                            <Card className="h-full w-full lg:col-span-2 col-span-4">
                                <CardBody>
                                    <Bar
                                        options={patientPieOptions}
                                        data={patientPieData}
                                    />
                                </CardBody>
                            </Card>
                            <Card className="h-full w-full lg:col-span-2 col-span-4">
                                <CardBody>
                                    <Bar
                                        options={userPieOptions}
                                        data={userPieData}
                                    />
                                </CardBody>
                            </Card>
                            <Card className="h-full w-full lg:col-span-2 col-span-4">
                                <CardBody>
                                    <Bar
                                        options={supplyPieOptions}
                                        data={supplyPieData}
                                    />
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
