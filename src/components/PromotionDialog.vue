// src/components/PromotionDialog.vue
<script setup lang="ts">
import { computed } from 'vue';
import type {
  PromotionDialogState, // Должен включать destSquare и orientation
  PromotionPiece,       // Ваш существующий тип
  // Убедитесь, что тип Promotion также доступен (обычно 'q' | 'n' | 'r' | 'b')
} from '@/typings/Chessboard'; // Проверьте правильность пути к вашим типам

const props = defineProps<{
  state: PromotionDialogState;
}>();

const emit = defineEmits<{
  (e: 'promotionSelected'): void;
}>();

// Можно изменить порядок для вертикального списка, если хотите Ферзя первым
const promotionPieces: PromotionPiece[] = [
  { name: 'Queen', data: 'q' },
  { name: 'Rook', data: 'r' },
  { name: 'Bishop', data: 'b' },
  { name: 'Knight', data: 'n' },
];

function promotionSelected(piece: PromotionPiece): void {
  props.state.callback?.(piece.data);
  emit('promotionSelected'); // Это событие используется для закрытия диалога
}

const dialogStyle = computed(() => {
  if (!props.state || !props.state.isEnabled || !props.state.destSquare || !props.state.orientation) {
    // Если каких-то критичных данных нет, диалог не будет показан (благодаря v-if)
    // или можно вернуть базовые стили, чтобы он не ломал верстку, если v-if убрать
    return { display: 'none' };
  }

  const squareWidthPercent = 12.5; // 100% / 8 клеток

  // Преобразуем букву вертикали (file) из 'a'...'h' в индекс 0...7
  let fileIndex = props.state.destSquare.file.charCodeAt(0) - 'a'.charCodeAt(0);

  // Корректируем индекс, если доска перевернута
  if (props.state.orientation === 'black') {
    fileIndex = 7 - fileIndex;
  }

  const calculatedLeftPercent = fileIndex * squareWidthPercent;

  // Возвращаем объект стилей
  // Стили из CSS класса .promotion-dialog будут применены как базовые,
  // а эти инлайн-стили их дополнят или переопределят.
  return {
    // Динамически вычисляемые стили для позиционирования и размера:
    position: 'absolute', // Это уже есть в вашем CSS для .promotion-dialog
    top: '0%',
    left: `${calculatedLeftPercent}%`,
    width: `${squareWidthPercent}%`,
    height: '50%', // Как в ваших последних стилях
    // Стили, которые можно оставить в CSS или перенести сюда для полного контроля:
    // padding: '0.4rem',
    // zIndex: 999,
    // minHeight: '45px',
    // display: 'flex', // Уже есть в CSS для .promotion-dialog
    // backgroundColor: '#f0d9b5', // Уже есть в CSS для .promotion-dialog
    // border: '1px solid #333', // Уже есть в CSS для .promotion-dialog
    // borderRadius: '1rem', // Уже есть в CSS для .promotion-dialog
    // flexDirection: 'column', // Уже есть в CSS для .promotion-dialog
    // boxSizing: 'border-box', // Уже есть в CSS для .promotion-dialog
  };
});
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