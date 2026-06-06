import tkinter as tk
from tkinter import messagebox
import configparser as cgp
import os

# --- CORREÇÃO DE CAMINHO DINÂMICO ---
# Pega a pasta onde o 'main.py' está ( /set_cfg )
PASTA_ATUAL = os.path.dirname(os.path.abspath(__file__))
# Sobe uma pasta e aponta para o geral.config ( /back-end-com-ia/geral.config )
CAMINHO_CONFIG = os.path.abspath(os.path.join(PASTA_ATUAL, "../geral.config"))

def carregar_configuracoes():
    """Lê o arquivo .config e preenche a interface com os valores atuais."""
    config = cgp.ConfigParser()
    
    if os.path.exists(CAMINHO_CONFIG):
        config.read(CAMINHO_CONFIG, encoding="utf-8")
        
        # Carrega os dados da seção [main]
        var_nome.set(config.get("main", "name", fallback="meu-app-ia"))
        var_author.set(config.get("main", "author", fallback="autor"))
        
        # Carrega os dados da seção [middlewares]
        var_morgan.set(config.getboolean("middlewares", "morgan", fallback=False))
        var_express.set(config.getboolean("middlewares", "express", fallback=False))
        var_dotenv.set(config.getboolean("middlewares", "dotenv", fallback=False))
        var_cors.set(config.getboolean("middlewares", "cors", fallback=False))
        var_path.set(config.getboolean("middlewares", "path", fallback=False))
        var_proxy.set(config.getboolean("middlewares", "trust_proxy_config", fallback=False))
    else:
        # Valores padrão caso o arquivo não exista ainda
        var_nome.set("meu-app-ia")
        var_author.set("autor")

def salvar_configuracoes():
    """Pega os dados da GUI e escreve/atualiza o arquivo geral.config."""
    config = cgp.ConfigParser()
    
    if os.path.exists(CAMINHO_CONFIG):
        config.read(CAMINHO_CONFIG, encoding="utf-8")
        
    if not config.has_section("main"):
        config.add_section("main")
    if not config.has_section("middlewares"):
        config.add_section("middlewares")
        
    config.set("main", "name", var_nome.get())
    config.set("main", "author", var_author.get())
    
    config.set("middlewares", "morgan", str(var_morgan.get()))
    config.set("middlewares", "express", str(var_express.get()))
    config.set("middlewares", "dotenv", str(var_dotenv.get()))
    config.set("middlewares", "cors", str(var_cors.get()))
    config.set("middlewares", "path", str(var_path.get()))
    config.set("middlewares", "trust_proxy_config", str(var_proxy.get()))
    
    try:
        with open(CAMINHO_CONFIG, "w", encoding="utf-8") as arquivo:
            config.write(arquivo)
        messagebox.showinfo("Sucesso", f"Configurações salvas em:\n{CAMINHO_CONFIG}")
    except Exception as e:
        messagebox.showerror("Erro", f"Não foi possível salvar o arquivo:\n{e}")

# --- Configuração da Janela Principal ---
root = tk.Tk()
root.title("Configurador do Servidor IA")
root.geometry("450x520")
root.configure(padx=20, pady=20)

# --- Variáveis de Controle (Tkinter) ---
var_nome = tk.StringVar()
var_author = tk.StringVar()

var_morgan = tk.BooleanVar()
var_express = tk.BooleanVar()
var_dotenv = tk.BooleanVar()
var_cors = tk.BooleanVar()
var_path = tk.BooleanVar()
var_proxy = tk.BooleanVar()

# --- Elementos Visuais (Widgets) ---

# Seção MAIN
lbl_main = tk.Label(root, text="Configurações Principais [main]", font=("Arial", 12, "bold"))
lbl_main.pack(anchor="w", pady=(0, 10))

lbl_nome = tk.Label(root, text="Nome do App:")
lbl_nome.pack(anchor="w")
ent_nome = tk.Entry(root, textvariable=var_nome, width=40)
ent_nome.pack(anchor="w", pady=(0, 10))

lbl_author = tk.Label(root, text="Autor do App:")
lbl_author.pack(anchor="w")
ent_author = tk.Entry(root, textvariable=var_author, width=40)
ent_author.pack(anchor="w", pady=(0, 20))

# Divisor visual
tk.Frame(root, height=2, bd=1, relief="sunken").pack(fill="x", pady=(0, 10))

# Seção MIDDLEWARES
lbl_mid = tk.Label(root, text="Middlewares Ativos [middlewares]", font=("Arial", 12, "bold"))
lbl_mid.pack(anchor="w", pady=(0, 10))

chk_morgan = tk.Checkbutton(root, text="Ativar Morgan (Log)", variable=var_morgan)
chk_morgan.pack(anchor="w", pady=2)

chk_express = tk.Checkbutton(root, text="Ativar Express", variable=var_express)
chk_express.pack(anchor="w", pady=2)

chk_dotenv = tk.Checkbutton(root, text="Ativar Dotenv", variable=var_dotenv)
chk_dotenv.pack(anchor="w", pady=2)

chk_cors = tk.Checkbutton(root, text="Ativar Cors", variable=var_cors)
chk_cors.pack(anchor="w", pady=2)

chk_path = tk.Checkbutton(root, text="Ativar Path", variable=var_path)
chk_path.pack(anchor="w", pady=2)

chk_proxy = tk.Checkbutton(root, text='Ativar Trust Proxy (app.use("trust proxy"))', variable=var_proxy)
chk_proxy.pack(anchor="w", pady=2)

# --- CORREÇÃO AQUI: Trocado padding por pady/padx ---
btn_salvar = tk.Button(
    root, 
    text="Salvar Configurações", 
    command=salvar_configuracoes, 
    bg="#4CAF50", 
    fg="white", 
    font=("Arial", 11, "bold"), 
    pady=5, 
    padx=10
)
btn_salvar.pack(fill="x", pady=(30, 0))

# Carrega os dados assim que o programa abre
carregar_configuracoes()

root.mainloop()