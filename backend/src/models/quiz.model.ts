import {
  DataTypes,
  Model,
  type CreationOptional,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from 'sequelize';
import { sequelize } from '../db/sequelize';

export const QUESTION_TYPES = ['boolean', 'input', 'checkbox'] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export class Quiz extends Model<InferAttributes<Quiz>, InferCreationAttributes<Quiz>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare questions?: NonAttribute<Question[]>;
}

export class Question extends Model<InferAttributes<Question>, InferCreationAttributes<Question>> {
  declare id: CreationOptional<number>;
  declare quizId: ForeignKey<Quiz['id']>;
  declare type: QuestionType;
  declare text: string;
  declare position: number;
  /** Correct answer for `boolean` questions. */
  declare correctBoolean: CreationOptional<boolean | null>;
  /** Expected answer for `input` questions. */
  declare correctText: CreationOptional<string | null>;

  declare options?: NonAttribute<Option[]>;
}

export class Option extends Model<InferAttributes<Option>, InferCreationAttributes<Option>> {
  declare id: CreationOptional<number>;
  declare questionId: ForeignKey<Question['id']>;
  declare text: string;
  declare isCorrect: boolean;
  declare position: number;
}

Quiz.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'quizzes' },
);

Question.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: { isIn: [[...QUESTION_TYPES]] },
    },
    text: { type: DataTypes.STRING(500), allowNull: false },
    position: { type: DataTypes.INTEGER, allowNull: false },
    correctBoolean: { type: DataTypes.BOOLEAN, allowNull: true },
    correctText: { type: DataTypes.STRING(200), allowNull: true },
  },
  { sequelize, tableName: 'questions', timestamps: false },
);

Option.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    text: { type: DataTypes.STRING(200), allowNull: false },
    isCorrect: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    position: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: 'options', timestamps: false },
);

Quiz.hasMany(Question, {
  as: 'questions',
  foreignKey: { name: 'quizId', allowNull: false },
  onDelete: 'CASCADE',
});
Question.belongsTo(Quiz, { as: 'quiz', foreignKey: { name: 'quizId', allowNull: false } });

Question.hasMany(Option, {
  as: 'options',
  foreignKey: { name: 'questionId', allowNull: false },
  onDelete: 'CASCADE',
});
Option.belongsTo(Question, {
  as: 'question',
  foreignKey: { name: 'questionId', allowNull: false },
});
