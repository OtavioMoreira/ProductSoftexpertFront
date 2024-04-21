import axiosUtils from '../utils/AxiosConfig';

const getProducts = async (token, params = '') => {
    try {
        const response = await axiosUtils.get('/getProducts?' + params, {
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

const getProductsEdit = async (token, params = '') => {
    try {
        const response = await axiosUtils.get('/getProductsEdit?' + params, {
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

const deleteProducts = async (token, id) => {
    const requestData = {
        id: id
    };

    try {
        const response = await axiosUtils.post('/deleteProducts', JSON.stringify(requestData), {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        throw error;
    }
};

const deleteProductsRel = async (token, productId, productTypeId) => {
    const requestData = {
        productId: productId,
        productTypeId: productTypeId
    };

    try {
        const response = await axiosUtils.post('/deleteProductsRel', JSON.stringify(requestData), {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        throw error;
    }
};


const addProducts = async (token, params) => {
    const requestData = {
        name: params.name,
        description: params.description,
        price: params.price,
        qtd: params.qtd,
        product_id: params.product_id,
        product_type_id: params.product_type_id,
    };

    try {
        const response = await axiosUtils.post('/addProducts', JSON.stringify(requestData), {
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

const updateProducts = async (token, params) => {
    console.log(params)
    const requestData = {
        id: params.id,
        name: params.name,
        description: params.description,
        price: params.price,
        qtd: params.qtd,
        product_id: params.product_id,
        product_type_id: parseInt(params.product_type_id),
    };

    try {
        const response = await axiosUtils.post('/updateProducts', JSON.stringify(requestData), {
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

const updateProductsRel = async (token, params) => {
    const requestData = {
        id: params.id,
        name: params.name,
        description: params.description,
        price: params.price,
        qtd: params.qtd,
        product_id: params.product_id,
        product_type_id: parseInt(params.product_type_id),
        old_product_type_id: parseInt(params.old_product_type_id),
    };

    try {
        const response = await axiosUtils.post('/updateProductsRel', JSON.stringify(requestData), {
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

export { getProducts, deleteProducts, addProducts, updateProducts, deleteProductsRel, updateProductsRel, getProductsEdit };