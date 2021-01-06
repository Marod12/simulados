import Head from 'next/head'
import Link from 'next/link'
import { FiLogIn } from 'react-icons/fi'
import axios from 'axios'
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
    const [ code, setCode ] = useState('');

    const router = useRouter();

    async function handleLogin(e) {
      e.preventDefault();

      try {
        const response = await axios.post(`/api/session`, { code });
        localStorage.setItem('userId', response.data._id);
        localStorage.setItem('userName', response.data.name);
        localStorage.setItem('userCode', response.data.code);
        router.push('/home');
      } catch (err) {
        alert('Falha no login, tente novamente.');
      }
    }

    return (
      <div className="flex items-center justify-center h-screen">
        <Head>
          <title>Login</title>
          <link rel="icon" href="/img/criatividade.svg" />
        </Head>

        <section className="max-w-7xl py-24 px-10 flex flex-1 flex-col items-center justify-center">
          <img src="/img/criatividade.svg"
              className="w-40 flex items-center justify-center"
            />    

          <form className="w-full h-24 mt-16 flex flex-1 flex-col items-center justify-center"
            onSubmit={handleLogin}>
            <h1 className="mb-4 text-xl text-black">
              Faça seu login
            </h1>

            <input className="px-2.5 py-1.5 focus:ring-1 focus:ring-gray-700 focus:outline-none w-auto text-sm text-black placeholder-gray-400 border border-gray-200 rounded-md " 
              type="text" 
              placeholder="Insira seu código"
              required
              value={code}
              onChange={e => setCode(e.target.value)} />
            
            <button type="submit"
              className="mt-2 p-1.5 w-56 flex items-center justify-center rounded-md bg-black text-sm text-white hover:opacity-60">
              Entrar
            </button>
            
            <Link href="/obter-codigo">
                <a className="mt-14 text-gray-400 cursor-pointer hover:text-gray-700 flex flex-row text-sm">
                  <FiLogIn className="mr-1" size={20} />
                  Obtenha seu código
                </a>
            </Link>
          </form>  
        </section>
      </div>
    )
}