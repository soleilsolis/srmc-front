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
    Dialog,
    DialogBody,
    DialogHeader,
    DialogFooter,
} from '@material-tailwind/react'
import { useUsers } from '@/hooks/users'
import { useDay } from '@/hooks/day'
import InputError from '@/components/InputError'
import { useRouter } from 'next/router'
import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import moment from 'moment'

import {
    ArrowLongLeftIcon,
    PencilIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { useSchedule } from '@/hooks/schedule'
const TABLE_HEAD = ['Day', 'In', 'Out', 'Actions']

const EditUser = () => {
    const router = useRouter()
    const id = router.query.slug

    const { editUser, getUser } = useUsers()
    const { getDays } = useDay()
    const { newSchedule, editSchedule, deleteSchedule } = useSchedule()

    const [user, setUser] = useState([])
    const [days, setDays] = useState([])
    const [action, setAction] = useState('')
    const [day_id, setDayId] = useState([])
    const [schedule_id, setScheduleId] = useState(null)

    const [start_time, setStartTime] = useState()
    const [end_time, setEndTime] = useState()

    const [name, setName] = useState(user.name)
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

    const [open, setOpen] = useState()
    const handleOpen = () => setOpen(!open)

    const [openDelete, setOpenDelete] = useState()
    const handleDelete = () => setOpenDelete(!openDelete)

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

    const submitSchedule = async event => {
        event.preventDefault()

        schedule_id != null
            ? editSchedule({
                  id: schedule_id,
                  start_time,
                  end_time,
                  setErrors,
              })
            : newSchedule({
                  userId: id,
                  day_id,
                  start_time,
                  end_time,
                  setErrors,
              })
    }

    const submitDeleteSchedule = async event => {
        event.preventDefault()

        deleteSchedule({
            id: schedule_id,
        })
    }

    useEffect(() => {
        if (typeof id != 'undefined')
            getUser({
                id,
                setUser,
                setName,
                setTitle,
                setEmail,
                setPassword,
                setBirthdate,
                setContactNumber,
                setAddress,
                setType,
                setValidIdNumber,
                setPatientType,
                setSex,
            })

        getDays({ setDays })
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
                                                      event.target.value == ''
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
                                                      event.target.value == ''
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

                                <div className="mb-6">
                                    <Select
                                        label="Type"
                                        value={type}
                                        name="type"
                                        onChange={event => {
                                            setType(event)
                                            setPatientType(null)
                                            setValidIdNumber(null)
                                        }}>
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

                                {type == 'patient' ? (
                                    <div className="mb-6">
                                        <Select
                                            label="Patient Type"
                                            name="patient_type"
                                            value={patientType}
                                            onChange={event => {
                                                setPatientType(event)
                                                setValidIdNumber(null)
                                            }}
                                            required>
                                            {patientTypeOptions.map(option => (
                                                <Option
                                                    key={option.value}
                                                    value={option.value}>
                                                    {option.label}
                                                </Option>
                                            ))}
                                        </Select>

                                        <InputError
                                            messages={errors.patient_type}
                                            className="mt-2"
                                        />
                                    </div>
                                ) : (
                                    ''
                                )}

                                {patientType != null ? (
                                    <div className="mb-6">
                                        <Input
                                            label="ID Number"
                                            id="valid_id_number"
                                            type="text"
                                            value={valid_id_number}
                                            className="block mt-1 w-full"
                                            onChange={event =>
                                                setValidIdNumber(
                                                    event.target.value,
                                                )
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
                                            characters and one special character{' '}
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
                                className="rounded-full">
                                <span>Submit</span>
                            </Button>
                        </CardBody>
                    </Card>
                </div>
                <div>
                    {user.type === 'patient' ? (
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
                    ) : (
                        <Button
                            color="cyan"
                            className="flex items-center gap-3 rounded-full"
                            onClick={() => {
                                setAction('New')
                                setScheduleId(null)
                                setStartTime(null)
                                setEndTime(null)
                                setOpen(!open)
                            }}>
                            {createElement(PlusIcon, {
                                className: 'h-[18px] w-[18px]',
                            })}
                            Add Schedule
                        </Button>
                    )}

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
                                          (
                                              { id, start_time, end_time, day },
                                              index,
                                          ) => {
                                              const isLast =
                                                  index ===
                                                  user.schedules.length - 1
                                              const classes = isLast
                                                  ? 'p-4'
                                                  : 'p-4 border-b border-blue-gray-50'

                                              return (
                                                  <tr key={id}>
                                                      <td className={classes}>
                                                          <Typography
                                                              variant="small"
                                                              color="blue-gray"
                                                              className="font-normal">
                                                              {day.name}
                                                          </Typography>
                                                      </td>
                                                      <td className={classes}>
                                                          <Typography
                                                              variant="small"
                                                              color="blue-gray"
                                                              className="font-normal">
                                                              {moment(
                                                                  start_time,
                                                                  'HH:mm',
                                                              ).format(
                                                                  'h:mm A',
                                                              )}
                                                          </Typography>
                                                      </td>
                                                      <td className={classes}>
                                                          <Typography
                                                              variant="small"
                                                              color="blue-gray"
                                                              className="font-normal">
                                                              {moment(
                                                                  end_time,
                                                                  'HH:mm',
                                                              ).format(
                                                                  'h:mm A',
                                                              )}
                                                          </Typography>
                                                      </td>
                                                      <td className={classes}>
                                                          <IconButton
                                                              variant="text"
                                                              color="cyan"
                                                              className="rounded-full"
                                                              onClick={() => {
                                                                  setAction(
                                                                      'Edit ' +
                                                                          day.name,
                                                                  )
                                                                  setStartTime(
                                                                      start_time,
                                                                  )
                                                                  setEndTime(
                                                                      end_time,
                                                                  )
                                                                  setScheduleId(
                                                                      id,
                                                                  )
                                                                  setDayId(null)
                                                                  setOpen(!open)
                                                              }}>
                                                              <PencilIcon className="h-4 w-4" />
                                                          </IconButton>
                                                          <IconButton
                                                              variant="text"
                                                              color="red"
                                                              className="rounded-full"
                                                              onClick={() => {
                                                                  setScheduleId(
                                                                      id,
                                                                  )
                                                                  setDayId(null)
                                                                  setOpenDelete(
                                                                      !openDelete,
                                                                  )
                                                              }}>
                                                              <XMarkIcon className="h-4 w-4" />
                                                          </IconButton>
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

            <Dialog handler={handleOpen} open={open}>
                <DialogHeader>{action} Schedule</DialogHeader>
                <DialogBody>
                    <div>
                        {schedule_id == null ? (
                            <Select
                                label="Day"
                                name="day_id"
                                onChange={event => setDayId(event)}>
                                {days.map(day => (
                                    <Option value={day.id} key={day.id}>
                                        {day.name}
                                    </Option>
                                ))}
                            </Select>
                        ) : (
                            ''
                        )}

                        <InputError messages={errors.day_id} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <Input
                            label="In"
                            type="time"
                            name="start_time"
                            value={start_time}
                            onChange={event => setStartTime(event.target.value)}
                        />

                        <InputError
                            messages={errors.start_time}
                            className="mt-2"
                        />
                    </div>
                    <div className="mt-4">
                        <Input
                            label="Out"
                            type="time"
                            name="end_time"
                            value={end_time}
                            onChange={event => setEndTime(event.target.value)}
                        />
                        <InputError
                            messages={errors.end_time}
                            className="mt-2"
                        />
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button
                        className="rounded-full mr-2"
                        color="cyan"
                        variant="text"
                        onClick={handleOpen}>
                        Close
                    </Button>

                    <Button
                        className="rounded-full"
                        color="cyan"
                        onClick={submitSchedule}>
                        Save
                    </Button>
                </DialogFooter>
            </Dialog>

            <Dialog handler={handleDelete} open={openDelete}>
                <DialogHeader>Delete Schedule</DialogHeader>
                <DialogBody>
                    <Typography variant="h3" color="red">
                        Are You Sure?
                    </Typography>
                </DialogBody>
                <DialogFooter>
                    <Button
                        className="rounded-full mr-2"
                        color="cyan"
                        variant="text"
                        onClick={handleDelete}>
                        cancel
                    </Button>

                    <Button
                        className="rounded-full"
                        color="red"
                        onClick={submitDeleteSchedule}>
                        Delete
                    </Button>
                </DialogFooter>
            </Dialog>
        </AppLayout>
    )
}

export default EditUser
