import axiosUtils from '../utils/AxiosConfig';

const getSales = async (token, params = '') => {
    try {
        const response = await axiosUtils.get('/getSales?' + params, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        throw error;
    }
};

const deleteSales = async (token, id) => {
    const requestData = {
        id: id
    };

    try {
        const response = await axiosUtils.post('/deleteSales', JSON.stringify(requestData), {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        throw error;
    }
};

const addSales = async (token, params) => {
    const requestData = {
        name: params.name,
        description: params.description,
        percentage: params.percentage,
    };

    try {
        const response = await axiosUtils.post('/addSales', JSON.stringify(requestData), {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response;
    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        throw error;
    }
};

const updateSales = async (token, params) => {
    const requestData = {
        id: params.id,
        name: params.name,
        description: params.description,
        percentage: params.percentage,
    };

    try {
        const response = await axiosUtils.post('/updateSales', JSON.stringify(requestData), {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response;
    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        throw error;
    }
};

export { getSales, deleteSales, addSales, updateSales };