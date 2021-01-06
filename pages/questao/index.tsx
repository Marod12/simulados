import Head from 'next/head'
import { FiEdit3, FiTrash2 } from 'react-icons/fi'
import Header from '../../components/Header'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Questoes() {
    const [questoes, setQuestoes] = useState([]);

    const userId = process.browser ? localStorage.getItem('userId') : '';
    const userName = process.browser ? localStorage.getItem('userName') : 'User';

    useEffect(() => {
      axios.get(`/api/questao`, { 
        headers: {
          Authorization: userId,
        }
      }).then(response => {
        setQuestoes(response.data);
      })
    }, [userId]);

    async function handleDeleteQuestao(id, user) {
      if ( user === userId) {
        try { 
          await axios.delete(`/api/questao/${id}`, {
            headers: {
              Authorization: userId,
            }
          });

          setQuestoes(questoes.filter(questao => questao._id !== id));
        } catch (err) {
          alert('Erro ao deletar questão');
        }
      } else {
        alert('Erro ao deletar questão');
      }
    } 

    function localQuestaoId(id) {
      localStorage.setItem('questaoId', id);
    }

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
          <Head>
            <title>Questões</title>
            <link rel="icon" href="/img/criatividade.svg" />
          </Head>

          <Header
            name={userName}
           />

          <section className="px-4 sm:px-6 lg:px-4 xl:px-6 pt-4 pb-4 sm:pb-6 lg:pb-4 xl:pb-6 space-y-4">
            <header className="flex items-center justify-between">
              <h2 className="text-lg leading-6 font-medium text-black">Questões {questoes.length}</h2>
              <a href="/questao/new">
                <button className="hover:bg-black hover:text-white group flex items-center rounded-md text-sm font-medium px-4 py-2">
                  <svg className="group-hover:text-white text-black mr-2" width="12" height="20" fill="currentColor">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6 5a1 1 0 011 1v3h3a1 1 0 110 2H7v3a1 1 0 11-2 0v-3H2a1 1 0 110-2h3V6a1 1 0 011-1z"/>
                  </svg>
                  Nova
                </button>
              </a>
            </header>
            <form className="relative">
              <svg width="20" height="20" fill="currentColor" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
              </svg>
              <input className="focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10" type="text" placeholder="Filtrar questões" />
            </form>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {questoes.map(questao => (
                <li key={questao._id} x-for="item in items">
                  <a className="hover:border-transparent hover:shadow-lg group block rounded-lg p-4 border border-gray-200">
                    <div className="w-full my-0.5 flex items-center text-gray-400">
                      <Link href={`/questao/${questao._id}}`}>
                        <FiEdit3 className="hover:opacity-50" size={15}
                          onClick={() => localQuestaoId(questao._id)} />
                      </Link>

                      <FiTrash2 
                        className="ml-auto hover:opacity-50" 
                        size={15}
                        onClick={() => handleDeleteQuestao(questao._id, questao.user)}
                      />
                    </div>
                    
                    <p className="mt-4 text-center">
                      {questao.materia}
                    </p>

                    <p className="mt-4 text-center">
                      {questao.questao.substring(0, 200)}
                    </p>
                  </a>
                </li>
              ))}
              <li className="hover:shadow-lg flex rounded-lg">
                <a href="/questao/new" className="hover:border-transparent hover:shadow-xs w-full flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-sm font-medium py-4">
                  Nova Questão
                </a>
              </li>
            </ul>
          </section>
      </div>
    )
}