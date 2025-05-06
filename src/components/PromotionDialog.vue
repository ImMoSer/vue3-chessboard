// src/components/PromotionDialog.vue

// --- Начало секции <script setup lang="ts">
import { computed, type CSSProperties } from 'vue'; // <--- ДОБАВЛЕН ИМПОРТ CSSProperties
import type {
  PromotionDialogState,
  PromotionPiece,
} from '@/typings/Chessboard';

const props = defineProps<{
  state: PromotionDialogState;
}>();

const emit = defineEmits<{
  (e: 'promotionSelected'): void;
}>();

const promotionPieces: PromotionPiece[] = [
  { name: 'Queen', data: 'q' },
  { name: 'Rook', data: 'r' },
  { name: 'Bishop', data: 'b' },
  { name: 'Knight', data: 'n' },
];

function promotionSelected(piece: PromotionPiece): void {
  props.state.callback?.(piece.data);
  emit('promotionSelected');
}

// --- ИЗМЕНЕНО ВЫЧИСЛЯЕМОЕ СВОЙСТВО: добавлен тип CSSProperties ---
const dialogStyle = computed((): CSSProperties => { // <--- УКАЗАН ВОЗВРАЩАЕМЫЙ ТИП
  if (!props.state || !props.state.isEnabled || !props.state.destSquare || !props.state.orientation) {
    return { display: 'none' }; // Это валидный CSSProperties
  }

  const squareWidthPercent = 12.5;
  let fileIndex = props.state.destSquare.file.charCodeAt(0) - 'a'.charCodeAt(0);
  if (props.state.orientation === 'black') {
    fileIndex = 7 - fileIndex;
  }
  const calculatedLeftPercent = fileIndex * squareWidthPercent;

  // Этот объект теперь будет корректно типизирован для :style
  return {
    position: 'absolute', // TypeScript теперь знает, что 'absolute' - это допустимое значение
    top: '0%',
    left: `${calculatedLeftPercent}%`,
    width: `${squareWidthPercent}%`,
    height: '50%', // Как в ваших последних стилях

    // Статические стили лучше оставить в CSS-классе .promotion-dialog,
    // чтобы этот объект был чище и содержал только динамику.
    // Но если они здесь, они также будут применены.
    // Например, если вы их переносили из CSS:
    padding: '0.4rem',
    zIndex: 999,
    minHeight: '45px',
    display: 'flex', // Уже должен быть в CSS для .promotion-dialog
    backgroundColor: '#f0d9b5',
    border: '1px solid #333',
    borderRadius: '1rem',
    flexDirection: 'column', // Уже должен быть в CSS для .promotion-dialog
    boxSizing: 'border-box',
  };
});
// --- КОНЕЦ ВЫЧИСЛЯЕМОГО СВОЙСТВА ---

</script>

<template>
  <div
    v-if="state.isEnabled"
    class="promotion-dialog"
    :style="dialogStyle"
    role="dialog"
  >
    <button
      v-for="piece in promotionPieces"
      :key="piece.name"
      type="button"
      :class="['promotion-dialog-button', piece.name.toLowerCase(), state.color]" :aria-label="piece.name"
      @click="promotionSelected(piece)"
      @touchstart.passive="promotionSelected(piece)"
    /> </div>
</template>

<style scoped> /* Рекомендую использовать scoped для стилей этого компонента */

/* Стили для основного контейнера диалога */
/* Эти стили будут базовыми. Инлайн-стили из dialogStyle (top, left, width, height) их переопределят. */
.promotion-dialog {
  padding: 0.4rem;
  position: absolute; /* Важно для позиционирования */
  background-color: #f0d9b5;
  /* width: 12.5%; */ /* Управляется из dialogStyle */
  z-index: 999;
  /* top: 0%; */ /* Управляется из dialogStyle */
  /* left: будет устанавливаться динамически */ /* Управляется из dialogStyle */
  /* height: 50%; */ /* Управляется из dialogStyle */
  min-height: 45px; /* Можно оставить или убрать, если height из dialogStyle достаточен */
  display: flex;
  border: 1px solid #333;
  border-radius: 1rem;
  flex-direction: column; /* Вертикальное расположение кнопок */
  box-sizing: border-box;
  /* overflow: hidden; */ /* Убедитесь, что этого нет, если хотите, чтобы подсветка вылезала */
}

/* Стили для кнопок внутри диалога */
.promotion-dialog-button { /* Изменил имя класса, чтобы избежать конфликтов, если оригинал остался */
  pointer-events: all;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%; /* Кнопка на всю (вычисленную) ширину диалога */
  flex-grow: 1; /* Кнопки разделят высоту диалога */
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  transition: transform 0.1s ease-out, box-shadow 0.15s ease-out;
  outline: none;
  position: relative; /* Для псевдоэлемента подсветки */
  z-index: 1; /* Чтобы контент кнопки был над псевдоэлементом */
  font-size: 38px; /* Примерный размер для Unicode символов, настройте */
  color: #333; /* Базовый цвет для символов */
}

.promotion-dialog-button:not(:last-child) {
  border-bottom: 1px solid #c8b394; /* Разделитель между кнопками */
}

/* Псевдоэлемент для подсветки */
.promotion-dialog-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1; /* Под контентом кнопки */
  border-radius: 0.8rem; /* Скругление для самой подсветки */
  box-shadow: none;
  transition: box-shadow 0.15s ease-out, opacity 0.15s ease-out;
  opacity: 0; /* Скрыта по умолчанию */
}

.promotion-dialog-button:hover {
  transform: scale(1.2); /* Ваш вариант увеличения */
}

.promotion-dialog-button:hover::before {
  opacity: 1;
  box-shadow:
    0 0 10px 2px rgba(0, 114, 177, 0.7), /* #0072B1, основной цвет подсветки */
    0 0 20px 5px rgba(0, 114, 177, 0.4);  /* Более широкое свечение */
}
</style>