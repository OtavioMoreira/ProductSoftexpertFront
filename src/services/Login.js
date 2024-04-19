import axiosUtils from '../utils/AxiosConfig';

const Login = async (email, password) => {
  try {
    const requestData = {
      email: email,
      password: password
    };

    const response = await axiosUtils.post('/authenticate', JSON.stringify(requestData), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // console.log('response', response)

    const dataToken = response.data.message;
    return dataToken;
  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    throw error; // Lançar o erro para ser capturado no chamador da função
  }
};

const verifyToken = async (token) => {
  try {
    const response = await axiosUtils.post('/validateToken', {}, {
      headers: {
        Authorization: token // Adicionando o token no cabeçalho de autorização
      }
    });

    const request = response;

    return request;
  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    throw error; // Lançar o erro para ser capturado no chamador da função
  }
};

export { Login, verifyToken };