import Head from 'next/head'
import AppLayout from '@/components/Layouts/AppLayout'
import { useState, useEffect, createElement } from 'react'
import {
    CardBody,
    Card,
    Input,
    Select,
    Option,
    Button,
    IconButton,
    Typography,
} from '@material-tailwind/react'
import { useUsers } from '@/hooks/users'
import InputError from '@/components/InputError'
import { useRouter } from 'next/router'
import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'
const TABLE_HEAD = ['Name', 'Job', 'Employed', '']

const TABLE_ROWS = [
    {
        name: 'John Michael',
        job: 'Manager',
        date: '23/04/18',
    },
    {
        name: 'Alexa Liras',
        job: 'Developer',
        date: '23/04/18',
    },
    {
        name: 'Laurent Perrier',
        job: 'Executive',
        date: '19/09/17',
    },
    {
        name: 'Michael Levi',
        job: 'Developer',
        date: '24/12/08',
    },
    {
        name: 'Richard Gran',
        job: 'Manager',
        date: '04/10/21',
    },
]
const EditUser = () => {
    const router = useRouter()
    const id = router.query.slug

    const { newUser, getUser } = useUsers()
    const [user, setUser] = useState([])

    const [name, setName] = useState(user.name)
    const [title, setTitle] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [birthdate, setBirthdate] = useState()
    const [contact_number, setContactNumber] = useState()
    const [address, setAddress] = useState()
    const [type, setType] = useState()
    const [sex, setSex] = useState()

    const [errors, setErrors] = useState([])

    const typeOptions = [
        { value: '', text: 'Choose an option' },
        { value: 'patient', text: 'Patient' },
        { value: 'doctor', text: 'Doctor' },
        { value: 'admin', text: 'Admin' },
    ]

    const sexOptions = [
        { value: '', text: 'Choose an option' },
        { value: 'male', text: 'Male' },
        { value: 'female', text: 'Female' },
    ]

    const submitForm = async event => {
        event.preventDefault()

        newUser({
            name,
            title,
            email,
            password,
            birthdate,
            contact_number,
            address,
            type,
            sex,
            setErrors,
        })
    }

    useEffect(() => {
        if (typeof id != 'undefined') getUser({ id, setUser })
    }, [id])

    return (
        <AppLayout
            header={
                <div className="inline-flex w-full gap-3">
                    <Link href="/admin/users">
                        <IconButton variant="text">
                            <ArrowLongLeftIcon className="w-5" />
                        </IconButton>
                    </Link>
                    Edit User
                </div>
            }>
            <Head>
                <title>Edit User - SRMC</title>
            </Head>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Card>
                    <CardBody>
                        <form>
                            <div className="mb-6">
                                <Input
                                    label="Name"
                                    value={user.name}
                                    name="name"
                                    onChange={event =>
                                        setName(event.target.value)
                                    }
                                />
                                <InputError
                                    messages={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-6">
                                <Input
                                    label="Title"
                                    value={title}
                                    name="title"
                                    onChange={event =>
                                        setTitle(event.target.value)
                                    }
                                />
                                <InputError
                                    messages={errors.title}
                                    className="mt-2"
                                />
                            </div>
                            <div className="mb-6">
                                <Input
                                    label="Email"
                                    value={email}
                                    name="email"
                                    onChange={event =>
                                        setEmail(event.target.value)
                                    }
                                />
                                <InputError
                                    messages={errors.email}
                                    className="mt-2"
                                />
                            </div>
                            <div className="mb-6">
                                <Input
                                    label="Password"
                                    type="password"
                                    value={password}
                                    name="password"
                                    onChange={event =>
                                        setPassword(event.target.value)
                                    }
                                />
                                <InputError
                                    messages={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-6">
                                <Input
                                    label="Birthdate"
                                    value={birthdate}
                                    name="birthdate"
                                    type="date"
                                    onChange={event =>
                                        setBirthdate(event.target.value)
                                    }
                                />
                                <InputError
                                    messages={errors.birthdate}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-6">
                                <Input
                                    label="Contact Number"
                                    value={contact_number}
                                    name="contact_number"
                                    onChange={event =>
                                        setContactNumber(event.target.value)
                                    }
                                />
                                <InputError
                                    messages={errors.contact_number}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-6">
                                <Input
                                    label="Address"
                                    value={address}
                                    name="address"
                                    onChange={event =>
                                        setAddress(event.target.value)
                                    }
                                />
                                <InputError
                                    messages={errors.address}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-6">
                                <Select
                                    label="Sex"
                                    value={sex}
                                    name="sex"
                                    onChange={event => setSex(event)}>
                                    {sexOptions.map(option => (
                                        <Option
                                            value={option.value}
                                            key={option.value}>
                                            {option.text}
                                        </Option>
                                    ))}
                                </Select>

                                <InputError
                                    messages={errors.type}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-6">
                                <Select
                                    label="Type"
                                    value={type}
                                    name="type"
                                    onChange={event => setType(event)}>
                                    {typeOptions.map(option => (
                                        <Option
                                            value={option.value}
                                            key={option.value}>
                                            {option.text}
                                        </Option>
                                    ))}
                                </Select>

                                <InputError
                                    messages={errors.type}
                                    className="mt-2"
                                />
                            </div>
                        </form>

                        <Button
                            variant="gradient"
                            color="cyan"
                            className="rounded-full"
                            onClick={submitForm}>
                            <span>Submit</span>
                        </Button>
                    </CardBody>
                </Card>

                <div>
                    <Link href={`/admin/appointments/new/${id}`}>
                        <Button
                            color="cyan"
                            className="flex items-center gap-3 rounded-full">
                            {createElement(PlusIcon, {
                                className: 'h-[18px] w-[18px]',
                            })}
                            Walk In Appointment
                        </Button>
                    </Link>

                    <Card className="w-full  mt-10">
                        <table className="w-full overflow-scroll min-w-max table-auto text-left">
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
                                {user.schedules != undefined
                                    ? user.schedules.map(
                                          ({ name, job, date }, index) => {
                                              const isLast =
                                                  index ===
                                                  TABLE_ROWS.length - 1
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
                                                              variant="small"
                                                              color="blue-gray"
                                                              className="font-normal">
                                                              {job}
                                                          </Typography>
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
                                                          <Typography
                                                              as="a"
                                                              href="#"
                                                              variant="small"
                                                              color="blue-gray"
                                                              className="font-medium">
                                                              Edit
                                                          </Typography>
                                                      </td>
                                                  </tr>
                                              )
                                          },
                                      )
                                    : ''}
                            </tbody>
                        </table>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}

export default EditUser
