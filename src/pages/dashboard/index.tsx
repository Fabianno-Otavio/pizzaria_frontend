import { useState } from 'react';
import { canSSRAuth } from '../../utils/canSSRAuth';
import Head from 'next/head';
import { Header } from '../../components/Header';
import styles from './styles.module.scss';
import { FiRefreshCcw } from 'react-icons/fi';
import { setupAPIClient } from '../../services/api';

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

export default function Dashboard({ orders }: HomeProps){

    const [orderList, setOrderList] = useState(orders || []);

    function handleOpenModalView(order_id: string){
        alert('teste' + order_id)
    }

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
                    <button>
                        <FiRefreshCcw color='#3fffa3'/>
                    </button>
                </div>

                <article className={styles.listOrders}>

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