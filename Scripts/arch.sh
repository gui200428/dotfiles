#!/usr/bin/env bash

# Trap para interromper o script com Ctrl+C
trap "echo -e '\n\033[1;33mScript interrompido pelo usuário. Saindo...\033[0m'; exit 1" SIGINT

# Função para atualizar pacotes oficiais
update_system() {
    echo -e "\n\033[1;34mAtualizando pacotes oficiais...\033[0m"
    sudo pacman -Syu
}

# Função para atualizar pacotes AUR
update_aur() {
    echo -e "\n\033[1;34mAtualizando pacotes AUR...\033[0m"
    yay -Syu
}

# Função para limpar o sistema
clean_system() {
    echo -e "\n\033[1;34mLimpando cache do pacman...\033[0m"
    sudo pacman -Sc --noconfirm

    echo -e "\n\033[1;34mRemovendo pacotes órfãos...\033[0m"
    orphans=$(pacman -Qtdq)
    if [ -n "$orphans" ]; then
        sudo pacman -Rns --noconfirm $orphans
    else
        echo "Nenhum pacote órfão encontrado"
    fi

    echo -e "\n\033[1;34mLimpando cache do usuário...\033[0m"
    rm -rf ~/.cache/*

    echo -e "\n\033[1;34mLimpando logs antigos...\033[0m"
    sudo journalctl --vacuum-time=2weeks

    echo -e "\n\033[1;32mLimpeza do sistema concluída!\033[0m"
}

# Função para limpar cache do yay
clean_aur_cache() {
    echo -e "\n\033[1;34mLimpando cache do yay...\033[0m"
    yay -Sc --noconfirm
    
    echo -e "\n\033[1;34mRemovendo arquivos de construção...\033[0m"
    rm -rf ~/.cache/yay/*
    
    echo -e "\n\033[1;32mLimpeza do yay concluída!\033[0m"
}

# Função para pesquisar pacotes instalados
search_packages() {
    echo -e "\n\033[1;34mDigite o nome do pacote para pesquisar:\033[0m"
    read -p "Nome do pacote: " pkg_name
    echo -e "\n\033[1;36mResultados da pesquisa:\033[0m"
    pacman -Qs "$pkg_name"
}

# Função para remover pacotes
remove_package() {
    echo -e "\n\033[1;34mDigite o nome do pacote para remover:\033[0m"
    read -p "Nome do pacote: " pkg_name
    if pacman -Q "$pkg_name" &>/dev/null; then
        echo -e "\n\033[1;31mRemovendo $pkg_name e dependências não utilizadas...\033[0m"
        sudo pacman -Rns "$pkg_name"
    else
        echo -e "\n\033[1;31mO pacote $pkg_name não está instalado!\033[0m"
    fi
}

backup_packages() {

    if [ ! -d ~/.config/system-pkgs-bkp ]; then
        echo -e "\033[1;33mDiretório de backup não existe. Criando...\033[0m"
        mkdir -p ~/.config/system-pkgs-bkp
    fi

    echo -e "\n\033[1;34mCriando backup dos pacotes instalados...\033[0m"
    pacman -Qn > ~/.config/system-pkgs-bkp/pacman_pkgs.txt
    pacman -Qm > ~/.config/system-pkgs-bkp/aur_pkgs.txt
    echo -e "\033[1;32mBackup salvo em ~/.config/system-pkgs-bkp\033[0m"
}

# Cores para melhor visualização
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para listar pacotes instalados
list_packages() {
    echo -e "\n${BLUE}Pacotes instalados via pacman (repositórios oficiais):${NC}"
    pacman -Qn | awk '{print "'${GREEN}'" $0 "'${NC}'"}'
    
    echo -e "\n${BLUE}Pacotes instalados via yay (AUR):${NC}"
    pacman -Qm | awk '{print "'${YELLOW}'" $0 "'${NC}'"}' 
    
    echo -e "\n${GREEN}Total pacman: $(pacman -Qn | wc -l)${NC}"
    echo -e "${YELLOW}Total yay: $(pacman -Qm | wc -l)${NC}"
    echo -e "${BLUE}Total geral: $(pacman -Q | wc -l)${NC}"
}

# Menu interativo
while true; do
    clear
    echo -e "\033[1;36m"
    echo "===================================="
    echo "  Manutenção do Arch Linux          "
    echo "===================================="
    echo -e "\033[0m"
    echo "1) Atualizar pacotes oficiais (pacman)"
    echo "2) Atualizar pacotes AUR (yay)"
    echo "3) Limpar sistema"
    echo "4) Limpar cache do yay"
    echo "5) Pesquisar pacotes instalados"
    echo "6) Remover pacote e dependências"
    echo "7) Listar todos os pacotes instalados"
    echo "8) Backup dos pacotes instalados"
    echo "9) Sair"
    echo
    read -p "Digite sua escolha: " choice

    case $choice in
        1)
            update_system
            ;;
        2)
            if ! command -v yay &> /dev/null; then
                echo -e "\n\033[1;31mErro: yay não está instalado!\033[0m"
                echo "Instale com: git clone https://aur.archlinux.org/yay.git && cd yay && makepkg -si"
                read -p "Pressione Enter para continuar..."
                continue
            fi
            update_aur
            ;;
        3)
            clean_system
            ;;
        4)
            if ! command -v yay &> /dev/null; then
                echo -e "\n\033[1;31mErro: yay não está instalado!\033[0m"
                echo "Instale com: git clone https://aur.archlinux.org/yay.git && cd yay && makepkg -si"
                read -p "Pressione Enter para continuar..."
                continue
            fi
            clean_aur_cache
            ;;
        5)
            search_packages
            ;;
        6)
            remove_package
            ;;
        7)
            list_packages | less -R
            ;;
        8)
            backup_packages
            ;;
        9)
            echo -e "\n\033[1;33mSaindo...\033[0m"
            exit 0
            ;;
        *)
            echo -e "\n\033[1;31mOpção inválida!\033[0m"
            ;;
    esac

    echo
    read -p "Pressione Enter para continuar..."
done
