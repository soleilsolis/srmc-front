import axios from '@/lib/axios'

export const useTransaction = () => {
    const config = {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    }

    const csrf = () => axios.get('/sanctum/csrf-cookie', config)

    const transactionsQuery = async ({ ...props } = {}) => {
        await csrf()
        return axios.get(`/api/transactions?page=${props.type}`, config)
    }
    return {
        transactionsQuery,
    }
}
