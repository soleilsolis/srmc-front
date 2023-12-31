import Head from 'next/head'
import AppLayout from '@/components/Layouts/AppLayout'
import { useState } from 'react'
import {
    CardBody,
    Card,
    Input,
    Select,
    Option,
    Button,
    Switch,
    IconButton,
} from '@material-tailwind/react'
import { useUsers } from '@/hooks/users'
import InputError from '@/components/InputError'
import Link from 'next/link'
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/auth'

const NewUser = () => {
    const { newUser } = useUsers()
    useAuth({
        middleware: 'auth',
        type: ['admin'],
    })

    const [name, setName] = useState()
    const [title, setTitle] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [birthdate, setBirthdate] = useState()
    const [contact_number, setContactNumber] = useState()
    const [address, setAddress] = useState()
    const [type, setType] = useState()
    const [sex, setSex] = useState()
    const [service_id, setServiceId] = useState()
    const [license_number, setLicenseNumber] = useState()
    const [verified, setVerified] = useState(false)

    const handleVerified = () => setVerified(!verified)

    const [errors, setErrors] = useState([])

    const typeOptions = [
        { value: '', text: 'Choose an option' },
        { value: 'staff', text: 'Staff' },
        { value: 'patient', text: 'Patient' },
        { value: 'doctor', text: 'Doctor' },
        { value: 'admin', text: 'Admin' },
    ]

    const sexOptions = [
        { value: '', text: 'Choose an option' },
        { value: 'male', text: 'Male' },
        { value: 'female', text: 'Female' },
    ]

    const serviceOptions = [
        { value: '', text: 'Choose an option' },
        { value: 1, text: 'Family Medicine' },
        { value: 2, text: 'Surgery' },
        { value: 3, text: 'Derma' },
        { value: 4, text: 'Checkup' },
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
            verified,
            service_id,
            license_number,
            setErrors,
        })
    }

    return (
        <AppLayout
            header={
                <div className="inline-flex w-full gap-3">
                    <Link href="/admin/users">
                        <IconButton variant="text">
                            <ArrowLongLeftIcon className="w-5" />
                        </IconButton>
                    </Link>
                    New User
                </div>
            }>
            <Head>
                <title>New User - SRMC</title>
            </Head>

            <Card>
                <CardBody>
                    <form>
                        <div className="mb-6">
                            <Input
                                label="Name"
                                value={name}
                                name="name"
                                onChange={event => setName(event.target.value)}
                            />
                            <InputError
                                messages={errors.name}
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

                        {type === 'doctor' && (
                            <>
                                <div className="mb-6">
                                    <Select
                                        label="Service"
                                        name="service_id"
                                        required
                                        onChange={event => setServiceId(event)}>
                                        {serviceOptions.map(option => (
                                            <Option
                                                value={option.value}
                                                key={option.value}>
                                                {option.text}
                                            </Option>
                                        ))}
                                    </Select>

                                    <InputError
                                        messages={errors.service_id}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-6">
                                    <Input
                                        label="License Number"
                                        value={license_number}
                                        name="license_number"
                                        onChange={event =>
                                            setLicenseNumber(event.target.value)
                                        }
                                    />
                                    <InputError
                                        messages={errors.license_number}
                                        className="mt-2"
                                    />
                                </div>
                            </>
                        )}

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
                                messages={errors.sex}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-6">
                            <Input
                                label="Title"
                                value={title}
                                name="title"
                                onChange={event => setTitle(event.target.value)}
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
                                onChange={event => setEmail(event.target.value)}
                            />
                            <InputError
                                messages={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-6">
                            <Switch
                                label="Email Verified"
                                onClick={handleVerified}
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
        </AppLayout>
    )
}

export default NewUser
