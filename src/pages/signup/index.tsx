import { FormEvent, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/home.module.scss';

import logoImg from '../../../public/logo.svg';

import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-toastify';

import Link from 'next/link';
import { canSSRGuest } from '../../utils/canSSRGuest';
import { useAuth } from '../../contexts/AuthContext';

export default function SignUp() {

    const { signUp } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSignUp(event: FormEvent){
        event.preventDefault();

        if(name === '' || email === '' || password === ''){
            toast.warning('Preencha todos os campos!');
            return;
        }

        setLoading(true);

        let data = {
            name,
            email,
            password
        };

        await signUp(data);

        setLoading(false);
    }

    return (
        <>
            <Head>
                <title>Faça seu cadastro agora!</title>
            </Head>
            <div className={styles.containerCenter}>
                <Image src={logoImg} alt='Logo Sujeito Pizzaria' priority/>
                <div className={styles.login}>
                    <h1>Criando sua conta</h1>
                <form onSubmit={handleSignUp}>
                    <Input
                    placeholder='Digite seu nome'
                    type='text'
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    />

                    <Input
                    placeholder='Digite seu e-mail'
                    type='text'
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    />

                    <Input
                    placeholder='Digite sua senha'
                    type='password'
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    />

                    <Button
                    type='submit'
                    loading={loading}
                    >
                    Cadastrar
                    </Button>
                </form>
                <Link className={styles.text} href='/'>
                    Já possui uma conta? Faça o login
                </Link>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
    return {
      props: {}
    }
  })
