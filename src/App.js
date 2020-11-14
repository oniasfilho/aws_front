import React, {useState, useEffect} from "react";
import Cadastro from "./components/Cadastro";
import Listagem from "./components/Listagem";
import Login from "./components/Login";
import axios from 'axios';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';


function App() {
  const[atualiza, setAtualiza] = useState(0);
  const [basicAuthHeader, setBasicAuthHeader] = useState("");
  const [dados, setDados] = useState([]);
  const [autenticado, setAutenticado] = useState(false);


  function inserirInterceptadores(){
    axios.interceptors.request.use(
      (config) => {
        if(autenticado){
          config.headers.authorization = basicAuthHeader
        }
        return config
      }
    )
  }


  function autentica(){
    setAutenticado(true);
    inserirInterceptadores();
  }

  function recebeLogin(e){
    const {username, password} = e;
    setBasicAuthHeader('Basic ' + window.btoa(username + ":" + password))
    sessionStorage.setItem('authenticatedUser', username);

  }

  useEffect(() => {
    if(sessionStorage.authenticatedUser === "softplan"){
      autentica();
    }
  })

  useEffect(() =>{
    try {
			let res = axios.get("/api/pessoas", {
              });
            res.then(data => {
              setDados(data.data)
            })
            

		} catch (error) {
			console.log(error)
		}
  }, [atualiza,autenticado])


  function remove(id){
    setDados(dados.filter(dado => dado.id !== id))
  }

  function handleAtualiza(){
    setAtualiza(oldVal => oldVal +1)
  }
  
  return (
    <Router>
    <Route path="/source" component={()=>{
      window.location.href="http://softplanapi-env.eba-rxwir9h6.sa-east-1.elasticbeanstalk.com/source";
      return null;
    }} />
    <div className="App">
      <Cadastro atualiza={handleAtualiza}/>
      <Listagem 
        atualiza={handleAtualiza}
        listaCompleta={dados}
        remove={remove}
      />      
    </div>
  </Router>
  );
}

export default App;
