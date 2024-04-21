'use client'
import { getUsers, deleteUsers, addUsers, updateUsers } from '@/services/User';
import { useEffect, useState } from 'react';
import Table from "../Tables/Table";
import { keyValue } from "@/types/keyValue";
import Alert from '../Alert/Alert';

export default function UserList() {
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
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const clearForm = (e) => {
        setFormData({
            id: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError(true);
            return false;
        }

        try {
            const response = await addUsers(token, formData);

            if (response.data == '') {
                loadUsers(token);
                closeModal();
            } else {
                setError(true);
                console.error('Erro ao adicionar usuário:', response.data);
            }
        } catch (error) {
            setError(true);
            console.error('Erro ao adicionar usuário:', error);
        } finally {
            setAlertRender(true); // Este bloco finally será executado, independentemente de a requisição ter sucesso ou falhar
        }

    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError(true);
            return false;
        }

        try {
            const response = await updateUsers(token, formData);

            if (response.data == '') {
                loadUsers(token);
                closeModal();
            } else {
                setError(true);
                console.error('Erro ao adicionar usuário:', response.data);
            }
        } catch (error) {
            setError(true);
            console.error('Erro ao atualizar usuário:', error);
        } finally {
            setAlertRender(true); // Este bloco finally será executado, independentemente de a requisição ter sucesso ou falhar
        }

    };

    const handleSubmitDelete = (id) => {
        try {
            deleteUsers(token, id)
                .then(response => {
                    const updatedUsers = usersData.filter(user => user.id !== id);
                    setUsersData(updatedUsers);
                    closeModal();
                })
                .catch(error => {
                    setError(true);
                    console.error('Erro ao excluir usuário:', error);
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
        setError(false);
        setSelectedUser(user);

        setFormData({
            id: user.id,
            username: user.username,
            email: user.email
        });

        openModal('edit');
    };

    const handleDeleteClick = (index: number) => {
        setSelectedRowIndex(index);
        openModal('delete');
    };

    const loadUsers = (tokenLoader) => {
        if (tokenLoader) {
            getUsers(tokenLoader)
                .then(data => {
                    const fieldsToIgnore = ['password', 'created_at'];

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
                    console.error('Erro ao obter usuários:', error);
                });
        } else {
            console.error('Token não encontrado.');
        }
    };

    useEffect(() => {
        const tokenState = localStorage.getItem('token');
        setToken(tokenState);

        loadUsers(tokenState);

    }, [searchTerm]);

    const filteredData = usersData.filter(item =>
        Object.values(item).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div>
            <h4 className="text-title-sm2 font-bold mb-4 text-black dark:text-white">
                Usuários
            </h4>
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
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="mr-2 w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="mr-2 w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirmar Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="mr-2 w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                />
                            </div>
                            <p htmlFor="password" className="block text-sm font-medium text-gray-700">
                                A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número, um caractere especial e ter no mínimo 6 caracteres.
                                </p>
                            {alertRender && (
                                error == true ? (
                                    <div className='mb-4'>
                                        <Alert type="error" message="Falha ao criar usuario" />
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
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <input type="hidden" name="id" id="id" value={formData.id} />
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="mr-2 w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="mr-2 w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"

                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirmar Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="mr-2 w-auto rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"

                                />
                            </div>
                            {alertRender && (
                                error == true ? (
                                    <div className='mb-4'>
                                        <Alert type="error" message="Falha ao editar usuario" />
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
