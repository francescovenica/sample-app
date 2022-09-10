import React from "react";
import styles from "./styles.module.scss";

type T = TodosQuery["allTodos"]["nodes"][0];

type Props = {
  todo: T;
  onEdit: (todo: T) => void;
  onDone: (todo: T, isCompleted: boolean) => void;
};

const dateFormatter = Intl.DateTimeFormat("en-EN", {
  dateStyle: "long",
  timeStyle: "short",
});

const Todo = ({ todo, onEdit, onDone }: Props) => (
  <div className={styles.todo}>
    <div className={styles.body}>
      <h3 className={styles.title}>{todo.title}</h3>
      <span>{dateFormatter.format(new Date(todo.createdAt))}</span>
      <p className={styles.body}>{todo.content}</p>
    </div>
    <div className={styles.footer}>
      <button onClick={() => onEdit(todo)}>Edit</button>
      <button onClick={() => onDone(todo, !todo.done)}>
        {!todo.done ? "Mark as completed" : "Completed"}
      </button>
    </div>
  </div>
);

export default Todo;
