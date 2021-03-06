import Head from 'next/head'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

interface Questao {
  questao: string,
  resposta: string,
  materia: string
}

export default function EditarQuestao() {
    const [ questoes, setQuestoes ] = useState([]);
    const [ questao, setQuestao ] = useState('');
    const [ materia, setMateria ] = useState('');
    const [ resposta, setResposta ] = useState('');

    const questaoId = process.browser ? localStorage.getItem('questaoId') : '';
    const userId = process.browser ? localStorage.getItem('userId') : '';

    const router = useRouter();
    
    useEffect(() => {
      axios.get(`/api/questao/${questaoId}`, { 
        headers: {
          Authorization: localStorage.getItem('userId'),
        }
      }).then(response => {
        setQuestao(response.data.questao);
        setMateria(response.data.materia);
        setResposta(response.data.resposta);
      })
    }, [questaoId]);

    useEffect(() => {
      axios.get(`/api/questao`, { 
        headers: {
          Authorization: userId,
        }
      }).then(response => {
        setQuestoes(response.data);
      })
    }, [userId]);

    const materiasUser = [];

    questoes.forEach(courses)

    function courses(item) {
      const contem = item.materia
      
      if ( !materiasUser.includes(contem) ) {
        materiasUser.push(item.materia);
      }
    }

    const data: Questao = {
      questao,
      resposta,
      materia
    }

    async function handleEditarQuestao(e) {
      e.preventDefault();
      try { 
        await axios.put(`/api/questao/${questaoId}`, data, {
          headers: { 
            Authorization: localStorage.getItem('userId'),
          }
        });
        localStorage.removeItem('questaoId');
        router.push('/questao');
      } catch (err) {
        alert('Erro ao editar questão');
      }
    }
    
    return (
      <div className="max-w-5xl my-auto mx-auto px-4 sm:px-6 md:px-8">
        <Head>
          <title>Editar Questão</title>
          <link rel="icon" href="/img/criatividade.svg" />
        </Head>
          
        <form className="pt-24 flex flex-col items-center justify-center gap-1"
          onSubmit={handleEditarQuestao}>
          <h1 className="mb-10 text-7xl md:text-9xl text-black text-center">
            Editar
          </h1>
          
          <textarea className="outline-none w-10/12 p-6 text-sm text-black placeholder-gray-700 border-gray-200 resize-y border rounded-md shadow-md" 
              required
              rows={12}
              value={questao}
              onChange={e => setQuestao(e.target.value)}>
          </textarea>

          <div className="py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            <select className="px-2.5 py-1.5 focus:ring-1 focus:ring-gray-700 focus:outline-none w-auto text-sm text-gray-500 border border-gray-200 rounded-md"
                  value={materia}
                onChange={e => setMateria(e.target.value)}>
                
                <option value="">Matérias</option>
                {materiasUser.map(materia => (
                  <option value={materia}>{materia}</option>
                ))} 
            </select>
            
            <input className="px-2.5 py-1.5 focus:ring-1 focus:ring-gray-700 focus:outline-none w-auto text-sm text-black placeholder-gray-400 border border-gray-200 rounded-md"
                type="text"
                placeholder="Matéria nova"
                name="newMateria"
                onChange={e => setMateria(e.target.value)}/>
          </div>

          <div className="py-4 md:py-10">
            <p className="text-center mb-4 text-sm text-gray-600">
              Resposta: {resposta === 'T' ? 'Certo' : resposta === 'F' ? 'Errado' : resposta }
            </p>
            <div className="mb-6 container w-sm">
              <div className="flex flex-row items-center justify-center gap-2">
                <div>
                  <input name="resposta" type="radio" value="T" 
                    id="resposta-1" className="inputRadio hidden" onChange={e => setResposta(e.target.value)} />
                  <label id="labelRadio"
                    className="w-40 block mx-auto focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-gray-600 bg-white hover:bg-gray-100 font-medium border" 
                    htmlFor="resposta-1">
                      Certo
                  </label>
                </div>

                <div>
                  <input name="resposta" type="radio" value="F" 
                    id="resposta-2" className="inputRadio hidden" onChange={e => setResposta(e.target.value)} />
                  <label id="labelRadio"
                    className="w-40 block mx-auto focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-gray-600 bg-white hover:bg-gray-100 font-medium border" 
                    htmlFor="resposta-2">
                      Errado
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-6 container w-sm">
              <div className="flex flex-1 flex-row items-center justify-center gap-2">
                <div>
                  <input name="resposta" type="radio" value="A" 
                    id="resposta-3" className="inputRadio hidden" onChange={e => setResposta(e.target.value)} />
                  <label id="labelRadio"
                    className="w-16 md:w-24 block mx-auto focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-gray-600 bg-white hover:bg-gray-100 font-medium border" 
                    htmlFor="resposta-3">
                      A
                  </label>
                </div>

                <div>
                  <input name="resposta" type="radio" value="B" 
                    id="resposta-4" className="inputRadio hidden" onChange={e => setResposta(e.target.value)} />
                  <label id="labelRadio"
                    className="w-16 md:w-24 block mx-auto focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-gray-600 bg-white hover:bg-gray-100 font-medium border" 
                    htmlFor="resposta-4">
                      B
                  </label>
                </div>

                <div>
                  <input name="resposta" type="radio" value="C" 
                    id="resposta-5" className="inputRadio hidden" onChange={e => setResposta(e.target.value)} />
                  <label id="labelRadio"
                    className="w-16 md:w-24 block mx-auto focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-gray-600 bg-white hover:bg-gray-100 font-medium border" 
                    htmlFor="resposta-5">
                      C
                  </label>
                </div>

                <div>
                  <input name="resposta" type="radio" value="D" 
                    id="resposta-6" className="inputRadio hidden" onChange={e => setResposta(e.target.value)} />
                  <label id="labelRadio"
                    className="w-16 md:w-24 block mx-auto focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-gray-600 bg-white hover:bg-gray-100 font-medium border" 
                    htmlFor="resposta-6">
                      D
                  </label>
                </div>

                <div>
                  <input name="resposta" type="radio" value="E"
                    id="resposta-7" className="inputRadio hidden" onChange={e => setResposta(e.target.value)} />
                  <label id="labelRadio"
                    className="w-16 md:w-24 block mx-auto focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-gray-600 bg-white hover:bg-gray-100 font-medium border" 
                    htmlFor="resposta-7">
                      E
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <button type="submit"
            className="mt-2 p-1.5 w-60 flex items-center justify-center rounded-md bg-black text-white hover:opacity-60">
            Editar
          </button>

          <Link href="/questao">
              <a className="mt-14 pb-16 text-gray-500 cursor-pointer hover:text-gray-700 flex flex-row text-sm">
                <FiArrowLeft className="mr-1" size={18} />
                Voltar
              </a>
          </Link>
        </form>
      </div>
    )
}