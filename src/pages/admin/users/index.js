import Head from 'next/head'
import AppLayout from '@/components/Layouts/AppLayout'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import {
    PencilIcon,
    UserPlusIcon,
    PlusCircleIcon,
} from '@heroicons/react/24/solid'
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
import { useEffect, useState } from 'react'
import { useUsers } from '@/hooks/users'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'

const TABS = [
    {
        label: 'All',
        value: 'all',
    },
    {
        label: 'Patients',
        value: 'patient',
    },
    {
        label: 'Doctors',
        value: 'doctor',
    },
    {
        label: 'Admin',
        value: 'admin',
    },
    {
        label: 'Staff',
        value: 'staff',
    },
]

const TABLE_HEAD = ['', 'User', '', 'Status', 'Joined', '']

const SEX_TABS = [
    {
        label: 'Male',
        value: 'all',
    },
    {
        label: 'Female',
        value: 'patient',
    },
]

const TYPE_TABS = [
    {
        label: 'Regular',
        value: 'all',
    },
    {
        label: 'Senior',
        value: 'patient',
    },
    {
        label: 'PWD',
        value: 'patient',
    },
]

const Users = () => {
    const { usersQuery } = useUsers()
    const [users, setUsers] = useState([])
    useAuth({
        middleware: 'auth',
        type: ['admin'],
    })
    const getUsers = type => {
        usersQuery({ type }).then(res => setUsers(res.data.data))
    }

    useEffect(() => getUsers('all'), [])

    return (
        <AppLayout>
            <Head>
                <title>Users - SRMC</title>
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
                                    Users list
                                </Typography>
                                <Typography
                                    color="gray"
                                    className="mt-1 font-normal">
                                    See information about all Users
                                </Typography>
                            </div>
                            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                                <Link href="/admin/users/new">
                                    <Button
                                        className="flex items-center gap-3"
                                        size="sm">
                                        <UserPlusIcon
                                            strokeWidth={2}
                                            className="h-4 w-4"
                                        />{' '}
                                        Add User
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <Tabs value="all" className="w-full md:w-max">
                                <TabsHeader>
                                    {TABS.map(({ label, value }) => (
                                        <Tab
                                            key={value}
                                            value={value}
                                            onClick={() => getUsers(value)}>
                                            &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                        </Tab>
                                    ))}
                                </TabsHeader>
                                <TabsHeader>
                                    {SEX_TABS.map(({ label, value }) => (
                                        <Tab
                                            key={value}
                                            value={value}
                                            onClick={() => getUsers(value)}>
                                            &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                        </Tab>
                                    ))}
                                </TabsHeader>
                                <TabsHeader>
                                    {TYPE_TABS.map(({ label, value }) => (
                                        <Tab
                                            key={value}
                                            value={value}
                                            onClick={() => getUsers(value)}>
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
                                <div className="my-4">
                                    <Input label="Age From" className="" />
                                </div>
                                <div className="my-4">
                                    <Input label="Age To " className="" />
                                </div>
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
                                {users.map(
                                    (
                                        {
                                            id,
                                            name,
                                            email,
                                            title,
                                            type,
                                            email_verified_at,
                                            date,
                                            custom_id,
                                            profile_photo_path,
                                        },
                                        index,
                                    ) => {
                                        const isLast =
                                            index === users.length - 1
                                        const classes = isLast
                                            ? 'p-4'
                                            : 'p-4 border-b border-blue-gray-50'

                                        return (
                                            <tr key={name}>
                                                <td className={classes}>
                                                    {custom_id ?? id}
                                                </td>
                                                <td className={classes}>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar
                                                            src={
                                                                profile_photo_path !=
                                                                null
                                                                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${profile_photo_path}`
                                                                    : 'https://ui-avatars.com/api/?name=' +
                                                                      name.replace(
                                                                          ' ',
                                                                          '+',
                                                                      )
                                                            }
                                                            alt={name}
                                                            size="sm"
                                                        />
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal">
                                                                {name}
                                                            </Typography>
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal opacity-70">
                                                                {email}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    <div className="flex flex-col">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal">
                                                            {title}
                                                        </Typography>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal opacity-70">
                                                            {type
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                type.slice(1)}
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    <div className="w-max">
                                                        <Chip
                                                            variant="ghost"
                                                            size="sm"
                                                            value={
                                                                email_verified_at
                                                                    ? 'Verified'
                                                                    : 'Unverified'
                                                            }
                                                            color={
                                                                email_verified_at
                                                                    ? 'green'
                                                                    : 'blue-gray'
                                                            }
                                                        />
                                                    </div>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal">
                                                        {date}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    {type === 'patient' && (
                                                        <Link
                                                            href={`/admin/appointments/new/${id}`}>
                                                            <Tooltip content="New Appointment">
                                                                <IconButton variant="text">
                                                                    <PlusCircleIcon className="h-4 w-4" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Link>
                                                    )}
                                                    <Link
                                                        href={`/admin/users/edit/${id}`}>
                                                        <Tooltip content="Edit User">
                                                            <IconButton variant="text">
                                                                <PencilIcon className="h-4 w-4" />
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
                    <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal">
                            Page 1 of 10
                        </Typography>
                        <div className="flex gap-2">
                            <Button variant="outlined" size="sm">
                                Previous
                            </Button>
                            <Button variant="outlined" size="sm">
                                Next
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    )
}

export default Users
