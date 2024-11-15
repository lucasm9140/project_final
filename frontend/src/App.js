import React, { useState } from "react";
import axios from "axios";

function App() {
  const [inputData, setInputData] = useState({
    dependencia_emprestimos: "",
    rendimento_liquido_patrimonio_acionistas: "",
    divida_total_valor_liquido_total: "",
    roa_b_antes_juros_depreciacao_apos_imposto: "",
    receita_despesa_extra_industria: "",
    indice_despesas_juros: "",
    valor_liquido_ativos: "",
    indice_endividamento: "",
    caixa_ativos_totais: "",
    capital_giro_patrimonio_liquido: ""
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData({
      ...inputData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação simples
    if (Object.values(inputData).some(value => value === "")) {
      setError("Todos os campos precisam ser preenchidos.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:3000/predict", inputData);
      setPrediction(response.data);
    } catch (error) {
      setError("Erro ao fazer a requisição para o backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Previsão de Falência</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(inputData).map((key) => (
          <div key={key}>
            <label>{key.replace(/_/g, " ")}</label>
            <input
              type="number"
              name={key}
              value={inputData[key]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Enviar</button>
      </form>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {prediction && (
        <div>
          <h2>Resultado da Previsão</h2>
          <p>Previsão de Falência: {prediction.prediction ? "Sim" : "Não"}</p>
          <p>Probabilidade: {prediction.probability}</p>
        </div>
      )}
    </div>
  );
}

export default App;
