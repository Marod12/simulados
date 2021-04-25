import Head from 'next/head'
import Link from 'next/link'
import { FiEdit3, FiTrash2, FiArrowLeft } from 'react-icons/fi'
import axios from 'axios'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'

export default function User() { 
    const userId = process.browser ? localStorage.getItem('userId') : '';
    const userName = process.browser ? localStorage.getItem('userName') : 'User';
    const [userCode, setUserCode] =  useState('');

    const router = useRouter();

    useEffect(() => {
      axios.get(`/api/user/${userId}`, { 
        headers: {
          Authorization: userId,
        }
      }).then(response => {
        setUserCode(response.data.code);
      })
    }, [userId]);

    async function handleDeleteUser() {
      try {
        await axios.delete(`/api/user/${userId}`);
        alert('Usuário deletado');
        router.push('/');
      } catch(err) {
        alert('Erro ao deletar usuário');
      }
    }

    return (
      <div className="max-w-5xl my-auto mx-auto px-4 sm:px-6 md:px-8">
        <Head>
          <title>{userName}</title>
          <link rel="icon" href="/img/einstein.svg" />
        </Head>

        <section className="max-w-7xl py-24 px-10 flex flex-1 flex-col items-center justify-center">
          <img src="/img/einstein.svg"
            className="w-40"
          />

            <h1 className="mt-16 mb-4 text-2xl text-black">
              {userName}
            </h1>

            <p className="mb-4 text-sm text-black">
               {userCode}
            </p>

            <div className="w-full mt-6 flex items-center justify-center text-gray-500  hover:text-gray-700">
                <Link href={`/user/${userId}`}>
                    <FiEdit3 className="cursor-pointer"
                      size={15} />
                </Link>

                <FiTrash2 
                  className="ml-24 cursor-pointer" 
                  size={15}
                  onClick={handleDeleteUser}
                />
                
            </div>

            <Link href="/home">
                <a className="mt-14 pb-16 text-gray-500 cursor-pointer hover:text-gray-700 flex flex-row text-sm">
                  <FiArrowLeft className="mr-1" size={18} />
                  Voltar
                </a>
            </Link>
        </section>
      </div>
    )
}