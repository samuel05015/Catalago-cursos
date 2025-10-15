#!/bin/bash
# Script para alterar todos os estilos do tema claro para escuro no formulário

# Este é um guia dos replacements que precisam ser feitos:

# Labels: text-gray-700 → text-gray-200
# Inputs: border border-gray-300 → border border-dark-600 bg-dark-700 text-white
# Focus: focus:ring-blue-500 focus:border-blue-500 → focus:ring-primary-500 focus:border-primary-500
# Placeholders: adicionar placeholder-gray-400
# Texto de ajuda: text-gray-500 → text-gray-400
# Asteriscos obrigatórios: text-red-500 → text-red-400
# Botões: bg-gray-200 → bg-dark-700, text-gray-700 → text-gray-200
# Tags selecionadas: bg-blue-500 → bg-primary-600
# Tags não selecionadas: bg-gray-200 → bg-dark-700, text-gray-700 → text-gray-200
# Checkboxes e outros elementos similares

echo "Guia de alterações para tema escuro:"
echo "1. Substituir text-gray-700 por text-gray-200 nos labels"
echo "2. Alterar inputs para tema escuro"
echo "3. Ajustar cores de foco"
echo "4. Atualizar cores dos botões e tags"