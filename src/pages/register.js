import ApplicationLogo from '@/components/ApplicationLogo'
import AuthCard from '@/components/AuthCard'
import GuestLayout from '@/components/Layouts/GuestLayout'
import {
    Input,
    Button,
    Select,
    Option,
    Typography,
} from '@material-tailwind/react'
import InputError from '@/components/InputError'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'

const Register = () => {
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/appointments',
    })

    const patientTypeOptions = [
        {
            value: null,
            label: 'Regular',
        },
        {
            value: 'PWD',
            label: 'Person With Disability',
        },
        {
            value: 'Senior',
            label: 'Senior Citizen',
        },
    ]

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [birthdate, setBirthdate] = useState('')
    const [address, setAddress] = useState('')
    const [contactNumber, setContactNumber] = useState('')
    const [errors, setErrors] = useState([])
    const [patientType, setPatientType] = useState()
    const [valid_id_number, setValidIdNumber] = useState()

    const submitForm = event => {
        event.preventDefault()

        register({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            birthdate,
            address,
            valid_id_number,
            contact_number: contactNumber,
            patient_type: patientType,
            setErrors,
        })
    }

    return (
        <GuestLayout>
            <AuthCard
                logo={
                    <Link href="/">
                        <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                    </Link>
                }>
                <form onSubmit={submitForm}>
                    {/* Name */}
                    <div>
                        <Input
                            label="Name"
                            id="name"
                            type="text"
                            value={name}
                            className="block mt-1 w-full"
                            onChange={event => setName(event.target.value)}
                            required
                            autoFocus
                        />

                        <InputError messages={errors.name} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <Select
                            label="Patient Type"
                            id="patient_type"
                            onChange={event => {
                                setPatientType(event)
                                setValidIdNumber(null)
                            }}
                            required>
                            {patientTypeOptions.map(option => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    {patientType != null ? (
                        <div className="mt-4">
                            <Input
                                label="ID Number"
                                id="valid_id_number"
                                type="text"
                                value={valid_id_number}
                                className="block mt-1 w-full"
                                onChange={event =>
                                    setValidIdNumber(event.target.value)
                                }
                            />

                            <InputError
                                messages={errors.valid_id_number}
                                className="mt-2"
                            />
                        </div>
                    ) : (
                        ''
                    )}

                    {/* Email Address */}
                    <div className="mt-4">
                        <Input
                            label="Email"
                            id="email"
                            type="email"
                            value={email}
                            className="block mt-1 w-full"
                            onChange={event => setEmail(event.target.value)}
                            required
                        />

                        <InputError messages={errors.email} className="mt-2" />
                    </div>

                    {/* Password */}
                    <div className="mt-4">
                        <Input
                            label="Password"
                            id="password"
                            type="password"
                            value={password}
                            className="block mt-1 w-full"
                            onChange={event => {
                                setPassword(event.target.value)
                                errors.password = undefined
                            }}
                            required
                            autoComplete="new-password"
                        />
                        {errors.password != undefined ? (
                            <InputError
                                messages={errors.password}
                                className="mt-2"
                            />
                        ) : (
                            <Typography variant="small">
                                <i>
                                    Password must include at least 8 characters
                                    and one special character{' '}
                                </i>{' '}
                            </Typography>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="mt-4">
                        <Input
                            label=" Confirm Password"
                            id="passwordConfirmation"
                            type="password"
                            value={passwordConfirmation}
                            className="block mt-1 w-full"
                            onChange={event =>
                                setPasswordConfirmation(event.target.value)
                            }
                            required
                        />

                        <InputError
                            messages={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    {/* birthdate */}
                    <div className="mt-4">
                        <Input
                            label="Birthdate"
                            id="birthdate"
                            type="date"
                            value={birthdate}
                            className="block mt-1 w-full"
                            onChange={event => setBirthdate(event.target.value)}
                            required
                            autoComplete="birthdate"
                        />

                        <InputError
                            messages={errors.birthdate}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <Input
                            label="Address"
                            id="address"
                            type="text"
                            value={address}
                            className="block mt-1 w-full"
                            onChange={event => setAddress(event.target.value)}
                            required
                            autoComplete="address"
                        />

                        <InputError
                            messages={errors.address}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <Input
                            label="Contact Number"
                            id="contact_number"
                            type="text"
                            value={contactNumber}
                            className="block mt-1 w-full"
                            onInput={event => {
                                let text = event.target.value.match(
                                    /^[0-9]{0,11}/g,
                                )

                                text == ''
                                    ? setContactNumber(
                                          event.target.value == ''
                                              ? ''
                                              : contactNumber,
                                      )
                                    : setContactNumber(text)
                            }}
                            required
                            autoComplete="contact_number"
                        />

                        <InputError
                            messages={errors.contact_number}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        <Link
                            href="/login"
                            className="underline text-sm text-gray-600 hover:text-gray-900">
                            Already registered?
                        </Link>

                        <Button
                            className="ml-4 rounded-full"
                            color="cyan"
                            type="submit">
                            Register
                        </Button>
                    </div>
                </form>
            </AuthCard>
        </GuestLayout>
    )
}

export default Register
