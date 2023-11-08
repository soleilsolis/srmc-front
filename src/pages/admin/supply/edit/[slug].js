import InputError from '@/components/InputError'
import AppLayout from '@/components/Layouts/AppLayout'
import {
    Button,
    Card,
    CardBody,
    Input,
    Select,
    Option,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
    IconButton,
    Spinner,
} from '@material-tailwind/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useSupply } from '@/hooks/supply'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'

const EditSupply = () => {
    const router = useRouter()
    const id = router.query.slug

    const {
        indexSupplyCategories,
        editSupply,
        getSupply,
        deductSupply,
        renewSupply,
    } = useSupply()
    const [name, setName] = useState()
    const [supply_category_id, setSupplyCategoryId] = useState('1')
    const [deducted, setDeducted] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [remaining, setRemaining] = useState(0)
    const [unit, setUnit] = useState()
    const [cost, setCost] = useState()
    const [expires_at, setExpiresAt] = useState()
    const [errors, setErrors] = useState([])
    const [supplyCategories, setSupplyCategories] = useState([])

    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(!open)

    const [openQuantity, setOpenQuantity] = useState(false)

    const handleOpenQuantity = () => setOpenQuantity(!openQuantity)

    const submitForm = event => {
        event.preventDefault()
        editSupply({
            id,
            name,
            supply_category_id,
            unit,
            cost,
            expires_at,
            errors,
            setErrors,
        })
    }

    const deduct = event => {
        event.preventDefault()
        deductSupply({
            id,
            deducted,
            setErrors,
        })
    }

    const renew = event => {
        event.preventDefault()
        renewSupply({
            id,
            quantity,
            setErrors,
        })
    }

    useEffect(() => {
        if (typeof id != 'undefined') {
            getSupply({
                id,
                setName,
                setRemaining,
                setSupplyCategoryId,
                setUnit,
                setCost,
                setExpiresAt,
            })
        }
        indexSupplyCategories({ setSupplyCategories })
    }, [id])
    return (
        <AppLayout
            header={
                <div className="inline-flex w-full gap-3">
                    <Link href="/admin/supply">
                        <IconButton variant="text">
                            <ArrowLongLeftIcon className="w-5" />
                        </IconButton>
                    </Link>
                    Edit Supply #{router.query.slug}
                </div>
            }>
            <Head>
                <title> Edit Supply #{router.query.slug} - SRMC</title>
            </Head>

            {!name ? (
                <Spinner className="mx-auto mt-10 h-12 w-12" color="cyan" />
            ) : (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <Card>
                        <CardBody>
                            <div className="mb-6">
                                <Input
                                    name="name"
                                    value={name}
                                    label="Item Name"
                                    onChange={event =>
                                        setName(event.target.value)
                                    }
                                />
                                <InputError messages={errors.name}></InputError>
                            </div>
                            <div className="mb-6">
                                <Select
                                    name="supply_category_id"
                                    label="Category"
                                    onChange={event =>
                                        setSupplyCategoryId(event)
                                    }>
                                    {supplyCategories.map(category => (
                                        <Option
                                            key={category.id}
                                            value={category.id}>
                                            {category.name}
                                        </Option>
                                    ))}
                                </Select>
                                <InputError
                                    messages={
                                        errors.supply_category_id
                                    }></InputError>
                            </div>
                            <div className="mb-6 flex gap-6">
                                <div>
                                    <Input
                                        name="unit"
                                        value={unit}
                                        label="Unit"
                                        onChange={event =>
                                            setUnit(event.target.value)
                                        }
                                    />
                                    <InputError
                                        messages={errors.unit}></InputError>
                                </div>
                                <div>
                                    <Input
                                        name="cost"
                                        value={cost}
                                        label="Cost"
                                        type="number"
                                        onChange={event =>
                                            setCost(event.target.value)
                                        }
                                    />
                                    <InputError
                                        messages={errors.cost}></InputError>
                                </div>
                            </div>
                            <div className="mb-6">
                                <Input
                                    name="expires_at"
                                    value={expires_at}
                                    label="Expires At"
                                    type="date"
                                    onChange={event =>
                                        setExpiresAt(event.target.value)
                                    }
                                />
                                <InputError
                                    messages={errors.expires_at}></InputError>
                            </div>

                            <Button
                                color="cyan"
                                className="rounded-full"
                                onClick={submitForm}>
                                Confirm
                            </Button>
                        </CardBody>
                    </Card>
                    <div>
                        <Typography variant="h4" className="mb-2">
                            Remaining: {remaining} Units
                        </Typography>
                        <Button
                            onClick={handleOpenQuantity}
                            variant="gradient"
                            className="rounded-full flex gap-2 mb-6"
                            color="black">
                            <PlusIcon className="w-4 h-4" />
                            Renew
                        </Button>
                        {quantity - deducted >= 0 ? (
                            <Button
                                onClick={handleOpen}
                                variant="gradient"
                                className="rounded-full flex gap-2"
                                color="red">
                                <MinusIcon className="w-4 h-4" />
                                Consume/Deduct
                            </Button>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            )}

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Consume/Deduct</DialogHeader>
                <DialogBody>
                    <Input
                        label="Quantity"
                        name="deducted"
                        value={deducted}
                        onChange={event => setDeducted(event.target.value)}
                    />
                    <InputError messages={errors.deducted}></InputError>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="cyan"
                        onClick={handleOpen}
                        className="mr-1 rounded-full">
                        <span>Cancel</span>
                    </Button>
                    <Button
                        variant="gradient"
                        color="red"
                        className="rounded-full"
                        onClick={deduct}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>

            <Dialog open={openQuantity} handler={handleOpenQuantity}>
                <DialogHeader>Renew</DialogHeader>
                <DialogBody>
                    <Input
                        label="Quantity"
                        name="quantity"
                        value={quantity}
                        onChange={event => setQuantity(event.target.value)}
                    />
                    <InputError messages={errors.quantity}></InputError>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="cyan"
                        onClick={handleOpenQuantity}
                        className="mr-1 rounded-full">
                        <span>Cancel</span>
                    </Button>
                    <Button
                        variant="gradient"
                        color="red"
                        className="rounded-full"
                        onClick={renew}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </AppLayout>
    )
}

export default EditSupply
