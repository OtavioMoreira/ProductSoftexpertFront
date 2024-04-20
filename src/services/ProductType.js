import axiosUtils from '../utils/AxiosConfig';

const getProductsType = async (token, params = '') => {
    try {
        const response = await axiosUtils.get('/getProductsType?' + params, {
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

const deleteProductsType = async (token, id) => {
    const requestData = {
        id: id
    };

    try {
        const response = await axiosUtils.post('/deleteProductsType', JSON.stringify(requestData), {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        throw error;
    }
};

const addProductsType = async (token, params) => {
    const requestData = {
        name: params.name,
        description: params.description,
        percentage: params.percentage,
    };

    try {
        const response = await axiosUtils.post('/addProductsType', JSON.stringify(requestData), {
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

const updateProductsType = async (token, params) => {
    const requestData = {
        id: params.id,
        name: params.name,
        description: params.description,
        percentage: params.percentage,
    };

    try {
        const response = await axiosUtils.post('/updateProductsType', JSON.stringify(requestData), {
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

export { getProductsType, deleteProductsType, addProductsType, updateProductsType };