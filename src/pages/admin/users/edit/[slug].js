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
} from '@material-tailwind/react'
import { useUsers } from '@/hooks/users'
import InputError from '@/components/InputError'
import { useRouter } from 'next/router'
import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'
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
                                    value={name}
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
                </div>
            </div>
        </AppLayout>
    )
}

export default EditUser
