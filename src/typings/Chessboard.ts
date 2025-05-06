// src/typings/Chessboard.ts

import type BoardApiClass from '@/classes/BoardApi'; // Переименовал BoardApi в BoardApiClass во избежание конфликта имен, если BoardApi используется как тип в других местах
import type { Move as FullMoveChessJs, Square as SquareChessJs } from 'chess.js';
import type { Key as KeyChessground, File as FileChessground, Rank as RankChessground, Color as ColorChessground } from 'chessground/types';
import type { BoardConfig as BoardConfigType, MoveableColor } from './BoardConfig'; // Переименовал BoardConfig в BoardConfigType

// Основные типы, которые вы уже определили и которые используются
export type Promotion = 'q' | 'n' | 'b' | 'r';
export type PieceColor = 'white' | 'black'; // Ваш тип для цвета фигур

// Типы, которые могут понадобиться для PromotionDialogState и других интерфейсов
// Если они уже есть в chessground/types и импортированы, можно использовать те.
// Этот File и Rank будут использоваться для destSquare
export type File = FileChessground;
export type Rank = RankChessground;

// Тип для хода, используемый в Props или других местах
export type Move =
  | string
  | {
      from: KeyChessground;
      to: KeyChessground;
      promotion?: Promotion;
    };

export interface possibleMoves {
  [key: string]: {
    value: string[];
  };
}

export interface Threat {
  orig: SquareChessJs; // Используем Square из chess.js
  dest?: SquareChessJs;
  brush: string;
}

export type PromotionPiece = {
  name: 'Queen' | 'Rook' | 'Knight' | 'Bishop';
  data: Promotion;
};

export type SquareColor = 'light' | 'dark' | null;

export type Piece = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';

export interface ThreatCount {
  checks_white: number;
  checks_black: number;
  fen: string;
  history: string[];
  legal_white: number;
  legal_black: number;
  threat_white: number;
  threat_black: number;
  turn: 'white' | 'black'; // Можно использовать PieceColor
}

export type SquareKey = SquareChessJs & KeyChessground; // Объединение типов, если нужно

// Интерфейс для событий, генерируемых компонентом
export interface Emits {
  (e: 'boardCreated', boardApi: BoardApiClass): void; // Используем переименованный BoardApiClass
  (e: 'check' | 'checkmate', color: PieceColor): void;
  (e: 'stalemate'): void;
  (e: 'draw'): void;
  (e: 'promotion', promotion: PromotionEvent): void;
  (e: 'move', move: MoveEvent): void;
}

// Интерфейс для пропсов компонента
export interface Props {
  boardConfig?: BoardConfigType; // Используем переименованный BoardConfigType
  playerColor?: MoveableColor;
  reactiveConfig?: boolean;
}

// --- ОБНОВЛЕННЫЙ ИНТЕРФЕЙС ДЛЯ СОСТОЯНИЯ ДИАЛОГА ПРЕВРАЩЕНИЯ ---
export interface PromotionDialogState {
  isEnabled: boolean;
  color?: PieceColor; // Используем ваш тип PieceColor
  callback?: (promotionValue: Promotion) => void; // Используем ваш тип Promotion
  // --- ДОБАВЛЕННЫЕ ПОЛЯ ДЛЯ ПОЗИЦИОНИРОВАНИЯ ---
  destSquare?: { file: File; rank: Rank }; // Используем импортированные File и Rank
  orientation?: PieceColor; // Используем ваш тип PieceColor для ориентации
  // boardRect?: DOMRect; // Опционально, для будущих пиксельных расчетов, если понадобятся
}
// --- КОНЕЦ ОБНОВЛЕННОГО ИНТЕРФЕЙСА ---

// Интерфейс для общего состояния доски
export interface BoardState {
  showThreats: boolean;
  promotionDialogState: PromotionDialogState; // Ссылается на обновленное определение
  historyViewerState: HistoryViewerState;
}

// Интерфейс для события превращения
export interface PromotionEvent {
  color: PieceColor;
  sanMove: string;
  promotedTo: 'Q' | 'B' | 'R' | 'N'; // Это можно было бы связать с типом Promotion, сделав его более строгим
}

export type PromotedTo = PromotionEvent['promotedTo'];

// Тип для события хода
export type MoveEvent = FullMoveChessJs; // Используем FullMove из chess.js

// Тип для состояния просмотрщика истории
export type HistoryViewerState =
  | {
      isEnabled: false;
    }
  | {
      isEnabled: true;
      plyViewing: number;
      viewOnly: boolean;
    };

// Дополнительные типы, которые могут быть полезны или уже используются где-то:
// (Эти типы были в вашем оригинальном файле, я их оставил, если они нужны для других частей библиотеки)
// Если какие-то из них конфликтуют с импортами или не нужны, их можно будет удалить или скорректировать.
// Например, BoardConfig импортируется, а не определяется здесь.
// MoveableColor также импортируется.