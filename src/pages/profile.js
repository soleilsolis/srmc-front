import Head from 'next/head'
import AppLayout from '@/components/Layouts/AppLayout'
import { useState, useEffect, createElement, createRef } from 'react'
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
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'

const EditUser = () => {
    const { user } = useAuth({ middleware: 'auth' })

    const id = user ? user.id : null

    const { editUser, changePhoto, changePassword } = useUsers()

    const [name, setName] = useState()
    const [title, setTitle] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [birthdate, setBirthdate] = useState()
    const [contact_number, setContactNumber] = useState('')
    const [address, setAddress] = useState()
    const [type, setType] = useState()
    const [sex, setSex] = useState()
    const [valid_id_number, setValidIdNumber] = useState()
    const [patientType, setPatientType] = useState()
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const [profile_photo, setProfilePhotoPath] = useState()
    const [createObjectURL, setCreateObjectURL] = useState()

    const imageRef = createRef()
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
    const [errors, setErrors] = useState([])

    const typeOptions = [
        { value: '', text: 'Choose an option' },
        { value: 'patient', text: 'Patient' },
        { value: 'doctor', text: 'Doctor' },
        { value: 'admin', text: 'Admin' },
        { value: 'staff', text: 'Staff' },
    ]

    const sexOptions = [
        { value: '', text: 'Choose an option' },
        { value: 'male', text: 'Male' },
        { value: 'female', text: 'Female' },
    ]

    const submitForm = async event => {
        event.preventDefault()

        editUser({
            id,
            name,
            title,
            email,
            birthdate,
            contact_number,
            address,
            type,
            sex,
            patient_type: patientType,
            valid_id_number,
            setErrors,
        })
    }

    const storePhoto = event => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0]
            setProfilePhotoPath(i)
            setCreateObjectURL(URL.createObjectURL(i))
        }
    }
    const submitPhoto = async event => {
        event.preventDefault()

        changePhoto({
            profile_photo,
            setErrors,
        })
    }

    const submitPassword = async event => {
        event.preventDefault()

        changePassword({
            password,
            password_confirmation: passwordConfirmation,
            setErrors,
        })
    }

    useEffect(() => {
        if (typeof user != 'undefined') {
            setName(user.name)
            setTitle(user.title)
            setEmail(user.email)
            setBirthdate(user.birthdate)
            setContactNumber(user.contact_number)
            setAddress(user.address)
            setType(user.type)
            setSex(user.sex)
            setValidIdNumber(user.valid_id_number)
            setPatientType(user.patient_type)

            setCreateObjectURL(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${user.profile_photo_path}` ??
                    'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
            )
        }
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

            {user ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
                    <div>
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
                                            name="contact_number"
                                            type="text"
                                            value={contact_number}
                                            onInput={event => {
                                                let text = event.target.value.match(
                                                    /^[0-9]{0,11}/g,
                                                )

                                                text == ''
                                                    ? setContactNumber(
                                                          event.target.value ==
                                                              ''
                                                              ? ''
                                                              : contact_number,
                                                      )
                                                    : setContactNumber(text)
                                            }}
                                            onChange={event => {
                                                let text = event.target.value.match(
                                                    /^[0-9]{0,11}/g,
                                                )

                                                text == ''
                                                    ? setContactNumber(
                                                          event.target.value ==
                                                              ''
                                                              ? ''
                                                              : contact_number,
                                                      )
                                                    : setContactNumber(text)
                                            }}
                                            autoComplete="contact_number"
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
                                </form>

                                <Button
                                    variant="gradient"
                                    color="cyan"
                                    className="rounded-full"
                                    onClick={submitForm}>
                                    <span>Save</span>
                                </Button>
                            </CardBody>
                        </Card>

                        <Typography variant="h5" className="my-6">
                            Change Password{' '}
                        </Typography>
                        <Card>
                            <CardBody>
                                <div className="mb-6">
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
                                                Password must include at least 8
                                                characters and one special
                                                character{' '}
                                            </i>{' '}
                                        </Typography>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <Input
                                        label=" Confirm Password"
                                        id="passwordConfirmation"
                                        type="password"
                                        value={passwordConfirmation}
                                        className="block mt-1 w-full"
                                        onChange={event =>
                                            setPasswordConfirmation(
                                                event.target.value,
                                            )
                                        }
                                        required
                                    />

                                    <InputError
                                        messages={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>
                                <Button
                                    variant="gradient"
                                    color="cyan"
                                    className="rounded-full"
                                    onClick={submitPassword}>
                                    <span>Save</span>
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                    <div>
                        <Typography variant="h5" className="my-6">
                            Update Profile Photo{' '}
                        </Typography>
                        <Card>
                            <CardBody>
                                <img
                                    className="h-52 w-52 mb-6 rounded-full object-cover object-center aspect-square"
                                    src={createObjectURL}
                                    alt="profile image"
                                />
                                <form>
                                    <input
                                        type="file"
                                        name="profile_photo"
                                        ref={imageRef}
                                        accept="image/*"
                                        className="hidden"
                                        onChange={storePhoto}
                                    />

                                    <div className="mb-6">
                                        <Button
                                            variant="gradient"
                                            color="black"
                                            className="rounded-full"
                                            onClick={() =>
                                                imageRef.current.click()
                                            }>
                                            <span>Upload Photo</span>
                                        </Button>
                                        <InputError
                                            messages={errors.profile_photo}
                                            className="mt-2"
                                        />
                                    </div>
                                </form>

                                <Button
                                    variant="gradient"
                                    color="cyan"
                                    className="rounded-full"
                                    onClick={submitPhoto}>
                                    <span>Save</span>
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            ) : (
                ''
            )}
        </AppLayout>
    )
}

export default EditUser