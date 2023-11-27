import Head from 'next/head'
import AppLayout from '@/components/Layouts/AppLayout'
import {
    MagnifyingGlassIcon,
    EyeIcon,
    PlusIcon,
} from '@heroicons/react/24/outline'
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Avatar,
    IconButton,
    Tooltip,
} from '@material-tailwind/react'
import { useEffect, useState, createElement } from 'react'
import { useAppointment } from '@/hooks/appointment'
import { useAuth } from '@/hooks/auth'
import Link from 'next/link'
import moment from 'moment'

const TABS = [
    {
        label: 'All',
        value: 'all',
    },
    {
        label: 'Pending',
        value: 'pending',
    },
    {
        label: 'Accepted',
        value: 'accepted',
    },
    {
        label: 'Completed',
        value: 'completed',
    },
    {
        label: 'Canceled',
        value: 'canceled',
    },
]

const TABLE_HEAD = [
    '',
    'Patient',
    'Doctor',
    'Schedule',
    'Status',
    'Payment',
    '',
]

const Appointments = () => {
    const { user } = useAuth({
        middleware: 'auth',
        type: ['patient', 'doctor'],
    })

    const [status, setStatus] = useState('all')
    const [page, setPage] = useState(1)

    const { appointmentsQuery } = useAppointment()
    const [pages, setPages] = useState([])

    const getAppointments = (status, page) => {
        appointmentsQuery({ status, page }).then(res => {
            setPages(res.data.data)
        })
    }

    useEffect(() => getAppointments(status, 1), [])

    return (
        <AppLayout>
            <Head>
                <title>Appointments - SRMC</title>
            </Head>

            <div className="md:px-0 px-2 pb-10">
                <Card className="h-full w-full">
                    <CardHeader
                        floated={false}
                        shadow={false}
                        className="rounded-none">
                        <div className="mb-8 flex items-center justify-between gap-8">
                            <div>
                                <Typography variant="h5" color="blue-gray">
                                    Appointments list
                                </Typography>
                                <Typography
                                    color="gray"
                                    className="mt-1 font-normal">
                                    See information about all Appointments
                                </Typography>
                            </div>

                            <div>
                                {user && user.type === 'patient' ? (
                                    <Link
                                        href="/new-appointment"
                                        className=" ml-auto">
                                        <Button
                                            color="cyan"
                                            className="flex items-center gap-3 rounded-full">
                                            {createElement(PlusIcon, {
                                                className: 'h-[18px] w-[18px]',
                                            })}
                                            New
                                        </Button>
                                    </Link>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <Tabs value="all" className="w-full md:w-max">
                                <TabsHeader>
                                    {TABS.map(({ label, value }) => (
                                        <Tab
                                            key={value}
                                            value={value}
                                            onClick={() => {
                                                setStatus(value)
                                                getAppointments(value, 1)
                                            }}>
                                            &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                        </Tab>
                                    ))}
                                </TabsHeader>
                            </Tabs>
                            <div className="w-full md:w-72">
                                <Input
                                    label="Search"
                                    icon={
                                        <MagnifyingGlassIcon className="h-5 w-5" />
                                    }
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="overflow-scroll px-0">
                        <table className="mt-4 w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    {TABLE_HEAD.map(head => (
                                        <th
                                            key={head}
                                            className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
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
                                {pages.data &&
                                    pages.data.map(
                                        (
                                            {
                                                id,
                                                patient,
                                                doctor,
                                                accepted_at,
                                                cancelled_at,
                                                verified_at,
                                                check_out,
                                                scheduled_at,
                                                start_time,
                                                payment_link,
                                            },
                                            index,
                                        ) => {
                                            const isLast =
                                                index === pages.data.length - 1
                                            const classes = isLast
                                                ? 'p-4'
                                                : 'p-4 border-b border-blue-gray-50'

                                            let color = ''
                                            let status = ''

                                            if (
                                                accepted_at != null &&
                                                cancelled_at == null
                                            ) {
                                                color = 'cyan'
                                                status = 'accepted'
                                            }

                                            if (
                                                accepted_at == null &&
                                                cancelled_at == null
                                            ) {
                                                color = 'yellow'
                                                status = 'pending'
                                            }

                                            if (cancelled_at != null) {
                                                color = 'red'
                                                status = 'canceled'
                                            }

                                            if (
                                                cancelled_at == null &&
                                                check_out != null
                                            ) {
                                                color = 'green'
                                                status = 'completed'
                                            }

                                            return (
                                                <tr key={id}>
                                                    <td className={classes}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal">
                                                            #{id}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar
                                                                src={
                                                                    patient.profile_photo_path !=
                                                                    null
                                                                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${patient.profile_photo_path}`
                                                                        : 'https://ui-avatars.com/api/?name=' +
                                                                          patient.name.replace(
                                                                              ' ',
                                                                              '+',
                                                                          )
                                                                }
                                                                alt={
                                                                    patient.name
                                                                }
                                                                size="sm"
                                                            />
                                                            <div className="flex flex-col">
                                                                <Typography
                                                                    variant="small"
                                                                    color="blue-gray"
                                                                    className="font-normal">
                                                                    {
                                                                        patient.name
                                                                    }
                                                                </Typography>
                                                                <Typography
                                                                    variant="small"
                                                                    color="blue-gray"
                                                                    className="font-normal opacity-70">
                                                                    {
                                                                        patient.email
                                                                    }
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar
                                                                src={
                                                                    doctor.profile_photo_path !=
                                                                    null
                                                                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${doctor.profile_photo_path}`
                                                                        : 'https://ui-avatars.com/api/?name=' +
                                                                          doctor.name.replace(
                                                                              ' ',
                                                                              '+',
                                                                          )
                                                                }
                                                                alt={
                                                                    doctor.name
                                                                }
                                                                size="sm"
                                                            />
                                                            <div className="flex flex-col">
                                                                <Typography
                                                                    variant="small"
                                                                    color="blue-gray"
                                                                    className="font-normal">
                                                                    {
                                                                        doctor.name
                                                                    }
                                                                </Typography>
                                                                <Typography
                                                                    variant="small"
                                                                    color="blue-gray"
                                                                    className="font-normal opacity-70">
                                                                    {
                                                                        doctor.email
                                                                    }
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        {moment(
                                                            scheduled_at,
                                                        ).format(
                                                            'MMM Do, YYYY',
                                                        )}{' '}
                                                        <br />
                                                        {moment(
                                                            start_time,
                                                            'HH:mm',
                                                        ).format('h:mm A')}
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="w-max">
                                                            <Chip
                                                                variant="ghost"
                                                                size="sm"
                                                                value={status}
                                                                color={color}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="w-max">
                                                            <Chip
                                                                variant="ghost"
                                                                size="sm"
                                                                value={
                                                                    verified_at
                                                                        ? 'Paid'
                                                                        : 'Unpaid'
                                                                }
                                                                color={
                                                                    verified_at
                                                                        ? 'green'
                                                                        : 'blue-gray'
                                                                }
                                                            />

                                                            {user &&
                                                            user.type ==
                                                                'patient' &&
                                                            verified_at ===
                                                                null &&
                                                            accepted_at !==
                                                                null &&
                                                            cancelled_at ===
                                                                null ? (
                                                                <a
                                                                    href={
                                                                        payment_link
                                                                    }
                                                                    target="_blank"
                                                                    rel="noreferrer">
                                                                    <Button
                                                                        variant="gradient"
                                                                        className="rounded-full mt-2"
                                                                        size="sm"
                                                                        color="cyan">
                                                                        Pay Now
                                                                    </Button>
                                                                </a>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <Link
                                                            href={`/appointment/${id}`}>
                                                            <Tooltip content="View Appointment">
                                                                <IconButton variant="text">
                                                                    <EyeIcon className="h-5 w-5" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        },
                                    )}
                            </tbody>
                        </table>
                    </CardBody>
                    {pages && (
                        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal">
                                Page {pages.current_page} of {pages.last_page}
                            </Typography>
                            {pages.total > 1 && (
                                <div className="flex gap-2">
                                    {pages.current_page > 1 && (
                                        <Button
                                            variant="outlined"
                                            size="sm"
                                            onClick={() => {
                                                setPage(pages.current_page - 1)
                                                getAppointments(
                                                    status,
                                                    pages.current_page - 1,
                                                )
                                            }}>
                                            Previous
                                        </Button>
                                    )}

                                    {pages.last_page > pages.current_page && (
                                        <Button
                                            variant="outlined"
                                            size="sm"
                                            onClick={() => {
                                                setPage(pages.current_page + 1)
                                                getAppointments(
                                                    status,
                                                    pages.current_page + 1,
                                                )
                                            }}>
                                            Next
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardFooter>
                    )}
                </Card>
            </div>
        </AppLayout>
    )
}

export default Appointments
