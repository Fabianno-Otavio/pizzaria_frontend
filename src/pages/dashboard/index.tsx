import { useState } from 'react';
import { canSSRAuth } from '../../utils/canSSRAuth';
import Head from 'next/head';
import { Header } from '../../components/Header';
import styles from './styles.module.scss';
import { FiRefreshCcw } from 'react-icons/fi';
import { setupAPIClient } from '../../services/api';
import { ModalOrder } from '../../components/ModalOrder';
import Modal from 'react-modal';

type OrderProps = {
    id: string;
    table: string | number;
    status: boolean;
    draft: boolean;
    name: string | null;
}
interface HomeProps{
    orders: OrderProps[];
}

export type OrderItemProps = {
    id: string;
    amount: number;
    order_id: string;
    product_id: string;
    product: {
        id: string;
        name: string;
        description: string;
        price: string;
        banner: string;
    }
    order: OrderProps;
}

export default function Dashboard({ orders }: HomeProps){

    const apiClient = setupAPIClient();
    const [orderList, setOrderList] = useState(orders || []);

    const [modalItem, setModalItem] = useState<OrderItemProps[]>({} as OrderItemProps[]);
    const [modalVisible, setModalVisible] = useState(false);

    function handleCloseModal(){
        setModalVisible(false);
    }

    async function handleOpenModalView(order_id: string){
        const response = await apiClient.get('/orders/detail', {
            params: {
                order_id: order_id
            }
        });
        setModalItem(response.data);
        
        setModalVisible(true);
    }

    async function handleFinishItem(order_id: string){
        await apiClient.put('/order/finish', {
            order_id: order_id
        });

        handleRefreshOrders();
        setModalVisible(false);
    }

    async function handleRefreshOrders(){
        const response = await apiClient.get('/orders');
        setOrderList(response.data);
        
    }

    Modal.setAppElement('#__next');

    return(
        <>
        <Head>
            <title>Painel - SujeitoPizzaria</title>
        </Head>
        <div>
            <Header/>
            <main className={styles.container}>

                <div className={styles.containerHeader}>
                    <h1>Últimos pedidos</h1>
                    <button onClick={handleRefreshOrders} >
                        <FiRefreshCcw color='#3fffa3'/>
                    </button>
                </div>

                <article className={styles.listOrders}>

                    {orderList.length === 0 && (
                        <span className={styles.emptyList}>
                            Nenhum pedido aberto foi encontrado.
                        </span>
                    )}

                    {orderList.map(item => {
                        return(
                            <section key={item.id} className={styles.orderItem}>
                                <button onClick={()=> handleOpenModalView(item.id)}>
                                    <div className={styles.tag}></div>
                                    <span>Mesa {item.table}</span>
                                </button>
                            </section>
                        )
                    })}

                </article>

            </main>

            { modalVisible && (
                <ModalOrder
                isOpen={modalVisible}
                onRequestClose={handleCloseModal}
                order={modalItem}
                handleFinishOrder={handleFinishItem}
                />
            )}
            
        </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async(ctx)=> {

    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/orders');
    
    return {
        props: {
            orders: response.data
        }
    }
})