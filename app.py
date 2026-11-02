"""
Organizador de Tarefas com Agente de IA
----------------------------------------
Aplicação desenvolvida em Python com Streamlit.
Ideal para quem está começando a aprender desenvolvimento de software!

Como executar no seu computador:
1. Instale as bibliotecas:
   pip install streamlit google-genai
2. Execute o app:
   streamlit run app.py
"""

import streamlit as st
import datetime
import os
import json
from google import genai
from google.genai import types

# ---------------------------------------------------------
# 1. Configuração da Página no Streamlit
# ---------------------------------------------------------
st.set_page_config(
    page_title="Organizador de Tarefas com Agente de IA",
    page_icon="📋",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ---------------------------------------------------------
# 2. Inicialização do Estado (Session State)
# O Streamlit recarrega o script a cada clique.
# O 'st.session_state' garante que os dados não se percam!
# ---------------------------------------------------------
if "tarefas" not in st.session_state:
    st.session_state.tarefas = [
        {
            "id": 1,
            "titulo": "Aprender conceitos básicos de Python (Variáveis e Listas)",
            "categoria": "Estudo",
            "prioridade": "Alta",
            "prazo": "2026-11-05",
            "concluida": True
        },
        {
            "id": 2,
            "titulo": "Compreender como o Streamlit desenha a interface na tela",
            "categoria": "Estudo",
            "prioridade": "Alta",
            "prazo": "2026-11-06",
            "concluida": False
        },
        {
            "id": 3,
            "titulo": "Integrar Agente de IA com Gemini para quebrar tarefas difíceis",
            "categoria": "Projeto",
            "prioridade": "Média",
            "prazo": "2026-11-08",
            "concluida": False
        }
    ]

# ---------------------------------------------------------
# 3. Funções Utilitárias (Lógica de Negócio)
# ---------------------------------------------------------
def adicionar_tarefa(titulo: str, categoria: str, prioridade: str, prazo: str):
    """Adiciona uma nova tarefa ao estado."""
    novo_id = len(st.session_state.tarefas) + 1
    nova = {
        "id": novo_id,
        "titulo": titulo,
        "categoria": categoria,
        "prioridade": prioridade,
        "prazo": prazo,
        "concluida": False
    }
    st.session_state.tarefas.append(nova)

def remover_tarefa(tarefa_id: int):
    """Remove uma tarefa pelo seu identificador único."""
    st.session_state.tarefas = [
        t for t in st.session_state.tarefas if t["id"] != tarefa_id
    ]

def alternar_conclusao(tarefa_id: int):
    """Alterna o status concluída entre True e False."""
    for t in st.session_state.tarefas:
        if t["id"] == tarefa_id:
            t["concluida"] = not t["concluida"]
            break

# ---------------------------------------------------------
# 4. Barra Lateral (Sidebar): Métricas e Filtros
# ---------------------------------------------------------
with st.sidebar:
    # Exibe a imagem de logo caso exista no diretório
    logo_path = "public/assets/aistudio/image_5fc256fd.png"
    if os.path.exists(logo_path):
        st.image(logo_path, width=120)
    
    st.title("Organizador de Tarefas")
    st.caption("Com Agente de IA Integrado (Gemini 3.8 Flash)")
    st.divider()

    # Métricas calculadas em tempo real
    total = len(st.session_state.tarefas)
    concluidas = sum(1 for t in st.session_state.tarefas if t["concluida"])
    pendentes = total - concluidas
    taxa = (concluidas / total * 100) if total > 0 else 0

    col_m1, col_m2 = st.columns(2)
    col_m1.metric("Pendentes", pendentes, delta=f"-{concluidas}" if concluidas > 0 else None)
    col_m2.metric("Concluídas", concluidas, delta=f"{int(taxa)}%")

    st.progress(taxa / 100 if total > 0 else 0.0)

    st.subheader("🔍 Filtros de Visualização")
    filtro_status = st.radio("Status:", ["Todas", "Apenas Pendentes", "Apenas Concluídas"])
    filtro_prioridade = st.selectbox("Filtrar por Prioridade:", ["Todas", "Alta", "Média", "Baixa"])

# ---------------------------------------------------------
# 5. Interface Principal: Adicionar Tarefa
# ---------------------------------------------------------
st.title("📋 Organizador de tarefas")
st.markdown("Gerencie suas atividades com clareza e acelere seu dia com ajuda do **Agente de IA**.")

with st.expander("➕ Adicionar Nova Tarefa", expanded=False):
    with st.form("form_nova_tarefa", clear_on_submit=True):
        col_t1, col_t2 = st.columns([3, 1])
        with col_t1:
            titulo = st.text_input("Qual é a atividade?", placeholder="Ex: Estudar laços for e while em Python")
        with col_t2:
            categoria = st.selectbox("Categoria", ["Estudo", "Trabalho", "Pessoal", "Saúde", "Outros"])
        
        col_p1, col_p2 = st.columns(2)
        with col_p1:
            prioridade = st.select_slider("Prioridade", options=["Baixa", "Média", "Alta"], value="Média")
        with col_p2:
            prazo = st.date_input("Data Limite (opcional)", value=datetime.date.today())

        enviado = st.form_submit_button("Salvar Atividade", use_container_width=True)
        if enviado:
            if titulo.strip():
                adicionar_tarefa(titulo.strip(), categoria, prioridade, str(prazo))
                st.success(f"Tarefa '{titulo}' adicionada com sucesso!")
                st.rerun()
            else:
                st.warning("Por favor, digite um título para a atividade.")

# ---------------------------------------------------------
# 6. Agente de IA Integrado (Gemini 3.8 Flash)
# ---------------------------------------------------------
with st.expander("🤖 Agente de IA: Quebrar Meta em Passos Menores", expanded=False):
    st.markdown("Digite uma meta ou projeto complexo. O Agente de IA dividirá em micro-tarefas práticas para você:")
    meta_usuario = st.text_input("Sua meta ou desafio:", placeholder="Ex: Aprender a programar meu primeiro sistema web")
    
    if st.button("Gerar Plano com Agente IA"):
        if meta_usuario:
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                st.info("Chave GEMINI_API_KEY necessária no ambiente para execução direta do script.")
            else:
                try:
                    client = genai.Client(
                        api_key=api_key,
                        http_options={'headers': {'User-Agent': 'aistudio-build'}}
                    )
                    prompt = f"Divida esta meta em 3 a 5 passos diretos e práticos para um iniciante em tecnologia: '{meta_usuario}'"
                    response = client.models.generateContent(
                        model="gemini-3.8-flash",
                        contents=prompt
                    )
                    st.markdown("### 💡 Sugestão do Agente de IA:")
                    st.write(response.text)
                except Exception as e:
                    st.error(f"Erro ao consultar Agente: {e}")

# ---------------------------------------------------------
# 7. Listagem de Tarefas
# ---------------------------------------------------------
st.subheader("Suas Tarefas")

# Aplica filtros
tarefas_filtradas = st.session_state.tarefas
if filtro_status == "Apenas Pendentes":
    tarefas_filtradas = [t for t in tarefas_filtradas if not t["concluida"]]
elif filtro_status == "Apenas Concluídas":
    tarefas_filtradas = [t for t in tarefas_filtradas if t["concluida"]]

if filtro_prioridade != "Todas":
    tarefas_filtradas = [t for t in tarefas_filtradas if t["prioridade"] == filtro_prioridade]

if not tarefas_filtradas:
    st.info("Nenhuma tarefa encontrada para os filtros selecionados.")
else:
    for t in tarefas_filtradas:
        cols = st.columns([0.1, 0.6, 0.15, 0.15])
        
        # Checkbox de conclusão
        with cols[0]:
            marcado = st.checkbox(
                label=f"check_{t['id']}",
                value=t["concluida"],
                label_visibility="collapsed",
                key=f"cb_{t['id']}"
            )
            if marcado != t["concluida"]:
                alternar_conclusao(t["id"])
                st.rerun()

        # Título e detalhes
        with cols[1]:
            if t["concluida"]:
                st.markdown(f"~~{t['titulo']}~~  `{t['categoria']}`")
            else:
                st.markdown(f"**{t['titulo']}**  `{t['categoria']}`")
        
        # Prioridade
        with cols[2]:
            cor_tag = "🔴" if t["prioridade"] == "Alta" else "🟡" if t["prioridade"] == "Média" else "🟢"
            st.caption(f"{cor_tag} {t['prioridade']}")

        # Botão de remover
        with cols[3]:
            if st.button("🗑️ Excluir", key=f"del_{t['id']}"):
                remover_tarefa(t["id"])
                st.rerun()
