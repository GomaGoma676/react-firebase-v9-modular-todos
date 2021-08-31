import React, { useState } from "react";
import styles from "./TaskItem.module.css";
import { ListItem, TextField, Grid } from "@material-ui/core";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { db } from "./firebase";
//Firebase ver9 compliant (modular)
import { doc, collection, setDoc, deleteDoc } from "firebase/firestore";

interface PROPS {
  id: string;
  title: string;
}

const TaskItem: React.FC<PROPS> = (props) => {
  const [title, setTitle] = useState(props.title);
  //Firebase ver9 compliant (modular)
  const tasksRef = collection(db, "tasks");
  const editTask = async () => {
    //Firebase ver9 compliant (modular)
    await setDoc(
      doc(tasksRef, props.id),
      {
        title: title,
      },
      { merge: true }
    );
  };

  const deleteTask = async () => {
    //Firebase ver9 compliant (modular)
    await deleteDoc(doc(tasksRef, props.id));
  };

  return (
    <ListItem>
      <h2>{props.title}</h2>
      <Grid container justifyContent="flex-end">
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label="Edit task"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
        />
      </Grid>
      <button className={styles.taskitem__icon} onClick={editTask}>
        <EditOutlinedIcon />
      </button>
      <button className={styles.taskitem__icon} onClick={deleteTask}>
        <DeleteOutlineOutlinedIcon />
      </button>
    </ListItem>
  );
};

export default TaskItem;
