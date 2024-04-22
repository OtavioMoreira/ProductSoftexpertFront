'use client'
import { getProductsType, deleteProductsType, addProductsType, updateProductsType } from '@/services/ProductType';
import { useEffect, useState } from 'react';
import Table from "../Tables/Table";
import { keyValue } from "@/types/keyValue";
import Alert from '../Alert/Alert';

export default function ProductTypeList() {
    const [token, setToken] = useState();

    const [usersFields, setUsersFields] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [error, setError] = useState<boolean>(false);
    const [alertRender, setAlertRender] = useState<boolean>(false);

    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [selectedUser, setSelectedUser] = useState([]);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        percentage: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const clearForm = (e) => {
        setFormData({
            id: '',
            name: '',
            description: '',
            percentage: ''
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await addProductsType(token, formData);
            // console.log(response)
            if (response.data == '') {
                loadProductsType(token);
                closeModal();
            } else {
                setError(true);
                console.error('Erro ao adicionar produto tipo:', response.data);
            }
        } catch (error) {
            setError(true);
            console.error('Erro ao adicionar produto tipo:', error);
        } finally {
            setAlertRender(true); // Este bloco finally será executado, independentemente de a requisição ter sucesso ou falhar
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await updateProductsType(token, formData);

            if (response.data == '') {
                loadProductsType(token);
                closeModal();
            } else {
                setError(true);
                console.error('Erro ao adicionar tipo de produto:', response.data);
            }
        } catch (error) {
            setError(true);
            console.error('Erro ao atualizar tipo de produto:', error);
        } finally {
            setAlertRender(true); // Este bloco finally será executado, independentemente de a requisição ter sucesso ou falhar
        }

    };

    const handleSubmitDelete = (id) => {
        try {
            deleteProductsType(token, id)
                .then(response => {
                    const updatedUsers = usersData.filter(user => user.id !== id);
                    setUsersData(updatedUsers);
                    closeModal();
                })
                .catch(error => {
                    setError(true);
                    console.error('Erro ao excluir tipo de produto:', error);
                });
        } catch (error) {
            setError(true);
            console.error('Erro ao fazer login:', error);
        }
    };

    const openModal = (modalType) => {
        switch (modalType) {
            case 'add':
                setIsModalOpen(true);
                break;
            case 'edit':
                setIsEditModalOpen(true);
                break;
            case 'delete':
                setIsDeleteModalOpen(true);
                break;
            default:
                break;
        }
    };

    const closeModal = () => {
        clearForm();
        setIsModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
    };

    const handleDetailsClick = (user) => {
        setSelectedUser(user);

        setFormData({
            id: user.id,
            name: user.name,
            description: user.description,
            percentage: user.percentage
        });

        openModal('edit');
    };

    const handleDeleteClick = (index: number) => {
        setSelectedRowIndex(index);
        openModal('delete');
    };

    const loadProductsType = (tokenLoader) => {
        if (tokenLoader) {
            getProductsType(tokenLoader)
                .then(data => {
                    const fieldsToIgnore = ['created_at'];

                    let fields = Object.keys(data[0]).filter(field => !fieldsToIgnore.includes(field));

                    let items = data.map(item => {
                        let newItem = {};
                        Object.keys(item).forEach(key => {
                            if (!fieldsToIgnore.includes(key)) {
                                newItem[key] = item[key];
                            }
                        });
                        return newItem;
                    });

                    fields = [...fields, "ações"];
                    setUsersFields(fields);
                    setUsersData(items);
                })
                .catch(error => {
                    console.error('Erro ao obter Produto tipo:', error);
                });
        } else {
            console.error('Token não encontrado.');
        }
    };

    useEffect(() => {
        const tokenState = localStorage.getItem('token');
        setToken(tokenState);

        loadProductsType(tokenState);

    }, [searchTerm]);

    const filteredData = usersData.filter(item =>
        Object.values(item).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div>
            <div className="flex items-center justify-between w-full mb-4">
                <input
                    type="text"
                    placeholder="Busca"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mr-2 w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />

                <button onClick={() => openModal('add')} className="flex items-center gap-3.5 px-6 py-3 text-sm font-medium duration-300 ease-in-out bg-primary text-white lg:text-base">Adicionar</button>
            </div>

            <Table fields={usersFields} items={filteredData} onDetailsClick={handleDetailsClick} onDeleteClick={handleDeleteClick} />

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-10">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-lg"> {/* Alterado para max-w-lg */}
                        <h2 className="text-2xl font-semibold mb-4">Adicionar</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="mr-2 w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="percentage" className="block text-sm font-medium text-gray-700">
                                    Percentage
                                </label>
                                <input
                                    type="number"
                                    id="percentage"
                                    name="percentage"
                                    value={formData.percentage}
                                    onChange={handleInputChange}
                                    className="mr-2 w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                />
                            </div>

                            {alertRender && (
                                error == true ? (
                                    <div className='mb-4'>
                                        <Alert type="error" message="Falha ao criar tipo de produto" />
                                    </div>
                                ) : (
                                    <span></span>
                                )
                            )}

                            <div className="flex justify-end">
                                <button type="submit" className="mb-4 w-full flex items-center justify-center gap-3.5 px-2 py-2 text-sm font-medium duration-300 ease-in-out bg-primary text-white lg:text-base">
                                    Enviar
                                </button>
                            </div>
                        </form>
                        <div className="flex justify-end">
                            <button className="flex items-center gap-3.5 px-2 py-2 text-sm font-medium duration-300 ease-in-out bg-danger text-white lg:text-base" onClick={closeModal}>Fechar Modal</button>
                        </div>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-10">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-lg">
                        <h2 className="text-2xl font-semibold mb-4">Editar</h2>

                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="mr-2 w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="percentage" className="block text-sm font-medium text-gray-700">
                                    Percentage
                                </label>
                                <input
                                    type="number"
                                    id="percentage"
                                    name="percentage"
                                    value={formData.percentage}
                                    onChange={handleInputChange}
                                    className="mr-2 w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                />
                            </div>
                            {alertRender && (
                                error == true ? (
                                    <div className='mb-4'>
                                        <Alert type="error" message="Falha ao editar tipo de produto" />
                                    </div>
                                ) : (
                                    <span></span>
                                )
                            )}
                            <div className="flex justify-end">
                                <button type="submit" className="mb-4 w-full flex items-center justify-center gap-3.5 px-2 py-2 text-sm font-medium duration-300 ease-in-out bg-primary text-white lg:text-base">
                                    Enviar
                                </button>
                            </div>
                        </form>
                        <button className="flex items-center gap-3.5 px-2 py-2 text-sm font-medium duration-300 ease-in-out bg-danger text-white lg:text-base" onClick={closeModal}>Fechar Modal</button>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-10">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-lg"> {/* Alterado para max-w-lg */}
                        <h2 className="text-2xl font-semibold mb-4">Excluir</h2>
                        <h4 className="mb-4">Voce deseja mesmo excluir esse item?</h4>
                        <h4 className="mb-4 font-bold">Os itens vinculados tambem serao excluidos</h4>

                        <div className="flex items-center justify-between w-full">
                            <button onClick={() => handleSubmitDelete(selectedRowIndex)} className=" mr-3 flex items-center gap-3.5 px-4 py-2 text-sm font-medium duration-300 ease-in-out bg-danger text-white lg:text-base">Deletar</button>

                            <button className="flex items-center gap-3.5 px-2 py-2 text-sm font-medium duration-300 ease-in-out bg-primary text-white lg:text-base" onClick={closeModal}>Fechar Modal</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
