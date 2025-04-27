#!/bin/bash

# Opções para maior robustez:
# -e : Sai imediatamente se um comando falhar.
# -u : Trata variáveis não definidas como erro.
# -o pipefail : Faz com que um pipeline falhe se qualquer comando nele falhar.
set -euo pipefail

# --- Configuração ---
REPO_URL="git@github.com:gui200428/dotfiles.git"
BRANCH="main"
# Usar um diretório de cache mais persistente dentro de $HOME
# DEST_DIR="/tmp/dotfiles_sync_cache" # Opção original com /tmp
DEST_DIR="$HOME/.cache/dotfiles_sync" # Opção mais persistente
CONFIG_SOURCE_DIR="$HOME/.config"

# Diretórios dentro de $CONFIG_SOURCE_DIR a serem sincronizados
DIRS_TO_SYNC=("ags" "gtk-3.0" "gtk-4.0" "hypr" "Scripts")
# --------------------

# --- Verificação de Dependências ---
command -v git >/dev/null 2>&1 || { echo >&2 "Erro: 'git' não encontrado. Instale o git."; exit 1; }
command -v rsync >/dev/null 2>&1 || { echo >&2 "Erro: 'rsync' não encontrado. Instale o rsync."; exit 1; }
# -----------------------------------

# --- Preparação do Repositório Local ---
echo "Garantindo um clone limpo do repositório em '$DEST_DIR'..."
# Cria o diretório pai se não existir (para $HOME/.cache)
mkdir -p "$(dirname "$DEST_DIR")"
# Remove o diretório existente para garantir um estado limpo (mantendo a lógica original)
rm -rf "$DEST_DIR"

echo "Clonando o branch '$BRANCH' de '$REPO_URL' para '$DEST_DIR'..."
# Clona o repositório, tratando erros explicitamente por causa do `set -e`
if ! git clone --depth 1 -b "$BRANCH" "$REPO_URL" "$DEST_DIR"; then
  echo >&2 "Erro: Falha ao clonar o repositório '$REPO_URL' (branch: $BRANCH)."
  exit 1
fi
# -----------------------------------------

# --- Sincronização dos Arquivos ---
echo "Iniciando sincronização dos diretórios de configuração..."
cd "$DEST_DIR" || { echo >&2 "Erro: Falha ao acessar o diretório do repositório '$DEST_DIR'."; exit 1; }

for dir_name in "${DIRS_TO_SYNC[@]}"; do
  src_path="$CONFIG_SOURCE_DIR/$dir_name"
  dest_path="$DEST_DIR/$dir_name" # O destino é relativo à raiz do clone

  if [ -e "$src_path" ]; then # Verifica se existe (arquivo ou diretório)
    echo "Sincronizando '$src_path' para '$dest_path'..."
    # Cria o diretório de destino PAI se não existir (necessário se DIRS_TO_SYNC contivesse sub/paths)
    # Embora não estritamente necessário para diretórios de nível superior, é mais seguro
    mkdir -p "$(dirname "$dest_path")" 
    # Usa rsync para copiar. -a preserva atributos, --delete remove arquivos extras no destino.
    # A barra / no final de src_path é importante para copiar o *conteúdo* do diretório.
    # A barra / no final de dest_path garante que ele seja tratado como um diretório.
    rsync -a --delete --exclude='.git' "$src_path/" "$dest_path/"
  else
    echo "Aviso: Origem '$src_path' não encontrada. Pulando."
    # Opcional: Remover o diretório correspondente no destino se ele não existe mais na origem
    # if [ -d "$dest_path" ]; then
    #   echo "Removendo diretório obsoleto '$dest_path' do repositório..."
    #   rm -rf "$dest_path"
    # fi
  fi
done
# ------------------------------------

# --- Operações Git (Commit e Push) ---
echo "Verificando por mudanças no repositório local..."
git add --all

# Verifica se há algo preparado para commit
if git diff --staged --quiet; then
  echo "Nenhuma mudança detectada. Nada para fazer commit."
else
  echo "Mudanças detectadas. Preparando commit..."
  # Adiciona um timestamp à mensagem de commit
  COMMIT_MSG="Atualização automática de dotfiles ($(date '+%Y-%m-%d %H:%M:%S'))"
  git commit -m "$COMMIT_MSG"
  
  echo "Enviando alterações para o branch '$BRANCH' em '$REPO_URL'..."
  if git push origin "$BRANCH"; then
    echo "Alterações enviadas com sucesso para o repositório remoto!"
  else
    echo >&2 "Erro: Falha ao enviar alterações para o GitHub. Verifique a conexão e as permissões."
    # Você pode querer reverter o commit local aqui ou deixar como está para tentar novamente mais tarde
    # git reset --soft HEAD~1 # Exemplo de como desfazer o último commit mantendo as alterações
    exit 1 # Sinaliza que o push falhou
  fi
fi
# --------------------------------------

echo "Script concluído com sucesso."
exit 0