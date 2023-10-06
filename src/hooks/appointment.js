import axios from '@/lib/axios'

export const useAppointment = () => {
    const config = {
        headers:{
          "Access-Control-Allow-Origin": "*",
        }
    };
    
    const newAppointment = ({ ...props }) => {
        axios
            .post('/api/appointment', props, config)
            .then(() => {
                location.reload()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
            })
    }

    return {
        newAppointment,
    }
}
