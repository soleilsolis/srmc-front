import InputError from '@/components/InputError'
import AppLayout from '@/components/Layouts/AppLayout'
import {
    Button,
    Card,
    CardBody,
    Input,
    Select,
    Option,
    IconButton,
} from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { useSupply } from '@/hooks/supply'
import Link from 'next/link'
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'

const NewSupply = () => {
    const { indexSupplyCategories, newSupply } = useSupply()
    const [name, setName] = useState()
    const [supply_category_id, setSupplyCategoryId] = useState(1)
    const [quantity, setQuantity] = useState()
    const [unit, setUnit] = useState()
    const [cost, setCost] = useState()
    const [expires_at, setExpiresAt] = useState()
    const [errors, setErrors] = useState([])
    const [supplyCategories, setSupplyCategories] = useState([])

    const submitForm = event => {
        event.preventDefault()
        newSupply({
            name,
            supply_category_id,
            quantity,
            unit,
            cost,
            expires_at,
            errors,
            setErrors,
        })
    }
    useEffect(() => {
        indexSupplyCategories({ setSupplyCategories })
    }, [])
    return (
        <AppLayout
            header={
                <div className="inline-flex w-full gap-3">
                    <Link href="/admin/supply">
                        <IconButton variant="text">
                            <ArrowLongLeftIcon className="w-5" />
                        </IconButton>
                    </Link>
                    New Supply
                </div>
            }>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <Card>
                    <CardBody>
                        <div className="mb-6">
                            <Input
                                name="name"
                                value={name}
                                label="Name"
                                onChange={event => setName(event.target.value)}
                            />
                            <InputError messages={errors.name}></InputError>
                        </div>
                        <div className="mb-6">
                            <Select
                                name="supply_category_id"
                                label="Category"
                                onChange={event => setSupplyCategoryId(event)}>
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
                        <div className="mb-6">
                            <Input
                                name="quantity"
                                value={quantity}
                                label="Quantity"
                                type="number"
                                onChange={event =>
                                    setQuantity(event.target.value)
                                }
                            />
                            <InputError messages={errors.quantity}></InputError>
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
                                <InputError messages={errors.unit}></InputError>
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
                                <InputError messages={errors.cost}></InputError>
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
            </div>
        </AppLayout>
    )
}

export default NewSupply
