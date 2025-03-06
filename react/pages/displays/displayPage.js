import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import globalStyles from '../../../../../../src/styles/global';
import {fetchDisplayType} from '../../../src/services/displayService';
import { Dimensions } from 'react-native'; 
import { Modal } from 'react-native';

const { width, height } = Dimensions.get('window');

const DisplayPage = () => {
    // Define os estados iniciais
    const [orders, setOrders] = useState([]);                       // Armazena os pedidos
    const [selectedOrder, setSelectedOrder] = useState(null);       // Pedido selecionado para detalhes
    const [loading, setLoading] = useState(true);                   // Loading
    const [displayType, setDisplayType] = useState('');             // Tipo de display
    const [isLandscape, setIsLandscape] = useState(width > height); // Modo paisagem?
    const [modalVisible, setModalVisible] = useState(false);        // Controla o Modal
    const [hasDisplay, setHasDisplay] = useState(false);            // Indica se tem displays disponíveis

    // Buscar dados da API ao carregar a tela
    useEffect(() => {
        const fetchData = async () => {
            console.log('iniciando fetchData');
            try {
                // Faz uma requisição para obter displays
                const displays = await fetchDisplayType();
                console.log('Displays:', displays);
                setLoading(false);

                // Verifica se há displays retornados pela API
                const displaysExist = displays && displays.length > 0;

                // Define o estado com base na existência de displays
                if (!displaysExist) {
                    setModalVisible(true);
                    setHasDisplay(false); 
                } else {
                    setHasDisplay(true);
                    setModalVisible(false);
                }

                const dummyDisplayType = 'view'; // Define o tipo de display (produção ou visualização)
                setDisplayType(dummyDisplayType);

                // Dados de exemplo para exibir pedidos
                const dummyOrders = [
                    { id: 1, status: 'Aguardando', customerName: 'Cliente 1', items: ['Sanduíche', 'Batata', 'Observação: Sem cebola'] },
                    { id: 2, status: 'Em preparação', customerName: 'Cliente 2', items: ['Pizza', 'Refrigerante', 'Observação: Extra queijo'] },
                    { id: 3, status: 'Finalizado', customerName: 'Cliente 3', items: ['Salada', 'Suco', 'Observação: Sem tomate'] }
                ];

                setOrders(dummyOrders);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                setLoading(false);
            }
        };

        fetchData();

        // Atualiza a orientação da tela mudando as dimensões
        const updateOrientation = () => {
            setIsLandscape(Dimensions.get('window').width > Dimensions.get('window').height);
        };

        // Adiciona um listener pra mudanças
        const dimensionChangeListener = Dimensions.addEventListener('change', updateOrientation);
        return () => {
            dimensionChangeListener.remove();
        };
    }, []);

    // Função para alterar o status do pedido
    const handleOrderStatusChange = async (orderId, newStatus) => {
        try {
            // Atualiza o status do pedido na API (se disponível)
            // await updateOrderStatus(orderId, newStatus);
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error('Erro ao atualizar status do pedido:', error);
        }
    };

    // Função para renderizar os detalhes de um pedido selecionado
    const renderOrderDetails = (order) => {
        return (
            <ScrollView contentContainerStyle={styles.orderDetails}>
                <Text style={[styles.detailsTitle, width > 600 && styles.tabletText]}>Detalhes do Pedido #{order.id}</Text>
                <Text style={[styles.detailsText, width > 600 && styles.tabletText]}>Cliente: {order.client.name}</Text>
                <Text style={[styles.detailsText, width > 600 && styles.tabletText]}>Status: {order.status?.status}</Text>
                <Text style={[styles.detailsText, width > 600 && styles.tabletText]}>Itens:</Text>
                {order.orderProducts.map((orderProduct, index) => (
                    <View key={index} style={styles.detailsItemContainer}>
                        <Text style={[styles.detailsItem, width > 600 && styles.tabletText]}>{orderProduct.product.product}</Text>
                        <Text style={[styles.detailsObservation, width > 600 && styles.tabletText]}>Observação: {orderProduct.product.description}</Text>
                    </View>
                ))}
                {displayType === 'production' && (
                    <View style={styles.buttonContainer}>
                        {order.status?.status === 'Aguardando' && (
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleOrderStatusChange(order.id, 'Em preparação')}
                            >
                                <Text style={styles.buttonText}>Iniciar Preparação</Text>
                            </TouchableOpacity>
                        )}
                        {order.status?.status === 'Em preparação' && (
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleOrderStatusChange(order.id, 'Finalizado')}
                            >
                                <Text style={styles.buttonText}>Finalizar</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </ScrollView>
        );
    };

    // Função para criar um novo display
    const handleCreateDisplay = (type) => {
        setDisplayType(type);
        setHasDisplay(true);
        setModalVisible(false);
        // API call: dispatch(createDisplay({ name: 'Default Display', status: 'entrada', type }));
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Modal para selecionar o tipo de display */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecione o Tipo de Display</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => handleCreateDisplay('production')}
                        >
                            <Text style={styles.buttonText}>Produção</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => handleCreateDisplay('view')}
                        >
                            <Text style={styles.buttonText}>Visualização</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {hasDisplay && (
                <>
                    {/* Lista de pedidos */}
                    <View style={[styles.orderListContainer, displayType === 'production' && isLandscape && { flex: 3 }]}>
                        <Text style={styles.title}>
                            {displayType === 'view' ? 'Pedidos Disponíveis para Retirada' : 'Pedidos em Preparação'}
                        </Text>
                        <FlatList
                            data={orders}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.orderItem} onPress={() => displayType === 'production' ? setSelectedOrder(item) : null}>
                                    <Text style={styles.orderText}>Pedido: #{item.id}</Text>
                                    <Text style={styles.orderText}>Status: {item.status.status}</Text>
                                    <Text style={styles.orderText}>Cliente: {item.client.name}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </View>
                    {/* Detalhes do pedido selecionado */}
                    {displayType === 'production' && (
                        <View style={[styles.orderDetailsContainer, isLandscape && { flex: 2 }]}>
                            {selectedOrder ? renderOrderDetails(selectedOrder) : <Text style={styles.detailsPlaceholder}>Selecione um pedido para ver os detalhes</Text>}
                        </View>
                    )}
                </>
            )}
        </SafeAreaView>
    );
};

// Estilos do componente
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    orderListContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#DA291C',
        marginBottom: 20,
    },
    orderItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
    },
    orderText: {
        fontSize: 16,
        color: '#333',
    },
    orderDetailsContainer: {
        flex: 2,
        padding: 20,
        backgroundColor: '#e6e6e6',
    },
    orderDetails: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        flexGrow: 1,
    },
    detailsTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detailsText: {
        fontSize: 18,
        marginBottom: 5,
    },
    detailsItemContainer: {
        marginBottom: 10,
    },
    detailsItem: {
        fontSize: 16,
        marginLeft: 10,
    },
    detailsObservation: {
        fontSize: width > 600 ? 14 : 12,
        marginLeft: 10,
        color: '#555',
    },
    detailsPlaceholder: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginTop: 50,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        padding: 10,
        backgroundColor: '#DA291C',
        borderRadius: 5,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default DisplayPage;
