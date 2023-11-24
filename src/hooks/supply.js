import axios from '@/lib/axios'
import { useRouter } from 'next/router'
export const useSupply = () => {
    const router = useRouter()
    const config = {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    }

    const csrf = () => axios.get('/sanctum/csrf-cookie', config)

    const indexSupplyCategories = async ({ setSupplyCategories }) => {
        await csrf()
        axios
            .get(`/api/supplyCategories`, config)
            .then(res => setSupplyCategories(res.data.data))
    }

    const indexSupplies = async ({ setSupplies, ...props }) => {
        await csrf()
        axios
            .get(`/api/supplies/${props.type}`, config)
            .then(res => setSupplies(res.data.data))
    }

    const getSupply = async ({
        setName,
        setSupplyCategoryId,
        setUnit,
        setCost,
        setExpiresAt,
        setRemaining,
        ...props
    }) => {
        await csrf()
        axios.get(`/api/supply/${props.id}`, config).then(res => {
            const supply = res.data.data
            setName(supply.name)
            setSupplyCategoryId(supply.supply_category_id)
            setUnit(supply.unit)
            setCost(supply.cost)
            setExpiresAt(supply.expires_at)
            setRemaining(supply.quantity - supply.deducted)
        })
    }

    const newSupply = async ({ setErrors, ...props }) => {
        await csrf()
        axios
            .post(`/api/supply`, props, config)
            .then(res => router.push(`/admin/supply/edit/${res.data.data.id}`))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const editSupply = async ({ setErrors, ...props }) => {
        await csrf()
        axios
            .put(`/api/supply/${props.id}`, props, config)
            .then(res => location.reload())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const deductSupply = async ({ setErrors, ...props }) => {
        await csrf()
        axios
            .patch(`/api/supply/deduct/${props.id}`, props, config)
            .then(() => location.reload())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const renewSupply = async ({ setErrors, ...props }) => {
        await csrf()
        axios
            .patch(`/api/supply/renew/${props.id}`, props, config)
            .then(() => location.reload())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    return {
        indexSupplies,
        getSupply,
        newSupply,
        deductSupply,
        indexSupplyCategories,
        editSupply,
        renewSupply,
    }
}
