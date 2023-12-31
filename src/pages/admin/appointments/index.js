import Head from 'next/head'
import AppLayout from '@/components/Layouts/AppLayout'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
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
} from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { useAppointment } from '@/hooks/appointment'

import moment from 'moment'
import { useAuth } from '@/hooks/auth'

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

const TABS2 = [
    {
        label: 'All Types',
        value: null,
    },
    {
        label: 'Teleconsultation',
        value: 'Teleconsultation',
    },
    {
        label: 'In Person',
        value: 'In Person',
    },
    {
        label: 'Walk In',
        value: 'Walk In',
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
    useAuth({
        middleware: 'auth',
        type: ['admin', 'staff'],
    })

    const [status, setStatus] = useState('all')
    const [search, setSearch] = useState(null)
    const [pages, setPages] = useState([])
    const [type, setType] = useState(null)

    const { appointmentsQuery } = useAppointment()

    const getAppointments = (status, page, search = null, type = null) => {
        appointmentsQuery({ status, page, search, type }).then(res => {
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
                        </div>
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <div>
                                <Tabs value="all" className="w-full ">
                                    <TabsHeader>
                                        {TABS.map(({ label, value }) => (
                                            <Tab
                                                key={value}
                                                value={value}
                                                onClick={() => {
                                                    setStatus(value)
                                                    getAppointments(
                                                        value,
                                                        1,
                                                        search,
                                                        type,
                                                    )
                                                }}>
                                                &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                            </Tab>
                                        ))}
                                    </TabsHeader>
                                </Tabs>
                                <Tabs value="all" className="w-full mt-6">
                                    <TabsHeader>
                                        {TABS2.map(({ label, value }) => (
                                            <Tab
                                                key={value}
                                                value={value}
                                                onClick={() => {
                                                    setType(value)
                                                    getAppointments(
                                                        status,
                                                        1,
                                                        search,
                                                        value,
                                                    )
                                                }}>
                                                &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                            </Tab>
                                        ))}
                                    </TabsHeader>
                                </Tabs>
                            </div>
                            <div className="w-full md:w-72">
                                <Input
                                    label="Search"
                                    icon={
                                        <MagnifyingGlassIcon className="h-5 w-5" />
                                    }
                                    onChange={event => {
                                        setSearch(event.target.value)
                                        getAppointments(
                                            status,
                                            1,
                                            event.target.value,
                                        )
                                    }}
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
                                                                        ? 'Verified'
                                                                        : 'Unverified'
                                                                }
                                                                color={
                                                                    verified_at
                                                                        ? 'green'
                                                                        : 'blue-gray'
                                                                }
                                                            />
                                                        </div>
                                                    </td>
                                                    <td
                                                        className={
                                                            classes
                                                        }></td>
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
                                                getAppointments(
                                                    status,
                                                    pages.current_page - 1,
                                                    search,
                                                    type,
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
                                                getAppointments(
                                                    status,
                                                    pages.current_page + 1,
                                                    search,
                                                    type,
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
