import Head from 'next/head'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

interface Simulado {
  title: string,
  nota: string,
  qtQuestoes: string,
  qCorretas : Array<object>,
  qErradas : Array<object>,
  qNull : Array<object>,
}

export default function NovoSimuladoPage() {
    const [questoes, setQuestoes] = useState([]);
    const [title, setTitle] = useState('');
    const [qtQuestoes, setQtQuestoes] = useState('');
    const [nota, setNota] = useState('');
    const [questoesSimulado, setQuestoesSimulado] = useState([]);
    const [qNull, setQNull] = useState([]);
    const [qCorretas, setQCorretas] = useState([]);
    const [qErradas, setQErradas] = useState([]);
    const [styleStartSimulado, setStyleStartSimulado] = useState('');
    const [styleDadosSimulado, setStyleDadosSimulado] = useState('');
    const [styleEndSimulado, setStyleEndSimulado] = useState('');

    const userId = process.browser ? localStorage.getItem('userId') : '';

    const router = useRouter();

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
    const qtMaterias = [];

    questoes.forEach( (item) => {
      const contem = item.materia
    
      if ( !materiasUser.includes(contem) ) {
        materiasUser.push(item.materia);
        qtMaterias.push({ materia: item.materia, qt: 1 });
      } else if ( materiasUser.includes(contem) ) {
        qtMaterias.forEach( (i) => {
          if ( i.materia === item.materia ) {
            i.qt += 1
          }
        })
      }
    });

    function startSimulado(e) {
      e.preventDefault();

      /*const form = document.querySelector('form[name="startSimulado"]');
      form.style.display = 'none';*/
      setStyleStartSimulado('none');

      /*const formSimulado = document.querySelector('form[name="dadosSimulado"]');
      formSimulado.style.display = 'flex';*/
      setStyleDadosSimulado('flex');

      //** Faz a lista de matérias selecionadas */
      const porMateria = [];

      materiasUser.forEach((item) => {
        if ( document.querySelector(`#${item.replace(' ', '_')}:checked`) !== null ) {
          porMateria.push(item);
        }
      })
      //** Faz a lista de matérias selecionadas */

      //** Faz a lista de questões por matérias */
      const questoesPorMaterias = [];

      questoes.forEach( (item) => {
        if ( porMateria.includes(item.materia) ) {
          questoesPorMaterias.push(item);
        }
      })
      //** Faz a lista de questões por matérias */
      
      //** Sortea as questões */
      const questoesSorteadas = [];
      const numeroSorteado = [];
      const questoesSorteadasPorMateria = [];
      const numeroSorteadoPorMateria = [];

      let contador = 1;
      let contadorPorMateria = 1;

      if( questoesPorMaterias.length === 0 ) {
        while (contador <= parseInt(qtQuestoes)) {
          const index = Math.floor(Math.random() * questoes.length);

          if ( !numeroSorteado.includes(index) ) {
            questoesSorteadas.push(questoes[index]);
            contador ++;
          }
          numeroSorteado.push(index);

          if ( questoesSorteadas.length === questoes.length ) {
            break;
          }
        }
        setQuestoesSimulado(questoesSorteadas)
      } else {
        while (contadorPorMateria <= parseInt(qtQuestoes)) {
          const indexPorMateria = Math.floor(Math.random() * questoesPorMaterias.length);

          if ( !numeroSorteadoPorMateria.includes(indexPorMateria) ) {
            questoesSorteadasPorMateria.push(questoesPorMaterias[indexPorMateria]);
            contadorPorMateria ++;
          }
          numeroSorteadoPorMateria.push(indexPorMateria);

          if ( questoesSorteadasPorMateria.length === questoesPorMaterias.length ) {
            break;
          }
        }
        setQuestoesSimulado(questoesSorteadasPorMateria)
      }  

      //questoesPorMaterias.length === 0 ? setQuestoesSimulado(questoesSorteadas) : setQuestoesSimulado(questoesSorteadasPorMateria) ;
      //** Sortea as questões */
    }

    function endSimulado(e) {
      e.preventDefault();

      /*const formSimulado = document.querySelector('form[name="dadosSimulado"]');
      formSimulado.style.display = 'none'; */
      setStyleDadosSimulado('none');

      /*const form = document.querySelector('.finalizado');
      form.style.display = 'flex';*/
      setStyleEndSimulado('flex');

      /* 
      const resps = document.querySelector('input[name="5ff064ca8b0a7407ec133bec"]:checked');
      resps === null ? console.log(resps) : console.log(resps['value']); */

      const respNull = [];
      const respTrue = [];
      const respFalse = [];

      //** */
      questoesSimulado.forEach(resps);

      function resps(items) {
        //console.log(items._id, items.resposta)
        const respUser = document.querySelector(`input[name="${items._id}"]:checked`);
        const resp = respUser === null ? respUser : respUser['value'];
        //console.log(resp);
        if ( resp === null ) {
          //console.log('em branco')
          respNull.push({questao: items._id, pergunta: items.questao, resposta: items.resposta, minhaResposta: resp, materia: items.materia});
        } else if ( resp === items.resposta ) {
          //console.log('correta')
          respTrue.push({questao: items._id, pergunta: items.questao, resposta: items.resposta, minhaResposta: resp, materia: items.materia});
        } else if ( resp !== items.resposta ) {
          //console.log('errada')
          respFalse.push({questao: items._id, pergunta: items.questao, resposta: items.resposta, minhaResposta: resp, materia: items.materia});
        }
      }

      setQNull(respNull);
      setQCorretas(respTrue);
      setQErradas(respFalse);

      /* 1 errada anula uma certa */
      const notaSimulado = questoesSimulado.length - (respFalse.length * 2) - respNull.length;

      setNota(notaSimulado.toString());
    }

    const data:Simulado = {
      title,
      nota,
      qtQuestoes,
      qCorretas,
      qErradas,
      qNull,
    }
    
    async function handleSubmit() {
      /* Salvando no Banco de dados */
      try { 
        await axios.post(`/api/simulado/new`, data, {
          headers: { 
            Authorization: userId,
          }
        });
        //alert('Cadastrado');
        router.push('/home');
      } catch (err) {
        alert('Erro ao cadastrar simulado');
      }
    }

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
          <Head>
            <title>Novo Simulado</title>
            <link rel="icon" href="/img/criatividade.svg" />
          </Head>

          <form className="flex flex-col items-center justify-center gap-1 h-screen"
            name="startSimulado"
            style={{display: styleStartSimulado}}
            onSubmit={startSimulado}>
            <h1 className="mb-10 text-7xl md:text-9xl text-black text-center">
              Simulado
            </h1>

            <input className="px-2.5 py-1.5 focus:ring-1 focus:ring-gray-700 focus:outline-none w-5/6 md:w-auto text-sm text-black placeholder-gray-400 border border-gray-200 rounded-md"
              placeholder="Título do simulado"
              required
              onChange={e => setTitle(e.target.value)} />

            <input className="px-2.5 py-1.5 focus:ring-1 focus:ring-gray-700 focus:outline-none w-5/6 md:w-auto text-sm text-black placeholder-gray-400 border border-gray-200 rounded-md"
              placeholder={questoes.length < 120 ? `N° de questões Max. ${questoes.length}`: `N° de questões Max. 120`}
              max="120"
              required
              type="number"
              onChange={e => setQtQuestoes(e.target.value)} />
            
            <div className="my-4 container w-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {qtMaterias.map(materia => (
                <div key={materia.materia.replace(' ', '_')}>
                  <input name={materia.materia.replace(' ', '_')} type="checkbox" value={materia.materia}
                    id={materia.materia.replace(' ', '_')} className="inputRadio hidden" />
                  <label id="labelRadio"
                    className="w-auto md:w-auto block mx-8 sm:mx-auto focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-gray-600 bg-white hover:bg-gray-100 font-medium border" 
                    htmlFor={materia.materia.replace(' ', '_')}>
                      {materia.qt} - {materia.materia}
                  </label>
                </div>
              ))}  
              </div>
            </div>

            <button type="submit"
              className="mt-2 p-1.5 w-5/6 md:w-56 flex items-center justify-center rounded-md bg-black text-sm text-white hover:opacity-60">
                Start
            </button>

            <Link href="/home">
                <a className="mt-14 pb-16 text-gray-500 cursor-pointer hover:text-gray-700 flex flex-row text-sm">
                  <FiArrowLeft className="mr-1" size={18} />
                  Voltar
                </a>
            </Link>
          </form>

          <form className="mt-16 hidden flex-1 flex-col items-center justify-center gap-1"
            name="dadosSimulado"
            style={{display: styleDadosSimulado}}
            onSubmit={endSimulado}>

            {questoesSimulado.map(questao => (
              <div className="flex flex-col items-center justify-center gap-1 p-4 md:p-16 border shadow-lg rounded-3xl mb-12" 
                key={questao._id}>

                <p className="p-6 md:py-2 mb-6 text-md">
                  {questao.questao}
                </p>
              
                {questao.resposta === 'F' ? (
                    <div className="mb-6 container w-sm">
                      <div className="flex flex-row items-center justify-center gap-2">
                        <div>
                          <input name={`${questao._id}`} type="radio" value="T"
                            id={`${questao._id}-1`} className="inputRadio hidden" />
                          <label id="labelRadio"
                            className="w-40 block mx-auto focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-gray-600 bg-white hover:bg-gray-100 font-medium border" 
                            htmlFor={`${questao._id}-1`}>
                              Certo
                          </label>
                        </div>

                        <div>
                          <input name={`${questao._id}`} type="radio" value="F"
                            id={`${questao._id}-2`} className="inputRadio hidden" />
                          <label id="labelRadio"
                            className="w-40 block mx-auto focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-gray-600 bg-white hover:bg-gray-100 font-medium border" 
                            htmlFor={`${questao._id}-2`}>
                              Errado
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : questao.resposta === 'T' ? (
                    <div className="mb-6 container w-sm">
                      <div className="flex flex-row items-center justify-center gap-2">
                        <div>
                          <input name={`${questao._id}`} type="radio" value="T"
                            id={`${questao._id}-1`} className="inputRadio hidden" />
                          <label id="labelRadio"
                            className="w-40 block mx-auto focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-gray-600 bg-white hover:bg-gray-100 font-medium border" 
                            htmlFor={`${questao._id}-1`}>
                              Certo
                          </label>
                        </div>

                        <div>
                          <input name={`${questao._id}`} type="radio" value="F"
                            id={`${questao._id}-2`} className="inputRadio hidden" />
                          <label id="labelRadio"
                            className="w-40 block mx-auto focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-gray-600 bg-white hover:bg-gray-100 font-medium border" 
                            htmlFor={`${questao._id}-2`}>
                              Errado
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 container w-sm">
                      <div className="flex flex-1 flex-row items-center justify-center gap-2">
                        <div>
                          <input name={`${questao._id}`} type="radio" value="A"
                            id={`${questao._id}-1`} className="inputRadio hidden" />
                          <label id="labelRadio"
                            className="w-16 md:w-24 block mx-auto focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-gray-600 bg-white hover:bg-gray-100 font-medium border" 
                            htmlFor={`${questao._id}-1`}>
                              A
                          </label>
                        </div>

                        <div>
                          <input name={`${questao._id}`} type="radio" value="B"
                            id={`${questao._id}-2`} className="inputRadio hidden" />
                          <label id="labelRadio"
                            className="w-16 md:w-24 block mx-auto focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-gray-600 bg-white hover:bg-gray-100 font-medium border" 
                            htmlFor={`${questao._id}-2`}>
                              B
                          </label>
                        </div>

                        <div>
                          <input name={`${questao._id}`} type="radio" value="C"
                            id={`${questao._id}-3`} className="inputRadio hidden" />
                          <label id="labelRadio"
                            className="w-16 md:w-24 block mx-auto focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-gray-600 bg-white hover:bg-gray-100 font-medium border" 
                            htmlFor={`${questao._id}-3`}>
                              C
                          </label>
                        </div>

                        <div>
                          <input name={`${questao._id}`} type="radio" value="D"
                            id={`${questao._id}-4`} className="inputRadio hidden" />
                          <label id="labelRadio"
                            className="w-16 md:w-24 block mx-auto focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-gray-600 bg-white hover:bg-gray-100 font-medium border" 
                            htmlFor={`${questao._id}-4`}>
                              D
                          </label>
                        </div>

                        <div>
                          <input name={`${questao._id}`} type="radio" value="E"
                            id={`${questao._id}-5`} className="inputRadio hidden" />
                          <label id="labelRadio"
                            className="w-16 md:w-24 block mx-auto focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-gray-600 bg-white hover:bg-gray-100 font-medium border" 
                            htmlFor={`${questao._id}-5`}>
                              E
                          </label>
                        </div>
                      </div>
                    </div>
                  )
                }

              </div>
            ))}

            <button type="submit"
              className="w-40 my-10 mx-auto block focus:outline-none py-2 px-5 rounded-lg shadow-sm text-center text-white bg-black hover:opacity-50">
              Finalizar
            </button>
          </form>

          <section className="finalizado hidden overflow-hidden flex-col items-center justify-center gap-1 h-screen"
            style={{display: styleEndSimulado}}>
            <div className="bg-white rounded-lg p-10 flex items-center shadow justify-center">
              <div>
                <svg className="mb-4 h-20 w-20 text-green-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>

                <h2 className="text-2xl mb-8 text-gray-800 text-center font-bold">Simulado Finalizado</h2>

                <div className="flex flex-1 flex-col gap-4 items-center justify-center">
                  <h1 className="text-8xl mt-4 mb-10" >
                    {nota}
                  </h1>
                  <button className="rounded-full h-16 w-16 flex items-center justify-center ring-1 ring-gray-200 shadow-md text-center text-md text-gray-600 bg-gray-150 hover:shadow-xl hover:text-black font-medium"
                    type="submit"
                    onClick={handleSubmit}>
                    OK
                  </button>
                </div>  
              </div>
            </div>
          </section>
      </div>
    )
}