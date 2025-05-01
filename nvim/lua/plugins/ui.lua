return {
  {
    'lukas-reineke/indent-blankline.nvim',
    -- Opcional: Defina o módulo principal para que 'opts' funcione diretamente
    main = 'ibl',
    -- Configurações básicas (muitas vezes funciona bem sem nenhuma opção)
    opts = {
      -- Para uma aparência mais parecida com o VSCode, você pode querer desabilitar
      -- a linha no espaço em branco inicial (às vezes chamado de 'scope')
      -- ou configurá-la de forma diferente. A configuração padrão é geralmente boa.

      -- Exemplo de configuração (opcional, descomente e ajuste se necessário):
      -- indent = {
      --   -- Caractere para a linha de indentação. '▏' ou '│' são comuns com Nerd Fonts.
      --   -- Se você NÃO usa Nerd Font, tente '|' ou '¦'.
      --   char = "│",
      --   -- Pode usar um caractere diferente para o final da linha (tab)
      --   -- tab_char = "│",
      -- },
      scope = {
        -- Mostra a linha que indica o escopo atual (onde o cursor está)
        enabled = true,
        -- Caractere para a linha de escopo (se 'enabled = true')
        -- char = "│",
        -- Pode mostrar o início e o fim do escopo
        -- show_start = true,
        -- show_end = true,
      },
      -- Excluir guias para certos tipos de arquivo onde podem atrapalhar
      exclude = {
        filetypes = {
          'help',
          'alpha',
          'dashboard',
          'neo-tree',
          'Trouble',
          'trouble',
          'lazy',
          'mason',
          'notify',
          'toggleterm',
          'lazyterm',
          -- Adicione outros filetypes se necessário
          -- "markdown",
          -- "NvimTree", -- Já deve ser tratado pelo padrão, mas pode adicionar
        },
        buftypes = { 'terminal' }, -- Excluir buffers de terminal
      },
    },
  },
  -- using lazy.nvim
  -- [[ FIM DO BLOCO DO INDENT-BLANKLINE ]]
  {
    'akinsho/bufferline.nvim',
    version = '*', -- Pega a versão estável mais recente
    dependencies = {
      -- Necessário para os ícones dos tipos de arquivo na barra
      { 'nvim-tree/nvim-web-devicons', enabled = vim.g.have_nerd_font },
    },
    opts = {
      options = {
        -- Estilo: "buffers" mostra os arquivos abertos (estilo VSCode)
        --         "tabs" mostra as tabs do Vim (layouts de janela)
        mode = 'buffers',

        -- Como separar as "abas". "slant" fica bonito com Nerd Font.
        -- Outras opções: "arrow", "padded_slant", {"", ""} (sem separador), etc.
        separator_style = vim.g.have_nerd_font and 'slant' or 'bar',

        -- Mostrar indicadores de diagnóstico (erros/avisos do LSP)
        diagnostics = 'nvim_lsp', -- Requer que 'nvim-lspconfig' esteja configurado
        -- Como mostrar os indicadores de diagnóstico
        diagnostics_indicator = function(count, level, diagnostics_dict, context)
          -- Verifica se temos Nerd Font para usar ícones
          local s = ' '
          if context.buffer:current() then
            s = ''
          end -- Sem espaço antes no buffer atual
          if level == vim.diagnostic.severity.ERROR then
            return s .. (vim.g.have_nerd_font and ' ' or 'E:') .. count -- Ícone de Erro ou "E:"
          elseif level == vim.diagnostic.severity.WARN then
            return s .. (vim.g.have_nerd_font and ' ' or 'W:') .. count -- Ícone de Aviso ou "W:"
            -- Pode adicionar INFO e HINT se quiser
            -- elseif level == vim.diagnostic.severity.INFO then
            --   return s .. (vim.g.have_nerd_font and " " or "I:") .. count
            -- elseif level == vim.diagnostic.severity.HINT then
            --   return s .. (vim.g.have_nerd_font and " " or "H:") .. count
          end
          return '' -- Não mostra nada para outros níveis
        end,

        -- Adiciona um espaço à esquerda para não colar no NvimTree
        -- Muito importante para a integração visual!
        offsets = {
          {
            filetype = 'NvimTree', -- Nome do tipo de arquivo da janela do NvimTree
            text = 'Explorador', -- Texto opcional exibido nesse espaço
            text_align = 'left', -- Alinhamento do texto
            separator = true, -- Mostra um separador após o espaço
          },
          -- Pode adicionar outros offsets para outras janelas laterais se usar
        },

        -- Mostrar ícone 'x' para fechar o buffer (se tiver Nerd Font)
        show_buffer_close_icons = vim.g.have_nerd_font,
        show_close_icon = vim.g.have_nerd_font,

        -- Mostrar a barra mesmo que só tenha um buffer aberto
        always_show_bufferline = true,

        -- Habilitar cliques do mouse na bufferline (geralmente habilitado por padrão)
        -- clickable = true,

        -- Ordenar buffers por: 'directory', 'relative_directory', 'filename', 'extension', 'tabs'
        -- sort_by = 'directory',

        -- Mais opções em :help bufferline-options
      },
    },
  },
  -- [[ FIM DO BLOCO DO BUFFERLINE ]]

  { -- Plugin: Explorador de Arquivos (NvimTree)
    'nvim-tree/nvim-tree.lua',
    version = '*', -- Usa a versão estável mais recente
    lazy = false, -- Carrega o plugin na inicialização (opcional, pode remover para carregar sob demanda)
    dependencies = {
      -- Dependência para ícones (já incluída no seu kickstart para o telescope,
      -- mas é boa prática listar aqui também).
      { 'nvim-tree/nvim-web-devicons', enabled = vim.g.have_nerd_font }, -- Só ativa se tiver Nerd Font
    },
    -- Configuração específica do nvim-tree
    opts = {
      -- Opções padrão são boas, mas você pode customizar aqui.
      -- Veja :help nvim-tree-setup para todas as opções

      -- Fazer o nvim-tree abrir diretórios em vez do netrw (padrão do Vim)
      hijack_netrw = true,

      -- Filtros para ocultar/mostrar arquivos
      filters = {
        dotfiles = false, -- Mostrar arquivos ocultos (começando com '.')
        git_ignored = true, -- Ocultar arquivos listados no .gitignore
        custom = {}, -- Pode adicionar filtros customizados aqui
      },

      -- Configurações da aparência da árvore
      view = {
        -- Largura da janela do nvim-tree (padrão é 30)
        width = 35,
        -- Se quiser customizar ícones específicos (requer nvim-web-devicons e Nerd Font)
        -- icons = { ... }
      },

      -- Configurações de como os itens são renderizados
      renderer = {
        -- Mostrar ícones baseado na configuração 'have_nerd_font'
        icons = {
          show = {
            file = vim.g.have_nerd_font, -- Ícone para arquivos
            folder = vim.g.have_nerd_font, -- Ícone para pastas
            folder_arrow = vim.g.have_nerd_font, -- Setinha para pastas abertas/fechadas
            git = vim.g.have_nerd_font, -- Ícone para status do git
          },
          glyphs = {
            -- Ícones padrão são bons se você tem Nerd Font.
            -- Você pode customizar aqui se quiser:
            -- default = "",
            -- symlink = "",
            -- folder = {
            --   arrow_closed = "",
            --   arrow_open = "",
            --   default = "",
            --   open = "",
            --   empty = "",
            --   empty_open = "",
            --   symlink = "",
            --   symlink_open = "",
            -- },
            -- git = {
            --   unstaged = "",
            --   staged = "S",
            --   unmerged = "",
            --   renamed = "➜",
            --   untracked = "U",
            --   deleted = "",
            --   ignored = "◌",
            -- },
          },
        },
        -- Adicionar marcadores de indentação para melhor visualização da hierarquia
        indent_markers = {
          enable = true,
        },
      },

      -- Integração com Git para mostrar status dos arquivos na árvore
      git = {
        enable = true,
        ignore = false, -- Mostrar arquivos ignorados pelo git (com um ícone diferente)
      },

      -- Outras opções úteis (descomente se precisar):
      -- update_focused_file = { -- Atualiza a árvore quando foca em um arquivo
      --  enable = true,
      --  update_root = true -- Atualiza a raiz da árvore também
      -- },
      -- open_on_setup = false, -- Não abrir automaticamente ao iniciar o nvim
      -- ignore_ft_on_setup = { 'dashboard', 'NvimTree' }, -- Não abrir se o buffer for desses tipos
    },

    -- Atalhos de teclado (Keymaps) - Usando a funcionalidade do lazy.nvim
    -- Isso também ajuda o lazy.nvim a saber quando carregar o plugin se ele for lazy-loaded.
    keys = {
      -- Atalho principal para abrir/fechar o NvimTree
      -- <leader> é a sua tecla líder (definida como Espaço no seu config)
      { '<leader>e', '<cmd>NvimTreeToggle<CR>', desc = 'Alternar Explorer (NvimTree)' }, -- Espaço + e

      -- Atalho para encontrar o arquivo atual no NvimTree (se ele estiver aberto)
      { '<leader>E', '<cmd>NvimTreeFindFile<CR>', desc = 'Encontrar Arquivo no Explorer (NvimTree)' }, -- Espaço + E (Shift+e)

      -- Você pode adicionar mais atalhos se quiser, por exemplo:
      -- { "<leader>ef", "<cmd>NvimTreeFocus<CR>", desc = "Focar Explorer (NvimTree)" }, -- Espaço + e + f
    },
  }, -- Fim do bloco do nvim-tree

  { -- You can easily change to a different colorscheme.
    -- Change the name of the colorscheme plugin below, and then
    -- change the command in the config to whatever the name of that colorscheme is.
    --
    -- If you want to see what colorschemes are already installed, you can use `:Telescope colorscheme`.
    'folke/tokyonight.nvim',
    priority = 1000, -- Make sure to load this before all the other start plugins.
    config = function()
      ---@diagnostic disable-next-line: missing-fields
      require('tokyonight').setup {
        styles = {
          comments = { italic = false }, -- Disable italics in comments
        },
      }

      -- Load the colorscheme here.
      -- Like many other themes, this one has different styles, and you could load
      -- any other, such as 'tokyonight-storm', 'tokyonight-moon', or 'tokyonight-day'.
      vim.cmd.colorscheme 'tokyonight-night'
    end,
  },
  -- Highlight todo, notes, etc in comments
  { 'folke/todo-comments.nvim', event = 'VimEnter', dependencies = { 'nvim-lua/plenary.nvim' }, opts = { signs = false } },

  {
    'akinsho/toggleterm.nvim',
    version = '*',
    config = function()
      require('toggleterm').setup {
        -- configurações iniciais
        size = 15,
        open_mapping = [[<C-t>]],
        hide_numbers = true,
        shade_filetypes = {},
        shade_terminals = true,
        shading_factor = 2,
        start_in_insert = true,
        insert_mappings = true,
        terminal_mappings = true,
        persist_size = true,
        direction = 'horizontal', -- pode ser 'vertical' ou 'float' também
        close_on_exit = true,
        shell = vim.o.shell,
      }
    end,
  },
  { 'brenoprata10/nvim-highlight-colors' },
}
