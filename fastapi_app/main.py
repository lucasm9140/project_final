from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

# Inicializando a aplicação FastAPI
app = FastAPI()

# Carregar o modelo treinado
model = joblib.load("model/model.pkl")

# Definir o esquema de entrada
class InputData(BaseModel):
    dependencia_emprestimos: float
    rendimento_liquido_patrimonio_acionistas: float
    divida_total_valor_liquido_total: float
    roa_b_antes_juros_depreciacao_apos_imposto: float
    receita_despesa_extra_industria: float
    indice_despesas_juros: float
    valor_liquido_ativos: float
    indice_endividamento: float
    caixa_ativos_totais: float
    capital_giro_patrimonio_liquido: float

# Função para predizer a falência com ajuste de limiar
@app.post("/predict/")
async def predict(data: InputData, threshold: float = 0.5):
    input_df = pd.DataFrame([data.dict()])
    
    # Realiza a previsão
    prediction_proba = model.predict_proba(input_df)[:, 1]  # Probabilidade da classe 1 (falência)
    prediction = (prediction_proba > threshold).astype(int)  # Ajuste do limiar de decisão
    
    return {"prediction": int(prediction[0]), "probability": float(prediction_proba[0])}

# Rodar o servidor com 'uvicorn main:app --reload' no terminal